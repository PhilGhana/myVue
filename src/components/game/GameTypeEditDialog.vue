<template>
    <el-dialog  class="gameTypeEditDialog" :title="title"
        :visible.sync="visible" :close-on-click-modal="false">

        <el-form ref="form"
            :model="form"
            :rules="rules"
            @submit.native.prevent
            label-width="100px">

            <el-form-item :label="$t('component.gameType.gameType-edit-dialog.type')"
                prop="type">
                <el-input v-model="form.type"
                    :disabled="form.id !== 0">
                </el-input>
            </el-form-item>

            <el-form-item :label="$t('component.gameType.gameType-edit-dialog.name')"
                prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer"
            class="dialog-footer">
            <el-button @click="close"
                :loading="loading">{{'common.cancel' | t}}</el-button>
            <el-button type="primary"
                @click="save"
                :loading="loading">{{'common.ok' | t}}</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator';
import ElementFormValidator from '@/mixins/ElementFormValidator';
import { ApiPath } from '@/api';
import { Ajax } from '@/stores/actions';


interface GameTypeEditData {
    id: number;
    type: string;
    name: string;
}

const defaultData = {
    id: 0,
    type: '',
    name: '',
};

@Component
export default class GameTypeEditDialog extends Mixins(ElementFormValidator) {
    public visible = false;
    public loading = false;
    public form = defaultData;
    public rules = this.elFormRules(this.form);

    get title() {
        return this.form.id === 0
            ? this.$t('component.gameType.gameType-edit-dialog.title-add')
            : this.$t('component.gameType.gameType-edit-dialog.title-edit');
    }

    public open(data?: GameTypeEditData) {
        this.visible = true;
        this.elFormClearInvalids('form');
        this.form = data
            ? {...data}
            : JSON.parse(JSON.stringify(defaultData));
    }

    public close() {
        this.visible = false;
    }

    public save() {
        if (this.loading) {
            return;
        }

        const api = this.form.id === 0
            ? ApiPath.ApiGameTypeAdd
            : ApiPath.ApiGameTypeEdit;
        const data = {
            type: this.form.type,
            name: this.form.name,
        };
        Ajax.post(api, { data }).then(() => {
            this.close();
            this.$emit('saved');
        }).catch((res) => this.elFormInvalids(res, 'form'))
            .finally(() => this.loading = false);
    }
}
</script>

<style lang="scss">
.gameTypeEditDialog {
    label {
        width: 120px;
        line-height: 40px;
    }
    .el-select {
        width: 100%;
    }
    .el-form-item__label {
        text-align: left;
    }
}
</style>