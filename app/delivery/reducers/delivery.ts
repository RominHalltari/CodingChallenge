import { combineReducers } from "redux";

import { apiCallReducer } from "app/api/reducers";
import * as actions from "app/delivery/actions/delivery";
import {
    SET_ACTIVE_DELIVERY_ID,
    SET_DELIVERIES_LIST,
    SET_SELECTED_DELIVERY,
    SetActiveDeliveryIdAction,
    SetDeliveriesListAction,
    SetSelectedDeliveryAction,
} from "app/delivery/actions/delivery";
import { Delivery } from "app/delivery/types";

export function deliveries(state: Delivery[] = [], action: SetDeliveriesListAction): Delivery[] {
    switch (action.type) {
        case SET_DELIVERIES_LIST:
            return action.deliveriesList;
        default:
            return state;
    }
}

export function activeDeliveryId(state: string | null = null, action: SetActiveDeliveryIdAction): string | null {
    switch (action.type) {
        case SET_ACTIVE_DELIVERY_ID:
            return action.deliveryId;
        default:
            return state;
    }
}

export function selectedDelivery(state: Delivery | null = null, action: SetSelectedDeliveryAction): Delivery | null {
    switch (action.type) {
        case SET_SELECTED_DELIVERY:
            return action.delivery;
        default:
            return state;
    }
}

export default combineReducers({
    activeDeliveryId,
    deliveries,
    selectedDelivery,

    requestDeliveriesList: apiCallReducer<
        actions.GetDeliveriesListAction,
        actions.SetDeliveriesListAction,
        actions.SetDeliveriesListError
        >(
        actions.GET_DELIVERIES_LIST,
        actions.SET_DELIVERIES_LIST,
        actions.SET_DELIVERIES_LIST_ERROR,
    ),
    requestFinishDelivery: apiCallReducer<
        actions.FinishDeliveryAction,
        actions.SetDeliveryFinishedAction,
        actions.SetDeliveryFinishErrorAction
        >(
        actions.FINISH_DELIVERY,
        actions.SET_DELIVERY_FINISHED,
        actions.SET_DELIVERY_FINISH_ERROR,
    ),
});
