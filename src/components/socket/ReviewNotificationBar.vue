<template>
    <div class="review-notification-bar row w-100">
        <div
            class="col-auto btn-all-mute"
            :loading="loading"
            v-show="reviewAgents.length > 0 || reviewMembers.length > 0 || bankLimit.allow || fullpayLimit.allow"
        >
            <button @click="muteAllAudios()">
                <span class="volume-icon material-icons" :class="!allMute ? 'volume-icon-hide' : 'volume-icon'">
                    volume_off
                </span>
            </button>
        </div>
        <div class="col-auto p-0">
            <span class="icon" @click.prevent="refresh()">
                <i v-show="loading" class="el-icon-loading"></i>
                <i v-show="!loading" class="el-icon-refresh"></i>
            </span>
        </div>
        <label class="group-label ml-2" v-show="reviewAgents.length > 0 || bankLimit.allow || fullpayLimit.allow">
            {{ 'agent-group' | pt }}
        </label>
        <div class="col-auto pt-1 px-1">
            <!-- 銀行限額 -->
            <span class="badge-item" :loading="loading" v-if="bankLimit.allow">
                <el-badge :value="`${bankLimit.nums}`" :max="99" :hidden="bankLimit.nums === 0" class="item">
                    <div class="accordion">
                        <span
                            class="volume-icon material-icons"
                            :class="bankLimit.play ? 'volume-icon-hide' : 'volume-icon'"
                            >volume_off</span
                        >
                        <button
                            type="primary"
                            @click.prevent="linkTo(bankLimit)"
                            class="btn btn-sm"
                            :class="bankLimit.nums > 0 ? 'btn-warning' : 'btn-primary'"
                        >
                            {{ bankLimit.shortName | pt }}
                            <span class="badge badge-light">{{ bankLimit.allNums }}</span>
                        </button>
                        <div class="collapse">
                            <span class="badge badge-light">{{ bankLimit.name | pt }}</span>
                            <button
                                type="primary"
                                @click.prevent="stopAudio(bankLimit.type)"
                                class="btn btn-outline-light material-icons"
                            >
                                {{ bankLimit.play ? 'volume_up' : 'volume_off' }}
                            </button>
                        </div>
                    </div>
                </el-badge>
            </span>
            <!-- 三方限額 -->
            <span class="badge-item" :loading="loading" v-if="fullpayLimit.allow">
                <el-badge :value="`${fullpayLimit.nums}`" :max="99" :hidden="fullpayLimit.nums === 0" class="item">
                    <div class="accordion">
                        <span
                            class="volume-icon material-icons"
                            :class="fullpayLimit.play ? 'volume-icon-hide' : 'volume-icon'"
                            >volume_off</span
                        >
                        <button
                            type="primary"
                            @click.prevent="toAmountDialog()"
                            class="btn btn-sm"
                            :class="fullpayLimit.nums > 0 ? 'btn-warning' : 'btn-primary'"
                        >
                            {{ fullpayLimit.shortName | pt }}
                            <span class="badge badge-light">{{ fullpayLimit.allNums }}</span>
                        </button>
                        <div class="collapse">
                            <span class="badge badge-light">{{ fullpayLimit.name | pt }}</span>
                            <button
                                type="primary"
                                @click.prevent="stopAudio(fullpayLimit.type)"
                                class="btn btn-outline-light material-icons"
                            >
                                {{ fullpayLimit.play ? 'volume_up' : 'volume_off' }}
                            </button>
                        </div>
                    </div>
                </el-badge>
            </span>
            <span class="badge-item" v-for="rtype in reviewAgents" :key="rtype.type">
                <el-badge :value="`${rtype.nums}`" :max="99" :hidden="rtype.nums === 0" class="item">
                    <div class="accordion">
                        <span
                            class="volume-icon material-icons"
                            :class="rtype.play ? 'volume-icon-hide' : 'volume-icon'"
                            >volume_off</span
                        >
                        <button type="primary" @click.prevent="linkTo(rtype)" class="btn btn-primary btn-sm">
                            {{ rtype.shortName | pt }}
                            <span class="badge badge-light">{{ rtype.allNums }}</span>
                        </button>
                        <div class="collapse">
                            <span class="badge badge-light">{{ rtype.name | pt }}</span>
                            <button
                                type="primary"
                                @click.prevent="stopAudio(rtype.type)"
                                class="btn btn-outline-light material-icons"
                            >
                                {{ rtype.play ? 'volume_up' : 'volume_off' }}
                            </button>
                        </div>
                    </div>
                </el-badge>
            </span>
        </div>
        <label class="group-label" v-show="reviewMembers.length > 0">
            {{ 'member-group' | pt }}
        </label>
        <div class="col-auto pt-1 px-1">
            <span class="badge-item" v-for="rtype in reviewMembers" :key="rtype.type">
                <el-badge :value="rtype.nums" :max="99" :hidden="rtype.nums === 0" class="item">
                    <div class="accordion">
                        <span
                            class="volume-icon material-icons"
                            :class="rtype.play ? 'volume-icon-hide' : 'volume-icon'"
                            >volume_off</span
                        >
                        <button type="primary" @click.prevent="linkTo(rtype)" class="btn btn-primary btn-sm">
                            {{ rtype.shortName | pt }}
                            <span class="badge badge-light">{{ rtype.allNums }}</span>
                        </button>
                        <div class="collapse show">
                            <span class="badge badge-light">{{ rtype.name | pt }}</span>
                            <button
                                type="primary"
                                @click.prevent="stopAudio(rtype.type)"
                                class="btn btn-outline-light material-icons"
                            >
                                {{ rtype.play ? 'volume_up' : 'volume_off' }}
                            </button>
                        </div>
                    </div>
                </el-badge>
            </span>
        </div>

        <audio ref="SoundDefault" :src="require('@/assets/audios/default.mp3')" muted="true" loop v-show="false" />
        <audio ref="SoundDeposit" :src="require('@/assets/audios/deposit.mp3')" muted="true" loop v-show="false" />
        <audio ref="SoundEdit" :src="require('@/assets/audios/edit.mp3')" muted="true" loop v-show="false" />
        <audio ref="SoundRegister" :src="require('@/assets/audios/register.mp3')" muted="true" loop v-show="false" />
        <audio ref="SoundWithdraw" :src="require('@/assets/audios/withdraw.mp3')" muted="true" loop v-show="false" />
        <AmountDialog ref="AmountDialog"></AmountDialog>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { prefixTransaction } from '../../i18n';
import store from '../../store';
import { ApiPath } from '../../api';
import { IAppModule } from '@/stores/modules/AppModule';
import { MutationTypes } from '../../stores/mutation-types.interface';
import { ISocketModule } from '@/stores/modules/SocketModule';
import actions from '../../stores/actions';
import AmountDialog from '@/components/bank/BankGroupEditFullpayAmountDialog.vue';
import { Ajax } from '@/stores/actions';

// const SoundDefault = require('@/assets/audios/default.mp3');
// const SoundDeposit = require('@/assets/audios/deposit.mp3');
// const SoundEdit = require('@/assets/audios/edit.mp3');
// const SoundRegister = require('@/assets/audios/register.mp3');
// const SoundWithdraw = require('@/assets/audios/withdraw.mp3');

namespace Pr {
    export enum SoundType {
        Default = 'default',
        Deposit = 'deposit',
        Edit = 'edit',
        Register = 'register',
        Withdraw = 'withdraw',
    }

    export enum BankType {
        Limit = 'bank-limit',
    }

    export enum FullpayType {
        Limit = 'fullpay-limit',
    }

    export type Types = IAppModule.ReviewType | 'letter-message' | BankType.Limit | FullpayType.Limit;

    export interface ReviewNotificationItem {
        /* api 是否有權限 */
        allow: boolean;
        /* 轉頁網址 */
        link: string;
        /* 名稱 */
        name: string;
        /* 短名稱 */
        shortName: string;
        /* 類型 */
        type: Types;
        /* 是否播放 */
        play: boolean;
        /* 資料筆數 */
        nums: number;
        allNums: number;
    }

    export interface AudioItem {
        dom: HTMLAudioElement;
        types: Types[];
        ready: boolean;
    }
}

const pt = prefixTransaction('component.socket.review-notification-bar');

@Component({
    filters: { pt },
    components: {
        AmountDialog,
    },
})
export default class ReviewNotificationBar extends Vue {
    public $refs!: {
        SoundDefault: HTMLAudioElement;
        SoundDeposit: HTMLAudioElement;
        SoundEdit: HTMLAudioElement;
        SoundRegister: HTMLAudioElement;
        SoundWithdraw: HTMLAudioElement;
        AmountDialog: AmountDialog;
    };
    public pt = pt;
    public resetIcon = 'el-icon-loading';
    public audios: Pr.AudioItem[] = [];
    public turnOnAfterReview: Pr.Types[] = []; // 審查 dialog 關閉後開啟提示聲

    public loading = false;
    public allMute: boolean = false;

    public reviews: Pr.ReviewNotificationItem[] = [
        {
            allow: store.state.App.allowApi.ApiReviewAgentCompensatoryList,
            link: '/review/review-agent-compensatory',
            type: IAppModule.ReviewType.AgentCompensatory,
            nums: 0,
            allNums: 0,
            play: true,
            name: 'badge-label.agent-compensatory',
            shortName: 'badge-label.agent-compensatory-short',
        },
        {
            allow: store.state.App.allowApi.ApiReviewAgentLoanList,
            link: '/review/review-agent-loan',
            type: IAppModule.ReviewType.AgentLoan,
            nums: 0,
            allNums: 0,
            play: true,
            name: 'badge-label.agent-loan',
            shortName: 'badge-label.agent-loan-short',
        },
        {
            allow: store.state.App.allowApi.ApiReviewMemberRegisterList,
            link: '/review/review-member-register',
            nums: 0,
            allNums: 0,
            type: IAppModule.ReviewType.MemberRegister,
            name: 'badge-label.member-register',
            shortName: 'badge-label.member-register-short',
            play: true,
        },
        {
            allow: store.state.App.allowApi.ApiReviewMemberDepositList,
            link: '/review/review-member-deposit',
            nums: 0,
            allNums: 0,
            type: IAppModule.ReviewType.MemberDepositBank,
            name: 'badge-label.member-deposit',
            shortName: 'badge-label.member-deposit-short',
            play: true,
        },
        {
            allow: store.state.App.allowApi.ApiReviewMemberInformationList,
            link: '/review/review-member-information',
            nums: 0,
            allNums: 0,
            type: IAppModule.ReviewType.MemberInformation,
            name: 'badge-label.member-information',
            shortName: 'badge-label.member-information-short',
            play: true,
        },
        {
            allow: store.state.App.allowApi.ApiReviewMemberWithdrawList,
            link: '/review/review-member-withdraw',
            nums: 0,
            allNums: 0,
            type: IAppModule.ReviewType.MemberWithdraw,
            name: 'badge-label.member-withdraw',
            shortName: 'badge-label.member-withdraw-short',
            play: true,
        },
        {
            allow: store.state.App.allowApi.ApiReviewMemberBankList,
            link: '/review/review-member-bank',
            nums: 0,
            allNums: 0,
            type: IAppModule.ReviewType.MemberBank,
            name: 'badge-label.member-bank',
            shortName: 'badge-label.member-bank-short',
            play: true,
        },
        {
            allow: store.state.App.allowApi.ApiReviewMemberQuestList,
            link: '/review/review-member-quest',
            nums: 0,
            allNums: 0,
            type: IAppModule.ReviewType.MemberQuest,
            name: 'badge-label.member-quest',
            shortName: 'badge-label.member-quest-short',
            play: true,
        },
        // {
        //     allow: store.state.App.allowApi.ApiLetterMessageList && !store.state.App.user.isCompany,
        //     link: '/letter/letter-message',
        //     nums: 0,
        //     allNums: 0,
        //     type: 'letter-message',
        //     name: 'badge-label.letter-message',
        //     shortName: 'badge-label.letter-message-short',
        //     play: true,
        // },
        {
            allow: store.state.App.allowApi.ApiReviewMemberWithdrawTransactionList,
            link: '/review/review-member-transaction',
            nums: 0,
            allNums: 0,
            type: IAppModule.ReviewType.MemberTransaction,
            name: 'badge-label.member-transaction',
            shortName: 'badge-label.member-transaction-short',
            play: true,
        },
        {
            allow: store.state.App.allowApi.ApiReviewAgentEditDepositList,
            link: '/review/review-agent-edit-deposit',
            nums: 0,
            allNums: 0,
            type: IAppModule.ReviewType.ReviewAgentEditDeposit,
            name: 'badge-label.agent-edit-deposit',
            shortName: 'badge-label.agent-edit-deposit-short',
            play: true,
        },
        {
            allow: store.state.App.allowApi.ApiReviewThirdPartyDepositList,
            link: '/review/review-agent-third-deposit',
            nums: 0,
            allNums: 0,
            type: IAppModule.ReviewType.ReviewAgentThirdDeposit,
            name: 'badge-label.agent-third-deposit',
            shortName: 'badge-label.agent-third-deposit-short',
            play: true,
        },
        {
            allow: store.state.App.allowApi.ApiReviewMemberActivityWalletList,
            link: '/review/review-member-activity-wallet',
            nums: 0,
            allNums: 0,
            type: IAppModule.ReviewType.ReviewMemberActivityWallet,
            name: 'badge-label.member-activity-wallet',
            shortName: 'badge-label.member-activity-wallet-short',
            play: true,
        },
    ];

    public bankLimit: Pr.ReviewNotificationItem = {
        allow: store.state.App.allowApi.ApiBankList,
        link: '/main/bank',
        nums: 0,
        allNums: 0,
        type: Pr.BankType.Limit,
        name: 'badge-label.bank-limit',
        shortName: 'badge-label.bank-limit-short',
        play: true,
    };

    public fullpayLimit: Pr.ReviewNotificationItem = {
        allow: store.state.App.allowApi.ApiBankBankGroupFullpayOverLimitList,
        link: '',
        nums: 0,
        allNums: 0,
        type: Pr.FullpayType.Limit,
        name: 'badge-label.path-limit',
        shortName: 'badge-label.path-limit-short',
        play: true,
    };
    public bank: any = [];

    get reviewAgents() {
        const types: Pr.Types[] = [
            IAppModule.ReviewType.AgentLoan,
            IAppModule.ReviewType.AgentCompensatory,
            IAppModule.ReviewType.AgentCoupon,
            IAppModule.ReviewType.ReviewAgentEditDeposit,
            IAppModule.ReviewType.ReviewAgentThirdDeposit,
        ];
        const rid = this.user.role.id;
        const reviewNotifications = this.reviewNotifications;
        return this.reviews.filter((r) => types.indexOf(r.type) >= 0 && r.allow);
    }

    get reviewMembers() {
        const types: Pr.Types[] = [
            IAppModule.ReviewType.MemberBank,
            IAppModule.ReviewType.MemberCoupon,
            IAppModule.ReviewType.MemberDepositBank,
            IAppModule.ReviewType.MemberWithdraw,
            IAppModule.ReviewType.MemberInformation,
            IAppModule.ReviewType.MemberRegister,
            IAppModule.ReviewType.MemberQuest,
            IAppModule.ReviewType.MemberTransaction,
            IAppModule.ReviewType.ReviewMemberActivityWallet,
            'letter-message',
        ];
        return this.reviews.filter((r) => types.indexOf(r.type) >= 0 && r.allow);
    }

    get user() {
        return store.state.App.user;
    }

    get numMessages() {
        return store.state.App.numLetterMessages;
    }

    get reviewNotifications() {
        return store.state.App.reviewNotifications;
    }

    get hasPremission() {
        const numItems = this.reviews.filter((r) => r.allow).length;
        const isLogin = store.getters.isLogin;
        return isLogin && numItems > 0;
    }

    get isConnected() {
        return store.state.Socket.status === ISocketModule.SocketStatus.Connected;
    }

    get bankNotifications() {
        return store.state.App.bankNotifications;
    }

    get fullpayNotifications() {
        return store.state.App.fullpayNotifications;
    }

    get reviewSounds() {
        return store.state.App.user.reviewHasSounds;
    }

    /**
     * listen 資料筆數的更新
     */
    @Watch('reviewNotifications', { deep: true })
    public watchReviewNotification() {
        const rid = this.user.role.id;
        const reviewNotifications = this.reviewNotifications;
        const numMaps: { [type: string]: { nums: number; all: number } } = {};
        reviewNotifications.forEach((r) => {
            if (r.fid !== store.state.App.user.franchisee.id && store.state.App.user.franchisee.id !== 0) {
                return;
            }

            if (!numMaps[r.type]) {
                numMaps[r.type] = { nums: 0, all: 0 };
            }

            numMaps[r.type].nums += r.nums;
            numMaps[r.type].all += r.nums;
        });
        this.reviews.forEach((r) => {
            const tdata = numMaps[r.type] || { nums: 0, all: 0 };
            r.nums = tdata.nums;
            r.allNums = tdata.all;
        });

        this.playAudio();
    }

    @Watch('numMessages', { immediate: true }) public watchNumMessages(nums: number) {
        const item = this.reviews.find((r) => r.type === 'letter-message');
        if (item) {
            item.nums = nums;
            item.allNums = nums;
            this.playAudio(['letter-message']);
        }
    }

    /**
     * 監聽銀行帳戶的限額
     */
    @Watch('bankNotifications', { deep: true }) public watchBankLimit() {
        if (!this.bankLimit.allow) {
            return;
        }

        const notifications = this.bankNotifications;
        this.bankLimit.nums = notifications.length;
        this.bankLimit.allNums = notifications.length;
        this.playAudio([Pr.BankType.Limit]);
    }

    /**
     * 監聽三方通道的限額
     */
    @Watch('fullpayNotifications', { deep: true }) public watchFullpayLimit() {
        if (!this.bankLimit.allow) {
            return;
        }
        const notifications = this.fullpayNotifications;
        let nums = 0;
        // 如果有收到socket訊號,先找自己超出限額的通道跟socket訊號比較,符合就+1
        Ajax.get(ApiPath.ApiBankBankGroupFullpayOverLimitList, {}).then((res: any) => {
            res.data.content.forEach((item: any) => {
                notifications.forEach((notificationsItem: any) => {
                    if (item.id === notificationsItem) {
                        nums += 1;
                    }
                });
            });
            this.fullpayLimit.nums = nums;
            this.fullpayLimit.allNums = nums;
        });

        this.playAudio([Pr.FullpayType.Limit]);
    }

    @Watch('reviewSounds', { deep: true })
        public watchReviewSounds(option: MutationTypes.SwitchReviewSounds.SoundsType) {
        // console.log('watchReviewSounds', option);
        const mute = option === MutationTypes.SwitchReviewSounds.SoundsType.Off;
        this.muteAllAudios(mute);

        if (!mute) {
            this.turnOnAfterReview = [];
        }
    }

    public mounted() {
        // 銀行帳戶限額
        this.bank = [];
        const audios: Pr.AudioItem[] = [
            {
                dom: this.$refs.SoundDeposit,
                ready: false,
                types: [
                    IAppModule.ReviewType.MemberDepositBank,
                    IAppModule.ReviewType.AgentLoan,
                    IAppModule.ReviewType.AgentCompensatory,
                ],
            },
            {
                dom: this.$refs.SoundWithdraw,
                ready: false,
                types: [
                    // IAppModule.ReviewType.AgentWithdraw,
                    // IAppModule.ReviewType.AgentSettlement,
                    IAppModule.ReviewType.MemberWithdraw,
                    IAppModule.ReviewType.MemberTransaction,
                ],
            },
            {
                dom: this.$refs.SoundEdit,
                ready: false,
                types: [IAppModule.ReviewType.MemberBank, IAppModule.ReviewType.MemberInformation],
            },
            {
                dom: this.$refs.SoundRegister,
                ready: false,
                types: [IAppModule.ReviewType.MemberRegister],
            },
            {
                dom: this.$refs.SoundDefault,
                ready: false,
                types: [
                    // IAppModule.ReviewType.MemberCoupon,
                    IAppModule.ReviewType.AgentCoupon,
                    IAppModule.ReviewType.MemberQuest,
                    'letter-message',
                ],
            },
        ];
        this.audios = audios.map((o) => {
            const item: Pr.AudioItem = {
                ...o,
                ready: false,
            };
            item.dom.addEventListener('canplaythrough', () => {
                item.ready = true;
                this.playAudio();
            });
            item.dom.loop = true;
            return item;
        });
    }

    public refresh() {
        if (this.loading || !this.isConnected) {
            return;
        }
        const fid = store.state.App.currentFranchiseeId;
        this.loading = true;
        Promise.all([actions.socket.refreshReviews(), actions.socket.refreshOnlines(fid)]).finally(() => {
            this.loading = false;
        });
    }

    public linkTo(item: Pr.ReviewNotificationItem) {
        const t = Date.now();
        this.$router.push(`${item.link}?bubble=${t}`);
    }

    public stopAudio(types: IAppModule.ReviewType | Pr.BankType) {
        this.reviews.forEach((v) => {
            if (v.type === types) {
                v.play = !v.play;
            }
        });

        if (types === Pr.BankType.Limit) {
            this.bankLimit.play = !this.bankLimit.play;
        }

        this.playAudio([types]);
    }

    public playAudio(types: Pr.Types[] = []) {
        /* 若是沒權限時，直接全部停播 */
        if (!this.hasPremission) {
            this.audios.forEach((audio) => {
                if (audio.ready && !audio.dom.paused) {
                    audio.dom.pause();
                }
            });
            return;
        }

        // const audios = this.audios.filter((audio) => {
        //     /* 若有傳入 keys 時, 只處理相關的音效播放 */
        //     /* 順便過濾掉尚未 ready 的音效 */

        //     return audio.ready && (types.length === 0 || audio.types.some((k) => types.indexOf(k) >= 0));
        // });

        const reviews = this.reviews;
        const checkBank = this.bankLimit.allow && this.bankLimit.play && this.bankLimit.nums > 0;

        this.audios.forEach((audio) => {
            const play =
                checkBank ||
                reviews.filter((item) => {
                    /* 過濾音效 */
                    return (
                        audio.types.indexOf(item.type) >= 0 &&
                        /* 必需有該項目的權限 */
                        item.allow &&
                        /* 開啟播放控制 */
                        item.play &&
                        /* 有資料通知 */
                        item.nums + item.allNums > 0
                    );
                }).length > 0;

            /* 必需播放音效 & 目前是停止時 */
            if (play && audio.dom.paused) {
                audio.dom
                    .play()
                    .then()
                    .catch((err: any) => {
                        console.error(err);
                    });
            }

            /* 必需停播音效 & 目前播放中(未停止) */
            if (!play && !audio.dom.paused) {
                audio.dom.pause();
                /* 將時間軸拉回 0 的位置 */
                audio.dom.currentTime = 0;
            }
        });
    }

    public muteAllAudios(designate?: boolean) {
        if (designate === undefined) {
            this.allMute = !this.allMute;
        } else {
            // 指定提示聲的切換
            this.allMute = designate;
        }

        this.reviewAgents.forEach((rtype: any) => {
            if (designate !== undefined && designate && rtype.play) {
                this.turnOnAfterReview.push(rtype.type);
                rtype.play = false;
            } else if (designate !== undefined) {
                rtype.play = this.turnOnAfterReview.findIndex((i) => i === rtype.type) > -1;
            } else {
                rtype.play = !this.allMute;
            }

            this.playAudio([rtype]);
        });
        this.reviewMembers.forEach((rtype: any) => {
            if (designate !== undefined && designate && rtype.play) {
                this.turnOnAfterReview.push(rtype.type);
                rtype.play = false;
            } else if (designate !== undefined) {
                rtype.play = this.turnOnAfterReview.findIndex((i) => i === rtype.type) > -1;
            } else {
                rtype.play = !this.allMute;
            }

            this.playAudio([rtype]);
        });

        if (designate !== undefined && designate && this.bankLimit.play) {
            this.turnOnAfterReview.push(this.bankLimit.type);
            this.bankLimit.play = false;
        } else if (designate !== undefined) {
            this.bankLimit.play = this.turnOnAfterReview.findIndex((i) => i === this.bankLimit.type) > -1;
        } else {
            this.bankLimit.play = !this.allMute;
        }
        this.playAudio([Pr.BankType.Limit]);

        if (designate !== undefined && designate && this.fullpayLimit.play) {
            this.turnOnAfterReview.push(this.fullpayLimit.type);
            this.fullpayLimit.play = false;
        } else if (designate !== undefined) {
            this.fullpayLimit.play = this.turnOnAfterReview.findIndex((i) => i === this.fullpayLimit.type) > -1;
        } else {
            this.fullpayLimit.play = !this.allMute;
        }
        this.playAudio([Pr.FullpayType.Limit]);
    }

    public toAmountDialog() {
        this.$refs.AmountDialog.open();
    }
}
</script>
<style lang="scss" >
.review-notification-bar {
    .group-label {
        padding: 4px;
    }
    .el-badge sup {
        z-index: 2;
    }
    .icon {
        &:hover {
            color: blue;
            cursor: Pointer;
        }
        font-size: 20px;
    }
    .el-icon-loading {
        cursor: no-drop;
    }
    .el-icon-warning {
        color: red;
        cursor: no-drop;
    }

    .badge-item {
        margin-right: 10px;
        position: relative;
        display: inline-block;

        .btn {
            border-radius: 0 0 5px 5px;
            width: 60px;
        }
        .left {
            padding: 3.25px 3px 3.25px 6.5px;
        }
        .right {
            padding: 3.25px 6.5px 3.25px 0px;
        }
        .volume-icon {
            position: absolute;
            width: 100%;
            height: 20px;
            opacity: 1;
            color: red;
            top: 100%;
            left: 0;
        }
        .volume-icon-hide {
            opacity: 0;
            transform: translateY(-100%);
            display: none;
        }

        .accordion {
            cursor: Pointer;

            .collapse {
                z-index: 10;
                position: absolute;
                background: rgba(255, 255, 255, 0.5);
                display: none;
                span {
                    cursor: text;
                }
                button {
                    color: black;
                }
            }
            &:hover .collapse {
                display: block;
            }

            .btn-primary {
                background: #47bac1;
                border-color: #47bac1;
            }
        }
    }

    .btn-all-mute {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .volume-icon {
            position: absolute;
            width: 100%;
            height: 20px;
            opacity: 1;
            color: red;
            top: 20%;
            left: 0;
        }
        .volume-icon-hide {
            position: absolute;
            width: 100%;
            height: 20px;
            opacity: 1;
            color: #212529;
            top: 20%;
            left: 0;
        }

        button {
            background: rgba(255, 255, 255, 0);
            border: none;
            margin: 0;
            padding: 0;
            border: none;
            outline: none;
            margin: 0 15px 0 0;
        }
    }
}
</style>
