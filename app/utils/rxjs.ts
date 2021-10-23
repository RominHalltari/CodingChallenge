import {
    defer,
    EMPTY,
    from,
    Observable,
    of,
    OperatorFunction,
    pipe,
    timer,
} from "rxjs";
import {
    catchError,
    concatMap,
    exhaustMap,
    map,
    mergeMap,
    retryWhen,
    switchMap,
    withLatestFrom,
} from "rxjs/operators";

import { PlainObject } from "app/utils/types";


export interface RetryOptions {
    retryOn: any[];
    retryInterval: number;
    retryAttempts?: number | null;
}

/**
 * An function that attempts to execute a promise.
 * When the promise rejects, it will try again after waiting the
 * specified number of milliseconds. If the promise fails with a
 * given error instance, the promise will abort and throw an
 * error instead.
 *
 * @param initiateRequest: a function that creates a new promise.
 * @param retryOn: an array with error types for which a retry will occur.
 * @param retryInterval: number of milliseconds to wait before trying again.
 * @param retryAttempts: number of retry attempts before giving up. Set to
 *                       null to never give up.
 * @returns an rxjs observable
 */
export function retry<R>(
    initiatePromise: () => Promise<R>,
    {
        retryOn,
        retryInterval,
        retryAttempts = null,
    }: RetryOptions,
) {
    return defer(() => from(initiatePromise())).pipe(
        retryWhen((error$) => error$.pipe(
            mergeMap((error, index) => {
                if (retryAttempts !== null && index >= retryAttempts) {
                    throw error;
                } else if (retryOn.some((type) => error instanceof type)) {
                    return timer(retryInterval);
                } else {
                    throw error;
                }
            }),
        )),
    );
}

/**
 * An rxjs operator that calls a handler for a specific error and
 * throws everything else.
 *
 * @param errorType: errors that are instances of this type will be handled.
 *                   Use an array to allow multiple types.
 * @param handler: handler that will be called when the error matches.
 */
export function handleError<T, R>(
    errorType: any | any[],
    handler: (error: any) => R,
) {
    const errorTypeList = errorType instanceof Array ? errorType : [errorType];
    return (observable: Observable<T>) => observable.pipe(
        catchError((error) => {
            if (errorTypeList.some((type) => error instanceof type)) {
                return of(handler(error));
            } else {
                throw error;
            }
        }),
    );
}

type AsyncProjector<I, R> = (input: I) => Promise<R>;
type ObservableProjector<I, R> = (input: I) => Observable<R>;

/**
 * Transforms a function that returns a promise into a function that
 * returns an observable.
 */
export function liftAsync<I, R>(
    project: AsyncProjector<I, R>,
): ObservableProjector<I, R> {
    return (input: I) => from(project(input));
}

/**
 * Similar to the rxjs mergeMap operator except that it will accept an
 * asynchronous `project` function.
 */
export function mergeMapAsync<I, R>(project: AsyncProjector<I, R>) {
    return mergeMap(liftAsync(project));
}

/**
 * Similar to the rxjs switchMap operator except that it will accept an
 * asynchronous `project` function.
 */
export function switchMapAsync<I, R>(project: AsyncProjector<I, R>) {
    return switchMap(liftAsync(project));
}

/**
 * Similar to the rxjs exhaustMap operator except that it will accept an
 * asynchronous `project` function.
 */
export function exhaustMapAsync<I, R>(project: AsyncProjector<I, R>) {
    return exhaustMap(liftAsync(project));
}

/**
 * Similar to the rxjs concatMap operator except that it will accept an
 * asynchronous `project` function.
 */
export function concatMapAsync<I, R>(project: AsyncProjector<I, R>) {
    return concatMap(liftAsync(project));
}


/**
 * A rxjs operator function that will emit a shallow copy of the input
 * object with the given property set to the result of the specified
 * operator function.
 *
 * Example:
 *
 *    action$.pipe(
 *       ofType(SET_USER_COORDS),
 *       withLatestFrom(state$),
 *       map(([_, state]) => ({state}),
 *       withProperty("position", pipe(
 *           pluck("state"),
 *           map((state) => getUserLocation(state).coords),
 *           filter(isNotNull),
 *       )),
 *       withProperty("ride", pipe(
 *           pluck("state"),
 *           mergeMap(getTaxiRideList),
 *           filter(isRideInProgress),
 *       )),
 *       map(({position, ride}) => ({
 *            message: "taxi/CustomerPosition",
 *            ride_id: ride.id,
 *            latitude: position.latitude.toFixed(6),
 *            longitude: position.longitude.toFixed(6),
 *        })),
 */
export function withProperty<S extends string, T extends PlainObject, V>(
    property: S,
    operator: OperatorFunction<T, V>,
): OperatorFunction<T, T & {[key in S]: V}> {
    return mergeMap((input: T) =>
        operator(of(input)).pipe(
            map((res) => ({
                [property]: res,
                ...input,
            })),
        ),
    );
}


/**
 * An rxjs operator that will test each input value if it passes a type check.
 * If it passes then it pipes a value to the given operator and emit its output
 * value, otherwise it will just emit the input value without processing.
 *
 * Example:
 *
 *     from([1, null, 3]).pipe(
 *         pipeIf(
 *             (input): input is null => input === null,
 *             map(() => 0),
 *         ),
 *     ) // Emits [1, 0, 3]
 */
export function pipeIf<T, R, T2 extends T>(
    check: (input: T) => input is T2,
    operator: OperatorFunction<T2, R>,
): OperatorFunction<T, R | Exclude<T, T2>>;

/**
 * An rxjs operator that will test each input value if it passes a check. If
 * it passes then it pipes a value to the given operator and emit its output
 * value, otherwise it will just emit the input value without processing.
 *
 * Example:
 *
 *     from([1, 2, 3]).pipe(
 *         pipeIf(
 *             (i) => i % 2 === 0,
 *             map((i) => -i),
 *         ),
 *     ) // Emits [1, -2, 3]
 */
export function pipeIf<T, R>(
    check: (input: T) => boolean,
    operator: OperatorFunction<T, R>,
): OperatorFunction<T, R | T>;

export function pipeIf(
    check: (input: any) => any,
    operator: OperatorFunction<any, any>,
): OperatorFunction<any, any> {
    return mergeMap((input) => {
        if (check(input)) {
            return operator(of(input));
        } else {
            return of(input);
        }
    });
}


/**
 * An rxjs operator that discards the input and instead uses the latest value
 * from another observable.
 *
 * Example:
 *
 *    action$.pipe(
 *        ofType(REHYDRATE),
 *        mapToLatestFrom(state$),
 *        map(getToken),
 *        ...
 *
 */
export function mapToLatestFrom<T, R>(
    stream$: Observable<R>,
): OperatorFunction<T, R> {
    return pipe(
        withLatestFrom(stream$),
        map(([_, value]) => value),
    );
}


/**
 * An rxjs operator that catches an error and logs it to crashlytics.
 * If `error` has a `getError` method, then its return value will be logged
 * instead.
 */
export function logError() {
    return catchError((error: any) => {
        if (!(error instanceof Error) && "getError" in error) {
            error = error.getError();
        }
        if (!(error instanceof Error)) {
            error = new Error(error.toString());
        }
        return EMPTY;
    });
}
