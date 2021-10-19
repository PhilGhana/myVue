import { IAppModule } from './modules/AppModule';
import { ISocketModule } from './modules/SocketModule';

/**
 * 定義 Commit 動作的參數傳遞
 */

export namespace MutationTypes {
    /**
     * 使用者登入時
     */
    export namespace Login {
        export const Key = 'login';
        interface LoanItem {
            id: number;
            applyAmount: number;
            committedAt: string;
            status: 'review' | 'approved' | 'disapproved';
        }
        interface Wallet {
            money: number;
            settlement: number;
            loans: LoanItem[];
        }

        export interface Data {
            id: number;
            account: string;
            name: string;
            token: string;
            level: number;
            locked: number;
            views: View[];
            apis: string[];
            extend: null | {
                id: number;
                name: string;
                account: string;
                level: number;
                roleId: number;
            };
            role: {
                id: number;
                name: string;
                rank: number;
                fullIP: number;
                fullInfo: number;
            };
            franchisee: null | {
                id: number;
                name: string;
                baseMin: number | null;
                baseMax: number | null;
                host: string;
            };
            wallet: null | {
                money: number;
                settlement: number;
                loans: LoanItem[];
            };
            invitationCode: string;
            stgPlatform: boolean;
            functionMode: string;
            reviewWithdrawSingleStep: boolean;
            apiGroup: ApiGroup.Group[];
            hasExcludeTester: boolean;
            reviewHasSounds: boolean;
        }

        export interface View {
            id: number;
            name: string;
            className: string;
            order: number;
            parentId: number;
            path: string;
            type: number;
        }
    }

    /**
     * 使用者登出時
     */
    export namespace Logout {
        export const Key = 'logout';
    }

    export namespace Locale {
        export const Key = 'locale';
        export type Data = string;
    }

    export namespace UpdateNumLetterMessages {
        export const Key = 'update-num-letter-messages';
        export type Data = number;
    }

    export namespace ReloadWalletStatus {
        export const Key = 'reload-wallet-status';
        export type Data = boolean;
    }

    export namespace UpdateWallet {
        export const Key = 'update-wallet';

        interface LoanItem {
            id: number;
            applyAmount: number;
            committedAt: string;
            status: 'review' | 'approved' | 'disapproved';
        }
        export interface Data {
            money: number;
            settlement: number;
            loans: LoanItem[];
        }
    }

    export namespace ReloadFranchiseeOption {
        export const Key = 'reload-franchsee-option';
        export interface FranchiseeOption {
            id: number;
            name: string;
            baseMin: number | null;
            baseMax: number | null;
        }
        export interface Data {
            options: FranchiseeOption[];
        }
    }

    export namespace ChangeFranchisee {
        export const Key = 'change-franchisee';

        export interface Data {
            id: number;
        }
    }

    export namespace Socket {
        export namespace Connected {
            export const Key = 'socket-connected';
            export type Data = SocketIOClient.Socket;
        }

        export namespace Disconnected {
            export const Key = 'socket-disconnected';
        }

        export namespace Checking {
            export const Key = 'socket-checking';
        }

        export namespace Connecting {
            export const Key = 'socket-connecting';
            export type Data = number;
        }
        export namespace Message {
            export const Key = 'socket-message';
            export interface Data {
                type: ISocketModule.MessageType;
                content: string;
            }
        }
        export namespace UpdateReviews {
            export const Key = 'update-reviews';
            export type Data = NotificationItem[];
            interface NotificationItem {
                type: string;
                nums: number;
                fid: number;
                rid: number;
            }
        }

        export namespace UpdateOnlineAgents {
            export const Key = 'update-online-agents';
            export interface Data {
                franchiseeId: number;
                agents: number;
            }
        }

        export namespace UpdateOnlineMembers {
            export const Key = 'update-online-members';
            export interface Data {
                franchiseeId: number;
                members: number;
                base: number;
            }
        }
        export namespace UpdateOnlineAll {
            export const Key = 'update-online-all';
            export type Data = OnlineData[];
            interface OnlineData {
                franchiseeId: number;
                agents: number;
                members: number;
                base: number;
            }
        }

        export namespace ToggleWatchSyncReportQueue {
            export const Key = 'toggle-watch-sync-report-queue';
            export type Data = boolean;
        }

        export namespace UpdateSyncReportQueueAll {
            export const Key = 'update-sync-report-queue-all';
            export type Data = ISS.EmitterResponse.QueueItem[];
        }

        export namespace UpdateSyncReportQueue {
            export const Key = 'update-sync-report-queue';
            export type Data = ISS.EmitterResponse.QueueItem;
        }
        export namespace UpdateReviewingList {
            export const Key = 'update-reviewing-list';
            export type Data = ISS.EmitterResponse.UpdateReviewingList;
        }
        export namespace UpdateReviewingResult {
            export const Key = 'update-reviewing-result';
            export type Data = ISS.EmitterResponse.UpdateReviewingResult;
        }

        export namespace UpdateBanks {
            export const Key = 'update-banks';
            export type Data = NotificationItem[];

            interface NotificationItem {
                id: number;
                fid: number;
                type: 'deposit' | 'withdraw';
                cumulativeAmount: number;
                limitAmount: number;
            }
        }
        export namespace UpdateFullpay {
            export const Key = 'update-fullpay';
            export type Data = [];
        }
    }

    export namespace Notify {
        export namespace AddNotify {
            export const Key = 'message/add-notify';
            export interface Data {
                type: 'success' | 'info' | 'warning' | 'error';
                message: string;
                title?: string;
            }
        }

        export namespace ClearNofify {
            export const Key = 'message/clear-notify';
        }
    }

    export namespace Setting {
        export namespace ToggleUseMoneyFormat {
            export const Key = 'setting/toggle-use-money-format';
            export type Data = boolean;
        }
    }

    export namespace ApiGroup {
        export interface Group {
            path: string;
            enabled: boolean;
        }

        export const Key = 'api-group';
        export type Path = string;
    }

    export namespace SwitchReviewSounds {
        export const Key = 'switch-review-sounds';

        export enum SoundsType {
            On = 'on',
            Off = 'off',
        }
        export interface Data {
            option: SoundsType;
        }
    }
}
