/* interface socket service */
declare namespace ISS {
    namespace ListenerData {
        interface ReviewUpdateData {
            fid: number;
            rid: number;
            nums: number;
            type: string;
        }

        interface BankUpdateData {
            id: number;
            fid: number;
            type: 'deposit' | 'withdraw';
            cumulativeAmount: number;
            limitAmount: number;
        }
    }

    namespace EmitterResponse {
        interface OnlineUser {
            id: number;
            token: string;
            ip: string;
            loginAt: string;
        }

        interface QueueItem {
            platform: {
                id: number;
                name: string;
            };
            retry: number;
            lastTime: string;
            executeAt: string;
            running: boolean;
        }
        interface UpdateReviewingList {
            reviewTypeKey: string;
            rid: any;
        }
        interface UpdateReviewingResult {
            reviewTypeKey: string;
            rid: any
        }
    }
}

declare namespace SocketIOClient {
    type EmitterResponse<T = any> = (done?: T) => void;

    interface Socket {
        on(event: 'login-success', listener: () => void): this;

        on(event: 'logout', listener: () => void): this;

        on(event: 'error-message', listener: (message: string) => void): this;

        on(event: 'warning-message', listener: (message: string) => void): this;

        on(event: 'review/update', listener: (data: ISS.ListenerData.ReviewUpdateData[]) => void): this;
        emit(event: 'review/refresh', response: (result?: string) => void): boolean;

        on(event: 'letter/update-num-messages', listener: (nums: number) => void): this;

        /** 監聽銀行卡限額 */
        on(event: 'bank/update', listener: (data: ISS.ListenerData.BankUpdateData[]) => void): this;

        /** 監聽三方通道限額 */
        on(event: 'fullpay/update', listener: (data: string[]) => void): this;

        /** online service */
        /* 代理端在線人數 */
        on(event: 'online/agents', listener: (data: { franchiseeId: number; agents: number }) => void): this;

        /* 會員端在線人數 */
        on(
            event: 'online/members',
            listener: (data: { franchiseeId: number; members: number; base: number }) => void,
        ): this;

        /* 所有在線人數 */
        on(
            event: 'online/all',
            listener: (data: { franchiseeId: number; members: number; agents: number; base: number }[]) => void,
        ): this;

        /* 監聽審核中的頁面 */
        on(
            event: 'reviewing/list',
            listener: (data: { reviewTypeKey: string, rid: any }) => void,
        ): this;

        /** 監聽審核通過的事件 */
        on(
            event: 'reviewing/result',
            listener: (data: ISS.EmitterResponse.UpdateReviewingResult) => void,
        ): this;

        /** online service */
        /* 刷新線上人數 */
        emit(event: 'online/refresh', fid: number, response: EmitterResponse<string>): boolean;

        /* 設定會員在線灌水人數 */
        emit(
            event: 'online/base-nums-member',
            data: { franchiseeId: number; nums: number },
            response: EmitterResponse<string>,
        ): boolean;

        /* 取得登入的代理 id 陣列 */
        emit(event: 'online/agents', fid: number, response: EmitterResponse<ISS.EmitterResponse.OnlineUser[]>): boolean;

        /* 取得登入的會員 id 陣列 */
        emit(
            event: 'online/members',
            fid: number,
            response: EmitterResponse<ISS.EmitterResponse.OnlineUser[]>,
        ): boolean;

        /* 將控端成員登出 */
        emit(event: 'online/logout-agent', data: { id: number; token: string }, response: EmitterResponse): boolean;

        /* 將會員登出 */
        emit(event: 'online/logout-member', data: { id: number; token: string }, response: EmitterResponse): boolean;

        /* 查詢報表同步資訊 */
        emit(event: 'sync-report/watch', response: EmitterResponse): boolean;

        /* 查詢報表同步資訊 */
        emit(event: 'sync-report/unwatch', response: EmitterResponse): boolean;

        /* 拉報表服務狀態同步 (所有平台服務狀態同步) */
        on(event: 'sync-report/queues', listener: (data: ISS.EmitterResponse.QueueItem[]) => void): this;

        /* 拉報表服務狀態同步 (單平台服務狀態同步) */
        on(event: 'sync-report/queue', listener: (data: ISS.EmitterResponse.QueueItem) => void): this;
    }
}
