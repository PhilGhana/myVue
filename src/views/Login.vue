<template>
    <div>
        <div class="row justify-content-center m-0" style="padding-top: 180px" v-if="!isLogin">
            <form @submit.prevent="login" class="col-8 col-sm-6 col-md-4">
                <div class="form-group">
                    <label>{{ 'view.login.account' | t }}</label>
                    <input type="text" name="account" class="form-control" v-model="form.account" />
                </div>
                <div class="form-group">
                    <label>{{ 'view.login.password' | t }}</label>
                    <input type="password" name="password" class="form-control" v-model="form.password" />
                </div>
                <div class="row">
                    <div class="col">
                        <div class="alert alert-danger" v-show="message">{{ message }}</div>
                    </div>
                    <div class="col-auto">
                        <el-button type="primary" :loading="loading" native-type="submit">{{
                            'view.login.login' | t
                        }}</el-button>
                    </div>
                </div>
            </form>
        </div>
        <div v-else style="display: flex; justify-content: center">{{ 'common.index-no-auth' | t }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import actions from '@/stores/actions';
import FormValidation from '@/mixins/FormValidation';
import store from '@/store';

@Component
export default class Login extends Mixins(FormValidation) {
    public loading = false;

    public form = {
        account: '',
        password: '',
    };

    public message = '';

    get isLogin(): boolean {
        return this.$store.getters.isLogin;
    }

    public clone(data: any) {
        return { ...data };
    }

    public login() {
        if (this.loading) {
            return;
        }
        this.message = '';
        this.loading = true;
        this.clearInvalids();
        actions
            .login(this.form.account, this.form.password)
            .catch((res: IAjax.Result) => {
                this.setInvalids(res);
                this.message = res.message || '';
            })
            .finally(() => {
                this.loading = false;
            });
    }
}
</script>
<style lang="scss" scoped>
</style>
