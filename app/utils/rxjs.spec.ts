import lolex from "lolex";
import { from, of, throwError } from "rxjs";
import { map } from "rxjs/operators";

import { isNull } from "app/utils";
import { simulateAllRequests } from "app/utils/tests/api";
import { expectObservable } from "app/utils/tests/rxjs";

import {
    handleError,
    logError,
    mapToLatestFrom,
    pipeIf,
    retry,
    withProperty,
} from "./rxjs";

const clock = lolex.install();

beforeEach(() => {
    clock.reset();
});

afterAll(() => {
    clock.uninstall();
});


class MyError {}


describe("handleError", () => {

    it("catches a javascript error", () => {
        const returnValue = "TEST";
        const error = new Error();
        const handler = jest.fn(() => returnValue);

        throwError(error).pipe(
            handleError(Error, handler),
        ).subscribe(
            (value) => {
                expect(value).toBe(returnValue);
                expect(handler).toBeCalledWith(error);
            },
            () => fail("Should not throw an error anymore"),
        );
    });

    it("catches a custom error", () => {
        const returnValue = "TEST";
        const error = new MyError();
        const handler = jest.fn(() => returnValue);

        throwError(error).pipe(
            handleError(MyError, handler),
        ).subscribe(
            (value) => {
                expect(value).toBe(returnValue);
            },
            () => fail("Should not throw an error anymore"),
        );
    });

    it("can catch an error with an arrays of error types", () => {
        const returnValue = "TEST";
        const error = new MyError();
        const handler = jest.fn(() => returnValue);

        throwError(error).pipe(
            handleError([Error, MyError], handler),
        ).subscribe(
            (value) => {
                expect(value).toBe(returnValue);
                expect(handler).toBeCalledWith(error);
            },
            () => fail("Should not throw an error anymore"),
        );
    });

    it("throws an unwanted error", () => {
        const error = new MyError();
        const handler = jest.fn();

        throwError(error).pipe(
            handleError(Error, handler),
        ).subscribe(
            () => fail("Should have thrown an error"),
            (value) => {
                expect(value).toBe(error);
                expect(handler).not.toHaveBeenCalled();
            },
        );
    });

    it("throws an unwanted error that is not in the specified array", () => {
        const error = new MyError();
        const handler = jest.fn();

        throwError(error).pipe(
            handleError([Error], handler),
        ).subscribe(
            () => fail("Should have thrown an error"),
            (value) => {
                expect(value).toBe(error);
                expect(handler).not.toHaveBeenCalled();
            },
        );
    });

    it("passes the value along when there is no error", () => {
        const returnValue = "TEST";
        const handler = jest.fn();

        of(returnValue).pipe(
            handleError(Error, handler),
        ).subscribe(
            (value) => {
                expect(value).toBe(returnValue);
                expect(handler).not.toHaveBeenCalled();
            },
            () => fail("Should not throw an error"),
        );
    });

});

describe("retry", () => {
    const inputValue = "INPUT";
    const returnValue = "TEST";
    const error = new MyError();
    const initiatePromise = jest.fn(async (_) => returnValue);

    beforeEach(() => {
        initiatePromise.mockClear();
    });

    it("does not retry on success", async (done) => {
        retry(() => initiatePromise(inputValue), {
            retryInterval: 1000,
            retryOn: [MyError],
        }).subscribe(
            (value) => {
                try {
                    expect(value).toBe(returnValue);
                    expect(initiatePromise).toHaveBeenCalledTimes(1);
                    expect(initiatePromise).toBeCalledWith(inputValue);
                    done();
                } catch (e) {
                    done.fail(e);
                }
            },
            () => done.fail("Should not throw an error"),
        );

        await simulateAllRequests(clock);
    });

    it("fails without retrying on an unexpected error", async (done) => {
        initiatePromise.mockImplementationOnce(async () => {
            throw new Error("That was unexpected!");
        });

        retry(() => initiatePromise(inputValue), {
            retryInterval: 1000,
            retryOn: [MyError],
        }).subscribe(
            () => done.fail("Should throw an error"),
            () => {
                try {
                    expect(initiatePromise).toHaveBeenCalledTimes(1);
                    expect(initiatePromise).toBeCalledWith(inputValue);
                    done();
                } catch (e) {
                    done.fail(e);
                }
            },
        );

        await simulateAllRequests(clock);
    });

    it("retries with a delay on expected failure", async (done) => {
        let failureTime = new Date();
        let retryTime = new Date();

        initiatePromise.mockImplementationOnce(async () => {
            failureTime = new Date();
            throw error;
        });

        initiatePromise.mockImplementationOnce(async () => {
            retryTime = new Date();
            return returnValue;
        });

        retry(() => initiatePromise(inputValue), {
            retryInterval: 1000,
            retryOn: [MyError],
        }).subscribe(
            (value) => {
                try {
                    expect(value).toBe(returnValue);
                    expect(initiatePromise).toHaveBeenCalledTimes(2);
                    expect(initiatePromise).toBeCalledWith(inputValue);
                    expect(retryTime.getTime() - failureTime.getTime())
                        .toBe(1000);
                    done();
                } catch (e) {
                    done.fail(e);
                }
            },
            () => done.fail("Should not throw an error"),
        );

        await simulateAllRequests(clock);
    });

    it("does not retry more times than allowed", async (done) => {
        initiatePromise.mockImplementation(async () => {
            throw error;
        });

        retry(() => initiatePromise(inputValue), {
            retryAttempts: 3,
            retryInterval: 1000,
            retryOn: [MyError],
        }).subscribe(
            () => done.fail("Should have thrown an error"),
            () => {
                try {
                    // It should have been called 4 times: once for real and
                    // 3 attempts.
                    expect(initiatePromise).toHaveBeenCalledTimes(4);
                    expect(initiatePromise).toBeCalledWith(inputValue);
                    done();
                } catch (e) {
                    done.fail(e);
                }
            },
        );

        await simulateAllRequests(clock);
    });

});


describe("withProperty", () => {
    const input = {
        a: 1,
        b: 2,
    };

    it("sets a new property", (done) => {
        expectObservable(
            of(input).pipe(
                withProperty("c", map((o) => o.a + o.b)),
            ),
        )
        .toEmit([{a: 1, b: 2, c: 3}], done);
    });

    it("does not alter the original object", (done) => {
        expectObservable(
            of(input).pipe(
                withProperty("c", map((o) => o.a + o.b)),
            ),
        )
        .to(() => {
            expect(input).toEqual({a: 1, b: 2});
        }, done);
    });
});


describe("mapToLatestFrom", () => {
    const input = {a: 1, b: 2};

    it("outputs the latest value of another observable", (done) => {
        expectObservable(
            of(input).pipe(
                mapToLatestFrom(from(["x", "y"])),
            ),
        )
        .toEmit(["y"], done);
    });
});


describe("pipeIf", () => {

    it("handles a semantic check (boolean)", (done) => {
        const input = [1, 2, 3, 4, 5, 6];

        expectObservable(
            from(input).pipe(
                pipeIf(
                    // Turn even numbers into strings
                    (i) => i % 2 === 0,
                    map((x: number) => x.toString()),
                ),
            ),
        )
        .toEmit([1, "2", 3, "4", 5, "6"], done);
    });

    it("handles a type check (is null)", (done) => {
        const input = [1, null, 3];

        expectObservable(
            from(input).pipe(
                pipeIf(
                    isNull,
                    map(() => "null"),
                ),
            ),
        )
        .toEmit([1, "null", 3], done);
    });

    it("is possible to return the same type after a type check", (done) => {
        const input = [1, null, 3];

        expectObservable(
            from(input).pipe(
                pipeIf(
                    isNull,
                    map(() => null),
                ),
            ),
        )
        .toEmit([1, null, 3], done);
    });
});


describe("logError", () => {
    // const recordError = crashlytics.recordError = jest.fn();

    // mock.mockReturnValue(crashlytics);

    beforeEach(() => {
        // recordError.mockReset();
    });

    it("emits input on success", (done) => {
        expectObservable(
            of("input").pipe(
                logError(),
            ),
        )
        .toEmit(["input"], done);
    });

    it("emits nothing on an error", (done) => {
        expectObservable(
            throwError(new Error("TestError")).pipe(
                logError(),
            ),
        )
        .toEmitNothing(done);
    });

    it("logs an error object", (done) => {
        expectObservable(
            throwError(new Error("TestError")).pipe(
                logError(),
            ),
        )
        .to(() => {
            // expect(recordError).toBeCalledWith(0, "Error: TestError");
        }, done);
    });

    it("logs an object with getError", (done) => {
        expectObservable(
            throwError({getError: () => new Error("TestGetError")}).pipe(
                logError(),
            ),
        )
        .to(() => {
            // expect(recordError).toBeCalledWith(0, "Error: TestGetError");
        }, done);
    });

    it("logs any object", (done) => {
        const obj = {x: 1};
        expectObservable(
            throwError(obj).pipe(
                logError(),
            ),
        )
        .to(() => {
            // expect(recordError).toBeCalledWith(0, `Error: ${obj.toString()}`);
        }, done);
    });

});
