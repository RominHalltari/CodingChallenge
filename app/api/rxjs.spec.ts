import { of } from "rxjs";

import { ConnectionError } from "app/api/errors";
import * as rxjs from "app/utils/rxjs";

import { apiRequest } from "./rxjs";

describe("apiRequest", () => {
    const retry = jest.spyOn(rxjs, "retry").mockImplementation(() => of({}));
    const initiateRequest = async () => null;

    it("calls retry with proper defaults", () => {
        apiRequest(initiateRequest);
        expect(retry).toHaveBeenCalledWith(
            initiateRequest,
            {
                retryAttempts: null,
                retryInterval: 1000,
                retryOn: [ConnectionError],
            },
        );
    });

    it("accepts options", () => {
        apiRequest(initiateRequest, {
            retryAttempts: 5,
            retryInterval: 10,
            retryOn: [ConnectionError, Error],
        });
        expect(retry).toHaveBeenCalledWith(
            initiateRequest,
            {
                retryAttempts: 5,
                retryInterval: 10,
                retryOn: [ConnectionError, Error],
            },
        );
    });

    it("accepts partial options", () => {
        apiRequest(initiateRequest, {retryAttempts: 5});
        expect(retry).toHaveBeenCalledWith(
            initiateRequest,
            {
                retryAttempts: 5,
                retryInterval: 1000,
                retryOn: [ConnectionError],
            },
        );
    });

});
