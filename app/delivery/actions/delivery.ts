import { ApiError } from "app/api/errors";
import { SetErrorAction } from "app/api/types";
import { Delivery, DeliveryStatus } from "app/delivery/types";
import { Action } from "redux";

export const GET_DELIVERIES_LIST = "deliveries.GET_DELIVERIES_LIST";
export const SET_DELIVERIES_LIST = "deliveries.SET_DELIVERIES_LIST";
export const SET_DELIVERIES_LIST_ERROR = "deliveries.SET_DELIVERIES_LIST_ERROR";
export const FINISH_DELIVERY = "deliveries.FINISH_DELIVERY";
export const SET_DELIVERY_FINISHED = "deliveries.SET_DELIVERY_FINISHED";
export const SET_DELIVERY_FINISH_ERROR = "deliveries.SET_DELIVERY_FINISH_ERROR";
export const SET_ACTIVE_DELIVERY_ID = "deliveries.SET_ACTIVE_DELIVERY_ID";
export const SET_SELECTED_DELIVERY = "deliveries.SET_SELECTED_DELIVERY";

export type GET_DELIVERIES_LIST = typeof GET_DELIVERIES_LIST;
export type SET_DELIVERIES_LIST = typeof SET_DELIVERIES_LIST;
export type SET_DELIVERIES_LIST_ERROR = typeof SET_DELIVERIES_LIST_ERROR;
export type FINISH_DELIVERY = typeof FINISH_DELIVERY;
export type SET_DELIVERY_FINISHED = typeof SET_DELIVERY_FINISHED;
export type SET_DELIVERY_FINISH_ERROR = typeof SET_DELIVERY_FINISH_ERROR;
export type SET_ACTIVE_DELIVERY_ID = typeof SET_ACTIVE_DELIVERY_ID;
export type SET_SELECTED_DELIVERY = typeof SET_SELECTED_DELIVERY;


// Deliveries list

export interface GetDeliveriesListAction extends Action<GET_DELIVERIES_LIST> {}

export interface SetDeliveriesListAction extends Action<SET_DELIVERIES_LIST> {
    deliveriesList: Delivery[];
}

export interface SetDeliveriesListError extends SetErrorAction<SET_DELIVERIES_LIST_ERROR> {}

export function getDeliveriesList(): GetDeliveriesListAction {
      return {
          type: GET_DELIVERIES_LIST,
      };
}

export function setDeliveriesList(
    deliveriesList: Delivery[],
): SetDeliveriesListAction {
    return {
        deliveriesList,
        type: SET_DELIVERIES_LIST,
    };
}

export function setDeliveriesListError(
    error: Error | ApiError,
): SetDeliveriesListError {
    return {
        type: SET_DELIVERIES_LIST_ERROR,

        code: error instanceof ApiError ? error.code : "Error",
        message: error.toString(),
  };
}

// Finish delivery

export interface FinishDeliveryAction extends Action<FINISH_DELIVERY> {
    delivery: Delivery;
    status: DeliveryStatus;
}

export interface SetDeliveryFinishedAction extends Action<SET_DELIVERY_FINISHED> {}

export interface SetDeliveryFinishErrorAction extends SetErrorAction<SET_DELIVERY_FINISH_ERROR> {}

export function finishDelivery(delivery: Delivery, status: DeliveryStatus): FinishDeliveryAction {
    return {
        type: FINISH_DELIVERY,

        delivery,
        status,
    };
}

export function setDeliveryFinished(): SetDeliveryFinishedAction {
    return {
        type: SET_DELIVERY_FINISHED,
    };
}

export function setFinishDeliveryError(
    error: Error | ApiError,
): SetDeliveryFinishErrorAction {
    return {
        type: SET_DELIVERY_FINISH_ERROR,

        code: error instanceof ApiError ? error.code : "Error",
        message: error.toString(),
    };
}

// Active delivery

export interface SetActiveDeliveryIdAction extends Action<SET_ACTIVE_DELIVERY_ID> {
    deliveryId: string | null;
}


export function setActiveDeliveryId(deliveryId: string | null): SetActiveDeliveryIdAction {
    return {
        deliveryId,
        type: SET_ACTIVE_DELIVERY_ID,
    };
}


// Selected delivery

export interface SetSelectedDeliveryAction extends Action<SET_SELECTED_DELIVERY> {
    delivery: Delivery;
}


export function setSelectedDelivery(delivery: Delivery): SetSelectedDeliveryAction {
    return {
        delivery,
        type: SET_SELECTED_DELIVERY,
    };
}
