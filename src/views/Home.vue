<template>
    <div class="home">
        <div v-if="allowTotal">
            <el-row :gutter="20" v-if="allowTotal" class="search-bar" style="margin-bottom: 0">
                <el-col :span="20" v-if="hasExcludeTester">
                    <el-col :span="24" style="padding: 0">
                        <el-radio-group v-model="query.excludeTester" :disabled="loading">
                            <el-radio-button label="all">{{ $t('common.all') }}</el-radio-button>
                            <el-radio-button label="exclude">{{ pt('label-exclude-tester') }}</el-radio-button>
                            <el-radio-button label="only">{{ pt('label-only-tester') }}</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-col>
                <el-col :span="20">
                    <SearchBar
                        :query.sync="query"
                        :loading="loading"
                        :multipleAgent="multipleAgent"
                        @search="reload(1)"
                    />
                </el-col>
                <el-col :span="20" style="margin: 17px 0 0">
                    <div class="form-group" style="display: flex">
                        <el-date-picker
                            v-model="timeRange"
                            type="datetimerange"
                            size="medium "
                            height="41px"
                            :disabled="loading"
                            :range-separator="pt('time-range.to')"
                            :start-placeholder="pt('time-range.start')"
                            :end-placeholder="pt('time-range.end')"
                            :default-time="['00:00:00', '23:59:59']"
                        ></el-date-picker>
                        <div class="form-group search-btn-box" style="margin: 0 0 0 9px">
                            <el-button
                                size="medium"
                                :disabled="loading"
                                @click="changeDateTime('today')"
                                :class="{ 'el-button--primary': curDate === 'today' }"
                                >{{ pt('today') }}</el-button
                            >
                            <el-button
                                size="medium"
                                :disabled="loading"
                                @click="changeDateTime('yesterday')"
                                :class="{ 'el-button--primary': curDate === 'yesterday' }"
                                >{{ pt('yesterday') }}</el-button
                            >
                            <el-button
                                size="medium"
                                :disabled="loading"
                                @click="changeDateTime('this-week')"
                                :class="{ 'el-button--primary': curDate === 'this-week' }"
                                >{{ pt('this-week') }}</el-button
                            >
                            <el-button
                                size="medium"
                                :disabled="loading"
                                @click="changeDateTime('last-week')"
                                :class="{ 'el-button--primary': curDate === 'last-week' }"
                                >{{ pt('last-week') }}</el-button
                            >
                            <el-button
                                size="medium"
                                :disabled="loading"
                                @click="changeDateTime('this-month')"
                                :class="{ 'el-button--primary': curDate === 'this-month' }"
                                >{{ pt('this-month') }}</el-button
                            >
                            <el-button
                                size="medium"
                                :disabled="loading"
                                @click="changeDateTime('last-month')"
                                :class="{ 'cur-date': curDate === 'last-month' }"
                                >{{ pt('last-month') }}</el-button
                            >
                        </div>
                    </div>
                </el-col>
                <el-col :span="4" style="margin: 17px 0 0">
                    <el-row :gutter="20" type="flex" justify="end">
                        <el-col :span="12" style="display: flex; justify-content: flex-end" class="search-btn-box">
                            <el-button size="medium" :disabled="loading" @click="reload(1)">{{
                                'common.search' | t
                            }}</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <hr />
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-row>
                        <!-- 已過帳報表總額度 -->
                        <el-col :span="24">
                            <div class="report-body">
                                <div class="table-title">{{ 'group-report-title' | pt }}</div>
                                <table class="table table-hover" v-loading="tableLoading.report">
                                    <thead>
                                        <tr>
                                            <th class="col-name">{{ pt('table.platform-name') }}</th>
                                            <th class="col-name">{{ pt('table.num-member') }}</th>
                                            <th class="col-num-bets">{{ pt('table.num-bets') }}</th>
                                            <th class="col-totals">{{ pt('table.sum-bet-amount') }}</th>
                                            <th class="col-totals">{{ pt('table.sum-valid-amount') }}</th>
                                            <th class="col-totals">{{ pt('table.sum-total') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="report in total.reports" :key="report.id">
                                            <td class="col-name">{{ report.name }}</td>
                                            <td
                                                class="number-value col-num-bets"
                                                :class="valueClass(report.countMember)"
                                            >
                                                {{ moneyFormat(report.countMember) }}
                                            </td>
                                            <td class="number-value col-num-bets" :class="valueClass(report.nums)">
                                                {{ report.nums }}
                                            </td>
                                            <td class="number-value col-total" :class="valueClass(report.betAmount)">
                                                {{ moneyFormat(report.betAmount) }}
                                            </td>
                                            <td class="number-value col-total" :class="valueClass(report.validAmount)">
                                                {{ moneyFormat(report.validAmount) }}
                                            </td>
                                            <td class="number-value col-total" :class="valueClass(report.total)">
                                                {{ moneyFormat(report.total) }}
                                            </td>
                                        </tr>
                                        <tr style="border-top: 5px solid #47bac1">
                                            <td class="col-name">{{ 'total_title' | pt }}</td>
                                            <td
                                                class="number-value col-num-bets"
                                                :class="valueClass(totalReport.countMember)"
                                            >
                                                {{ moneyFormat(totalReport.countMember) }}
                                            </td>
                                            <td class="number-value col-num-bets" :class="valueClass(totalReport.nums)">
                                                {{ moneyFormat(totalReport.nums) }}
                                            </td>
                                            <td
                                                class="number-value col-num-bets"
                                                :class="valueClass(totalAmount.betAmount)"
                                            >
                                                {{ moneyFormat(totalAmount.betAmount) }}
                                            </td>
                                            <td
                                                class="number-value col-num-bets"
                                                :class="valueClass(totalAmount.validAmount)"
                                            >
                                                {{ moneyFormat(totalAmount.validAmount) }}
                                            </td>
                                            <td
                                                class="number-value col-num-bets"
                                                :class="valueClass(totalAmount.total)"
                                            >
                                                {{ moneyFormat(totalAmount.total) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12">
                    <el-row>
                        <el-col :span="24" style="margin: 0 0 17px">
                            <div class="report-plus">
                                <el-row :gutter="20">
                                    <!-- 加總 -->
                                    <el-col :span="8" class="report-body">
                                        <el-tooltip
                                            class="item"
                                            effect="dark"
                                            :content="
                                                pt('title.income') +
                                                ' - ' +
                                                pt('title.expense') +
                                                ' - ' +
                                                pt('title.quest')
                                            "
                                            placement="top-start"
                                        >
                                            <el-container>
                                                <el-aside width="80px">
                                                    <img src="~@/assets/images/add-up.svg" alt="" />
                                                </el-aside>
                                                <div class="text">
                                                    <div>
                                                        {{ pt('total_title') }}
                                                    </div>
                                                    <div v-loading="tableLoading.wallet">
                                                        <span>${{ moneyFormat(totalAmount.all) }}</span>
                                                    </div>
                                                </div>
                                            </el-container>
                                        </el-tooltip>
                                    </el-col>
                                    <!-- 收款提款加總 -->
                                    <el-col :span="8" class="report-body">
                                        <el-tooltip
                                            class="item"
                                            effect="dark"
                                            :content="pt('title.income') + ' - ' + pt('title.expense')"
                                            placement="top-start"
                                        >
                                            <el-container>
                                                <el-aside width="80px">
                                                    <img src="~@/assets/images/total.svg" alt="" />
                                                </el-aside>
                                                <div class="text">
                                                    <div>
                                                        {{ pt('balance-title') }}
                                                    </div>
                                                    <div v-loading="tableLoading.wallet">
                                                        <span>${{ moneyFormat(totalAmount.balance) }}</span>
                                                    </div>
                                                </div>
                                            </el-container>
                                        </el-tooltip>
                                    </el-col>
                                    <!-- 註冊人數 -->
                                    <el-col :span="8" class="report-body">
                                        <el-container>
                                            <el-aside width="80px">
                                                <img src="~@/assets/images/registered.svg" alt="" />
                                            </el-aside>
                                            <div class="text">
                                                <div>
                                                    {{ pt('num-registers') }}
                                                </div>
                                                <div v-loading="tableLoading.registers">
                                                    <span
                                                        >{{ moneyFormat(totalMember.numRegisters) }}&nbsp;{{
                                                            pt('sum-member')
                                                        }}</span
                                                    >
                                                </div>
                                            </div>
                                        </el-container>
                                    </el-col>
                                    <!-- 首儲人數 -->
                                    <el-col :span="8" class="report-body">
                                        <el-container>
                                            <el-aside width="80px">
                                                <img src="~@/assets/images/recharge.svg" alt="" />
                                            </el-aside>
                                            <div class="text">
                                                <div>
                                                    {{ pt('num-first-deposit') }}
                                                </div>
                                                <div v-loading="tableLoading.deposit">
                                                    <span
                                                        >{{ moneyFormat(totalMember.numFirstDeposit) }}&nbsp;{{
                                                            pt('sum-member')
                                                        }}</span
                                                    >
                                                </div>
                                            </div>
                                        </el-container>
                                    </el-col>
                                    <!-- 首提人數 -->
                                    <el-col :span="8" class="report-body">
                                        <el-container>
                                            <el-aside width="80px">
                                                <img src="~@/assets/images/pick-up.svg" alt="" />
                                            </el-aside>
                                            <div class="text">
                                                <div>
                                                    {{ pt('num-first-withdraw') }}
                                                </div>
                                                <div v-loading="tableLoading.withdraw">
                                                    <span
                                                        >{{ moneyFormat(totalMember.numFirstWithdraw) }}&nbsp;{{
                                                            pt('sum-member')
                                                        }}</span
                                                    >
                                                </div>
                                            </div>
                                        </el-container>
                                    </el-col>
                                    <!-- 會員的每日登入人數 -->
                                    <el-col :span="8" class="report-body">
                                        <el-tooltip
                                            class="item"
                                            effect="dark"
                                            :content="pt('num-login-member-small')"
                                            placement="top-start"
                                        >
                                            <el-container>
                                                <el-aside width="80px">
                                                    <img src="~@/assets/images/mum-of-logins.svg" alt="" />
                                                </el-aside>
                                                <div class="text">
                                                    <div>
                                                        {{ pt('num-login-member') }}
                                                    </div>
                                                    <div v-loading="tableLoading.login">
                                                        <span
                                                            >{{ moneyFormat(totalMember.numLoginMember) }}&nbsp;{{
                                                                pt('sum-member')
                                                            }}</span
                                                        >
                                                    </div>
                                                </div>
                                            </el-container>
                                        </el-tooltip>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                        <el-col
                            :span="24"
                            v-for="(item, thisType) in totalLogs.types"
                            :key="thisType + item"
                            v-loading="tableLoading.wallet"
                        >
                            <div v-if="thisType === 'income'" :class="'report-body report-' + thisType">
                                <div class="report-title" v-if="thisType === 'income'">
                                    <div v-if="thisType === 'income'" class="border-box">
                                        <div>
                                            <p class="box-title" style="color: #44bac1">
                                                {{ pt('title.' + thisType) }}
                                            </p>
                                            <p class="number">$ {{ moneyFormat(totalMember[thisType]) }}</p>
                                        </div>
                                    </div>
                                    <div v-else class="border-box">
                                        <div>
                                            <p class="box-title" style="color: #ff6064">
                                                {{ pt('title.' + thisType) }}
                                            </p>
                                            <!-- 存款總金額 -->
                                            <p class="number">
                                                {{ moneyFormat(totalMember[thisType]) }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="line"></div>
                                    <div class="members">
                                        <p class="box-title" :class="{ income: thisType === 'income' }">
                                            {{ pt('members') }}
                                        </p>
                                        <!-- 存款總人數 -->
                                        <p class="number">
                                            {{ moneyFormat(totalMember[thisType + 'num']) }}
                                        </p>
                                    </div>
                                </div>
                                <!-- 存款細項 -->
                                <!-- <div v-if="thisType === 'income'">
                                    <el-row :gutter="15">
                                        <el-col
                                            :span="24"
                                            v-for="(detail, index) in totalLogs[thisType]"
                                            :key="index"
                                            :label="detail.name"
                                        >
                                            <el-row class="report-item">
                                                <el-col :span="8">{{ detail.name }}</el-col>
                                                <el-col :span="8">${{ moneyFormat(detail.sum) }}</el-col>
                                                <el-col :span="8"
                                                    >{{ pt('members') }}&nbsp;{{ moneyFormat(detail.countMember) }}</el-col
                                                >
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </div> -->
                            </div>
                        </el-col>
                        <!-- 提款 優惠 派點  統計資料 -->
                        <el-col
                            :span="24"
                            v-for="(item, thisType) in totalLogs.types"
                            :key="thisType"
                            v-loading="tableLoading.wallet"
                            style="margin: 0 0 17px"
                        >
                            <div :class="'report-body report-' + thisType">
                                <div class="report-title" v-if="thisType !== 'income'">
                                    <div :span="11" v-if="thisType === 'income'" class="border-box">
                                        <div>
                                            <p class="box-title" style="color: #44bac1">
                                                {{ pt('title.' + thisType) }}
                                            </p>
                                            <p class="number">$ {{ moneyFormat(totalMember[thisType]) }}</p>
                                        </div>
                                    </div>
                                    <div v-else class="border-box">
                                        <div>
                                            <p class="box-title" style="color: #ff6064">
                                                {{ pt('title.' + thisType) }}
                                            </p>
                                            <p class="number">
                                                {{ moneyFormat(totalMember[thisType]) }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="line"></div>
                                    <div class="members">
                                        <p class="box-title" :class="{ income: thisType === 'income' }">
                                            {{ pt('members') }}
                                        </p>
                                        <p class="number">
                                            {{ moneyFormat(totalMember[thisType + 'num']) }}
                                        </p>
                                    </div>
                                </div>
                                <!-- 提款 優惠 派點細項 -->
                                <div v-if="thisType !== 'income'">
                                    <el-row :gutter="15">
                                        <el-col
                                            :span="24"
                                            v-for="(detail, index) in totalLogs[thisType]"
                                            :key="index"
                                            :label="wallTypePt(detail.type).toString()"
                                        >
                                            <el-row class="report-item">
                                                <el-col :span="8">{{ wallTypePt(detail.type).toString() }}</el-col>
                                                <el-col :span="8">${{ moneyFormat(detail.total) }}</el-col>
                                                <el-col :span="8"
                                                    >{{ pt('members') }}&nbsp;{{
                                                        moneyFormat(detail.countMember)
                                                    }}</el-col
                                                >
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <AnnouncementDialog ref="announcementDialog" @open-detail="openAnnouncementDetail"></AnnouncementDialog>
            <AnnouncementDetailDialog ref="detailDialog"></AnnouncementDetailDialog>
        </div>
        <div v-else></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import $ from 'jquery';
import { prefixTransaction } from '@/i18n';
import actions, { Ajax } from '@/stores/actions';
import { ApiPath } from '../api';
import moment from 'moment';
import selecter from '@/components/common/DateSelecter.vue';
import store from '@/store';
import AnnouncementDialog from '@/components/announcement/AnnouncementDialog.vue';
import AnnouncementDetailDialog from '@/components/announcement/AnnouncementDetailDialog.vue';
import AgentSelectBar, { SearchItem, defaultSearch } from '@/components/common/AgentSelectBar.vue';

export interface AnnounceData {
    title: string;
    content: string;
}

interface MemberItem {
    id: number;
    name: string;
    numRegisters: number;
    numFirstDeposit: number;
    numFirstWithdraw: number;
    numLoginMember: number;
    // sumDeposit: number;
    // sumGiveMember: number;
    // sumTakenBack: number;
    // sumWithdraw: number;
    income: SubItem[];
    expense: SubItem[];
    quest: SubItem[];
    agent: SubItem[]; // 代理相關
}

interface SubItem {
    name: string;
    sum: number;
    countMember: number;
    code: string;
}

interface QueryData extends SearchItem {
    stime: string;
    etime: string;
    excludeTester: 'all' | 'exclude' | 'only';
    type: string | null;
}

interface TotalAmount {
    all: number;
    balance: number;
    deposit: number;
    withdraw: number;
    // report
    total: number;
    betAmount: number;
    validAmount: number;
    // 首存
    firstDeposit: any;
    // 首提
    firstWithdraw: any;
}

const pt = prefixTransaction('view.home');
const wallTypePt = prefixTransaction('common.member-wallet-type');
const defaultSubItem: SubItem = {
    name: '',
    sum: 0,
    countMember: 0,
    code: '',
};
@Component({
    filters: {
        pt,
    },
    components: {
        AnnouncementDialog,
        AnnouncementDetailDialog,
        SearchBar: AgentSelectBar,
    },
})
export default class Home extends Vue {
    public pt = pt;
    public wallTypePt = wallTypePt;
    public multipleAgent: boolean = true;

    public $refs!: {
        announcementDialog: AnnouncementDialog;
        detailDialog: AnnouncementDetailDialog;
        search: AgentSelectBar;
    };

    public timeRange: [moment.Moment, moment.Moment] = [moment().startOf('day'), moment().endOf('day')];
    public input = {
        startTime: '',
        endTime: '',
    };
    public query: QueryData = {
        ...defaultSearch,
        stime: this.input.startTime,
        etime: this.input.endTime,
        franchiseeId: this.franchiseeId,
        level: null,
        excludeTester: 'exclude',
        type: null,
    };

    public loading = false;
    public tableLoading: any = {
        deposit: false,
        withdraw: false,
        wallet: false,
        login: false,
        registers: false,
        report: false,
    };

    public total: any = {
        reports: [],
    };

    public curDate: string = 'today';

    // 總計和人數
    public totalMember: any = {
        numRegisters: 0,
        numFirstDeposit: 0,
        numFirstWithdraw: 0,
        numLoginMember: 0,
        // sumDeposit: 0,
        // sumWithdraw: 0,
        // sumGiveMember: 0,
        // sumTakenBack: 0,
    };

    public totalReport: any = {
        nums: 0,
        total: 0,
        countMember: 0,
        betAmount: 0,
        validAmount: 0,
    };
    public totalAmount: TotalAmount = {
        all: 0,
        balance: 0,
        deposit: 0,
        withdraw: 0,
        betAmount: 0,
        validAmount: 0,
        total: 0,
        firstDeposit: 0,
        firstWithdraw: 0,
    };

    // LOG 各類別細項
    public allTypes: any = [];
    public totalLogs: any = {
        types: [],
    };

    get allowTotal() {
        return store.state.App.allowApi.ApiHomeTotal;
    }

    get franchiseeId() {
        // 連動上列的加盟主選單
        return store.state.App.currentFranchiseeId;
    }

    get user() {
        return store.state.App.user;
    }

    get stgPlatform() {
        if (this.user.level > 2) {
            return false;
        }

        return store.state.App.stgPlatform;
    }

    get hasExcludeTester() {
        return store.state.App.hasExcludeTester;
    }

    @Watch('franchiseeId') public watchCurrentFranchiseeId(fid: number) {
        this.query.franchiseeId = fid;
        this.query.parentId = null;
        this.query.agentId = null;
        this.query.level = null;
        this.reload();
    }

    @Watch('timeRange') public watchTimeRange() {
        if (this.loading) {
            return false;
        }

        this.input.startTime = this.stime();
        this.input.endTime = this.etime();

        // 檢查時間範圍
        const period = 3; // 最多月數
        const range = this.timeRange;
        const stime = moment(this.input.startTime).add(period, 'M');
        const etime = moment(this.input.endTime);

        if (stime.isBefore(etime)) {
            actions.notify.error(
                pt('time-range.invalid', {
                    months: period,
                }),
            );
            return false;
        }

        this.$nextTick(() => this.reload());
    }

    @Watch('query.excludeTester') public watchExcludeTester(option: any) {
        this.$nextTick(() => this.reload());
    }

    public openAnnouncementDetail(data: AnnounceData) {
        this.$refs.detailDialog.open(data.title, data.content);
    }

    public mounted() {
        if (!store.state.App.allowApi.ApiHomeTotal) {
            this.$router.push('/blank');
            return;
        }
        this.input.startTime = this.stime();
        this.input.endTime = this.etime();
        this.$refs.announcementDialog.open();
        this.$nextTick(() => this.reload());
    }

    public changeDateTime(type: string) {
        this.curDate = type;
        this.timeRange = selecter.getRangeDate(type);
    }

    public stime() {
        const range = this.timeRange;
        const stime = (range && moment(range[0])) || moment().startOf('month');
        return stime.format('YYYY-MM-DD HH:mm:ss');
    }

    public etime() {
        const range = this.timeRange;
        const etime = (range && moment(range[1])) || moment().endOf('month');
        return etime.format('YYYY-MM-DD HH:mm:ss');
    }

    public reload() {
        if (this.loading || !this.allowTotal) {
            return false;
        }

        this.totalMember.numRegisters = 0;
        this.totalMember.numFirstDeposit = 0;
        this.totalMember.numFirstWithdraw = 0;
        this.totalMember.numLoginMember = 0;
        this.allTypes = [];
        this.totalLogs = {
            types: [],
        };

        for (const key in this.totalReport) {
            if (key !== null) {
                this.totalReport[key] = 0;
            }
        }

        const data: QueryData = {
            ...this.query,
            stime: this.input.startTime,
            etime: this.input.endTime,
        };
        this.loading = true;
        this.tableLoading.report = true;

        const mainPromise: Promise<any> = Ajax.get(ApiPath.ApiHomeTotal, { data })
            .then((res: any) => {
                this.allTypes = res.data.types;
                this.totalLogs.types = res.data.types;

                // Object.keys(this.totalLogs.types).map((index: string) => {
                //     // 初始化各類別的細項
                //     this.totalLogs[index] = [];
                //     this.totalMember[index] = 0;
                //     this.totalMember[index + 'num'] = 0;

                //     // 整段拔掉 派點也會不見
                //     // console.log(this.totalLogs); 印出來金額早就已存在 但是不要被誤導 金額不是在這行之前就寫入
                //     // 而是因為下方用Promise.resolve  請往下閱讀==>撈取其他資料mainPromise.then
                //     // 存款項目細項 但是不含金額
                //     this.totalLogs.types[index].forEach((o: any) => {
                //         const obj = {
                //             ...defaultSubItem,
                //             code: o,
                //             name: this.wallTypePt(o).toString(),
                //         };
                //         this.totalLogs[index].push(obj);
                //     });
                // });

                const reportArr: any = [];
                this.total.reports = res.data.reports;
                for (const prop in this.total.reports) {
                    if (prop != null) {
                        reportArr.push(this.total.reports[prop]);
                    }
                }
                reportArr.forEach((item: any) => {
                    this.totalReport.nums += Number(item.nums);
                    this.totalReport.countMember += Number(item.countMember);
                });

                // 直接印出金額的幒和
                this.totalAmount = { ...res.data.total };
            })
            .catch((res: any) => {
                actions.notify.error(res);
                this.loading = false;
            })
            .finally(() => {
                this.tableLoading.report = false;
            });

        // 撈取其他資料
        mainPromise
            .then((res) => {
                // 存款相關 應該是首存
                if (!this.tableLoading.deposit) {
                    const depositData: QueryData = {
                        ...this.query,
                        stime: this.input.startTime,
                        etime: this.input.endTime,
                        type: 'num-first-deposit',
                    };
                    this.tableLoading.deposit = true;

                    Ajax.get(ApiPath.ApiHomeDetail, { data: depositData })
                        .then((depositRes: any) => {
                            this.totalMember.numFirstDeposit = depositRes.data.content;

                            return Promise.resolve(depositRes);
                        })
                        .catch((errRes) => {
                            actions.notify.error(errRes);
                        })
                        .finally(() => {
                            this.tableLoading.deposit = false;
                            this.checkLoading();
                        });
                }

                // 首提人數
                if (!this.tableLoading.withdraw) {
                    const withdrawData: QueryData = {
                        ...this.query,
                        stime: this.input.startTime,
                        etime: this.input.endTime,
                        type: 'num-first-withdraw',
                    };
                    this.tableLoading.withdraw = true;
                    Ajax.get(ApiPath.ApiHomeDetail, { data: withdrawData })
                        .then((withdrawRes: any) => {
                            this.totalMember.numFirstWithdraw = withdrawRes.data.content;
                            return Promise.resolve(withdrawRes);
                        })
                        .catch((errRes) => {
                            actions.notify.error(errRes);
                        })
                        .finally(() => {
                            this.tableLoading.withdraw = false;
                            this.checkLoading();
                        });
                }

                // LOG MEMBER WALLET (拿取存款 提款 優惠 派點 明細)
                // if (!this.tableLoading.wallet) {
                //     const walletData: QueryData = {
                //         ...this.query,
                //         stime: this.input.startTime,
                //         etime: this.input.endTime,
                //         type: 'log-member-wallet',
                //     };
                //     this.tableLoading.wallet = true;

                //     Ajax.get(ApiPath.ApiHomeDetail, { data: walletData })
                //         .then((walletRes: any) => {
                //             walletRes.data.content.map((item: any, i: any) => {
                //                 const code = item.type;
                //                 const thisType = this.getType(code);
                //                 const sum = item.total;
                //                 const countMember = item.mid;
                //                 // 拔掉存款明細金額 整段拔掉 派點也會不見
                //                 if (thisType) {
                //                     this.totalLogs[thisType].map((o: any) => {
                //                         if (o.code === code) {
                //                             o.sum = sum;
                //                             o.countMember = countMember;
                //                         }
                //                     });
                //                 }
                //             });

                //             // 總計
                //             Object.keys(walletRes.data.sum).map((thisType: string) => {
                //                 const item = walletRes.data.sum[thisType];

                //                 if (item) {
                //                     this.totalMember[thisType] = item.total;
                //                     this.totalMember[thisType + 'num'] = item.mem;
                //                 }
                //             });

                //             this.totalAmount.all = walletRes.data.all;
                //             this.totalAmount.balance = walletRes.data.balance;

                //             return Promise.resolve(walletRes);
                //         })
                //         .catch((errRes) => {
                //             actions.notify.error(errRes);
                //         })
                //         .finally(() => {
                //             this.tableLoading.wallet = false;
                //             this.checkLoading();
                //         });
                // }

                // 新版 拿取(存款 提款 優惠 派點) 統計資料
                if (!this.tableLoading.wallet) {
                    const walletData: QueryData = {
                        ...this.query,
                        stime: this.input.startTime,
                        etime: this.input.endTime,
                    };
                    this.tableLoading.wallet = true;
                    Ajax.get(ApiPath.ApiHomeGetTotalData, { data: walletData })
                        .then((walletRes: any) => {
                            const wres = walletRes.data.content;
                            Object.keys(wres).map((type: any) => {
                                let key = type;
                                if (type === 'dispatch') {
                                    // 舊版的派點key
                                    key = 'agent';
                                }
                                // 各類項目 標頭統計資料
                                this.totalMember[key] = wres[type].total;
                                this.totalMember[key + 'num'] = wres[type].countMember;
                                // 統計資料細項
                                if (wres[type].detail) {
                                    this.totalLogs[key] = wres[type].detail;
                                }
                            });

                            // 總欄位
                            // 加總 欄位(總收款 - 總提款 - 總優惠)
                            this.totalAmount.all = walletRes.data.sum.all;
                            // 存提加總 欄位(總收款 - 總提款)
                            this.totalAmount.balance = walletRes.data.sum.balance;
                            return Promise.resolve(walletRes);
                        })
                        .catch((errRes) => {
                            actions.notify.error(errRes);
                        })
                        .finally(() => {
                            this.tableLoading.wallet = false;
                            this.checkLoading();
                        });
                }

                // 登入
                if (!this.tableLoading.login) {
                    const loginData: QueryData = {
                        ...this.query,
                        stime: this.input.startTime,
                        etime: this.input.endTime,
                        type: 'login',
                    };
                    this.tableLoading.login = true;

                    Ajax.get(ApiPath.ApiHomeDetail, { data: loginData })
                        .then((loginRes: any) => {
                            this.totalMember.numLoginMember = loginRes.data.content;

                            return Promise.resolve(loginRes);
                        })
                        .catch((errRes) => {
                            actions.notify.error(errRes);
                        })
                        .finally(() => {
                            this.tableLoading.login = false;
                            this.checkLoading();
                        });
                }

                // 註冊
                if (!this.tableLoading.registers) {
                    const registerData: QueryData = {
                        ...this.query,
                        stime: this.input.startTime,
                        etime: this.input.endTime,
                        type: 'registers',
                    };
                    this.tableLoading.registers = true;

                    Ajax.get(ApiPath.ApiHomeDetail, { data: registerData })
                        .then((registerRes: any) => {
                            this.totalMember.numRegisters = registerRes.data.content;

                            return Promise.resolve(registerRes);
                        })
                        .catch((errRes) => {
                            actions.notify.error(errRes);
                        })
                        .finally(() => {
                            this.tableLoading.registers = false;
                            this.checkLoading();
                        });
                }
            })
            .catch((res) => {
                actions.notify.error(res);
                this.loading = false;
                this.tableLoading.deposit = false;
                this.tableLoading.withdraw = false;
                this.tableLoading.wallet = false;
                this.tableLoading.login = false;
                this.tableLoading.registers = false;
            })
            .finally(() => {
                this.checkLoading();
            });
    }

    public valueClass(value: number) {
        return value === 0 ? '' : value > 0 ? 'plus' : 'minus';
    }

    public moneyFormat(value: number | string) {
        return Vue.filter('mf')(value, 2);
    }

    public checkLoading() {
        if (
            this.tableLoading.deposit ||
            this.tableLoading.withdraw ||
            this.tableLoading.wallet ||
            this.tableLoading.login ||
            this.tableLoading.registers
        ) {
            this.loading = true;
        } else {
            this.loading = false;
        }
    }

    public getType(code: string) {
        return Object.keys(this.allTypes)
            .filter((thisType: string) => {
                if (this.allTypes[thisType].indexOf(code) > -1) {
                    return true;
                }
            })
            .pop();
    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.home {
    .table-title {
        display: flex;
        align-items: center;
        height: 59px;
        padding: 23px;
        font-size: 16px;
    }
    .table {
        thead {
            background: #495057;
            color: #fff;
        }
        th {
            text-align: center;
        }
        td {
            font-family: 'Microsoft JhengHei';

            &.col-name {
                font-weight: bold;
                text-align: center;
            }
            &.col-number,
            &.col-num-bets,
            &.col-total {
                text-align: right;
            }
        }
    }

    .number-value {
        color: #ccc;
        &.plus {
            color: color(primary);
        }
        &.minus {
            color: color(danger);
        }
    }

    .el-row {
        // margin-bottom: 20px;
        &.search-bar {
            margin-top: 10px;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
    .report-body {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
    .report-title {
        display: flex;
        align-items: center;
        height: 110px;
        padding: 10px;

        .border-box {
            width: 50%;
            height: 110px;
            padding: 20px;
        }

        .line {
            width: 1px;
            height: 62px;
            background: #ccc;
        }

        .box-title {
            font-size: 16px;
            margin: 0;
        }

        .number {
            font-size: 40px;
        }

        .members {
            width: 50%;
            height: 110px;
            padding: 20px;
            .box-title {
                color: #ff6064;
            }

            .income {
                color: #44bac1;
            }
        }
    }
    .report-income {
        margin-bottom: 10px;
        .report-title {
            border-bottom: 6px solid #47bac1;
        }
    }
    .report-expense,
    .report-quest,
    .report-agent {
        margin-bottom: 10px;
        .report-title {
            border-bottom: 6px solid #ff6064;
        }
    }
    .report-item {
        height: 54px;
        border-radius: 4px;
        padding: 10px 5px 5px 23px;
        border-bottom: 1px solid #c8c8c8;
        font-size: 22px;
    }
    .report-plus {
        border-radius: 8px;
        padding-right: 10px;
        padding-left: 10px;

        .report-body {
            border-radius: 0;
            height: 140px;
            overflow: hidden;

            img {
                width: 65px;
                height: 80px;
            }

            .text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 0 0 10px;
                font-size: 22px;

                span {
                    font-size: 28px;
                    line-height: 28px;
                    word-break: break-all;
                }
            }
        }

        .el-aside {
            text-align: center;
            line-height: 120px;
            overflow: hidden;
            .report-icon {
                font-size: xx-large;
            }
        }
        .el-main {
            text-align: center;
            line-height: 10px;
            overflow: hidden;
            div {
                padding: 10px;
                background-color: #ebeef5;
            }
            div:first-child {
                height: 70%;
                overflow: hidden;
            }
        }
    }
}
</style>
