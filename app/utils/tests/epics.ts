/* tslint:disable:max-classes-per-file */

import { AnyAction } from "redux";
import {
    ActionsObservable,
    Epic,
    StateObservable,
} from "redux-observable";
import { Subject } from "rxjs";


import { expectObservable } from "app/utils/tests/rxjs";


type InputActions = AnyAction | AnyAction[] | ActionsObservable<AnyAction>;


export const expectEpic = <S = any>(epic: Epic) => {
    return new EpicTestFactory<S>(epic);
};


// Helper classes

class EpicTestFactory<S> {

    constructor(
        private readonly epic: Epic,
        private readonly state: S = {} as S,
    ) {}

    /**
     * Sets the test state for this epic.
     */
    public withState = (state: S) => {
        return new EpicTestFactory(this.epic, state);
    }

    /**
     * Sets the test input actions for this epic.
     */
    public on = (input: InputActions) => {
        const action$ = (input instanceof Array)
            ? ActionsObservable.of(...input)
            : input instanceof ActionsObservable
                ? input
                : ActionsObservable.of(input);
        return expectObservable<AnyAction>(
            this.epic(
                action$,
                new StateObservable<S>(new Subject(), this.state),
                null,
            ),
        );
    }
}
