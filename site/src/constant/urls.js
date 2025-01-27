import { API_SERVER } from './apis';

const CITY_CODE = `101210301`;
const KEY = `064bcdcc90f346bba107d1b09beeb7ed`;

export const API_QRY_MAP = API_SERVER + '/queryMap';
export const API_UPLOAD = API_SERVER + '/upload';

export const API_LOGIN = API_SERVER + '/login';

///////////////////////////////////////////////////
// ----------------- USER URL ------------------ //
///////////////////////////////////////////////////
export const API_QUERY_USER = API_SERVER + '/user/queryUser';
export const API_DEL_USER = API_SERVER + '/user/delUser';
export const API_SAVE_USER = API_SERVER + '/user/saveUser';

///////////////////////////////////////////////////
// ----------------- ENERGY URL ---------------- //
///////////////////////////////////////////////////
export const API_QRY_ENERGY_SCREEN  = API_SERVER + '/qryEnergyScreen';
export const API_QRY_ENERGY_SUMMARY = API_SERVER + '/qryEnergySummary';
export const API_QRY_ENERGY_HOUR    = API_SERVER + '/qryEnergyHour';
export const API_QRY_ENERGY_DAY     = API_SERVER + '/qryEnergyDay';
export const API_QRY_ENERGY_MONTH   = API_SERVER + '/qryEnergyMonth';
export const API_QRY_ENERGY_DEV_HOUR= API_SERVER + '/qryEnergyDevHour';
export const API_QRY_ENERGY_DEV_DAY = API_SERVER + '/qryEnergyDevDay';
export const API_QRY_ENERGY_DEV_MONTH = API_SERVER + '/qryEnergyDevMonth';


///////////////////////////////////////////////////
// ----------------- Report URL ---------------- //
///////////////////////////////////////////////////
export const API_ANALYSIS_G0    = API_SERVER + '/analysisG0'
export const API_REPORT_SUMMARY = API_SERVER + '/qryReportSummary'
export const API_SAVE_DEVICES    = API_SERVER + '/report/saveDevices'
export const API_LOAD_DEVICES    = API_SERVER + '/report/loadDevices'






export const API_WEATHER = `https://devapi.qweather.com/v7/weather/now?location=${CITY_CODE}&key=${KEY}`;
