// Danh mục 50 Dân tộc theo quy định (không số thứ tự, không chữ Dân tộc)
export const LAO_ETHNIC_GROUPS: string[] = [
  'Lao',
  'Tay',
  'Phu Thay',
  'Lue',
  'Yuan',
  'Yang',
  'Sack',
  'Thai Nuea',
  'Kummu',
  'Prai',
  'Sinh Mun',
  'Phong',
  'Than',
  'EĐu',
  'Bit',
  'Ramet',
  'Sam Tao',
  'Katang',
  'Makong',
  'Try',
  'Yaru',
  'Trieng',
  'Ta Oiy',
  'Yae',
  'Brau',
  'Katu',
  'Halak',
  'Oiy',
  'Krieg',
  'Cheng',
  'Sadang',
  'Xoay',
  'Nha Hon',
  'Wali',
  'Pako',
  'Khmer',
  'Tum',
  'Nguan',
  'Moy',
  'Gry',
  'Mong',
  'Liu Mian',
  'Akha',
  'Phu Noy',
  'Lahu',
  'Sila',
  'Hayi',
  'Lolo',
  'Ho',
  'Bruh',
];

// Danh mục Tôn giáo
export const RELIGION_OPTIONS = [
  'Phật giáo',
  'Kitô giáo',
  'Hồi giáo',
  'Baháʼí giáo',
];

// TODO: thay bằng danh mục đồng bộ từ Phần mềm quản trị ứng dụng (QTUD) khi sẵn sàng — giữ nguyên thuộc tính laGiapBienGioi
export interface LaoProvinceItem {
  name: string;
  laGiapBienGioi: boolean;
}

// Danh mục tất cả 18 Tỉnh/Thành phố của CHDCND Lào (kèm cờ laGiapBienGioi)
export const LAO_PROVINCE_ITEMS: LaoProvinceItem[] = [
  // 9 tỉnh thành giáp biên giới (laGiapBienGioi = true)
  { name: 'Bokeo', laGiapBienGioi: true },
  { name: 'Sainyabuli', laGiapBienGioi: true },
  { name: 'Vientiane', laGiapBienGioi: true },
  { name: 'Vientiane Prefecture', laGiapBienGioi: true },
  { name: 'Bolikhamxai', laGiapBienGioi: true },
  { name: 'Khammouane', laGiapBienGioi: true },
  { name: 'Savannakhet', laGiapBienGioi: true },
  { name: 'Salavan', laGiapBienGioi: true },
  { name: 'Champasak', laGiapBienGioi: true },
  // Các tỉnh còn lại không giáp biên giới (laGiapBienGioi = false)
  { name: 'Phongsaly', laGiapBienGioi: false },
  { name: 'Luang Namtha', laGiapBienGioi: false },
  { name: 'Oudomxay', laGiapBienGioi: false },
  { name: 'Luang Prabang', laGiapBienGioi: false },
  { name: 'Huaphanh', laGiapBienGioi: false },
  { name: 'Xiengkhouang', laGiapBienGioi: false },
  { name: 'Sekong', laGiapBienGioi: false },
  { name: 'Attapeu', laGiapBienGioi: false },
  { name: 'Xaisomboun', laGiapBienGioi: false },
];

// Danh sách tất cả 18 Tỉnh/Thành phố (dùng cho Nơi sinh, nơi cấp CMND, v.v. - KHÔNG lọc)
export const LAO_PROVINCES: string[] = LAO_PROVINCE_ITEMS.map((item) => item.name);

// Danh sách các Tỉnh/Thành phố biên giới (CHỈ dùng cho Nơi thường trú người nộp & Nơi thường trú của trẻ - CÓ lọc)
export const LAO_BORDER_PROVINCES: string[] = LAO_PROVINCE_ITEMS
  .filter((item) => item.laGiapBienGioi)
  .map((item) => item.name);

// Danh sách tất cả các tên hợp lệ giáp biên giới Thái Lan (bao gồm cả phiên âm/tên tiếng Việt cũ nếu người dùng gõ tự do)
const ELIGIBLE_BORDER_PROVINCES_LOWER = [
  'bokeo',
  'tỉnh bokeo',
  'sainyabuli',
  'xayabury',
  'tỉnh xayabury',
  'vientiane',
  'tỉnh vientiane',
  'vientiane prefecture',
  'thủ đô viêng chăn',
  'viêng chăn kampaeng nakhon',
  'bolikhamxai',
  'bolikhamxay',
  'tỉnh bolikhamxay',
  'khammouane',
  'tỉnh khammouane',
  'savannakhet',
  'tỉnh savannakhet',
  'salavan',
  'saravane',
  'tỉnh salavan',
  'champasak',
  'tỉnh champasak',
];

// Hàm kiểm tra tỉnh/thành có giáp biên giới Thái Lan (được cấp sổ/giấy thông hành) hay không
export function checkProvinceBorderEligibility(provinceName: string): boolean {
  if (!provinceName || !provinceName.trim()) return false;
  const normalized = provinceName.trim().toLowerCase();
  const found = LAO_PROVINCE_ITEMS.find(
    (item) => item.name.toLowerCase() === normalized
  );
  if (found) {
    return found.laGiapBienGioi;
  }
  return ELIGIBLE_BORDER_PROVINCES_LOWER.some(
    (p) => p === normalized || normalized.includes(p)
  );
}

// Danh mục chuẩn các Phòng Xuất nhập cảnh – Công an tỉnh giáp biên giới dùng cho Combobox
export const IMMIGRATION_OFFICE_OPTIONS: string[] = [
  'Phòng Xuất nhập cảnh – Công an tỉnh Bokeo',
  'Phòng Xuất nhập cảnh – Công an tỉnh Sainyabuli',
  'Phòng Xuất nhập cảnh – Công an tỉnh Vientiane',
  'Phòng Xuất nhập cảnh – Công an tỉnh Thủ đô Viêng Chăn (Vientiane Prefecture)',
  'Phòng Xuất nhập cảnh – Công an tỉnh Bolikhamxai',
  'Phòng Xuất nhập cảnh – Công an tỉnh Khammouane',
  'Phòng Xuất nhập cảnh – Công an tỉnh Savannakhet',
  'Phòng Xuất nhập cảnh – Công an tỉnh Salavan',
  'Phòng Xuất nhập cảnh – Công an tỉnh Champasak',
];

// Hàm chuẩn hóa và khớp cơ quan Xuất nhập cảnh dựa vào tên tỉnh hoặc địa chỉ người dùng
export function matchImmigrationOfficeOption(provOrAgency?: string): string {
  if (!provOrAgency) return '';
  const lower = provOrAgency.toLowerCase().trim();
  if (lower.includes('viêng chăn') || lower.includes('vientiane') || lower.includes('thủ đô')) {
    return 'Phòng Xuất nhập cảnh – Công an tỉnh Thủ đô Viêng Chăn (Vientiane Prefecture)';
  }
  if (lower.includes('bokeo')) {
    return 'Phòng Xuất nhập cảnh – Công an tỉnh Bokeo';
  }
  if (lower.includes('sainyabuli') || lower.includes('xayabury')) {
    return 'Phòng Xuất nhập cảnh – Công an tỉnh Sainyabuli';
  }
  if (lower.includes('bolikhamxai') || lower.includes('bolikhamxay')) {
    return 'Phòng Xuất nhập cảnh – Công an tỉnh Bolikhamxai';
  }
  if (lower.includes('khammouane')) {
    return 'Phòng Xuất nhập cảnh – Công an tỉnh Khammouane';
  }
  if (lower.includes('savannakhet')) {
    return 'Phòng Xuất nhập cảnh – Công an tỉnh Savannakhet';
  }
  if (lower.includes('salavan') || lower.includes('saravane')) {
    return 'Phòng Xuất nhập cảnh – Công an tỉnh Salavan';
  }
  if (lower.includes('champasak')) {
    return 'Phòng Xuất nhập cảnh – Công an tỉnh Champasak';
  }
  if (provOrAgency.startsWith('Phòng Xuất nhập cảnh')) {
    return provOrAgency;
  }
  return `Phòng Xuất nhập cảnh – Công an tỉnh ${provOrAgency}`;
}

// Danh mục Quận/Huyện theo Tỉnh/Thành
export const LAO_DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  'Bokeo': [
    'Huyện Houayxay',
    'Huyện Tonpheung',
    'Huyện Meung',
    'Huyện Pha Oudom',
    'Huyện Paktha',
  ],
  'Sainyabuli': [
    'Huyện Sainyabuli',
    'Huyện Khop',
    'Huyện Hongsa',
    'Huyện Ngeun',
    'Huyện Xienghone',
    'Huyện Phiang',
    'Huyện Parklai',
    'Huyện Kenethao',
    'Huyện Botene',
    'Huyện Thongmyxay',
    'Huyện Saysathan',
  ],
  'Vientiane': [
    'Huyện Phonhong',
    'Huyện Thoulakhom',
    'Huyện Keo Oudom',
    'Huyện Kasi',
    'Huyện Vang Vieng',
    'Huyện Feuang',
    'Huyện Xanakharm',
    'Huyện Mad',
    'Huyện Viengkham',
    'Huyện Hinhurp',
    'Huyện Meun',
  ],
  'Vientiane Prefecture': [
    'Huyện Chanthabuly',
    'Huyện Sikhottabong',
    'Huyện Xaysetha',
    'Huyện Sisattanak',
    'Huyện Naxaithong',
    'Huyện Xaythany',
    'Huyện Hadxayfong',
    'Huyện Sangthong',
    'Huyện Pakngum',
  ],
  'Bolikhamxai': [
    'Huyện Paksan',
    'Huyện Thaphabath',
    'Huyện Pakkading',
    'Huyện Borikhane',
    'Huyện Khamkeut',
    'Huyện Viengthong',
    'Huyện Xaychamphone',
  ],
  'Khammouane': [
    'Huyện Thakhek',
    'Huyện Mahaxay',
    'Huyện Nongbok',
    'Huyện Hinboun',
    'Huyện Nhommalath',
    'Huyện Bualapha',
    'Huyện Nakai',
    'Huyện Sebangphay',
    'Huyện Saybouathong',
    'Huyện Kouanphanh',
  ],
  'Savannakhet': [
    'Huyện Kaysone Phomvihane',
    'Huyện Outhoumphone',
    'Huyện Atsaphangthong',
    'Huyện Phine',
    'Huyện Sepon',
    'Huyện Nong',
    'Huyện Thapangthong',
    'Huyện Songkhone',
    'Huyện Champhone',
    'Huyện Xonbuly',
    'Huyện Xayboury',
    'Huyện Virabury',
    'Huyện Assaphone',
  ],
  'Salavan': [
    'Huyện Salavan',
    'Huyện Ta Oy',
    'Huyện Toumlan',
    'Huyện Lakhonepheng',
    'Huyện Vapy',
    'Huyện Khongxedone',
    'Huyện Lao Ngam',
    'Huyện Samoi',
  ],
  'Champasak': [
    'Huyện Pakse',
    'Huyện Sanasomboun',
    'Huyện Bachiangchaleunsook',
    'Huyện Paksong',
    'Huyện Pathoumphone',
    'Huyện Phonthong',
    'Huyện Champassak',
    'Huyện Sukhuma',
    'Huyện Mounlapamok',
    'Huyện Khong',
  ],
  // Tương thích ngược với tên tiếng Việt cũ nếu có
  'Thủ đô Viêng Chăn': [
    'Huyện Chanthabuly',
    'Huyện Sikhottabong',
    'Huyện Xaysetha',
    'Huyện Sisattanak',
    'Huyện Naxaithong',
    'Huyện Xaythany',
    'Huyện Hadxayfong',
    'Huyện Sangthong',
    'Huyện Pakngum',
  ],
  'Tỉnh Bokeo': [
    'Huyện Houayxay',
    'Huyện Tonpheung',
    'Huyện Meung',
    'Huyện Pha Oudom',
    'Huyện Paktha',
  ],
  'Tỉnh Xayabury': [
    'Huyện Sainyabuli',
    'Huyện Khop',
    'Huyện Hongsa',
    'Huyện Ngeun',
    'Huyện Xienghone',
    'Huyện Phiang',
    'Huyện Parklai',
    'Huyện Kenethao',
    'Huyện Botene',
    'Huyện Thongmyxay',
    'Huyện Saysathan',
  ],
  'Tỉnh Vientiane': [
    'Huyện Phonhong',
    'Huyện Thoulakhom',
    'Huyện Keo Oudom',
    'Huyện Kasi',
    'Huyện Vang Vieng',
    'Huyện Feuang',
    'Huyện Xanakharm',
    'Huyện Mad',
    'Huyện Viengkham',
    'Huyện Hinhurp',
    'Huyện Meun',
  ],
  'Tỉnh Bolikhamxay': [
    'Huyện Paksan',
    'Huyện Thaphabath',
    'Huyện Pakkading',
    'Huyện Borikhane',
    'Huyện Khamkeut',
    'Huyện Viengthong',
    'Huyện Xaychamphone',
  ],
  'Tỉnh Khammouane': [
    'Huyện Thakhek',
    'Huyện Mahaxay',
    'Huyện Nongbok',
    'Huyện Hinboun',
    'Huyện Nhommalath',
    'Huyện Bualapha',
    'Huyện Nakai',
    'Huyện Sebangphay',
    'Huyện Saybouathong',
    'Huyện Kouanphanh',
  ],
  'Tỉnh Savannakhet': [
    'Huyện Kaysone Phomvihane',
    'Huyện Outhoumphone',
    'Huyện Atsaphangthong',
    'Huyện Phine',
    'Huyện Sepon',
    'Huyện Nong',
    'Huyện Thapangthong',
    'Huyện Songkhone',
    'Huyện Champhone',
    'Huyện Xonbuly',
    'Huyện Xayboury',
    'Huyện Virabury',
    'Huyện Assaphone',
  ],
  'Tỉnh Salavan': [
    'Huyện Salavan',
    'Huyện Ta Oy',
    'Huyện Toumlan',
    'Huyện Lakhonepheng',
    'Huyện Vapy',
    'Huyện Khongxedone',
    'Huyện Lao Ngam',
    'Huyện Samoi',
  ],
  'Tỉnh Champasak': [
    'Huyện Pakse',
    'Huyện Sanasomboun',
    'Huyện Bachiangchaleunsook',
    'Huyện Paksong',
    'Huyện Pathoumphone',
    'Huyện Phonthong',
    'Huyện Champassak',
    'Huyện Sukhuma',
    'Huyện Mounlapamok',
    'Huyện Khong',
  ],
  'Luang Prabang': [
    'Huyện Luang Prabang',
    'Huyện Xiengngeun',
    'Huyện Nan',
    'Huyện Pak Ou',
    'Huyện Nam Bak',
    'Huyện Ngoi',
    'Huyện Pak Seng',
    'Huyện Phonxay',
    'Huyện Chomphet',
    'Huyện Viengkham',
    'Huyện Phoukhoun',
    'Huyện Phonthong',
  ],
  'Xiengkhouang': [
    'Huyện Pek',
    'Huyện Kham',
    'Huyện Nonghed',
    'Huyện Khoune',
    'Huyện Mok',
    'Huyện Phookood',
    'Huyện Phaxay',
  ],
  'Huaphanh': [
    'Huyện Xamneua',
    'Huyện Xiengkhor',
    'Huyện Hiam',
    'Huyện Viengxay',
    'Huyện Huameuang',
    'Huyện Samphan',
    'Huyện Sopbao',
    'Huyện Et',
    'Huyện Kouan',
    'Huyện Xonthe',
  ],
  'Phongsaly': [
    'Huyện Phongsaly',
    'Huyện May',
    'Huyện Khoua',
    'Huyện Samphan',
    'Huyện Boun Neua',
    'Huyện Yot Ou',
    'Huyện Boun Tay',
  ],
  'Luang Namtha': [
    'Huyện Luang Namtha',
    'Huyện Sing',
    'Huyện Long',
    'Huyện Viengphoukha',
    'Huyện Nalae',
  ],
  'Oudomxay': [
    'Huyện Xay',
    'Huyện La',
    'Huyện Namo',
    'Huyện Nga',
    'Huyện Beng',
    'Huyện Hoon',
    'Huyện Pakbeng',
  ],
  'Sekong': [
    'Huyện Lamam',
    'Huyện Kaleum',
    'Huyện Dakcheung',
    'Huyện Thateng',
  ],
  'Attapeu': [
    'Huyện Samakkixay',
    'Huyện Xaysetha',
    'Huyện Sanamxay',
    'Huyện Sanxay',
    'Huyện Phouvong',
  ],
  'Xaisomboun': [
    'Huyện Anouvong',
    'Huyện Longsane',
    'Huyện Xaysomboun',
    'Huyện Hom',
    'Huyện Thathom',
  ],
  'Tỉnh Luang Prabang': [
    'Huyện Luang Prabang',
    'Huyện Xiengngeun',
    'Huyện Nan',
    'Huyện Pak Ou',
    'Huyện Nam Bak',
    'Huyện Ngoi',
    'Huyện Pak Seng',
    'Huyện Phonxay',
    'Huyện Chomphet',
    'Huyện Viengkham',
    'Huyện Phoukhoun',
    'Huyện Phonthong',
  ],
  'Tỉnh Xiengkhouang': [
    'Huyện Pek',
    'Huyện Kham',
    'Huyện Nonghed',
    'Huyện Khoune',
    'Huyện Mok',
    'Huyện Phookood',
    'Huyện Phaxay',
  ],
  'Tỉnh Huaphanh': [
    'Huyện Xamneua',
    'Huyện Xiengkhor',
    'Huyện Hiam',
    'Huyện Viengxay',
    'Huyện Huameuang',
    'Huyện Samphan',
    'Huyện Sopbao',
    'Huyện Et',
    'Huyện Kouan',
    'Huyện Xonthe',
  ],
  'Tỉnh Phongsaly': [
    'Huyện Phongsaly',
    'Huyện May',
    'Huyện Khoua',
    'Huyện Samphan',
    'Huyện Boun Neua',
    'Huyện Yot Ou',
    'Huyện Boun Tay',
  ],
  'Tỉnh Luang Namtha': [
    'Huyện Luang Namtha',
    'Huyện Sing',
    'Huyện Long',
    'Huyện Viengphoukha',
    'Huyện Nalae',
  ],
  'Tỉnh Oudomxay': [
    'Huyện Xay',
    'Huyện La',
    'Huyện Namo',
    'Huyện Nga',
    'Huyện Beng',
    'Huyện Hoon',
    'Huyện Pakbeng',
  ],
  'Tỉnh Sekong': [
    'Huyện Lamam',
    'Huyện Kaleum',
    'Huyện Dakcheung',
    'Huyện Thateng',
  ],
  'Tỉnh Attapeu': [
    'Huyện Samakkixay',
    'Huyện Xaysetha',
    'Huyện Sanamxay',
    'Huyện Sanxay',
    'Huyện Phouvong',
  ],
  'Tỉnh Xaisomboun': [
    'Huyện Anouvong',
    'Huyện Longsane',
    'Huyện Xaysomboun',
    'Huyện Hom',
    'Huyện Thathom',
  ],
};

// Danh mục Bản/Thôn tiêu biểu theo Quận/Huyện
export const LAO_VILLAGES_BY_DISTRICT: Record<string, string[]> = {
  'Huyện Chanthabuly': [
    'Bản Thongkhankham',
    'Bản Sihom',
    'Bản Anou',
    'Bản Saylom',
    'Bản Hatsady',
    'Bản Khounxata',
    'Bản Dongmieng',
    'Bản Kaognhot',
    'Bản Phonetong',
    'Bản Simeuang',
  ],
  'Huyện Sisattanak': [
    'Bản Phonxay',
    'Bản Phonsinuan',
    'Bản Saphanthong Neua',
    'Bản Saphanthong Tai',
    'Bản Dongpalan',
    'Bản Sokpaluang',
    'Bản Thongkang',
    'Bản Donkoy',
    'Bản Wattanak',
  ],
  'Huyện Xaysetha': [
    'Bản Nongbone',
    'Bản That Luang',
    'Bản Phonthan',
    'Bản Chommany',
    'Bản Phonxeng',
    'Bản Saphanthong',
    'Bản Meuang Noi',
    'Bản Nonkhor',
  ],
  'Huyện Sikhottabong': [
    'Bản Wattay Yai',
    'Bản Wattay Noy',
    'Bản Nongteng',
    'Bản Akat',
    'Bản Nongbeuk',
    'Bản Oupmoung',
    'Bản Champa',
  ],
  'Huyện Xaythany': [
    'Bản Dongdok',
    'Bản Tanmixay',
    'Bản Sivilay',
    'Bản Xay',
    'Bản Phonkheng',
    'Bản Nonhai',
  ],
  'Huyện Naxaithong': [
    'Bản Naxaithong',
    'Bản Sikeuth',
    'Bản Houaynamyen',
    'Bản Dongnasok',
  ],
  'Huyện Hadxayfong': [
    'Bản Hadxayfong',
    'Bản Thadeua',
    'Bản Nongheo',
    'Bản Somvang',
  ],
  'Huyện Luang Prabang': [
    'Bản Luang Prabang',
    'Bản Xieng Mouane',
    'Bản Vat Nong',
    'Bản Mano',
    'Bản Phanom',
    'Bản Naluang',
  ],
  'Huyện Pakse': [
    'Bản Pakse',
    'Bản Thaluang',
    'Bản Phonxay',
    'Bản Sanambin',
    'Bản Houayhe',
  ],
  'Huyện Kaysone Phomvihane': [
    'Bản Kaysone',
    'Bản Latsavongxay',
    'Bản Sayaphoum',
    'Bản Phonsavang',
  ],
  'Huyện Thakhek': [
    'Bản Thakhek',
    'Bản Souksavanh',
    'Bản Nabo',
    'Bản Dongkasen',
  ],
  'Huyện Houayxay': [
    'Bản Houayxay Neua',
    'Bản Houayxay Tai',
    'Bản Khonekeo',
    'Bản Dom',
    'Bản Meung',
  ],
  'Huyện Sainyabuli': [
    'Bản Sainyabuli',
    'Bản Simoungkhoun',
    'Bản Thana',
    'Bản Sibounheuang',
    'Bản Phonsavang',
  ],
  'Huyện Xayabury': [
    'Bản Sainyabuli',
    'Bản Simoungkhoun',
    'Bản Thana',
    'Bản Sibounheuang',
    'Bản Phonsavang',
  ],
  'Huyện Phonhong': [
    'Bản Phonhong',
    'Bản Viengkham',
    'Bản Phonxay',
    'Bản Nam Phao',
    'Bản Dong',
  ],
  'Huyện Paksan': [
    'Bản Paksan',
    'Bản Phonsa',
    'Bản Mixay',
    'Bản Silivilay',
    'Bản Sanamxay',
  ],
  'Huyện Salavan': [
    'Bản Salavan',
    'Bản Vangxay',
    'Bản Naxay',
    'Bản Phonxay',
    'Bản Dong',
  ],
};

// Danh mục Đơn vị dưới bản (Đơn vị 1 -> Đơn vị 20)
export const LAO_UNITS_SAMPLE: string[] = Array.from(
  { length: 20 },
  (_, i) => `Đơn vị ${i + 1}`
);

// Dữ liệu mẫu (ghi chú trong code: thực tế đồng bộ từ phần mềm quản trị ứng dụng QTUD)
export const SAMPLE_BORDER_CHECKPOINTS: string[] = [
  'Cửa khẩu quốc tế Huayxai (Bokeo)',
  'Cửa khẩu quốc tế Thakhek (Khammouane)',
  'Cửa khẩu quốc tế Savannakhet (Savannakhet)',
  'Cửa khẩu Hữu nghị Lào – Việt Nam (Bolikhamxay)',
  'Cửa khẩu quốc tế Vientiane (Vientiane)',
];

// Danh mục các trường hợp đề nghị cấp giấy thông hành tạm thời
export const TEMPORARY_PASS_CASES: string[] = [
  'Có nhu cầu đi lại qua biên giới khẩn cấp hoặc tạm thời',
  'Không đủ thời gian làm thủ tục cấp sổ thông hành thông thường',
  'Trường hợp khác',
];
