"use strict";

import { config as dotenvConfig } from "dotenv";
import type { OdooEnvConfig,  OdooConfig,  Params,  XpcParams } from "./odooTypes";
import {validateEnvironmentVariables} from "./util";

dotenvConfig();
const requiredOdooEnv: OdooEnvConfig = {
  ODDO_HOST: process.env.ODDO_HOST!,
  ODDO_PORT: process.env.ODDO_PORT!,
  ODDO_DATABASE: process.env.ODDO_DATABASE!,
  ODDO_USERNAME: process.env.ODDO_USERNAME,
  ODDO_PASSWORD: process.env.ODDO_PASSWORD,
  ODDO_PROTOCOL: process.env.ODDO_PROTOCOL,
};
 

validateEnvironmentVariables<typeof requiredOdooEnv>(requiredOdooEnv);

export const odooConnectionConfig: OdooConfig = {
  host: requiredOdooEnv.ODDO_HOST,
  port: Number(requiredOdooEnv.ODDO_PORT),
  database: requiredOdooEnv.ODDO_DATABASE,
  username: requiredOdooEnv.ODDO_USERNAME,
  password: requiredOdooEnv.ODDO_PASSWORD,
  protocol: requiredOdooEnv.ODDO_PROTOCOL,
};
 
class Odoo {
  private static instance: Odoo;
  private config: OdooConfig;
  private authToken: string | undefined;
  private cookie: string | null = null;
  private uid: string | null = null;
  private session_id: string | null | undefined = null;
  private context: string | null = null;
  private useCookie: boolean = true;

  private constructor() {
    this.config=odooConnectionConfig;
  }

  public static getInstance(): Odoo {
    if (!Odoo.instance) {
      Odoo.instance = new Odoo();
    }
    return Odoo.instance;
  }

  public setToken(token?: string): void {
    this.authToken = token;
    this.useCookie = token === undefined;
  }

  public connect=(): Promise<{ success: boolean; data?: any; error?: any }>=> {
    const { host, port, database, username, password, protocol } = this.config;
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
    

    return fetch(url, options)
      .then((response) => {
        if (this.useCookie) {
          this.session_id = response.headers.get("set-cookie")?.split(";")[0].split("=")[1];
          this.cookie = response.headers.get("set-cookie");
        } else {
          this.session_id = null;
          this.cookie = null;
        }
        return response.json();
      })
      .then((responseJson) => {

        if (responseJson.error) {
          return { success: false, error: responseJson.error };
        } else {
          this.uid = responseJson.result.uid;
          this.session_id = responseJson.result.session_id;
          this.context = responseJson.result.user_context;
          this.config.username = responseJson.result.username || this.config.username;
          return { success: true, data: responseJson.result };
        }
      })
      .catch((error) => {
        return { success: false, error: error };
      });
  }

  public search(model: string, params: Params, context: any): Promise<{ success: boolean; data?: any; error?: any }> {
    return this._request("/web/dataset/call_kw", {
      kwargs: {
        context: { ...context },
      },
      model: model,
      method: "search",
      args: [params.domain],
    });
  }

  public search_read(model: string, params: Params, context: any): Promise<{ success: boolean; data?: any; error?: any }> {
    return this._request("/web/dataset/call_kw", {
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
  }

  public create(model: string, params: Params, context: any): Promise<{ success: boolean; data?: any; error?: any }> {
    return this._request("/web/dataset/call_kw", {
      kwargs: {
        context: { ...context },
      },
      model: model,
      method: "create",
      args: [params],
    });
  }

  public update(model: string, ids: number[], params: Params, context: any): Promise<{ success: boolean; data?: any; error?: any }> {
    if (ids) {
      return this._request("/web/dataset/call_kw", {
        kwargs: {
          context: { ...context },
        },
        model: model,
        method: "write",
        args: [ids, params],
      });
    } else {
      return Promise.resolve({ success: false, error: "IDs not provided" });
    }
  }

  public delete(model: string, ids: number[], context: any): Promise<{ success: boolean; data?: any; error?: any }> {
    if (ids) {
      return this._request("/web/dataset/call_kw", {
        kwargs: {
          context: { ...context },
        },
        model: model,
        method: "unlink",
        args: [ids],
      });
    } else {
      return Promise.resolve({ success: false, error: "IDs not provided" });
    }
  }

  public rpc_call(endpoint: string, params: XpcParams): Promise<{ success: boolean; data?: any; error?: any }> {
    return this._request(endpoint, params);
  }

  private _request(path: string, params: XpcParams): Promise<{ success: boolean; data?: any; error?: any }> {
    const { host, port, protocol } = this.config;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    if (this.cookie) {
      headers.append("Cookie", this.cookie);
    }
    if (this.authToken) {
      headers.append("X-Auth-Token", this.authToken);
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

    return fetch(url, options)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) {
          return { success: false, error: responseJson.error };
        } else {
          return { success: true, data: responseJson.result };
        }
      })
      .catch((error) => {
        return { success: false, error: error };
      });
  }
}

export default Odoo;
