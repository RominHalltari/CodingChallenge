import { ApiError, InvalidResponse } from "app/api/errors";

import { parseResultList } from "./parse";

describe("parseResultList", () => {

    const now = new Date();

    interface Item {
        readonly id: number;
        readonly name: string;
        readonly time: Date;
    }

    function parseItem(raw: any) {
        raw.time = now;
        return raw as Item;
    }

    const resultList = (): any => {
        return {
            count: 2,
            next: "http://example.test/next",
            previous: "http://example.test/previous",
            results: [{id: 1, name: "Item 1"}, {id: 2, name: "Item 2"}],
        };
    };

    it("parses a raw object into a ResultList", () => {
        const result = parseResultList(parseItem, resultList());

        expect(result).toEqual({
            count: 2,
            next: "http://example.test/next",
            previous: "http://example.test/previous",
            results: [
                {id: 1, name: "Item 1", time: now},
                {id: 2, name: "Item 2", time: now},
            ],
        });
    });

    it("propagates parse errors", () => {
        const error = new ApiError();

        try {
            parseResultList(
                () => { throw error; },
                resultList(),
            );
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBe(error);
        }
    });

    /* count */

    it("throws InvalidResponse when count has the wrong type", () => {
        const raw = resultList();
        raw.count = "2";

        try {
            parseResultList(parseItem, raw);
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidResponse);
        }
    });

    it("throws InvalidResponse when count is negative", () => {
        const raw = resultList();
        raw.count = -2;

        try {
            parseResultList(parseItem, raw);
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidResponse);
        }
    });

    it("throws InvalidResponse when count is a decimal", () => {
        const raw = resultList();
        raw.count = 2.126;

        try {
            parseResultList(parseItem, raw);
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidResponse);
        }
    });

    it("throws InvalidResponse when count is missing", () => {
        const raw = resultList();
        delete raw.count;

        try {
            parseResultList(parseItem, raw);
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidResponse);
        }
    });

    /* next */

    it("accepts the null value for next", () => {
        const raw = resultList();
        raw.next = null;

        const result = parseResultList(parseItem, raw);

        expect(result.next).toBeNull();
    });

    it("throws InvalidResponse when next has the wrong type", () => {
        const raw = resultList();
        raw.next = 1;

        try {
            parseResultList(parseItem, raw);
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidResponse);
        }
    });

    it("throws InvalidResponse when next is missing", () => {
        const raw = resultList();
        delete raw.next;

        try {
            parseResultList(parseItem, raw);
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidResponse);
        }
    });

    /* previous */

    it("accepts the null value for previous", () => {
        const raw = resultList();
        raw.previous = null;

        const result = parseResultList(parseItem, raw);

        expect(result.previous).toBeNull();
    });

    it("throws InvalidResponse when previous has the wrong type", () => {
        const raw = resultList();
        raw.previous = 1;

        try {
            parseResultList(parseItem, raw);
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidResponse);
        }
    });

    it("throws InvalidResponse when previous is missing", () => {
        const raw = resultList();
        delete raw.previous;

        try {
            parseResultList(parseItem, raw);
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidResponse);
        }
    });

    /* results */

    it("accepts an empty array", () => {
        const raw = resultList();
        raw.results = [];

        const result = parseResultList(parseItem, raw);

        expect(result.results).toEqual([]);
    });

    it("throws InvalidResponse when results is not an array", () => {
        const raw = resultList();
        raw.results = {a: "b"};

        try {
            parseResultList(parseItem, raw);
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidResponse);
        }
    });

    it("throws InvalidResponse when results is missing", () => {
        const raw = resultList();
        delete raw.results;

        try {
            parseResultList(parseItem, raw);
            fail("Should have thrown an error");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidResponse);
        }
    });

});
