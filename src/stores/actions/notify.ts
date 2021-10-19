import store from '@/store';
import { MutationTypes } from '../mutation-types.interface';

export default {
    add(data: MutationTypes.Notify.AddNotify.Data) {
        store.commit(MutationTypes.Notify.AddNotify.Key, data);
    },

    info(message: string, title?: string) {
        this.add({ type: 'info', message, title });
    },

    success(message: string, title?: string) {
        this.add({ type: 'success', message, title });
    },

    warning(message: string, title?: string) {
        this.add({ type: 'warning', message, title });
    },

    error(message: string, title?: string) {
        this.add({ type: 'error', message, title });
    },

    clear() {
        store.commit(MutationTypes.Notify.ClearNofify.Key);
    },
};
