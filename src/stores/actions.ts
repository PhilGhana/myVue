import { ApiPath } from '@/api';
import store from '@/store';
import $ from 'jquery';
import { MutationTypes } from './mutation-types.interface';
import { ActionTypes } from './action-types.interface';
import socket from './actions/socket';
import notify from './actions/notify';
import setting from './actions/setting';
import i18n from '@/i18n';

export interface UploadConfig {
    data: { [key: string]: any };
}

const onRequestError = (res: any, url: string) => {
    const message = (res.responseJSON || { message: res.responseText }).message;
    switch (res.status) {
        case 401:
            actions.logout();
            break;

        case 403:
            actions.notify.error(message + ` [${url}]`);
            break;

        default:
            actions.notify.error(message);
            break;
    }
};

export const Ajax = new (class {
    public post<T = any>(url: string, config?: JQuery.AjaxSettings): Promise<IAjax.Result<T>> {
        const token = store.state.App.user.token;
        const tokenUrl = url.indexOf('?') < 0 ? `${url}?token=${token}` : `${url}&${token}=${token}`;
        return new Promise((resolve, reject) => {
            $.ajax(tokenUrl, {
                ...config,
                type: 'post',
                headers: {
                    'user-token': store.state.App.user.token,
                },
            })
                .then((res: IAjax.Result) => resolve(res))
                .fail((res: any) => {
                    onRequestError(res, url);
                    reject(res.responseJSON);
                });
        });
    }

    public get<T = any>(url: string, config?: JQuery.AjaxSettings): Promise<IAjax.Result<T>> {
        let data = (config && config.data) || {};
        const token = store.state.App.user.token;
        return new Promise((resolve, reject) => {
            if (typeof data === 'object') {
                data.token = token;
                data.t = Math.floor(Date.now() / 1000);
            } else {
                data += `&token=${token}`;
            }
            $.ajax(url, {
                ...config,
                type: 'get',
                data,
                headers: {
                    'user-token': store.state.App.user.token,
                },
            })
                .then((res: IAjax.Result) => resolve(res))
                .fail((res: any) => {
                    onRequestError(res, url);
                    reject(res.responseJSON);
                });
        });
    }

    public upload(url: string, config?: UploadConfig): Promise<IAjax.Result> {
        return new Promise((resolve, reject) => {
            if (config) {
                const formData = new FormData();
                Object.keys(config.data).forEach((key) => {
                    const values = config.data[key];
                    if (Array.isArray(values)) {
                        values.forEach((value) => {
                            formData.append(`${key}[]`, value);
                        });
                    } else {
                        formData.append(key, values);
                    }
                });
                const oReq = new XMLHttpRequest();
                oReq.open('POST', url, true);
                oReq.setRequestHeader('user-token', store.state.App.user.token);
                oReq.onload = (oEvent) => {
                    if (Math.floor(oReq.status / 100) === 2) {
                        resolve(oReq.response);
                    } else {
                        reject(JSON.parse(oReq.response));
                    }
                };

                oReq.send(formData);
            }
        });
    }
})();

const actions = {
    /* socket 相關功能 */
    socket,

    notify,

    setting,

    init() {
        return Ajax.get(ApiPath.ApiPublicInit).then(
            (res) => {
                localStorage.web = res.refresh.web_name;
                localStorage.lowerStock = res.refresh.lower_stock;
                document.title = localStorage.web;
                if (res.refresh.user) {
                    store.commit(MutationTypes.Login.Key, res.refresh.user);
                    this.socket.connect();
                } else {
                    store.commit(MutationTypes.Logout.Key);
                }
            },
            (res: any) => {
                store.commit(MutationTypes.Logout.Key);
            },
        );
    },

    setLocate(locale: string) {
        const data = {
            locale,
        };

        return Ajax.get(ApiPath.ApiPublicLocale, { data }).then(() => {
            i18n.locale = locale;
            store.commit(MutationTypes.Locale.Key, locale);
        });
    },

    login(account: string, password: string) {
        return Ajax.post(ApiPath.ApiPublicLogin, {
            data: {
                account,
                password,
            },
        }).then((res) => {
            store.commit(MutationTypes.Login.Key, res.refresh.user);
            this.init();
            // this.socket.connect();
        });
    },

    logout() {
        socket.disconnect();
        return Ajax.get(ApiPath.ApiPublicLogout).then(() => {
            store.commit(MutationTypes.Logout.Key);
        });
    },
    reloadWallet() {
        if (store.state.App.user.wallet.loading) {
            return Promise.reject('running');
        }
        store.commit(MutationTypes.ReloadWalletStatus.Key, true);
        return Ajax.get(ApiPath.ApiPersonalWallet)
            .then((res) => {
                store.commit(MutationTypes.UpdateWallet.Key, res.data);
            })
            .finally(() => {
                store.commit(MutationTypes.ReloadWalletStatus.Key, false);
            });
    },

    reloadFranchiseeOptions() {
        return Ajax.get(ApiPath.ApiFranchiseeFranchiseeOptions).then((res) => {
            store.commit(MutationTypes.ReloadFranchiseeOption.Key, { options: res.data });
        });
    },

    changeFranchisee(id: number) {
        return new Promise((resolve, reject) => {
            const franchisee = store.state.App.franchiseeOptions.find((o) => o.id === id);
            if (store.state.App.user.isCompany && (franchisee || id === 0)) {
                store.commit(MutationTypes.ChangeFranchisee.Key, { id });
                resolve(id);
            } else {
                reject(`not fond id > ${id}`);
            }
        });
    },

    checkPermission(path: keyof typeof ApiPath): boolean {
        const allowApis = store.state.App.allowApi;
        return allowApis[path];
    },

    /**
     * 更新該頁可用的 APIS
     *
     * @return Promise<any>
     */
    updateAllowApis(path: string) {
        return new Promise((resolve, reject) => {
            store.commit(MutationTypes.ApiGroup.Key, path);
            resolve(path);
        });
    },

    /**
     * 開關審查的提示聲
     */
    switchReviewSounds(data: MutationTypes.SwitchReviewSounds.SoundsType) {
        store.commit(MutationTypes.SwitchReviewSounds.Key, {option: data});
    },
};

export default actions;
