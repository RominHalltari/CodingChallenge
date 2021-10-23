export function formatMonetaryFigure(amount: number): string {
    return amount.toFixed(2).replace(".", ",");
}
