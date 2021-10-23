export const everyMinute = (): number => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    return date.getTime();
};

export const everyHour = (): number => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    return date.getTime();
};

export const everyDay = (): number => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    return date.getTime();
};
