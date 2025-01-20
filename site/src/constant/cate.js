export const OPT_SYS = [
  {
    value: '电网',
    label: '电网',
    children: [
      {
        label: '配电房',
        value: [
          'PA23',
          'PA27',
          'PA31',
          'PA35',
          'PA39',
          'PA43',
          'PA47',
          'PB01',
          'PB05',
          'PB09',
          'PB33',
          'PB37',
          'PB41',
          'PB45',
          'PB49',
          'PC03',
          'PC07',
          'PC11',
          'PC15',
          'PC19',
          'PC23',
          'PC27',
          'PC30',
          'PC34',
          'PC38',
          'PC42',
          'PC46',
          'PC50',
          'PD04',
          'PD08'
        ]
      },
      {
        label: '现场',
        value: ['PB13', 'PB17', 'PB21', 'PB25', 'PB29']
      },
      {
        label: '所属中心',
        value: [
          'PA35+PA39+PB13+PB17+PB21+PB25+PC11+PC15+PC46',
          'PA47+PB29+PC03+PC07+PD08',
          'PB33+PB45',
          'PC23+PC27+PC42'
        ]
      }
    ]
  },
  {
    label: '压缩空气',
    value: ['PA21', 'PD13', 'PA11', 'PA17', 'PA01', 'PA05', 'PA09', 'PA13']
  },
  {
    label: '氮气',
    value: ['PA19', 'PA03', 'PA07', 'PA15']
  }
];

export const SYS_NANE = {
  el1: '配电房',
  el2: '现场',
  el3: '所属中心',
  ai: '压缩空气',
  ni: '氮气'
};

export const SYS_CATE = {
  el1: [
    'PA23',
    'PA27',
    'PA31',
    'PA35',
    'PA39',
    'PA43',
    'PA47',
    'PB01',
    'PB05',
    'PB09',
    'PB33',
    'PB37',
    'PB41',
    'PB45',
    'PB49',
    'PC03',
    'PC07',
    'PC11',
    'PC15',
    'PC19',
    'PC23',
    'PC27',
    'PC30',
    'PC34',
    'PC38',
    'PC42',
    'PC46',
    'PC50',
    'PD04',
    'PD08'
  ],
  el2: ['PB13', 'PB17', 'PB21', 'PB25', 'PB29'],
  el3: [
    'PA35+PA39+PB13+PB17+PB21+PB25+PC11+PC15+PC46',
    'PA47+PB29+PC03+PC07+PD08',
    'PB33+PB45',
    'PC23+PC27+PC42'
  ],
  ai: ['PA21', 'PD13', 'PA11', 'PA17', 'PA01', 'PA05', 'PA09', 'PA13'],
  ni: ['PA19', 'PA03', 'PA07', 'PA15']
};

export const SYS_MAP = {
  PA23: '5号变压器总电功率',
  PA27: '5号变压器1号电容电功率',
  PA31: '5号变压器2号电容电功率',
  PA35: '3号中庭冷水机电功率',
  PA39: 'ODM电子仓库电功率',
  PA43: '5号变压器备用1电功率',
  PA47: '一层机电加工车间电功率',
  PB01: '5号变压器备用2电功率',
  PB05: '5号变压器备用3电功率',
  PB09: '3号楼母排电功率',
  PB33: '3号配电房电功率',
  PB37: '5号变压器备用4电功率',
  PB41: '5号变压器备用5电功率',
  PB45: '10号楼空调及办公用电电功率',
  PB49: '5号变压器备用6电功率',
  PC03: '3号楼机电冰机1电功率',
  PC07: '3号楼机电冰机2电功率',
  PC11: '3号中庭电子冰机1电功率',
  PC15: '3号中庭电子冰机2电功率',
  PC19: '5号变压器备用7电功率',
  PC23: '3号中庭空压机1电功率',
  PC27: '3号中庭空压机2电功率',
  PC30: '5号变压器备用8电功率',
  PC34: '5号变压器备用9电功率',
  PC38: '5号变压器备用10电功率',
  PC42: '3号中庭制氮和真空电功率',
  PC46: '3号中庭电子空调水泵',
  PC50: '5号变压器备用11电功率',
  PD04: '5号变压器备用12电功率',
  PD08: '3号楼机电水泵电功率',
  PB13: '电子四厂动力电功率',
  PB17: '电子四厂照明和空调电功率',
  PB21: 'ODM动力照明电功率',
  PB25: 'ODM车间母排电功率',
  PB29: '3号楼4F机电动力电功率',
  PA21: '1#空压站压缩空气用量',
  PD13: '3#空压站压缩空气用量',
  PA11: '1-3#总表压缩空气用量',
  PA17: '4-6#总表压缩空气用量',
  PA01: '3#1F电子四厂压缩空气用量',
  PA05: '3#2F电子三厂压缩空气用量',
  PA09: '1#3F科奥压缩空气用量',
  PA13: '2#2F电子二厂压缩空气用量',
  PA19: '液氮用量',
  PA03: '3#1F电子四厂氮气用量',
  PA07: '3#2F电子三厂氮气用量',
  PA15: '4#电子一厂氮气用量',
  'PA35+PA39+PB13+PB17+PB21+PB25+PC11+PC15+PC46': '电子中心',
  'PA47+PB29+PC03+PC07+PD08': '机电中心',
  'PB33+PB45': '管理平台',
  'PC23+PC27+PC42': '生产公用'
};

export const initOptData = () => {
  const optionsData = {};

  Object.entries(SYS_CATE).forEach(([category, values]) => {
    const categoryName = SYS_NANE[category];

    optionsData[categoryName] = values.map(value => {
      if (SYS_MAP[value]) {
        return { label: SYS_MAP[value], value };
      } else {
        return { label: value, value };
      }
    });
  });

  return optionsData;
};
