<template>
    <div class="socket-bar-component">
        <div class="d-inline-block">
            <el-button
                class="mr-2"
                :type="status.type"
                size="small"
                :loading="isConnecting"
                :disabled="!isDisconnected"
                @click="connect()"
                round
                >{{ status.label }}</el-button
            >
            <span v-if="isConnected" class="d-inline-block">
                <div
                    v-if="user.isCompany"
                    class="input-group online-panel input-group-sm"
                    :class="{ 'is-company': user.isCompany, 'franchisee-0': franchisee.id === 0 }"
                >
                    <div class="input-group-prepend">
                        <span class="input-group-text">{{ franchisee.name }}</span>
                    </div>
                    <div class="input-group-prepend">
                        <span class="input-group-text">{{ 'online-agents' | pt }}</span>
                    </div>
                    <input
                        class="form-control onlines"
                        :value="online.agents"
                        @click.prevent="openOnlinAgents()"
                        readonly
                    />
                    <div class="input-group-append">
                        <button
                            class="btn btn-info"
                            type="button"
                            @click.prevent="refreshOnline(franchisee.id)"
                            :disabled="loading"
                        >
                            {{ 'refresh-online' | pt }}
                        </button>
                        <button
                            class="btn btn-info"
                            v-show="user.isCompany"
                            type="button"
                            @click.prevent="openDialog"
                            :disabled="loading"
                        >
                            {{ 'more' | pt }}
                        </button>
                    </div>
                    <div class="input-group" v-if="franchisee.id > 0">
                        <div class="input-group-prepend">
                            <span class="input-group-text">{{ 'online-members' | pt }}</span>
                        </div>
                        <input
                            class="form-control onlines"
                            :value="online.members"
                            @click.prevent="openOnlinMembers()"
                            readonly
                        />
                        <div class="input-group-prepend">
                            <span class="input-group-text">{{ 'min-base-members' | pt }}</span>
                        </div>
                        <input
                            class="form-control onlines"
                            :value="range.min"
                            @click.prevent="openMemberBase()"
                            readonly
                            v-loading="loading"
                        />
                        <div class="input-group-prepend">
                            <span class="input-group-text">{{ 'max-base-members' | pt }}</span>
                        </div>
                        <input
                            class="form-control onlines"
                            :value="range.max"
                            @click.prevent="openMemberBase()"
                            readonly
                            v-loading="loading"
                        />
                    </div>
                </div>
            </span>
            <span v-else class="d-inline-block">
                <div class="alert" :class="message.className" v-show="message.content">{{ message.content }}</div>
            </span>
        </div>
        <OnlineDialog ref="online" />
        <OnlineAgentsDialog ref="agents" />
        <OnlineMembersDialog ref="members" />
        <OnlineBaseDialog ref="memberBase" :range.sync="range" :loading="loading" />
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import store from '@/store';
import { ISocketModule } from '@/stores/modules/SocketModule';
import { prefixTransaction } from '@/i18n';
import OnlineDialog from '@/components/socket/OnlineDialog.vue';
import OnlineAgentsDialog from '@/components/socket/OnlineAgentsDialog.vue';
import OnlineMembersDialog from '@/components/socket/OnlineMembersDialog.vue';
import OnlineBaseDialog, { Range } from '@/components/socket/OnlineBaseDialog.vue';
import { ApiPath } from '@/api';
import actions, { Ajax } from '@/stores/actions';

const pt = prefixTransaction('component.socket.socket-bar');

@Component({
    filters: { pt },
    components: {
        OnlineDialog,
        OnlineAgentsDialog,
        OnlineMembersDialog,
        OnlineBaseDialog,
    },
})
export default class SocketBar extends Vue {
    public pt = pt;
    public $refs!: {
        online: OnlineDialog;
        agents: OnlineAgentsDialog;
        members: OnlineMembersDialog;
        memberBase: OnlineBaseDialog;
    };
    public range: Range = {
        min: 0,
        max: 0,
    };
    public loading = false;

    get user() {
        return store.state.App.user;
    }

    get status() {
        const status = store.state.Socket.status;
        return {
            [ISocketModule.SocketStatus.Connected]: {
                label: pt('status.connected'),
                status,
                type: 'success',
            },
            [ISocketModule.SocketStatus.Checking]: {
                label: pt('status.connecting'),
                status,
                type: 'warning',
            },
            [ISocketModule.SocketStatus.Reconnecting]: {
                label: pt('status.connecting'),
                status,
                type: 'warning',
            },
            [ISocketModule.SocketStatus.Disconnected]: {
                label: pt('status.disconnected'),
                status,
                type: 'danger',
            },
        }[status];
    }

    get message() {
        const message = store.state.Socket.message;
        const className = {
            [ISocketModule.MessageType.Info]: 'alert-primary',
            [ISocketModule.MessageType.Success]: 'alert-success',
            [ISocketModule.MessageType.Warning]: 'alert-warning',
            [ISocketModule.MessageType.Error]: 'alert-danger',
        }[message.type];
        return { ...message, className };
    }

    get isConnected() {
        return this.status.status === ISocketModule.SocketStatus.Connected;
    }

    get isDisconnected() {
        return this.status.status === ISocketModule.SocketStatus.Disconnected;
    }

    get isConnecting() {
        return (
            this.status.status === ISocketModule.SocketStatus.Reconnecting ||
            this.status.status === ISocketModule.SocketStatus.Checking
        );
    }

    get franchisee() {
        const fid = store.state.App.currentFranchiseeId;
        const data = store.state.App.franchiseeOptions.find((o) => o.id === fid) || {
            id: fid,
            name: this.$t('common.level-0'),
        };

        const franchisee = {
            id: data.id,
            name: data.name,
        };

        return franchisee;
    }

    get online() {
        const fid = this.franchisee.id;
        return (
            store.state.Socket.onlines.find((o) => o.franchiseeId === fid) || {
                franchiseeId: fid,
                agents: 0,
                members: 0,
                base: 0,
            }
        );
    }
    public created() {
        this.refreshOnline(this.franchisee.id);
    }

    @Watch('franchisee', { immediate: true }) public watchFranchisee() {
        this.refreshOnline(this.franchisee.id);
    }

    public connect() {
        actions.socket.connect();
    }

    public openDialog() {
        this.$refs.online.open();
    }

    public refreshOnline(fid: number) {
        if (this.loading) {
            return;
        }

        if (! this.user.isCompany) {
            return;
        }

        const data = {
            id: fid,
        };
        this.loading = true;

        Ajax.get(ApiPath.ApiFranchiseeBase, { data })
            .then((res) => {
                this.range.min = res.data.min;
                this.range.max = res.data.max;
            })
            .finally(() => {
                this.loading = false;
            });
    }

    public openOnlinAgents() {
        const id = this.franchisee.id;
        this.$refs.agents.open(id);
    }
    public openOnlinMembers() {
        const id = this.franchisee.id;
        this.$refs.members.open(id);
    }

    public openMemberBase() {
        const id = this.franchisee.id;
        this.$refs.memberBase.open(id);
    }
}
</script>

<style lang="scss" scoped>
.socket-bar-component {
    // margin: 0 0.5rem;
    margin-top: 4px;

    .row {
        flex-direction: column;
        margin-left: 0;

        .col,
        .col-auto {
            padding-left: 10px;

            .input-group {
                .input-group-prepend {
                    .input-group-text {
                        border-radius: 0;
                    }
                }

                .form-control {
                    border-radius: 0;
                }
            }
        }
    }

    .status-panel {
        padding: 0.5rem 0;
        margin-right: -1rem;

        // .el-button {
        //     background: #5fc271;
        // }
    }

    .alert {
        margin: 0.25rem;
        padding: 0.5rem 1rem;
    }

    input.onlines {
        background: #fff;
        text-align: right;
        color: #47bac1;
        cursor: pointer;
    }

    .online-panel {
        width: 500px;
        padding: 0.5rem 0;
        &.is-company.franchisee-0 {
            width: 300px;
        }
    }

    .btn-info {
        background: #47bac1;
        border-color: #47bac1;
    }
}
</style>
