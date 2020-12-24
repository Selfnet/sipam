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
  id?: string;
  cidr: string;
  parent?: string;
  children?: string[];
  created?: string;
  edited?: string;
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
  assignments?: CIDR[];
}

export interface Token {
  key?: string;
  user?: string;
  write?: boolean;
  description?: string | null;
}

export type RequestParams = Omit<RequestInit, "body" | "method"> & {
  secure?: boolean;
};

export type RequestQueryParamsType = Record<string | number, any>;

interface ApiConfig<SecurityDataType> {
  baseUrl?: string;
  baseApiParams?: RequestParams;
  securityWorker?: (securityData: SecurityDataType) => RequestParams;
}

/** Overrided Promise type. Needs for additional typings of `.catch` callback */
type TPromise<ResolveType, RejectType = any> = Omit<Promise<ResolveType>, "then" | "catch"> & {
  then<TResult1 = ResolveType, TResult2 = never>(
    onfulfilled?: ((value: ResolveType) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: RejectType) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): TPromise<TResult1 | TResult2, RejectType>;
  catch<TResult = never>(
    onrejected?: ((reason: RejectType) => TResult | PromiseLike<TResult>) | undefined | null,
  ): TPromise<ResolveType | TResult, RejectType>;
};

interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D | null;
  error: E | null;
}

enum BodyType {
  Json,
}

class HttpClient<SecurityDataType> {
  public baseUrl: string = "http://localhost:8000/api/v1";
  private securityData: SecurityDataType = null as any;
  private securityWorker: null | ApiConfig<SecurityDataType>["securityWorker"] = null;

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType) => {
    console.log(data)
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

  private safeParseResponse = <T = any, E = any>(response: Response): Promise<HttpResponse<T, E>> => {
    const r = response as HttpResponse<T, E>;
    r.data = null;
    r.error = null;

    return response
      .json()
      .then((data) => {
        if (r.ok) {
          r.data = data;
        } else {
          r.error = data;
        }
        return r;
      })
      .catch((e) => {
        r.error = e;
        return r;
      });
  };

  public request = <T = any, E = any>(
    path: string,
    method: string,
    { secure, ...params }: RequestParams = {},
    body?: any,
    bodyType?: BodyType,
    secureByDefault?: boolean,
  ): TPromise<HttpResponse<T, E>> => {
    const requestUrl = `${this.baseUrl}${path}`;
    const secureOptions =
      (secureByDefault || secure) && this.securityWorker ? this.securityWorker(this.securityData) : {};
    const requestOptions = {
      ...this.mergeRequestOptions(params, secureOptions),
      method,
      body: body ? this.bodyFormatters[bodyType || BodyType.Json](body) : null,
    };

    return fetch(requestUrl, requestOptions).then(async (response) => {
      const data = await this.safeParseResponse<T, E>(response);
      if (!response.ok) throw data;
      return data;
    });
  };
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
     * @secure
     * @description Get the Root Prefixes with their children
     * @response `200` `(CIDR)[]`
     */
    cidrList: (query?: { search?: string }, params?: RequestParams) =>
      this.request<CIDR[], any>(`/cidr/${this.addQueryParams(query)}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_create
     * @request POST:/cidr/
     * @secure
     * @description Create a new cidr object by automatically detecting parents
     * @response `201` `CIDR`
     */
    cidrCreate: (data: CIDR, params?: RequestParams) =>
      this.request<CIDR, any>(`/cidr/`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_labels_list
     * @request GET:/cidr/{cidr_pk}/labels/
     * @secure
     * @description Get labels as key-value pair
     * @response `200` `(Label)[]`
     */
    cidrLabelsList: (cidr_pk: string, params?: RequestParams) =>
      this.request<Label[], any>(`/cidr/${cidr_pk}/labels/`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_labels_create
     * @request POST:/cidr/{cidr_pk}/labels/
     * @secure
     * @description API endpoint that allows Labels to be added and removed from a network.
     * @response `201` `Label`
     */
    cidrLabelsCreate: (cidr_pk: string, data: Label, params?: RequestParams) =>
      this.request<Label, any>(`/cidr/${cidr_pk}/labels/`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_labels_read
     * @request GET:/cidr/{cidr_pk}/labels/{id}/
     * @secure
     * @description API endpoint that allows Labels to be added and removed from a network.
     * @response `200` `Label`
     */
    cidrLabelsRead: (cidr_pk: string, id: string, params?: RequestParams) =>
      this.request<Label, any>(`/cidr/${cidr_pk}/labels/${id}/`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_labels_update
     * @request PUT:/cidr/{cidr_pk}/labels/{id}/
     * @secure
     * @description Updates a given label
     * @response `200` `Label`
     */
    cidrLabelsUpdate: (cidr_pk: string, id: string, data: Label, params?: RequestParams) =>
      this.request<Label, any>(`/cidr/${cidr_pk}/labels/${id}/`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_labels_partial_update
     * @request PATCH:/cidr/{cidr_pk}/labels/{id}/
     * @secure
     * @description API endpoint that allows Labels to be added and removed from a network.
     * @response `200` `Label`
     */
    cidrLabelsPartialUpdate: (cidr_pk: string, id: string, data: Label, params?: RequestParams) =>
      this.request<Label, any>(`/cidr/${cidr_pk}/labels/${id}/`, "PATCH", params, data, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_labels_delete
     * @request DELETE:/cidr/{cidr_pk}/labels/{id}/
     * @secure
     * @description Delete this label
     * @response `204` `any`
     */
    cidrLabelsDelete: (cidr_pk: string, id: string, params?: RequestParams) =>
      this.request<any, any>(`/cidr/${cidr_pk}/labels/${id}/`, "DELETE", params, null, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_read
     * @request GET:/cidr/{id}/
     * @secure
     * @description API endpoint that allows Prefixes to be viewed or edited.
     * @response `200` `CIDR`
     */
    cidrRead: (id: string, params?: RequestParams) =>
      this.request<CIDR, any>(`/cidr/${id}/`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_update
     * @request PUT:/cidr/{id}/
     * @secure
     * @description API endpoint that allows Prefixes to be viewed or edited.
     * @response `200` `CIDR`
     */
    cidrUpdate: (id: string, data: CIDR, params?: RequestParams) =>
      this.request<CIDR, any>(`/cidr/${id}/`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_partial_update
     * @request PATCH:/cidr/{id}/
     * @secure
     * @description API endpoint that allows Prefixes to be viewed or edited.
     * @response `200` `CIDR`
     */
    cidrPartialUpdate: (id: string, data: CIDR, params?: RequestParams) =>
      this.request<CIDR, any>(`/cidr/${id}/`, "PATCH", params, data, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_delete
     * @request DELETE:/cidr/{id}/
     * @secure
     * @description API endpoint that allows Prefixes to be viewed or edited.
     * @response `204` `any`
     */
    cidrDelete: (id: string, params?: RequestParams) =>
      this.request<any, any>(`/cidr/${id}/`, "DELETE", params, null, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_ips
     * @request GET:/cidr/{id}/ips/
     * @secure
     * @description API Endpoint that allows direct children ips to be viewed.
     * @response `200` `CIDR`
     */
    cidrIps: (id: string, params?: RequestParams) =>
      this.request<CIDR, any>(`/cidr/${id}/ips/`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_subcidr
     * @request GET:/cidr/{id}/subcidr/
     * @secure
     * @description API endpoint that allows direct subordinary cidr (networks) to be viewed.
     * @response `200` `CIDR`
     */
    cidrSubcidr: (id: string, params?: RequestParams) =>
      this.request<CIDR, any>(`/cidr/${id}/subcidr/`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags cidr
     * @name cidr_supercidr
     * @request GET:/cidr/{id}/supercidr/
     * @secure
     * @description API endpoint that allows direct super cidr (network) to be viewed.
     * @response `200` `CIDR`
     */
    cidrSupercidr: (id: string, params?: RequestParams) =>
      this.request<CIDR, any>(`/cidr/${id}/supercidr/`, "GET", params, null, BodyType.Json, true),
  };
  jwt = {
    /**
     * @tags jwt
     * @name jwt_create
     * @request POST:/jwt/
     * @secure
     * @response `200` `{ refresh: string, access: string }`
     */
    jwtCreate: (data: TokenObtainPair, params?: RequestParams) =>
      this.request<{ refresh: string; access: string }, any>(`/jwt/`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags jwt
     * @name jwt_refresh_create
     * @request POST:/jwt/refresh/
     * @secure
     * @response `200` `{ access: string }`
     */
    jwtRefreshCreate: (data: TokenRefresh, params?: RequestParams) =>
      this.request<{ access: string }, any>(`/jwt/refresh/`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags jwt
     * @name jwt_verify_create
     * @request POST:/jwt/verify/
     * @secure
     * @response `200` `object`
     */
    jwtVerifyCreate: (data: TokenVerify, params?: RequestParams) =>
      this.request<object, any>(`/jwt/verify/`, "POST", params, data, BodyType.Json, true),
  };
  pool = {
    /**
     * @tags pool
     * @name pool_list
     * @request GET:/pool/
     * @secure
     * @description List all pools
     * @response `200` `(Pool)[]`
     */
    poolList: (params?: RequestParams) => this.request<Pool[], any>(`/pool/`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags pool
     * @name pool_create
     * @request POST:/pool/
     * @secure
     * @description API endpoint that allows Pools to be viewed or edited.
     * @response `201` `Pool`
     */
    poolCreate: (data: Pool, params?: RequestParams) =>
      this.request<Pool, any>(`/pool/`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags pool
     * @name pool_read
     * @request GET:/pool/{id}/
     * @secure
     * @description API endpoint that allows Pools to be viewed or edited.
     * @response `200` `Pool`
     */
    poolRead: (id: string, params?: RequestParams) =>
      this.request<Pool, any>(`/pool/${id}/`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags pool
     * @name pool_update
     * @request PUT:/pool/{id}/
     * @secure
     * @description API endpoint that allows Pools to be viewed or edited.
     * @response `200` `Pool`
     */
    poolUpdate: (id: string, data: Pool, params?: RequestParams) =>
      this.request<Pool, any>(`/pool/${id}/`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags pool
     * @name pool_partial_update
     * @request PATCH:/pool/{id}/
     * @secure
     * @description API endpoint that allows Pools to be viewed or edited.
     * @response `200` `Pool`
     */
    poolPartialUpdate: (id: string, data: Pool, params?: RequestParams) =>
      this.request<Pool, any>(`/pool/${id}/`, "PATCH", params, data, BodyType.Json, true),

    /**
     * @tags pool
     * @name pool_delete
     * @request DELETE:/pool/{id}/
     * @secure
     * @description API endpoint that allows Pools to be viewed or edited.
     * @response `204` `any`
     */
    poolDelete: (id: string, params?: RequestParams) =>
      this.request<any, any>(`/pool/${id}/`, "DELETE", params, null, BodyType.Json, true),

    /**
     * @tags pool
     * @name pool_assign_create
     * @request POST:/pool/{id}/assign/
     * @secure
     * @description Adds a new address within the pool
     * @response `201` `Assignment`
     */
    poolAssignCreate: (id: string, data: Assignment, params?: RequestParams) =>
      this.request<Assignment, any>(`/pool/${id}/assign/`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags pool
     * @name pool_assign_delete
     * @request DELETE:/pool/{id}/assign/
     * @secure
     * @description Deletes an assigned address
     * @response `204` `any`
     */
    poolAssignDelete: (id: string, params?: RequestParams) =>
      this.request<any, any>(`/pool/${id}/assign/`, "DELETE", params, null, BodyType.Json, true),
  };
  token = {
    /**
     * @tags token
     * @name token_list
     * @request GET:/token/
     * @secure
     * @description Get own tokens or all tokens if admin
     * @response `200` `(Token)[]`
     */
    tokenList: (query?: { search?: string }, params?: RequestParams) =>
      this.request<Token[], any>(`/token/${this.addQueryParams(query)}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags token
     * @name token_create
     * @request POST:/token/
     * @secure
     * @description Create a new authtoken for this user.
     * @response `201` `Token`
     */
    tokenCreate: (data: Token, params?: RequestParams) =>
      this.request<Token, any>(`/token/`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags token
     * @name token_update
     * @request PUT:/token/{key}/
     * @secure
     * @description Update Description oder Write Flag
     * @response `200` `Token`
     */
    tokenUpdate: (key: string, data: Token, params?: RequestParams) =>
      this.request<Token, any>(`/token/${key}/`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags token
     * @name token_partial_update
     * @request PATCH:/token/{key}/
     * @secure
     * @description API endpoint that allows tokens to be manged by a user or staffer.
     * @response `200` `Token`
     */
    tokenPartialUpdate: (key: string, data: Token, params?: RequestParams) =>
      this.request<Token, any>(`/token/${key}/`, "PATCH", params, data, BodyType.Json, true),

    /**
     * @tags token
     * @name token_delete
     * @request DELETE:/token/{key}/
     * @secure
     * @description Delete a token
     * @response `204` `any`
     */
    tokenDelete: (key: string, params?: RequestParams) =>
      this.request<any, any>(`/token/${key}/`, "DELETE", params, null, BodyType.Json, true),
  };
}
