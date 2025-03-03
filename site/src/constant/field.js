const unitList = { chcp:'kw',chcpa:'kw',el:'kwh',ela:'kwh',fl:'m3/h',fla:'m3',fr:'hz',hcp:'kw',hcpa:'kw',li:'m',po:'kw',poa:'kw',pr:'kpa',pri:'bar',pro:'bar',son:'',tp:'℃',vlp:'%',vls:'',wfl:`m3/h`,wfla:`m3/h`,wpri:'kpa',wpro:'kpa',wtpi:'℃',wtpo:'℃',yc:'m',rlap:'%',al:'', vlpf:'', vlpc: '', rem: '',sdal: '',eer_o:'',po:'kw',vlp:'%',  cnt:'%',sfb:'%',pos:'%',fac:'%',cod:'%',avg:'%',l3:'%',l2:'%',l1:'%',ac:'%',bc:'%',ab:'%',prd:'%',src:'%',rst:'%',tp1:'℃', tp2:'℃', tp3:'℃'
}

const propList = { chcp:'制冷量', chcpa:'总制冷量', chw_fl:'冷冻水流量', chw_pr:'冷冻水压', chw_wfla:'冷冻总流量', chw_wtpi:'冷冻回水温度', chw_wtpo:'冷冻供水温度', cw_fl:'冷却水流量', cw_pr:'冷却水压', cw_wfla:'冷却总流量', cw_wtpi:'冷却回水温度', cw_wtpo:'冷却供水温度', el:'电量', ela:'总电量', fl:'流量', fr:'电机频率', hcp:'排热量', hcpa:'总排热量', li:'扬程', ln_pr:'冷凝器冷媒压力', ln_tp:'冷凝器冷媒温度', oil_pr:'油压差', oil_tp:'油温', po:'功率', poa:'总功率', pri:'进水压力', pro:'出水压力', son:'运行状态', vlp:'阀门开度', vls:'阀门状态', wfl:'水流量', wfla:'总水流量', wpri:'进压', wpro:'出压', wtpi:'进水温度', wtpo:'出水温度', yc:'扬程', zf_pr:'蒸发器冷媒压力', zf_tp:'蒸发器冷媒温度',rlap:'电流百分比',al:'报警状态', f1_el:'风扇风机电量', f1_fr:'风扇电机频率', f1_po:'风扇风机功率', f1_son:'风扇风机状态', f2_el:'风扇风机电量', f2_fr:'风扇电机频率', f2_po:'风扇风机功率', f2_son:'风扇风机状态', f3_el:'风扇风机电量', f3_fr:'风扇电机频率', f3_po:'风扇风机功率', f3_son:'风扇风机状态', f4_el:'风扇风机电量', f4_fr:'风扇电机频率', f4_po:'风扇风机功率', f4_son:'风扇风机状态', chv_wtpi:'冷冻回水温度2', chv_wtpo:'冷冻供水温度2', cv_wtpi:'冷却回水温度2', cv_wtpo:'冷却供水温度2', vlpf:'冷冻阀开度', vlpc:'冷却阀开度', rem:'本地远程状态',sdal:'冷冻机停机故障',
  acp_fl_1:"3#1F空压流量",acp_fl_2:"3#1F氮气流量",acp_fl_3:"3#2F空压流量",acp_fl_4:"3#2F氮气流量",acp_fl_5:"1#3F空压流量",acp_fl_6:"2#1F空压流量",acp_fl_7:"2#2F空压流量",acp_fl_8:"4#氮气流量",acp_fl_9:"空压总流量",acp_fl_10:"氮气总流量",acp_fla_1: "3#1F空压累计用量",acp_fla_2: "3#1F氮气累计用量",acp_fla_3: "3#2F空压累计用量",acp_fla_4: "3#2F氮气累计用量",acp_fla_5: "1#3F空压累计用量",acp_fla_6: "2#1F空压累计用量",acp_fla_7: "2#2F空压累计用量",acp_fla_8: "4#氮气累计用量",acp_fla_9: "空压总累计用量",acp_fla_10: "氮气总累计用量", str_cnt:'启动次数',tp_sfb:'当前温度设定值',rlam_sfb:'当前温度设定值',igv2_pos:'IGV2位置',mtr_tp3:'马达绕组温度3',igv1_pos:'IGV1位置',mtr_tp2:'马达绕组温度2',mtr_tp1:'马达绕组温度1',pow_fac:'功率因素',dag_cod:'诊断代码',phc_avg:'平均相电流',phc_l3:'L3相电流',phc_l2:'L2相电流',phc_l1:'L1相电流',phv_avg:'平均相电压',phv_ac:'AC相电压',phv_bc:'BC相电压',phv_ab:'AB相电压',oil_prd:'油压差',tnk_pr:'油箱压力',ref_prd:'冷媒压差',stp_src:'设定点来源',bas_err_rst:'BAS故障复位',pan_ast_st:'面板AUTO_STOP状态',alm_st:'报警状态',cdr_fls_st:'冷凝器水流状态',eva_fls_st:'蒸发器水流状态',cdr_apr_tp:'冷凝器趋近温度',eva_apr_tp:'蒸发器趋近温度',tnk_tp:'油箱温度',cpr_air_tp:'压缩机冷媒排气温度',
 }

export const unitByVal = (field)=>{
  const list = field.split('_');
  const last = list.at(-1);
  return unitList[last]
}


export const FIELDS = (i,type,ret=null)=>{
  switch(type) {
    case 'ch':
      ret = `ch_${i}_chw_wtpo,ch_${i}_chw_wtpi,ch_${i}_chw_fl,ch_${i}_cw_wtpo,ch_${i}_cw_wtpi,ch_${i}_cw_fl,ch_${i}_chv_wtpo,ch_${i}_chv_wtpi,ch_${i}_cv_wtpo,ch_${i}_cv_wtpi,ch_${i}_chcp,ch_${i}_hcp,ch_${i}_son,ch_${i}_po,ch_${i}_el,ch_${i}_chw_pr,ch_${i}_cw_pr,ch_${i}_fr,ch_${i}_vlp,ch_${i}_vls,ch_${i}_zf_tp,ch_${i}_zf_pr,ch_${i}_ln_tp,ch_${i}_ln_pr,ch_${i}_oil_tp,ch_${i}_oil_pr,ch_${i}_rlap,ch_${i}_al,ch_${i}_vlpf,ch_${i}_vlpc,ch_${i}_rem,ch_${i}_sdal`.split(',')
      break;
    case 'chg':
      ret = `chg_${i}_chw_wtpo,chg_${i}_chw_wtpi,chg_${i}_cw_wtpo,chg_${i}_cw_wtpi,chg_${i}_chw_wfla,chg_${i}_cw_wfla,chg_${i}_poa,chg_${i}_ela,chg_${i}_chcpa,chg_${i}_pri,chg_${i}_pro`.split(',')
      break;
    case 'chp':
      ret = `chp_${i}_fl,chp_${i}_son,chp_${i}_yc,chp_${i}_pri,chp_${i}_pro,chp_${i}_fr,chp_${i}_po,chp_${i}_el,chp_${i}_rem,chp_${i}_al`.split(',')
      break;
    case 'chpg':
      ret = `chpg_${i}_poa,chpg_${i}_ela`.split(',')
      break;
    case 'cwp':
      ret = `cwp_${i}_wfl,cwp_${i}_son,cwp_${i}_wpri,cwp_${i}_wpro,cwp_${i}_li,cwp_${i}_fr,cwp_${i}_po,cwp_${i}_el,cwp_${i}_rem,cwp_${i}_al`.split(',')
      break;
    case 'cwpg':
      ret = `cwpg_${i}_poa,cwpg_${i}_ela`.split(',')
      break;
    case 'ct':
      ret = `ct_${i}_wtpi,ct_${i}_wtpo,ct_${i}_wfl,ct_${i}_vlp,ct_${i}_vls,ct_${i}_po,ct_${i}_el,ct_${i}_rem,ct_${i}_al,ct_${i}_son`.split(',')
      break;
    case 'ctg':
      ret = `ctg_${i}_ela,ctg_${i}_poa`.split(',')
      break;
    case 'system':
      ret = `sys_${i}_eer_o,sys_${i}_poa,sys_${i}_acp_po,sys_${i}_acp_el,sys_${i}_ptf_vlp,sys_2_eer_o,sys_${i}_acp_fl_1,sys_${i}_acp_fl_2,sys_${i}_acp_fl_3,sys_${i}_acp_fl_4,sys_${i}_acp_fl_5,sys_${i}_acp_fl_6,sys_${i}_acp_fl_7,sys_${i}_acp_fl_8,sys_${i}_acp_fl_9,sys_${i}_acp_fl_10,sys_${i}_acp_fl_11,sys_${i}_acp_fl_12,sys_${i}_acp_fl_13,sys_${i}_acp_fl_14,sys_${i}_acp_fla_1,sys_${i}_acp_fla_2,sys_${i}_acp_fla_3,sys_${i}_acp_fla_4,sys_${i}_acp_fla_5,sys_${i}_acp_fla_6,sys_${i}_acp_fla_7,sys_${i}_acp_fla_8,sys_${i}_acp_fla_9,sys_${i}_acp_fla_10,sys_${i}_acp_fla_11,sys_${i}_acp_fla_12,sys_${i}_acp_fla_13,sys_${i}_acp_fla_14,sys_${i}_ven_po,sys_${i}_ven_son_1,sys_${i}_ven_rem_1,sys_${i}_ven_al_1,sys_${i}_ven_son_2,sys_${i}_ven_rem_2,sys_${i}_ven_al_2`.split(',')
      break;

    default:
      ret = []
  } 
  return ret
}