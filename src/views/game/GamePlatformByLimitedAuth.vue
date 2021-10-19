<template>
    <div>
        <form class="d-flex flex-wrap" @submit.prevent="reload(1)">
            <div class="form-group col-2">
                <label>{{ pt('key') }}</label>
                <input class="form-control" v-model="query.key" />
            </div>

            <div class="form-group col-2">
                <label>{{ pt('name') }}</label>
                <input class="form-control" v-model="query.name" />
            </div>

            <div class="form-group col-2">
                <label>{{ 'common.status-enabled-label' | t }}</label>
                <select class="form-control" v-model="query.enabled" @change="reload(1)">
                    <option :value="-1">{{ 'common.all' | t }}</option>
                    <option :value="1">{{ 'common.status-enabled' | t }}</option>
                    <option :value="0">{{ 'common.status-disabled' | t }}</option>
                </select>
            </div>

            <div class="form-group col-2">
                <label>{{ 'view.gamePlatform.status-maintain.status-maintain' | t }}</label>
                <select class="form-control" v-model="query.maintain" @change="reload(1)">
                    <option :value="-1">{{ 'common.all' | t }}</option>
                    <option :value="1">{{ 'view.gamePlatform.status-maintain.yes' | t }}</option>
                    <option :value="0">{{ 'view.gamePlatform.status-maintain.no' | t }}</option>
                </select>
            </div>

            <div class="col"></div>
            <div class="col-auto">
                <label>&nbsp;</label>
                <div>
                    <el-button
                        size="small"
                        class="tako-el-btn"
                        native-type="submit"
                        :loading="loading"
                        :disabled="loading"
                        >{{ 'common.search' | t }}</el-button
                    >
                    <el-button size="small" class="tako-el-btn" @click="clearQuery()" :disabled="loading">{{
                        'common.clear' | t
                    }}</el-button>
                    <el-button
                        size="small"
                        class="tako-el-btn"
                        type="primary"
                        @click.native.prevent="addGamePlatform()"
                        :disabled="loading"
                        >{{ 'common.add' | t }}</el-button
                    >
                </div>
            </div>
        </form>

        <ListGrid ref="grid" :data="response" :loading.sync="loading" sorts="id,asc" @change="reload">
            <el-table-column
                prop="key"
                align="center"
                :label="pt('key')"
                width="120"
                sortable="custom"
            ></el-table-column>

            <el-table-column prop="name" align="center" :label="pt('name')" sortable="custom">
                <template slot-scope="{ row }">
                    <span>{{ row.name }}</span>
                    <span class="badge badge-primary pull-right" v-show="row.fun">{{ 'is-fun' | pt }}</span>
                </template>
            </el-table-column>

            <el-table-column
                prop="routineMaintain"
                align="center"
                :label="pt('col.routine-maintain')"
                width="200"
            ></el-table-column>

            <!-- 單次臨時維護 -->
            <el-table-column
                prop="routineDisposableMaintain"
                align="center"
                :label="pt('col.routine-temporary-maintain')"
                width="200"
            ></el-table-column>

            <el-table-column prop="limit" align="center" width="120" :label="pt('col.limit-member')">
                <template slot-scope="{ row }">
                    <span v-show="row.limit === 0">{{ 'view.gamePlatform.col.no-limit-member' | t }}</span>
                    <el-button v-show="row.limit !== 0" size="mini" @click="limitMembers(row)">{{
                        'view.gamePlatform.col.limit-member' | t
                    }}</el-button>
                </template>
            </el-table-column>

            <el-table-column
                prop="maintain"
                sortable="custom"
                align="center"
                width="160"
                :label="pt('status-maintain.status-maintain')"
            >
                <template slot-scope="{ row }">
                    <ToggleButton :value="row.promiseMaintain" @click="toggleMaintain(row, $event)">
                        <span class="label-true" slot="label-true">{{
                            'view.gamePlatform.status-maintain.no' | t
                        }}</span>
                        <span class="label-false" slot="label-false">{{
                            'view.gamePlatform.status-maintain.yes' | t
                        }}</span>
                    </ToggleButton>
                </template>
            </el-table-column>

            <el-table-column
                prop="enabled"
                sortable="custom"
                width="100"
                align="center"
                :label="$t('common.status-enabled-label')"
            >
                <template slot-scope="{ row }">
                    <span v-if="row.enabled">
                        {{ $t('common.status-enabled') }}
                    </span>
                    <span v-else>
                        {{ $t('common.status-disabled') }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column
                prop="order"
                width="80"
                align="center"
                :label="pt('col.order')"
                sortable="custom"
            ></el-table-column>

            <el-table-column prop="option" :label="$t('common.option')" align="center" width="120">
                <template slot-scope="{ row }">
                    <el-button size="mini" @click="edit(row)">{{ 'common.edit' | t }}</el-button>
                </template>
            </el-table-column>
        </ListGrid>

        <ComponentEdit ref="dialog" @saved="reload()" :isLimitedAuth="true"></ComponentEdit>

        <LimitDialog ref="limitMemberDialog"></LimitDialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import actions, { Ajax } from '@/stores/actions';
import ListGrid from '@/components/common/list/ListGrid.vue';
import { ApiPath } from '@/api';
import GamePlatformEditDialog from '@/components/game/GamePlatformEditDialog.vue';
import LimitMembersDialog from '@/components/game/LimitMembersDialog.vue';
import { prefixTransaction } from '@/i18n';

interface GamePlatformItem {
    id: number;
    key: string;
    name: string;
    maintain: boolean;
    fun: boolean;
    agent: string;
    memberPrefix: string;
    maintainCrontab: string;
    maintainMinute: number;
    disposableMaintainDate: string;
    disposableMaintain: number;
    routineMaintain: string;
    namespace: string;
    whitelist: string;
    limit: number;
    limits: [] | null;
    enabled: boolean;
    syncReportDelay: number;
    order: number;
    setting: string;
    promiseEnabled: Promise<boolean>;
    promiseMaintain: Promise<boolean>;
    platformId: number;
    hasApp: boolean;
    imageUrl: string | null;
    iconUrl: string | null;
    pageBgImgUrl: string | null;
    indexImgUrl: string | null;
    headerImgUrl: string | null;
}

const pt = prefixTransaction('view.gamePlatform');

@Component({
    filters: { pt },
    components: {
        ComponentEdit: GamePlatformEditDialog,
        LimitDialog: LimitMembersDialog,
    },
})
export default class GamePlatformByLimitedAuth extends Vue {
    public pt = pt;
    public $refs!: {
        grid: ListGrid;
        dialog: GamePlatformEditDialog;
        limitMemberDialog: LimitMembersDialog;
    };
    public response: Promise<IAjax.Result> | null = null;
    public loading = false;
    public rows: any[] = [];
    public query = {
        key: '',
        name: '',
        enabled: -1,
        maintain: -1,
    };

    public mounted() {
        this.reload(1);
    }

    public reload(page?: number) {
        if (this.$refs.grid.isLoading) {
            return;
        }

        const data = {
            ...this.query,
            ...this.$refs.grid.query,
            page: page || this.$refs.grid.query.page,
        };

        this.response = Ajax.get(ApiPath.ApiGamePlatformListLimitedAuth, { data })
            .then((res) => {
                res.data.content.forEach((row: any) => {
                    row.enabled = Number(row.enabled) === 1 ? true : false;
                    row.fun = Number(row.fun) === 1 ? true : false;
                    row.maintain = Number(row.maintain) === 1 ? true : false;
                    row.hasApp = Number(row.hasApp) === 1 ? true : false;
                    row.promiseEnabled = Promise.resolve(row.enabled);
                    row.promiseMaintain = Promise.resolve(!row.maintain);
                    row.routineMaintain = this.handleMaintain(row.maintainCrontab, row.maintainMinute);
                    row.routineDisposableMaintain = this.handleDisposableMaintain(
                        row.disposableMaintainDate,
                        row.disposableMaintain,
                    );
                });
                return Promise.resolve(res);
            })
            .finally(() => {
                this.loading = false;
            });
    }

    public handleMaintain(crontab: string, length: number) {
        if (!crontab || !length) {
            return '';
        }

        const cron = crontab.split(' ');
        let day = '';
        switch (cron[4]) {
            case '0':
                day = String(this.$t('common.week.sunday'));
                break;
            case '1':
                day = String(this.$t('common.week.monday'));
                break;
            case '2':
                day = String(this.$t('common.week.tuesday'));
                break;
            case '3':
                day = String(this.$t('common.week.wednesday'));
                break;
            case '4':
                day = String(this.$t('common.week.thursday'));
                break;
            case '5':
                day = String(this.$t('common.week.friday'));
                break;
            case '6':
                day = String(this.$t('common.week.saturday'));
                break;
        }
        const data = {
            day,
            min: length,
            time: cron[1] + ':' + cron[0],
        };
        return this.pt('col.routine-maintain-data', data);
    }

    public handleDisposableMaintain(date: string, min: number) {
        if (!date || !min) {
            return '';
        }
        const data = {
            date,
            min,
        };
        return this.pt('col.disposable-maintain-data', data);
    }

    public clearQuery() {
        this.query.key = '';
        this.query.name = '';
        this.query.enabled = -1;
        this.query.maintain = -1;
        this.reload(1);
    }

    public edit(row: GamePlatformItem) {
        this.$refs.dialog.open({
            id: row.id,
            key: row.key,
            name: row.name,
            maintain: row.maintain,
            fun: false,
            memberPrefix: '',
            maintainCrontab: row.maintainCrontab,
            maintainMinute: row.maintainMinute,
            disposableMaintainDate: row.disposableMaintainDate,
            disposableMaintain: row.disposableMaintain,
            limit: row.limit ? true : false,
            enabled: row.enabled,
            syncReportDelay: 0,
            setting: '',
            order: row.order,
            namespace: '',
            whitelist: '',
            platformId: row.platformId,
            hasApp: false,
            imageUrl: row.imageUrl,
            iconUrl: row.iconUrl,
            pageBgImgUrl: row.pageBgImgUrl,
            indexImgUrl: row.indexImgUrl,
            headerImgUrl: row.headerImgUrl,
        });
    }

    public addGamePlatform() {
        this.$refs.dialog.open();
    }

    public toggleMaintain(row: GamePlatformItem, maintain: boolean) {
        const data = { id: row.id, maintain: maintain ? 0 : 1 };
        row.promiseMaintain = Ajax.post(ApiPath.ApiGamePlatformToggleMaintain, { data }).then(() => {
            row.maintain = !maintain;
            const enabled = row.enabled ? 1 : 0;

            const limitArr: any = [];
            if (row.limits) {
                row.limits.forEach((item: any) => {
                    limitArr.push(item.memberId);
                });
            }
            // 被要求 即使是這邊沒有修改到的欄位 也要全送
            actions.socket.gamePlatformMaintainUpdate(
                row.id,
                data.maintain,
                enabled,
                row.limit,
                limitArr,
                row.maintainCrontab,
                row.maintainMinute,
                row.disposableMaintainDate,
                row.disposableMaintain,
            );
            return Promise.resolve(maintain);
        });
    }

    public limitMembers(row: GamePlatformItem) {
        this.$refs.limitMemberDialog.open(row.id);
    }
}
</script>
