import { Vue, Component } from 'vue-property-decorator';
import { inArray } from '@/utils/helper';
import { isNumber } from 'util';

type MatchType = 'empty' | 'null' | 'number' | 'integer' | 'float' | 'unsigned';

const setValue = (vmodel: Vue, path: string, value: any) => {
    const paths = path.split('.');
    const lastKey: string = paths.pop() || '';
    const data = paths.reduce((o: any, key: string) => o[key], vmodel);
    vmodel.$set(data, lastKey, value);
};

@Component
export default class WatchValid extends Vue {
    public watchValid(
        keypath: string,
        RegOrTypes: RegExp | MatchType[],
        cb: (value: any, invalid: boolean) => any = (v: any) => v,
    ) {
        const types = Array.isArray(RegOrTypes) ? RegOrTypes : [];
        const regexp: RegExp | null = Array.isArray(RegOrTypes) ? null : RegOrTypes;
        const allowEmpty = inArray(types, 'empty');
        const allowNull = inArray(types, 'null');
        const allowInteger = inArray(types, 'integer');
        const allowFloat = inArray(types, 'float');
        const allowNumber = inArray(types, 'number') || allowFloat || allowInteger;
        const unsigned = inArray(types, 'unsigned');

        this.$watch(keypath, (val: any, old: any) => {
            const value = ('' + val).toString();
            let invalid = false;

            if (regexp) {
                invalid = !('' + value).toString().match(regexp);
            } else {
                const num = Number(value);
                const isInteger = num === Math.floor(num);
                invalid = value === '' && !allowEmpty;
                invalid = invalid || ((value === undefined || value === null) && !allowNull);
                invalid = invalid || (allowNumber && isNaN(num));
                invalid = invalid || (unsigned && !isInteger);
                invalid = invalid || (isNumber && value !== value.trim());
            }

            const result = cb(invalid ? old : value, invalid);
            if (result !== value) {
                setValue(this, keypath, result);
            }
        });
    }
}
