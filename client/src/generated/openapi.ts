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

export interface Auth {
	/** JWT */
	access_token: string;
	/** JWT */
	refresh_token: string;
}

export interface Changelog {
	/**
	 * RFC 3339-formatted Timestamp of the List
	 * @format date-time
	 * @example "2018-11-13T20:20:39.000Z"
	 */
	timestamp: string;
	/** Type of change */
	action: 'add' | 'move' | 'delete';
	/**
	 * Rank that the level got moved or deleted from
	 * @format int16
	 * @min 1
	 */
	from?: number | null;
	/**
	 * Rank that the level got moved or added to
	 * @format int16
	 * @min 1
	 */
	to?: number | null;
	/** Optional reason for movement or addition */
	reason?: string | null;
	level: Level;
	/** State of the List after the changes */
	list: Level[];
	/** State of the List before the changes */
	list_before: Level[];
}

export interface Level {
	/**
	 * @format int64
	 * @example 1
	 */
	id: number;
	/** @example "Chromatic Haze" */
	name: string;
	/**
	 * @format int64
	 * @example 60587128
	 */
	gd_id?: number | null;
	/**
	 * URL to a video showcasing the level. In most cases this is the verification video.
	 * @example "https://www.youtube.com/watch?v=QZf8vX4DF0A"
	 */
	video?: string | null;
	/**
	 * Minimum required percentage to submit records
	 * @format int16
	 */
	requirement?: number | null;
	/** User who published the level */
	user: User;
	/** User who verified the level */
	verifier: User;
	/** All users involved in the creation of the level */
	creators: User[];
}

export type LevelWithRank = Level & {
	/**
	 * @min 1
	 * @example 1
	 */
	rank?: number;
};

export interface User {
	/**
	 * @format int64
	 * @example 1
	 */
	id: number;
	/** @example "Gizbro" */
	name: string;
	/** @example "US" */
	nationality?: string;
}

export type UserWithScoreAndRank = User & {
	/**
	 * @format float
	 * @example 6078.45
	 */
	score: number;
	/**
	 * @format int64
	 * @min 1
	 * @example 1
	 */
	rank: number;
};

export interface Record {
	/**
	 * RFC 3339-formatted Timestamp of the List
	 * @format date-time
	 * @example "2018-11-13T20:20:39.000Z"
	 */
	timestamp: string;
	/**
	 * Progress on the level in percent
	 * @format int16
	 * @min 0
	 * @max 100
	 * @example 57
	 */
	percentage: number;
	video: string | null;
}

export type RecordWithUser = Record & {
	user: User;
};

export type RecordWithLevel = Record & {
	level: Level;
};

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
	securityWorker?: (
		securityData: SecurityDataType | null
	) => Promise<RequestParams | void> | RequestParams | void;
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
	public baseUrl: string = '';
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
			.map((key) =>
				Array.isArray(query[key])
					? this.addArrayQueryParam(query, key)
					: this.addQueryParam(query, key)
			)
			.join('&');
	}

	protected addQueryParams(rawQuery?: QueryParamsType): string {
		const queryString = this.toQueryString(rawQuery);
		return queryString ? `?${queryString}` : '';
	}

	private contentFormatters: Record<ContentType, (input: any) => any> = {
		[ContentType.Json]: (input: any) =>
			input !== null && (typeof input === 'object' || typeof input === 'string')
				? JSON.stringify(input)
				: input,
		[ContentType.Text]: (input: any) =>
			input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
		[ContentType.FormData]: (input: any) =>
			Object.keys(input || {}).reduce((formData, key) => {
				const property = input[key];
				formData.append(
					key,
					property instanceof Blob
						? property
						: typeof property === 'object' && property !== null
						? JSON.stringify(property)
						: `${property}`
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

		return this.customFetch(
			`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
			{
				...requestParams,
				headers: {
					...(requestParams.headers || {}),
					...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
				},
				signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
				body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
			}
		).then(async (response) => {
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
 * @title GDOL
 * @version 2.0.0-alpha.1
 * @license MIT (https://spdx.org/licenses/MIT.html)
 * @externalDocs https://github.com/Emonadeo/GDOL
 * @contact Emonadeo <emonadeo@gmail.com> (https://github.com/Emonadeo/GDOL)
 *
 * Geometry Dash Open List
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
	auth = {
		/**
		 * @description Generates a pair of access and refresh tokens
		 *
		 * @tags Auth
		 * @name Auth
		 * @summary Login
		 * @request GET:/auth
		 */
		auth: (
			query: {
				/**
				 * Discord OAuth2 code
				 * @example "ABASDKJF"
				 */
				code: string;
			},
			params: RequestParams = {}
		) =>
			this.request<Auth, any>({
				path: `/auth`,
				method: 'GET',
				query: query,
				format: 'json',
				...params,
			}),

		/**
		 * @description Generates a pair of access and refresh tokens
		 *
		 * @tags Auth
		 * @name AuthRefresh
		 * @summary Refresh
		 * @request POST:/auth/refresh
		 */
		authRefresh: (
			data: {
				refresh_token?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<Auth, any>({
				path: `/auth/refresh`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),
	};
	changelog = {
		/**
		 * @description Retrieves all entries of the list changelog
		 *
		 * @tags Changelog
		 * @name GetChangelog
		 * @summary Get Changelog
		 * @request GET:/changelog
		 */
		getChangelog: (params: RequestParams = {}) =>
			this.request<Changelog[], any>({
				path: `/changelog`,
				method: 'GET',
				format: 'json',
				...params,
			}),
	};
	levels = {
		/**
		 * @description Get all records on a level ordered by percentage and timestamp
		 *
		 * @tags Levels, Records
		 * @name GetRecordsByLevel
		 * @summary Get Records by Level
		 * @request GET:/levels/{id}/records
		 */
		getRecordsByLevel: (id: number, params: RequestParams = {}) =>
			this.request<RecordWithUser[], any>({
				path: `/levels/${id}/records`,
				method: 'GET',
				format: 'json',
				...params,
			}),
	};
	list = {
		/**
		 * @description Get all levels on the list ordered by rank
		 *
		 * @tags List
		 * @name GetList
		 * @summary Get Levels on List
		 * @request GET:/list
		 */
		getList: (params: RequestParams = {}) =>
			this.request<Level[], any>({
				path: `/list`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * @description Get a level by its rank on the list
		 *
		 * @tags List
		 * @name GetLevelByListRank
		 * @summary Get Level by List Rank
		 * @request GET:/list/{rank}
		 */
		getLevelByListRank: (rank: number, params: RequestParams = {}) =>
			this.request<Level, any>({
				path: `/list/${rank}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * @description Inserts a given level into the list at a given rank. Moves the level if it is already on the list. Removes the level from the archive if it contains it.
		 *
		 * @tags List
		 * @name UpdateList
		 * @summary Add/Move Level to List Rank
		 * @request POST:/list/{rank}
		 * @secure
		 */
		updateList: (
			rank: number,
			data: {
				/** @format int64 */
				level_id: number;
				reason?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<void, any>({
				path: `/list/${rank}`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * @description Removes a level from the list and appends it to archive.
		 *
		 * @tags List
		 * @name ArchiveLevelByListRank
		 * @summary Archive Level by List Rank
		 * @request DELETE:/list/{rank}
		 * @secure
		 */
		archiveLevelByListRank: (
			rank: number,
			data: {
				reason?: string;
			} | null,
			params: RequestParams = {}
		) =>
			this.request<void, any>({
				path: `/list/${rank}`,
				method: 'DELETE',
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),
	};
	records = {
		/**
		 * @description Creates a record of a user on a level
		 *
		 * @tags Records
		 * @name CreateRecord
		 * @summary Create Record
		 * @request POST:/records
		 * @secure
		 */
		createRecord: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/records`,
				method: 'POST',
				secure: true,
				...params,
			}),

		/**
		 * @description Deletes a record of a user on a level
		 *
		 * @tags Records
		 * @name DeleteRecord
		 * @summary Delete Record
		 * @request DELETE:/records
		 * @secure
		 */
		deleteRecord: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/records`,
				method: 'DELETE',
				secure: true,
				...params,
			}),
	};
	users = {
		/**
		 * @description Get all users ordered by score
		 *
		 * @tags Users
		 * @name GetUsers
		 * @summary Get Users
		 * @request GET:/users
		 */
		getUsers: (params: RequestParams = {}) =>
			this.request<UserWithScoreAndRank[], any>({
				path: `/users`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * @description Register a new user
		 *
		 * @tags Users
		 * @name CreateUser
		 * @summary Create User
		 * @request POST:/users
		 */
		createUser: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/users`,
				method: 'POST',
				...params,
			}),

		/**
		 * @description Retrieves a user by a given ID
		 *
		 * @tags Users
		 * @name GetUserById
		 * @summary Get User by ID
		 * @request GET:/users/{id}
		 */
		getUserById: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/users/${id}`,
				method: 'GET',
				...params,
			}),

		/**
		 * @description Permanently deletes a user with a given ID
		 *
		 * @tags Users
		 * @name DeleteUserById
		 * @summary Delete User by ID
		 * @request DELETE:/users/{id}
		 * @secure
		 */
		deleteUserById: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/users/${id}`,
				method: 'DELETE',
				secure: true,
				...params,
			}),

		/**
		 * @description Retrieves all records of a given user
		 *
		 * @tags Users, Records
		 * @name GetRecordsByUser
		 * @summary Get Records by User
		 * @request GET:/users/{id}/records
		 */
		getRecordsByUser: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/users/${id}/records`,
				method: 'GET',
				...params,
			}),
	};
}
