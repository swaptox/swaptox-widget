



// store.js
class SDKStore extends EventTarget {
    constructor() {
        super();
        // 余额数据
        this.allBalance = {};
		// 余额数据
		this.tokenPrice = {};
        // 语言包
        this.$t = {};
		this.currentLang = '';
		this.langOptionsList = [];
		// 外部格式化价格函数
		this.priceBehalf = {
			'symbol': '$',
			'EXCHANGE_BASE': 10000,//倍率基数
			'exchange': 10000//一万是百分百，一百是百分之一
		};
		
		this.referral = '';
		this.theme = '';//目前只有stxcom-home-showcase在用
		this.chain = '';
		this.account = '';
		this.selectedRoute = undefined;
		this.tokenInData = undefined;
		this.tokenOutData = undefined;
		this.inputAmount = '';
		this.slippag = 0.5;
		this.routes = undefined;
		this.errRoute = undefined;
		/* this.errRoute = { //失败数据 为空则成功
		    "success": false,
		    "code": "NO_ROUTE",
		    "message": "Route not found",
		    "status": 422,
		    "routes": []
		}; */
		
		this.swapHash = {};
		
		this.limitOptionalToken = {};
		
		
		
		this.walletLogo = '';
		
		
    }
	
	updateSwapHash(chain, hash, status) {
		if (!this.swapHash[chain]) {
			this.swapHash[chain] = {};
		}
		this.swapHash[chain][hash] = status;
		this._notify();
	}
	
	
	
	
	setWalletLogo(e){
		this.walletLogo = e;
	}
	setReferral(e){
		this.referral = e;
	}
	
	
	
	
	
	setLimitOptionalToken(e, isNotify=true){
		this.limitOptionalToken = e;
		if(isNotify){
			this._notify(); 
		}
	}
	
	
	setSlippag(e, isNotify=true){
		this.slippag = e;
		if(isNotify){
			this._notify(); 
		}
	}
	setRoutes(e, isNotify=true){
		this.routes = e;
		if(isNotify){
			this._notify(); 
		}
	}
	setErrRoute(e, isNotify=true){
		this.errRoute = e;
		if(isNotify){
			this._notify(); 
		}
	}


	updateChainBalances(chain, balanceObj, isNotify=true) {
		if (!this.allBalance[chain]) {
			this.allBalance[chain] = {};
		}
		this.allBalance[chain] = {
			...this.allBalance[chain],
			...balanceObj
		};
		if(isNotify){
			this._notify(); 
		}
	}

	updateChainTokenPrice(chain, priceObj, isNotify=true) {
		if (!this.tokenPrice[chain]) {
			this.tokenPrice[chain] = {};
		}
		this.tokenPrice[chain] = {
			...this.tokenPrice[chain],
			...priceObj
		};
		if(isNotify){
			this._notify(); 
		}
	}



    // 设置语言
    setLanguage(objLang, langId) {
		this.currentLang = langId;
        this.$t = Object.assign({}, this.$t, objLang);
        this._notify();
    }
	setLangOptionsList(list) {
		this.langOptionsList = list;
    }
	
	
	
	
	
	setAccount(account, isNotify=true){
		this.account = account;
		if(isNotify){
			this._notify(); 
		}
	}
	setSelectedRoute(route, isNotify=true){
		this.selectedRoute = route;
		if(isNotify){
			this._notify(); 
		}
	}
	setSelectedTokenData(data, dtOut, isNotify=true){
		this.tokenInData = data;
		this.tokenOutData = dtOut;
		if(isNotify){
			this._notify(); 
		}
	}
	
	
	
	setTheme(theme){
		this.theme = theme;
		this._notify();
	}
	setChain(chain){
		this.chain = chain;
		this._notify();
	}
	setInputAmount(amount){
		this.inputAmount = amount;
		this._notify();
	}
	
	

    // 通知所有监听的 Lit 组件更新
    _notify() {
        this.dispatchEvent(new CustomEvent('sdk-state-changed'));
    }
}

// 导出单例
export const sdkStore = new SDKStore();