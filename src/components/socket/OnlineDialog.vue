<template>
    <el-dialog :title="'title' | pt"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="visible">
        <el-table :data="onlineRows"
            size="mini"
            stripe
            border
            :header-cell-style="{background:'#495057',color:'#fff'}">
            <el-table-column prop="name"
                align="center"
                :label="'col.name' | pt">
            </el-table-column>
            <el-table-column prop="agents"
                header-align="center"
                :label="'col.agents' | pt">
                <template slot-scope="{row}">
                    <div class="number-style">{{ row.agents }} </div>
                </template>
            </el-table-column>
            <el-table-column prop="members"
                header-align="center"
                :label="'col.members' | pt">
                <template slot-scope="{row}">
                    <div class="number-style">{{ row.members }} </div>
                </template>
            </el-table-column>
            <el-table-column prop="base"
                header-align="center"
                :label="'col.base' | pt">
                <template slot-scope="{row}">
                    <div class="number-style">{{ row.base }} </div>
                </template>
            </el-table-column>
            <el-table-column prop="base"
                header-align="center"
                :label="'common.col-options' | t"
                align="center">
                <template slot-scope="{row}">
                    <el-button size="mini"
                        v-show="!row.isSum"
                        :loading="row.loading"
                        @click="refreshOnlines(row)">
                        {{ 'refresh' | pt}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

    </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import store from '@/store';
import { ISocketModule } from '@/stores/modules/SocketModule';
import actions from '@/stores/actions';
import { prefixTransaction } from '@/i18n';

namespace Pr {
    export interface Online {
        isSum: boolean;
        agents: number;
        members: number;
        franchiseeId: number;
        base: number;
        name: string;
        loading: boolean;
    }
}

const pt = prefixTransaction('component.socket.online-dialog');

@Component({
    filters: { pt },
})
export default class OnlineDialog extends Vue {
    public pt = pt;
    public visible = false;
    public onlineRows: Pr.Online[] = [];

    get onlines() {
        return store.state.Socket.onlines;
    }

    @Watch('onlines', { immediate: true, deep: true }) public watchOnlines() {
        const franchisees = [
            { id: 0, name: this.$t('common.level-0').toString() },
            ...store.state.App.franchiseeOptions,
        ];
        const onlines = store.state.Socket.onlines;

        const sum: Pr.Online = {
            isSum: true,
            name: pt('col.sum'),
            franchiseeId: 0,
            agents: 0,
            members: 0,
            base: 0,
            loading: false,
        };
        const rows: Pr.Online[] = franchisees.map(({ id, name }) => {
            const online = onlines.find((o) => o.franchiseeId === id) || {
                franchiseeId: id,
                members: 0,
                agents: 0,
                base: 0,
            };
            sum.agents += online.agents;
            sum.members += online.members;
            return {
                ...online,
                isSum: false,
                name,
                loading: false,
            };
        });
        rows.push(sum);
        this.onlineRows = rows;
    }

    public open() {
        this.visible = true;
    }
    public close() {
        this.visible = false;
    }

    public refreshOnlines(row: Pr.Online) {
        if (row.loading) {
            return;
        }
        row.loading = true;
        actions.socket.refreshOnlines(row.franchiseeId).then(() => {
            row.loading = false;
        });
    }
}
</script>

<style lang="scss" scoped>
.number-style {
    text-align: right;
    color: #44bac1;
}
</style>
