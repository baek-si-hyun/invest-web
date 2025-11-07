export type AssetMapToken = {
	id: string;
	name: string;
	symbol: string;
	marketCap: number;
	change24h: number;
};

export type AssetMapCategory = {
	id: string;
	name: string;
	children: AssetMapToken[];
};

export type AssetMapTree = {
	id: string;
	name: string;
	children: AssetMapCategory[];
};

export type AssetGroupId = 'domestic' | 'crypto' | 'global';

export type AssetGroup = {
	id: AssetGroupId;
	label: string;
	description: string;
	tree: AssetMapTree;
};

const domesticEquitiesMap: AssetMapTree = {
	id: 'domestic-equities',
	name: '국내 주식',
	children: [
			{
				id: 'kospi-bluechips',
				name: '대형주',
				children: [
					{ id: '005930', name: '삼성전자', symbol: '삼성전자', marketCap: 420, change24h: 1.2 },
					{ id: '000660', name: 'SK하이닉스', symbol: 'SK하이닉스', marketCap: 215, change24h: 0.8 },
					{ id: '005380', name: '현대차', symbol: '현대차', marketCap: 95, change24h: 0.4 },
					{ id: '000270', name: '기아', symbol: '기아', marketCap: 70, change24h: -0.6 },
					{ id: '066570', name: 'LG전자', symbol: 'LG전자', marketCap: 62, change24h: 1.1 },
					{ id: '051910', name: 'LG화학', symbol: 'LG화학', marketCap: 58, change24h: -0.3 },
					{ id: '005490', name: 'POSCO홀딩스', symbol: 'POSCO홀딩스', marketCap: 52, change24h: 2 },
					{ id: '012330', name: '현대모비스', symbol: '현대모비스', marketCap: 48, change24h: -1.2 }
				]
			},
			{
				id: 'internet-content',
				name: '인터넷 · 콘텐츠',
				children: [
					{ id: '035420', name: '네이버', symbol: '네이버', marketCap: 68, change24h: -0.5 },
					{ id: '035720', name: '카카오', symbol: '카카오', marketCap: 45, change24h: 1.9 },
					{ id: '181710', name: 'NHN KCP', symbol: 'NHN KCP', marketCap: 12, change24h: 0.7 },
					{ id: '036570', name: '엔씨소프트', symbol: '엔씨소프트', marketCap: 18, change24h: -0.8 },
					{ id: '035900', name: 'JYP엔터테인먼트', symbol: 'JYP엔터테인먼트', marketCap: 9.5, change24h: 2.4 },
					{ id: '352820', name: '하이브', symbol: '하이브', marketCap: 11.5, change24h: 3.1 },
					{ id: '035600', name: 'KG이니시스', symbol: 'KG이니시스', marketCap: 5.8, change24h: -1.1 },
					{ id: '293490', name: '카카오게임즈', symbol: '카카오게임즈', marketCap: 6.4, change24h: 0.9 }
				]
			},
			{
				id: 'secondary-battery',
				name: '2차전지',
				children: [
					{ id: '373220', name: 'LG에너지솔루션', symbol: 'LG에너지솔루션', marketCap: 140, change24h: 2.5 },
					{ id: '006400', name: '삼성SDI', symbol: '삼성SDI', marketCap: 120, change24h: -1.1 },
					{ id: '247540', name: '에코프로비엠', symbol: '에코프로비엠', marketCap: 55, change24h: 3.8 },
					{ id: '066970', name: '엘앤에프', symbol: '엘앤에프', marketCap: 33, change24h: -2.2 },
					{ id: '003670', name: '포스코퓨처엠', symbol: '포스코퓨처엠', marketCap: 42, change24h: 1.6 },
					{ id: '086520', name: '에코프로', symbol: '에코프로', marketCap: 38, change24h: -1.4 },
					{ id: '009830', name: '한화솔루션', symbol: '한화솔루션', marketCap: 36, change24h: 0.7 },
					{ id: '096770', name: 'SK이노베이션', symbol: 'SK이노베이션', marketCap: 34, change24h: -0.9 }
				]
			},
			{
				id: 'bio-healthcare',
				name: '바이오 · 헬스케어',
				children: [
					{ id: '207940', name: '삼성바이오로직스', symbol: '삼성바이오로직스', marketCap: 80, change24h: -0.9 },
					{ id: '068270', name: '셀트리온', symbol: '셀트리온', marketCap: 57, change24h: 1.3 },
					{ id: '302440', name: 'SK바이오사이언스', symbol: 'SK바이오사이언스', marketCap: 14, change24h: -1.8 },
					{ id: '128940', name: '한미약품', symbol: '한미약품', marketCap: 12, change24h: 2.1 },
					{ id: '000100', name: '유한양행', symbol: '유한양행', marketCap: 10, change24h: 0.6 },
					{ id: '001630', name: '종근당홀딩스', symbol: '종근당홀딩스', marketCap: 8.2, change24h: -0.4 },
					{ id: '215600', name: '신라젠', symbol: '신라젠', marketCap: 6.4, change24h: 1.7 },
					{ id: '214390', name: '경보제약', symbol: '경보제약', marketCap: 4.8, change24h: -2.3 }
				]
			}
		]
	};

const cryptoMarketMap: AssetMapTree = {
	id: 'crypto-market',
	name: '디지털 자산',
	children: [
		{
			id: 'layer1',
			name: '레이어 1',
			children: [
				{ id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', marketCap: 60, change24h: 1.8 },
				{ id: 'ethereum', name: 'Ethereum', symbol: 'ETH', marketCap: 45, change24h: -0.9 },
				{ id: 'solana', name: 'Solana', symbol: 'SOL', marketCap: 18, change24h: 3.1 },
				{ id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', marketCap: 12, change24h: -2.3 },
				{ id: 'cardano', name: 'Cardano', symbol: 'ADA', marketCap: 9, change24h: 0.6 },
				{ id: 'polkadot', name: 'Polkadot', symbol: 'DOT', marketCap: 8, change24h: -1.5 },
				{ id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', marketCap: 7.2, change24h: 2.4 },
				{ id: 'hedera', name: 'Hedera', symbol: 'HBAR', marketCap: 4.6, change24h: 0.9 }
			]
		},
		{
			id: 'infrastructure',
			name: '인프라 서비스',
			children: [
				{ id: 'chainlink', name: 'Chainlink', symbol: 'LINK', marketCap: 7.2, change24h: 2.9 },
				{ id: 'render', name: 'Render', symbol: 'RNDR', marketCap: 5.1, change24h: 4.2 },
				{ id: 'arweave', name: 'Arweave', symbol: 'AR', marketCap: 3.4, change24h: -1.4 },
				{ id: 'graph', name: 'The Graph', symbol: 'GRT', marketCap: 2.9, change24h: 0.9 },
				{ id: 'filecoin', name: 'Filecoin', symbol: 'FIL', marketCap: 2.5, change24h: -0.7 },
				{ id: 'ocean', name: 'Ocean Protocol', symbol: 'OCEAN', marketCap: 1.9, change24h: 1.6 },
				{ id: 'akash', name: 'Akash Network', symbol: 'AKT', marketCap: 1.7, change24h: 3.4 },
				{ id: 'helium', name: 'Helium', symbol: 'HNT', marketCap: 1.4, change24h: -2.1 }
			]
		},
		{
			id: 'defi',
			name: '디파이',
			children: [
				{ id: 'uniswap', name: 'Uniswap', symbol: 'UNI', marketCap: 4.8, change24h: -1.6 },
				{ id: 'aave', name: 'Aave', symbol: 'AAVE', marketCap: 3.3, change24h: 2.1 },
				{ id: 'maker', name: 'Maker', symbol: 'MKR', marketCap: 3.1, change24h: 1.2 },
				{ id: 'curve', name: 'Curve', symbol: 'CRV', marketCap: 2.1, change24h: -2.9 },
				{ id: 'gmx', name: 'GMX', symbol: 'GMX', marketCap: 1.7, change24h: 0.5 },
				{ id: 'pancake', name: 'PancakeSwap', symbol: 'CAKE', marketCap: 1.5, change24h: 2.8 },
				{ id: 'sushi', name: 'SushiSwap', symbol: 'SUSHI', marketCap: 1.2, change24h: -1.7 },
				{ id: 'radix', name: 'Radix', symbol: 'XRD', marketCap: 0.9, change24h: 0.6 }
			]
		},
		{
			id: 'stablecoins',
			name: '스테이블코인',
			children: [
				{ id: 'usdt', name: 'Tether', symbol: 'USDT', marketCap: 82, change24h: 0 },
				{ id: 'usdc', name: 'USD Coin', symbol: 'USDC', marketCap: 52, change24h: 0 },
				{ id: 'dai', name: 'DAI', symbol: 'DAI', marketCap: 6.9, change24h: 0 },
				{ id: 'tusd', name: 'TrueUSD', symbol: 'TUSD', marketCap: 3.2, change24h: 0 },
				{ id: 'frax', name: 'Frax', symbol: 'FRAX', marketCap: 1.6, change24h: 0 },
				{ id: 'pyusd', name: 'PayPal USD', symbol: 'PYUSD', marketCap: 1.1, change24h: 0 },
				{ id: 'gusd', name: 'Gemini Dollar', symbol: 'GUSD', marketCap: 0.8, change24h: 0 },
				{ id: 'usdp', name: 'Pax Dollar', symbol: 'USDP', marketCap: 0.7, change24h: 0 }
			]
		}
	]
};

const globalEquitiesMap: AssetMapTree = {
	id: 'global-equities',
	name: '해외 주식',
	children: [
		{
			id: 'us-tech-mega',
			name: '미국 빅테크',
			children: [
				{ id: 'AAPL', name: 'Apple', symbol: 'AAPL', marketCap: 280, change24h: 1.4 },
				{ id: 'MSFT', name: 'Microsoft', symbol: 'MSFT', marketCap: 270, change24h: 0.9 },
				{ id: 'NVDA', name: 'NVIDIA', symbol: 'NVDA', marketCap: 230, change24h: 2.7 },
				{ id: 'GOOGL', name: 'Alphabet', symbol: 'GOOGL', marketCap: 140, change24h: -0.5 },
				{ id: 'AMZN', name: 'Amazon', symbol: 'AMZN', marketCap: 160, change24h: 1.1 },
				{ id: 'META', name: 'Meta Platforms', symbol: 'META', marketCap: 150, change24h: 2.2 },
				{ id: 'ADBE', name: 'Adobe', symbol: 'ADBE', marketCap: 80, change24h: -1.3 },
				{ id: 'CRM', name: 'Salesforce', symbol: 'CRM', marketCap: 70, change24h: 0.8 }
			]
		},
		{
			id: 'us-consumer',
			name: '미국 소비재',
			children: [
				{ id: 'TSLA', name: 'Tesla', symbol: 'TSLA', marketCap: 85, change24h: -1.9 },
				{ id: 'NKE', name: 'Nike', symbol: 'NKE', marketCap: 65, change24h: 0.7 },
				{ id: 'MCD', name: 'McDonald\'s', symbol: 'MCD', marketCap: 60, change24h: 0.4 },
				{ id: 'SBUX', name: 'Starbucks', symbol: 'SBUX', marketCap: 45, change24h: -0.2 },
				{ id: 'COST', name: 'Costco', symbol: 'COST', marketCap: 75, change24h: 1.5 },
				{ id: 'KO', name: 'Coca-Cola', symbol: 'KO', marketCap: 72, change24h: 0.9 },
				{ id: 'PG', name: 'Procter & Gamble', symbol: 'PG', marketCap: 68, change24h: -0.4 },
				{ id: 'DIS', name: 'Walt Disney', symbol: 'DIS', marketCap: 60, change24h: 1.2 }
			]
		},
		{
			id: 'europe-core',
			name: '유럽 코어',
			children: [
				{ id: 'ASML', name: 'ASML', symbol: 'ASML', marketCap: 110, change24h: 2.2 },
				{ id: 'NESN.SW', name: 'Nestlé', symbol: 'NESN', marketCap: 95, change24h: 0.3 },
				{ id: 'OR.PA', name: 'LVMH', symbol: 'MC', marketCap: 120, change24h: -1.1 },
				{ id: 'DTE.DE', name: 'Deutsche Telekom', symbol: 'DTE', marketCap: 75, change24h: 0.8 },
				{ id: 'AIR.PA', name: 'Airbus', symbol: 'AIR', marketCap: 68, change24h: 1.6 },
				{ id: 'ROG.SW', name: 'Roche', symbol: 'ROG', marketCap: 90, change24h: -0.6 },
				{ id: 'SIE.DE', name: 'Siemens', symbol: 'SIE', marketCap: 80, change24h: 1.5 },
				{ id: 'SAN.PA', name: 'Sanofi', symbol: 'SAN', marketCap: 70, change24h: 0.7 }
			]
		},
		{
			id: 'etf-theme',
			name: '글로벌 ETF',
			children: [
				{ id: 'QQQ', name: 'Invesco QQQ', symbol: 'QQQ', marketCap: 90, change24h: 1.9 },
				{ id: 'SPY', name: 'SPDR S&P 500', symbol: 'SPY', marketCap: 120, change24h: 1.1 },
				{ id: 'ARKK', name: 'ARK Innovation', symbol: 'ARKK', marketCap: 15, change24h: -2.5 },
				{ id: 'EEM', name: 'iShares MSCI EM', symbol: 'EEM', marketCap: 35, change24h: 0.6 },
				{ id: 'VT', name: 'Vanguard Total World', symbol: 'VT', marketCap: 55, change24h: 0.9 },
				{ id: 'XLK', name: 'Technology Select Sector', symbol: 'XLK', marketCap: 65, change24h: 1.6 },
				{ id: 'XLF', name: 'Financial Select Sector', symbol: 'XLF', marketCap: 48, change24h: -0.8 },
				{ id: 'FXI', name: 'iShares China Large-Cap', symbol: 'FXI', marketCap: 28, change24h: 0.5 }
			]
		}
	]
};

export const assetGroups: AssetGroup[] = [
	{
		id: 'domestic',
		label: '국내 주식',
		description: '코스피 · 코스닥 주요 섹터 현황',
		tree: domesticEquitiesMap
	},
	{
		id: 'crypto',
		label: '디지털 자산',
		description: '시장 시가총액 상위 암호화폐',
		tree: cryptoMarketMap
	},
	{
		id: 'global',
		label: '해외 주식',
		description: '미국 · 유럽 대표 종목과 ETF',
		tree: globalEquitiesMap
	}
];

export const assetGroupMap = new Map(assetGroups.map((group) => [group.id, group] as const));
