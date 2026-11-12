import './stx-ui.js';
import './timing/index.js';

import { swaptoxConnect } from './connect.js';
import { viemUtils } from './js_sdk/viem/utils.js';
import { $app } from './js_sdk/index.js';
import { networkData, defaultChain } from './data/network-data.js';
import { sdkInfo } from './data/sdk-config.js';
import { languagePack, defaultLang, currentLang, langOptionsList } from './data/locale/locales.js';
import { themePack, defaultTheme } from './data/theme/themes.js';
import { sdkStore } from './data/store/store.js';
import { getTokens } from './api/cloud/getTokens.js';

import './swaptox/swaptox-theme-choose/swaptox-theme-choose';
import './swaptox/swaptox-routes-choose/swaptox-routes-choose';
import './swaptox/swaptox-logo/swaptox-logo';
import './swaptox/swaptox-logo-name/swaptox-logo-name';
import './swaptox/swaptox-account-button/swaptox-account-button';
import './swaptox/swaptox-chain-choose/swaptox-chain-choose';
import './swaptox/swaptox-lang-choose/swaptox-lang-choose';
import './swaptox/swaptox-wallet/swaptox-wallet';




for (const network of Object.keys(networkData)) {
	try {
		getTokens(network);
	} catch (err) {}
}



const _formatLanguagePack = function(customPack){
	const newPack = {};
	for (let key in customPack) {
		newPack[key] = Object.assign({...languagePack[customPack[key].fallback]}, customPack[key].data);
	}
	return newPack;
};
const _formatThemePack = function(customPack){
	const newPack = {};
	for (let key in customPack) {
		newPack[key] = Object.assign({...themePack[customPack[key].fallback]}, customPack[key].data);
	}
	return newPack;
};
const _initThemePack = function(themeVariables){
	if(!themeVariables){
		return themePack;
	}
	for (let key in themePack) {
		for (let newKey in themeVariables) {
			themePack[key][newKey] = themeVariables[newKey];
		}
	}console.log(themePack, themeVariables);
	return themePack;
};


export const $appUtil = $app;

export class SwaptoX {
	constructor(event) {
		this.$el = null;
		
		this._onRoutesCb = null;
		this._onLoadingCb = null;
		this._onConnectWalletCb = null;
		this._onChooseRouteCb = null;
		this._onApproveCb = null;
		this._onSwapCb = null;
		this._onPermitCb = null;
		this._handlers = new Map();
		this._eventListeners = new Map();
		
		this.isUpdateHtmlLang = false;
		this.init(event);
	}

	init(config = {}) {
		// 创建组件实例
		this.$el = document.createElement('swaptox-widget');
		
		// 设置主题
		this.themePack = _initThemePack(config.themeVariables);
		if($app.test.object(config.themePack)){
			this.themePack = $app.deepMerge(this.themePack, _formatThemePack(config.themePack));
		}
		//设置主题使用覆盖形式，避免新的主题包变量不全。
		let newTheme = this.themePack[defaultTheme];
		if(config.theme&&this.themePack[config.theme]){
			newTheme = Object.assign({}, newTheme, this.themePack[config.theme]);
			sdkStore.setTheme(config.theme);
		}else{
			sdkStore.setTheme(defaultTheme);
		}
		$app.htmlProperty(newTheme);
		
		
		// 设置语言
		this.isUpdateHtmlLang = config.isUpdateHtmlLang?true:false;
		this.languagePack = languagePack;
		if($app.test.object(config.languagePack)){
			this.languagePack = $app.deepMerge(this.languagePack, _formatLanguagePack(config.languagePack));
		}
		//设置语言使用覆盖形式，避免新的语言包变量不全。先设置默认语言，在覆盖环境语言，最后用户设置语言也是覆盖规则
		let langId = currentLang;
		let newLanguage = Object.assign({}, this.languagePack[defaultLang], this.languagePack[currentLang]);
		if(config.lang&&this.languagePack[config.lang]){
			langId = config.lang;
			newLanguage = Object.assign({}, newLanguage, this.languagePack[config.lang]);
		}
		sdkStore.setLanguage(newLanguage, langId);
		if(this.isUpdateHtmlLang){
			$app.updateDocumentLang(langId);
		}
		if($app.test.array(config.langOptionsList)){
			sdkStore.setLangOptionsList(config.langOptionsList);
		}else{
			sdkStore.setLangOptionsList(langOptionsList);
		}
		
		
		
		this.$el.userAddress = config.userAddress || '';
		
		
		let currentlyChain = $app.getStorageSync('currently-selected-chain');
		if(config.chain&&networkData[config.chain]){
			currentlyChain = config.chain;
		}else{
			currentlyChain = currentlyChain?currentlyChain:defaultChain;
		}
		this.$el.chain = currentlyChain;
		sdkStore.setChain(currentlyChain);
		
		
		// 监听组件内部抛出的自定义事件
		const connectWalletHandler = (e) => {
			if (this._onConnectWalletCb) this._onConnectWalletCb(e.detail);
			this.emit('connect', e.detail);
		};
		this._handlers.set('connect-wallet', connectWalletHandler);
		this.$el.addEventListener('connect-wallet', connectWalletHandler);
		
		
		
		const routesHandler = (e) => {
			if (this._onRoutesCb) this._onRoutesCb(e.detail);
			this.emit('routes', e.detail);
		};
		this._handlers.set('routes', routesHandler);
		this.$el.addEventListener('routes', routesHandler);
		
		
		const loadingHandler = (e) => {
			if (this._onLoadingCb) this._onLoadingCb(e.detail);
			this.emit('loading', e.detail);
		};
		this._handlers.set('loading', loadingHandler);
		this.$el.addEventListener('loading', loadingHandler);
		
		
		const chooseRouteHandler = (e) => {
			if (this._onChooseRouteCb) this._onChooseRouteCb(e.detail);
			this.emit('choose-route', e.detail);
		};
		this._handlers.set('choose-route', chooseRouteHandler);
		this.$el.addEventListener('choose-route', chooseRouteHandler);
		
		
		
		if(config.referral){
			this.setReferral(config.referral);
		}else{
			this.setReferral(networkData[currentlyChain].zeroAddress);
		}
		
		//设置可选代币列表
		if(config.limitOptionalToken&&$app.test.object(config.limitOptionalToken)){
			this.setLimitOptionalToken(config.limitOptionalToken);
		}
		
		
		
		if(config.disabledMiniPriceCard){
			this.setDisabledMiniPriceCard(true);
		}
		if(config.slippagLayout){
			this.setSlippagLayout(config.slippagLayout);
		}
		if([true, false].indexOf(config.swapButton) !== -1){
			this.setSwapButton(config.swapButton);
		}
		if(config.disabledHistoryIcon){
			this.setDisabledHistoryIcon(config.disabledHistoryIcon);
		}
		if(config.disabledCustomRecipient){
			this.setDisabledCustomRecipient(config.disabledCustomRecipient);
		}
		if(config.disabledChooseRoute){
			this.setDisabledChooseRoute(config.disabledChooseRoute);
		}
		if(config.smallScreenCardFull){
			this.setSmallScreenCardFull(config.smallScreenCardFull);
		}
		
		
		
		

		
		// 获取目标容器
		let targetContainer = null;
		
		if (typeof config.container === 'string') {
		    targetContainer = document.querySelector(config.container);
		} else if (config.container instanceof HTMLElement) {
		    targetContainer = config.container;
		}
		
		// 只有找到有效的容器才挂载
		if (targetContainer) {
		    targetContainer.appendChild(this.$el);
		} else if (config.container) {
		    console.warn(`[SDK] The specified container was not found: ${config.container}`);
		}
		
		/**/$app.safeSet(window, 'swaptox.widget', {
			$el: {
				swap: this.$el
			},
			name: sdkInfo.name,
			version: sdkInfo.version
		});
		$app.safeSet(window, '$swaptoxWidget', this);
		//console.log(sdkInfo.name, sdkInfo.version);
		swaptoxConnect();
		window.dispatchEvent(new CustomEvent('swaptox-widget-ready', {detail: window.$swaptoxWidget}));
	}
	
	

	setWalletLogo(url) {
		sdkStore.setWalletLogo(url);
	}
	setUserAddress(addr) {
		const account = addr?addr:'';
		if(account&&!viemUtils.isAddress(account)){
			console.error('Account Not a valid address');
			return;
		}
		this.$el.userAddress = account;
		sdkStore.setAccount(account);
	}
	setChain(chain) {
		if(!networkData[chain]){
			console.error('Unsupported chain');
			return;
		}
		$app.setStorageSync('currently-selected-chain', chain);
		this.$el.chain = chain;
		sdkStore.setRoutes(undefined, false);
		sdkStore.setErrRoute(undefined, false);
		sdkStore.setChain(chain);
		getTokens(chain, false);//预加载代币列表
	}
	getChains() {
		const chainArr = [];
		for (var key in networkData) {
			chainArr.push(key);
		}
		return chainArr;
	}
	getChain() {
		return this.$el.chain;
	}
	
	
	//设置语言
	setLang(lang) {
		const langKey = this.languagePack[lang]?lang:defaultLang;
		sdkStore.setLanguage(this.languagePack[langKey], langKey);
		if(this.isUpdateHtmlLang){
			$app.updateDocumentLang(langKey);
		}
		return langKey;
	}
	getLangPack() {
		return this.languagePack;
	}
	

	//设置主题
	setTheme(theme) {
		const themeKey = this.themePack[theme]?theme:defaultTheme;
		$app.htmlProperty(this.themePack[themeKey]);
		sdkStore.setTheme(themeKey);
		return themeKey;
	}
	getThemePack() {
		return this.themePack;
	}

	
	//设置路由
	setRoute(data) {
		this.$el._setSelectedRoute(data);
	}

	
	//设置可选代币列表
	setLimitOptionalToken(data){
		sdkStore.setLimitOptionalToken(data);
	}
	
	//设置邀请地址
	setReferral(referral){
		if(!viemUtils.isAddress(referral)){
			console.error('referral Not a valid address');
			return;
		}
		sdkStore.setReferral(referral);
	}
	
	
	
	//禁用迷你卡片
	setDisabledMiniPriceCard(disabled) {
		this.$el.disabledMiniPriceCard = disabled;
	}
	//滑点布局
	setSlippagLayout(e){
		const layout = e==='top'?'top':'bottom';
		this.$el.slippaglayout = layout;
	}
	
	
	//
	setSwapButton(e){
		this.$el.swapbutton = e?true:false;
	}
	
	setDisabledHistoryIcon(e){
		this.$el.disabledHistoryIcon = e?true:false;
	}
	
	setDisabledCustomRecipient(e){
		this.$el.disabledCustomRecipient = e?true:false;
	}
	
	setDisabledChooseRoute(e){
		this.$el.disabledChooseRoute = e?true:false;
	}
	
	
	setSmallScreenCardFull(e){
		this.$el.smallScreenCardFull = e?true:false;
		sdkStore.setSmallScreenCardFull(e?true:false);
	}
	
	
	
	
	
	onConnectWallet(callback) {
		this._onConnectWalletCb = callback;
	}
	onRoutes(callback) {
		this._onRoutesCb = callback;
	}
	onLoading(callback) {
		this._onLoadingCb = callback;
	}
	onChooseRoute(callback) {
		this._onChooseRouteCb = callback;
	}
	
	
	
	
	
	
	
	
	onApprove(callback) {
		this._onApproveCb = callback;
	}
	emitApprove(data) {
		if (this._onApproveCb) this._onApproveCb(data);
		this.emit('approve', data);
	}
	
	
	onSwap(callback) {
		this._onSwapCb = callback;
	}
	emitSwap(data) {
		if (this._onSwapCb) this._onSwapCb(data);
		this.emit('swap', data);
	}
	
	onPermit(callback) {
		this._onPermitCb = callback;
	}
	emitPermit(data) {
		if (this._onPermitCb) this._onPermitCb(data);
		this.emit('permit', data);
	}

	// 通用事件监听：同一事件可以注册多个不同的回调。
	on(eventName, callback) {
		if ((typeof eventName !== 'string' && typeof eventName !== 'symbol') || typeof callback !== 'function') {
			throw new TypeError('on(eventName, callback) requires an event name and a callback function');
		}

		let listeners = this._eventListeners.get(eventName);
		if (!listeners) {
			listeners = new Set();
			this._eventListeners.set(eventName, listeners);
		}
		listeners.add(callback);
		return this;
	}

	// 移除指定回调；省略 callback 时移除该事件的全部回调，省略 eventName 时移除全部事件。
	off(eventName, callback) {
		if (eventName === undefined) {
			this._eventListeners.clear();
			return this;
		}

		const listeners = this._eventListeners.get(eventName);
		if (!listeners) return this;

		if (callback === undefined) {
			this._eventListeners.delete(eventName);
		} else {
			listeners.delete(callback);
			if (listeners.size === 0) this._eventListeners.delete(eventName);
		}
		return this;
	}

	// 通用事件触发。原有的 emitSwap/emitApprove/emitPermit 也会转发到这里。
	emit(eventName, ...args) {
		const listeners = this._eventListeners.get(eventName);
		if (!listeners || listeners.size === 0) return false;

		// 使用快照，允许监听函数在触发过程中增删监听。
		for (const callback of [...listeners]) {
			callback.apply(this, args);
		}
		return true;
	}
	
	
	
	
	
	
	
	//connect.on('connect', callback);
	//connect.off('connect', callback);
	
	
	
	
	
	
	
	
	// --- 【销毁方法】 ---
	destroy() {
		if (!this.$el) return;

		// 1. 移除所有事件监听
		for (const [event, handler] of this._handlers) {
			this.$el.removeEventListener(event, handler);
		}
		this._handlers.clear();
		this._eventListeners.clear();

		// 2. 从父元素中移除自己
		if (this.$el.parentNode) {
			this.$el.parentNode.removeChild(this.$el);
		}else{
			this.$el?.remove()
		}

		
		this.$el = null;
		this._onConnectWalletCb = null;
		this._onChooseRouteCb = null;
		this._onRoutesCb = null;
		this._onLoadingCb = null;
		this._onApproveCb = null;
		this._onSwapCb = null;
		this._onPermitCb = null;
		
		window.$swaptoxWidget = null;
		window.dispatchEvent(new CustomEvent('swaptox-widget-destroy'));
		console.log(sdkInfo.name, 'Destroyed');
	}
};

export function createWidget(config) {
	return new SwaptoX(config);
}
