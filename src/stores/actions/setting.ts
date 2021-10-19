import store from '@/store';
import { MutationTypes } from '../mutation-types.interface';

export default {
    toggleUseMoneyFormat(value: boolean) {
        store.commit(MutationTypes.Setting.ToggleUseMoneyFormat.Key, value);
    },
};
