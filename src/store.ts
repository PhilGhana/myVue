import Vue from 'vue';
import Vuex from 'vuex';
import AppModule, { IAppModule } from './stores/modules/AppModule';
import SocketModule, { ISocketModule } from './stores/modules/SocketModule';
import NotifyModule, { INotifyModule } from './stores/modules/NotifyModule';
import SettingModule, { ISettingModule } from './stores/modules/SettingModule';

Vue.use(Vuex);

export interface RootStore {
    App: IAppModule.State;
    Socket: ISocketModule.State;
    Notify: INotifyModule.State;
    Setting: ISettingModule.State;
}

export default new Vuex.Store({
    strict: true,
    modules: {
        App: AppModule,
        Socket: SocketModule,
        Notify: NotifyModule,
        Setting: SettingModule,
    },
});
