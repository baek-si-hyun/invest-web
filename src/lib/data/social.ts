export type SocialPost = {
	id: string;
	nickname: string;
	handle: string;
	avatar: string;
	content: string;
	timeAgo: string;
	detail: string;
	platform: 'x' | 'facebook';
	platformLabel: string;
	url?: string;
	reactions?: {
		likes: number;
		comments: number;
		shares: number;
	};
};

export type SocialPlatform = {
	id: 'x' | 'facebook';
	label: string;
	description: string;
	posts: SocialPost[];
};

export const socialPlatforms: SocialPlatform[] = [
	{
		id: 'x',
		label: 'X (Twitter)',
		description: '실시간 글로벌 인플루언서 메시지를 큐레이션합니다.',
		posts: [
			{
				id: 'x-elonmusk',
				nickname: 'Elon Musk',
				handle: '@elonmusk',
				avatar: 'https://ui-avatars.com/api/?name=EM&background=1f2937&color=fff',
				content: 'Starship 3 시험 비행 준비 완료. FAA 승인만 남았습니다. 보카치카는 오늘도 분주하네요.',
				timeAgo: '8분 전',
				detail:
					'머스크는 스타십 3차 시험 비행을 위한 연료 주입 리허설이 성공적으로 끝났다고 전하며, 승인 직후 발사 일정을 공유하겠다고 밝혔습니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/elonmusk/status/0000000000',
				reactions: { likes: 152000, comments: 28400, shares: 43600 }
			},
			{
				id: 'x-elonmusk-2',
				nickname: 'Elon Musk',
				handle: '@elonmusk',
				avatar: 'https://ui-avatars.com/api/?name=EM&background=1f2937&color=fff',
				content: '테슬라 FSD v13 OTA 배포가 곧 시작됩니다. 기존 대비 도시 주행이 크게 개선됐습니다.',
				timeAgo: '18분 전',
				detail:
					'실도로 데이터 학습을 바탕으로 회피와 차선 변경 로직을 다시 설계했습니다. 북미 고객부터 순차적으로 배포합니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/elonmusk/status/0000000001',
				reactions: { likes: 98000, comments: 16400, shares: 22800 }
			},
			{
				id: 'x-cathiewood',
				nickname: 'Cathie Wood',
				handle: '@CathieDWood',
				avatar: 'https://ui-avatars.com/api/?name=CW&background=1e3a8a&color=fff',
				content: 'ARKK는 AI와 로보틱스 혁신주에 대한 비중을 다시 확대했습니다. 장기 성장 스토리를 믿습니다.',
				timeAgo: '16분 전',
				detail:
					'캐시 우드는 아크인베스트의 최신 리밸런싱을 공유하며, AI와 자동화 분야의 생산성 혁명이 이제 막 시작됐다고 강조했습니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/CathieDWood/status/0000000000',
				reactions: { likes: 18400, comments: 2200, shares: 5300 }
			},
			{
				id: 'x-cathiewood-2',
				nickname: 'Cathie Wood',
				handle: '@CathieDWood',
				avatar: 'https://ui-avatars.com/api/?name=CW&background=1e3a8a&color=fff',
				content: '유전체학과 자율주행 ETF를 재가중했습니다. 시장은 아직 혁신 프리미엄을 충분히 반영하지 못하고 있어요.',
				timeAgo: '42분 전',
				detail:
					'DNA 시퀀싱 비용이 다시 하락세에 접어들었고, 전기차와 로보택시의 TAM도 확대되고 있습니다. 기술적 돌파구가 나오는 순간 밸류에이션은 재평가될 것입니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/CathieDWood/status/0000000001',
				reactions: { likes: 12600, comments: 1700, shares: 3500 }
			},
			{
				id: 'x-chamath',
				nickname: 'Chamath Palihapitiya',
				handle: '@chamath',
				avatar: 'https://ui-avatars.com/api/?name=CP&background=4c1d95&color=fff',
				content: '미 연준의 다음 단계는 더 길고 느린 긴축입니다. 성장주에 대한 헤지 전략을 다시 검토하세요.',
				timeAgo: '25분 전',
				detail:
					'샤마스는 팟캐스트 링크와 함께 매크로 전망을 정리하며, 향후 12개월 안의 금리 경로가 리스크 자산 배분의 핵심이 될 것이라고 설명했습니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/chamath/status/0000000000',
				reactions: { likes: 9700, comments: 1100, shares: 2700 }
			},
			{
				id: 'x-chamath-2',
				nickname: 'Chamath Palihapitiya',
				handle: '@chamath',
				avatar: 'https://ui-avatars.com/api/?name=CP&background=4c1d95&color=fff',
				content: '벤처 투자 사이클이 재점화되고 있습니다. 내년도 시리즈 A 밸류에이션은 다르게 보셔야 합니다.',
				timeAgo: '1시간 전',
				detail:
					'금리 상승 이후 위축됐던 성장 자본이 AI 인프라와 기후 기술로 이동하고 있습니다. 질 좋은 파이프라인을 확보한 GP라면 2025년이 기회가 될 것입니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/chamath/status/0000000001',
				reactions: { likes: 8300, comments: 900, shares: 2100 }
			},
			{
				id: 'x-pompliano',
				nickname: 'Anthony Pompliano',
				handle: '@APompliano',
				avatar: 'https://ui-avatars.com/api/?name=AP&background=0369a1&color=fff',
				content: '비트코인 채굴 해시레이트가 사상 최고치. 기관 자금이 다시 유입되고 있습니다.',
				timeAgo: '33분 전',
				detail:
					'ETF 시장의 순유입이 꾸준히 이어지고 있으며, 채굴 난이도 상승이 공급 축소 압력을 더하고 있습니다. 장기 투자자들의 미실현 손익도 개선되는 추세입니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/APompliano/status/0000000000',
				reactions: { likes: 14200, comments: 1800, shares: 4100 }
			},
			{
				id: 'x-pompliano-2',
				nickname: 'Anthony Pompliano',
				handle: '@APompliano',
				avatar: 'https://ui-avatars.com/api/?name=AP&background=0369a1&color=fff',
				content: '채굴 기업들의 현금흐름이 전년 대비 2배. 에너지 효율 투자가 결실을 보고 있습니다.',
				timeAgo: '50분 전',
				detail:
					'에너지 비용을 낮춘 기업 중심으로 M&A가 활발하게 일어나고 있습니다. 장기적으로는 재생에너지 연계가 가장 중요한 경쟁력입니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/APompliano/status/0000000001',
				reactions: { likes: 9800, comments: 1300, shares: 2500 }
			},
			{
				id: 'x-raydalio',
				nickname: 'Ray Dalio',
				handle: '@RayDalio',
				avatar: 'https://ui-avatars.com/api/?name=RD&background=0f172a&color=fff',
				content: '글로벌 부채 구조가 새로운 균형을 찾아야 합니다. 다극화 시대의 투자 전략은 다층적이어야 하죠.',
				timeAgo: '42분 전',
				detail:
					'미국과 중국, 유럽의 재정정책이 동시다발적으로 확장되는 만큼, 인플레이션과 성장률의 균형을 주기적으로 점검해야 합니다. 다양한 통화에 분산된 포트폴리오가 핵심입니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/RayDalio/status/0000000000',
				reactions: { likes: 21300, comments: 2600, shares: 6800 }
			},
			{
				id: 'x-raydalio-2',
				nickname: 'Ray Dalio',
				handle: '@RayDalio',
				avatar: 'https://ui-avatars.com/api/?name=RD&background=0f172a&color=fff',
				content: '균형 잡힌 포트폴리오는 항상 “만약에”라는 질문에 답할 수 있어야 합니다.',
				timeAgo: '58분 전',
				detail:
					'각 자산이 서로 다른 경제 환경에서 어떻게 반응하는지를 이해한다면, 변동성 속에서도 일정한 성과를 유지할 수 있습니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/RayDalio/status/0000000001',
				reactions: { likes: 17400, comments: 2100, shares: 5400 }
			},
			{
				id: 'x-michaelburry',
				nickname: 'Michael Burry',
				handle: '@michaeljburry',
				avatar: 'https://ui-avatars.com/api/?name=MB&background=111827&color=fff',
				content: '최근 12개월 S&P 상승은 이익보다 밸류에이션 확장 덕분. 리스크 관리는 선택이 아니라 필수입니다.',
				timeAgo: '58분 전',
				detail:
					'성장 스토리만으로 가격이 오르는 구간에는 방어적 섹터와 현금 비중을 조절해야 합니다. 실적 서프라이즈가 없다면 고평가 영역은 쉽게 흔들릴 수 있습니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/michaeljburry/status/0000000000',
				reactions: { likes: 49800, comments: 9200, shares: 12000 }
			},
			{
				id: 'x-michaelburry-2',
				nickname: 'Michael Burry',
				handle: '@michaeljburry',
				avatar: 'https://ui-avatars.com/api/?name=MB&background=111827&color=fff',
				content: '자사주 매입이 실적보다 빠르게 증가할 때는 실질 현금흐름을 반드시 점검하세요.',
				timeAgo: '2시간 전',
				detail:
					'회사가 단기 주가 부양을 위해 재무 구조를 훼손하고 있는지, 아니면 내재 가치를 반영하려는 것인지 구분해야 합니다.',
				platform: 'x',
				platformLabel: 'X (Twitter)',
				url: 'https://twitter.com/michaeljburry/status/0000000001',
				reactions: { likes: 37200, comments: 6100, shares: 8400 }
			}
		]
	},
	{
		id: 'facebook',
		label: '페이스북',
		description: '투자자와 CEO들의 공식 페이스북 업데이트를 확인하세요.',
		posts: [
			{
				id: 'fb-zuck',
				nickname: 'Mark Zuckerberg',
				handle: 'facebook.com/zuck',
				avatar: 'https://ui-avatars.com/api/?name=MZ&background=14532d&color=fff',
				content: '메타 AI 스튜디오가 전 세계 개발자에게 오픈되었습니다. 생성형 AI가 메타버스를 완성할 것입니다.',
				timeAgo: '11분 전',
				detail:
					'저커버그는 신규 AI 스튜디오의 기능 소개 영상을 공유하며, 커뮤니티와 크리에이터가 직접 에이전트를 구축해 상호작용을 확장할 수 있다고 전했습니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/zuck/posts/0000000000',
				reactions: { likes: 253000, comments: 10400, shares: 7800 }
			},
			{
				id: 'fb-zuck-2',
				nickname: 'Mark Zuckerberg',
				handle: 'facebook.com/zuck',
				avatar: 'https://ui-avatars.com/api/?name=MZ&background=14532d&color=fff',
				content: 'Quest 4 Pro에 메타 AI 코어를 통합합니다. 현실과 가상이 더 자연스럽게 연결됩니다.',
				timeAgo: '29분 전',
				detail:
					'새로운 인터페이스는 손 제스처, 음성, 시각 신호를 동시에 인식합니다. 교육과 협업 사례가 빠르게 늘고 있습니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/zuck/posts/0000000001',
				reactions: { likes: 198000, comments: 8600, shares: 11300 }
			},
			{
				id: 'fb-billgates',
				nickname: 'Bill Gates',
				handle: 'facebook.com/BillGates',
				avatar: 'https://ui-avatars.com/api/?name=BG&background=0f766e&color=fff',
				content: '아프리카 말라리아 백신 프로젝트가 새로운 전기를 맞았습니다. 파트너 기관들의 노력에 감사드립니다.',
				timeAgo: '22분 전',
				detail:
					'빌 게이츠는 재단과 협력한 글로벌 보건 단체들의 진전을 전하며, 팬데믹 이후에도 백신 접근성을 넓히기 위한 투자가 계속될 것이라고 밝혔습니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/BillGates/posts/0000000000',
				reactions: { likes: 187000, comments: 6200, shares: 5400 }
			},
			{
				id: 'fb-billgates-2',
				nickname: 'Bill Gates',
				handle: 'facebook.com/BillGates',
				avatar: 'https://ui-avatars.com/api/?name=BG&background=0f766e&color=fff',
				content: 'AI 튜터 프로그램이 인도 농촌 지역 학생들에게도 제공됩니다. 현지 언어 지원이 큰 의미가 있죠.',
				timeAgo: '37분 전',
				detail:
					'비영리 단체와 협력해 카리큘럼을 현지화했습니다. 인터넷 연결이 취약한 지역에서도 사용할 수 있도록 오프라인 모드를 강화했습니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/BillGates/posts/0000000001',
				reactions: { likes: 164000, comments: 5400, shares: 4600 }
			},
			{
				id: 'fb-richardbranson',
				nickname: 'Richard Branson',
				handle: 'facebook.com/RichardBranson',
				avatar: 'https://ui-avatars.com/api/?name=RB&background=9d174d&color=fff',
				content: '버진 갤럭틱은 2025년 상업 비행 티켓을 위한 사전 예약을 다시 시작합니다.',
				timeAgo: '34분 전',
				detail:
					'리처드 브랜슨은 차세대 우주선 개발 진행 상황을 공유하며, 안전성 강화와 파트너십 확대 계획을 소개했습니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/RichardBranson/posts/0000000000',
				reactions: { likes: 56000, comments: 3100, shares: 2400 }
			},
			{
				id: 'fb-richardbranson-2',
				nickname: 'Richard Branson',
				handle: 'facebook.com/RichardBranson',
				avatar: 'https://ui-avatars.com/api/?name=RB&background=9d174d&color=fff',
				content: '버진 그룹의 지속가능성 리포트를 공개했습니다. 2030년 넷제로 목표는 그대로입니다.',
				timeAgo: '53분 전',
				detail:
					'항공, 우주, 리테일 등 다양한 사업에서 탄소 저감 목표를 업데이트했습니다. 파트너들과의 협력 사례도 공유했습니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/RichardBranson/posts/0000000001',
				reactions: { likes: 43800, comments: 2800, shares: 2100 }
			},
			{
				id: 'fb-satyanadella',
				nickname: 'Satya Nadella',
				handle: 'facebook.com/SatyaNadella',
				avatar: 'https://ui-avatars.com/api/?name=SN&background=1e3a8a&color=fff',
				content: 'Azure AI 인프라에 새로운 코파일럿 기능을 추가했습니다. 개발자 생산성이 다시 한번 도약할 것입니다.',
				timeAgo: '19분 전',
				detail:
					'기업 고객이 자체 데이터로 AI 워크플로를 구축할 수 있도록 파트너십을 확대하고 있습니다. 보안과 거버넌스를 강화하는 것이 이번 업데이트의 핵심입니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/SatyaNadella/posts/0000000000',
				reactions: { likes: 96000, comments: 4800, shares: 5100 }
			},
			{
				id: 'fb-satyanadella-2',
				nickname: 'Satya Nadella',
				handle: 'facebook.com/SatyaNadella',
				avatar: 'https://ui-avatars.com/api/?name=SN&background=1e3a8a&color=fff',
				content: '마이크로소프트 빌드 2025 등록이 시작됐습니다. 올해의 키노트는 “에이전트”입니다.',
				timeAgo: '41분 전',
				detail:
					'개발자 커뮤니티가 클라우드와 엣지 AI를 어떻게 연결할지 보여드릴 예정입니다. 하이브리드 업무 환경에서의 협업도 큰 화두입니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/SatyaNadella/posts/0000000001',
				reactions: { likes: 72000, comments: 4200, shares: 3600 }
			},
			{
				id: 'fb-jensenhuang',
				nickname: 'Jensen Huang',
				handle: 'facebook.com/JensenHuang',
				avatar: 'https://ui-avatars.com/api/?name=JH&background=701a75&color=fff',
				content: '신규 데이터센터 GPU 라인업 공개. 가속 컴퓨팅의 새로운 표준이 될 것입니다.',
				timeAgo: '31분 전',
				detail:
					'AI와 HPC 워크로드를 동시에 처리할 수 있도록 설계했습니다. 파트너사와의 협력을 통해 생태계 확장을 가속화하겠습니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/JensenHuang/posts/0000000000',
				reactions: { likes: 128000, comments: 7200, shares: 6800 }
			},
			{
				id: 'fb-jensenhuang-2',
				nickname: 'Jensen Huang',
				handle: 'facebook.com/JensenHuang',
				avatar: 'https://ui-avatars.com/api/?name=JH&background=701a75&color=fff',
				content: '소프트웨어 생태계와의 협업 없이는 GPU 혁신도 의미가 없습니다. 오늘은 파트너 개발자들의 이야기를 전합니다.',
				timeAgo: '1시간 전',
				detail:
					'NVIDIA 개발자 프로그램이 전 세계 400만 명으로 성장했습니다. 우리는 더 많은 도구와 교육을 제공해 함께 나아가려 합니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/JensenHuang/posts/0000000001',
				reactions: { likes: 102000, comments: 5800, shares: 4900 }
			},
			{
				id: 'fb-whitneywolfe',
				nickname: 'Whitney Wolfe Herd',
				handle: 'facebook.com/WhitneyWolfeHerd',
				avatar: 'https://ui-avatars.com/api/?name=WH&background=0f766e&color=fff',
				content: '여성 창업가 지원 펀드를 새로 조성했습니다. 네트워킹과 멘토링이 함께 합니다.',
				timeAgo: '47분 전',
				detail:
					'기술과 헬스케어 분야 스타트업을 중심으로 초기 투자를 확대합니다. 다음 세대 창업가들이 더 많은 기회를 얻을 수 있도록 하겠습니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/WhitneyWolfeHerd/posts/0000000000',
				reactions: { likes: 42000, comments: 3500, shares: 2600 }
			},
			{
				id: 'fb-whitneywolfe-2',
				nickname: 'Whitney Wolfe Herd',
				handle: 'facebook.com/WhitneyWolfeHerd',
				avatar: 'https://ui-avatars.com/api/?name=WH&background=0f766e&color=fff',
				content: '여성 리더십 서밋 신청이 마감 임박입니다. 올해는 기술, 금융, 헬스케어 세션을 준비했어요.',
				timeAgo: '58분 전',
				detail:
					'창업가와 임원들이 직접 경험을 공유하는 세션 외에도 1:1 멘토링을 제공합니다. 커뮤니티의 힘을 믿습니다.',
				platform: 'facebook',
				platformLabel: '페이스북',
				url: 'https://www.facebook.com/WhitneyWolfeHerd/posts/0000000001',
				reactions: { likes: 37400, comments: 3100, shares: 2400 }
			}
		]
	}
];
