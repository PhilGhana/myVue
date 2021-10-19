<template>
    <el-dialog class="game_edit_dialog" :title="title" :visible.sync="visible" width="1000px" :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent label-width="100px">
            <div class="row">
                <div class="col-3">
                    <el-form-item :label="$t('component.game.game-edit-dialog.id')" prop="id">
                        <el-input v-model="form.id" :disabled="true"> </el-input>
                    </el-form-item>
                </div>

                <div class="col">
                    <label>{{ $t('component.game.game-edit-dialog.platformName') }}</label>
                    <el-form-item prop="platformId">
                        <el-select v-model="form.platformId">
                            <el-option :label="$t('common.not-set')" :value="0" :disabled="true"> </el-option>
                            <el-option
                                v-for="item in platformOptions"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div class="col">
                    <label>{{ $t('component.game.game-edit-dialog.type') }}</label>
                    <el-form-item prop="type">
                        <el-select v-model="form.type">
                            <el-option
                                v-for="item in typeOptions"
                                :label="item.name"
                                :value="item.type"
                                :key="item.type"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <el-form-item :label="$t('component.game.game-edit-dialog.name.zh-tw')">
                        <el-input v-model="form.nameZhTw"></el-input>
                    </el-form-item>
                </div>

                <div class="col">
                    <el-form-item :label="$t('component.game.game-edit-dialog.name.zh-cn')">
                        <el-input v-model="form.nameZhCn"></el-input>
                    </el-form-item>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <el-form-item :label="$t('component.game.game-edit-dialog.name.en')">
                        <el-input v-model="form.nameEn"></el-input>
                    </el-form-item>
                </div>

                <div class="col">
                    <el-form-item :label="$t('component.game.game-edit-dialog.name.jp')">
                        <el-input v-model="form.nameJp"></el-input>
                    </el-form-item>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <el-form-item :label="$t('component.game.game-edit-dialog.code.code')" prop="code">
                        <el-input v-model="form.code"></el-input>
                    </el-form-item>
                </div>

                <div class="col">
                    <el-form-item :label="$t('component.game.game-edit-dialog.code.code-report')">
                        <el-input v-model="form.codeReport"></el-input>
                    </el-form-item>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <el-form-item :label="$t('component.game.game-edit-dialog.code.code-mobile')" label-width="350px">
                        <el-input v-model="form.codeMobile"></el-input>
                    </el-form-item>
                </div>
                <div class="col">
                    <el-form-item :label="$t('component.game.game-edit-dialog.game-hall')">
                        <el-input v-model="form.gameHall"></el-input>
                    </el-form-item>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <el-form-item :label="$t('component.game.game-edit-dialog.tag')" prop="tags">
                        <el-select v-model="form.tags" :multiple="true" :filterable="true">
                            <el-option v-for="item in tagOptions" :label="item.name" :value="item.tag" :key="item.tag">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="col">
                    <el-form-item :label="$t('component.game.game-edit-dialog.order')" prop="order">
                        <el-input v-model="form.order"> </el-input>
                    </el-form-item>
                </div>
            </div>

            <el-form-item :label="$t('component.common.status-setting.status-setting')" prop="enabled">
                <el-checkbox v-model="form.enabled">{{
                    'component.common.status-setting.enabled-status' | t
                }}</el-checkbox>
                <el-checkbox v-model="form.maintain">{{
                    'component.game.game-edit-dialog.status-maintain' | t
                }}</el-checkbox>
            </el-form-item>

            <div class="row">
                <div class="col-3">
                    <label for>{{ $t('component.game.game-edit-dialog.image') }}</label>

                    <a class="showOrgImg" v-if="Boolean(form.imageUrl)" target="_blank" :href="form.imageUrl">{{
                        $t('component.game.game-edit-dialog.showOrgImg')
                    }}</a>

                    <el-upload
                        :file-list="imageList"
                        action=""
                        accept="image/jpeg,image/png"
                        :auto-upload="false"
                        :limit="1"
                        :on-change="uploadImage"
                        v-model="form.image"
                        list-type="picture"
                        class="el-input-wrapper"
                        :on-remove="removeImage"
                    >
                        <img v-if="Boolean(form.imageUrl)" class="org-image img-thumbnail" :src="form.imageUrl" />
                        <i v-else-if="!Boolean(form.image)" class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>

                <!-- <div class="col-3">
                    <el-form-item :label="$t('component.game.game-edit-dialog.order')" prop="order">
                        <el-input v-model="form.order"> </el-input>
                    </el-form-item>
                </div> -->
            </div>

            <el-form-item :label="$t('component.game.game-edit-dialog.remark')" prop="remark">
                <el-input :rows="4" v-model="form.remark" type="textarea"> </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" :loading="loading">{{ 'common.cancel' | t }}</el-button>
            <el-button type="primary" @click="save" :loading="loading">{{ 'common.ok' | t }}</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator';
import ElementFormValidator from '@/mixins/ElementFormValidator';
import { ApiPath } from '@/api';
import actions, { Ajax } from '@/stores/actions';

interface GameEditData {
    id: number;
    platformName: string;
    platformId: number;
    code: string;
    codeMobile: string;
    codeReport: string;
    nameZhCn: string;
    nameZhTw: string;
    nameEn: string;
    nameJp: string;
    type: string;
    typeName: string;
    enabled: boolean;
    maintain: boolean;
    gameHall: string;
    order: number;
    tags: Array<{
        tag: string;
        name: string;
    }>;
    remark: string;
    imageUrl: string;
}

const defaultData = {
    id: 0,
    platformName: '',
    platformId: 0,
    code: '',
    codeMobile: '',
    codeReport: '',
    nameEn: '',
    nameZhTw: '',
    nameZhCn: '',
    nameJp: '',
    type: '',
    typeName: '',
    enabled: false,
    maintain: false,
    gameHall: '',
    order: 0,
    tags: [],
    image: '',
    remark: '',
    imageUrl: '',
};

interface TagOption {
    tag: string;
    name: string;
}

interface TypeOption {
    type: string;
    name: string;
}

interface PlatformOption {
    id: number;
    name: string;
}

@Component
export default class GameEditDialog extends Mixins(ElementFormValidator) {
    public visible = false;
    public loading = false;
    public form = defaultData;
    public rules = this.elFormRules(this.form);

    public tagOptions: TagOption[] = [];
    public typeOptions: TypeOption[] = [];
    public platformOptions: PlatformOption[] = [];

    public imageList = [];

    get title() {
        return this.form.id === 0
            ? this.$t('component.game.game-edit-dialog.title-add')
            : this.$t('component.game.game-edit-dialog.title-edit');
    }

    public mounted() {
        this.getTagOptions();
        this.getTypeOptions();
        this.getPlatformOptions();
    }

    public open(data?: GameEditData) {
        this.visible = true;
        this.elFormClearInvalids('form');
        this.imageList = [];
        this.form =
            (data && {
                id: data!.id,
                platformName: data!.platformName,
                platformId: data!.platformId,
                code: data!.code,
                codeMobile: data!.codeMobile,
                codeReport: data!.codeReport,
                nameEn: data!.nameEn,
                nameZhTw: data!.nameZhTw,
                nameZhCn: data!.nameZhCn,
                nameJp: data!.nameJp,
                type: data!.type,
                typeName: data!.typeName,
                enabled: data!.enabled,
                maintain: data!.maintain,
                order: data!.order,
                gameHall: data!.gameHall,
                tags: JSON.parse(
                    JSON.stringify(
                        data!.tags.map((o) => {
                            return o.tag;
                        }),
                    ),
                ),
                image: '',
                remark: data!.remark,
                imageUrl: data!.imageUrl,
            }) ||
            JSON.parse(JSON.stringify(defaultData));
    }

    public close() {
        this.visible = false;
    }

    public save() {
        if (this.loading) {
            return;
        }

        const api = this.form.id === 0 ? ApiPath.ApiGameAdd : ApiPath.ApiGameEdit;
        const data = {
            ...this.form,
            enabled: this.form.enabled ? 1 : 0,
            maintain: this.form.maintain ? 1 : 0,
        };
        this.elFormClearInvalids('form');
        Ajax.upload(api, { data })
            .then(() => {
                this.close();
                this.$emit('saved');
                actions.socket.gameMaintainUpdate(data.id, data.maintain, data.platformId, data.enabled);
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

    public uploadImage(event: any) {
        this.form.image = event.raw;
        this.form.imageUrl = '';
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

    public getPlatformOptions() {
        Ajax.get(ApiPath.ApiGamePlatformOptions).then((res) => {
            this.platformOptions = res.data;
        });
    }
    public removeImage() {
        this.form.image = '';
    }
}
</script>

<style lang="scss">
.game_edit_dialog {
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