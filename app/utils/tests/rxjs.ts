/* tslint:disable:max-classes-per-file */

import { Observable } from "rxjs";
import { toArray } from "rxjs/operators";


export const expectObservable = <R>(
    observable: Observable<R>,
) => {
    return new ObservableTest(observable);
};


class ObservableTest<R> {

    constructor(
        private readonly observable: Observable<R>,
    ) {}

    /**
     * Expects that the test callback runs succesfully after the observable is
     * done. If the test callback throws any errors (such as expects), the
     * test will fail.
     */
    public to = (
        test: (output: R[]) => void,
        done: jest.DoneCallback,
    ) => {
        this.observable.pipe(
            toArray(),
        ).subscribe(
            (resultList) => {
                try {
                    test(resultList),
                    done();
                } catch (e) {
                    done.fail(e);
                }
            },
            done.fail,
        );
    }

    /**
     * Expects that the array of output emitted by the observables equals the
     * specified output.
     */
    public toEmit = (
        expected: R[],
        done: jest.DoneCallback,
    ) => {
        return this.to((resultList) => {
            expect(resultList).toEqual(expected);
        }, done);
    }

    /**
     * Expects that the observable will not emit any output.
     */
    public toEmitNothing = (
        done: jest.DoneCallback,
    ) => {
        return this.to((resultList) => {
            expect(resultList).toHaveLength(0);
        }, done);
    }
}
