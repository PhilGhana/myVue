import { Module, MutationTree, Mutation, ActionContext, mapActions, GetterTree } from 'vuex';
import store, { RootStore } from '@/store';
import { MutationTypes } from '../mutation-types.interface';
import { stat } from 'fs';
import { ApiPath } from '@/api';

export namespace IAppModule {
    export enum ViewType {
        Menu = 0,
        Link = 1,
    }

    export interface View {
        id: number;
        name: string;
        className: string;
        order: number;
        parentId: number;
        path: string;
        type: ViewType;
    }

    export interface ViewTree extends View {
        childrens: View[];
        code: string;
    }

    export interface WalletLoanItem {
        id: number;
        applyAmount: number;
        committedAt: string;
        status: 'review' | 'approved' | 'disapproved';
    }

    // type K1 = Extract<keyof ApiPath, string>;
    export type ApiPathKeys = keyof typeof ApiPath;
    export type AllowApi = { [key in ApiPathKeys]: boolean };

    export enum ReviewType {
        AgentCoupon = 'AgentCoupon',
        AgentCompensatory = 'AgentCompensatory',
        AgentLoan = 'AgentLoan',
        MemberBank = 'MemberBank',
        MemberCoupon = 'MemberCoupon',
        MemberDepositBank = 'MemberDepositBank',
        MemberWithdraw = 'MemberWithdraw',
        MemberInformation = 'MemberInformation',
        MemberRegister = 'MemberRegister',
        MemberQuest = 'MemberQuest',
        MemberTransaction = 'MemberTransaction',
        ReviewAgentEditDeposit = 'AgentEditDeposit',
        ReviewAgentThirdDeposit = 'ThirdPartyDeposit',
        ReviewMemberActivityWallet = 'MemberActivityWallet',
    }

    export interface ReviewNotification {
        fid: number;
        rid: number;
        type: ReviewType;
        nums: number;
    }

    export interface BankNotification {
        id: number;
        fid: number;
        type: 'deposit' | 'withdraw';
        cumulativeAmount: number;
        limitAmount: number;
    }
    export interface User {
        id: number;
        account: string;
        name: string;
        token: string;
        level: number;
        locked: number;
        role: {
            id: number;
            name: string;
            rank: number;
            fullIP: boolean;
            fullInfo: boolean;
        };
        extend: {
            id: number;
            account: string;
            name: string;
            level: number;
            roleId: number;
        };
        franchisee: {
            id: number;
            name: string;
            host: any | null;
        };
        wallet: {
            loading: boolean;
            money: number;
            settlement: number;
            loans: WalletLoanItem[];
        };
        isCompany: boolean;
        isSubAgent: boolean;
        invitationCode: any | null;
        reviewHasSounds: MutationTypes.SwitchReviewSounds.SoundsType;
    }

    export interface FranchiseeOption {
        id: number;
        name: string;
        baseMin: number | null;
        baseMax: number | null;
    }

    export interface State {
        /* 是否完成 init 更新 */
        initFinish: boolean;

        /* 語系 */
        locale: string;

        user: User;

        apis: string[];

        views: View[];

        /* 各 API 是否允許訪問 */
        allowApi: any;

        franchiseeOptions: FranchiseeOption[];

        currentFranchiseeId: number;

        reviewNotifications: ReviewNotification[];

        numLetterMessages: number;

        stgPlatform: boolean;

        reviewingList: ReviewingList;

        reviewingResult: ReviewingResult;

        bankNotifications: BankNotification[];

        fullpayNotifications: BankNotification[];

        functionMode: string;

        reviewWithdrawSingleStep: boolean;

        apiGroup: MutationTypes.ApiGroup.Group[];

        hasExcludeTester: boolean;
    }
    export interface ReviewingList {
        reviewTypeKey: string;
        rid: any;
    }
    export interface ReviewingResult {
        reviewTypeKey: string;
        rid: any;
    }
}

const resetAlloWApi = (): IAppModule.AllowApi => {
    const res: any = {};
    Object.keys(ApiPath).forEach((key) => {
        res[key as IAppModule.ApiPathKeys] = false;
    });
    return res;
};

const reloadAllowApi = (path: string): MutationTypes.ApiGroup.Group[] => {
    const res: any = [];
    const view: any = store.state.App.views.find((v) => v.path === path);

    if (view === undefined) {
        return res;
    }

    const viewId = view.id.toString();
    let allowApis: any = [];

    for (const [key, group] of Object.entries(store.state.App.apiGroup)) {
        if (viewId === key) {
            allowApis = group;
            break;
        }
    }

    const paths = Object.entries(ApiPath);
    allowApis.map((o: MutationTypes.ApiGroup.Group) => {
        const findPath = paths.find((p) => p[1] === o.path);

        if (findPath) {
            res[findPath[0]] = o.enabled ? true : false;
        }
    });

    return res;
};

const mutations: MutationTree<IAppModule.State> = {
    [MutationTypes.Login.Key](state: IAppModule.State, data: MutationTypes.Login.Data) {
        state.initFinish = true;

        state.user.id = data.id;
        state.user.account = data.account;
        state.user.name = data.name;
        state.user.role.id = data.role.id;
        state.user.role.name = data.role.name;
        state.user.role.rank = data.role.rank;
        state.user.role.fullIP = Number(data.role.fullIP) === 1;
        state.user.role.fullInfo = Number(data.role.fullInfo) === 1;
        state.user.token = data.token;
        state.user.level = data.level;
        state.user.locked = data.locked;

        state.user.isCompany = data.level === 0;
        state.user.isSubAgent = !!(data.extend && data.extend.id > 0);

        state.user.extend.id = 0;
        state.user.extend.name = '';
        state.user.extend.account = '';
        state.user.extend.level = 0;
        if (data.invitationCode) {
            state.user.invitationCode = data.invitationCode;
        }

        if (data.extend) {
            state.user.extend.id = data.extend.id;
            state.user.extend.name = data.extend.name;
            state.user.extend.account = data.extend.account;
            state.user.extend.level = data.extend.level;
            state.user.level = data.extend.level;
            state.user.extend.roleId = data.extend.roleId;
        }

        state.user.wallet.money = 0;
        state.user.wallet.settlement = 0;
        state.user.wallet.loans = [];
        if (data.wallet) {
            state.user.wallet.money = data.wallet.money;
            state.user.wallet.settlement = data.wallet.settlement;
            state.user.wallet.loans = data.wallet.loans;
        }

        state.user.franchisee.id = 0;
        state.user.franchisee.name = '';
        state.currentFranchiseeId = 0;

        /** 一般來說有加盟商資料的一定非公司管理者 */
        if (data.franchisee) {
            state.user.franchisee.id = data.franchisee.id;
            state.user.franchisee.name = data.franchisee.name;
            state.currentFranchiseeId = data.franchisee.id;
            state.franchiseeOptions = [
                {
                    id: data.franchisee.id,
                    name: data.franchisee.name,
                    baseMin: data.franchisee.baseMin,
                    baseMax: data.franchisee.baseMax,
                },
            ];
            if (data.franchisee.host) {
                state.user.franchisee.host = data.franchisee.host;
            }
        }

        state.apis = data.apis.slice();
        // Object.keys(ApiPath).forEach((key) => {
        //     state.allowApi[key as IAppModule.ApiPathKeys] =
        //         state.apis.indexOf(ApiPath[key as IAppModule.ApiPathKeys]) >= 0;
        // });

        state.views = data.views
            .map((view) => {
                const type = [IAppModule.ViewType.Menu, IAppModule.ViewType.Link][view.type];
                return { ...view, type };
            })
            .sort((a, b) => a.order - b.order);

        // 平台的參數
        state.stgPlatform = data.stgPlatform ? data.stgPlatform : false;
        state.functionMode = data.functionMode;
        state.reviewWithdrawSingleStep = data.reviewWithdrawSingleStep;

        // API 群組， VIEW_ID 為索引
        state.apiGroup = data.apiGroup;
        state.allowApi = reloadAllowApi('/');

        // 是否要排除測試帳號
        state.hasExcludeTester = data.hasExcludeTester;

        // 審查的提示聲，預設是打開的
        state.user.reviewHasSounds = MutationTypes.SwitchReviewSounds.SoundsType.On;
    },
    [MutationTypes.Logout.Key](state) {
        state.initFinish = true;

        state.user.id = 0;
        state.user.account = '';
        state.user.name = '';
        state.user.token = '';
        state.user.level = 0;
        state.user.locked = 0;
        state.user.extend.id = 0;
        state.user.extend.account = '';
        state.user.extend.name = '';
        state.user.extend.level = 0;
        state.user.role.id = 0;
        state.user.role.name = '';
        state.user.role.rank = 0;
        state.user.role.fullIP = false;
        state.user.role.fullInfo = false;
        state.user.franchisee.id = 0;
        state.user.franchisee.name = '';
        state.user.isCompany = false;
        state.user.isSubAgent = false;
        state.user.wallet.money = 0;
        state.user.wallet.settlement = 0;
        state.user.wallet.loans = [];

        state.currentFranchiseeId = 0;
        state.franchiseeOptions = [];

        state.apis = [];
        state.views = [];
        state.allowApi = [];
        state.apiGroup = [];
    },
    [MutationTypes.Locale.Key](state, locale: MutationTypes.Locale.Data) {
        state.locale = locale;
    },

    /** 標記錢包更新狀態 */
    [MutationTypes.ReloadWalletStatus.Key](state, data: MutationTypes.ReloadWalletStatus.Data) {
        state.user.wallet.loading = data;
    },

    /** 更新錢包額度 */
    [MutationTypes.UpdateWallet.Key](state, data: MutationTypes.UpdateWallet.Data) {
        state.user.wallet.loading = false;
        state.user.wallet.money = data.money;
        state.user.wallet.settlement = data.settlement;
        state.user.wallet.loans = data.loans;
    },

    [MutationTypes.ReloadFranchiseeOption.Key](state, data: MutationTypes.ReloadFranchiseeOption.Data) {
        state.franchiseeOptions = data.options;
    },

    [MutationTypes.ChangeFranchisee.Key](state, data: MutationTypes.ChangeFranchisee.Data) {
        state.currentFranchiseeId = data.id;
    },
    [MutationTypes.UpdateNumLetterMessages.Key](state, data: MutationTypes.UpdateNumLetterMessages.Data) {
        state.numLetterMessages = data;
    },
    [MutationTypes.Socket.UpdateReviews.Key](state, data: MutationTypes.Socket.UpdateReviews.Data) {
        state.reviewNotifications = data.map((o) => {
            return {
                rid: Number(o.rid),
                fid: Number(o.fid),
                type: o.type as any,
                nums: Number(o.nums),
            };
        });
    },
    [MutationTypes.Socket.UpdateReviewingList.Key](state, data: MutationTypes.Socket.UpdateReviewingList.Data) {
        state.reviewingList = data;
    },
    [MutationTypes.Socket.UpdateReviewingResult.Key](state, data: MutationTypes.Socket.UpdateReviewingResult.Data) {
        state.reviewingResult = data;
    },
    [MutationTypes.Socket.UpdateBanks.Key](state, data: MutationTypes.Socket.UpdateBanks.Data) {
        state.bankNotifications = data.map((o) => {
            return {
                id: Number(o.id),
                fid: Number(o.fid),
                type: o.type,
                cumulativeAmount: o.cumulativeAmount,
                limitAmount: o.limitAmount,
            };
        });
    },
    [MutationTypes.Socket.UpdateFullpay.Key](state, data: MutationTypes.Socket.UpdateFullpay.Data) {
        state.fullpayNotifications = data;
    },
    [MutationTypes.ApiGroup.Key](state, data: MutationTypes.ApiGroup.Path) {
        state.allowApi = reloadAllowApi(data);
    },
    [MutationTypes.SwitchReviewSounds.Key](state, data: MutationTypes.SwitchReviewSounds.Data) {
        state.user.reviewHasSounds = data.option;
    },
};

const module: Module<IAppModule.State, RootStore> = {
    state: {
        initFinish: false,
        user: {
            id: 0,
            account: '',
            name: '',
            token: '',
            level: 0,
            locked: 0,
            extend: {
                id: 0,
                account: '',
                name: '',
                level: 0,
                roleId: 0,
            },
            role: {
                id: 0,
                name: '',
                rank: 0,
                fullIP: false,
                fullInfo: false,
            },
            franchisee: {
                id: 0,
                name: '',
                host: null,
            },
            wallet: {
                loading: false,
                money: 0,
                settlement: 0,
                loans: [],
            },
            isCompany: false,
            isSubAgent: false,
            invitationCode: null,
            reviewHasSounds: MutationTypes.SwitchReviewSounds.SoundsType.On,
        },
        locale: 'zh-tw',
        apis: [],
        views: [],
        allowApi: [],
        franchiseeOptions: [],
        currentFranchiseeId: 0,
        reviewNotifications: [],
        numLetterMessages: 0,
        stgPlatform: false,
        reviewingList: {
            reviewTypeKey: '',
            rid: [],
        },
        reviewingResult: {
            reviewTypeKey: '',
            rid: '',
        },
        bankNotifications: [],
        fullpayNotifications: [],
        functionMode: '',
        reviewWithdrawSingleStep: false,
        apiGroup: [],
        hasExcludeTester: false,
    },
    mutations,
    getters: {
        isLogin(state) {
            return state.user.id > 0;
        },
        viewTrees(state): IAppModule.ViewTree[] {
            // 翻譯檔代碼
            state.views.map((view: any) => {
                view.code = 'view_' + view.id.toString();
                return view;
            });

            const rootViews = state.views.filter((v) => v.parentId === 0);
            return rootViews.map((view: any) => {
                return {
                    ...view,
                    childrens: state.views.filter((v) => v.parentId === view.id),
                };
            });
        },
    },
};

export default module;
