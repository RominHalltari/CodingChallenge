import reducer from "app/delivery/reducers";
import { State } from "app/modules";


export const getDeliveriesState = (state: State): ReturnType<typeof reducer> => state.delivery;

export const getDeliveriesList = (state: State) =>
    getDeliveriesState(state).delivery.deliveries;

export const getIsRequestingDeliveries = (state: State) =>
    getDeliveriesState(state).delivery.requestDeliveriesList.requesting;

export const getRequestDeliveriesListError = (state: State) =>
    getDeliveriesState(state).delivery.requestDeliveriesList.error;

export const getIsRequestingFinishDelivery = (state: State) =>
    getDeliveriesState(state).delivery.requestFinishDelivery.requesting;

export const getRequestFinishDeliveryError = (state: State) =>
    getDeliveriesState(state).delivery.requestFinishDelivery.error;

export const getActiveDeliveryId = (state: State) =>
    getDeliveriesState(state).delivery.activeDeliveryId;

export const getSelectedDelivery = (state: State) =>
    getDeliveriesState(state).delivery.selectedDelivery;
