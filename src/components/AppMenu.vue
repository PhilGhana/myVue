<template>
    <div class="app-menu-component" :class="componentClass">
        <div class="collapse-button" @click="isCollapse = !isCollapse">
            <i class="material-icons" v-show="isCollapse">chevron_right</i>
            <i class="material-icons" v-show="!isCollapse">chevron_left</i>
        </div>

        <el-menu
            :router="true"
            class="menu-wrapper"
            :collapse="isCollapse"
            :default-active="$route.path"
        >
            <template v-for="vTree in viewTrees">
                <el-submenu :index="`${vTree.id}`" :key="vTree.id" v-if="vTree.isMenu">
                    <template slot="title">
                        <i class="menu-icon" :class="vTree.iconClassName">{{ vTree.icon }}</i>
                        <span class="menu-label">{{ vTree.name }}</span>
                    </template>
                    <el-menu-item
                        v-for="item in vTree.childrens"
                        :index="item.path"
                        :key="item.id"
                        class="menu-label"
                    >{{ item.name }}</el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="vTree.path" :key="vTree.id">
                    <i class="menu-icon" :class="vTree.iconClassName">{{ vTree.icon }}</i>
                    <span class="menu-label">{{ vTree.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
        <div class="version-panel" v-if="allowVersion">ver. {{ curVersion }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IAppModule } from '@/stores/modules/AppModule';
import store from '@/store';
import { prefixTransaction } from '@/i18n';

import { ApiPath } from '@/api';
import { Ajax } from '@/stores/actions';

const VERSION = process.env.VUE_APP_VERSION;

@Component
export default class AppMenu extends Vue {
    public viewExpands: number[] = [];
    public menuExpand = false;

    public isCollapse = true;

    public defaultRoute = '';

    public curVersion = '';

    get componentClass() {
        return {
            'menu-collapse': this.isCollapse,
        };
    }

    get allowVersion() {
        return store.state.App.allowApi.ApiVersionCurVersion;
    }

    public mounted() {
        if (this.allowVersion) {
            this.getVersion();
        }
    }

    public getVersion() {
        Ajax.get(ApiPath.ApiVersionCurVersion).then((res) => {
            this.curVersion = res.data.content.version;
        });
    }

    public handleOpen() {
        this.isCollapse = false;
    }
    public handleClose() {
        this.isCollapse = true;
    }

    get viewTrees() {
        const pt = prefixTransaction('menu');
        const regex = RegExp('view_.*');
        const viewTrees: IAppModule.ViewTree[] = store.getters.viewTrees;
        const viewExpands = this.viewExpands;
        return viewTrees.map((vTree) => {
            const isMenu = vTree.type === IAppModule.ViewType.Menu;
            const isLink = vTree.type === IAppModule.ViewType.Link;
            const treeName = regex.test(pt(vTree.code).toString()) ? vTree.name : pt(vTree.code).toString();

            // 檔名轉換
            const childrens = vTree.childrens.map((o: any) => {
                return {
                    ...o,
                    name: regex.test(pt(o.code).toString()) ? o.name : pt(o.code).toString(),
                };
            });
            vTree.name = treeName;
            vTree.childrens = childrens;

            return {
                ...vTree,
                iconClassName: vTree.className ? 'material-icons' : '',
                icon: vTree.className || treeName.substr(0, 1),
                firstName: treeName.substr(0, 1),
                isMenu,
                isLink,
            };
        });
    }
}
</script>


<style lang="scss" scoped>
.menu-icon {
    margin-right: 20px;
}
.menu-wrapper:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.franchisee-panel {
    margin: 10px 0;
}
.collapse-button {
    display: block;
    padding: 10px 0;
    text-align: center;
    font-size: 18px;
    color: #909399;
    cursor: pointer;
    &:hover {
        background: #91d6da;
    }
}
.version-panel {
    text-align: right;
    font-family: 'Microsoft JhengHei';
    padding: 5px 10px;
    font-style: italic;
    font-size: 10px;
}

 .el-menu-item.is-active {
    color: #000;
    background-color: #91d6da;
}
</style>
