import SocketIO from 'socket.io-client';
import store from '@/store';
import { Watch } from 'vue-property-decorator';
import { MutationTypes } from '../mutation-types.interface';
import { ISocketModule } from '../modules/SocketModule';
import { SocketTypes } from '../socket-types';
import config from '@/config';
import notify from './notify';
import { Ajax } from '../actions';
import { ApiPath } from '@/api';

let socket: SocketIOClient.Socket | null = null;

const client = () => {
    if (!socket) {
        throw new Error('empty socket');
    }
    return socket;
};

export default {
    connect() {
        // console.log(process.env.SOCKET_HOST);
        // const host = process.env.SOCKET_HOST || '';
        // if (process.env.NODE_ENV === 'development') {
        //     return;
        // }
        const { host, port } = config.ServerSocket;
        const url = port ? `${host}:${port}/agent` : `${host}/agent`;
        const io = SocketIO(url, {
            query: {
                id: store.state.App.user.id,
                token: store.state.App.user.token,
            },
            secure: true,
            // reconnectionAttempts: 3,
            transports: ['websocket'],
        });

        store.commit(MutationTypes.Socket.Connecting.Key, {});
        store.commit(MutationTypes.Socket.Message.Key, {
            type: ISocketModule.MessageType.Warning,
            content: `connecting ... `,
        });

        io.on('logout', () => {
            io.disconnect();
            return Ajax.get(ApiPath.ApiPublicLogout).then(() => {
                store.commit(MutationTypes.Logout.Key);
            });
        });

        io.on('error-message', (message) => {
            notify.error(message);
        });

        io.on('warning-message', (message) => {
            notify.warning(message);
        });

        io.on('reconnect_attempt', (times) => {
            store.commit(MutationTypes.Socket.Connecting.Key);
            store.commit(MutationTypes.Socket.Message.Key, {
                type: ISocketModule.MessageType.Warning,
                content: `reconnecting ... ${times}`,
            });
        });

        io.on('reconnect_failed', () => {
            store.commit(MutationTypes.Socket.Disconnected.Key);
            store.commit(MutationTypes.Socket.Message.Key, {
                type: ISocketModule.MessageType.Error,
                content: `cannot connect to server.`,
            });
        });

        io.on('disconnect', () => {
            store.commit(MutationTypes.Socket.Disconnected.Key);
            store.commit(MutationTypes.Socket.Message.Key, {
                type: ISocketModule.MessageType.Error,
                content: `cannot connect to server , please Reconnecting.`,
            });
        });

        io.on('login-success', () => {
            /* 帳號驗證成功 */
            store.commit(MutationTypes.Socket.Connected.Key);
            store.commit(MutationTypes.Socket.Message.Key, {
                type: ISocketModule.MessageType.Success,
                content: `connect Success`,
            });
            socket = io;
        });

        io.on('review/update', (data) => {
            const rows: MutationTypes.Socket.UpdateReviews.Data = data.map((o) => {
                return {
                    fid: Number(o.fid),
                    rid: Number(o.rid),
                    nums: Number(o.nums),
                    type: o.type,
                };
            });
            store.commit(MutationTypes.Socket.UpdateReviews.Key, rows);
        });

        io.on('letter/update-num-messages', (nums) => {
            store.commit(MutationTypes.UpdateNumLetterMessages.Key, nums);
        });

        io.on('online/all', (data) => {
            store.commit(MutationTypes.Socket.UpdateOnlineAll.Key, data);
        });

        io.on('online/members', ({ franchiseeId, base, members }) => {
            store.commit(MutationTypes.Socket.UpdateOnlineMembers.Key, { franchiseeId, base, members });
        });

        io.on('online/agents', ({ franchiseeId, agents }) => {
            store.commit(MutationTypes.Socket.UpdateOnlineAgents.Key, { franchiseeId, agents });
        });

        io.on('sync-report/queues', (queues) => {
            if (store.state.Socket.syncReport.watch) {
                store.commit(MutationTypes.Socket.UpdateSyncReportQueueAll.Key, queues);
            } else {
                this.unwatchSyncReportQueue();
            }
        });

        io.on('sync-report/queue', (queue) => {
            if (store.state.Socket.syncReport.watch) {
                store.commit(MutationTypes.Socket.UpdateSyncReportQueue.Key, queue);
            } else {
                this.unwatchSyncReportQueue();
            }
        });

        io.on('reviewing/list', (data) => {
            store.commit(MutationTypes.Socket.UpdateReviewingList.Key, data);
        });

        io.on('reviewing/result', (data) => {
            store.commit(MutationTypes.Socket.UpdateReviewingResult.Key, data);
        });

        io.on('bank/update', (data) => {
            const rows: MutationTypes.Socket.UpdateBanks.Data = data.map((o) => {
                return {
                    id: Number(o.id),
                    fid: Number(o.fid),
                    type: o.type,
                    cumulativeAmount: Number(o.cumulativeAmount),
                    limitAmount: Number(o.limitAmount),
                };
            });
            store.commit(MutationTypes.Socket.UpdateBanks.Key, rows);
        });
        io.on('fullpay/update', (data: any) => {
            const rows = JSON.parse(data);
            store.commit(MutationTypes.Socket.UpdateFullpay.Key, rows);
        });
    },
    refreshReviews() {
        return new Promise<void>((resolve, reject) => {
            client().emit('review/refresh', (result) => {
                if (result) {
                    notify.error(result);
                    return;
                }
                resolve();
            });
        });
    },
    refreshOnlines(fid: number) {
        return new Promise<void>((resolve) => {
            client().emit('online/refresh', fid, (result) => {
                if (result) {
                    notify.error(result);
                    return;
                }
                resolve();
            });
        });
    },
    setOnlineBase(fid: number, nums: number) {
        return new Promise<void>((resolve) => {
            client().emit('online/base-nums-member', { franchiseeId: fid, nums }, (result) => {
                if (result) {
                    notify.error(result);
                }
                resolve();
            });
        });
    },

    getOnlineAgents(fid: number): Promise<ISS.EmitterResponse.OnlineUser[]> {
        return new Promise((resolve) => {
            client().emit('online/agents', fid, (agents) => {
                resolve(agents);
            });
        });
    },
    getOnlineMembers(fid: number): Promise<ISS.EmitterResponse.OnlineUser[]> {
        return new Promise((resolve) => {
            client().emit('online/members', fid, (members) => {
                resolve(members);
            });
        });
    },
    logoutAgent(id: number, token: string): Promise<void> {
        return new Promise((resolve) => {
            client().emit('online/logout-agent', { id, token }, (response) => {
                resolve();
            });
        });
    },
    logoutMember(id: number, token: string): Promise<void> {
        return new Promise((resolve) => {
            client().emit('online/logout-member', { id, token }, (response) => {
                resolve();
            });
        });
    },
    watchSyncReportQueue() {
        store.commit(MutationTypes.Socket.ToggleWatchSyncReportQueue.Key, true);
        client().emit('sync-report/watch', () => {
            // 操作完成
        });
    },
    unwatchSyncReportQueue() {
        store.commit(MutationTypes.Socket.ToggleWatchSyncReportQueue.Key, false);
        client().emit('sync-report/unwatch', () => {
            // 操作完成
        });
    },
    reviewingUpdate(fid: number, reviewTypeKey: string, rid: number, type: string, status: string, memberId: number) {
        return new Promise<void>((resolve) => {
            client().emit('reviewing/update', { fid, reviewTypeKey, rid, type, status, memberId }, (result: any) => {
                if (result) {
                    notify.error(result);
                    return;
                }
                resolve();
            });
        });
    },
    reviewingApprove(fid: number, reviewTypeKey: string, memberId: number) {
        return new Promise<void>((resolve) => {
            client().emit('reviewing/approve', { fid, reviewTypeKey, memberId }, (result: any) => {
                if (result) {
                    notify.error(result);
                    return;
                }
                resolve();
            });
        });
    },
    reviewingGetList(reviewTypeKey: string) {
        return new Promise<void>((resolve) => {
            client().emit('reviewing/getList', { reviewTypeKey }, (result: any) => {
                if (result) {
                    notify.error(result);
                    return;
                }
                resolve();
            });
        });
    },
    changeReviewSetting(fid: number) {
        return new Promise<void>((resolve) => {
            client().emit('changeReviewSetting', { fid }, (result: any) => {
                if (result) {
                    notify.error(result);
                    return;
                }
                resolve();
            });
        });
    },
    agentSendLetter(letterAnnouncementId: number) {
        return new Promise<void>((resolve) => {
            client().emit('agentSendLetter', { letterId: letterAnnouncementId }, (result: any) => {
                if (result) {
                    notify.error(result);
                    return;
                }
                resolve();
            });
        });
    },
    // 更新遊戲維護狀態
    gameMaintainUpdate(id: any, mStatus: number, pid: number, enabled?: number) {
        return new Promise<void>((resolve) => {
            client().emit('game/maintain/update', {
                gameId: id, maintain: mStatus, platformId: pid, enabled,
            }, (result: any) => {
                if (result) {
                    notify.error(result);
                    return;
                }
                resolve();
            });
        });
    },
    // 更新平台維護狀態
    gamePlatformMaintainUpdate(
        id: any,
        maintainStatus: number,
        enabled?: number | null,
        limit?: number,
        members?: any,
        maintainCrontab?: string | null,
        maintainMinute?: number | null,
        disposableMaintainDate?: string | null,
        disposableMaintain?: number | null,
    ) {
        if (limit === 0) {
            members = [];
        }
        return new Promise<void>((resolve) => {
            client().emit('platform/maintain/update', {
                platformId: id,
                maintain: maintainStatus,
                enabled,
                limit,
                members,
                maintainCrontab,
                maintainMinute,
                disposableMaintainDate,
                disposableMaintain,
            }, (result: any) => {
                if (result) {
                    notify.error(result);
                    return;
                }
                resolve();
            });
        });
    },
    disconnect() {
        if (socket) {
            socket.disconnect();
        }
    },
};
