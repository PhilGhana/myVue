import { Module, MutationTree } from 'vuex';
import { RootStore } from '@/store';
import i18n from '@/i18n';
import { MutationTypes } from '../mutation-types.interface';

export namespace ISettingModule {

    export interface State {
        useMoneyFormat: boolean;
    }
}

const mutations: MutationTree<ISettingModule.State> = {
    [MutationTypes.Setting.ToggleUseMoneyFormat.Key](state, data: MutationTypes.Setting.ToggleUseMoneyFormat.Data) {
        state.useMoneyFormat = data;
    },

};

const module: Module<ISettingModule.State, RootStore> = {
    mutations,
    state: {
        useMoneyFormat: true,
    },
};

export default module;
