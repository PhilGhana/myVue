import { Vue, Component } from 'vue-property-decorator';
import { ElForm } from 'element-ui/types/form';
import { NoEmitOnErrorsPlugin, EvalSourceMapDevToolPlugin } from 'webpack';
import { invalid } from 'moment';

interface InvalidError {
    [key: string]: string | string[];
}

export interface ValidatorSetting {
    [key: string]: (resolve: (res: true | string) => void) => void;
}

@Component
export default class FormValidation extends Vue {
    private formValidationData: { [name: string]: any } = {};

    public isInvalid(validator: ValidatorSetting) {
        const result: IAjax.Result = {
            data: null,
            errors: {},
            message: '',
            refresh: null,
        };
        let isInvalid = false;
        const promiseValids = Object.keys(validator).map((key) => {
            const promise = new Promise<true | string>((resolve) => {
                const resPromise = validator[key](resolve);
            });
            promise.then((res) => {
                if (res !== true) {
                    isInvalid = true;
                    result.errors[key] = res;
                }
            });
            return promise;
        });

        return Promise.all(promiseValids).then(() => {
            if (isInvalid) {
                this.setInvalids(result);
                return Promise.reject(result.errors);
            }
            return Promise.resolve(true);
        });
    }

    public clearInvalids() {
        this.$el.querySelectorAll('.fv-invalid-message').forEach((element) => {
            element.remove();
        });

        this.$el.querySelectorAll('.fv-invalid').forEach((element) => {
            element.classList.remove('fv-invalid', 'is-invalid');
        });
    }

    public setInvalids(res: IAjax.Result) {
        this.clearInvalids();
        if (res && res.errors) {
            Object.keys(res.errors).forEach((key) => {
                const inputElement: HTMLElement | null = this.$el.querySelector(`[name='${key}']`);
                if (!inputElement || !res.errors[key]) {
                    return;
                }

                const errDiv = document.createElement('div');
                errDiv.setAttribute('class', 'invalid-feedback fv-invalid-message');
                errDiv.innerText = res.errors[key].toString();

                /* .el-input: element-ui 系列 */
                const parentElement = inputElement.closest('.el-input') || inputElement.parentElement;
                if (parentElement) {
                    parentElement.appendChild(errDiv);
                    if (parentElement.classList.contains('el-input')) {
                        parentElement.classList.add('fv-invalid', 'is-invalid');
                    }
                    inputElement.classList.add('fv-invalid', 'is-invalid');
                }
            });
        }
    }
}
