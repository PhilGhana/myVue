export namespace SocketTypes {
    export namespace Connect {
        export const EventName = 'connect';
    }

    export namespace Disconnect {
        export const EventName = 'disconnect';
    }

    export namespace Reconnecting {
        export const EventName = 'reconnecting';
        export type Data = number;
    }

    export namespace Error {
        export const EventName = 'error-message';
        export interface Data {
            errorMessage: string;
        }
    }

    export namespace ReconnectFailed {
        export const EventName = 'reconnect_failed';
    }
    export namespace UpdateReviews {
        export const EventName = 'update-reviews';
        export interface Data {
            franchiseeId: number;
            roleId: number;
            type: string;
            nums: number;
        }
    }
    export namespace LoginSuccess {
        export const EventName = 'login-success';
    }
    export namespace ResetReviews {
        export const EventName = 'reset-reviews';
        export interface Data {
            type?: string;
        }
    }

    export namespace UpdateBanks {
        export const EventName = 'update-banks';
        export interface Data {
            id: number;
            fid: number;
            type: 'deposit' | 'withdraw';
            cumulativeAmount: number;
            limitAmount: number;
        }
    }
}
