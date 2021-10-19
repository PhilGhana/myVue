export const isNatural = (value: any) => {
    const num = Math.floor(value);
    return value + '' === num.toString() && num >= 0;
};

/*
 * 加法函數，用來得到精確的加法結果
 * 說明：javascript的加法結果會有誤差，在兩個浮點數相加的時候會比較明顯。這個函數返回較為精確的加法結果。
 * 調用：accAdd(arg1,arg2)
 * 返回值：arg1加上arg2的精確結果
 */
export const accAdd = (arg1: number, arg2: number) => {
    let r1;
    let r2;
    let m;
    let c;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        const cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace('.', ''));
            arg2 = Number(arg2.toString().replace('.', '')) * cm;
        } else {
            arg1 = Number(arg1.toString().replace('.', '')) * cm;
            arg2 = Number(arg2.toString().replace('.', ''));
        }
    } else {
        arg1 = Number(arg1.toString().replace('.', ''));
        arg2 = Number(arg2.toString().replace('.', ''));
    }
    return (arg1 + arg2) / m;
};

/*
 * 減法函數，用來得到精確的減法結果
 * 說明：javascript的減法結果會有誤差，在兩個浮點數相減的時候會比較明顯。這個函數返回較為精確的減法結果。
 * 調用：accSub(arg1,arg2)
 * 返回值：arg1加上arg2的精確結果
 */
export const accSub = (arg1: number, arg2: number) => {
    let r1;
    let r2;
    let m;
    let n;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); // 動態控制精度長度
    n = r1 >= r2 ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
};
