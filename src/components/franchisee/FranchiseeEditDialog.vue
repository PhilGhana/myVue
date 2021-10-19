<template>
    <el-dialog
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="visible"
        width="400px"
        class="franchiseeEidtDialog"
    >
        <el-form ref="form" :model="form" size="mini" :rules="rules" @submit.native.prevent label-width="120px">
            <el-form-item :label="pt('name')" prop="name">
                <el-input v-model="form.name" :disabled="form.id !== 0"></el-input>
            </el-form-item>
            <el-form-item :label="pt('host')" prop="host">
                <el-button type="primary" size="mini" @click="addHostInput()">{{ pt('add-host') }}</el-button>
                <el-input class="host" v-for="host in hosts" :key="host.id" v-model="host.url">
                    <template slot="prepend">http(s)://</template>
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        slot="append"
                        @click="removeHostInput(host.id)"
                    ></el-button>
                </el-input>
            </el-form-item>
            <!-- <el-form-item :label="pt('paymentFlowMode')" prop="paymentFlowMode">
                <div class="switch">
                    <el-switch
                        style="display: block"
                        v-model="form.paymentFlowMode"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-text="pt('handIn')"
                        :inactive-text="pt('agentTake')"
                    ></el-switch>
                </div>
            </el-form-item> -->

            <el-form-item label-width="270px" :label="pt('resetLock')" prop="resetLock">
                <el-checkbox v-model="form.resetLockActive">{{ 'common.status-enabled' | t }}</el-checkbox>
                <!-- <div class="switch">
                    <el-switch
                        style="display: block"
                        v-model="form.resetLockActive"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-text="pt('resetLockActTrue')"
                        :inactive-text="pt('resetLockActFalse')"
                    ></el-switch>
                </div>-->
                <el-input :disabled="!form.resetLockActive" v-model="form.resetLock"></el-input>
            </el-form-item>

            <el-form-item :label="$t('component.common.status-setting.status-setting')" prop="enabled">
                <el-checkbox v-model="form.enabled">{{
                    'component.common.status-setting.enabled-status' | t
                }}</el-checkbox>
                <el-checkbox v-model="form.locked">{{
                    'component.common.status-setting.locked-status' | t
                }}</el-checkbox>
            </el-form-item>
            <el-form-item :label="$t('component.common.status-setting.is-activity-wallet')" prop="isAcvitityWallet">
                <el-col style="width:100%">
                    <el-checkbox v-model="form.isAcvitityWallet">{{
                        'common.status-enabled' | t
                    }}</el-checkbox>
                </el-col>
            </el-form-item>
            <el-form-item :label="pt('member-fullpay-mode')" prop="memberFullpayMode">
                <el-col style="width:100%">
                    <el-checkbox v-model="form.memberFullpayMode">{{
                        'common.status-enabled' | t
                    }}</el-checkbox>
                </el-col>
            </el-form-item>
            <el-form-item :label="pt('reviewWithdrawSingleStep')" prop="reviewWithdrawSingleStep">
                <el-col style="width:100%">
                    <el-checkbox v-model="form.reviewWithdrawSingleStep">{{
                        'common.status-enabled' | t
                    }}</el-checkbox>
                </el-col>
            </el-form-item>
            <el-form-item :label="pt('member-mode')" prop="memberMode">
                <el-col style="width:100%">
                    <el-checkbox v-model="form.memberMode">{{
                        'common.status-enabled' | t
                    }}</el-checkbox>
                </el-col>
            </el-form-item>
            <!--<el-form-item :label="$t('component.common.testing-setting.testing-setting')"
                prop="testing">
                <el-checkbox v-model="form.testing">{{ 'component.common.testing-setting.enable-testing' | t}}</el-checkbox>
            </el-form-item>-->
            <el-form-item :label="pt('default-agent')" prop="agentId" v-show="form.id !== 0">
                <el-select v-model="agent" value-key="id" :disabled="form.disabledAgent" @change="onChangeAgent()">
                    <el-option v-for="item in agentOptions" :label="combineAccountName(item)" :key="item.id" :value="item"></el-option>
                </el-select>

                <el-checkbox class="disabled-default-agent" v-model="form.disabledAgent">{{
                    'common.status-disabled' | t
                }}</el-checkbox>
            </el-form-item>
            <el-form-item :label="pt('default-club-rank')" prop="clubRankId" v-show="form.id !== 0">
                <el-select v-model="form.clubRankId">
                    <el-option :label="'common.select' | t" :value="0"></el-option>
                    <template v-for="clubOpt in clubOptions">
                        <el-option-group v-if="clubOpt.ranks.length > 0" :key="clubOpt.id" :label="clubOpt.name">
                            <el-option
                                v-for="rank in clubOpt.ranks"
                                :label="rank.name"
                                :key="rank.id"
                                :value="rank.id"
                            ></el-option>
                        </el-option-group>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="pt('default-bank-group')" prop="bankGroupId" v-show="form.id !== 0">
                <el-select v-model="form.bankGroupId">
                    <el-option :label="'common.select' | t" :value="0"></el-option>
                            <el-option
                                v-for="row in bankGroupOptions"
                                :label="row.name"
                                :key="row.id"
                                :value="row.id"
                            ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="pt('fullpayCrtPath')" prop="fullpayCrtPath">
                <el-input v-model="form.fullpayCrtPath"></el-input>
            </el-form-item>
            <el-form-item :label="pt('fullpayId')" prop="fullpayId">
                <el-input v-model="form.fullpayId"></el-input>
            </el-form-item>
            <el-form-item :label="pt('fullpayManageUrl')" prop="fullpayManageUrl">
                <el-input v-model="form.fullpayManageUrl"></el-input>
            </el-form-item>
            <el-form-item :label="pt('fullpayServerUrl')" prop="fullpayServerUrl">
                <el-input v-model="form.fullpayServerUrl"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="loading">{{ 'common.cancel' | t }}</el-button>
            <el-button type="primary" @click="save" :loading="loading">{{ 'common.ok' | t }}</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import ElementFormValidator from '@/mixins/ElementFormValidator';
import actions, { Ajax } from '@/stores/actions';
import { ElForm } from 'element-ui/types/form';
import { ApiPath } from '@/api';
import { FranchiseeItem } from '@/views/system/Franchisee.vue';
import { prefixTransaction } from '../../i18n';

interface Agents {
    id: number;
    name: string;
    account: string;
}

interface ClubRank {
    id: number;
    name: string;
}

interface Club {
    id: number;
    name: string;
    ranks: ClubRank[];
}

interface Host {
    id: number;
    url: string;
}

interface FranchiseeEditData {
    id: number;
    name: string;
    enabled: boolean;
    testing: boolean;
    locked: boolean;
    host: any;
    resetLock: any;
    resetLockActive: any;
    agentId: number;
    agentName: string;
    clubRankId: number;
    clubRankName: string;
    fullpayCrtPath: string;
    fullpayId: string;
    fullpayManageUrl: string;
    fullpayServerUrl: string;
    // paymentFlowMode: boolean;
    isAcvitityWallet: boolean;
    bankGroupId: number;
    memberFullpayMode: boolean | number;
    reviewWithdrawSingleStep: boolean;
    memberMode: boolean;
}

const defaultData = {
    id: 0,
    name: '',
    enabled: true,
    testing: false,
    locked: false,
    resetLock: '',
    resetLockActive: true,
    host: [],
    agentId: 0,
    agentName: '',
    disabledAgent: true,
    clubRankId: 0,
    clubRankName: '',
    fullpayCrtPath: '',
    fullpayId: '',
    fullpayManageUrl: '',
    fullpayServerUrl: '',
    // paymentFlowMode: false,
    isAcvitityWallet: false,
    bankGroupId: 0,
    memberFullpayMode: false,
    reviewWithdrawSingleStep: false,
    memberMode: true,
};

@Component
export default class FranchiseeEditDialog extends Mixins(ElementFormValidator) {
    public pt = prefixTransaction('component.franchisee.franchisee-edit-dialog');

    public visible = false;

    public loading = false;

    public form = {
        id: 0,
        name: '',
        enabled: true,
        testing: false,
        locked: false,
        resetLock: '',
        host: [],
        agentId: 0,
        disabledAgent: false,
        resetLockActive: true,
        agentName: '',
        clubRankId: 0,
        clubRankName: '',
        fullpayCrtPath: '',
        fullpayId: '',
        fullpayManageUrl: '',
        fullpayServerUrl: '',
        // paymentFlowMode: false,
        isAcvitityWallet: false,
        bankGroupId: 0,
        memberFullpayMode: false,
        reviewWithdrawSingleStep: false,
        memberMode: true,
    };

    public agentOptions: Agents[] = [];
    public agent = {
        id: 0,
        name: '',
    };
    public clubOptions: Club[] = [];
    public bankGroupOptions = [];
    public clubRank = {
        id: 0,
        name: '',
    };
    public hosts: Host[] = [];
    public countHost: number = 0;

    public rules = this.elFormRules(this.form);

    get title() {
        return this.form.id > 0
            ? this.$t('component.franchisee.franchisee-edit-dialog.title-edit')
            : this.$t('component.franchisee.franchisee-edit-dialog.title-add');
    }

    public open(data?: FranchiseeEditData) {
        this.form = data
            ? { ...data, disabledAgent: true, memberFullpayMode: data.memberFullpayMode === 0 ? true : false }
            : { ...defaultData };
        this.form.disabledAgent = (Number(this.form.agentId) || 0) === 0;
        this.form.isAcvitityWallet = Boolean(this.form.isAcvitityWallet);
        // this.form.memberMode = Boolean(this.form.memberMode);
        this.visible = true;
        this.elFormClearInvalids('form');

        this.form.reviewWithdrawSingleStep = this.form.reviewWithdrawSingleStep ? true : false;

        this.hosts = [];
        this.countHost = 0;
        const hostsData = this.form.host;
        hostsData.forEach((o: Host) => {
            this.addHostInput(o.url);
        });

        if (this.form.id) {
            this.getAgents(this.form.id);
            this.getClubRanks(this.form.id);
            this.getBankGroups(this.form.id);
        }

        this.agent = {
            id: this.form.agentId,
            name: this.form.agentName,
        };
        this.clubRank = {
            id: this.form.clubRankId,
            name: this.form.clubRankName,
        };
    }

    public close() {
        this.visible = false;
    }

    public save() {
        if (this.loading) {
            return;
        }

        // filter
        this.hosts = this.hosts.filter((item: Host) => item.url !== '');

        const data = {
            id: this.form.id,
            name: this.form.name,
            host: JSON.stringify(this.hosts),
            enabled: this.form.enabled ? 1 : 0,
            testing: this.form.testing ? 1 : 0,
            locked: this.form.locked ? 1 : 0,
            resetLock: this.form.resetLock || '',
            resetLockActive: this.form.resetLockActive || false,
            agentId: this.form.agentId || '',
            clubRankId: this.form.clubRankId || '',
            fullpayCrtPath: this.form.fullpayCrtPath,
            fullpayId: this.form.fullpayId,
            fullpayManageUrl: this.form.fullpayManageUrl,
            fullpayServerUrl: this.form.fullpayServerUrl,
            // paymentFlowMode: this.form.paymentFlowMode ? 'handIn' : 'agentTake',
            isAcvitityWallet: this.form.isAcvitityWallet,
            bankGroupId: this.form.bankGroupId,
            memberFullpayMode: this.form.memberFullpayMode ? 0 : 1,
            reviewWithdrawSingleStep: this.form.reviewWithdrawSingleStep ? 1 : 0,
            memberMode: this.form.memberMode,
        };
        if (this.form.disabledAgent) {
            data.agentId = '';
        }

        this.loading = true;
        const api = data.id === 0 ? ApiPath.ApiFranchiseeAdd : ApiPath.ApiFranchiseeEdit;
        Ajax.post(api, { data })
            .then(() => {
                this.close();
                actions.reloadFranchiseeOptions();
                this.$emit('saved');
            })
            .catch((res) => this.elFormInvalids(res, 'form'))
            .finally(() => (this.loading = false));
    }

    public getAgents(id: number) {
        const data = {
            id,
        };
        Ajax.get(ApiPath.ApiFranchiseeAgent, { data }).then((res) => {
            this.agentOptions = res.data;
        });
    }

    public onChangeAgent() {
        this.form.agentId = this.agent.id;
    }

    public getClubRanks(id: number) {
        const data = {
            id,
        };
        Ajax.get(ApiPath.ApiFranchiseeClubRank, { data }).then((res) => {
            this.clubOptions = res.data.map((o: any) => {
                const { clubRank, ...club } = o;
                return {
                    ...club,
                    ranks: clubRank || [],
                };
            });
        });
    }

    public getBankGroups(id: number) {
        const data = {
            franchiseeId: id,
        };
        Ajax.post(ApiPath.ApiBankBankGroupFullpayOption, { data })
            .then((res) => {
                this.bankGroupOptions = res.data.group.map((o: any) => {
                    // const { clubRank, ...club } = o;
                    return {
                        id: o.id,
                        name: o.name,
                    };
                });
            });
    }

    public addHostInput(url?: string) {
        const host = {
            id: this.countHost,
            url: url ? url : '',
        };
        this.hosts.push(host);
        this.countHost += 1;
    }

    public removeHostInput(hostId: number) {
        this.hosts = this.hosts.filter((item: Host) => item.id !== hostId);
    }

    public combineAccountName(item: Agents): string {
        return this.$t('common.account-and-name', {account: item.account, name: item.name}).toString();
    }
}
</script>
<style lang="scss" scoped>
.disabled-default-agent {
    margin-left: 20px;
}
.host {
    margin-bottom: 10px;
}
.switch {
    margin-top: 35px;
    padding: 10px;
    padding-top: 0px;
}
</style>
