import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

const routeGroup = (configs: RouteConfig[]) => configs;

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/blank',
            name: 'blank',
            component: require('./views/Blank.vue').default,
        },
        {
            path: '/login',
            name: 'login',
            component: require('./views/Login.vue').default,
        },
        {
            path: '/agent',
            name: 'agent',
            component: require('./views/Agent.vue').default,
        },
        {
            path: '/agent-write-off',
            name: 'write-off',
            component: require('./views/AgentWriteOff.vue').default,
        },
        {
            path: '/version',
            name: 'version',
            component: require('./views/version/Version.vue').default,
        },
        {
            path: '/announcement',
            name: 'announcement',
            component: require('./views/announcement/Announcement.vue').default,
        },
        /* /personal */
        ...routeGroup([
            {
                path: '/personal/info',
                name: 'personal-information',
                component: require('./views/personal/PersonalInformation.vue').default,
            },
            {
                path: '/personal/invitation',
                name: 'personal-invitation',
                component: require('./views/personal/PersonalInvitation.vue').default,
            },
            {
                path: '/personal/wallet',
                name: 'personal-wallet',
                component: require('./views/personal/PersonalWallet.vue').default,
            },
            {
                path: '/personal/reviews',
                name: 'personal-reviews',
                component: require('./views/personal/PersonalReviews.vue').default,
            },
            {
                path: '/personal/login-info',
                name: 'personal-login-info',
                component: require('./views/personal/PersonalLoginInfo.vue').default,
            },
        ]),
        /* /system */
        ...routeGroup([
            {
                path: '/system/role',
                name: 'role',
                component: require('./views/system/Role.vue').default,
            },
            {
                path: '/system/company',
                name: 'company',
                component: require('./views/system/Company.vue').default,
            },
            {
                path: '/system/view',
                name: 'MenuView',
                component: require('./views/system/MenuView.vue').default,
            },
            {
                path: '/system/api',
                name: 'Api',
                component: require('./views/system/Api.vue').default,
            },
            {
                path: '/system/review-type',
                name: 'system-review-type',
                component: require('./views/system/ReviewType.vue').default,
            },
            {
                path: '/system/franchisee',
                name: 'franchisee',
                component: require('./views/system/Franchisee.vue').default,
            },
            {
                path: '/system/review-reason',
                name: 'system-review-reason',
                component: require('./views/system/ReviewReason.vue').default,
            },
            // {
            //     path: '/system/move-organization',
            //     name: 'move-organization',
            //     component: require('./views/system/MoveOrganization.vue').default,
            // },
        ]),
        /* /letter */
        ...routeGroup([
            {
                path: '/letter/letter-tag',
                name: 'LetterTag',
                component: require('./views/letter/LetterTag.vue').default,
            },
            {
                path: '/letter/letter-announcement',
                name: 'LetterAnnouncement',
                component: require('./views/letter/LetterAnnouncement.vue').default,
            },
            {
                path: '/letter/letter-message',
                name: 'LetterMessage',
                component: require('./views/letter/LetterMessage.vue').default,
            },
        ]),
        /* .main */
        ...routeGroup([
            {
                path: '/main/marquee',
                name: 'marquee',
                component: require('./views/marquee/Marquee.vue').default,
            },
            {
                path: '/main/carousel',
                name: 'carousel',
                component: require('./views/carousel/Carousel.vue').default,
            },
            {
                path: '/main/bank',
                name: 'bank',
                component: require('./views/bank/Bank.vue').default,
            },
        ]),
        /* /game */
        ...routeGroup([
            {
                path: '/game/game-type',
                name: 'gameType',
                component: require('./views/game/GameType.vue').default,
            },
            {
                path: '/game/game-tag',
                name: 'gameTag',
                component: require('./views/game/GameTag.vue').default,
            },
            {
                path: '/game/game-platform',
                name: 'gamePlatform',
                component: require('./views/game/GamePlatform.vue').default,
            },
            {
                path: '/game/game',
                name: 'game',
                component: require('./views/game/Game.vue').default,
            },
            {
                path: '/game/game-platform/limited-auth',
                name: 'gamePlatformLimitedAuth',
                component: require('./views/game/GamePlatformByLimitedAuth.vue').default,
            },
        ]),
        ...routeGroup([
            {
                path: '/member/club',
                name: 'club',
                component: require('./views/member/Club.vue').default,
            },
            {
                path: '/member/bank-group',
                name: 'club',
                component: require('./views/member/BankGroup.vue').default,
            },
            {
                path: '/member/club-upgrade',
                name: 'club',
                component: require('./views/member/ClubUpgrade.vue').default,
            },
            {
                path: '/member/member-tag',
                component: require('./views/member/MemberTagManager.vue').default,
            },
            {
                path: '/member/log-member-phone',
                component: require('./views/member/LogMemberPhone.vue').default,
            },
            {
                path: '/member/log-member-bank',
                component: require('./views/member/LogMemberBank.vue').default,
            },
            {
                path: '/member/log-deposit-withdraw',
                component: require('./views/member/LogDepositWithdraw.vue').default,
            },
            {
                path: '/member/activity/info',
                component: require('@/views/member/ActivityInfo.vue').default,
            },
            {
                path: '/member/search',
                component: require('@/views/member/MemberSearch.vue').default,
            },
        ]),
        {
            path: '/sms/sms-user',
            name: 'smsUser',
            component: require('./views/sms/SmsUser.vue').default,
        },
        {
            path: '/sms/sms-template',
            name: 'smsTemplate',
            component: require('./views/sms/SmsTemplate.vue').default,
        },
        {
            path: '/sms/sms-log',
            name: 'smsLog',
            component: require('./views/sms/SmsLog.vue').default,
        },
        /* review */
        ...routeGroup([
            {
                path: '/review/review-agent-loan',
                name: 'review-agent-loan',
                component: require('./views/review/ReviewAgentLoan.vue').default,
            },
            {
                path: '/review/review-agent-compensatory',
                name: 'review-agent-compensatory',
                component: require('./views/review/ReviewAgentCompensatory.vue').default,
            },
            {
                path: '/review/review-member-deposit',
                name: 'review-member-deposit',
                component: require('./views/review/ReviewMemberDeposit.vue').default,
            },
            {
                path: '/review/review-member-register',
                name: 'review-member-register',
                component: require('./views/review/ReviewMemberRegister.vue').default,
            },
            {
                path: '/review/review-member-information',
                name: 'review-member-information',
                component: require('./views/review/ReviewMemberInformation.vue').default,
            },
            {
                path: '/review/review-member-withdraw',
                name: 'review-member-withdraw',
                component: require('./views/review/ReviewMemberWithdraw.vue').default,
            },
            {
                path: '/review/review-member-bank',
                name: 'review-member-bank',
                component: require('./views/review/ReviewMemberBank.vue').default,
            },
            {
                path: '/review/review-member-quest',
                name: 'review-member-quest',
                component: require('./views/review/ReviewMemberCombineQuest.vue').default,
            },
            {
                path: '/review/review-member-transaction',
                name: 'review-member-transaction',
                component: require('./views/review/ReviewMemberTransaction.vue').default,
            },
            {
                path: '/review/review-agent-edit-deposit',
                name: 'review-agent-edit-deposit',
                component: require('./views/review/ReviewAgentEditDeposit.vue').default,
            },
            {
                path: '/review/review-agent-third-deposit',
                name: 'review-agent-third-deposit',
                component: require('./views/review/ReviewAgentThirdDeposit.vue').default,
            },
            {
                path: '/review/review-member-activity-wallet',
                name: 'review-member-activity-wallet',
                component: require('./views/review/ReviewMemberActivityWallet.vue').default,
            },
        ]),
        /* report */
        ...routeGroup([
            {
                path: '/report/total-report',
                component: require('./views/report/TotalReport.vue').default,
                children: [
                    {
                        path: '',
                        component: require('./views/report/AgentTotalReport.vue').default,
                    },
                    {
                        path: 'member',
                        component: require('./views/report/MemberTotalReport.vue').default,
                    },
                    {
                        path: 'bets',
                        component: require('./views/report/ReportBets.vue').default,
                    },
                    {
                        path: 'member-only',
                        component: require('./views/report/MemberTotalReportMemberOnly.vue').default,
                    },
                    {
                        path: 'member-only/bets',
                        component: require('./views/report/ReportBetsMemberOnly.vue').default,
                    },
                ],
            },
            {
                path: '/report/report-package',
                component: require('./views/report-package/ReportPackage.vue').default,
                children: [
                    {
                        path: '',
                        component: require('./views/report-package/AgentReportPackage.vue').default,
                    },
                    {
                        path: 'member',
                        component: require('./views/report-package/MemberReportPackage.vue').default,
                    },
                ],
            },
            {
                path: '/report/quest-total-report',
                component: require('./views/report/QuestTotalReport.vue').default,
                children: [
                    {
                        path: '',
                        component: require('./views/report/QuestAgentTotalReport.vue').default,
                    },
                    {
                        path: 'quests',
                        component: require('./views/report/ReportQuests.vue').default,
                    },
                ],
            },
            {
                path: '/report/quest-reward',
                component: require('./views/report/QuestRewardMain.vue').default,
                children: [
                    {
                        path: 'agent',
                        component: require('./views/report/QuestRewardForAgent.vue').default,
                    },
                    {
                        path: 'member',
                        component: require('./views/report/QuestRewardForMember.vue').default,
                    },
                ],
            },
            {
                path: '/report/settlement-day',
                name: 'settlement-day',
                component: require('./views/report/SettlementDay.vue').default,
            },
            {
                path: '/report/approval-water',
                component: require('./views/report/ApprovalWater.vue').default,
            },
            {
                path: '/report/approval-bonus',
                component: require('./views/report/ApprovalBonus.vue').default,
            },
            {
                path: '/report/settlement-month',
                name: 'settlement-month',
                component: require('./views/report/SettlementMonth.vue').default,
            },

            {
                path: '/report/franchisee_ration',
                name: 'franchisee-ration',
                component: require('./views/report/FranchiseeRation.vue').default,
            },
            {
                path: '/report/account-report',
                name: 'account-report',
                component: require('./views/report/AccountReport.vue').default,
            },
            {
                path: '/report/old-report',
                name: 'old-report',
                component: require('./views/report/OldReport.vue').default,
            },
            // {
            //     path: '/report/total-report/member-only',
            //     component: require('./views/report/TotalReportMemberOnly.vue').default,
            //     children: [
            //         {
            //             path: '',
            //             component: require('./views/report/MemberTotalReportMemberOnly.vue').default,
            //         },
            //         {
            //             path: 'bets',
            //             component: require('./views/report/ReportBetsMemberOnly.vue').default,
            //         },
            //     ],
            // },
            {
                path: '/report/company-total-report',
                component: require('./views/report/CompanyTotalReport.vue').default,
                children: [
                    {
                        path: '',
                        component: require('./views/report/CompanyTotalReportList.vue').default,
                    },
                ],
            },
        ]),
        ...routeGroup([
            {
                path: '/logger/login',
                component: require('./views/logger/LogLogin.vue').default,
            },
            {
                path: '/logger/exception',
                component: require('./views/logger/LogException.vue').default,
            },
            {
                path: '/logger/sync-report',
                component: require('./views/logger/LogSyncReport.vue').default,
            },
            {
                path: '/logger/provider-request',
                component: require('./views/logger/LogProviderRequest.vue').default,
            },
            {
                path: '/logger/data-modify',
                component: require('./views/logger/LogDataModify.vue').default,
            },
            {
                path: '/logger/multi-wallet/stuck',
                component: require('./views/logger/LogMultiWalletStuck.vue').default,
            },
            {
                path: '/logger/third-deposit',
                component: require('./views/logger/LogThirdDeposit.vue').default,
            },
            {
                path: '/logger/third-withdraw',
                component: require('./views/logger/LogThirdWithdraw.vue').default,
            },
        ]),
        ...routeGroup([
            {
                path: '/quest/group',
                name: 'quest-group',
                component: require('./views/quest/QuestGroup.vue').default,
            },
            {
                path: '/quest/bet-amount/reward/franchisee/:franchiseeId/group/:groupId',
                name: 'bet-amount-reward',
                component: require('./views/quest/BetAmountRewards.vue').default,
            },
            {
                path: '/quest/condition/combination',
                name: 'quest-condition-combination',
                component: require('./views/quest/QuestConditionCombination.vue').default,
            },
            {
                path: '/quest/condition/combination/group',
                name: 'quest-condition-combination-group',
                component: require('./views/quest/QuestConditionCombinationGroup.vue').default,
            },
        ]),
        ...routeGroup([
            {
                path: '/fullpay',
                name: 'fullpay',
                component: require('./views/fullpay/Fullpay.vue').default,
            },
        ]),
        ...routeGroup([
            {
                path: '/activity-wallet/list',
                name: 'activity-wallet',
                component: require('./views/activity-wallet/ActivityWallet.vue').default,
            },
            {
                path: '/activity-wallet/log',
                name: 'activity-wallet-log',
                component: require('./views/activity-wallet/ActivityWalletLog.vue').default,
            },
        ]),
        // ...routeGroup([
        //     {
        //         path: '/system/tools/shift-bucket',
        //         name: 'shift-bucket',
        //         component: require('./views/system/ShiftBucket.vue').default,
        //     },
        // ]),
        // {
        //     path: '/about',
        //     name: 'about',
        //     // route level code-splitting
        //     // this generates a separate chunk (about.[hash].js) for this route
        //     // which is lazy-loaded when the route is visited.
        //     component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
        // },
        /** 卡錢紀錄 */
        {
            path: '/stuck-money',
            name: 'stuck-money',
            component: require('@/views/stuck-money/StuckMoney.vue').default,
        },
        /** 存款公告 */
        {
            path: '/deposit-announcement',
            name: 'deposit-announcement',
            component: require('@/views/system/DepositAnnouncement.vue').default,
        },
        /** 查詢未轉移的會員 */
        {
            path: '/import/find/member',
            name: 'import-find-member',
            component: require('@/views/system/ImportFindMember.vue').default,
        },
    ],
});
