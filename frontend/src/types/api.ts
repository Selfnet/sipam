/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CIDR {
  /**
   * Id
   * @format uuid
   */
  id?: string;
  /** Cidr */
  cidr: string;
  /**
   * Parent
   * @format uuid
   */
  parent?: string | null;
  children?: string[];
  /**
   * Created
   * @format date-time
   */
  created?: string;
  /**
   * Edited
   * @format date-time
   */
  edited?: string;
  /** Pool */
  pool?: string | null;
  /** Flag */
  flag?: 'reservation' | 'assignment' | 'host';
  /**
   * Fqdn
   * @maxLength 200
   */
  fqdn?: string | null;
  /** Description */
  description?: string | null;
  /** Labels */
  labels?: Record<string, string>;
}

export interface Label {
  /**
   * Name
   * @minLength 1
   * @maxLength 30
   */
  name: string;
  /**
   * Value
   * @minLength 1
   * @maxLength 1000
   */
  value: string;
}

export interface TokenObtainPair {
  /**
   * Username
   * @minLength 1
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface TokenRefresh {
  /**
   * Refresh
   * @minLength 1
   */
  refresh: string;
  /**
   * Access
   * @minLength 1
   */
  access?: string;
}

export interface TokenVerify {
  /**
   * Token
   * @minLength 1
   */
  token: string;
}

export interface Pool {
  /**
   * Id
   * @minLength 1
   * @maxLength 10
   */
  id: string;
  /**
   * Label
   * @minLength 1
   * @maxLength 100
   */
  label: string;
  /** Description */
  description?: string;
  /** PoolType */
  poolType?: 'Host Linknet' | 'VM Linknet' | 'Arbitrary';
  /**
   * DefaultDomain
   * @maxLength 100
   */
  defaultDomain?: string;
  prefixes?: CIDR[];
}

export interface Assignment {
  /**
   * Hostname
   * @minLength 1
   */
  hostname?: string;
  /**
   * Usedefaultdomain
   * Use pools default domain
   * @default true
   */
  useDefaultDomain?: boolean;
  /**
   * Description
   * @minLength 1
   */
  description: string;
  assignments?: CIDR[];
}

export interface Token {
  /**
   * Key
   * @minLength 1
   */
  key?: string;
  /** User */
  user?: string;
  /** Write */
  write?: boolean;
  /** Description */
  description?: string | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = 'http://localhost:8000/api/v1';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
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

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title SIPAM API
 * @version v1
 * @license MIT License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api/v1
 * @contact <support@selfnet.de>
 *
 * Selfnet e.V. IP Address Management API
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  cidr = {
    /**
     * @description Get the Root Prefixes with their children.
     *
     * @tags cidr
     * @name CidrList
     * @request GET:/cidr/
     * @secure
     * @response `200` `(CIDR)[]`
     */
    cidrList: (
      query?: {
        /** A search term. */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CIDR[], any>({
        path: `/cidr/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Create a new cidr object by automatically detecting parents.
     *
     * @tags cidr
     * @name CidrCreate
     * @request POST:/cidr/
     * @secure
     * @response `201` `CIDR`
     */
    cidrCreate: (data: CIDR, params: RequestParams = {}) =>
      this.request<CIDR, any>({
        path: `/cidr/`,
        method: 'POST',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get labels as key-value pair.
     *
     * @tags cidr
     * @name CidrLabelsList
     * @request GET:/cidr/{cidr_pk}/labels/
     * @secure
     * @response `200` `(Label)[]`
     */
    cidrLabelsList: (cidrPk: string, params: RequestParams = {}) =>
      this.request<Label[], any>({
        path: `/cidr/${cidrPk}/labels/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Labels to be added and removed from a network.
     *
     * @tags cidr
     * @name CidrLabelsCreate
     * @request POST:/cidr/{cidr_pk}/labels/
     * @secure
     * @response `201` `Label`
     */
    cidrLabelsCreate: (cidrPk: string, data: Label, params: RequestParams = {}) =>
      this.request<Label, any>({
        path: `/cidr/${cidrPk}/labels/`,
        method: 'POST',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Labels to be added and removed from a network.
     *
     * @tags cidr
     * @name CidrLabelsRead
     * @request GET:/cidr/{cidr_pk}/labels/{id}/
     * @secure
     * @response `200` `Label`
     */
    cidrLabelsRead: (cidrPk: string, id: string, params: RequestParams = {}) =>
      this.request<Label, any>({
        path: `/cidr/${cidrPk}/labels/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Updates a given label.
     *
     * @tags cidr
     * @name CidrLabelsUpdate
     * @request PUT:/cidr/{cidr_pk}/labels/{id}/
     * @secure
     * @response `200` `Label`
     */
    cidrLabelsUpdate: (cidrPk: string, id: string, data: Label, params: RequestParams = {}) =>
      this.request<Label, any>({
        path: `/cidr/${cidrPk}/labels/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Labels to be added and removed from a network.
     *
     * @tags cidr
     * @name CidrLabelsPartialUpdate
     * @request PATCH:/cidr/{cidr_pk}/labels/{id}/
     * @secure
     * @response `200` `Label`
     */
    cidrLabelsPartialUpdate: (cidrPk: string, id: string, data: Label, params: RequestParams = {}) =>
      this.request<Label, any>({
        path: `/cidr/${cidrPk}/labels/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Delete this label.
     *
     * @tags cidr
     * @name CidrLabelsDelete
     * @request DELETE:/cidr/{cidr_pk}/labels/{id}/
     * @secure
     * @response `204` `void`
     */
    cidrLabelsDelete: (cidrPk: string, id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cidr/${cidrPk}/labels/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description API endpoint that allows Prefixes to be viewed or edited.
     *
     * @tags cidr
     * @name CidrRead
     * @request GET:/cidr/{id}/
     * @secure
     * @response `200` `CIDR`
     */
    cidrRead: (id: string, params: RequestParams = {}) =>
      this.request<CIDR, any>({
        path: `/cidr/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Prefixes to be viewed or edited.
     *
     * @tags cidr
     * @name CidrUpdate
     * @request PUT:/cidr/{id}/
     * @secure
     * @response `200` `CIDR`
     */
    cidrUpdate: (id: string, data: CIDR, params: RequestParams = {}) =>
      this.request<CIDR, any>({
        path: `/cidr/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Prefixes to be viewed or edited.
     *
     * @tags cidr
     * @name CidrPartialUpdate
     * @request PATCH:/cidr/{id}/
     * @secure
     * @response `200` `CIDR`
     */
    cidrPartialUpdate: (id: string, data: CIDR, params: RequestParams = {}) =>
      this.request<CIDR, any>({
        path: `/cidr/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Prefixes to be viewed or edited.
     *
     * @tags cidr
     * @name CidrDelete
     * @request DELETE:/cidr/{id}/
     * @secure
     * @response `204` `void`
     */
    cidrDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cidr/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description API Endpoint that allows direct children ips to be viewed.
     *
     * @tags cidr
     * @name CidrIps
     * @request GET:/cidr/{id}/ips/
     * @secure
     * @response `200` `(CIDR)[]`
     */
    cidrIps: (id: string, params: RequestParams = {}) =>
      this.request<CIDR[], any>({
        path: `/cidr/${id}/ips/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows direct subordinary cidr (networks) to be viewed.
     *
     * @tags cidr
     * @name CidrSubcidr
     * @request GET:/cidr/{id}/subcidr/
     * @secure
     * @response `200` `(CIDR)[]`
     */
    cidrSubcidr: (id: string, params: RequestParams = {}) =>
      this.request<CIDR[], any>({
        path: `/cidr/${id}/subcidr/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows direct super cidr (network) to be viewed.
     *
     * @tags cidr
     * @name CidrSupercidr
     * @request GET:/cidr/{id}/supercidr/
     * @secure
     * @response `200` `(CIDR)[]`
     */
    cidrSupercidr: (id: string, params: RequestParams = {}) =>
      this.request<CIDR[], any>({
        path: `/cidr/${id}/supercidr/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Prefixes to be viewed or edited.
     *
     * @tags cidr
     * @name CidrSupercidrs
     * @request GET:/cidr/{id}/supercidrs/
     * @secure
     * @response `200` `(CIDR)[]`
     */
    cidrSupercidrs: (id: string, params: RequestParams = {}) =>
      this.request<CIDR[], any>({
        path: `/cidr/${id}/supercidrs/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  jwt = {
    /**
 * No description
 *
 * @tags jwt
 * @name JwtCreate
 * @request POST:/jwt/
 * @secure
 * @response `200` `{
  \** Refresh token *\
    refresh: string,
  \** Access token *\
    access: string,

}`
 */
    jwtCreate: (data: TokenObtainPair, params: RequestParams = {}) =>
      this.request<
        {
          /** Refresh token */
          refresh: string;
          /** Access token */
          access: string;
        },
        any
      >({
        path: `/jwt/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * No description
 *
 * @tags jwt
 * @name JwtRefreshCreate
 * @request POST:/jwt/refresh/
 * @secure
 * @response `200` `{
  \** Access token *\
    access: string,

}`
 */
    jwtRefreshCreate: (data: TokenRefresh, params: RequestParams = {}) =>
      this.request<
        {
          /** Access token */
          access: string;
        },
        any
      >({
        path: `/jwt/refresh/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags jwt
     * @name JwtVerifyCreate
     * @request POST:/jwt/verify/
     * @secure
     * @response `200` `object`
     */
    jwtVerifyCreate: (data: TokenVerify, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/jwt/verify/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  pool = {
    /**
     * @description List all pools.
     *
     * @tags pool
     * @name PoolList
     * @request GET:/pool/
     * @secure
     * @response `200` `(Pool)[]`
     */
    poolList: (params: RequestParams = {}) =>
      this.request<Pool[], any>({
        path: `/pool/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Pools to be viewed or edited.
     *
     * @tags pool
     * @name PoolCreate
     * @request POST:/pool/
     * @secure
     * @response `201` `Pool`
     */
    poolCreate: (data: Pool, params: RequestParams = {}) =>
      this.request<Pool, any>({
        path: `/pool/`,
        method: 'POST',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Pools to be viewed or edited.
     *
     * @tags pool
     * @name PoolRead
     * @request GET:/pool/{id}/
     * @secure
     * @response `200` `Pool`
     */
    poolRead: (id: string, params: RequestParams = {}) =>
      this.request<Pool, any>({
        path: `/pool/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Pools to be viewed or edited.
     *
     * @tags pool
     * @name PoolUpdate
     * @request PUT:/pool/{id}/
     * @secure
     * @response `200` `Pool`
     */
    poolUpdate: (id: string, data: Pool, params: RequestParams = {}) =>
      this.request<Pool, any>({
        path: `/pool/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Pools to be viewed or edited.
     *
     * @tags pool
     * @name PoolPartialUpdate
     * @request PATCH:/pool/{id}/
     * @secure
     * @response `200` `Pool`
     */
    poolPartialUpdate: (id: string, data: Pool, params: RequestParams = {}) =>
      this.request<Pool, any>({
        path: `/pool/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows Pools to be viewed or edited.
     *
     * @tags pool
     * @name PoolDelete
     * @request DELETE:/pool/{id}/
     * @secure
     * @response `204` `void`
     */
    poolDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/pool/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Adds a new address within the pool.
     *
     * @tags pool
     * @name PoolAssignCreate
     * @request POST:/pool/{id}/assign/
     * @secure
     * @response `201` `Assignment`
     */
    poolAssignCreate: (id: string, data: Assignment, params: RequestParams = {}) =>
      this.request<Assignment, any>({
        path: `/pool/${id}/assign/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Deletes an assigned address.
     *
     * @tags pool
     * @name PoolAssignDelete
     * @request DELETE:/pool/{id}/assign/
     * @secure
     * @response `204` `void`
     */
    poolAssignDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/pool/${id}/assign/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),
  };
  token = {
    /**
     * @description Get own tokens or all tokens if admin.
     *
     * @tags token
     * @name TokenList
     * @request GET:/token/
     * @secure
     * @response `200` `(Token)[]`
     */
    tokenList: (
      query?: {
        /** A search term. */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Token[], any>({
        path: `/token/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Create a new authtoken for this user.
     *
     * @tags token
     * @name TokenCreate
     * @request POST:/token/
     * @secure
     * @response `201` `Token`
     */
    tokenCreate: (data: Token, params: RequestParams = {}) =>
      this.request<Token, any>({
        path: `/token/`,
        method: 'POST',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Update Description oder Write Flag.
     *
     * @tags token
     * @name TokenUpdate
     * @request PUT:/token/{key}/
     * @secure
     * @response `200` `Token`
     */
    tokenUpdate: (key: string, data: Token, params: RequestParams = {}) =>
      this.request<Token, any>({
        path: `/token/${key}/`,
        method: 'PUT',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description API endpoint that allows tokens to be manged by a user or staffer.
     *
     * @tags token
     * @name TokenPartialUpdate
     * @request PATCH:/token/{key}/
     * @secure
     * @response `200` `Token`
     */
    tokenPartialUpdate: (key: string, data: Token, params: RequestParams = {}) =>
      this.request<Token, any>({
        path: `/token/${key}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Delete a token.
     *
     * @tags token
     * @name TokenDelete
     * @request DELETE:/token/{key}/
     * @secure
     * @response `204` `void`
     */
    tokenDelete: (key: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/token/${key}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),
  };
}
