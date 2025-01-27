import { clone } from '@/util/fn'
import { FAC_TD,FAC_DATA } from '@/constant/data'

const getFacItem =(d,id,o)=>{
  if (d !== undefined ) {
    d = [
      o.title,
      d[`ch_${id+1}_son`]?'开':'关',
      d[`ch_${id+1}_tp_sfb`],
      d[`ch_${id+1}_chw_wtpi`],
      d[`ch_${id+1}_chw_wtpo`],
      d[`ch_${id+1}_cw_wtpi`],
      d[`ch_${id+1}_cw_wtpo`],
      d[`ch_${id+1}_eva_fls_st`]?'开':'关',
      d[`ch_${id+1}_cdr_fls_st`]?'开':'关',
      d[`ch_${id+1}_po`],
      d[`ch_${id+1}_rlap`],
      d[`ch_${id+1}_zf_pr`],
      d[`ch_${id+1}_ln_pr`],
      d[`ch_${id+1}_ln_tp`]-d[`ch_${id+1}_cw_wtpo`],
      d[`ch_${id+1}_chw_wtpo`]-d[`ch_${id+1}_zf_tp`],
      d[`ch_${id+1}_oil_pr`],
    ]
  }else{
    d = ['','','','','','','','','','','','','','','','']
  }
  return d
}

export const caluTable =(data)=>{
    let _td = clone(FAC_TD)

    _td.tab1.title = "室外空气数据"
    _td.tab1.data[0].v = data.sys_1[0].out_1_ftp
    _td.tab1.data[1].v = data.sys_1[0].out_1_rh

    FAC_DATA.map(o=>{
      if (data.hasOwnProperty(o.key)) {
        let d = data[o.key][o.id]
        let item = getFacItem(d,o.id,o)
        _td.tab2.data.push(item)
      }
    })
    
    return _td
  }