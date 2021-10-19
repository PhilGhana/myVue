<template>
    <el-dialog
        :title="'title' | pt"
        width="800px"
        :close-on-click-modal="false"
        :visible.sync="visible"
    >
        <div class="row">
            <div class="col"></div>
            <div class="col-auto">
                <el-button size="mini" @click.prevent="reload()">{{ 'common.search' | t}}</el-button>
            </div>
        </div>
        <hr/>

        <el-table :data="rows" size="mini" stripe v-loading="loading" border :header-cell-style="{background:'#495057',color:'#fff'}">
            <el-table-column prop="level" align="center" width="80" :label="'col.level' | pt">
                <template slot-scope="{row}">
                    <div>{{ `common.level-${row.level}` | t }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="agents" :label="'col.account-name' | pt">
                <template slot-scope="{row}">
                    <span>
                        {{ row.account }}
                        【{{ row.name }}】
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="role"
                header-align="center"
                width="80"
                :label="'col.role-rank' | pt"
            >
                <template slot-scope="{row}">
                    <div>{{ row.role.name }} ( {{ row.role.rank }} )</div>
                </template>
            </el-table-column>
            <el-table-column prop="token" align="center" width="120" :label="'col.token' | pt"></el-table-column>
            <el-table-column
                v-if="user.role.fullIP == 1"
                prop="countryName"
                align="center"
                :label="$t('common.col-countryName')"
            ></el-table-column>
            <el-table-column prop="ip" align="center" width="120" :label="'col.ip' | pt">
                <template slot-scope="{row}">
                    <div class="ip">{{ row.ip }}</div>
                    <span class="cell" v-if="user.role.fullIP == 1">
                        <el-popover placement="bottom" trigger="click" v-model="showCopy[row.id]">
                            <span style="text-align:center;">{{$t('common.copied')}}</span>
                            <el-button
                                style="margin: 0 0 0 0;"
                                type="text"
                                slot="reference"
                                class="button-link"
                                @click="copyText(row.ip,row.id)"
                            >{{$t('common.copy')}}</el-button>
                        </el-popover>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="login-at" align="center" width="80" :label="'col.login-at' | pt">
                <template slot-scope="{row}">
                    <div class="font-monospace">{{ row.loginTime }}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="option"
                align="center"
                width="80"
                :label="'common.col-options' | t"
            >
                <template slot-scope="{row}">
                    <el-button
                        size="mini"
                        v-show="row.token !== user.token"
                        @click.prevent="logout(row)"
                    >{{ 'logout' | pt}}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import store from '@/store';
import { ISocketModule } from '@/stores/modules/SocketModule';
import actions, { Ajax } from '@/stores/actions';
import { prefixTransaction } from '@/i18n';
import { ApiPath } from '../../api';

namespace Pr {
    export interface Role {
        id: number;
        name: string;
    }
    export interface Agent {
        id: number;
        account: string;
        name: string;
        role: Role;
        level: number;
        ip: string;
        token: string;
        loginAt: string;
    }
}

const pt = prefixTransaction('component.socket.online-agents-dialog');

@Component({
    filters: { pt },
})
export default class OnlineAgentsDialog extends Vue {
    public pt = pt;
    public visible = false;
    public fid = 0;

    public rows: Pr.Agent[] = [];

    public loading = false;
    public showCopy: any[] = [];

    get user() {
        return store.state.App.user;
    }

    get franchisee() {
        const fid = store.state.App.currentFranchiseeId;
        const franchisee = store.state.App.franchiseeOptions.find((o) => o.id === fid) || {
            id: fid,
            name: this.$t('common.level-0'),
        };
        return franchisee;
    }

    public open(fid: number) {
        this.fid = fid;
        this.visible = true;
        this.reload();
    }

    public close() {
        this.visible = false;
    }

    public reload() {
        if (this.loading) {
            return;
        }

        this.loading = true;
        this.rows = [];

        actions.socket
            .getOnlineAgents(this.fid)
            .then((agents) => {
                const data = {
                    agents: agents.map((o) => [o.id, o.token]),
                };
                return Ajax.post(ApiPath.ApiSocketOnlineAgents, { data })
                    .then((res) => {
                        const maps: { [id: number]: any } = {};
                        res.data[0].forEach((o: any) => (maps[o.id] = o));
                        res.data[1].forEach((o: any) => (maps[o.id] = o));

                        this.rows = agents.filter((age, indx) => {
                                return res.data[1][indx];
                            })
                            .map((age, indx) => {
                                if (res.data[1][indx][0] == null) {
                                    return {
                                        ...age,
                                        ...(maps[age.id] || {}),
                                    };
                                } else {
                                    return {
                                        ...age,
                                        ...(maps[age.id] || {}),
                                        loginTime: res.data[1][indx][0].createdAt,
                                        countryName: res.data[1][indx][0].countryName,
                                    };
                            }
                        });
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            })
            .finally(() => {
                this.loading = false;
            });
    }

    public logout(row: Pr.Agent) {
        const label = pt('confirm-logout-user', { name: `${row.account}【${row.name}】` });
        this.$confirm(label)
            .then(() => {
                actions.socket.logoutAgent(row.id, row.token).then(() => {
                    this.reload();
                });
            })
            .catch(() => {
                // cancel;
            });
    }

    public copyText(text: string, id: number) {
        const oInput = document.createElement('input');
        oInput.value = text;
        const element = document.body.appendChild(oInput);
        oInput.select();
        document.execCommand('Copy');
        this.showCopy[id] = true;
        setTimeout(() => (this.showCopy[id] = false), 1500);
        oInput.remove();
    }
}
</script>

<style lang="scss" scoped>
.number-style {
    text-align: right;
    color: #007bff;
}

.button-link{
    background: #47bac1;
    color: #fff;
    padding: 5px;
}

.ip{
    line-height: 30px;
}
</style>
