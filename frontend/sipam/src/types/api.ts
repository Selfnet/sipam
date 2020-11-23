/* tslint:disable */
/* eslint-disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CIDR {
  id: string;
  cidr: string;
  created?: string;
  edited?: string;
  parent?: string | null;
  children?: string[];
  pool?: string | null;
  flag?: "reservation" | "assignment" | "host";
  fqdn?: string | null;
  description?: string | null;
  labels?: Record<string, string>;
}

export interface Label {
  name: string;
  value: string;
}

export interface TokenObtainPair {
  username: string;
  password: string;
}

export interface TokenRefresh {
  refresh: string;
}

export interface TokenVerify {
  token: string;
}

export interface Pool {
  id: string;
  label: string;
  description?: string;
  poolType?: "Host Linknet" | "VM Linknet" | "Arbitrary";
  defaultDomain?: string;
  prefixes?: CIDR[];
}

export interface Assignment {
  hostname?: string;

  /** Use pools default domain */
  useDefaultDomain?: boolean;
  description: string;

  /** Will not be evaluated on request but contain the assignments in the response */
  assignments?: CIDR[];
}

export interface Token {
  id?: string;
  key?: string;
  user?: string;
  write?: boolean;
  description?: string | null;
}

export type RequestParams = Omit<RequestInit, "body" | "method"> & {
  secure?: boolean;
};

export type RequestQueryParamsType = Record<string | number, any>;

type ApiConfig<SecurityDataType> = {
  baseUrl?: string;
  baseApiParams?: RequestParams;
  securityWorker?: (securityData: SecurityDataType) => RequestParams;
};

const enum BodyType {
  Json,
}

class HttpClient<SecurityDataType> {
  public baseUrl: string = "http://localhost:8000/api/v1";
  private securityData: SecurityDataType = null as any;
  private securityWorker: ApiConfig<SecurityDataType>["securityWorker"] = (() => {}) as any;

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor({ baseUrl, baseApiParams, securityWorker }: ApiConfig<SecurityDataType> = {}) {
    this.baseUrl = baseUrl || this.baseUrl;
    this.baseApiParams = baseApiParams || this.baseApiParams;
    this.securityWorker = securityWorker || this.securityWorker;
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: RequestQueryParamsType, key: string) {
    return (
      encodeURIComponent(key) + "=" + encodeURIComponent(Array.isArray(query[key]) ? query[key].join(",") : query[key])
    );
  }

  protected addQueryParams(rawQuery?: RequestQueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys.length
      ? `?${keys
          .map((key) =>
            typeof query[key] === "object" && !Array.isArray(query[key])
              ? this.addQueryParams(query[key] as object).substring(1)
              : this.addQueryParam(query, key),
          )
          .join("&")}`
      : "";
  }

  private bodyFormatters: Record<BodyType, (input: any) => any> = {
    [BodyType.Json]: JSON.stringify,
  };

  private mergeRequestOptions(params: RequestParams, securityParams?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params,
      ...(securityParams || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params.headers || {}),
        ...((securityParams && securityParams.headers) || {}),
      },
    };
  }

  private safeParseResponse = <T = any, E = any>(response: Response): Promise<T> =>
    response
      .json()
      .then((data) => data)
      .catch((e) => response.text);

  public request = <T = any, E = any>(
    path: string,
    method: string,
    { secure, ...params }: RequestParams = {},
    body?: any,
    bodyType?: BodyType,
    secureByDefault?: boolean,
  ): Promise<T> =>
    fetch(`${this.baseUrl}${path}`, {
      // @ts-ignore
      ...this.mergeRequestOptions(params, (secureByDefault || secure) && this.securityWorker(this.securityData)),
      method,
      body: body ? this.bodyFormatters[bodyType || BodyType.Json](body) : null,
    }).then(async (response) => {
      const data = await this.safeParseResponse<T, E>(response);
      if (!response.ok) throw data;
      return data;
    });
}

/**
 * @title SIPAM API
 * @version v1
 * @baseUrl http://localhost:8000/api/v1
 * Selfnet e.V. IP Address Management API
 */
export class Api<SecurityDataType = any> extends HttpClient<SecurityDataType> {
  cidr = {
    /**
     * @tags cidr
     * @name cidr_list
     * @request GET:/cidr/
     * @description Get the Root Prefixes with their children
     */
    cidrList: (query?: { search?: string }, params?: RequestParams) =>
      this.request<CIDR[], any>(`/cidr/${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags cidr
     * @name cidr_create
     * @request POST:/cidr/
     * @description Create a new cidr object by automatically detecting parents
     */
    cidrCreate: (data: CIDR, params?: RequestParams) => this.request<CIDR, any>(`/cidr/`, "POST", params, data),

    /**
     * @tags cidr
     * @name cidr_labels_list
     * @request GET:/cidr/{cidr_pk}/labels/
     * @description Get labels as key-value pair
     */
    cidrLabelsList: (cidr_pk: string, params?: RequestParams) =>
      this.request<Label[], any>(`/cidr/${cidr_pk}/labels/`, "GET", params),

    /**
     * @tags cidr
     * @name cidr_labels_create
     * @request POST:/cidr/{cidr_pk}/labels/
     * @description API endpoint that allows Labels to be added and removed from a network.
     */
    cidrLabelsCreate: (cidr_pk: string, data: Label, params?: RequestParams) =>
      this.request<Label, any>(`/cidr/${cidr_pk}/labels/`, "POST", params, data),

    /**
     * @tags cidr
     * @name cidr_labels_read
     * @request GET:/cidr/{cidr_pk}/labels/{id}/
     * @description API endpoint that allows Labels to be added and removed from a network.
     */
    cidrLabelsRead: (cidr_pk: string, id: string, params?: RequestParams) =>
      this.request<Label, any>(`/cidr/${cidr_pk}/labels/${id}/`, "GET", params),

    /**
     * @tags cidr
     * @name cidr_labels_update
     * @request PUT:/cidr/{cidr_pk}/labels/{id}/
     * @description Updates a given label
     */
    cidrLabelsUpdate: (cidr_pk: string, id: string, data: Label, params?: RequestParams) =>
      this.request<Label, any>(`/cidr/${cidr_pk}/labels/${id}/`, "PUT", params, data),

    /**
     * @tags cidr
     * @name cidr_labels_partial_update
     * @request PATCH:/cidr/{cidr_pk}/labels/{id}/
     * @description API endpoint that allows Labels to be added and removed from a network.
     */
    cidrLabelsPartialUpdate: (cidr_pk: string, id: string, data: Label, params?: RequestParams) =>
      this.request<Label, any>(`/cidr/${cidr_pk}/labels/${id}/`, "PATCH", params, data),

    /**
     * @tags cidr
     * @name cidr_labels_delete
     * @request DELETE:/cidr/{cidr_pk}/labels/{id}/
     * @description Delete this label
     */
    cidrLabelsDelete: (cidr_pk: string, id: string, params?: RequestParams) =>
      this.request<any, any>(`/cidr/${cidr_pk}/labels/${id}/`, "DELETE", params),

    /**
     * @tags cidr
     * @name cidr_read
     * @request GET:/cidr/{id}/
     * @description API endpoint that allows Prefixes to be viewed or edited.
     */
    cidrRead: (id: string, params?: RequestParams) => this.request<CIDR, any>(`/cidr/${id}/`, "GET", params),

    /**
     * @tags cidr
     * @name cidr_update
     * @request PUT:/cidr/{id}/
     * @description API endpoint that allows Prefixes to be viewed or edited.
     */
    cidrUpdate: (id: string, data: CIDR, params?: RequestParams) =>
      this.request<CIDR, any>(`/cidr/${id}/`, "PUT", params, data),

    /**
     * @tags cidr
     * @name cidr_partial_update
     * @request PATCH:/cidr/{id}/
     * @description API endpoint that allows Prefixes to be viewed or edited.
     */
    cidrPartialUpdate: (id: string, data: CIDR, params?: RequestParams) =>
      this.request<CIDR, any>(`/cidr/${id}/`, "PATCH", params, data),

    /**
     * @tags cidr
     * @name cidr_delete
     * @request DELETE:/cidr/{id}/
     * @description API endpoint that allows Prefixes to be viewed or edited.
     */
    cidrDelete: (id: string, params?: RequestParams) => this.request<any, any>(`/cidr/${id}/`, "DELETE", params),

    /**
     * @tags cidr
     * @name cidr_ips
     * @request GET:/cidr/{id}/ips/
     * @description API Endpoint that allows direct children ips to be viewed.
     */
    cidrIps: (id: string, params?: RequestParams) => this.request<CIDR, any>(`/cidr/${id}/ips/`, "GET", params),

    /**
     * @tags cidr
     * @name cidr_subcidr
     * @request GET:/cidr/{id}/subcidr/
     * @description API endpoint that allows direct subordinary cidr (networks) to be viewed.
     */
    cidrSubcidr: (id: string, params?: RequestParams) => this.request<CIDR, any>(`/cidr/${id}/subcidr/`, "GET", params),

    /**
     * @tags cidr
     * @name cidr_supercidr
     * @request GET:/cidr/{id}/supercidr/
     * @description API endpoint that allows direct super cidr (network) to be viewed.
     */
    cidrSupercidr: (id: string, params?: RequestParams) =>
      this.request<CIDR, any>(`/cidr/${id}/supercidr/`, "GET", params),
  };
  jwt = {
    /**
     * @tags jwt
     * @name jwt_create
     * @request POST:/jwt/
     * @description Takes a set of user credentials and returns an access and refresh JSON web token pair to prove the authentication of those credentials.
     */
    jwtCreate: (data: TokenObtainPair, params?: RequestParams) =>
      this.request<TokenObtainPair, any>(`/jwt/`, "POST", params, data),

    /**
     * @tags jwt
     * @name jwt_refresh_create
     * @request POST:/jwt/refresh/
     * @description Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
     */
    jwtRefreshCreate: (data: TokenRefresh, params?: RequestParams) =>
      this.request<TokenRefresh, any>(`/jwt/refresh/`, "POST", params, data),

    /**
     * @tags jwt
     * @name jwt_verify_create
     * @request POST:/jwt/verify/
     * @description Takes a token and indicates if it is valid.  This view provides no information about a token's fitness for a particular use.
     */
    jwtVerifyCreate: (data: TokenVerify, params?: RequestParams) =>
      this.request<TokenVerify, any>(`/jwt/verify/`, "POST", params, data),
  };
  pool = {
    /**
     * @tags pool
     * @name pool_list
     * @request GET:/pool/
     * @description List all pools
     */
    poolList: (params?: RequestParams) => this.request<Pool[], any>(`/pool/`, "GET", params),

    /**
     * @tags pool
     * @name pool_create
     * @request POST:/pool/
     * @description API endpoint that allows Pools to be viewed or edited.
     */
    poolCreate: (data: Pool, params?: RequestParams) => this.request<Pool, any>(`/pool/`, "POST", params, data),

    /**
     * @tags pool
     * @name pool_read
     * @request GET:/pool/{id}/
     * @description API endpoint that allows Pools to be viewed or edited.
     */
    poolRead: (id: string, params?: RequestParams) => this.request<Pool, any>(`/pool/${id}/`, "GET", params),

    /**
     * @tags pool
     * @name pool_update
     * @request PUT:/pool/{id}/
     * @description API endpoint that allows Pools to be viewed or edited.
     */
    poolUpdate: (id: string, data: Pool, params?: RequestParams) =>
      this.request<Pool, any>(`/pool/${id}/`, "PUT", params, data),

    /**
     * @tags pool
     * @name pool_partial_update
     * @request PATCH:/pool/{id}/
     * @description API endpoint that allows Pools to be viewed or edited.
     */
    poolPartialUpdate: (id: string, data: Pool, params?: RequestParams) =>
      this.request<Pool, any>(`/pool/${id}/`, "PATCH", params, data),

    /**
     * @tags pool
     * @name pool_delete
     * @request DELETE:/pool/{id}/
     * @description API endpoint that allows Pools to be viewed or edited.
     */
    poolDelete: (id: string, params?: RequestParams) => this.request<any, any>(`/pool/${id}/`, "DELETE", params),

    /**
     * @tags pool
     * @name pool_assign_create
     * @request POST:/pool/{id}/assign/
     * @description Adds a new address within the pool
     */
    poolAssignCreate: (id: string, data: Assignment, params?: RequestParams) =>
      this.request<Assignment, any>(`/pool/${id}/assign/`, "POST", params, data),

    /**
     * @tags pool
     * @name pool_assign_delete
     * @request DELETE:/pool/{id}/assign/
     * @description Deletes an assigned address
     */
    poolAssignDelete: (id: string, params?: RequestParams) =>
      this.request<any, any>(`/pool/${id}/assign/`, "DELETE", params),
  };
  token = {
    /**
     * @tags token
     * @name token_list
     * @request GET:/token/
     * @description Get own tokens or all tokens if admin
     */
    tokenList: (query?: { search?: string }, params?: RequestParams) =>
      this.request<Token[], any>(`/token/${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags token
     * @name token_create
     * @request POST:/token/
     * @description Create a new authtoken for this user.
     */
    tokenCreate: (data: Token, params?: RequestParams) => this.request<Token, any>(`/token/`, "POST", params, data),

    /**
     * @tags token
     * @name token_update
     * @request PUT:/token/{id}/
     * @description Update Description oder Write Flag
     */
    tokenUpdate: (id: string, data: Token, params?: RequestParams) =>
      this.request<Token, any>(`/token/${id}/`, "PUT", params, data),

    /**
     * @tags token
     * @name token_partial_update
     * @request PATCH:/token/{id}/
     * @description API endpoint that allows tokens to be manged by a user or staffer.
     */
    tokenPartialUpdate: (id: string, data: Token, params?: RequestParams) =>
      this.request<Token, any>(`/token/${id}/`, "PATCH", params, data),

    /**
     * @tags token
     * @name token_delete
     * @request DELETE:/token/{id}/
     * @description Delete a token
     */
    tokenDelete: (id: string, params?: RequestParams) => this.request<any, any>(`/token/${id}/`, "DELETE", params),
  };
}
