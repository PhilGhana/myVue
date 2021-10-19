<template>
    <el-dialog
        :title="pt('title') + ' ( ' + franchisee.name + ' )'"
        width="400px"
        :close-on-click-modal="false"
        :visible.sync="visible"
        class="commission"
    >
        <form class="form">
            <div class="row" style="padding: 15px 15px 0">
                <div class="form-group" style="width: 100%">
                    <label>{{ pt('allocate-agent-water-percent') }}</label>
                    <div class="input-group" style="width: 100%">
                        <div class="input-group-prepend">
                            <span class="input-group-text">{{ pt('real-percent', { value: 100 - realPercent }) }}</span>
                        </div>
                        <input
                            type="number"
                            class="form-control align-right no-spinners"
                            name="feePercent"
                            style="border-right: 0px"
                            v-model="realPercent"
                            @focus="$event.target.select()"
                        />
                        <div class="input-group-append">
                            <span class="input-group-text" style="background: #fff; border-left: 0px">%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" style="padding: 0 15px 15px">
                <div class="form-group">
                    <div>
                        <label>{{ pt('is-open') }}</label
                        ><br />
                        <el-checkbox v-model="commissionEnabled">{{ $t('common.status-enabled') }}</el-checkbox>
                    </div>
                </div>
            </div>
        </form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="loading.save">{{ 'common.cancel' | t }}</el-button>
            <el-button type="primary" @click="save" :loading="loading">{{ 'common.ok' | t }}</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
import actions, { Ajax } from '@/stores/actions';
import { ElForm } from 'element-ui/types/form';
import { ApiPath } from '@/api';
import { isNatural } from '../../utils/number-util';
import { prefixTransaction } from '../../i18n';
import { isNumber } from 'util';
import FormValidation from '../../mixins/FormValidation';

export interface FranchiseeItem {
    id: number;
    name: string;
}

const pt = prefixTransaction('component.franchisee.franchisee-commission-dialog');
@Component
export default class FranchiseeCommissionDialog extends Mixins(FormValidation) {
    public $refs!: {
        percent: HTMLInputElement;
        waterPercent: HTMLInputElement;
        bonusPercent: HTMLInputElement;
    };
    public pt = pt;
    public visible = false;
    public franchisee: FranchiseeItem = {
        id: 0,
        name: '',
    };
    public commissionEnabled = false;
    public loading = false;

    public realPercent: number = 0;

    public id = 0;

    @Watch('realPercent') public watchRealPercent() {
        if (this.realPercent > 100) {
            this.realPercent = 100;
        }
        if (this.realPercent < 0) {
            this.realPercent = 0;
        }
    }

    public open(row: any, name: string) {
        this.visible = true;
        this.clearInvalids();
        this.franchisee = row;
        this.getSetting();
    }

    public getSetting() {
        const data = {
            id: this.franchisee.id,
        };
        Ajax.get(ApiPath.ApiFranchiseeCommissionGet, { data }).then((res: any) => {
            console.log('res', res);
            this.realPercent = res.allocateCommissionPercent;
            if (res.commissionEnabled === 1) {
                this.commissionEnabled = true;
            } else {
                this.commissionEnabled = false;
            }
        });
    }

    public close() {
        this.visible = false;
    }

    public save() {
        if (this.loading) {
            return;
        }

        const data = {
            id: this.franchisee.id,
            name: this.franchisee.name,
            percent: this.realPercent,
            enabled: this.commissionEnabled,
        };
        Ajax.post(ApiPath.ApiFranchiseeCommissionSet, { data })
            .then(() => {
                this.close();
            })
            .finally(() => (this.loading = false));
    }
}
</script>
<style lang="scss">
.commission {
    .el-dialog__body {
        padding-bottom: 0;
    }
}
</style>