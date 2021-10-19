<template>
    <el-dialog
        :title="pt('edit-base-member-propmpt')"
        width="20%"
        :close-on-click-modal="false"
        :visible.sync="visible"
    >
        <el-form @submit.native.prevent>
            <el-form-item :label="pt('min-base-members')">
                <el-input type="number" v-model="form.min" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="pt('max-base-members')">
                <el-input type="number" v-model="form.max" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="subLoading">{{ 'common.cancel' | t }}</el-button>
            <el-button class="btn-ok" @click="save" :loading="subLoading">{{ 'common.ok' | t }}</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { prefixTransaction } from '@/i18n';
import store from '@/store';
import { ApiPath } from '@/api';
import actions, { Ajax } from '@/stores/actions';

export interface Range {
    min: number;
    max: number;
}

const defaultData: Range = {
    min: 0,
    max: 0,
};

@Component
export default class OnlineBaseDialog extends Vue {
    @Prop({
        required: true,
    })
    public range!: Range;
    @Prop(Boolean) public loading!: boolean;
    public pt = prefixTransaction('component.socket.socket-bar');
    public subLoading = false;
    public visible = false;
    public fid = 0;
    public form: Range = defaultData;

    get franchiseeId() {
        return store.state.App.currentFranchiseeId;
    }

    public open(fid: number) {
        this.fid = fid;
        this.form = {
            ...this.range,
        };
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }

    public save() {
        if (this.loading || this.subLoading) {
            return;
        }

        if (!this.isPositiveInteger(this.form.min) || !this.isPositiveInteger(this.form.max)) {
            actions.notify.error(this.pt('invalids.positive-intege-only'));
            return;
        }

        const data = {
            id: this.franchiseeId,
            baseMin: this.form.min,
            baseMax: this.form.max,
        };
        this.subLoading = true;

        Ajax.upload(ApiPath.ApiFranchiseeBaseEdit, { data })
            .then(() => {
                const range = this.getRandomIntInclusive();
                actions.socket.setOnlineBase(this.franchiseeId, range);
                actions.socket.refreshOnlines(this.franchiseeId);

                this.$emit('update:range', { min: this.form.min, max: this.form.max });
                this.close();
            })
            .catch((res) => {
                const err: any = [];
                res = res.errors ? res.errors : res;
                Object.values(res).map((item) => {
                    err.push(item);
                });

                actions.notify.error(err.join('<br>'));
            })
            .finally(() => {
                this.subLoading = false;
            });
    }

    // 亂數產生基本人數
    private getRandomIntInclusive() {
        const min = Math.ceil(this.form.min);
        const max = Math.floor(this.form.max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 驗證正整數
    private isPositiveInteger(s: any) {
        const re = /^[0-9]+$/;
        return re.test(s);
    }
}
</script>