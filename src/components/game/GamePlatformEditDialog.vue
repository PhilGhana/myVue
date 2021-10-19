<template>
    <el-dialog
        class="component-game-platform-edit-dialog"
        :title="title"
        width="800px"
        :visible.sync="visible"
        :close-on-click-modal="false"
    >
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" @submit.native.prevent>
            <div class="row">
                <div class="col">
                    <el-form-item :label="pt('name')" prop="name">
                        <el-input v-model="form.name" :disabled="isLimitedAuth"></el-input>
                    </el-form-item>
                </div>
                <div class="col">
                    <el-form-item :label="pt('key')">
                        <el-input v-model="form.key" :disabled="isLimitedAuth"></el-input>
                    </el-form-item>
                </div>
            </div>
            <!-- 例行 維修時段 -->
            <div class="row">
                <div class="col maintain">
                    <label>{{ pt('setting-maintain') }}</label>
                    <el-form-item>
                        <el-select style="display: block" v-model="form.maintainDay" value-key="value">
                            <el-option
                                v-for="item in dayOptions"
                                :label="item.label"
                                :value="item.value"
                                :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="col">
                    <el-form-item :label="pt('start-time')" label-width="200px">
                        <el-time-picker
                            v-model="form.maintainTime"
                            value-format="HH:mm"
                            :picker-options="{ format: 'HH:mm' }"
                        />
                    </el-form-item>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <el-form-item :label="pt('maintain-time')" label-width="200px" prop="maintainMinute">
                        <el-input v-model="form.maintainMinute"></el-input>
                    </el-form-item>
                </div>
                <div class="col"></div>
            </div>
            <!-- 臨時 維修時段 非週期性 -->
            <div class="row">
                <div class="col">
                    <el-form-item label-width="200px" :label="pt('disposable-start-time')">
                        <el-date-picker
                            v-model="form.disposableMaintainDate"
                            type="datetime"
                            size="mini"
                            name="disposableMaintainDate"
                            :placeholder="pt('disposable-start-time')"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd HH:mm"
                        >
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="col">
                    <el-form-item label-width="200px" :label="pt('disposable-maintain-time')" prop="disposableMaintain">
                        <el-input v-model="form.disposableMaintain"></el-input>
                    </el-form-item>
                </div>
            </div>
            <!-- 順序 -->
            <div class="row">
                <div class="col">
                    <el-form-item :label="pt('order')" prop="order">
                        <el-input v-model="form.order" :disabled="isLimitedAuth"></el-input>
                    </el-form-item>
                </div>
            </div>
            <!-- 限制會員 -->
            <el-form-item :label="pt('limit-member')" prop="enabled">
                <div class="allow-members-wrapper">
                    <el-checkbox v-model="form.limit" class="allow-members-checkbox"></el-checkbox>
                    <el-select
                        v-model="form.members"
                        class="allow-members-select"
                        :multiple="true"
                        :disabled="!form.limit"
                        :filterable="true"
                        :remote="true"
                        :remote-method="queryMembers"
                        :loading="queryMemberLoading"
                    >
                        <el-option
                            v-for="item in limitMemberOptions"
                            :label="item.account"
                            :value="item.id"
                            :key="item.id"
                        ></el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item :label="'common.status-label' | t" prop="enabled">
                <el-checkbox v-model="form.enabled" :disabled="isLimitedAuth">{{
                    'common.status-enabled' | t
                }}</el-checkbox>
                <el-checkbox v-model="form.maintain">{{ 'status-maintain' | pt }}</el-checkbox>
            </el-form-item>
            <!--<el-form-item :label="'is-fun' | pt"
                prop="platformId">
                <el-checkbox v-model="form.fun">{{ 'is-fun' | pt}}</el-checkbox>
                <select
                    class="form-control"
                    v-model="form.platformId"
                    value-key="id"
                    :disabled="!form.fun"
                >
                    <option :value="0">{{ 'select-relation-platform' | pt }}</option>
                    <option
                        v-for="item in platformOptions"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                    ></option>
                </select>
            </el-form-item>-->
            <el-form-item :label="pt('setting')" prop="setting" v-if="!isLimitedAuth">
                <el-input type="textarea" :rows="8" :placeholder="pt('placeholder')" v-model="form.setting"> </el-input>
                <el-alert
                    type="error"
                    :closable="false"
                    :title="error.jsonFormat"
                    effect="dark"
                    v-show="error.jsonFormat"
                />
                <div class="json-format-wrapper">
                    <el-button @click="formatSettingJSON()">{{ pt('jsonFormat') }}</el-button>
                </div>
            </el-form-item>

            <el-form-item :label="pt('namespace')" prop="namespace" v-if="!isLimitedAuth">
                <el-input v-model="form.namespace" />
            </el-form-item>
            <el-form-item :label="pt('whitelist')" prop="whitelist" v-if="!isLimitedAuth">
                <el-input
                    type="textarea"
                    :rows="8"
                    :placeholder="pt('placeholder')"
                    v-model="form.whitelist"
                ></el-input>
            </el-form-item>
            <div class="row" v-if="!isLimitedAuth">
                <div class="col">
                    <el-form-item :label="pt('member-prefix')" prop="name">
                        <el-input v-model="form.memberPrefix" />
                    </el-form-item>
                </div>
                <div class="col">
                    <div class="sync-report">
                        <el-form-item :label="pt('sync-report')" prop="enabled">
                            <div class="allow-members-wrapper">
                                <el-checkbox v-model="useSyncReport" class="allow-members-checkbox"></el-checkbox>
                            </div>
                        </el-form-item>
                        <label>{{ pt('sync-report-delay') }}</label>
                    </div>
                    <el-form-item prop="name">
                        <el-input v-model="form.syncReportDelay" :disabled="!useSyncReport">
                            <template slot="append">{{ 'common.minute' | t }}</template>
                        </el-input>
                    </el-form-item>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <label for>{{ 'image' | pt }}</label>

                    <a class="showOrgImg" v-if="Boolean(form.imageUrl)" target="_blank" :href="form.imageUrl">{{
                        pt('showOrgImg')
                    }}</a>

                    <el-upload
                        :file-list="imageList"
                        action
                        accept="image/jpeg, image/png"
                        :auto-upload="false"
                        v-model="form.image"
                        :limit="1"
                        :on-change="uploadImage"
                        :on-remove="removeImage"
                        class="el-input-wrapper"
                        list-type="picture"
                    >
                        <img v-if="Boolean(form.imageUrl)" class="org-image img-thumbnail" :src="form.imageUrl" />
                        <i v-else-if="!Boolean(form.image)" class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>

                <div class="col">
                    <label for>{{ 'icon' | pt }}</label>
                    <a class="showOrgImg" v-if="Boolean(form.iconUrl)" target="_blank" :href="form.iconUrl">{{
                        pt('showOrgImg')
                    }}</a>
                    <el-upload
                        :file-list="iconList"
                        action
                        accept="image/jpeg, image/png"
                        v-model="form.icon"
                        :auto-upload="false"
                        :limit="1"
                        :on-change="uploadIcon"
                        :on-remove="removeIcon"
                        class="el-input-wrapper"
                        list-type="picture"
                    >
                        <img v-if="Boolean(form.iconUrl)" class="org-image img-thumbnail" :src="form.iconUrl" />
                        <i v-else-if="!Boolean(form.icon)" class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label for>{{ 'pageBgImg' | pt }}</label>

                    <a class="showOrgImg" v-if="Boolean(form.pageBgImgUrl)" target="_blank" :href="form.pageBgImgUrl">{{
                        pt('showOrgImg')
                    }}</a>
                    <el-upload
                        :file-list="pageBgImgList"
                        action
                        accept="image/jpeg, image/png"
                        :auto-upload="false"
                        v-model="form.pageBgImg"
                        :limit="1"
                        :on-change="uploadPageBgImg"
                        :on-remove="removePageBgImg"
                        class="el-input-wrapper"
                        list-type="picture"
                    >
                        <img
                            v-if="Boolean(form.pageBgImgUrl)"
                            class="org-image img-thumbnail"
                            :src="form.pageBgImgUrl"
                        />
                        <i v-else-if="!Boolean(form.pageBgImg)" class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="col">
                    <label for>{{ 'indexImg' | pt }}</label>

                    <a class="showOrgImg" v-if="Boolean(form.indexImgUrl)" target="_blank" :href="form.indexImgUrl">{{
                        pt('showOrgImg')
                    }}</a>

                    <el-upload
                        :file-list="indexImgList"
                        action
                        accept="image/jpeg, image/png"
                        v-model="form.indexImg"
                        :auto-upload="false"
                        :limit="1"
                        :on-change="uploadIndexImg"
                        :on-remove="removeIndexImg"
                        class="el-input-wrapper"
                        list-type="picture"
                    >
                        <img v-if="Boolean(form.indexImgUrl)" class="org-image img-thumbnail" :src="form.indexImgUrl" />
                        <i v-else-if="!Boolean(form.indexImg)" class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label for>{{ 'headerImg' | pt }}</label>

                    <a class="showOrgImg" v-if="Boolean(form.headerImgUrl)" target="_blank" :href="form.headerImgUrl">{{
                        pt('showOrgImg')
                    }}</a>
                    <el-upload
                        :file-list="headerImgList"
                        action
                        accept="image/jpeg, image/png"
                        :auto-upload="false"
                        v-model="form.headerImg"
                        :limit="1"
                        :on-change="uploadHeaderImg"
                        :on-remove="removeHeaderImg"
                        class="el-input-wrapper"
                        list-type="picture"
                    >
                        <img
                            v-if="Boolean(form.headerImgUrl)"
                            class="org-image img-thumbnail"
                            :src="form.headerImgUrl"
                        />
                        <i v-else-if="!Boolean(form.headerImg)" class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="col"></div>
            </div>
            <div class="row" v-if="!isLimitedAuth">
                <div class="col">
                    <el-form-item :label="pt('hasApp')" prop="hasApp">
                        <el-col :span="2">
                            <el-switch inactive-color="#ff4949" v-model="form.hasApp"></el-switch>
                        </el-col>
                        <el-col :span="3">
                            <span v-if="form.hasApp === true">Yes</span>
                            <span v-else>No</span>
                        </el-col>
                    </el-form-item>
                </div>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="loading">{{ 'common.cancel' | t }}</el-button>
            <el-button v-if="isLimitedAuth" type="primary" @click="saveByLimitedAuth" :loading="loading">{{
                'common.ok' | t
            }}</el-button>
            <el-button v-else type="primary" @click="save" :loading="loading">{{ 'common.ok' | t }}</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator';
import ElementFormValidator from '@/mixins/ElementFormValidator';
import { ApiPath } from '@/api';
import actions, { Ajax } from '@/stores/actions';
import { prefixTransaction } from '../../i18n';
import moment from 'moment';

interface GamePlatformInput {
    id: number;
    key: string;
    name: string;
    maintain: boolean;
    fun: boolean;
    memberPrefix: string;
    maintainCrontab: string;
    maintainMinute: number;
    disposableMaintainDate: string;
    disposableMaintain: number;
    namespace: string;
    whitelist: string;
    limit: boolean;
    syncReportDelay: number;
    enabled: boolean;
    setting: string;
    order: number;
    platformId: number;
    hasApp: boolean;
    imageUrl: string | null;
    iconUrl: string | null;
    pageBgImgUrl: string | null;
    indexImgUrl: string | null;
    headerImgUrl: string | null;
}

interface GamePlatformEditData extends GamePlatformInput {
    maintainDay: number;
    maintainTime: string;
    members: number[];
    image: string | null;
    icon: string | null;
    pageBgImg: string | null;
    indexImg: string | null;
    headerImg: string | null;
    imageUrl: string | null;
    iconUrl: string | null;
    pageBgImgUrl: string | null;
    indexImgUrl: string | null;
    headerImgUrl: string | null;
}

interface MemberOptions {
    id: number;
    account: string;
}

interface PlatformOption {
    id: number;
    name: string;
}

const defaultData: GamePlatformEditData = {
    id: 0,
    key: '',
    name: '',
    maintain: false,
    fun: false,
    memberPrefix: '',
    maintainDay: -1,
    maintainTime: '',
    maintainCrontab: '',
    maintainMinute: 0,
    disposableMaintainDate: '',
    disposableMaintain: 0,
    namespace: '',
    whitelist: '',
    syncReportDelay: 0,
    limit: false,
    enabled: false,
    setting: '{}',
    order: 0,
    members: [],
    platformId: 0,
    image: '',
    icon: '',
    pageBgImg: '',
    indexImg: '',
    headerImg: '',
    hasApp: true,
    imageUrl: '',
    iconUrl: '',
    pageBgImgUrl: '',
    indexImgUrl: '',
    headerImgUrl: '',
};

const pt = prefixTransaction('component.gamePlatform.gamePlatform-edit-dialog');

@Component({
    filters: { pt },
})
export default class GamePlatformEditDialog extends Mixins(ElementFormValidator) {
    @Prop(Boolean) public isLimitedAuth!: boolean; // 部分功能模式
    public pt = pt;
    public visible = false;
    public loading = false;
    public form: GamePlatformEditData = {
        id: 0,
        key: '',
        name: '',
        maintain: false,
        fun: false,
        memberPrefix: 'gd',
        maintainDay: -1,
        maintainTime: '',
        maintainCrontab: '',
        maintainMinute: 0,
        disposableMaintainDate: '',
        disposableMaintain: 0,
        syncReportDelay: 0,
        namespace: '',
        whitelist: '',
        limit: false,
        enabled: false,
        setting: '',
        order: 0,
        members: [0],
        platformId: 0,
        image: '',
        icon: '',
        pageBgImg: '',
        indexImg: '',
        headerImg: '',
        hasApp: true,
        imageUrl: '',
        iconUrl: '',
        pageBgImgUrl: '',
        indexImgUrl: '',
        headerImgUrl: '',
    };
    public rules = this.elFormRules(this.form);
    public dayOptions = [
        {
            label: 'common.not-set',
            value: -1,
        },
        {
            label: 'common.week.sunday',
            value: 0,
        },
        {
            label: 'common.week.monday',
            value: 1,
        },
        {
            label: 'common.week.tuesday',
            value: 2,
        },
        {
            label: 'common.week.wednesday',
            value: 3,
        },
        {
            label: 'common.week.thursday',
            value: 4,
        },
        {
            label: 'common.week.friday',
            value: 5,
        },
        {
            label: 'common.week.saturday',
            value: 6,
        },
    ];

    public inputImage = '';
    public imageList = [];
    public inputIcon = '';
    public iconList = [];
    public pageBgImgList = [];
    public indexImgList = [];
    public headerImgList = [];

    public error = {
        jsonFormat: '',
    };

    public queryMemberLoading = false;
    public limitMemberOptions: MemberOptions[] = [];

    public platformOptions: PlatformOption[] = [];

    get title() {
        return this.form.id === 0 ? this.pt('title-add') : this.pt('title-edit');
    }

    get pickerOptions() {
        return {
            disabledDate: this.dealDisableDate,
            format: 'yyyy-MM-dd HH:mm',
        };
    }

    set useSyncReport(bool: boolean) {
        this.form.syncReportDelay = bool ? 15 : 0;
    }
    get useSyncReport() {
        return this.form.syncReportDelay > 0;
    }

    public mounted() {
        this.dayOptions.forEach((o) => {
            o.label = String(this.$t(o.label));
        });

        this.getPlatformOptions();
    }

    public open(data?: GamePlatformInput) {
        this.visible = true;
        this.elFormClearInvalids('form');
        this.limitMemberOptions = [];
        this.imageList = [];
        this.iconList = [];
        this.pageBgImgList = [];
        this.indexImgList = [];
        this.headerImgList = [];

        data = data || JSON.parse(JSON.stringify(defaultData));

        const cron = data!.maintainCrontab ? data!.maintainCrontab.split(' ') : [];
        const maintainDay = cron.length ? Number(cron[4]) : -1;
        const maintainTime = cron.length ? cron[1] + ':' + cron[0] : '';
        this.form = data
            ? {
                  id: data.id,
                  key: data.key,
                  name: data.name,
                  fun: data.fun,
                  memberPrefix: data.memberPrefix,
                  maintain: data.maintain,
                  maintainDay,
                  maintainCrontab: '',
                  maintainTime,
                  maintainMinute: data.maintainMinute,
                  disposableMaintainDate: data.disposableMaintainDate,
                  disposableMaintain: data.disposableMaintain,
                  syncReportDelay: data.syncReportDelay,
                  namespace: data.namespace,
                  whitelist: data.whitelist,
                  limit: data.limit,
                  enabled: data.enabled,
                  order: data.order,
                  setting: data.setting,
                  members: [],
                  platformId: data.platformId,
                  image: '',
                  icon: '',
                  pageBgImg: '',
                  indexImg: '',
                  headerImg: '',
                  hasApp: data.hasApp,
                  imageUrl: data.imageUrl,
                  iconUrl: data.iconUrl,
                  pageBgImgUrl: data.pageBgImgUrl,
                  indexImgUrl: data.indexImgUrl,
                  headerImgUrl: data.headerImgUrl,
              }
            : { ...defaultData };
        this.limitMembers(data!.id);
        this.formatSettingJSON();
    }

    public close() {
        this.visible = false;
    }

    public save() {
        if (this.loading) {
            return;
        }

        const api = this.form.id === 0 ? ApiPath.ApiGamePlatformAdd : ApiPath.ApiGamePlatformEdit;
        const timeArray = this.form.maintainTime.split(':');
        const maintainCrontab =
            (this.form.maintainDay !== -1 &&
                this.form.maintainTime &&
                String(timeArray[1] + ' ' + timeArray[0] + ' *' + ' * ' + this.form.maintainDay)) ||
            '';

        const data = {
            id: this.form.id,
            key: this.form.key,
            name: this.form.name,
            enabled: this.form.enabled ? 1 : 0,
            limit: this.form.limit ? 1 : 0,
            maintain: this.form.maintain ? 1 : 0,
            memberPrefix: this.form.memberPrefix,
            fun: this.form.fun ? 1 : 0,
            maintainCrontab,
            maintainMinute: this.form.maintainMinute ? this.form.maintainMinute : 0,
            disposableMaintainDate: this.form.disposableMaintainDate ? this.form.disposableMaintainDate : '',
            disposableMaintain: this.form.disposableMaintain ? this.form.disposableMaintain : 0,
            namespace: this.form.namespace,
            whitelist: this.form.whitelist,
            syncReportDelay: this.form.syncReportDelay,
            order: this.form.order,
            members: this.form.members,
            setting: this.form.setting,
            platformId: this.form.platformId,
            image: this.form.image || '',
            icon: this.form.icon || '',
            pageBgImg: this.form.pageBgImg || '',
            indexImg: this.form.indexImg || '',
            headerImg: this.form.headerImg || '',
            hasApp: this.form.hasApp ? 1 : 0,
        };
        this.inputImage = '';
        this.inputIcon = '';
        this.loading = true;
        Ajax.upload(api, { data })
            .then(() => {
                this.close();
                this.$emit('saved');
                actions.socket.gamePlatformMaintainUpdate(
                    data.id,
                    data.maintain,
                    data.enabled,
                    data.limit,
                    data.members,
                    maintainCrontab ? maintainCrontab : null,
                    data.maintainMinute,
                    data.disposableMaintainDate ? data.disposableMaintainDate : null,
                    data.disposableMaintain,
                );
            })
            .catch((res) => {
                this.elFormInvalids(res, 'form');
                const err: any = [];
                res = res.errors ? res.errors : res;
                Object.values(res).map((item) => {
                    err.push(item);
                });

                actions.notify.error(err.join('<br>'));
            })
            .finally(() => (this.loading = false));
    }

    public limitMembers(platformId: number) {
        if (!platformId || !this.form.limit) {
            return;
        }

        const data = { platformId };
        Ajax.get(ApiPath.ApiGamePlatformLimitMembers, { data }).then((res) => {
            res.data.forEach((o: MemberOptions) => {
                this.form.members.push(o.id);
            });
            this.limitMemberOptions = res.data;
        });
    }

    public queryMembers(account: string) {
        if (!account) {
            return;
        }
        this.queryMemberLoading = true;
        const data = { account };
        Ajax.get(ApiPath.ApiGamePlatformQueryMember, { data }).then((res) => {
            this.limitMemberOptions = res.data;
            this.queryMemberLoading = false;
        });
    }

    /**
     * 格式化 setting 的 json
     */
    public formatSettingJSON() {
        const { form } = this;
        this.error.jsonFormat = '';
        try {
            form.setting = JSON.stringify(JSON.parse(form.setting), null, 4);
        } catch (err) {
            this.error.jsonFormat = this.pt('invalid.error-json');
        }
    }

    public uploadImage(event: any) {
        // this.inputImage = event.raw;
        this.form.image = event.raw;
        this.form.imageUrl = null;
    }

    public uploadIcon(event: any) {
        // this.inputIcon = event.raw;
        this.form.icon = event.raw;
        this.form.iconUrl = null;
    }

    public uploadPageBgImg(event: any) {
        this.form.pageBgImg = event.raw;
        this.form.pageBgImgUrl = null;
    }

    public uploadIndexImg(event: any) {
        this.form.indexImg = event.raw;
        this.form.indexImgUrl = null;
    }

    public uploadHeaderImg(event: any) {
        this.form.headerImg = event.raw;
        this.form.headerImgUrl = null;
    }

    public getPlatformOptions() {
        Ajax.get(ApiPath.ApiGamePlatformOptions).then((res) => {
            this.platformOptions = res.data;
        });
    }
    public removeImage() {
        this.form.image = null;
    }

    public removeIcon() {
        this.form.icon = null;
    }

    public removePageBgImg() {
        this.form.pageBgImg = null;
    }

    public removeIndexImg() {
        this.form.indexImg = null;
    }

    public removeHeaderImg() {
        this.form.headerImg = null;
    }

    /**
     * 部分功能的修改
     */
    public saveByLimitedAuth() {
        if (this.loading) {
            return;
        }
        const timeArray = this.form.maintainTime.split(':');
        const maintainCrontab =
            (this.form.maintainDay !== -1 &&
                this.form.maintainTime &&
                String(timeArray[1] + ' ' + timeArray[0] + ' *' + ' * ' + this.form.maintainDay)) ||
            '';
        const maintain = this.form.maintain ? 1 : 0;
        const data = {
            id: this.form.id,
            key: this.form.key,
            name: this.form.name,
            limit: this.form.limit ? 1 : 0,
            maintain: this.form.maintain ? 1 : 0,
            members: this.form.members,
            image: this.form.image || '',
            icon: this.form.icon || '',
            pageBgImg: this.form.pageBgImg || '',
            indexImg: this.form.indexImg || '',
            headerImg: this.form.headerImg || '',
            maintainCrontab,
            maintainMinute: this.form.maintainMinute ? this.form.maintainMinute : 0,
            disposableMaintainDate: this.form.disposableMaintainDate ? this.form.disposableMaintainDate : '',
            disposableMaintain: this.form.disposableMaintain ? this.form.disposableMaintain : 0,
        };
        this.inputImage = '';
        this.inputIcon = '';
        this.loading = true;

        Ajax.upload(ApiPath.ApiGamePlatformEditLimitedAuth, { data })
            .then(() => {
                this.close();
                this.$emit('saved');
                actions.socket.gamePlatformMaintainUpdate(
                    data.id,
                    data.maintain,
                    (this.form.enabled ? 1 : 0),
                    data.limit,
                    data.members,
                    maintainCrontab ? maintainCrontab : null,
                    data.maintainMinute,
                    data.disposableMaintainDate ? data.disposableMaintainDate : null,
                    data.disposableMaintain,
                );
            })
            .catch((res) => {
                this.elFormInvalids(res, 'form');
                const err: any = [];
                res = res.errors ? res.errors : res;
                Object.values(res).map((item) => {
                    err.push(item);
                });

                actions.notify.error(err.join('<br>'));
            })
            .finally(() => (this.loading = false));
    }

    public dealDisableDate(time: any) {
        return time.getTime() <= moment().subtract(1, 'day').toDate();
    }
}
</script>
<style lang="scss" scoped>
.component-game-platform-edit-dialog {
    .el-date-editor {
        width: 100%;
    }

    .allow-members-wrapper {
        display: flex;

        .allow-members-checkbox {
            flex: none;
        }
        .allow-members-select {
            flex: 1;
        }
    }

    .json-format-wrapper {
        position: absolute;
        top: 0;
        right: 0;
    }
    .el-alert {
        line-height: 20px;
    }
    .maintain label {
        width: 120px;
        line-height: 40px;
        .el-select {
            width: 100%;
        }
    }
    .org-image {
        max-height: 100px;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
    }
    .showOrgImg {
        margin-left: 10px;
    }
}
</style>
<style lang="scss">
.component-game-platform-edit-dialog {
    .el-form-item__label {
        text-align: left;
    }
    .uploadImg .el-form-item__label {
        line-height: 20px;
    }
    .sync-report .el-form-item {
        width: 100px;
        display: inline-block;
        margin: 0px;
        .allow-members-wrapper {
            position: relative;
            left: -40px;
        }
    }
}
</style>
