import { Module, MutationTree } from 'vuex';
import { RootStore } from '@/store';
import i18n from '@/i18n';
import { MutationTypes } from '../mutation-types.interface';

export namespace INotifyModule {
    export interface NotifyItem {
        title: string;
        type: 'info' | 'success' | 'warning' | 'error';
        message: string;
    }

    export interface State {
        notifys: NotifyItem[];
    }
}

const mutations: MutationTree<INotifyModule.State> = {
    [MutationTypes.Notify.AddNotify.Key](state, data: MutationTypes.Notify.AddNotify.Data) {
        state.notifys.push({
            type: data.type,
            title: data.title || '',
            message: data.message,
        });
    },

    [MutationTypes.Notify.ClearNofify.Key](state) {
        state.notifys = [];
    },
};

const module: Module<INotifyModule.State, RootStore> = {
    mutations,
    state: {
        notifys: [],
    },
};

export default module;
