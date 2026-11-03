// state-mixin.js
import { sdkStore } from './store.js';
export const StoreMixin = (superClass) => class extends superClass {
    connectedCallback() {
        super.connectedCallback();
        this._onStateChange = () => this.requestUpdate();
        sdkStore.addEventListener('sdk-state-changed', this._onStateChange);
    }
    disconnectedCallback() {
        sdkStore.removeEventListener('sdk-state-changed', this._onStateChange);
        super.disconnectedCallback();
    }
};
