
export type OdooConfig = {
    host: string,
    port: number,
    database: string,
    username?: string,
    password?: string,
    sid?: string,
    protocol?: string,
  };
  
  export interface OdooEnvConfig {
    ODDO_HOST: string;
    ODDO_PORT: string;
    ODDO_DATABASE: string;
    ODDO_USERNAME?: string;
    ODDO_PASSWORD?: string;
    ODDO_PROTOCOL?: string;
  }
  
  export type Params = {
    domain?: Array<Array<string>>,
    ids: number[],
    fields: string[],
    offset?: number,
    limit?: number,
    order?: string,
    groupby?: string,
    lazy?: boolean,
  };
  
  export type XpcParams = {
    kwargs: {
      context: any,
      domain?: any,
      offset?: any,
      limit?: any,
      order?: any,
      fields?: any,
    },
    model: string,
    method: string,
    args: Array<any>,
  };