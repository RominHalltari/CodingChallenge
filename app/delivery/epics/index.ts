import {
    FINISH_DELIVERY,
    FinishDeliveryAction,
    GET_DELIVERIES_LIST,
    SET_DELIVERY_FINISHED,
    setDeliveriesList,
    setDeliveriesListError,
    setDeliveryFinished,
    setFinishDeliveryError,
} from "app/delivery/actions/delivery";
import { combineEpics, Epic, ofType } from "redux-observable";
import { exhaustMap, mergeMap } from "rxjs/operators";

import { ApiError } from "app/api/errors";
import { apiRequest } from "app/api/rxjs";
import { handleError, logError } from "app/utils/rxjs";

import { requestDeliveriesList, requestFinishDelivery } from "app/delivery/api";
import { Delivery, DeliveryStatus } from "app/delivery/types";


function tryGetDeliveriesList() {
    return apiRequest(() => requestDeliveriesList(), {retryAttempts: 3});
}


function tryFinishDelivery(delivery: Delivery, status: DeliveryStatus) {
    return apiRequest(() => requestFinishDelivery(delivery, status), {retryAttempts: 3});
}

export const getDeliveriesListEpic: Epic = (action$) =>
    action$.pipe(
        ofType(GET_DELIVERIES_LIST, SET_DELIVERY_FINISHED),
        exhaustMap(() =>
            tryGetDeliveriesList().pipe(
                mergeMap((response) => [
                    setDeliveriesList(response),
                ]),
                handleError(ApiError, setDeliveriesListError),
                logError(),
            ),
        ),
    );

export const finishDeliveryEpic: Epic = (action$) =>
    action$.pipe(
        ofType(FINISH_DELIVERY),
        exhaustMap((action: FinishDeliveryAction) => (
                tryFinishDelivery(action.delivery, action.status).pipe(
                    mergeMap(() => [
                        setDeliveryFinished(),
                    ]),
                    handleError(ApiError, setFinishDeliveryError),
                    logError(),
                )
            ),
        ),
    );

export default combineEpics(
    getDeliveriesListEpic,
    finishDeliveryEpic,
);

