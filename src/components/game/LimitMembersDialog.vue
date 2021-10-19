<template>
    <el-dialog :title="title"
        :visible.sync="visible">
        <el-table :data="members">
            <el-table-column prop="account"></el-table-column>
        </el-table>
    </el-dialog>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator';
import ElementFormValidator from '@/mixins/ElementFormValidator';
import { ApiPath } from '@/api';
import { Ajax } from '@/stores/actions';

interface Member {
    id: number;
    account: string;
}

@Component
export default class LimitMembersDialog extends Mixins(ElementFormValidator) {
    public visible = false;
    public members: Member[] = [];

    get title() {
        return this.$t('component.gamePlatform.limit-members-dialog.title');
    }

    public open(platformId: number) {
        this.visible = true;

        const data = { platformId };
        Ajax.get(ApiPath.ApiGamePlatformLimitMembers, { data }).then((res) => {
            this.members = res.data;
        });
    }
}
</script>
