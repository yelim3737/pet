import { Product, Review } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '부드러운 구름 산책 하네스',
    englishName: 'Soft Cloud Walking Harness',
    category: 'walk',
    categoryKo: '산책/외출',
    price: 19200,
    originalPrice: 24000,
    rating: 4.8,
    reviewCount: 85,
    image: '/images/harness_white_puppy_1780996460890.png',

    additionalImages: [
    '/images/harness_white_puppy_1780996460890.png',
    '/images/hero_white_puppy_1780996428332.png',
    '/images/insta1_white_puppy_1780996526397.png'
    ],
    badge: 'Best Seller',
    description: '구름 위를 걷는 듯 가볍고 부드러운 착용감의 프리미엄 하네스',
    descriptionLong: '아이가 산책할 때 목과 등 부위에 가해지는 압력을 분산시켜 호흡기를 안전하게 보호하고 자극을 완벽하게 줄여줍니다. 엄격하게 세탁 세척 테스트를 거친 오가닉 순면과 고탄성 메모리 메시 패드를 결합하여 사계절 쾌적하게 사용할 수 있는 부드러운 구름 하네스를 만나보세요.',
    options: [
      {
        type: 'color',
        name: '색상',
        values: ['스노우 화이트', '클라우드 블루', '파우더 핑크']
      },
      {
        type: 'size',
        name: '사이즈',
        values: ['S', 'M', 'L'],
        descriptions: [
          'S (~3kg, 가슴둘레 30-36cm)',
          'M (3-6kg, 가슴둘레 35-42cm)',
          'L (6-10kg, 가슴둘레 40-52cm)'
        ]
      }
    ],
    highlights: [
      '3D 인체공학적 마름모 구조로 기도 압박 및 쓸림 철저 방지',
      '민감한 피부를 가진 아이들도 안심할 수 있는 100% 무자극 오가닉 면 안감',
      '간편하고 직관적인 One-touch 특허 메탈 버클로 3초 빠른 착용',
      '야간 산책 전용 고휘도 3M 반사 라이닝 가공 안전 디자인'
    ]
  },
  {
    id: '2',
    name: '바스락 삑삑이 파스텔 장난감',
    englishName: 'Rustling Squeaker Pastel Toy',
    category: 'toy',
    categoryKo: '장난감/교육',
    price: 6800,
    originalPrice: 8500,
    rating: 4.7,
    reviewCount: 42,
    image: '/src/assets/images/toy_white_puppy_1780996475478.png',
    additionalImages: [
      '/src/assets/images/toy_white_puppy_1780996475478.png',
      '/src/assets/images/insta2_white_puppy_1780996540069.png',
      '/src/assets/images/insta1_white_puppy_1780996526397.png'
    ],
    badge: 'Popular',
    description: '하루 종일 지루할 틈 없는 신기한 바스락 소리와 중독성 있는 삑삑이',
    descriptionLong: '귀여운 감성 가득한 파스텔 톤 패브릭 내부에 고농도 비스페놀A 프리 크라프트 사운드 필름과 프리미엄 소프트 에어 삑삑이가 탑재되어, 터치할 때마다 아이의 호기심을 극대화시켜 스트레스를 완전 해소해 주는 소소한 펫 시그니처 토이입니다.',
    options: [
      {
        type: 'design',
        name: '디자인 선택',
        values: ['싱그러운 당근', '둥실둥실 구름', '달콤한 뼈다귀']
      }
    ],
    highlights: [
      '호기심을 극대화하는 깊은 바스락 크런키 필름 및 명쾌한 삑삑이 음색',
      '치실 효과를 고려한 이중 꼬임 100% 무독성 코튼 천연 염색 옥수수사 마감',
      '놀면서 플라크 침착 방지를 도와주는 섬세한 치석 스크래쳐 직조 방식',
      '여러 번 세탁해도 변형이 적은 초음파 세척 내구성 마감'
    ]
  },
  {
    id: '3',
    name: '포근한 무중력 구름 침대',
    englishName: 'Cozy Zero-Gravity Cloud Bed',
    category: 'living',
    categoryKo: '리빙/하우스',
    price: 39200,
    originalPrice: 49000,
    rating: 4.9,
    reviewCount: 128,
    image: '/src/assets/images/bed_white_puppy_1780996491376.png',
    additionalImages: [
      '/src/assets/images/bed_white_puppy_1780996491376.png',
      '/src/assets/images/insta2_white_puppy_1780996540069.png'
    ],
    badge: 'Best Bed',
    description: '한 번 누우면 영원히 잠들 것 같은 극강의 포근함을 선사하는 고밀도 숨결 침대',
    descriptionLong: '아이가 누웠을 때 체중과 중력을 효과적으로 분산시켜 관절 건강에 무리를 주지 않는 무중력 충전 솜을 가득 채웠습니다. 털 날림이나 보풀 발생이 현저히 적은 최고급 마이크로파이버 기능성 극세사 양면 원단으로, 아이에게 가장 완벽하고 위생적인 수면을 선물하세요.',
    options: [
      {
        type: 'color',
        name: '색상',
        values: ['밀크 크림', '라떼 브라운', '오트밀 베이지']
      },
      {
        type: 'size',
        name: '사이즈',
        values: ['M (지름 50cm)', 'L (지름 65cm)'],
        descriptions: [
          'M: 5kg 미만 아가 권장',
          'L: 5kg 이상 중소형견 아가 권장'
        ]
      }
    ],
    highlights: [
      '관절 압박을 무중력으로 정밀 지지해주는 프리미엄 메모리볼 7:3 충전 비율',
      '양면 기능성 코튼 (여름철 촉촉 시원 코튼 / 겨울철 소프트 체온 보호 극세사)',
      '바닥 미끄럼을 확실하게 밀착 방지 처리한 실리콘 논슬립 도트 코팅 패드',
      '완벽 커버 분리 설계 및 지퍼 안장 안전성 가드를 입혀 손쉬운 코튼 통세탁'
    ]
  },
  {
    id: '4',
    name: '수제 수비드 연어 저키 간식',
    englishName: 'Handmade Sous-Vide Salmon Jerky Treat',
    category: 'treat',
    categoryKo: '간식/영양제',
    price: 9600,
    originalPrice: 12000,
    rating: 5.0,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1608454367599-c1139e64bf87?auto=format&fit=crop&q=80&w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1608454367599-c1139e64bf87?auto=format&fit=crop&q=80&w=600'
    ],
    badge: '100% Organic',
    description: '청정 알래스카 연어의 영양을 72도 수비드로 부드럽게 가둔 단백질 명작',
    descriptionLong: '소중한 반려견과 반려묘를 위해 인공 보존료나 불필요한 감미료를 단 1g도 첨가하지 않고 오로지 자연 연어 오리지널 그대로를 신선하게 슬라이스해 구워냈습니다. 수비드 정성 온도로 유효 오메가3 불포화지방산과 아미노산 손실을 제로화해 모질 개선 효과가 매우 우수합니다.',
    options: [
      {
        type: 'design',
        name: '선택 종류',
        values: ['바삭 연어 슬라이스 (70g)', '말랑 반건조 소프트 저키 (60g)']
      }
    ],
    highlights: [
      '부산물을 전혀 넣지 않은 엄선된 100% 휴먼그레이드 프리미엄 알래스카 연어',
      '콜레스테롤 수치 조절 및 윤기 나는 피모 영양에 풍부한 풍미의 오메가-3 DHA',
      '위생을 위한 위생 진공 개별 소포장 (하루 한 팩 깔끔 간식 급여 가능)',
      'HACCP 국제 표준 인증 시설에서 무균 설계로 안심 가공한 깨끗함'
    ]
  },
  {
    id: '5',
    name: '무독성 세라믹 이중 식기 세트',
    englishName: 'Non-Toxic Ceramic Double Bowl Set',
    category: 'living',
    categoryKo: '리빙/하우스',
    price: 27200,
    originalPrice: 32000,
    rating: 4.9,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1591946614421-1d65b6b33c0d?auto=format&fit=crop&q=80&w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1591946614421-1d65b6b33c0d?auto=format&fit=crop&q=80&w=600'
    ],
    badge: 'Eco Friendly',
    description: '아이들의 턱드름을 전면 방지하는 고아한 감성의 세라믹 볼과 원목 거치대',
    descriptionLong: '아이가 식사를 하거나 물을 마실 때 목이나 척추에 긴장을 최소화해 주는 최적의 경사각(12도)과 높이를 계산 설계하여 소화 흡수를 촉진합니다. 수분을 흡수하지 않는 완전 밀폐 최고급 세라믹 식기는 세균 번식을 완전 방지하며, 전자레인지 및 식기세척기 사용이 가능해 간편합니다.',
    options: [
      {
        type: 'color',
        name: '거치대 구성',
        values: ['네츄럴 자작나무 거치대', '클래식 시나몬 월넛 거치대']
      }
    ],
    highlights: [
      '사료와 물을 동시에 예쁘게 서브하는 정교하게 마감된 듀얼 이중 구도 디자인',
      '피부 트러블이나 기름기 턱드름을 없앨 수 있는 안전한 1250도 초고온 소성 자기',
      '식사 시 미끄러짐과 엎지름을 완벽 차단하는 고무 논슬립 원목 림',
      '볼과 프레임 전면 이탈 설계로 깔끔하고 위생적인 개별 온수 소독 세척 가능'
    ]
  },
  {
    id: '6',
    name: '코지 루즈핏 니트 케이프 코트',
    englishName: 'Cozy Loose-Fit Knit Cape Coat',
    category: 'clothing',
    categoryKo: '의류/악세서리',
    price: 22000,
    originalPrice: 27500,
    rating: 4.8,
    reviewCount: 39,
    image: '/src/assets/images/apparel_white_puppy_1780996511402.png',
    additionalImages: [
      '/src/assets/images/apparel_white_puppy_1780996511402.png',
      '/src/assets/images/insta3_white_puppy_1780996554923.png'
    ],
    badge: 'New Arrival',
    description: '포근하고 신축성이 훌륭한 파스텔 레이어드 니트 스타일 패션 아이템',
    descriptionLong: '아이의 바디 라인을 유연하게 부드럽게 감싸주는 프리미엄 스트레치 이중직 조직의 니트웨어입니다. 단추나 지나치게 조이는 고무선 없이 머리로 쏙 넣어 착용시키는 스마트 이지 코트 설계로 옷 입기 싫어하는 피키한 아이들에게 최선의 프리미엄 옷입니다.',
    options: [
      {
        type: 'color',
        name: '색상',
        values: ['마시멜로우 크림', '스트로베리 핑크', '소프트 민트']
      },
      {
        type: 'size',
        name: '사이즈',
        values: ['S', 'M', 'L']
      }
    ],
    highlights: [
      '미세 보풀 및 정전기 발생을 현격하게 개선한 특수 안티필링 극세사 코튼실 배합',
      '아이의 활발한 어깨 및 힙 스텝 움직임을 편안하게 도와주는 와이드 입체 핏',
      '목선 늘어남과 늘어짐 현상을 보강 설계한 사중 인터록 짜임 하이넥 넥밴드'
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '1',
    productName: '부드러운 구름 산책 하네스',
    author: '지율맘 (말티즈 2.4kg)',
    rating: 5,
    date: '2026-06-05',
    content: '하네스 착용할 때마다 도망치던 저희 지율이가 이건 자극이 없는지 얌전히 기다려요! 색상 클라우드 블루 너무 우아하게 잘 빠졌고 가슴이 안 졸려서 켁켁거리는 소리가 한 번도 안 났습니다. 진짜 구름 같네요.',
    petInfo: '말티즈 2.4kg',
    likes: 18,
    options: '색상: 클라우드 블루 / 사이즈: S'
  },
  {
    id: 'r2',
    productId: '1',
    productName: '부드러운 구름 산책 하네스',
    author: '코코 누나 (푸들 4.8kg)',
    rating: 5,
    date: '2026-06-02',
    content: '코코는 푸들 특유의 긴 체형이라 사이즈 M으로 가니 가슴 폭이 여유롭게 아주 안성맞춤이에요! 무거운 쇳소리 나는 버클이 아니라 마감 원터치 버클이라 정말 간단하게 결합이 되어서 만족 200%입니다.',
    petInfo: '토이푸들 4.8kg',
    likes: 12,
    options: '색상: 스노우 화이트 / 사이즈: M'
  },
  {
    id: 'r3',
    productId: '2',
    productName: '바스락 삑삑이 파스텔 장난감',
    author: '시바대장 (시바견 9.2kg)',
    rating: 4,
    date: '2026-06-08',
    content: '당근 장난감 구매했습니다! 시바견 이빨 악력을 이겨낼 수 있을까 걱정했는데 매일 물어뜯고 흔들어도 바스락 필름 실링이 엄청 튼튼한지 찢김이 전혀 없어요. 삑삑이 소리가 맑아서 아주 좋아 죽습니다.',
    petInfo: '적시바 9.2kg',
    likes: 24,
    options: '디자인 선택: 싱그러운 당근'
  },
  {
    id: 'r4',
    productId: '3',
    productName: '포근한 무중력 구름 침대',
    author: '체리파파 (비숑 5.2kg)',
    rating: 5,
    date: '2026-06-07',
    content: '침대 꺼내주자마자 올라가서 턱 괴고 숙면을 취하네요... 대박입니다. 원래 제 베개 탐내던 녀석인데 이제 자기 무중력 침대에서 안 나와요! 커버가 완전히 분리되고 속에 지퍼 방어가 다 되어 있어서 맘 편히 세탁기에 넣고 빨 수 있는 점이 보호자로서 제일 흡족합니다.',
    petInfo: '비숑프리제 5.2kg',
    likes: 31,
    options: '색상: 오트밀 베이지 / 사이즈: L (지름 65cm)'
  },
  {
    id: 'r5',
    productId: '4',
    productName: '수제 수비드 연어 저키 간식',
    author: '초코마미 (웰시코기 11kg)',
    rating: 5,
    date: '2026-06-09',
    content: '개별 소포장이라 보관하기도 편하고, 뜯는 소리만 나면 아주 빛의 속도로 달려옵니다! 인위적인 화학 향이 전혀 아니라 진짜 고소하고 은은한 연어 냄새가 나요. 아몬드색 윤기 나는 모질로 바뀌고 있어요!',
    petInfo: '웰시코기 11kg',
    likes: 45,
    options: '선택 종류: 바삭 연어 슬라이스 (70g)'
  }
];

export const INSTAGRAM_POSTS = [
  {
    id: 'p1',
    image: '/src/assets/images/insta1_white_puppy_1780996526397.png',
    tag: '@moly_the_pup',
    caption: '구름 하네스 덕분에 산책길이 솜사탕처럼 가볍개 🌸 #소소한펫 #솜사탕산책'
  },
  {
    id: 'p2',
    image: '/src/assets/images/toy_white_puppy_1780996475478.png',
    tag: '@haru_shiba',
    caption: '당근 장난감 바스락 바스락 완전 내 최애 등극! 🧡 #바스락당근 #내돈내산 #소소한펫'
  },
  {
    id: 'p3',
    image: '/src/assets/images/bed_white_puppy_1780996491376.png',
    tag: '@cloud_bed_king',
    caption: '아무리 불러도 일어날 생각을 안 해요 침대가 마약인가 😴 #무중력침대 #댕댕이꿀잠'
  },
  {
    id: 'p4',
    image: '/src/assets/images/insta2_white_puppy_1780996540069.png',
    tag: '@happy_bichon_guri',
    caption: '연어 한 점 먹고 기분 날아갈 영리한 미소포즈 발사! 🐟 #수비드연어 #영양간식 #소소한펫'
  }
];
