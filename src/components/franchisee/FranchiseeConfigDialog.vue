<template>
    <el-dialog
        :title="pt('title') + ' ( ' + franchiseeName + ' )'"
        width="1000px"
        :close-on-click-modal="false"
        :visible.sync="visible"
        class="franchisee-config-dialog"
    >    
        <form class="form">
            <el-row :gutter="8" style="margin-bottom: 0">
                <!-- 手續費佔成比(%) -->
                <el-col :span="8">
                    <div class="form-group">
                        <label>{{ pt('fee-percent') }}</label>
                        <div class="input-group top-input">
                            <div class="input-group-prepend">
                                <span class="input-group-text">{{
                                    pt('real-percent', { value: 100 - configs.feePercent })
                                }}</span>
                            </div>
                            <input
                                type="number"
                                class="form-control align-right no-spinners"
                                v-model="configs.feePercent"
                                name="feePercent"
                                style="border-right: 0"
                                @focus="$event.target.select()"
                            />
                            <div class="input-group-append">
                                <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <!-- 優惠佔成比(%) -->
                <el-col :span="8">
                    <div class="form-group">
                        <label>{{ pt('coupon-percent') }}</label>
                        <div class="input-group top-input">
                            <div class="input-group-prepend">
                                <span class="input-group-text">{{
                                    pt('real-percent', { value: 100 - configs.couponPercent })
                                }}</span>
                            </div>
                            <input
                                type="number"
                                class="form-control align-right no-spinners"
                                v-model="configs.couponPercent"
                                name="couponPercent"
                                style="border-right: 0"
                                @focus="$event.target.select()"
                            />
                            <div class="input-group-append">
                                <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <!-- 退佣設定欄 -->
                <el-col :span="8" v-if="functionMode !== 'tb'">
                    <div class="form-group">
                        <label>{{ pt('commission-percent') }}</label>
                        <div class="input-group top-input">
                            <div class="input-group-prepend">
                                <span class="input-group-text">{{
                                    pt('real-percent', { value: 100 - configs.commissionPercent })
                                }}</span>
                            </div>
                            <input
                                type="number"
                                class="form-control align-right no-spinners"
                                v-model="configs.commissionPercent"
                                name="commissionPercent"
                                style="border-right: 0"
                                @focus="$event.target.select()"
                            />
                            <div class="input-group-append">
                                <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <hr style="margin-top: 0" />
            <!-- <div class="row">
                <div class="col-2 align-right">
                    <label>{{ pt('coupon-percent') }}</label>
                </div>
                <div class="form-group col-4">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span
                                class="input-group-text"
                            >{{ pt('real-percent', {value: 100 - configs.couponPercent}) }}</span>
                        </div>
                        <input
                            type="number"
                            class="form-control align-right no-spinners"
                            v-model="configs.couponPercent"
                            name="couponPercent"
                            @focus="$event.target.select()"
                        />
                        <div class="input-group-append">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
            </div> -->

            <table class="table table-bordered table-hover" v-loading="loading.config">
                <thead style="background: #495057; color: #fff">
                    <tr>
                        <th class="col-name" rowspan="2">{{ pt('game-platform') }}</th>
                        <th class="col-agent" rowspan="2">{{ pt('agent') }}</th>
                        <th class="col-percent p100-width" rowspan="2">{{ pt('percent') }}</th>
                        <th class="col-water" rowspan="2">{{ pt('water-percent') }}</th>
                        <!-- <th class="col-bonus" rowspan="2">{{ pt('bonus-percent') }}</th> -->
                        <th class="col-member-bonus" colspan="3">{{ pt('member-bonus') }}</th>
                    </tr>
                    <tr>
                        <!--<th class="allocate-group" style="width: 115px">{{ pt('allocate-member-bonus-percent') }}</th>-->
                        <th class="allocate-group" style="width: 115px">{{ pt('member-upper-3-bonus-percent') }}</th>
                        <th class="allocate-group" style="width: 115px">{{ pt('member-upper-2-bonus-percent') }}</th>
                        <th class="allocate-group" style="width: 115px">{{ pt('member-upper-1-bonus-percent') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="align-right">{{ pt('fast-setting') }}</td>
                        <td class="align-right">-</td>
                        <td>
                            <div class="input-group">
                                <input
                                    type="number"
                                    ref="percent"
                                    class="form-control align-right no-spinners"
                                    v-model="fastSetting.percent"
                                    @focus="$event.target.select()"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    ref="waterPercent"
                                    class="form-control align-right no-spinners"
                                    v-model="fastSetting.waterPercent"
                                    @focus="$event.target.select()"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>
                        <!-- <td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    ref="bonusPercent"
                                    class="form-control align-right no-spinners"
                                    v-model="fastSetting.bonusPercent"
                                    @focus="$event.target.select()"
                                    style="border-right:0;"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text"  style="border-left:0; background: #fff;">%</span>
                                </div>
                            </div>
                        </td>-->
                        <!--<td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    ref="allocateMemberBonusPercent"
                                    class="form-control align-right no-spinners"
                                    v-model="fastSetting.allocateMemberBonusPercent"
                                    @focus="$event.target.select()"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>-->
                        <td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    ref="mlv3BonusPercent"
                                    class="form-control align-right no-spinners"
                                    v-model="fastSetting.mlv3BonusPercent"
                                    @focus="$event.target.select()"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    ref="mlv2BonusPercent"
                                    class="form-control align-right no-spinners"
                                    v-model="fastSetting.mlv2BonusPercent"
                                    @focus="$event.target.select()"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    ref="mlv1BonusPercent"
                                    class="form-control align-right no-spinners"
                                    v-model="fastSetting.mlv1BonusPercent"
                                    @focus="$event.target.select()"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(platform, i) in configs.platforms" :key="platform.id">
                        <td class="align-right">
                            <span class="badge badge-primary" v-show="platform.fun === 1">{{
                                'common.is-fun' | t
                            }}</span>
                            {{ platform.name }}, {{ platform.id }}
                        </td>
                        <td>
                            <input
                                type="text"
                                class="form-control"
                                :name="`platform-provider-${platform.id}`"
                                v-model="platform.providerAgent"
                            />
                        </td>
                        <td>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">{{
                                        pt('real-percent', { value: 100 - configs.platforms[i].percent })
                                    }}</span>
                                </div>
                                <input
                                    type="text"
                                    class="form-control align-right"
                                    :name="`platform-percent-${platform.id}`"
                                    @focus="$event.target.select()"
                                    v-model="configs.platforms[i].percent"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    class="form-control align-right"
                                    :name="`platform-water-${platform.id}`"
                                    @focus="$event.target.select()"
                                    v-model="configs.platforms[i].waterPercent"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>
                        <!-- <td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    class="form-control align-right"
                                    :name="`platform-bonus-${platform.id}`"
                                    @focus="$event.target.select()"
                                    v-model="configs.platforms[i].bonusPercent"
                                    style="border-right:0;"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text"  style="border-left:0; background: #fff;">%</span>
                                </div>
                            </div>
                        </td>-->
                        <!--<td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    class="form-control align-right"
                                    :name="`platform-allocate-member-bonus-percent-${platform.id}`"
                                    @focus="$event.target.select()"
                                    v-model="configs.platforms[i].allocateMemberBonusPercent"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>-->
                        <td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    class="form-control align-right"
                                    :name="`platform-mlv3-bonus-percent-${platform.id}`"
                                    @focus="$event.target.select()"
                                    v-model="configs.platforms[i].mlv3BonusPercent"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    class="form-control align-right"
                                    :name="`platform-mlv2-bonus-percent-${platform.id}`"
                                    @focus="$event.target.select()"
                                    v-model="configs.platforms[i].mlv2BonusPercent"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="input-group">
                                <input
                                    type="text"
                                    class="form-control align-right"
                                    :name="`platform-mlv1-bonus-percent-${platform.id}`"
                                    @focus="$event.target.select()"
                                    v-model="configs.platforms[i].mlv1BonusPercent"
                                    style="border-right: 0"
                                />
                                <div class="input-group-append">
                                    <span class="input-group-text" style="border-left: 0; background: #fff">%</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="loading.save">{{ 'common.cancel' | t }}</el-button>
            <el-button type="primary" @click="save" :loading="loading.save || loading.config">{{
                'common.ok' | t
            }}</el-button>
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
import store from '@/store';
interface PlatformConfig {
    id: number;
    name: string;
    providerAgent: string;
    exists: boolean;
    percent: number;
    waterPercent: number;
    bonusPercent: number;
    allocateAgentWaterPercent: number;
    allocateAgentBonusPercent: number;
    allocateMemberBonusPercent: number;
    mlv3BonusPercent: number;
    mlv2BonusPercent: number;
    mlv1BonusPercent: number;
}
interface Configs {
    defaultPercent: number;
    feePercent: number;
    feeEnabled: number;
    couponPercent: number;
    commissionPercent: number;
    couponEnabled: number;
    platforms: PlatformConfig[];
}
const pt = prefixTransaction('component.franchisee.franchisee-config-dialog');
@Component
export default class FranchiseeConfigDialog extends Mixins(FormValidation) {
    public $refs!: {
        percent: HTMLInputElement;
        waterPercent: HTMLInputElement;
        bonusPercent: HTMLInputElement;
    };
    public pt = pt;
    public visible = false;
    public franchiseeName = '';

    public loading = {
        save: false,
        config: false,
    };

    public configs = {
        defaultPercent: 0,
        feePercent: 0,
        feeEnabled: 0,
        couponPercent: 0,
        couponEnabled: 0,
        commissionPercent: 0,
        platforms: [
            {
                id: 0,
                name: '',
                providerAgent: '',
                exists: true,
                percent: 0,
                waterPercent: 0,
                bonusPercent: 0,
                allocateMemberBonusPercent: 0,
                mlv3BonusPercent: 0,
                mlv2BonusPercent: 0,
                mlv1BonusPercent: 0,
            },
        ],
    };

    public id = 0;

    public fastSetting = {
        percent: 0,
        allocateAgentWaterPercent: 0,
        waterPercent: 0,
        allocateAgentBonusPercent: 0,
        bonusPercent: 0,
        allocateMemberBonusPercent: 0,
        mlv3BonusPercent: 0,
        mlv2BonusPercent: 0,
        mlv1BonusPercent: 0,
    };

    public demo = 0;
    public mounted() {
        const fastSetting: any = this.fastSetting;
        const $refs: any = this.$refs;

        ['percent'].forEach((key) => {
            this.$watch(`fastSetting.${key}`, (percent: string, old: string) => {
                const value = Number(percent) || isNaN(Number(percent));
                const invalid = !isNatural(value);

                if (invalid || value > 100 || !isNumber(value)) {
                    fastSetting[key] = invalid ? parseInt(old, 10) || 0 : 100;
                    this.$nextTick(() => $refs[key].select());
                    return;
                }
                this.configs.platforms.forEach((o: any) => (o[key] = value));
            });
        });

        ['waterPercent', 'bonusPercent', 'allocateMemberBonusPercent', 'mlv3BonusPercent', 'mlv2BonusPercent', 'mlv1BonusPercent'].forEach((key) => {
            this.$watch(`fastSetting.${key}`, (percent: string, old: string) => {
                const invalid = isNumber(percent) || isNaN(Number(percent));
                const value = Number(percent);
                const overScaleLimit = percent.toString().match(/\.\d{3}/);
                if (invalid || value > 100 || overScaleLimit) {
                    fastSetting[key] = invalid ? 0 : old || 0;
                    this.$nextTick(() => $refs[key].select());
                    return;
                }
                this.configs.platforms.forEach((o: any) => (o[key] = value));
            });
        });
    }

    public open(id: number, name: string) {
        this.visible = true;
        this.fastSetting.percent = 0;
        this.fastSetting.waterPercent = 0;
        this.fastSetting.bonusPercent = 0;
        this.fastSetting.allocateMemberBonusPercent = 0;
        this.fastSetting.mlv3BonusPercent = 0;
        this.fastSetting.mlv2BonusPercent = 0;
        this.fastSetting.mlv1BonusPercent = 0;
        this.clearInvalids();

        this.id = id;
        this.franchiseeName = name;
        this.getConfigs(id);
    }

    public close() {
        this.visible = false;
    }

    public save() {
        if (this.loading.save) {
            return;
        }
        const data = { ...this.configs, id: this.id };

        this.loading.save = true;

        Ajax.post(ApiPath.ApiFranchiseePercentConfigSave, { data })
            .then(() => {
                this.close();
            })
            .catch((res) => {
                const percent = res.errors.percent || [];
                const invalids: { [key: string]: string } = {};

                (res.errors.platforms || []).forEach((o: any) => {
                    if (o.providerAgent) {
                        invalids[`platform-provider-${o.id}`] = o.providerAgent;
                    }
                    if (o.percent) {
                        invalids[`platform-percent-${o.id}`] = o.percent;
                    }
                    if (o.waterPercent) {
                        invalids[`platform-water-${o.id}`] = o.waterPercent;
                    }
                    if (o.bonusPercent) {
                        invalids[`platform-bonus-${o.id}`] = o.bonusPercent;
                    }
                    if (o.allocateMemberBonusPercent) {
                        invalids[`platform-allocate-member-bonus-percent-${o.id}`] = o.allocateMemberBonusPercent;
                    }
                    if (o.mlv3BonusPercent) {
                        invalids[`platform-mlv3-bonus-percent-${o.id}`] = o.mlv3BonusPercent;
                    }
                    if (o.mlv2BonusPercent) {
                        invalids[`platform-mlv2-bonus-percent-${o.id}`] = o.mlv2BonusPercent;
                    }
                    if (o.mlv1BonusPercent) {
                        invalids[`platform-mlv1-bonus-percent-${o.id}`] = o.mlv1BonusPercent;
                    }
                });
                this.setInvalids({ data: null, errors: invalids, message: '', refresh: null });
            })
            .finally(() => (this.loading.save = false));
    }

    public getConfigs(id: number) {
        const data = {
            id,
        };
        if (this.loading.config) {
            return;
        }
        this.loading.config = true;
        Ajax.get(ApiPath.ApiFranchiseePercentConfigGet, { data })
            .then((res) => {
                this.configs = res.data;
            })
            .finally(() => {
                this.loading.config = false;
            });
    }

    public round(value: number, dec = 0) {
        return Vue.filter('round')(value, dec);
    }

    get functionMode() {
        return store.state.App.functionMode;
    }
}
</script>
<style lang="scss" scoped>
table {
    th {
        text-align: center;
        &.col-agent {
            width: 120px;
        }
        &.col-water,
        &.col-bonus {
            width: 120px;
        }
    }
    .allocate-group {
        width: 100px;
    }
    .p100-width {
        width: 140px;
    }

    .input-group-text {
        padding-left: 4px;
        padding-right: 4px;
    }
}
.invalid {
    color: red;
}

.top-input {
    height: 42px;

    input {
        height: 42px;
    }
}

input.inputInvalid:not([invalidMsg='null']) {
    border-color: red;
}
.franchisee-config-dialog{
    .top-input {
        width: 100%;
    }
}
</style>
