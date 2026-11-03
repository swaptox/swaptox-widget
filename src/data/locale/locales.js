

export const supported = ['en', 'zh-Hans', 'zh-Hant', 'ja', 'ko', 'th', 'pt-BR', 'id', 'vi'];
export const defaultLang = 'en';



export const langOptionsList = [
	{
		'id': 'en',//id才是标符
		'name': 'English',
		'symbol': 'en-US',
	},
	{
		'id': 'ja',
		'name': '日本語',
		'symbol': 'ja-JP',
	},
	{
		'id': 'ko',
		'name': '한국어',
		'symbol': 'ko-KR',
	},
	{
		'id': 'zh-Hans',
		'name': '简体中文',
		'symbol': 'zh-Hans',
	},
	{
		'id': 'zh-Hant',
		'name': '繁體中文',
		'symbol': 'zh-Hant',
	},
	{
		'id': 'th',
		'name': 'ไทย',
		'symbol': 'th-TH',
	},
	{
		'id': 'pt-BR',
		'name': 'Português (Brasil)',
		'symbol': 'pt-BR',
	},
	{
		'id': 'id',
		'name': 'Bahasa Indonesia',
		'symbol': 'id-ID',
	},
	{
		'id': 'vi',
		'name': 'Tiếng Việt',
		'symbol': 'vi-VN',
	},
];



function detectLang() {
	const nav = window.navigator;
	let lang =
		(nav.languages && nav.languages[0]) ||
		nav.language ||
		nav.userLanguage ||
		defaultLang;

	const normalizedLang = lang.toLowerCase();
	const exactMatch = supported.find(item => item.toLowerCase() === normalizedLang);
	if (exactMatch) {
		return exactMatch;
	}

	// 只取主语言；葡萄牙语默认使用巴西葡萄牙语包。
	const primaryLang = normalizedLang.split('-')[0];
	if (primaryLang === 'pt' && supported.includes('pt-BR')) {
		return 'pt-BR';
	}
	return supported.find(item => item.toLowerCase() === primaryLang) || defaultLang;
}


//console.log(detectLang());
export const currentLang = detectLang();



export const languagePack = {
	'en': {
		'swap': 'Swap',
		'connect-wallet': 'Connect Wallet',
		'you-pay': 'You pay',
		'you-receive': 'You receive',
		'input-amount': 'Input Amount',
		'output-amount': 'Output Amount',
		'slippage-tolerance': 'Slippage tolerance',
		'slippage-tolerance-min-tips': 'Slippage below 0.1% may result in a failed transaction.',
		'slippage-tolerance-max-tips': 'Slippage tolerance above 1% could lead to an unfavorable rate.',
		'custom': 'Custom',
		'slippage-set': 'Slip point settings',
		'confirm': 'Confirm',
		'best-route': 'Best Route',
		'swap-route': 'Swap Route',
		'fee': 'Fee',
		'free': 'Free',
		'search-name-or-address': 'Search by name or paste address',
		'click-fix-token': 'Click 📌 to pin the token',
		'clear-input': 'Clear input',
		'no-data-found': 'No data found',
		'no-more-data-available': 'No more data available',
		'loading': 'Loading',
		'loading-failed': 'Loading failed',
		'retry': 'Retry',
		'click-load-more': 'Click to load more',
		'click-load': 'Click to load',
		'load-more': 'Load more',
		'copied': 'Copied',
		
		'route-not-found': 'Route not found~',
		'NO_ROUTE': 'Route not found',
		
		'insufficient-balance': 'Insufficient {{symbol}} balance',
		'confirm-swap-details': 'Confirm Swap Details',
		'confirm-swap': 'Confirm Swap',
		
		'minimum-received': 'Minimum Received',
		'swap-fee': 'Swap fee',
		'network-cost': 'Network Cost',
		'contract-address': 'Contract Address',
		
		
		'recipient': 'Recipient',
		'set-recipient-address': 'Set Recipient Address',
		'confirm-recipient-address': 'Confirm Recipient Address',
		'please-enter-recipient-address': 'Please Enter Recipient Address',
		'clear-history': 'Clear History',
		'please-enter-a-valid-address': 'Please enter a valid address',
		'confirm-close': 'Confirm Close',
		'continue-swap': 'Continue Swap',
		'confirm-close-swap': 'Are you sure you want to cancel the transaction?',
		'in-progress-approve': 'in progress Approve',
		'already-approve': 'already Approve',
		
		
		'my-wallet': 'My Wallet',
		'wallet': 'Wallet',
		'cancel': 'Cancel',
		
		'insufficient-liquidity': 'Insufficient liquidity',
		
		
		
		
		'pending-approve': 'Pending Approve',
		'approve-token-wallet': 'Approve {{symbol}} in the wallet',
		'sign-transaction': 'Sign Transaction',
		'sign-transaction-wallet': 'Sign transaction in the wallet.',
		'approve': 'Approve',
		'transaction-sent': 'Transaction Sent',
		'view-transaction-explorer': 'View Transaction in Explorer',
		'close': 'Close',
		'approve-amount': 'Approve Amount',
		'approve-swap-amount': 'Approve only this swap amount',
		'one-time-approval': 'One-time approval',
		'unlimited': 'Unlimited',
		'recommend': 'Recommend',
		'need-approve-again-swaps': 'No need to approve again for future {{symbol}} swaps',
		'unlimited-approval': 'Unlimited approval',
		
		
		
		'quote-expired': 'Quote expired',
		'please-get-a-new-quote': 'Please get a new quote',
		'refresh-quote': 'Refresh quote',
		'transaction-may-fail': 'Transaction may fail',
		'force-send': 'Force send',
		
		'swap-status': 'Swap Status',
		'swap-history': 'Swap History',
		'all-chains': 'All Chains',
		'transaction-details': 'Transaction Details',
		
		'sent': 'Sent',
		'received': 'Received',
		'actual-received': 'Actual Received',
		'status': 'Status',
		'initiated': 'Initiated',
		'transaction': 'Transaction',
		'search-chains': 'Search chains',
		'no-matching-networks': 'No matching networks',
		'no-swap-history': 'No swap history',
		
		
		'route': 'Route',
		
		'expected-output': 'Expected Output',
		
		
		'get-better-swap-output': 'Get Better Swap Output',
		'find-better-routes-get-more-tokens': 'Find Better Routes. Get More Tokens',
		
		
		'wallet-disconnected': 'Wallet disconnected',
		'wallet-switched': 'Wallet switched',
		
		
		'disconnect': 'Disconnect',
		
		
		
		'one-time-permit': 'One-time permit',
		'unlimited-permit': 'Unlimited permit',
		
		'gasless': 'Gasless',
		
		
	},
	'zh-Hans': {
		'swap': '闪兑',
		'connect-wallet': '连接钱包',
		'you-pay': '您支付',
		'you-receive': '您收到',
		'input-amount': '输入数量',
		'output-amount': '输出数量',
		'slippage-tolerance': '滑点限度',
		'slippage-tolerance-min-tips': '滑点限度过小可能导致交易失败，建议不小于 0.1%',
		'slippage-tolerance-max-tips': '滑点限度过大可能导致输出不佳，建议不超过 1%',
		'custom': '自定义',
		'slippage-set': '滑点设置',
		'confirm': '确定',
		'best-route': '最佳路线',
		'swap-route': '兑换路线',
		'fee': '费用',
		'free': '免费',
		'search-name-or-address': '按名称或粘贴地址搜索',
		'click-fix-token': '点击📌置顶代币',
		'clear-input': '清空输入',
		'no-data-found': '没有找到数据',
		'no-more-data-available': '没有更多数据了',
		'loading': '加载中',
		'loading-failed': '加载失败',
		'retry': '重试',
		'click-load-more': '点击加载更多',
		'click-load': '点击加载',
		'load-more': '加载更多',
		'copied': '复制成功',
		
		'route-not-found': '未获取路由~',
		'NO_ROUTE': '未找到路由',
		
		'insufficient-balance': '{{symbol}}余额不足',
		'confirm-swap-details': '确定交易详情',
		'confirm-swap': '确定交易',
		
		'minimum-received': '最少输出',
		'swap-fee': '交易费用',
		'network-cost': '网络成本',
		'contract-address': '合约地址',
		
		
		'recipient': '收币地址',
		'set-recipient-address': '设置接收者地址',
		'confirm-recipient-address': '确定接收者地址',
		'please-enter-recipient-address': '请输入接收者地址',
		'clear-history': '清除记录',
		'please-enter-a-valid-address': '请输入有效的地址',
		'confirm-close': '确定取消',
		'continue-swap': '继续交易',
		'confirm-close-swap': '确定取消交易?',
		'in-progress-approve': '正在批准',
		'already-approve': '已经批准',
		
		
		'my-wallet': '我的钱包',
		'wallet': '钱包',
		'cancel': '取消',
		
		'insufficient-liquidity': '流动性不足',
		
		
		
		'pending-approve': '待批准',
		'approve-token-wallet': '在钱包中批准 {{symbol}}',
		'sign-transaction': '签署交易',
		'sign-transaction-wallet': '在钱包中签署交易',
		'approve': '批准',
		'transaction-sent': '交易已发送',
		'view-transaction-explorer': '在区块浏览器中查看交易',
		'close': '关闭',
		'approve-amount': '批准数量',
		'approve-swap-amount': '仅批准此次交换数量',
		'one-time-approval': '一次性批准',
		'unlimited': '无限制',
		'recommend': '推荐',
		'need-approve-again-swaps': '下次使用 {{symbol}} 兑换其他代币无需再次批准',
		'unlimited-approval': '无限制批准',
		
		
		
		'quote-expired': '报价已过期',
		'please-get-a-new-quote': '请重新获取报价',
		'refresh-quote': '刷新报价',
		'transaction-may-fail': '交易可能会失败',
		'force-send': '强制发送',
		
		'swap-status': '兑换状态',
		'swap-history': '兑换记录',
		'all-chains': '所有网络',
		'transaction-details': '交易详情',
		
		'sent': '发送',
		'received': '收到',
		'actual-received': '实际收到',
		'status': '状态',
		'initiated': '发起时间',
		'transaction': '交易哈希',
		'search-chains': '搜索网络',
		'no-matching-networks': '未找到匹配的网络',
		'no-swap-history': '暂无交易记录',
		
		
		'route': '路由',
		
		'expected-output': '预计输出',
		
		
		'get-better-swap-output': '获取更优兑换输出',
		'find-better-routes-get-more-tokens': '发现更优路由，获得更多代币',
		
		
		'wallet-disconnected': '已退出钱包',
		'wallet-switched': '已切换钱包',
		
		'disconnect': '断开连接',
		
		
		
		'one-time-permit': '一次性 permit',
		'unlimited-permit': '无限制 permit',
		
		'gasless': '免 Gas',
		
		
	},
	'zh-Hant': {
		'swap': '兌換',
		'connect-wallet': '連接錢包',
		'you-pay': '您支付',
		'you-receive': '您收到',
		'input-amount': '輸入數量',
		'output-amount': '輸出數量',
		'slippage-tolerance': '滑點容忍度',
		'slippage-tolerance-min-tips': '滑點容忍度過低可能導致交易失敗，建議不低於 0.1%',
		'slippage-tolerance-max-tips': '滑點容忍度過高可能導致輸出不佳，建議不超過 1%',
		'custom': '自訂',
		'slippage-set': '滑點設定',
		'confirm': '確認',
		'best-route': '最佳路由',
		'swap-route': '兌換路由',
		'fee': '費用',
		'free': '免費',
		'search-name-or-address': '依名稱搜尋或貼上地址',
		'click-fix-token': '點擊 📌 置頂代幣',
		'clear-input': '清除輸入',
		'no-data-found': '找不到資料',
		'no-more-data-available': '沒有更多資料',
		'loading': '載入中',
		'loading-failed': '載入失敗',
		'retry': '重試',
		'click-load-more': '點擊載入更多',
		'click-load': '點擊載入',
		'load-more': '載入更多',
		'copied': '已複製',
	
		'route-not-found': '尚未取得路由～',
		'NO_ROUTE': '找不到路由',
	
		'insufficient-balance': '{{symbol}} 餘額不足',
		'confirm-swap-details': '確認兌換詳情',
		'confirm-swap': '確認兌換',
	
		'minimum-received': '最低收到數量',
		'swap-fee': '兌換費用',
		'network-cost': '網路費用',
		'contract-address': '合約地址',
	
		'recipient': '接收地址',
		'set-recipient-address': '設定接收地址',
		'confirm-recipient-address': '確認接收地址',
		'please-enter-recipient-address': '請輸入接收地址',
		'clear-history': '清除紀錄',
		'please-enter-a-valid-address': '請輸入有效的地址',
		'confirm-close': '確認取消',
		'continue-swap': '繼續兌換',
		'confirm-close-swap': '確定要取消此次交易嗎？',
		'in-progress-approve': '正在授權',
		'already-approve': '已完成授權',
	
		'my-wallet': '我的錢包',
		'wallet': '錢包',
		'cancel': '取消',
	
		'insufficient-liquidity': '流動性不足',
	
		'pending-approve': '等待授權',
		'approve-token-wallet': '在錢包中授權 {{symbol}}',
		'sign-transaction': '簽署交易',
		'sign-transaction-wallet': '請在錢包中簽署交易',
		'approve': '授權',
		'transaction-sent': '交易已送出',
		'view-transaction-explorer': '在區塊鏈瀏覽器中查看交易',
		'close': '關閉',
		'approve-amount': '授權數量',
		'approve-swap-amount': '僅授權此次兌換所需數量',
		'one-time-approval': '單次授權',
		'unlimited': '無限制',
		'recommend': '推薦',
		'need-approve-again-swaps': '未來使用 {{symbol}} 進行兌換時無需再次授權',
		'unlimited-approval': '無限額授權',
	
		'quote-expired': '報價已過期',
		'please-get-a-new-quote': '請重新取得報價',
		'refresh-quote': '重新取得報價',
		'transaction-may-fail': '交易可能失敗',
		'force-send': '強制送出',
	
		'swap-status': '兌換狀態',
		'swap-history': '兌換紀錄',
		'all-chains': '所有網路',
		'transaction-details': '交易詳情',
	
		'sent': '已送出',
		'received': '已收到',
		'actual-received': '實際收到',
		'status': '狀態',
		'initiated': '發起時間',
		'transaction': '交易雜湊',
		'search-chains': '搜尋網路',
		'no-matching-networks': '找不到符合的網路',
		'no-swap-history': '暫無兌換紀錄',
	
		'route': '路由',
	
		'expected-output': '預期輸出',
	
		'get-better-swap-output': '取得更優的兌換結果',
		'find-better-routes-get-more-tokens': '尋找更優路由，取得更多代幣',
	
		'wallet-disconnected': '已退出錢包',
		'wallet-switched': '已切換錢包',
	
		'disconnect': '中斷連接',
	
		'one-time-permit': '單次 Permit 授權',
		'unlimited-permit': '無限額 Permit 授權',
	
		'gasless': '免 Gas',
	},
	
	
	'ja': {
		'swap': '交換',
		'connect-wallet': 'ウォレットを接続する',
		'you-pay': '支払額',
		'you-receive': '獲得額',
		'input-amount': '額を入力',
		'output-amount': '額を出力',
		'slippage-tolerance': 'スリップページの許容差',
		'slippage-tolerance-min-tips': 'スリッページが 0.1%を下回ると、取引に失敗する可能性があります。',
		'slippage-tolerance-max-tips': 'スリッページ許容度が 1%を超えると、レートが不利になる可能性があります。',
		'custom': 'カスタム',
		'slippage-set': '滑り点設定',
		'confirm': '確認する',
		'best-route': '最適なルート',
		'swap-route': 'スワップルート',
		'fee': '料金',
		'free': '無料',
		'search-name-or-address': '名前で検索するかアドレスを貼り付ける',
		'click-fix-token': 'トークンを固定するには、📌をクリックしてください',
		'clear-input': '入力を削除',
		'no-data-found': 'データが見つかりませんでした',
		'no-more-data-available': 'これ以上のデータはありません',
		'loading': '読み込み中',
		'loading-failed': 'ロードに失敗しました',
		'retry': 'リトライ',
		'click-load-more': 'クリックしてさらに読み込む',
		'click-load': 'クリックして読み込む',
		'load-more': 'もっと読み込む',
		'copied': 'コピー成功',
		
		'route-not-found': 'ルート未取得～',
		'NO_ROUTE': 'ルートが見つかりません',
		
		'insufficient-balance': '{{symbol}}残高不足',
		'confirm-swap-details': 'スワップの詳細を確認する',
		'confirm-swap': '交換を確認する',
		
		'minimum-received': '最低受領額',
		'swap-fee': '取引手数料',
		'network-cost': 'ネットワークコスト',
		'contract-address': '契約住所',
		
		
		'recipient': '受信者',
		'set-recipient-address': '受信者のアドレスを設定する',
		'confirm-recipient-address': '受信者のアドレスを確認',
		'please-enter-recipient-address': '受信者の住所を入力してください',
		'clear-history': '履歴をクリア',
		'please-enter-a-valid-address': '有効な住所を入力してください',
		'confirm-close': '閉じるを確認',
		'continue-swap': 'スワップを続ける',
		'confirm-close-swap': '本当に取引をキャンセルしますか?',
		'in-progress-approve': '進行中 承認',
		'already-approve': 'すでに承認済み',
		
		
		'my-wallet': '私の財布',
		'wallet': '財布',
		'cancel': 'キャンセル',
		
		'insufficient-liquidity': '流動性不足',
		
		
		'pending-approve': '承認待ち',
		'approve-token-wallet': 'ウォレットで {{symbol}} を承認する',
		'sign-transaction': 'トランザクションに署名',
		'sign-transaction-wallet': 'ウォレット内のトランザクションに署名します',
		'approve': '承認する',
		'transaction-sent': '取引が送信されました',
		'view-transaction-explorer': 'エクスプローラーでトランザクションを表示',
		'close': '近い',
		'approve-amount': '承認数量',
		'approve-swap-amount': '今回の交換量のみ承認',
		'one-time-approval': 'を1回限り承認',
		'unlimited': '無制限',
		'recommend': '推薦',
		'need-approve-again-swaps': '次回以降の {{symbol}} 交換では再承認不要',
		'unlimited-approval': 'を無制限に承認',
		
		
		'quote-expired': '見積もりの有効期限が切れました',
		'please-get-a-new-quote': '見積もりを再取得してください',
		'refresh-quote': '見積もりを更新',
		'transaction-may-fail': '取引が失敗する可能性があります',
		'force-send': '強制送信',
		
		
		'swap-status': '交換状態',
		'swap-history': 'スワップ履歴',
		'all-chains': 'すべてのチェーン',
		'transaction-details': 'トランザクション詳細',
		
		'sent': '送信',
		'received': '受取',
		'actual-received': '実際の受取数量',
		'status': 'ステータス',
		'initiated': '開始日時',
		'transaction': 'トランザクションハッシュ',
		'search-chains': 'チェーンを検索',
		'no-matching-networks': '一致するネットワークが見つかりません',
		'no-swap-history': 'スワップ履歴はありません',
		
		
		'route': 'ルート',
		'expected-output': '期待される出力',
		
		
		'get-better-swap-output': 'より良いスワップ結果を',
		'find-better-routes-get-more-tokens': 'より良いルートを見つけ、より多くのトークンを獲得',
		
		
		'wallet-disconnected': 'ウォレットの接続を解除しました',
		'wallet-switched': 'ウォレットを切り替えました',
		
		'disconnect': '接続解除',
		
		
		'one-time-permit': 'を1回限り permit',
		'unlimited-permit': 'を無制限に permit',
		
		'gasless': 'ガス代不要',
	},
	'ko': {
		'swap': '교환',
		'connect-wallet': '지갑 연결',
		'you-pay': '결제액',
		'you-receive': '수령액',
		'input-amount': '입력 금액',
		'output-amount': '금액 출력',
		'slippage-tolerance': '슬리피지 허용',
		'slippage-tolerance-min-tips': '0.1% 미만의 슬리피지로 거래가 실패할 수 있습니다.',
		'slippage-tolerance-max-tips': '슬리피지 허용이 1%를 초과하면 불리한 요율로 이어질 수 있습니다. ',
		'custom': '관습',
		'slippage-set': '슬립 포인트 설정',
		'confirm': '확신하는',
		'best-route': '최적 경로',
		'swap-route': '경로 교환',
		'fee': '비용',
		'free': '무료',
		'search-name-or-address': '이름으로 검색 또는 주소 붙여넣기',
		'click-fix-token': '📌을 클릭하여 토큰을 고정하세요',
		'clear-input': '입력 삭제',
		'no-data-found': '데이터를 찾을 수 없습니다',
		'no-more-data-available': '더 이상 사용할 수 있는 데이터가 없습니다',
		'loading': '로딩 중',
		'loading-failed': '로딩 실패',
		'retry': '다시 해 보다',
		'click-load-more': '더 보려면 클릭하세요',
		'click-load': '클릭하여 로드',
		'load-more': '더 보기',
		'copied': '복사 성공',
		
		'route-not-found': '라우팅을 가져오지 못했습니다~',
		'NO_ROUTE': '경로를 찾을 수 없습니다',
		
		'insufficient-balance': '{{symbol}} 잔액이 부족합니다',
		'confirm-swap-details': '스왑 세부 정보 확인',
		'confirm-swap': '교환 확인',
		
		'minimum-received': '최소 출력',
		'swap-fee': '거래 수수료',
		'network-cost': '네트워크 비용',
		'contract-address': '계약 주소',
		
		
		'recipient': '수화기',
		'set-recipient-address': '수신자 주소 설정',
		'confirm-recipient-address': '수신자 주소 확인',
		'please-enter-recipient-address': '수신자 주소를 입력하세요',
		'clear-history': '명확한 역사',
		'please-enter-a-valid-address': '유효한 주소를 입력하세요',
		'confirm-close': '확인 닫기',
		'continue-swap': '스왑을 계속하다',
		'confirm-close-swap': '정말 거래를 취소하시겠습니까?',
		'in-progress-approve': '진행 중 승인',
		'already-approve': '이미 승인됨',
		
		'my-wallet': '내 지갑',
		'wallet': '지갑',
		'cancel': '취소',
		
		'insufficient-liquidity': '유동성 부족',
		
		
		
		'pending-approve': '승인 보류 중',
		'approve-token-wallet': '월렛에서 {{symbol}} 승인',
		'sign-transaction': '거래 서명',
		'sign-transaction-wallet': '지갑의 거래에 서명합니다.',
		'approve': '승인하다',
		'transaction-sent': '거래가 전송되었습니다',
		'view-transaction-explorer': '탐색기에서 거래 보기',
		'close': '닫다',
		'approve-amount': '승인 수량',
		'approve-swap-amount': '이번 교환 수량만 승인',
		'one-time-approval': '1회 승인',
		'unlimited': '무제한',
		'recommend': '추천',
		'need-approve-again-swaps': '다음 {{symbol}} 교환 시 추가 승인 불필요',
		'unlimited-approval': '무제한 승인',
		
		
		
		'quote-expired': '견적이 만료되었습니다',
		'please-get-a-new-quote': '견적을 다시 받아 주세요',
		'refresh-quote': '견적 새로고침',
		'transaction-may-fail': '거래가 실패할 수 있습니다',
		'force-send': '강제 전송',
		
		'swap-status': '스왑 상태',
		'swap-history': '스왑 내역',
		'all-chains': '모든 체인',
		'transaction-details': '거래 상세 정보',
		
		
		'sent': '보냄',
		'received': '받음',
		'actual-received': '실제 수령량',
		'status': '상태',
		'initiated': '시작 시간',
		'transaction': '트랜잭션 해시',
		'search-chains': '체인 검색',
		'no-matching-networks': '일치하는 네트워크가 없습니다',
		'no-swap-history': '스왑 내역이 없습니다',
		
		'route': '경로',
		
		'expected-output': '예상 출력',
		
		
		'get-better-swap-output': '더 나은 스왑 결과를',
		'find-better-routes-get-more-tokens': '더 나은 경로를 찾아 더 많은 토큰을 받으세요',
		
		'wallet-disconnected': '지갑 연결이 해제되었습니다',
		'wallet-switched': '지갑이 전환되었습니다',
		
		'disconnect': '연결 해제',
		
		
		'one-time-permit': '1회 permit',
		'unlimited-permit': '무제한 permit',
		
		'gasless': '가스비 무료',
		
		
	},
	'th': {
		'swap': 'แลกเปลี่ยน',
		'connect-wallet': 'เชื่อมต่อกระเป๋าเงิน',
		'you-pay': 'คุณจ่าย',
		'you-receive': 'คุณได้รับ',
		'input-amount': 'จำนวนที่ป้อน',
		'output-amount': 'จำนวนที่ได้รับ',
		'slippage-tolerance': 'ค่าคลาดเคลื่อนราคา',
		'slippage-tolerance-min-tips': 'ตั้งค่า Slippage ต่ำกว่า 0.1% อาจทำให้ธุรกรรมล้มเหลว',
		'slippage-tolerance-max-tips': 'ตั้งค่า Slippage สูงกว่า 1% อาจได้อัตราแลกเปลี่ยนที่ไม่เหมาะสม',
		'custom': 'กำหนดเอง',
		'slippage-set': 'ตั้งค่า Slippage',
		'confirm': 'ยืนยัน',
		'best-route': 'เส้นทางที่ดีที่สุด',
		'swap-route': 'เส้นทางแลกเปลี่ยน',
		'fee': 'ค่าธรรมเนียม',
		'free': 'ฟรี',
		'search-name-or-address': 'ค้นหาด้วยชื่อหรือวางที่อยู่',
		'click-fix-token': 'คลิก 📌 เพื่อปักหมุดโทเค็น',
		'clear-input': 'ล้างข้อมูล',
		'no-data-found': 'ไม่พบข้อมูล',
		'no-more-data-available': 'ไม่มีข้อมูลเพิ่มเติม',
		'loading': 'กำลังโหลด',
		'loading-failed': 'โหลดไม่สำเร็จ',
		'retry': 'ลองอีกครั้ง',
		'click-load-more': 'คลิกเพื่อโหลดเพิ่มเติม',
		'click-load': 'คลิกเพื่อโหลด',
		'load-more': 'โหลดเพิ่มเติม',
		'copied': 'คัดลอกแล้ว',
		
		'route-not-found': 'ไม่พบเส้นทาง~',
		'NO_ROUTE': 'ไม่พบเส้นทาง',
		
		'insufficient-balance': 'ยอด {{symbol}} ไม่เพียงพอ',
		'confirm-swap-details': 'ยืนยันรายละเอียดการแลกเปลี่ยน',
		'confirm-swap': 'ยืนยันการแลกเปลี่ยน',
		
		'minimum-received': 'จำนวนขั้นต่ำที่ได้รับ',
		'swap-fee': 'ค่าธรรมเนียมการแลกเปลี่ยน',
		'network-cost': 'ค่าใช้จ่ายเครือข่าย',
		'contract-address': 'ที่อยู่สัญญา',
		
		'recipient': 'ผู้รับ',
		'set-recipient-address': 'ตั้งค่าที่อยู่ผู้รับ',
		'confirm-recipient-address': 'ยืนยันที่อยู่ผู้รับ',
		'please-enter-recipient-address': 'โปรดป้อนที่อยู่ผู้รับ',
		'clear-history': 'ล้างประวัติ',
		'please-enter-a-valid-address': 'โปรดป้อนที่อยู่ที่ถูกต้อง',
		'confirm-close': 'ยืนยันการปิด',
		'continue-swap': 'ดำเนินการแลกเปลี่ยนต่อ',
		'confirm-close-swap': 'คุณแน่ใจหรือไม่ว่าต้องการยกเลิกธุรกรรมนี้?',
		'in-progress-approve': 'กำลังอนุมัติ',
		'already-approve': 'อนุมัติแล้ว',
		
		'my-wallet': 'กระเป๋าเงินของฉัน',
		'wallet': 'กระเป๋าเงิน',
		'cancel': 'ยกเลิก',
		
		'insufficient-liquidity': 'สภาพคล่องไม่เพียงพอ',
		
		'pending-approve': 'รอการอนุมัติ',
		'approve-token-wallet': 'อนุมัติ {{symbol}} ในกระเป๋าเงิน',
		'sign-transaction': 'ลงนามธุรกรรม',
		'sign-transaction-wallet': 'ลงนามธุรกรรมในกระเป๋าเงิน',
		'approve': 'อนุมัติ',
		'transaction-sent': 'ส่งธุรกรรมแล้ว',
		'view-transaction-explorer': 'ดูธุรกรรมในบล็อกเอ็กซ์พลอเรอร์',
		'close': 'ปิด',
		'approve-amount': 'จำนวนที่อนุมัติ',
		'approve-swap-amount': 'อนุมัติเฉพาะจำนวนสำหรับการแลกเปลี่ยนครั้งนี้',
		'one-time-approval': 'อนุมัติครั้งเดียว',
		'unlimited': 'ไม่จำกัด',
		'recommend': 'แนะนำ',
		'need-approve-again-swaps': 'ไม่ต้องอนุมัติ {{symbol}} ซ้ำสำหรับการแลกเปลี่ยนครั้งต่อไป',
		'unlimited-approval': 'อนุมัติไม่จำกัด',
		
		'quote-expired': 'ราคาเสนอหมดอายุแล้ว',
		'please-get-a-new-quote': 'โปรดขอราคาเสนอใหม่',
		'refresh-quote': 'รีเฟรชราคาเสนอ',
		'transaction-may-fail': 'ธุรกรรมอาจล้มเหลว',
		'force-send': 'ส่งธุรกรรมต่อ',
		
		'swap-status': 'สถานะการแลกเปลี่ยน',
		'swap-history': 'ประวัติการแลกเปลี่ยน',
		'all-chains': 'ทุกเครือข่าย',
		'transaction-details': 'รายละเอียดธุรกรรม',
		
		'sent': 'ส่งแล้ว',
		'received': 'ได้รับแล้ว',
		'actual-received': 'จำนวนที่ได้รับจริง',
		'status': 'สถานะ',
		'initiated': 'เวลาเริ่มต้น',
		'transaction': 'ธุรกรรม',
		'search-chains': 'ค้นหาเครือข่าย',
		'no-matching-networks': 'ไม่พบเครือข่ายที่ตรงกัน',
		'no-swap-history': 'ไม่มีประวัติการแลกเปลี่ยน',
		
		'route': 'เส้นทาง',
		'expected-output': 'จำนวนที่คาดว่าจะได้รับ',
		
		'get-better-swap-output': 'รับผลการแลกเปลี่ยนที่ดีกว่า',
		'find-better-routes-get-more-tokens': 'ค้นหาเส้นทางที่ดีกว่า รับโทเค็นมากขึ้น',
		
		'wallet-disconnected': 'ตัดการเชื่อมต่อกระเป๋าเงินแล้ว',
		'wallet-switched': 'เปลี่ยนกระเป๋าเงินแล้ว',
		'disconnect': 'ตัดการเชื่อมต่อ',
		
		'one-time-permit': 'Permit ครั้งเดียว',
		'unlimited-permit': 'Permit ไม่จำกัด',
		'gasless': 'ไม่เสียค่า Gas',
	},
	'pt-BR': {
		'swap': 'Trocar',
		'connect-wallet': 'Conectar carteira',
		'you-pay': 'Você paga',
		'you-receive': 'Você recebe',
		'input-amount': 'Digite o valor',
		'output-amount': 'Valor de saída',
		'slippage-tolerance': 'Tolerância de slippage',
		'slippage-tolerance-min-tips': 'Slippage abaixo de 0,1% pode fazer a transação falhar.',
		'slippage-tolerance-max-tips': 'Slippage acima de 1% pode resultar em uma taxa desfavorável.',
		'custom': 'Personalizado',
		'slippage-set': 'Configurações de slippage',
		'confirm': 'Confirmar',
		'best-route': 'Melhor rota',
		'swap-route': 'Rota de troca',
		'fee': 'Taxa',
		'free': 'Grátis',
		'search-name-or-address': 'Busque por nome ou cole um endereço',
		'click-fix-token': 'Clique em 📌 para fixar o token',
		'clear-input': 'Limpar campo',
		'no-data-found': 'Nenhum dado encontrado',
		'no-more-data-available': 'Não há mais dados disponíveis',
		'loading': 'Carregando',
		'loading-failed': 'Falha ao carregar',
		'retry': 'Tentar novamente',
		'click-load-more': 'Clique para carregar mais',
		'click-load': 'Clique para carregar',
		'load-more': 'Carregar mais',
		'copied': 'Copiado',
		
		'route-not-found': 'Rota não encontrada~',
		'NO_ROUTE': 'Rota não encontrada',
		
		'insufficient-balance': 'Saldo de {{symbol}} insuficiente',
		'confirm-swap-details': 'Confirmar detalhes da troca',
		'confirm-swap': 'Confirmar troca',
		
		'minimum-received': 'Mínimo recebido',
		'swap-fee': 'Taxa de troca',
		'network-cost': 'Custo da rede',
		'contract-address': 'Endereço do contrato',
		
		'recipient': 'Destinatário',
		'set-recipient-address': 'Definir endereço do destinatário',
		'confirm-recipient-address': 'Confirmar endereço do destinatário',
		'please-enter-recipient-address': 'Digite o endereço do destinatário',
		'clear-history': 'Limpar histórico',
		'please-enter-a-valid-address': 'Digite um endereço válido',
		'confirm-close': 'Confirmar fechamento',
		'continue-swap': 'Continuar troca',
		'confirm-close-swap': 'Tem certeza de que deseja cancelar a transação?',
		'in-progress-approve': 'Aprovação em andamento',
		'already-approve': 'Já aprovado',
		
		'my-wallet': 'Minha carteira',
		'wallet': 'Carteira',
		'cancel': 'Cancelar',
		
		'insufficient-liquidity': 'Liquidez insuficiente',
		
		'pending-approve': 'Aguardando aprovação',
		'approve-token-wallet': 'Aprove {{symbol}} na carteira',
		'sign-transaction': 'Assinar transação',
		'sign-transaction-wallet': 'Assine a transação na carteira.',
		'approve': 'Aprovar',
		'transaction-sent': 'Transação enviada',
		'view-transaction-explorer': 'Ver transação no explorador',
		'close': 'Fechar',
		'approve-amount': 'Valor da aprovação',
		'approve-swap-amount': 'Aprovar somente o valor desta troca',
		'one-time-approval': 'Aprovação única',
		'unlimited': 'Ilimitado',
		'recommend': 'Recomendado',
		'need-approve-again-swaps': 'Não é preciso aprovar {{symbol}} novamente nas próximas trocas',
		'unlimited-approval': 'Aprovação ilimitada',
		
		'quote-expired': 'Cotação expirada',
		'please-get-a-new-quote': 'Solicite uma nova cotação',
		'refresh-quote': 'Atualizar cotação',
		'transaction-may-fail': 'A transação pode falhar',
		'force-send': 'Enviar mesmo assim',
		
		'swap-status': 'Status da troca',
		'swap-history': 'Histórico de trocas',
		'all-chains': 'Todas as redes',
		'transaction-details': 'Detalhes da transação',
		
		'sent': 'Enviado',
		'received': 'Recebido',
		'actual-received': 'Valor efetivamente recebido',
		'status': 'Status',
		'initiated': 'Iniciada em',
		'transaction': 'Hash da transação',
		'search-chains': 'Buscar redes',
		'no-matching-networks': 'Nenhuma rede correspondente',
		'no-swap-history': 'Nenhum histórico de trocas',
		
		'route': 'Rota',
		'expected-output': 'Saída esperada',
		
		'get-better-swap-output': 'Obtenha um valor melhor na troca',
		'find-better-routes-get-more-tokens': 'Encontre rotas melhores. Receba mais tokens',
		
		'wallet-disconnected': 'Carteira desconectada',
		'wallet-switched': 'Carteira trocada',
		'disconnect': 'Desconectar',
		
		'one-time-permit': 'Permit único',
		'unlimited-permit': 'Permit ilimitado',
		'gasless': 'Sem gas',
	},
	'id': {
		'swap': 'Tukar',
		'connect-wallet': 'Hubungkan dompet',
		'you-pay': 'Anda membayar',
		'you-receive': 'Anda menerima',
		'input-amount': 'Masukkan jumlah',
		'output-amount': 'Jumlah keluaran',
		'slippage-tolerance': 'Toleransi slippage',
		'slippage-tolerance-min-tips': 'Slippage di bawah 0,1% dapat menyebabkan transaksi gagal.',
		'slippage-tolerance-max-tips': 'Slippage di atas 1% dapat menghasilkan kurs yang kurang menguntungkan.',
		'custom': 'Kustom',
		'slippage-set': 'Pengaturan slippage',
		'confirm': 'Konfirmasi',
		'best-route': 'Rute terbaik',
		'swap-route': 'Rute swap',
		'fee': 'Biaya',
		'free': 'Gratis',
		'search-name-or-address': 'Cari nama atau tempel alamat',
		'click-fix-token': 'Klik 📌 untuk menyematkan token',
		'clear-input': 'Hapus input',
		'no-data-found': 'Data tidak ditemukan',
		'no-more-data-available': 'Tidak ada data lainnya',
		'loading': 'Memuat',
		'loading-failed': 'Gagal memuat',
		'retry': 'Coba lagi',
		'click-load-more': 'Klik untuk memuat lainnya',
		'click-load': 'Klik untuk memuat',
		'load-more': 'Muat lainnya',
		'copied': 'Disalin',
		
		'route-not-found': 'Rute tidak ditemukan~',
		'NO_ROUTE': 'Rute tidak ditemukan',
		
		'insufficient-balance': 'Saldo {{symbol}} tidak mencukupi',
		'confirm-swap-details': 'Konfirmasi detail swap',
		'confirm-swap': 'Konfirmasi swap',
		
		'minimum-received': 'Minimum diterima',
		'swap-fee': 'Biaya swap',
		'network-cost': 'Biaya jaringan',
		'contract-address': 'Alamat kontrak',
		
		'recipient': 'Penerima',
		'set-recipient-address': 'Atur alamat penerima',
		'confirm-recipient-address': 'Konfirmasi alamat penerima',
		'please-enter-recipient-address': 'Masukkan alamat penerima',
		'clear-history': 'Hapus riwayat',
		'please-enter-a-valid-address': 'Masukkan alamat yang valid',
		'confirm-close': 'Konfirmasi penutupan',
		'continue-swap': 'Lanjutkan swap',
		'confirm-close-swap': 'Yakin ingin membatalkan transaksi?',
		'in-progress-approve': 'Persetujuan sedang diproses',
		'already-approve': 'Sudah disetujui',
		
		'my-wallet': 'Dompet saya',
		'wallet': 'Dompet',
		'cancel': 'Batal',
		
		'insufficient-liquidity': 'Likuiditas tidak cukup',
		
		'pending-approve': 'Menunggu persetujuan',
		'approve-token-wallet': 'Setujui {{symbol}} di dompet',
		'sign-transaction': 'Tandatangani transaksi',
		'sign-transaction-wallet': 'Tandatangani transaksi di dompet.',
		'approve': 'Setujui',
		'transaction-sent': 'Transaksi terkirim',
		'view-transaction-explorer': 'Lihat transaksi di explorer',
		'close': 'Tutup',
		'approve-amount': 'Jumlah persetujuan',
		'approve-swap-amount': 'Setujui hanya jumlah untuk swap ini',
		'one-time-approval': 'Persetujuan satu kali',
		'unlimited': 'Tanpa batas',
		'recommend': 'Disarankan',
		'need-approve-again-swaps': '{{symbol}} tidak perlu disetujui lagi untuk swap berikutnya',
		'unlimited-approval': 'Persetujuan tanpa batas',
		
		'quote-expired': 'Kutipan kedaluwarsa',
		'please-get-a-new-quote': 'Minta kutipan baru',
		'refresh-quote': 'Perbarui kutipan',
		'transaction-may-fail': 'Transaksi mungkin gagal',
		'force-send': 'Tetap kirim',
		
		'swap-status': 'Status swap',
		'swap-history': 'Riwayat swap',
		'all-chains': 'Semua jaringan',
		'transaction-details': 'Detail transaksi',
		
		'sent': 'Terkirim',
		'received': 'Diterima',
		'actual-received': 'Jumlah yang diterima',
		'status': 'Status',
		'initiated': 'Waktu dimulai',
		'transaction': 'Hash transaksi',
		'search-chains': 'Cari jaringan',
		'no-matching-networks': 'Tidak ada jaringan yang cocok',
		'no-swap-history': 'Belum ada riwayat swap',
		
		'route': 'Rute',
		'expected-output': 'Perkiraan hasil',
		
		'get-better-swap-output': 'Dapatkan hasil swap yang lebih baik',
		'find-better-routes-get-more-tokens': 'Temukan rute lebih baik, dapatkan lebih banyak token',
		
		'wallet-disconnected': 'Dompet terputus',
		'wallet-switched': 'Dompet diganti',
		'disconnect': 'Putuskan koneksi',
		
		'one-time-permit': 'Permit satu kali',
		'unlimited-permit': 'Permit tanpa batas',
		'gasless': 'Tanpa gas',
	},
	'vi': {
		'swap': 'Hoán đổi',
		'connect-wallet': 'Kết nối ví',
		'you-pay': 'Bạn trả',
		'you-receive': 'Bạn nhận',
		'input-amount': 'Nhập số lượng',
		'output-amount': 'Số lượng đầu ra',
		'slippage-tolerance': 'Mức trượt giá cho phép',
		'slippage-tolerance-min-tips': 'Mức trượt giá dưới 0,1% có thể khiến giao dịch thất bại.',
		'slippage-tolerance-max-tips': 'Mức trượt giá trên 1% có thể dẫn đến tỷ giá bất lợi.',
		'custom': 'Tùy chỉnh',
		'slippage-set': 'Cài đặt trượt giá',
		'confirm': 'Xác nhận',
		'best-route': 'Tuyến tốt nhất',
		'swap-route': 'Tuyến hoán đổi',
		'fee': 'Phí',
		'free': 'Miễn phí',
		'search-name-or-address': 'Tìm theo tên hoặc dán địa chỉ',
		'click-fix-token': 'Nhấn 📌 để ghim token',
		'clear-input': 'Xóa nội dung',
		'no-data-found': 'Không tìm thấy dữ liệu',
		'no-more-data-available': 'Không còn dữ liệu',
		'loading': 'Đang tải',
		'loading-failed': 'Tải thất bại',
		'retry': 'Thử lại',
		'click-load-more': 'Nhấn để tải thêm',
		'click-load': 'Nhấn để tải',
		'load-more': 'Tải thêm',
		'copied': 'Đã sao chép',
		
		'route-not-found': 'Không tìm thấy tuyến~',
		'NO_ROUTE': 'Không tìm thấy tuyến',
		
		'insufficient-balance': 'Không đủ số dư {{symbol}}',
		'confirm-swap-details': 'Xác nhận chi tiết hoán đổi',
		'confirm-swap': 'Xác nhận hoán đổi',
		
		'minimum-received': 'Số lượng nhận tối thiểu',
		'swap-fee': 'Phí hoán đổi',
		'network-cost': 'Chi phí mạng',
		'contract-address': 'Địa chỉ hợp đồng',
		
		'recipient': 'Người nhận',
		'set-recipient-address': 'Đặt địa chỉ người nhận',
		'confirm-recipient-address': 'Xác nhận địa chỉ người nhận',
		'please-enter-recipient-address': 'Vui lòng nhập địa chỉ người nhận',
		'clear-history': 'Xóa lịch sử',
		'please-enter-a-valid-address': 'Vui lòng nhập địa chỉ hợp lệ',
		'confirm-close': 'Xác nhận đóng',
		'continue-swap': 'Tiếp tục hoán đổi',
		'confirm-close-swap': 'Bạn có chắc muốn hủy giao dịch không?',
		'in-progress-approve': 'Đang phê duyệt',
		'already-approve': 'Đã phê duyệt',
		
		'my-wallet': 'Ví của tôi',
		'wallet': 'Ví',
		'cancel': 'Hủy',
		
		'insufficient-liquidity': 'Thanh khoản không đủ',
		
		'pending-approve': 'Đang chờ phê duyệt',
		'approve-token-wallet': 'Phê duyệt {{symbol}} trong ví',
		'sign-transaction': 'Ký giao dịch',
		'sign-transaction-wallet': 'Ký giao dịch trong ví.',
		'approve': 'Phê duyệt',
		'transaction-sent': 'Giao dịch đã gửi',
		'view-transaction-explorer': 'Xem giao dịch trên trình khám phá khối',
		'close': 'Đóng',
		'approve-amount': 'Số lượng phê duyệt',
		'approve-swap-amount': 'Chỉ phê duyệt số lượng cho lần hoán đổi này',
		'one-time-approval': 'Phê duyệt một lần',
		'unlimited': 'Không giới hạn',
		'recommend': 'Đề xuất',
		'need-approve-again-swaps': 'Không cần phê duyệt lại {{symbol}} cho các lần hoán đổi sau',
		'unlimited-approval': 'Phê duyệt không giới hạn',
		
		'quote-expired': 'Báo giá đã hết hạn',
		'please-get-a-new-quote': 'Vui lòng lấy báo giá mới',
		'refresh-quote': 'Làm mới báo giá',
		'transaction-may-fail': 'Giao dịch có thể thất bại',
		'force-send': 'Vẫn gửi giao dịch',
		
		'swap-status': 'Trạng thái hoán đổi',
		'swap-history': 'Lịch sử hoán đổi',
		'all-chains': 'Tất cả mạng',
		'transaction-details': 'Chi tiết giao dịch',
		
		'sent': 'Đã gửi',
		'received': 'Đã nhận',
		'actual-received': 'Số lượng thực nhận',
		'status': 'Trạng thái',
		'initiated': 'Thời điểm bắt đầu',
		'transaction': 'Hash giao dịch',
		'search-chains': 'Tìm mạng',
		'no-matching-networks': 'Không tìm thấy mạng phù hợp',
		'no-swap-history': 'Chưa có lịch sử hoán đổi',
		
		'route': 'Tuyến',
		'expected-output': 'Số lượng đầu ra dự kiến',
		
		'get-better-swap-output': 'Nhận kết quả hoán đổi tốt hơn',
		'find-better-routes-get-more-tokens': 'Tìm tuyến tốt hơn, nhận nhiều token hơn',
		
		'wallet-disconnected': 'Ví đã ngắt kết nối',
		'wallet-switched': 'Đã chuyển ví',
		'disconnect': 'Ngắt kết nối',
		
		'one-time-permit': 'Permit một lần',
		'unlimited-permit': 'Permit không giới hạn',
		'gasless': 'Không tốn gas',
	},
};





