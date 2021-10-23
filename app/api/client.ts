import {
    BadRequest,
    ConnectionError,
    DecodeError,
    InvalidResponse,
    NotFound,
    PermissionDenied,
    Unauthorized,
    UnknownError,
} from "app/api/errors";
import * as settings from "app/settings/selectors";

import { getAPIVersion } from "app/utils/apiVersion";
import { getStore } from "app/utils/redux";
import { Buffer } from "buffer";

const encodeGetParams = (p: {[key: string]: any}) => (
    Object.keys(p).map(
        (key) => [key, p[key]].map(encodeURIComponent).join("="),
    ).join("&")
);

const getBaseUrl = () => settings.getSetting(getStore().getState(),
                                             "API_BASE_URL");

const getUrl = (path: string, params: {[key: string]: any} = {}) => {
    let url;
    path = path.replace(/^\//, "");

    // if the path includes ://, then it's a full url. This is needed at least
    // for routeplanner. This does not validate the URL. It is just a
    // simple way to make a distinction between paths and full URLs.
    if (path.includes("://")) {
        url = path;
    } else {
        const baseUrl = getBaseUrl().replace(/\/+$/, "");
        url = baseUrl + "/" + path;
    }
    const query = encodeGetParams(params);

    if (query === "") {
        return url;
    } else {
        return `${url}?${query}`;
    }
};

/* Generic request */

function handleBadRequest(url: string, data: any) {
    throw new BadRequest(url, data);
}

async function request(url: string, options: RequestInit) {
    let response;
    try {
        response = await fetch(url, options);
    } catch (error) {
        throw new ConnectionError(url);
    }

    switch (response.status) {
        case 400:
            let data;
            try {
                data = await response.json();
            } catch (error) {
                throw new BadRequest(url);
            }
            throw handleBadRequest(url, data);
        case 401: throw new Unauthorized(url);
        case 403: throw new PermissionDenied(url);
        case 404: throw new NotFound(url);
    }

    if (! response.ok) {
        throw new UnknownError(url);
    }

    try {
        return await response.json();
    } catch (error) {
        throw new DecodeError(url);
    }
}

/* Authentication */

export interface AuthenticationResponse {
    id: number;
    token: string;
    [key: string]: any;
}

function processAuthenticationResponse(response: any) {
    if (! response.hasOwnProperty("token")) {
        throw new InvalidResponse(
            response,
            "Authentication response object is missing the token.",
        );
    }

    if (!response.hasOwnProperty("id")) {
        throw new InvalidResponse(
            response,
            "Authentication response object is missing the user id.",
        );
    }
    return response;
}

function processAdhocAuthenticationResponse(response: any) {
    if (! response.hasOwnProperty("token")) {
        throw new InvalidResponse(
            response,
            "Authentication response object is missing the token.",
        );
    }
    return response;
}

export async function authenticate(
    login: string,
    password: string,
): Promise<AuthenticationResponse> {
    const auth = Buffer.from(login + ":" + password).toString("base64");
    const url = getUrl(`${getAPIVersion.AUTHENTICATE}/user/user`);

    const response = await request(
        url,
        {
            headers: {
               "Authorization": `Basic ${auth}`,
               "Content-Type": "application/json",
            },
            method: "GET",
    });

    return processAuthenticationResponse(response);
}

export async function authenticateByToken(
    token: string,
): Promise<AuthenticationResponse> {
    const url = getUrl(`${getAPIVersion.AUTHENTICATE}/user/user`);
    const response = await request(
        url,
        {
            headers: {
               "Authorization": `Token ${token}`,
               "Content-Type": "application/json",
            },
            method: "GET",
    });
    return processAuthenticationResponse(response);
}

export async function getAdhocCredentials(): Promise<AuthenticationResponse> {
    const url = getUrl(`${getAPIVersion.AUTHENTICATE}/user/adhoc-credentials`);
    const response = await request(
        url,
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });
    return processAdhocAuthenticationResponse(response);
}

function getHeaders(): {[key: string]: string} {
    const headers: {[key: string]: string} = {
        "Content-Type": "application/json",
    };
    return headers;
}

export async function requestData(
    path: string,
    params: {[key: string]: any} = {},
) {
    const url = getUrl(path, params);
    const headers = getHeaders();

    const options = {
        cache: "no-cache",
        headers,
        method: "GET",
    } as RequestInit;
    return request(url, options);
}

export async function postData(
    path: string,
    params: object = {},
    body?: object,
) {
    const url = getUrl(path, params);
    const headers = getHeaders();

    const options = {
        body: body === undefined ? body : JSON.stringify(body),
        cache: "no-cache",
        headers,
        method: "POST",
    } as RequestInit;
    return request(url, options);
}

export async function putData(
    path: string,
    params: object = {},
    body?: object,
) {
    const url = getUrl(path, params);
    const headers = getHeaders();

    const options = {
        body: body === undefined ? body : JSON.stringify(body),
        cache: "no-cache",
        headers,
        method: "PUT",
    } as RequestInit;
    return request(url, options);
}

export async function patchData(
    path: string,
    params: object = {},
    body?: object,
) {
    const url = getUrl(path, params);
    const headers = getHeaders();

    const options = {
        body: body === undefined ? body : JSON.stringify(body),
        cache: "no-cache",
        headers,
        method: "PATCH",
    } as RequestInit;
    return request(url, options);
}

