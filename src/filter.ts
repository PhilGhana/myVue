import Vue from 'vue';
import i18n from './i18n';
import moment from 'moment';
import store from './store';
import { round, floor } from 'lodash';

/* 翻譯 */
Vue.filter('t', (key: string, values?: any[] | { [key: string]: any }) => {
    return i18n.t(key, values);
});

/* 翻譯 */
Vue.filter('tc', (key: string, choice?: number, values?: any[] | { [key: string]: any }) => {
    return i18n.tc(key, choice, values);
});

/* 日期轉換 */
Vue.filter('time', (value: any, format?: string) => {
    return moment(value).format(format);
});

/* 將數字改為金額格式顯示(每三位數加入「,」) */
const moneyFormat = (value: string | number, dec?: number) => {
    const val = dec === undefined ? value : round(Number(value), dec);
    if (!store.state.Setting.useMoneyFormat) {
        return Number(val) || 0;
    }
    const [a, b = ''] = (val || '0').toString().split('.');
    return a.replace(/(\d)(?=(\d{3})+$)/g, '$1,') + (b ? `.${b}` : '');
};
Vue.filter('money-format', (value: string | number, dec?: number) => moneyFormat(value, dec));

const decimalMark = (value: string | number, num?: number) => {
    const bNum = num === undefined ? 0 : num;
    const val = Number(value);
    let baseNum: number = 0;
    for (let i = 1; i <= bNum; i++) {
        if (baseNum === 0) {
            baseNum = 10;
            continue;
        }
        baseNum = baseNum * 10;
    }
    if (baseNum === 0) {
        return parseInt(val.toString(), 10);
    }
    return parseInt((val * baseNum).toString(), 10) / baseNum;
};
Vue.filter('mf', (value: string | number, dec?: number) => {
    // 無條件捨去
    const dc = dec ? dec : 0;

    const [want, cut = ''] = (Number(value)).toString().split('.');
    let final = want.toString() + cut.toString();
    const cutLength = ((cut.length > dc) ? dc : cut.length);

    const length = want.toString().length + cutLength;
    const dem = Math.pow(10, cutLength);

    final = final.substr(0, length);
    const val = Number(final) / dem;

    if (!store.state.Setting.useMoneyFormat) {
        return Number(val) || 0;
    }
    const [a, b = ''] = (val || '0').toString().split('.');
    return a.replace(/(\d)(?=(\d{3})+$)/g, '$1,') + (b ? `.${b}` : '');
});

Vue.filter('abs', (value: any) => Math.abs(Number(value) || 0));

/* 四捨五入至小數第 {dec} 位 */
Vue.filter('round', (value: number, dec: number = 0) => {
    return round(value, dec);
});

Vue.filter('fixed', (value: number, dec: number = 0) => {
    return round(value, dec).toFixed(dec);
});

Vue.filter('jf', (value: any, replacer: any = null, space: number = 4) => {
    return JSON.stringify(value, replacer, space);
});

Vue.filter('acc_name', (o: any) => {
    if (!o) {
        return 'unkown';
    }
    return o.account + (o.name ? `【${o.name}】` : '');
});
