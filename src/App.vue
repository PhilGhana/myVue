<template>
    <div class="app">
        <template v-if="isLogin">
            <el-container class="w-100 h-100">
                <el-aside width="auto">
                    <transition name="slide-fade-left">
                        <AppMenu />
                    </transition>
                </el-aside>
                <el-container class="main-container">
                    <el-header class="p-0 h-auto">
                        <transition name="slide-fade-up">
                            <AppHeader />
                        </transition>
                    </el-header>
                    <el-main class="py-2 px-4">
                        <ReviewNotificationBar />
                        <SocketBar />
                        <!-- 頁面路由 -->
                        <router-view />
                    </el-main>
                </el-container>
            </el-container>
        </template>
        <Login v-else-if="showLogin" />
        <Notify />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import $ from 'jquery';
import store from '@/store';
import AppMenu from '@/components/AppMenu.vue';
import AppHeader from '@/components/AppHeader.vue';
import Notify from '@/components/Notify.vue';
import ReviewNotificationBar from '@/components/socket/ReviewNotificationBar.vue';
import SocketBar from '@/components/socket/SocketBar.vue';
import Login from '@/views/Login.vue';
import config from '@/config';

@Component({
    components: {
        AppMenu,
        AppHeader,
        ReviewNotificationBar,
        SocketBar,
        Notify,
        Login,
    },
})
export default class App extends Vue {
    get user() {
        return store.state.App.user;
    }

    get isLogin(): boolean {
        return this.$store.getters.isLogin;
    }

    get showLogin() {
        const isLogin = this.isLogin;
        const initFirst = store.state.App.initFinish;

        /** session 模式下，執行完 initFirst 後若未登入時，才顯示登入頁面 */
        if (config.SESSION_MODE) {
            return initFirst && !isLogin;
        }
        return !isLogin;
    }

    @Watch('$route.path') public watchRoutePath(path: string) {
        if (document.scrollingElement) {
            $(document.scrollingElement).animate({
                scrollTop: 0,
            });
        }
    }

    @Watch('isLogin', { immediate: true }) public watchIsLogin(isLogin: boolean) {
        /* 未完成 init 前(未確認登入狀況前) 不處理  */
        if (store.state.App.initFinish) {
            if (!isLogin) {
                this.$router.replace('/login');
            } else if (this.$route.path === '/login' || this.$route.path === '/') {
                if (store.state.App.allowApi.ApiHomeTotal) {
                    this.$router.push('/');
                    return;
                }
                this.$router.push('/blank');
            }
        }
    }

    // @Watch('$store.state.App.initFinish') public watchInitFinish(init: boolean) {
    //     /* init 後若還是未登入, 則轉至登入頁面 */
    //     if (init && !this.isLogin) {
    //         this.$router.replace('/login');
    //     }
    // }

}
</script>

<style lang="scss" scoped>
.app {
    background: #f5f9fc;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
}

.slide-fade-up-enter-active,
.slide-fade-left-enter-active {
    transition: all 300ms ease;
}
.slide-fade-up-leave-active,
.slide-fade-left-leave-active {
    transition: all 300ms ease;
    // transition: all 300ms cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-up-enter,
.slide-fade-up-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-fade-left-enter,
.slide-fade-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.main-container {
    min-width: 1200px;
    height: 100%;
    background: #f5f9fc;
}
</style>
