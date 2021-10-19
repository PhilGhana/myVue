import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import i18n, { prefixTransaction } from './i18n';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './filter';
import './directives';
import './common-component';
import actions from './stores/actions';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/scss/main.scss';
import '@/assets/material-icons/icon.scss';
import config from './config';

Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.config.devtools = true;
console.log(config.Locale);
// actions.setLocate(process.env.VUE_APP_I18N_LOCALE || 'en');
actions.setLocate(config.Locale || 'en');

/** 有開啟 session 模式時，載入要檢查是否已登入 */
if (config.SESSION_MODE) {
    router.beforeEach((to, from, next) => {

        /* 未執行過第一次的 init 時 */
        if (!store.state.App.initFinish) {
            actions.init().finally(() => {
                Vue.nextTick(() => next());
            });
        } else {
            next();
        }
    });
}

router.beforeEach((to, from, next) => {
    // 驗證頁面權限
    const findPage = store.state.App.views.find((v) => {
        return v.type === 1 && v.path === to.path;
    });

    if (findPage === undefined) {
        const check = new RegExp(from.path + '/.*');

        if (store.state.App.user.id === 0) {
            // 排除登入頁面
        } else if ((from.path === '/report/total-report/member'
            && to.path === '/report/total-report/bets')
            || (from.path === '/report/total-report/bets'
                && to.path === '/report/total-report/member')) {
            // 遊戲報表的會員層，新增特例可以看細項
        } else if ((from.path === '/report/quest-reward/agent' || from.path === '/report/quest-reward/member')
            && (to.path === '/report/quest-reward/member' || to.path === '/report/quest-reward/agent')) {
            // 優惠活動報表，新增特例可以看細項
        } else if (to.path === '/blank' || to.path === '/') {
            // 空白頁面 隨便吃一頁的權限就可以拿到審核通知了
            actions.updateAllowApis(store.state.App.views[0].path).finally(() => {
                next();
            });
            return;
        } else if (!check.test(to.path)) {
            // 檢查是否為子頁面
            const pt = prefixTransaction('common');
            actions.notify.error(pt('api-disabled'));
            console.error(from.path, to.path);
            return false;
        }
    }

    actions.updateAllowApis(to.path).finally(() => {
        next();
    });
});

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
}).$mount('#app');
