import { formatMonetaryFigure } from "./monetaryFigure";

describe("formatMonetaryFigure", () => {

    it("rounds number to 2 integers", () => {
        const amount = 0.005;

        expect(formatMonetaryFigure(amount)).toBe("0,01");

    });
    it("adds decimals to full number", () => {
        const amount = 12;

        expect(formatMonetaryFigure(amount)).toBe("12,00");

    });
});
