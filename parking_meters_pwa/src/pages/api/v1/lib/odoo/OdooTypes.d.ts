export type Config = {
    host: string;
    port: number;
    database: string;
    username?: string;
    password?: string;
    sid?: string;
    protocol?: string;
  };
  
  export type Params = {
    domain?: Array<Array<string>>;
    ids: number[];
    fields: string[];
    offset?: number;
    limit?: number;
    order?: string;
    groupby?: string;
    lazy?: boolean;
  };
  
  export type XpcParams = {
    kwargs: {
      context: any;
      domain?: any;
      offset?: any;
      limit?: any;
      order?: any;
      fields?: any;
    };
    model: string;
    method: string;
    args: Array<any>;
  };
  export interface SearchParams {
    model: string;
    params: Params;
    context: any;
  }
  export interface CreateParams {
    model: string;
    params: Params;
    context: any;
  }
  export interface UpdateParams {
    model: string;
    ids: number[];
    params: Params;
    context: any;
  }
  export interface RemoveParams {
    model: string;
    ids: number[];
    context: any;
  }
  
  export interface GetParams {
    request?: Request;
    model: string;
    domain:Array<Array<string>>;
    defaultFields: string[];
    defaultOrder?: string;
    defaultLimit?: number;
    defaultOffset?: number;
  }
  
  export interface PostParams {
    request: Request;
    model: string;
  }
  
  export interface GetByIdParams {
    request: Request;
    model: string;
    id: number;
    fields: string[];
  }
  
  export interface PutParams {
    request: Request;
    model: string;
    id: number;
  }
  
  export interface DeleteParams {
    request: Request;
    model: string;
    id: number;
  }