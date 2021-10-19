<template>
    <nav class="navbar navbar-dark bg-dark">
        <div class="navbar-brand col-auto">
            <div class="input-group franchisee-panel input-group-sm">
                <div class="input-group-prepend">
                    <span class="input-group-text">{{ 'component.app-header.franchisee-label' | t }}</span>
                </div>
                <select class="form-control" v-model="currentFranchiseeId">
                    <option :value="0" v-show="isCompany">{{ 'common.all' | t }}</option>
                    <option v-for="opt in franchiseeOptions" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
                </select>
            </div>
        </div>
        <span class="navbar-brand view-title">{{ pageTitle }}</span>

        <span class="navbar-brand col"></span>
        <div class="navbar-brand col-auto">
            <UserInformation />
        </div>
        <div class="navbar-brand col-auto">
            <div class="inline">
                <div class="input-group input-group-sm">
                    <div class="input-group-prepend">
                        <span class="input-group-text">{{ 'language' | pt }}</span>
                    </div>
                    <select class="form-control" v-model="locale">
                        <option :value="opt.value" v-for="opt in localeOptions" :key="opt.value">
                            {{ opt.label }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <a class="navbar-brand" href="#" v-loading="loading.logout" @click.prevent="logout">{{
            'component.app-header.logout' | t
        }}</a>
    </nav>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import store from '@/store';
import actions from '@/stores/actions';
import { IAppModule } from '@/stores/modules/AppModule';
import i18n, { prefixTransaction } from '../i18n';
import AgentLoanDialog from './agent/AgentLoanDialog.vue';
import UserInformation from './header/UserInformation.vue';
const pt = prefixTransaction('component.app-header');
@Component({
    filters: { pt },
    components: {
        UserInformation,
    },
})
export default class AppHeader extends Vue {
    public pt = pt;
    get pageTitle() {
        const viewPt = prefixTransaction('menu');
        const path = this.$route.path;
        const view: any = store.state.App.views.find((v) => v.path === path);
        let viewName: any = path;

        // 驗證是否為優惠活動列表
        const routeMatcher = new RegExp('/quest/bet-amount/reward/franchisee/.*');
        const questWallet = new RegExp('/report/quest-total-report/.*');
        const questReward = new RegExp('/report/quest-reward/.*');
        const reportBets = new RegExp('/report/total-report/bets');
        const reportMember = new RegExp('/report/total-report/member');
        const reportMemberBets = new RegExp('/report/total-report/member-only/bets');

        if (view) {
            view.code = 'view_' + view.id.toString();
        } else if (!view && routeMatcher.test(path)) {
            viewName = this.$t('view.quest.group.quest-list');
        } else if (!view && questWallet.test(path)) {
            viewName = this.$t('menu.view_170');
        } else if (!view && questReward.test(path)) {
            viewName = this.$t('menu.view_174');
        } else if (!view && (reportBets.test(path) || reportMemberBets.test(path))) {
            viewName = this.$t('menu.view_191');
        } else if (!view && reportMember.test(path)) {
            viewName = this.$t('menu.view_191');
        }

        return view ? viewPt(view.code) : viewName;
    }

    public loading = {
        logout: false,
    };

    get user() {
        return store.state.App.user;
    }

    get isLogin() {
        return this.$store.getters.isLogin;
    }

    get isCompany() {
        return store.state.App.user.isCompany;
    }

    get franchiseeOptions() {
        return store.state.App.franchiseeOptions;
    }

    get currentFranchiseeId() {
        return store.state.App.currentFranchiseeId;
    }

    set currentFranchiseeId(value: number) {
        actions.changeFranchisee(value);
    }
    set locale(value: string) {
        actions.setLocate(value);
    }

    get locale() {
        return store.state.App.locale;
    }

    get localeOptions() {
        return [
            {
                value: 'zh-cn',
                label: '簡中',
            },
            {
                value: 'zh-tw',
                label: '繁中',
            },
            {
                value: 'jp',
                label: '日本語',
            },
        ];
    }

    @Watch('isLogin', { immediate: true }) public watchIsLogin(isLogin: boolean) {
        if (isLogin && this.isCompany) {
            actions.reloadFranchiseeOptions();
        }
    }

    public logout() {
        if (!this.loading.logout) {
            this.loading.logout = true;
            actions.logout().finally(() => {
                this.loading.logout = false;
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.navbar-collapse.collapse {
    display: block !important;
}

.franchisee-panel {
    width: 180px;
}
.navbar-nav > li,
.navbar-nav {
    float: left !important;
}

.navbar-nav.navbar-right:last-child {
    margin-right: -15px !important;
}

.view-title {
    line-height: 1.2rem;
    padding-bottom: 10px;
}

.navbar-right {
    float: right !important;
}

.inline {
    display: inline-block;
    margin-right: 5px;
}

.bg-dark {
    background: #354052 !important;
}
</style>
