<template>
    <el-dialog
        :width="'400px'"
        :title="$t('view.system.franchisee.pay-setting.title')"
        :close-on-click-modal="false"
        :visible.sync="visible"
    >
        <el-form
            ref="form"
            :model="form"
            label-width="100px"
            :rules="rules"
            :label-position="labelPosition"
            @submit.native.prevent
        >
            <el-form-item :label="pt('single-max-limit')" prop>
                <input v-model="form.max" class="form-control align-right no-spinners" />
            </el-form-item>

            <el-form-item :label="pt('single-min-limit')" prop>
                <input v-model="form.min" class="form-control align-right no-spinners" />
            </el-form-item>

            <el-form-item :label="pt('fix-money')" prop>
                <input v-model="form.fixMoney" class="form-control align-right no-spinners" />
            </el-form-item>

            <el-form-item :label="pt('order')" prop>
                <input v-model="form.sort" class="form-control align-right no-spinners" />
            </el-form-item>
        </el-form>
        <hr />
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="loading">{{ 'common.cancel' | t }}</el-button>
            <el-button @click="save" type="primary" :loading="loading">{{ 'common.save' | t }}</el-button>
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

const defaultData = {
    min: 0,
    max: 0,
    fixMoney: 0,
    sort: 0,
};

@Component
export default class ThirdPaySettingDialog extends Mixins(ElementFormValidator) {
    public pt = prefixTransaction('view.system.franchisee.pay-setting');

    public response: Promise<IAjax.Result> | null = null;

    public visible = false;

    public loading = false;

    public disabledDate = false;

    public labelPosition = 'left';

    public form = { ...defaultData };

    public rules: any = this.elFormRules(this.form);

    public id = 0;

    public open(item: any) {
        this.elFormClearInvalids('form');
        this.visible = true;
        this.id = item.id;
        this.form.max = item.maxAmount;
        this.form.min = item.minAmount;
        this.form.fixMoney = item.amounts.replace('[', '').replace(']', '');
    }

    public close() {
        this.visible = false;
    }

    public save() {
        if (this.loading) {
            return;
        }

        const data = {
            id: this.id,
            ...this.form,
        };
        this.loading = true;
        Ajax.post(ApiPath.ApiThirdModify, { data })
            .then(() => {
                this.$emit('saved');
                this.close();
            })
            .finally(() => (this.loading = false));
    }
}
</script>



<style lang="scss">
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.input_title {
    margin-bottom: 20px;
}
.input_title.button {
    margin-bottom: 33px;
}
.checkboxSpan {
    text-align: center;
}

.el-form-item__content {
    margin-left: 0px !important;
}
</style>
