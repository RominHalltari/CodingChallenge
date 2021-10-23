const RealDate = Date;

export function MockDate(...args: any[]) {
    let instance;
    if (args.length === 0) {
        instance = new RealDate(RealDate.UTC(2019, 0, 23, 17, 53));
    } else if (args.length === 1 && typeof args[0] === "string") {
        if (args[0].match(/(Z|\+[0-9]{2}:?[0-9]{2})$/)) {
            instance = new RealDate(args[0]);
        } else {
            throw Error("Don't use date strings without timezone in the Date constructor");
        }
    } else if (args.length > 1) {
        // @ts-ignore TS2556
        instance = new RealDate(RealDate.UTC(...args));
    } else {
        // @ts-ignore TS2556
        instance = new RealDate(...args);
    }
    // @ts-ignore TS2683
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
}
MockDate.prototype = Object.create(RealDate.prototype);
Object.setPrototypeOf(MockDate, RealDate);
MockDate.prototype.getTimezoneOffset = () => 0;

export function startDateMock() {
    // @ts-ignore TS2322
    global.Date = MockDate;
}

export function clearDateMock() {
    global.Date = RealDate;
}
