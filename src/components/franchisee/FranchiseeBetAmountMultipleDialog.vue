<template>
    <el-dialog
        :width="'90%'"
        :title="$t('view.system.betAmountMultiple.title')"
        :close-on-click-modal="false"
        :visible.sync="visible"
    >
        <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent label-width="120px">
            <el-row :gutter="20">
                <el-col :span="2">
                    <div class="input_title">{{$t('view.system.betAmountMultiple.type.title')}}</div>
                    <el-select v-model="form.type">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.id"
                            :value="item.key"
                            :label="item.name"
                        ></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <div
                        class="input_title"
                    >{{$t('view.system.betAmountMultiple.betAmountMultiple')}}</div>
                    <el-form-item prop="bet_amount_multiple">
                        <el-input v-model="form.bet_amount_multiple"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <div class="input_title">{{$t('view.system.betAmountMultiple.weights')}}</div>
                    <el-form-item prop="weights">
                        <el-input v-model="form.weights"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2" class="checkboxSpan">
                    <div class="input_title">{{$t('view.system.betAmountMultiple.disableDate')}}</div>
                    <el-checkbox v-model="disabledDate" @change="clearDate()"></el-checkbox>
                </el-col>
                <el-col :span="5">
                    <div class="input_title">{{$t('component.common.time.startTime')}}</div>
                    <el-form-item prop="start_time">
                        <el-date-picker
                            v-model="form.start_time"
                            class="el-input-wrapper"
                            type="datetime"
                            size="mini"
                            name="startTime"
                            :disabled="disabledDate"
                            :placeholder="$t('component.common.time.startTime')"
                            format="yyyy-MM-dd HH:mm"
                            align="right"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <div class="input_title">{{$t('component.common.time.endTime')}}</div>
                    <el-form-item prop="end_time">
                        <el-date-picker
                            v-model="form.end_time"
                            class="el-input-wrapper"
                            type="datetime"
                            size="mini"
                            name="endTime"
                            :disabled="disabledDate"
                            :placeholder="$t('component.common.time.endTime')"
                            format="yyyy-MM-dd HH:mm"
                            align="right"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <div class="input_title button waterDialogBtnList"></div>
                    <el-button @click="clearForm()">{{ 'common.clear' | t }}</el-button>
                    <el-button
                        type="primary"
                        @click="save"
                        :loading="loading"
                        v-text="$t('common.add')"
                        v-if="mode == 'add'"
                    ></el-button>
                    <el-button
                        type="success"
                        @click="save"
                        :loading="loading"
                        v-text="$t('common.edit')"
                        v-if="mode == 'edit'"
                    ></el-button>
                </el-col>
            </el-row>
        </el-form>
        <ListGrid ref="grid" sorts="id,asc" :data="response">
            <el-table-column
                prop="bet_amount_multiple"
                :label="$t('view.system.betAmountMultiple.type.title')"
            >
                <template
                    slot-scope="{row}"
                >{{ $t(`view.system.betAmountMultiple.type.${row.type}`) }}</template>
            </el-table-column>

            <el-table-column
                prop="bet_amount_multiple"
                :label="$t('view.system.betAmountMultiple.betAmountMultiple')"
            >
                <template slot-scope="{row}">{{ row.bet_amount_multiple }}</template>
            </el-table-column>

            <el-table-column prop="weights" :label="$t('view.system.betAmountMultiple.weights')">
                <template slot-scope="{row}">{{ row.weights }}</template>
            </el-table-column>

            <el-table-column
                prop="start_time"
                align="center"
                :label="$t('component.common.time.startTime')"
            >
                <template slot-scope="{row}">
                    <div class="col-datetime-short">{{ row.start_time }}</div>
                </template>
            </el-table-column>

            <el-table-column
                prop="end_time"
                align="center"
                :label="$t('component.common.time.endTime')"
            >
                <template slot-scope="{row}">
                    <div class="col-datetime-short">{{ row.end_time }}</div>
                </template>
            </el-table-column>

            <el-table-column
                :label="$t('common.col-options')"
                fixed="right"
                align="center"
                width="80px"
            >
                <template slot-scope="scope">
                    <div>
                        <el-button
                            size="mini"
                            class="btn-mini"
                            @click="edit(scope.row)"
                        >{{ 'common.edit' | t }}</el-button>
                    </div>
                </template>
            </el-table-column>
        </ListGrid>
        <div class="tableHeight"></div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="loading">{{'common.cancel' | t}}</el-button>
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
import ListGrid from '../../components/common/list/ListGrid.vue';

@Component
export default class FranchiseeBetAmountMultipleDialog extends Mixins(ElementFormValidator) {
    public pt = prefixTransaction('view.system.betAmountMultiple');

    public response: Promise<IAjax.Result> | null = null;

    public visible = false;

    public loading = false;

    public disabledDate = false;

    public mode = 'add';
    public id = 0;
    public page = 1;

    public $refs!: {
        grid: ListGrid;
    };

    public typeOptions = [
        {
            id: 0,
            key: 'first',
            name: this.pt('type.first').toString(),
        },
        {
            id: 1,
            key: 'normal',
            name: this.pt('type.normal').toString(),
        },
    ];

    public form = {
        id: null,
        type: 'normal',
        franchisee_id: 0,
        bet_amount_multiple: '',
        weights: 200,
        start_time: '',
        end_time: '',
    };

    public rules = this.elFormRules(this.form);

    // public function changeButtion() {

    // }

    public open(id: number, page: number, mode: string = 'add') {
        this.elFormClearInvalids('form');
        this.clearForm();
        this.visible = true;
        this.mode = 'add';
        this.form.franchisee_id = id;
        this.getList(id, page);
    }

    public close() {
        this.visible = false;
    }

    public save() {
        if (this.loading) {
            return;
        }

        const data = {
            id: this.form.id,
            franchisee_id: this.form.franchisee_id,
            type: this.form.type,
            bet_amount_multiple: this.form.bet_amount_multiple,
            weights: this.form.weights,
            start_time: this.form.start_time ? moment(this.form.start_time).format('YYYY-MM-DD HH:mm:ss') : '',
            end_time: this.form.end_time ? moment(this.form.end_time).format('YYYY-MM-DD HH:mm:ss') : '',
        };
        this.loading = true;

        const api =
            this.mode === 'add' ? ApiPath.ApiFranchiseeMultipleConfigAdd : ApiPath.ApiFranchiseeMultipleConfigEdit;
        Ajax.post(api, { data })
            .then(() => {
                this.close();
                actions.reloadFranchiseeOptions();
                this.$emit('saved');
            })
            .catch((res) => {
                this.elFormInvalids(res, 'form');
            })
            .finally(() => (this.loading = false));
    }

    public getList(id: number, page: number) {
        this.$nextTick(function() {
            const grid = this.$refs.grid;
            const data = {
                franchisee_id: id,
                ...grid.query,
                page: page || grid.query.page,
            };
            this.response = Ajax.get(ApiPath.ApiFranchiseeMultipleConfigList, { data }).then((res) => {
                return Promise.resolve(res);
            });
        });
    }

    public edit(row: any) {
        this.mode = 'edit';
        this.form.id = row.id;
        this.form.type = row.type;
        this.form.bet_amount_multiple = row.bet_amount_multiple;
        this.form.weights = row.weights;
        this.form.start_time = row.start_time;
        this.form.end_time = row.end_time;
    }
    public clearForm() {
        this.mode = 'add';
        this.form.id = null;
        this.form.bet_amount_multiple = '';
        this.form.weights = 200;
        this.form.start_time = '';
        this.form.end_time = '';
    }

    public clearDate() {
        if (this.disabledDate) {
            this.form.start_time = '';
            this.form.end_time = '';
        }
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
.checkboxSpan {
    text-align: center;
}

.el-form-item__content {
    margin-left: 0px !important;
}
.waterDialogBtnList.input_title.button {
    margin-bottom: 42px;
}
</style>
