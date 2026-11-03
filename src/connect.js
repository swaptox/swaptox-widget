





export const swaptoxConnect = async () => {
	const connect = window.$swaptoxConnect;
    if (!connect) return;
	
	connect.on('connect', function(event){
		const account = event.accounts?.[0];
		window.$swaptoxWidget.setWalletLogo(event?.info?.icon);//该设置不更新DOM，必须放在前面
		window.$swaptoxWidget.setUserAddress(account);
	});
	connect.on('disconnect', function(event){
		window.$swaptoxWidget.setWalletLogo('');
		window.$swaptoxWidget.setUserAddress('');
	});
	connect.on('accountsChanged', function(event){
		const account = event?.[0];
		window.$swaptoxWidget.setUserAddress(account);
	});
	
	
	await connect.autoConnect();//检查是否已经连接
};

