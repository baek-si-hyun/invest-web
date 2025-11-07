export type Instrument = {
	id: string;
	name: string;
	symbol: string;
	color: string;
	data: number[];
	tradingViewSymbol: string | null;
	tradingViewInterval?: string;
};

// Sample time-series data for each instrument; in a real app this would come from an API.
export const instruments: Instrument[] = [
	{
		id: 'bitcoin',
		name: '비트코인',
		symbol: 'BTC',
		color: '#f7931a',
		data: [42000, 43000, 42800, 44500, 46000, 45500, 47000, 46800, 48000],
		tradingViewSymbol: 'BINANCE:BTCUSDT',
		tradingViewInterval: '60'
	},
	{
		id: 'nasdaq',
		name: '나스닥',
		symbol: 'IXIC',
		color: '#2962ff',
		data: [15000, 15120, 15180, 15220, 15190, 15300, 15450, 15600, 15520],
		tradingViewSymbol: 'NASDAQ:IXIC',
		tradingViewInterval: '60'
	},
	{
		id: 'kospi',
		name: '코스피',
		symbol: 'KS11',
		color: '#00c853',
		data: [2600, 2610, 2595, 2620, 2640, 2655, 2660, 2675, 2668],
		tradingViewSymbol: 'INDEX:KOSPI',
		tradingViewInterval: '60'
	},
	{
		id: 'nasdaq100',
		name: '나스닥 100',
		symbol: 'NDX',
		color: '#651fff',
		data: [18000, 18120, 18090, 18240, 18360, 18420, 18550, 18700, 18640],
		tradingViewSymbol: 'NASDAQ:NDX',
		tradingViewInterval: '60'
	},
	{
		id: 'sp500',
		name: 'S&P 500',
		symbol: 'SPX',
		color: '#ef5350',
		data: [5200, 5225, 5215, 5240, 5260, 5285, 5290, 5310, 5300],
		tradingViewSymbol: 'SP:SPX',
		tradingViewInterval: '60'
	},
	{
		id: 'kosdaq',
		name: '코스닥',
		symbol: 'KQ11',
		color: '#ff6d00',
		data: [840, 845, 842, 848, 850, 855, 858, 861, 860],
		tradingViewSymbol: 'KRX:KQ11',
		tradingViewInterval: '60'
	},
	{
		id: 'usdkrw',
		name: '달러/원',
		symbol: 'USD/KRW',
		color: '#00838f',
		data: [1340, 1338, 1345, 1348, 1352, 1349, 1346, 1344, 1341],
		tradingViewSymbol: 'FX_IDC:USDKRW',
		tradingViewInterval: '60'
	},
	{
		id: 'ust10y',
		name: '미 10년물',
		symbol: 'UST10Y',
		color: '#ffb300',
		data: [4.1, 4.12, 4.08, 4.15, 4.18, 4.2, 4.22, 4.24, 4.2],
		tradingViewSymbol: 'TVC:US10Y',
		tradingViewInterval: 'D'
	},
	{
		id: 'ktb3y',
		name: '국고채 3년',
		symbol: 'KTB3Y',
		color: '#5d4037',
		data: [3.1, 3.08, 3.09, 3.11, 3.12, 3.13, 3.12, 3.14, 3.1],
		tradingViewSymbol: 'TVC:KR3Y',
		tradingViewInterval: 'D'
	},
	{
		id: 'wti',
		name: '원유',
		symbol: 'WTI',
		color: '#546e7a',
		data: [78, 79.5, 80, 79.8, 81.2, 82.1, 81.6, 82.8, 83.3],
		tradingViewSymbol: 'TVC:USOIL',
		tradingViewInterval: '60'
	},
	{
		id: 'gold',
		name: '금',
		symbol: 'XAU',
		color: '#ffd600',
		data: [2030, 2042, 2035, 2055, 2060, 2072, 2068, 2075, 2088],
		tradingViewSymbol: 'TVC:GOLD',
		tradingViewInterval: '60'
	},
	{
		id: 'btc-dominance',
		name: '비트 도미넌스',
		symbol: 'BTC.D',
		color: '#ff9100',
		data: [51.5, 52, 52.4, 52.1, 52.6, 53, 52.8, 53.2, 52.9],
		tradingViewSymbol: 'CRYPTOCAP:BTC.D',
		tradingViewInterval: '60'
	}
];
