import Vue from 'vue';
export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const inArray = (arr: any[], target: any) => arr.indexOf(target) >= 0;

export const inEnum = (enums: object, target: any) => Object.values(enums).indexOf(target) >= 0;


export const watchOnce = (vm: Vue, key: string, cb: (value: any) => void) => {
    const unwatch = vm.$watch(key, (value: any) => {
        cb(value);
        unwatch();
    });
};
