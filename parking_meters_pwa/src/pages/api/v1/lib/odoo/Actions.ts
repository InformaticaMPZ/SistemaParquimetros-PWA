"use strict";

import { Config, CreateParams, RemoveParams, SearchParams, UpdateParams, XpcParams } from "./OdooTypes";

let config: Config = {
  host: process.env.ODDO_HOST || "",
  port: parseInt(process.env.ODOO_PORT || "8069", 10),
  database: process.env.ODOO_DATABASE || "",
  username: process.env.ODOO_USERNAME || "",
  password: process.env.ODOO_PASSWORD || "",
  protocol: process.env.ODOO_PROTOCOL || "https",
};

let authToken: string | undefined;
let cookie: string | null = null;
let uid: string | null = null;
let session_id: string | null | undefined = null;
let context: string | null = null;
let useCookie: boolean = true;

const setConfig = (newConfig: Config): void => {
  config = newConfig || {};
};

const setToken = (token?: string): void => {
  authToken = token;
  useCookie = token === undefined;
};

const connect = async (): Promise<{ success: boolean; data?: any; error?: any }> => {
  const { host, port, database, username, password, protocol } = config;
  const params = {
    db: database,
    login: username,
    password: password,
  };

  const json = JSON.stringify({ params: params });
  const url = `${protocol || "https"}://${host}:${port}/web/session/authenticate`;
 
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Content-Length", json.length.toString());

  const options: RequestInit = {
    method: "POST",
    headers: headers,
    body: json,
    credentials: "omit",
  };

  try {
    const response = await fetch(url, options);
   
    if (useCookie) {
      session_id = response.headers.get("set-cookie")?.split(";")[0].split("=")[1];
      cookie = response.headers.get("set-cookie");
    } else {
      session_id = null;
      cookie = null;
    }

    const responseJson = await response.json();
    if (responseJson.error) {
      return { success: false, error: responseJson.error };
    } else {
      uid = responseJson.result.uid;
      session_id = responseJson.result.session_id;
      context = responseJson.result.user_context;
      config.username = responseJson.result.username || config.username;
      return { success: true, data: responseJson.result };
    }
  } catch (ex) {
    return { success: false, error: ex };
  }
};

const search = async ({ model, params, context }: SearchParams): Promise<{ success: boolean; data?: any; error?: any }> => {
  return _request("/web/dataset/call_kw", {
    kwargs: {
      context: { ...context },
    },
    model: model,
    method: "search",
    args: [params.domain],
  });
};

const search_read = async ({ model, params, context }: SearchParams): Promise<{ success: boolean; data?: any; error?: any }> => {
  return _request("/web/dataset/call_kw", {
    model: model,
    method: "search_read",
    args: [],
    kwargs: {
      context: { ...context },
      domain: params.domain,
      offset: params.offset,
      limit: params.limit,
      order: params.order,
      fields: params.fields,
    },
  });
};

const create = async ({ model, params, context }: CreateParams): Promise<{ success: boolean; data?: any; error?: any }> => {
  return _request("/web/dataset/call_kw", {
    kwargs: {
      context: { ...context },
    },
    model: model,
    method: "create",
    args: [params],
  });
};

const update = async ({ model, ids, params, context }: UpdateParams): Promise<{ success: boolean; data?: any; error?: any }> => {
  if (ids) {
    return _request("/web/dataset/call_kw", {
      kwargs: {
        context: { ...context },
      },
      model: model,
      method: "write",
      args: [ids, params],
    });
  } else {
    return { success: false, error: "IDs not provided" };
  }
};

const remove = async ({ model, ids, context }: RemoveParams): Promise<{ success: boolean; data?: any; error?: any }> => {
  if (ids) {
    return _request("/web/dataset/call_kw", {
      kwargs: {
        context: { ...context },
      },
      model: model,
      method: "unlink",
      args: [ids],
    });
  } else {
    return { success: false, error: "IDs not provided" };
  }
};

const rpc_call = async (model: string, method: string, args: any= {}, kwargs: any = {}): Promise<{ success: boolean; data?: any; error?: any }> => {
  return _request("/web/dataset/call_kw", {
    model: model,
    method: method,
    args: args,
    kwargs: kwargs,
  });
};


const _request = async (path: string, params: any, retry: boolean = true): Promise<{ success: boolean; data?: any; error?: any }> => {
  const { host, port, protocol } = config;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  if (cookie) {
    headers.append("Cookie", cookie);
  }
  if (authToken) {
    headers.append("X-Auth-Token", authToken);
  }

  const url = `${protocol || "https"}://${host}:${port}${path || "/"}`;
  const options: RequestInit = {
    method: "POST",
    headers: headers,
    credentials: "omit",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: new Date().getUTCMilliseconds(),
      method: "call",
      params: params,
    }),
  };

  try {
    const response = await fetch(url, options);
    const responseJson = await response.json();

    if (responseJson.error) {
      if (responseJson.error.message === "Session expired" && retry) {
        console.log("Session expired, re-authenticating...");
        await connect(); 
        return await _request(path, params, false);
      }
      return { success: false, error: responseJson.error };
    } else {
      return { success: true, data: responseJson.result };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
};

const login = async (username: string, password: string): Promise<{ success: boolean; data?: any; error?: any }> => {
  setConfig({
    ...config,
    username: username,
    password: password,
  });
  return await connect();
};
const logout = async (): Promise<{ success: boolean; data?: any; error?: any }> => {
  const { host, port, protocol } = config;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  if (cookie) {
    headers.append("Cookie", cookie);
  }
  if (authToken) {
    headers.append("X-Auth-Token", authToken);
  }

  const url = `${protocol || "https"}://${host}:${port}/web/session/destroy`;
  const options: RequestInit = {
    method: "POST",
    headers: headers,
    credentials: "omit",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: new Date().getUTCMilliseconds(),
      method: "call",
      params: {},
    }),
  };

  try {
    const response = await fetch(url, options);
    const responseJson = await response.json();

    if (responseJson.error) {
      return { success: false, error: responseJson.error };
    } else {
      authToken = undefined;
      cookie = null;
      uid = null;
      session_id = null;
      context = null;
      return { success: true, data: responseJson.result };
    }
  } catch (error) {
    return { success: false, error: error };
  }
};
const callOdooModelMethod = async (model: string, method: string, args: any[] = [], kwargs: any = {}): Promise<{ success: boolean; data?: any; error?: any }> => {
  return _request("/web/dataset/call_kw", {
    model: model,
    method: method,
    args: args,
    kwargs: kwargs,
  });
};
const Actions = {
  setConfig,
  setToken,
  connect,
  search,
  search_read,
  login,
  logout,
  create,
  update,
  remove,
  rpc_call,
  callOdooModelMethod
};

export default Actions;
