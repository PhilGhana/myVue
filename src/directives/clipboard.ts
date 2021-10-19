import Vue from 'vue';
import ClipboardJS from 'clipboard';
import $ from 'jquery';
import 'bootstrap';
import { DirectiveBinding } from 'vue/types/options';

interface InputData {
    value: string;
    title: string;
    tooltip: boolean;
    placement: 'left' | 'top' | 'right' | 'bottom';
}

let autoincrement = 1;
const cache: { [id: number]: ClipboardJS } = {};

const unBindCopyAction = (el: Element) => {
    const id = Number(el.getAttribute('data-copy-id'));
    if (id && cache[id]) {
        cache[id].destroy();
        // $(el).tooltip('dispose');
    }
};

const bindCopyAction = (el: Element, binding: DirectiveBinding) => {
    unBindCopyAction(el);

    const data: InputData = typeof binding.value === 'string' ? { value: binding.value } : binding.value;

    const id = autoincrement++;
    const value = data.value;
    const tooltip = data.tooltip || true;
    const title = data.title || `「${value}」 Copied`;
    const placement = data.placement || 'bottom';

    const $el = $(el);

    $el.attr('data-copy-id', id);
    $el.css({ cursor: 'pointer' });
    $el.attr('data-clipboard-text', value);

    const cbjs = new ClipboardJS($el.get(0));
    cache[id] = cbjs;
    // if (tooltip) {
    //     $el.attr('data-original-title', title);
    //     $el.attr('data-placement', placement);
    //     $el.tooltip({
    //         trigger: 'manual',
    //     });
    //     cache[id].on('success', () => {
    //         $el.tooltip('show');
    //         setTimeout(() => $el.tooltip('hide'), 15000);
    //     });
    // }
};

Vue.directive('copy', {
    update(el, binding) {
        bindCopyAction(el, binding);
    },
    bind(el, binding, vnode) {
        bindCopyAction(el, binding);
    },
    unbind(el) {
        unBindCopyAction(el);
    },
});
