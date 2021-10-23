export interface User {
    readonly id: string;
}

export interface ChatMessage {
    readonly id: string;
    readonly key: string;
    readonly userId: string;
    readonly text: string;
    readonly createdAt: Date;
    readonly sending: boolean;
    readonly error: boolean;
}
