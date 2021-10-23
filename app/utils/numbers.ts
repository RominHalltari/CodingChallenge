export function formatWholeNumber(amount?: number | string) {
    if (!amount && amount !== 0) {
        return "0.00";
    } else if (typeof amount === "string") {
        return amount;
    }

    // default values
    const decimalSeparator = ",";
    const thousandsSeparator = ".";
    const nDecimalDigits = 0;

    // limit/add decimal digits
    const fixed = amount.toFixed(nDecimalDigits);

    // separate begin [$1], middle [$2] and decimal digits [$4]
    const parts = new RegExp("^(-?\\d{1,3})((?:\\d{3})+)(\\.(\\d{" + nDecimalDigits + "}))?$").exec( fixed );

    // number >= 1000 || number <= -1000
    if (parts) {
        return parts[1] + parts[2].replace(/\d{3}/g, thousandsSeparator + "$&")
            + (parts[4] ? decimalSeparator + parts[4] : "");
    } else {
        return fixed.replace(".", decimalSeparator);
    }
}

export const kFormatter = (num: number, digits: number) => {
    const si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
};
