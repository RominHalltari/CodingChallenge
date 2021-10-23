import { timer } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { combineEpics, Epic, ofType } from "redux-observable";
import { REHYDRATE } from "redux-persist";

import { minuteTick } from "app/actions";
import modules from "app/modules";

const epics: Epic[] = [];

for (const moduleName of Object.keys(modules)) {
    const epic = modules[moduleName].epic;

    if (epic !== null) {
        epics.push(epic);
    }
}

export const minuteTickEpic: Epic = (action$) =>
    action$.pipe(
        ofType(REHYDRATE),
        switchMap(() => {
            // Start on the next full minute
            const startDate = new Date();
            startDate.setMilliseconds(0);
            startDate.setSeconds(1); // One second just to be sure we're always in a new minute
            startDate.setMinutes(startDate.getMinutes() + 1);
            // Use Math.max to avoid issues when we pass the minute exactly during this code block
            return timer(Math.max(startDate.getTime() - new Date().getTime(), 0), 60 * 1000);
        }),
        map(minuteTick),
    );

epics.push(minuteTickEpic);

export default combineEpics(...epics);
