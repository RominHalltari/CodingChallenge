import { postData } from "app/api/client";

import BuildConfig from "app/settings/build-config";

export async function requestLogin(username: string, password: string) {
    const response = await postData(`${BuildConfig.BASE_URL}/dashboard/api/token/`, undefined, {
        device_token: "flugleborg",
        grant_type: "password",
        password,
        username,
    });
    return response;
}
