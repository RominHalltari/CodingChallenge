export interface Delivery {
    id: string;
    address: string;
    city: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    customer: string;
}

export enum DeliveryStatus {
    DELIVERED = "delivered",
    UNDELIVERED = "undelivered",
}
