import lolex from "lolex";

/**
 * An utility function that returns a promise which resolves with a
 * specified object after the given duration (in milliseconds).
 *
 * Example:
 *
 *     fn.mockImplementation(() => delayResolve(duration, error))
 */
export const delayResolve = (
    duration: number = 1000,
    response: object | undefined = undefined,
) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(response), duration);
    });
};

/**
 * An utility function that returns a promise which rejects with a
 * specified error after the given duration (in milliseconds).
 *
 * Example:
 *
 *     fn.mockImplementation(() => delayReject(duration, error))
 */
export const delayReject = (
    duration: number = 1000,
    error: object | undefined = undefined,
) => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(error), duration);
    });
};

/**
 * An utility function that create a succesful API error for mocking.
 * The response will succeed after the specified duration (in milliseconds).
 *
 * Usage:
 *
 *     fetchMock.mockResponse(() => fetchresponse(duration, data, status))
 */
export const fetchResponse = (
    duration: number = 1000,
    response: object | string,
    status: number = 200,
) => {
    if (! (response instanceof String)) {
        response =  JSON.stringify(response);
    }
    return delayResolve(duration, {body: response, init: {status}});
};

/**
 * An utility function that creates a failing API request for mocking.
 * The response will fail after the specified duration (in milliseconds).
 *
 * Usage:
 *
 *     fetchMock.mockResponse(() => fetchError(duration))
 */
export const fetchError = delayReject;

/**
 * Simulates API requests that are pending right now. New requests
 * will not be simulated unless they have a timeout of 0 milliseconds.
 * Returns a promise that will be resolved when the simulation is done.
 */
export async function simulatePendingRequests(clock: lolex.Clock) {
    await null;  // Wait until the delay promise is started
    await clock.runToLast();  // Wait until the delay timeout
}

/**
 * Simulates all pending API requests and repeats until there are
 * no new pending requests anymore. Returns a promise that will be
 * resolved when the simulation is done.
 */
export async function simulateAllRequests(clock: lolex.Clock) {
    do {
        await simulatePendingRequests(clock);
    } while (clock.countTimers() > 0);
}
