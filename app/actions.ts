import { Action } from "redux";

/* Error */
export const ERROR = "ERROR";
export type ERROR = typeof ERROR;

export interface LogErrorAction extends Action {
    context: string | null;
    message: string;
    stack: string | undefined;
    type: ERROR;
}

export function logError(
    error: Error,
    context: string | null,
): LogErrorAction {
    return {
        context,
        message: error.toString(),
        stack: error.stack,
        type: ERROR,
    };
}

/* Reset action */
export const RESET_STATE = "RESET_STATE";
export type RESET_STATE = typeof RESET_STATE;

export interface ResetStateAction extends Action {
    type: RESET_STATE;
}

export function resetState(): ResetStateAction {
    return {
        type: RESET_STATE,
    };
}

/* Minute tick */
export const MINUTE_TICK = "MINUTE_TICK";
export type MINUTE_TICK = typeof MINUTE_TICK;

export interface MinuteTickAction extends Action<MINUTE_TICK> {
}

export function minuteTick(): MinuteTickAction {
    return {
        type: MINUTE_TICK,
    };
}
