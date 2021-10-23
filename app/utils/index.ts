import { PlainObject } from "app/utils/types";

/**
 * Returns true if a value is not null and informs Typescript
 * that the value's type can no longer be null. This is useful
 * in filter functions because Typescript does not check the
 * function body to extract information about the input variables.
 *
 * Example:
 *
 *     const strings: Array<string | null> = ["abc", null, "def"];
 *
 * To get a list of uppercase values, you'd do something like this:
 *
 *     strings.filter((v) => v !== null).map((v) => v.toUpperCase());
 *
 * However, Typescript will complain that the `v` in the `map` function
 * may be null. This function informs Typescript that this will never
 * be the case so Typescript will not raise a warning:
 *
 *     strings.filter(isNotNull).map((v) => v.toUpperCase());
 *
 * This function can also be used elsewhere, such as in rxjs' filter
 * operator.
 */
export function isNotNull<T>(value: T | null): value is T {
    return value !== null;
}


/**
 * Returns true if value is null, for the same reasons as above.
 */
export function isNull<T>(value: T | null): value is null {
    return value === null;
}


export function toCamelCase(str: string) {
    let result = "";
    let prevIsUnderscore = false;

    for (const c of str) {
        if (prevIsUnderscore) {
            result += c.toUpperCase();
        } else if (c !== "_") {
            result += c;
        }

        prevIsUnderscore = c === "_";
    }

    return result + (prevIsUnderscore ? "_" : "");
}


export function objKeysToCamelCase(obj: PlainObject): PlainObject {
    const result: {[key: string]: any} = {};

    Object.keys(obj).forEach((key) => {
        result[toCamelCase(key)] = obj[key];
    });

    return result;
}


/**
 * Map for immutable arrays. Be careful: does not check immutability,
 * but it does assume it.
 * Because we assume the in and out arrays are immutable, we don't need
 * to make a copy unless the array is actually changed.
 * Most useful if array contents are likely to be unchanged.
 */
export function mapImmutable<A, B>(arr: A[], f: (e: A, i: number, arr: A[]) => B): B[] {
    let result: B[] = [];
    let copying = false;

    for (let i = 0; i < arr.length; i++) {
        const b = f(arr[i], i, arr);

        if (copying) {
            // There is a difference, so we need to copy the entire array
            result.push(b);
        } else {
            // No difference yet between in and out
            if ((b as any) === (arr[i] as any)) {
                // We can still just return arr at the end
            } else {
                // Start copying
                copying = true;
                // Copy array so far
                // We know arr.slice(0, i) is of type B[] because every
                // element so far has been equal to a variable of type B
                result = (arr.slice(0, i) as unknown as B[]);
                result.push(b);
            }
        }
    }

    if (copying) {
        return result;
    } else {
        // We know arr is of type B[] because every element is equal to
        // a variable of type B
        return (arr as unknown as B[]);
    }
}


/**
 * Map, but for objects. Calls a function on every value in the object
 * and puts it in a new object under the same key.
 */
export function mapObj<A, B>(
    obj: {[key: string]: A},
    f: (val: A, key: string, obj: {[key: string]: A}) => B,
): {[key: string]: B} {
    const result: {[key: string]: B} = {};

    Object.entries(obj).forEach(([key, val]) => {
        result[key] = f(val, key, obj);
    });

    return result;
}


/**
 * Map immutable, but for objects. See two functions above for
 * explanations
 */
export function mapObjImmutable<A, B>(
    obj: {[key: string]: A},
    f: (val: A, key: string, obj: {[key: string]: A}) => B,
): {[key: string]: B} {
    const objEntries = Object.entries(obj);
    const result: {[key: string]: B} = {};
    let copying = false;

    for (let i = 0; i < objEntries.length; i++) {
        const [key, val] = objEntries[i];
        const b = f(val, key, obj);

        if (copying) {
            // There is a difference, so we need to copy the entire object
            result[key] = b;
        } else {
            // No difference yet between in and out
            if ((b as any) === (val as any)) {
                // We can still just return obj at the end
            } else {
                // Start copying
                copying = true;
                // Copy object so far
                for (let j = 0; j < i; j++) {
                    const [key2, val2] = objEntries[j];
                    // We know previous values are of type B because every
                    // value so far has been equal to a variable of type B
                    result[key2] = (val2 as any);
                }
                result[key] = b;
            }
        }
    }

    if (copying) {
        return result;
    } else {
        // We know obj is of type {[key: string]: B} because every value
        // was equal to a variable of type B
        return (obj as unknown as {[key: string]: B});
    }
}

/**
 * Returns true if all properties of the object are equal
 */
export function hasEqualProperties(a: PlainObject, b: PlainObject) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    return (
        keysA.every((k) => keysB.includes(k))
        && keysB.every((k) => keysA.includes(k))
        && keysA.every((k) => a[k] === b[k])
    );
}

/**
 * Modulo operator (like % but without negative results)
 */
export function modulo(a: number, n: number) {
    return ((a % n) + n) % n;
}
