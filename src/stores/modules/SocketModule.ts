import { Module, MutationTree } from 'vuex';
import { RootStore } from '@/store';
import i18n from '@/i18n';
import { MutationTypes } from '../mutation-types.interface';

export namespace ISocketModule {
    export enum SocketStatus {
        Connected = 'connected',
        Checking = 'checking',
        Disconnected = 'disconnected',
        Reconnecting = 'reconnecting',
    }

    export enum MessageType {
        Info = 'info',
        Success = 'success',
        Warning = 'warning',
        Error = 'error',
    }

    export interface Message {
        type: MessageType;
        content: string;
    }

    export interface Online {
        franchiseeId: number;
        agents: number;
        members: number;
        base: number;
    }

    export interface SyncReportQueue {
        platform: {
            id: number;
            name: string;
        };
        lastTime: string;
        executeAt: string;
        running: boolean;
    }

    export interface ReviewingList {
        reviewTypeKey: string;
        rid: any;
    }
    export interface ReviewingResult {
        reviewTypeKey: string;
        rid: any;
    }
    export interface State {
        socket: SocketIOClient.Socket | null;
        status: SocketStatus;
        message: Message;
        onlines: Online[];
        reviewingList: ReviewingList;
        reviewingResult: ReviewingResult;
        syncReport: {
            watch: boolean;
            queues: SyncReportQueue[];
        };
    }
}

const updateOnline = (
    state: ISocketModule.State,
    data: { franchiseeId: number; agents?: number; members?: number; base?: number },
) => {
    let online = state.onlines.find((o) => o.franchiseeId === data.franchiseeId);
    if (!online) {
        online = {
            agents: 0,
            members: 0,
            base: 0,
            franchiseeId: data.franchiseeId,
        };
        state.onlines.push(online);
    }
    Object.assign(online, data);
};

const mutations: MutationTree<ISocketModule.State> = {
    /* 已連至 server, 登入驗證中 */
    [MutationTypes.Socket.Checking.Key](state) {
        state.status = ISocketModule.SocketStatus.Checking;
    },
    /* 連線並登入成功 */
    [MutationTypes.Socket.Connected.Key](state, socket: MutationTypes.Socket.Connected.Data) {
        state.status = ISocketModule.SocketStatus.Connected;
        state.socket = socket;
        // state.socket = socket;
    },
    /* 重新連線 */
    [MutationTypes.Socket.Connecting.Key](state) {
        state.status = ISocketModule.SocketStatus.Reconnecting;
        state.socket = null;
    },
    /* 連線中斷 */
    [MutationTypes.Socket.Disconnected.Key](state) {
        state.status = ISocketModule.SocketStatus.Disconnected;
        state.socket = null;
    },
    [MutationTypes.Socket.Message.Key](state, data?: MutationTypes.Socket.Message.Data) {
        state.message = data
            ? { ...data }
            : {
                type: ISocketModule.MessageType.Info,
                content: '',
            };
    },
    [MutationTypes.Socket.UpdateOnlineAgents.Key](state, data: MutationTypes.Socket.UpdateOnlineAgents.Data) {
        updateOnline(state, { franchiseeId: data.franchiseeId, agents: data.agents });
    },
    [MutationTypes.Socket.UpdateOnlineMembers.Key](state, data: MutationTypes.Socket.UpdateOnlineMembers.Data) {
        updateOnline(state, { franchiseeId: data.franchiseeId, members: data.members, base: data.base });
    },
    [MutationTypes.Socket.ToggleWatchSyncReportQueue.Key](
        state,
        data: MutationTypes.Socket.ToggleWatchSyncReportQueue.Data,
    ) {
        state.syncReport.watch = data === true;
    },
    [MutationTypes.Socket.UpdateOnlineAll.Key](state, data: MutationTypes.Socket.UpdateOnlineAll.Data) {
        state.onlines = data.map<ISocketModule.Online>((o) => ({ ...o }));
    },
    [MutationTypes.Socket.UpdateSyncReportQueueAll.Key](
        state,
        data: MutationTypes.Socket.UpdateSyncReportQueueAll.Data,
    ) {
        state.syncReport.queues = [...data];
    },
    [MutationTypes.Socket.UpdateSyncReportQueue.Key](state, data: MutationTypes.Socket.UpdateSyncReportQueue.Data) {
        const find = state.syncReport.queues.find((o) => o.platform.id === data.platform.id);
        if (find) {
            Object.assign(find, data);
        }
    },
    [MutationTypes.Socket.UpdateReviewingList.Key](state, data: MutationTypes.Socket.UpdateReviewingList.Data) {
        Object.assign(state.reviewingList, data);
    },
    [MutationTypes.Socket.UpdateReviewingResult.Key](state, data: MutationTypes.Socket.UpdateReviewingResult.Data) {
        Object.assign(state.reviewingResult, data);
    },
};

const module: Module<ISocketModule.State, RootStore> = {
    mutations,
    state: {
        status: ISocketModule.SocketStatus.Disconnected,
        socket: null,
        message: {
            type: ISocketModule.MessageType.Info,
            content: '',
        },
        onlines: [],
        reviewingList: {
            reviewTypeKey: '',
            rid: [],
        },
        reviewingResult: {
            reviewTypeKey: '',
            rid: '',
        },
        syncReport: {
            queues: [],
            watch: false,
        },
    },
};

export default module;
