<template>
    <el-dialog :title="title"
        :visible.sync="visible" :close-on-click-modal="false">

        <el-form ref="form"
            :model="form"
            :rules="rules"
            @submit.native.prevent
            label-width="100px">

            <el-form-item :label="$t('component.game.game-edit-dialog.tag')"
                prop="tags">
                <el-select v-model="form.tags"
                    :multiple="true"
                    :filterable="true">
                    <el-option v-for="item in tagOptions"
                        :label="item.name"
                        :value="item.tag"
                        :key="item.tag">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('component.game.game-edit-dialog.type')"
                prop="tags">
                <el-select v-model="form.types"
                    :multiple="true"
                    :filterable="true">
                    <el-option v-for="item in typeOptions"
                        :label="item.name"
                        :value="item.type"
                        :key="item.type">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('component.common.status-setting.status-setting')"
                prop="enabled">
                <el-checkbox v-model="form.maintain">{{ 'component.game.game-edit-dialog.status-maintain' | t}}</el-checkbox>
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

interface TagOption {
    tag: string;
    name: string;
}

interface TypeOption {
    type: string;
    name: string;
}

const defaultData = {
    tags: [],
    types: [],
    maintain: false,
};

@Component
export default class BatchToggleMaintainEditDialog extends Mixins(ElementFormValidator) {
    public visible = false;
    public loading = false;
    public form = defaultData;
    public rules = this.elFormRules(this.form);

    public tagOptions: TagOption[] = [];
    public typeOptions: TypeOption[] = [];

    get title() {
        return 'no title';
    }

    public mounted() {
        this.getTagOptions();
        this.getTypeOptions();
    }

    public open() {
        this.visible = true;
        this.elFormClearInvalids('form');
        this.form = JSON.parse(JSON.stringify(defaultData));
    }

    public close() {
        this.visible = false;
    }

    public save() {
        if (this.loading) {
            return;
        }

        const api = ApiPath.ApiGameGameBatchToggleMaintain;
        const data = {
            ...this.form,
            maintain: this.form.maintain ? 1 : 0,
        };
        Ajax.upload(api, { data })
            .then(() => {
                this.close();
                this.$emit('saved');
            })
            .catch((res) => this.elFormInvalids(res, 'form'))
            .finally(() => (this.loading = false));
    }

    public getTagOptions() {
        Ajax.get(ApiPath.ApiGameGameTagOptions).then((res) => {
            this.tagOptions = res.data;
        });
    }

    public getTypeOptions() {
        Ajax.get(ApiPath.ApiGameGameTypeOptions).then((res) => {
            this.typeOptions = res.data;
        });
    }
}
</script>
