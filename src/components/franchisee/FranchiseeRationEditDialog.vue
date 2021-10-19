<template>
    <el-dialog :title="title" class="FranchiseeRationEditDialog" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="form" :model="form" size="mini" label-width="120px">
            <div class="col">
                <el-form-item :label="pt('autoBonus')" prop="autoBonus">
                    <el-select v-model="form.autoBonus">
                        <el-option :label="pt('disable')" :value="0"></el-option>
                        <el-option :label="pt('enable')" :value="1"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="col">
                <el-form-item :label="pt('autoBonusAt')">
                    <el-time-picker
                        v-model="form.autoBonusAt"
                        value-format="HH:mm"
                        :picker-options="{ format: 'HH:mm' }"
                    />
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" class="tako-el-btn" :loading="loading">{{ 'common.cancel' | t }}</el-button>
            <el-button type="primary" class="tako-el-btn" @click="save" :loading="loading">{{ 'common.ok' | t }}</el-button>
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
import moment from 'moment';

interface FranchiseeEditData {
    franchiseeId?: number;
    name?: string;
    franchiseeRationId?: number;
}

@Component
export default class FranchiseeRationEditDialog extends Mixins(ElementFormValidator) {
    public pt = prefixTransaction('component.franchisee.franchisee-ration-edit-dialog');

    public visible = false;

    public loading = false;

    public franchiseeEditData: FranchiseeEditData = {
        franchiseeId: 0,
        name: '',
        franchiseeRationId: 0,
    };

    public form = {
        autoBonus: 0,
        autoBonusAt: '',
    };

    get title() {
        return (
            this.$t('component.franchisee.franchisee-ration-dialog.title') + '(' + this.franchiseeEditData.name + ')'
        );
    }

    public open(franchiseeEditData?: FranchiseeEditData) {
        this.franchiseeEditData = { ...franchiseeEditData };
        this.form.autoBonusAt = moment().format('H:m');
        // 抓取舊資料

        if (
            this.franchiseeEditData.franchiseeRationId !== undefined &&
            this.franchiseeEditData.franchiseeRationId > 0
        ) {
            const data = {
                id: this.franchiseeEditData.franchiseeRationId,
            };

            Ajax.get(ApiPath.ApiFranchiseeFranchiseeRationDetail, { data }).then((res: any) => {
                this.form.autoBonus = res.autoBonus;
                this.form.autoBonusAt = res.autoBonusAt;
            });
        }

        this.visible = true;
        this.elFormClearInvalids('form');
    }

    public close() {
        this.form.autoBonus = 0;
        this.form.autoBonusAt = '';
        this.visible = false;
    }

    public save() {
        if (this.loading) {
            return;
        }
        const data = {
            id: this.franchiseeEditData.franchiseeRationId,
            franchisee_id: this.franchiseeEditData.franchiseeId,
            auto_bonus: this.form.autoBonus,
            auto_bonus_at: moment(this.form.autoBonusAt, 'HH:mm').format('HH:mm'),
        };

        this.loading = true;
        const api =
            this.franchiseeEditData.franchiseeRationId === 0
                ? ApiPath.ApiFranchiseeFranchiseeRationAdd
                : ApiPath.ApiFranchiseeFranchiseeRationUpdate;
        Ajax.post(api, { data })
            .then(() => {
                this.$emit('saved');
                this.close();
            })
            .catch((res) => this.elFormInvalids(res, 'form'))
            .finally(() => (this.loading = false));
    }
}
</script>
<style lang="scss">
.FranchiseeRationEditDialog {
    .el-form-item__label {
        text-align: left;
    }
    .el-date-editor {
        width: 192px;
    }
}
</style>
