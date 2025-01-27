
// convert null to 0
export const formatData = (data) => {
  return data.map(item => {
    const updatedItem = { ...item }; 
    for (const key in updatedItem) {
      if (updatedItem[key] === null) {
        updatedItem[key] = 0;
      }
    }
    return updatedItem;
  });
}

export const createEntry=(item, index)=> {
  return {
    dtf: item.dtf,
    dt: item.dt,
    sys_poa: item[`sys_${index}_poa`],
    chg_poa: item[`chg_${index}_poa`],
    chpg_poa: item[`chpg_${index}_poa`],
    cwpg_poa: item[`cwpg_${index}_poa`],
    ctg_poa: item[`ctg_${index}_poa`],
    chg_chw_wtpo: item[`chg_${index}_chw_wtpo`],
    chg_chw_wtpi: item[`chg_${index}_chw_wtpi`],
    chg_cw_wtpo: item[`chg_${index}_cw_wtpo`],
    chg_cw_wtpi: item[`chg_${index}_cw_wtpi`],
  };
}

export const groupData=(rawData)=> {
  return rawData.reduce((acc, item) => {
    if (item.code === "cps_1") {
      acc.sys1.push(createEntry(item, 1));
      acc.sys2.push(createEntry(item, 2));
    } else if (item.code === "cps_2") {
      acc.sys3.push(createEntry(item, 1));
      acc.sys4.push(createEntry(item, 2));
    }
    return acc;
  }, { sys1: [], sys2: [], sys3: [], sys4: [] });
}
