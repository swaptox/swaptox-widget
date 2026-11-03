import { html } from 'lit';
export const selectIcon = ()=>{
	
	
	return html`
	<svg t="1792424142236" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39633" width="16" height="16"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" 
	fill="#50AE55" p-id="39634" data-spm-anchor-id="a313x.manage_type_myprojects.0.i10.50ae3a81hvU2Kz" class="selected"></path><path d="M790.016 310.784c-5.632-7.168-15.872-7.68-23.04-2.048l-309.248 268.288c-5.12 4.608-12.8 5.12-18.944 1.536L257.024 465.92c-7.168-4.608-16.896-2.56-22.016 5.12l-20.992 31.744c-4.608 7.168-3.072 16.384 3.072 22.016l226.816 196.608c6.656 5.632 16.384 5.12 22.016-1.024l340.992-366.08c5.632-6.144 6.144-15.872 0.512-22.016l-17.408-21.504z" fill="#FFFFFF" p-id="39635" data-spm-anchor-id="a313x.manage_type_myprojects.0.i11.50ae3a81hvU2Kz" class=""></path></svg>
	`;
	
	/*
	return html`
		<svg t="1792361806088" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12535" width="16" height="16"><path d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 86.893714a425.179429 425.179429 0 0 0 0 850.212572A425.179429 425.179429 0 0 0 512 86.893714z m213.723429 243.419429c7.387429 0 11.702857 8.411429 7.314285 14.482286l-240.64 333.750857a36.352 36.352 0 0 1-59.172571 0l-142.336-197.485715a9.142857 9.142857 0 0 1 7.387428-14.555428h53.613715a36.571429 36.571429 0 0 1 29.622857 15.213714L462.848 594.651429l179.638857-249.197715a36.425143 36.425143 0 0 1 29.622857-15.140571z" 
		fill="#02b6a6" fill-opacity=".65" p-id="12536" data-spm-anchor-id="a313x.search_index.0.i14.308b3a81PtIm8D" class=""></path></svg>
	`;*/
};



export const allChainsLogo = (data)=>{

	
	/* background-color: var(--stxui-chain-select-all-chains-logo-background);
			border: 1px solid var(--stxui-chain-select-all-chains-logo-border); */
	if(data.length===1){
		return html`
			<stx-token-logo
				size="22px"
				.symbol="${data[0].name}" 
				.logo="${data[0].logo}"
			></stx-token-logo>
		`;
	}else if(data.length===2){
		return html`
			<div style="position: relative;border-radius: 8px;width: 22px;height: 22px;
			display: flex;align-items: center;justify-content: center;">
				
				<div style="position: absolute;top:0px;left:0px;z-index: 2;">
					<stx-token-logo
						size="15px"
						.symbol="${data[0].name}" 
						.logo="${data[0].logo}"
					></stx-token-logo>
				</div>
				<div style="position: absolute;bottom:0px;right:0px;z-index: 1;">
					<stx-token-logo
						size="11px"
						.symbol="${data[1].name}" 
						.logo="${data[1].logo}"
					></stx-token-logo>
				</div>
			</div>
		`;
	}else if(data.length===3){
		return html`
			<div style="position: relative;border-radius: 8px;width: 22px;height: 22px;
			display: flex;align-items: center;justify-content: center;">
				
				<div style="position: absolute;top:1px;left:5px;z-index: 2;">
					<stx-token-logo
						size="12px"
						.symbol="${data[0].name}" 
						.logo="${data[0].logo}"
					></stx-token-logo>
				</div>
				<div style="position: absolute;bottom:0px;right:0px;z-index: 1;">
					<stx-token-logo
						size="11px"
						.symbol="${data[1].name}" 
						.logo="${data[1].logo}"
					></stx-token-logo>
				</div>
				<div style="position: absolute;bottom:0px;left:0px;z-index: 1;">
					<stx-token-logo
						size="11px"
						.symbol="${data[2].name}" 
						.logo="${data[2].logo}"
					></stx-token-logo>
				</div>
			</div>
		`;
	}else if(data.length===4){
		return html`
			<div style="position: relative;border-radius: 8px;width: 22px;height: 22px;
			display: flex;align-items: center;justify-content: center;">
				
				<div style="position: absolute;top:0px;left:0px;z-index: 2;">
					<stx-token-logo
						size="11px"
						.symbol="${data[0].name}" 
						.logo="${data[0].logo}"
					></stx-token-logo>
				</div>
				<div style="position: absolute;top:0px;right:0px;z-index: 1;">
					<stx-token-logo
						size="11px"
						.symbol="${data[1].name}" 
						.logo="${data[1].logo}"
					></stx-token-logo>
				</div>
				
				<div style="position: absolute;bottom:0px;right:0px;z-index: 1;">
					<stx-token-logo
						size="11px"
						.symbol="${data[2].name}" 
						.logo="${data[2].logo}"
					></stx-token-logo>
				</div>
				<div style="position: absolute;bottom:0px;left:0px;z-index: 1;">
					<stx-token-logo
						size="11px"
						.symbol="${data[3].name}" 
						.logo="${data[3].logo}"
					></stx-token-logo>
				</div>
			</div>
		`;
	}
	
	
	
	
	return html`
		<div style="width: 22px;height: 22px;"></div>
	`;
};


