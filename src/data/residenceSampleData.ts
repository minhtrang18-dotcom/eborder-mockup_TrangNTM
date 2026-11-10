// Dữ liệu mẫu địa giới hành chính Lào nhúng sẵn cho form đăng ký
export interface ResidenceAdminTree {
  province: string;
  districts: {
    district: string;
    villages: {
      village: string;
      units: string[];
    }[];
  }[];
}

export const SAMPLE_RESIDENCE_DATA: ResidenceAdminTree[] = [
  {
    province: 'Thủ đô Viêng Chăn',
    districts: [
      {
        district: 'Chanthabuly',
        villages: [
          {
            village: 'Bản Thongkhankham',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03'],
          },
          {
            village: 'Bản Saylom',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
          {
            village: 'Bản Sihom',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03', 'Đơn vị 04'],
          },
        ],
      },
      {
        district: 'Sikhottabong',
        villages: [
          {
            village: 'Bản Nongduang',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
          {
            village: 'Bản Kaolieo',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03'],
          },
        ],
      },
      {
        district: 'Sisattanak',
        villages: [
          {
            village: 'Bản Dongpalan',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
          {
            village: 'Bản Saphanthong',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03'],
          },
        ],
      },
    ],
  },
  {
    province: 'Bokeo',
    districts: [
      {
        district: 'Houayxay',
        villages: [
          {
            village: 'Bản Houayxay',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03'],
          },
          {
            village: 'Bản Thadua',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
          {
            village: 'Bản Tinthat',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03'],
          },
        ],
      },
      {
        district: 'Tonpheung',
        villages: [
          {
            village: 'Bản Mom',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
          {
            village: 'Bản Dan',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03'],
          },
        ],
      },
    ],
  },
  {
    province: 'Savannakhet',
    districts: [
      {
        district: 'Kaysone Phomvihane',
        villages: [
          {
            village: 'Bản Sayaphoum',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03'],
          },
          {
            village: 'Bản Latsavong',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
        ],
      },
      {
        district: 'Outhoumphone',
        villages: [
          {
            village: 'Bản Seno',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03'],
          },
          {
            village: 'Bản Dongbang',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
        ],
      },
    ],
  },
  {
    province: 'Champasak',
    districts: [
      {
        district: 'Pakse',
        villages: [
          {
            village: 'Bản Watlouang',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03'],
          },
          {
            village: 'Bản Phonkoung',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
        ],
      },
      {
        district: 'Sanasomboun',
        villages: [
          {
            village: 'Bản Saphat',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
          {
            village: 'Bản Nonghoi',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
        ],
      },
    ],
  },
  {
    province: 'Luang Prabang',
    districts: [
      {
        district: 'Luang Prabang (Thành phố)',
        villages: [
          {
            village: 'Bản Xieng Thong',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
          {
            village: 'Bản Phousi',
            units: ['Đơn vị 01', 'Đơn vị 02', 'Đơn vị 03'],
          },
        ],
      },
      {
        district: 'Chomphet',
        villages: [
          {
            village: 'Bản Xiengmene',
            units: ['Đơn vị 01', 'Đơn vị 02'],
          },
        ],
      },
    ],
  },
];
