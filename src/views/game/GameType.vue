<template>
    <div>
        <form class="d-flex flex-wrap" @submit.prevent="reload(1)">
            <div class="form-group col-2">
                <label>{{ $t('view.gameType.search.type') }}</label>
                <input class="form-control" v-model="query.type" />
            </div>

            <div class="col"></div>
            <div class="col-auto">
                <label> &nbsp; </label>
                <div>
                    <el-button size="small" class="tako-el-btn" native-type="submit" :loading="loading" :disabled="loading">{{
                        'common.search' | t
                    }}</el-button>
                    <el-button size="small" class="tako-el-btn" @click="clearQuery()" :disabled="loading">{{
                        'common.clear' | t
                    }}</el-button>
                    <el-button size="small" class="tako-el-btn" type="primary" @click.native.prevent="addGameType()" :disabled="loading">{{
                        'common.add' | t
                    }}</el-button>
                </div>
            </div>
        </form>

        <ListGrid ref="grid" :data="response" :loading.sync="loading" sorts="type,asc" @change="reload">
            <el-table-column prop="type" align="center" :label="$t('view.gameType.col.type')" sortable="custom">
            </el-table-column>

            <el-table-column prop="name" align="center" :label="$t('view.gameType.col.name')" sortable="custom">
            </el-table-column>

            <el-table-column prop="updatedAt" align="center" :label="$t('common.col-updated-at')" sortable="custom">
            </el-table-column>

            <el-table-column align="center" :label="$t('common.option')">
                <template slot-scope="{ row }">
                    <el-button size="mini" @click="edit(row)">{{ 'common.edit' | t }} </el-button>
                </template>
            </el-table-column>
        </ListGrid>

        <ComponentEdit ref="dialog" @saved="reload()"></ComponentEdit>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Ajax } from '@/stores/actions';
import ListGrid from '@/components/common/list/ListGrid.vue';
import { ApiPath } from '@/api';
import GameTypeEditDialog from '@/components/game/GameTypeEditDialog.vue';

interface GameTypeItem {
    id: number;
    type: string;
    name: string;
    updatedAt: string;
}

@Component({
    components: {
        ComponentEdit: GameTypeEditDialog,
    },
})
export default class GameType extends Vue {
    public $refs!: {
        grid: ListGrid;
        dialog: GameTypeEditDialog;
    };
    public response: Promise<IAjax.Result> | null = null;
    public loading = false;
    public rows: any[] = [];
    public query = {
        type: '',
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

        this.response = Ajax.get(ApiPath.ApiGameTypeList, { data })
            .then((res) => {
                res.data.content.forEach((row: any) => {
                    row.id = 1;
                });
                return Promise.resolve(res);
            })
            .finally(() => {
                this.loading = false;
            });
    }

    public clearQuery() {
        this.query.type = '';
        this.reload(1);
    }

    public edit(row: GameTypeItem) {
        this.$refs.dialog.open(row);
    }

    public addGameType() {
        this.$refs.dialog.open();
    }
}
</script>
