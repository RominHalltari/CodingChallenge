import {
    hasEqualProperties,
    mapImmutable,
    mapObj,
    mapObjImmutable,
    modulo,
    objKeysToCamelCase,
    toCamelCase,
} from "app/utils";

describe("toCamelCase", () => {
    const examples: {[key: string]: string} = {
        _a_var: "AVar",
        a__var: "a_Var",
        a_var: "aVar",
        test_: "test_",
    };

    it("correctly handles the examples", () => {
        for (const key of Object.keys(examples)) {
            expect(toCamelCase(key)).toEqual(examples[key]);
        }
    });
});

describe("objToCamelCase", () => {
    const exampleObject = {
        a_var: {
            one_level_down: 5,
        },
        an_array: ["shouldnt_be_changed"],
    };

    it("correctly camelcases the object", () => {
        expect(objKeysToCamelCase(exampleObject)).toEqual({
            aVar: {
                one_level_down: 5,
            },
            anArray: ["shouldnt_be_changed"],
        });
    });
});

describe("mapImmutable", () => {
    const input = [0, 1, 2, 3];
    const outputTwice = [0, 2, 4, 6];

    function once(a: number) {
        return a;
    }

    function twice(a: number) {
        return a * 2;
    }

    it("correctly maps", () => {
        expect(mapImmutable(input, twice)).toEqual(outputTwice);
    });

    it("doesn't create a copy when not necessary", () => {
        expect(mapImmutable(input, once)).toBe(input);
    });
});

describe("mapObj", () => {
    const input = {a: 0, b: 1, c: 2, d: 3};
    const outputTwice = {a: 0, b: 2, c: 4, d: 6};

    function once(a: number) {
        return a;
    }

    function twice(a: number) {
        return a * 2;
    }

    it("correctly maps", () => {
        expect(mapObj(input, twice)).toEqual(outputTwice);
    });

    it("creates a copy", () => {
        expect(mapObj(input, once)).toEqual(input);
        expect(mapObj(input, once)).not.toBe(input);
    });
});

describe("mapObjImmutable", () => {
    const input = {a: 0, b: 1, c: 2, d: 3};
    const outputTwice = {a: 0, b: 2, c: 4, d: 6};

    function once(a: number) {
        return a;
    }

    function twice(a: number) {
        return a * 2;
    }

    it("correctly maps", () => {
        expect(mapObjImmutable(input, twice)).toEqual(outputTwice);
    });

    it("doesn't create a copy when not necessary", () => {
        expect(mapObjImmutable(input, once)).toBe(input);
    });
});

describe("hasEqualProperties", () => {
    it("returns true for objects with equal properties", () => {
        expect(hasEqualProperties(
            {
                a: 1,
                b: "a",
                c: undefined,
                d: null,
            },
            {
                a: 1,
                b: "a",
                c: undefined,
                d: null,
            },
        )).toBe(true);
    });

    it("returns true for two empty objects", () => {
        expect(hasEqualProperties({}, {})).toBe(true);
    });

    it("returns false when the first object has an extra property", () => {
        expect(hasEqualProperties(
            {
                a: 1,
            },
            {
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: "a",
            },
            {
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: undefined,
            },
            {
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: null,
            },
            {
            },
        )).toBe(false);

        expect(hasEqualProperties(
            {
                a: 1,
                b: "b",
            },
            {
                b: "b",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: "a",
                b: "b",
            },
            {
                b: "b",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: undefined,
                b: "b",
            },
            {
                b: "b",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: null,
                b: "b",
            },
            {
                b: "b",
            },
        )).toBe(false);
    });

    it("returns false when the second object has an extra property", () => {
        expect(hasEqualProperties(
            {
            },
            {
                a: 1,
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
            },
            {
                a: "a",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
            },
            {
                a: undefined,
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
            },
            {
                a: null,
            },
        )).toBe(false);

        expect(hasEqualProperties(
            {
                b: "b",
            },
            {
                a: 1,
                b: "b",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                b: "b",
            },
            {
                a: "a",
                b: "b",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                b: "b",
            },
            {
                a: undefined,
                b: "b",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                b: "b",
            },
            {
                a: null,
                b: "b",
            },
        )).toBe(false);
    });

    it("returns false when a property differs", () => {
        expect(hasEqualProperties(
            {
                a: 2,
            },
            {
                a: 1,
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: 2,
            },
            {
                a: "a",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: 2,
            },
            {
                a: undefined,
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: 2,
            },
            {
                a: null,
            },
        )).toBe(false);

        expect(hasEqualProperties(
            {
                a: 2,
                b: "b",
            },
            {
                a: 1,
                b: "b",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: 2,
                b: "b",
            },
            {
                a: "a",
                b: "b",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: 2,
                b: "b",
            },
            {
                a: undefined,
                b: "b",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: 2,
                b: "b",
            },
            {
                a: null,
                b: "b",
            },
        )).toBe(false);
    });

    it("returns false when the objects have the same properties with different keys", () => {
        expect(hasEqualProperties(
            {
                a: 1,
            },
            {
                b: 1,
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: "a",
            },
            {
                b: "a",
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: undefined,
            },
            {
                b: undefined,
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: null,
            },
            {
                b: null,
            },
        )).toBe(false);
    });

    it("returns false when the objects contain properties that only differ by reference", () => {
        expect(hasEqualProperties(
            {
                a: {},
            },
            {
                a: {},
            },
        )).toBe(false);
        expect(hasEqualProperties(
            {
                a: [],
            },
            {
                a: [],
            },
        )).toBe(false);
    });

    it("returns false when the objects contain a property that is NaN", () => {
        expect(hasEqualProperties(
            {
                a: NaN,
            },
            {
                a: NaN,
            },
        )).toBe(false);
    });
});

describe("modulo", () => {
    it("correctly gives the modulo of positive numbers", () => {
        expect(modulo(37, 10)).toBe(7);
        expect(modulo(37.123, 10)).toBeCloseTo(7.123);
    });

    it("correctly gives the modulo of negative numbers", () => {
        expect(modulo(-37, 10)).toBe(3);
        expect(modulo(-37.123, 10)).toBeCloseTo(2.877);
    });
});
