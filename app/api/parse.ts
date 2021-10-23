import { InvalidResponse } from "app/api/errors";
import { ResultList } from "app/api/types";

/**
 * Parses a raw API list response into a ResultList object.
 *
 * @param parser: a function that parses a single raw object
 * @param data: the raw response data
 * @throws {InvalidResponse} if the raw data does not match an API result list
 */
export function parseResultList<T>(
    parser: (r: any) => T,
    data: any,
): ResultList<T> {
    const count = data.count;
    if (typeof(count) !== "number" || count < 0 || !Number.isInteger(count)) {
        throw new InvalidResponse(data, "Invalid value for `count`.");
    } else if (data.next !== null && typeof(data.next) !== "string") {
        throw new InvalidResponse(data, "`next` must be a string or null.");
    } else if (data.previous !== null && typeof(data.previous) !== "string") {
        throw new InvalidResponse(data, "`previous` must be a string or null");
    } else if (! (data.results instanceof Array)) {
        throw new InvalidResponse(data, "`results` is not an array.");
    }
    return {
        count,
        next: data.next,
        previous: data.previous,
        results: data.results.map(parser),
    };
}
