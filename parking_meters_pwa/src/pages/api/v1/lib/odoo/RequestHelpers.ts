import { NextResponse } from "next/server";
import Actions from "./Actions";
import { DeleteParams, GetByIdParams, GetParams, PostParams, PutParams } from "./OdooTypes";

export async function handleGetRequest({ request, model, defaultFields, domain, defaultOrder = "name ASC", defaultLimit = 6, defaultOffset = 0 }: GetParams) {
  try {

    const { connect, search_read } = Actions;
    const connectResponse = await connect();

    if (!connectResponse.success) {
      throw new Error(connectResponse.error || "Failed to connect to Odoo");
    }

    const searchParamsObj = {
      model: model,
      params: {
        ids: [],
        domain: domain,
        offset: defaultOffset,
        limit: defaultLimit,
        order: defaultOrder,
        fields: defaultFields,
      },
      context: {},
    };

    const response = await search_read(searchParamsObj);
 
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch data from Odoo");
    }
    return NextResponse.json({ success: true, data: response.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function handlePostRequest({ request, model }: PostParams) {
  try {
    const body = await request.json();

    const connectResponse = await Actions.connect();
    if (!connectResponse.success) {
      throw new Error(connectResponse.error || "Failed to connect to Odoo");
    }

    const createParams = {
      model: model,
      params: body,
      context: {},
    };

    const response = await Actions.create(createParams);

    if (!response.success) {
      throw new Error(response.error || "Failed to create data in Odoo");
    }
    return NextResponse.json({ success: true, data: response.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function handleGetByIdRequest({ request, model, id, fields }: GetByIdParams) {
  try {
    const connectResponse = await Actions.connect();
    if (!connectResponse.success) {
      throw new Error(connectResponse.error || "Failed to connect to Odoo");
    }

    const readParams = {
      model: model,
      params: {
        ids: [id],
        fields: fields,
      },
      context: {},
    };

    const response = await Actions.search_read(readParams);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch data from Odoo");
    }
    return NextResponse.json({ success: true, data: response.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function handlePutRequest({ request, model, id }: PutParams) {
  try {
    const body = await request.json();

    const connectResponse = await Actions.connect();
    if (!connectResponse.success) {
      throw new Error(connectResponse.error || "Failed to connect to Odoo");
    }

    const updateParams = {
      model: model,
      ids: [id],
      params: body,
      context: {},
    };

    const response = await Actions.update(updateParams);

    if (!response.success) {
      throw new Error(response.error || "Failed to update data in Odoo");
    }
    return NextResponse.json({ success: true, data: response.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function handleDeleteRequest({ model, id }: DeleteParams) {
  try {
    const connectResponse = await Actions.connect();
    if (!connectResponse.success) {
      throw new Error(connectResponse.error || "Failed to connect to Odoo");
    }

    const deleteParams = {
      model: model,
      ids: [id],
      context: {},
    };

    const response = await Actions.remove(deleteParams);

    if (!response.success) {
      throw new Error(response.error || "Failed to delete data in Odoo");
    }
    return NextResponse.json({ success: true, data: response.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function handleLoginRequest({ request }: { request: Request }) {
  try {
    const { username, password } = await request.json();

    const loginResponse = await Actions.login(username, password);
    if (!loginResponse.success) {
      throw new Error(loginResponse.error || "Failed to login to Odoo");
    }

    return NextResponse.json({ success: true, data: loginResponse.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function handleLogoutRequest() {
  try {
    const logoutResponse = await Actions.logout();
    if (!logoutResponse.success) {
      throw new Error(logoutResponse.error || "Failed to logout from Odoo");
    }

    return NextResponse.json({ success: true, data: logoutResponse.data }, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message;

    if (errorMessage.includes("Session expired")) {
      return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 });
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function handleModelMethodRequest({ model, method, args, kwargs }: { model: string, method: string, args: any, kwargs: any }) {
  try {
    const connectResponse = await Actions.connect();
    if (!connectResponse.success) {
      console.log("Error:", JSON.stringify(connectResponse));
      throw new Error(connectResponse.error || "Failed to connect to Odoo");
    }

    const response = await Actions.rpc_call(model, method, args, kwargs);

    if (!response.success) {
      throw new Error(response.error || "Failed to call method on Odoo model");
    }
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
