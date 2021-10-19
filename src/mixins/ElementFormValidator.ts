import { Vue, Component } from 'vue-property-decorator';
import { ElForm } from 'element-ui/types/form';
import FormValidation, { ValidatorSetting } from '../mixins/FormValidation';
export interface RuleOption {
    field: string;
    validator: (value: any) => true | string;
    trigger?: 'manual' | 'blur' | 'change' | 'input';
}

@Component
export default class ElementFormValidator extends Vue {
    protected elementFormValidatorData: { [name: string]: any } = {};

    public elFormRules(model: any, customRules: RuleOption[] = [], name = 'form') {
        const rules: { [name: string]: any } = {};

        const ServerSideValidator = ({ field }: any, value: any, callback: (err?: Error) => void) => {
            const errors = this.elementFormValidatorData[name];

            if (errors && field in errors) {
                callback(new Error(errors[field].toString()));
            } else {
                callback();
            }
        };
        Object.keys(model).forEach((field) => {
            const cRule = customRules.find((o) => o.field === field);
            const ruleSetting: any = {
                validator: ServerSideValidator,
                trigger: 'manual',
            };
            if (cRule) {
                ruleSetting.trigger = cRule.trigger || 'manual';
                ruleSetting.validator = (params: any, value: any, callback: (err?: Error) => void) => {
                    const res = cRule.validator(value);
                    if (res !== true) {
                        console.warn(res);
                        callback(new Error(res));
                        return;
                    }
                    ServerSideValidator(params, value, callback);
                };
            }

            rules[field] = ruleSetting;
        });
        return rules;
    }

    public elFormClearInvalids(elForm: ElForm | string) {
        const form: ElForm = typeof elForm === 'string' ? (this.$refs[elForm] as any) : elForm;
        if (form) {
            this.$nextTick(() => {
                form.clearValidate();
            });
        }
    }

    public elFormInvalids(res: IAjax.Result, elForm: ElForm | string, name = 'form') {
        const form: ElForm = typeof elForm === 'string' ? (this.$refs[elForm] as any) : elForm;
        // form.clearValidate();
        if (res.errors) {
            this.elementFormValidatorData[name] = res.errors;
            form.validate();
            this.elementFormValidatorData[name] = null;
        }
    }
}
