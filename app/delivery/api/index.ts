import { postData, requestData } from "app/api/client";
import { Delivery, DeliveryStatus } from "app/delivery/types";
import BuildConfig from "app/settings/build-config";

export async function requestDeliveriesList() {
    return await requestData(`${BuildConfig.BASE_URL}/deliveries`);
}

export async function requestFinishDelivery(delivery: Delivery, status: DeliveryStatus) {
    const {id, latitude, longitude} = delivery;
    return await postData(`${BuildConfig.BASE_URL}/finishDelivery`, {}, {
        deliveryId: id,
        latitude,
        longitude,
        status,
    });
}
