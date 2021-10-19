<template>
    <div>
        <form class="d-flex flex-wrap" @submit.prevent="reload(1)">
            <div class="form-group col-2">
                <label>{{ $t('view.game.name') }}</label>
                <input class="form-control" v-model="query.name" />
            </div>

            <div class="form-group col-2">
                <label for="">{{ $t('view.game.key') }}</label>
                <select class="form-control" v-model="query.platformId" value-key="id" @change="reload(1)">
                    <option :value="0">{{ 'common.all' | t }}</option>
                    <option v-for="item in platformOptions" :key="item.id" :value="item.id" :label="item.name"></option>
                </select>
            </div>

            <div class="form-group col-2">
                <label for="">{{ $t('view.game.type') }}</label>
                <select class="form-control" v-model="query.type" value-key="id" @change="reload(1)">
                    <option value="">{{ 'common.all' | t }}</option>
                    <option v-for="item in typeOptions" :key="item.type" :value="item.type" :label="item.name"></option>
                </select>
            </div>

            <div class="form-group col-2">
                <label for="">{{ $t('view.game.tag') }}</label>
                <select class="form-control" v-model="query.tag" value-key="id" @change="reload(1)">
                    <option value="">{{ 'common.all' | t }}</option>
                    <option v-for="item in tagOptions" :key="item.tag" :value="item.tag" :label="item.name"></option>
                </select>
            </div>

            <div class="form-group col-2">
                <label>{{ 'view.gamePlatform.status-maintain.status-maintain' | t }} </label>
                <select class="form-control" v-model="query.maintain" @change="reload(1)">
                    <option :value="-1">{{ 'common.all' | t }}</option>
                    <option :value="1">{{ 'view.gamePlatform.status-maintain.yes' | t }}</option>
                    <option :value="0">{{ 'view.gamePlatform.status-maintain.no' | t }}</option>
                </select>
            </div>

            <div class="form-group col-2">
                <label>{{ 'common.status-enabled-label' | t }} </label>
                <select class="form-control" v-model="query.enabled" @change="reload(1)">
                    <option :value="-1">{{ 'common.all' | t }}</option>
                    <option :value="1">{{ 'common.status-enabled' | t }}</option>
                    <option :value="0">{{ 'common.status-disabled' | t }}</option>
                </select>
            </div>

            <div class="col"></div>
            <div class="col-auto">
                <label> &nbsp; </label>
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
                        @click.native.prevent="addGame()"
                        :disabled="loading"
                        >{{ 'common.add' | t }}</el-button
                    >
                </div>
            </div>
        </form>

        <el-button @click="batchMaintain">{{ 'view.game.batchMaintain' | t }}</el-button>

        <ListGrid ref="grid" :data="response" :loading.sync="loading" sorts="id,asc" @change="reload">
            <el-table-column prop="platformName" :label="$t('view.game.col.platformName')" sortable="custom">
            </el-table-column>

            <el-table-column prop="code" :label="$t('view.game.col.code')" sortable="custom"> </el-table-column>

            <el-table-column prop="name" :label="$t('view.game.name')" sortable="custom"> </el-table-column>

            <el-table-column prop="typeName" :label="$t('view.game.type')" sortable="custom"> </el-table-column>

            <el-table-column prop="order" :label="$t('view.game.col.order')" sortable="custom"> </el-table-column>

            <el-table-column prop="showTag" :label="$t('view.game.tag')" sortable="custom" width="150px">
            </el-table-column>

            <el-table-column prop="updatedAt" :label="$t('common.col-updated-at')" sortable="custom"> </el-table-column>

            <el-table-column prop="maintain" sortable="custom" :label="$t('view.game.status-maintain.status-maintain')">
                <template slot-scope="{ row }">
                    <ToggleButton :value="row.promiseMaintain" @click="toggleMaintain(row, $event)">
                        <span class="label-true" slot="label-true">{{ 'view.game.status-maintain.no' | t }} </span>
                        <span class="label-false" slot="label-false">{{ 'view.game.status-maintain.yes' | t }} </span>
                    </ToggleButton>
                </template>
            </el-table-column>

            <el-table-column prop="enabled" sortable="custom" :label="$t('common.status-enabled-label')">
                <template slot-scope="{ row }">
                    <ToggleButton :value="row.promiseEnabled" @click="toggleEnabled(row, $event)" />
                </template>
            </el-table-column>

            <el-table-column :label="$t('common.option')">
                <template slot-scope="{ row }">
                    <el-button size="mini" @click="edit(row)">{{ 'common.edit' | t }} </el-button>
                </template>
            </el-table-column>
        </ListGrid>

        <ComponentEdit ref="dialog" @saved="reload()"> </ComponentEdit>

        <batchMaintainDialog ref="batchMaintainDialog" @saved="reload()"> </batchMaintainDialog>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ListGrid from '@/components/common/list/ListGrid.vue';
import actions, { Ajax } from '@/stores/actions';
import { ApiPath } from '@/api';
import GameEditDialog from '@/components/game/GameEditDialog.vue';
import BatchToggleMaintainEditDialog from '@/components/game/BatchToggleMaintainEditDialog.vue';

interface GameItem {
    id: number;
    platformKey: string;
    platformName: string;
    platformId: number;
    code: string;
    codeMobile: string;
    codeReport: string;
    name: string;
    nameZhCn: string;
    nameZhTw: string;
    nameEn: string;
    nameJp: string;
    type: string;
    typeName: string;
    tags: Array<{
        tag: string;
        name: string;
    }>;
    showTag: string;
    enabled: boolean;
    maintain: boolean;
    order: number;
    imageUrl: string;
    remark: string;
    updatedAt: string;
    gameHall: string;

    promiseEnabled: Promise<boolean>;
    promiseMaintain: Promise<boolean>;
}

interface PlatformOption {
    id: number;
    name: string;
}

interface TypeOption {
    type: string;
    name: string;
}

interface TagOption {
    tag: string;
    name: string;
}

@Component({
    components: {
        ComponentEdit: GameEditDialog,
        batchMaintainDialog: BatchToggleMaintainEditDialog,
    },
})
export default class Game extends Vue {
    public $refs!: {
        grid: ListGrid;
        dialog: GameEditDialog;
        batchMaintainDialog: BatchToggleMaintainEditDialog;
    };
    public response: Promise<IAjax.Result> | null = null;
    public loading = false;
    public rows: any[] = [];
    public query = {
        platformId: 0,
        type: '',
        tag: '',
        name: '',
        enabled: -1,
        maintain: -1,
    };

    public tagOptions: TagOption[] = [];
    public typeOptions: TypeOption[] = [];
    public platformOptions: PlatformOption[] = [];

    public mounted() {
        this.reload(1);
        this.getTagOptions();
        this.getTypeOptions();
        this.getPlatformOptions();
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

        this.response = Ajax.get(ApiPath.ApiGameList, { data })
            .then((res) => {
                res.data.content.forEach((row: any) => {
                    row.enabled = row.enabled === 1 ? true : false;
                    row.maintain = row.maintain === 1 ? true : false;
                    row.promiseEnabled = Promise.resolve(row.enabled);
                    row.promiseMaintain = Promise.resolve(!row.maintain);

                    row.showTag = '';
                    for (let i = 0; i < row.tags.length; i++) {
                        row.showTag += row.tags[i].name;
                        if (i !== row.tags.length - 1) {
                            row.showTag += ', ';
                        }
                    }
                });
                return Promise.resolve(res);
            })
            .finally(() => {
                this.loading = false;
            });
    }

    public clearQuery() {
        this.query.platformId = 0;
        this.query.type = '';
        this.query.tag = '';
        this.query.name = '';
        this.query.enabled = -1;
        this.query.maintain = -1;
        this.reload(1);
    }

    public edit(row: GameItem) {
        this.$refs.dialog.open({
            id: row.id,
            platformId: row.platformId,
            platformName: row.platformName,
            code: row.code,
            codeReport: row.codeReport,
            codeMobile: row.codeMobile,
            nameZhCn: row.nameZhCn,
            nameZhTw: row.nameZhTw,
            nameEn: row.nameEn,
            nameJp: row.nameJp,
            type: row.type,
            typeName: row.typeName,
            maintain: row.maintain,
            enabled: row.enabled,
            order: row.order,
            tags: row.tags,
            remark: row.remark,
            gameHall: row.gameHall,
            imageUrl: row.imageUrl,
        });
    }

    public addGame() {
        this.$refs.dialog.open();
    }

    public toggleEnabled(row: GameItem, enabled: boolean) {
        const data = { id: row.id, enabled: enabled ? 1 : 0 };
        row.promiseEnabled = Ajax.post(ApiPath.ApiGameToggleEnabled, { data }).then(() => {
            row.enabled = enabled;
            const maintain = row.maintain ? 0 : 1;
            actions.socket.gameMaintainUpdate(row.id, maintain, row.platformId, enabled ? 1 : 0);
            return Promise.resolve(enabled);
        });
    }

    public toggleMaintain(row: GameItem, maintain: boolean) {
        const data = { ids: [row.id], maintain: maintain ? 0 : 1 };
        row.promiseMaintain = Ajax.post(ApiPath.ApiGameToggleMaintain, { data }).then(() => {
            row.maintain = !maintain;
            actions.socket.gameMaintainUpdate(row.id, data.maintain, row.platformId);
            return Promise.resolve(maintain);
        });
    }

    public getTagOptions() {
        Ajax.get(ApiPath.ApiGameGameTagOptions).then((res) => {
            this.tagOptions = res.data;
        });
    }

    public getTypeOptions() {
        Ajax.get(ApiPath.ApiGameGameTypeOptions).then((res) => {
            this.typeOptions = res.data;
        });
    }

    public getPlatformOptions() {
        Ajax.get(ApiPath.ApiGamePlatformOptions).then((res) => {
            this.platformOptions = res.data;
        });
    }

    public batchMaintain() {
        this.$refs.batchMaintainDialog.open();
    }
}
</script>
