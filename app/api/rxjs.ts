import { retry } from "app/utils/rxjs";

import { ConnectionError } from "app/api/errors";

/**
 * An rxjs operator that attempts to execute an API request.
 * When the request fails with a given error type, it will try again
 * after waiting the specified number of milliseconds. Otherwise
 * the request will abort and throw an error instead.
 *
 * By default the request will be retried on a ConnectionError only
 * and will have a delay of 1 second. It will keep retrying forever.
 *
 * This is basically a wrapper around app/utils/rxjs/retry with some
 * sane defaults for API requests.
 *
 * @param initiateRequest: a function that creates a new promise.
 * @param retryOn: an array with error types for which a retry will occur.
 * @param retryInterval: number of milliseconds to wait before trying again.
 * @param retryAttempts: number of retry attempts before giving up. Set to
 *                       null to never give up.
 * @returns an rxjs operator function
 */

interface ApiRetryOptions {
    retryOn?: any[];
    retryInterval?: number;
    retryAttempts?: number | null;
}

export function apiRequest<R>(
    initiateRequest: () => Promise<R>,
    {
        retryOn = [ConnectionError],
        retryInterval = 1000,
        retryAttempts = null,
    }: ApiRetryOptions = {},
) {
    return retry(initiateRequest, {
        retryAttempts,
        retryInterval,
        retryOn,
    });
}
