<template>
    <div class="d-none"></div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import store from '../store';
import actions from '../stores/actions';
import { prefixTransaction } from '../i18n';

const pt = prefixTransaction('component.notify');
@Component
export default class Notify extends Vue {
    get notifys() {
        return store.state.Notify.notifys;
    }

    @Watch('notifys') public watchNotifys() {
        const notifys = this.notifys;
        if (notifys.length === 0) {
            return;
        }
        this.clearNotifys();

        notifys.forEach(({ type, message, title }) => {
            const data = {
                dangerouslyUseHTMLString: true,
                message: `<div>${message}</div>`,
                title: pt(`title.${type}`),
                // duration: 0,
            };
            switch (type) {
                case 'info':
                    this.$notify.info(data);
                    break;
                case 'success':
                    this.$notify.success(data);
                    break;
                case 'warning':
                    this.$notify.warning(data);
                    break;
                case 'error':
                    this.$notify.error(data);
                    break;
            }
        });
    }

    public clearNotifys() {
        actions.notify.clear();
    }
}
</script>
