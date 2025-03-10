import { makeAutoObservable } from 'mobx';
import { message } from 'antd';
import { get, post } from '@/util/net.js';
import * as urls from '@/constant/urls';
import { toJS } from 'mobx';

class Store {
  constructor() {
    makeAutoObservable(this);
  }

  user = null;
  mapList = null;
  ret = [];

  saveUser = user => {
    this.user = user;
  };

  async post(url, params) {
    const r = await post(url, params);
    // console.log(r,'aaaa')
    if (r.code === 0 || r.code === 200) {
      return r;
    } else {
      return null;
      message.error(' 网络接口数据出错!');
    }
  }

  async get(url, params) {
    const r = await get(url, params);
    // console.log(r);
    if (r.code === 0) {
      return r.data;
    } else {
      return null;
      message.error(' 网络接口数据出错!');
    }
  }

  async login(params) {
    const r = await post(urls.API_LOGIN, params);
    if (r) {
      return r;
    } else {
      return null;
      message.error(' 网络接口数据出错!');
    }
  }

  ///////////////////////////////////////////////////
  // ----------------- User API ------------------ //
  ///////////////////////////////////////////////////
  async saveUsr(params) {
    return await this.post(urls.API_SAVE_USER, params);
  }

  async queryUsr(params) {
    return await this.post(urls.API_QUERY_USER, params);
  }
  async delUsr(params) {
    return await this.post(urls.API_DEL_USER, params);
  }

  ///////////////////////////////////////////////////
  // ----------------- Energy API ---------------  //
  ///////////////////////////////////////////////////
  async qryEnergyScreen(params) {
    return await this.post(urls.API_QRY_ENERGY_SCREEN, params);
  }

  async qryEnergySummary(params) {
    return await this.post(urls.API_QRY_ENERGY_SUMMARY, params);
  }

  async qryEnergyHour(params) {
    return await this.post(urls.API_QRY_ENERGY_HOUR, params);
  }

  async qryEnergyDay(params) {
    return await this.post(urls.API_QRY_ENERGY_DAY, params);
  }

  async qryEnergyMonth(params) {
    return await this.post(urls.API_QRY_ENERGY_MONTH, params);
  }

  async qryEnergyDevHour(params) {
    return await this.post(urls.API_QRY_ENERGY_DEV_HOUR, params);
  }

  async qryEnergyDevDay(params) {
    return await this.post(urls.API_QRY_ENERGY_DEV_DAY, params);
  }

  async qryEnergyDevMonth(params) {
    return await this.post(urls.API_QRY_ENERGY_DEV_MONTH, params);
  }

  ///////////////////////////////////////////////////
  // ----------------- Report API ---------------  //
  ///////////////////////////////////////////////////
  async qryReportHistory(params) {
    return await this.post(urls.API_ANALYSIS_G0, params);
  }

  async qryReportSummary(params) {
    return await this.post(urls.API_REPORT_SUMMARY, params);
  }

  async saveDevices(params) {
    return await this.post(urls.API_SAVE_DEVICES, params);
  }

  async loadDevices(params) {
    return await this.post(urls.API_LOAD_DEVICES, params);
  }

  async qrySysData(params) {
    return await this.post(urls.API_QRY_SYS_DATA, params);
  }

  async analysisG1(params) {
    return await this.post(urls.API_ANALYSIS_G1, params);
  }

  async systemDataRun(params) {
    return await this.post(urls.API_SYS_DATA_RUN, params);
  }

  ///////////////////////////////////////////////////
  // ----------------- SYSTEM API ---------------- //
  ///////////////////////////////////////////////////
  async userList(params) {
    return await this.post(urls.API_USER_LIST, params);
  }

  async userSave(params) {
    return await this.post(urls.API_USER_SAVE, params);
  }

  async userDel(params) {
    return await this.post(urls.API_USER_DEL, params);
  }

  ///////////////////////////////////////////////////
  // ----------------- UPLOAD API ---------------  //
  ///////////////////////////////////////////////////

  async upload(params) {
    try {
      const r = await this.post(urls.API_UPLOAD, params);
      if (r.status === 200 && r.data.code === 0) {
        return r.data.data.id;
      }
      return r;
    } catch (error) {
      message.error('文件上传失败！');
      console.error('File upload error: ', error);
    }
  }

  ///////////////////////////////////////////////////
  // ----------------- WEATHER API ---------------  //
  ///////////////////////////////////////////////////

  async weather(params) {
    const r = await get(urls.API_WEATHER, null);
    // console.log(r)
    if (r.code === '200') {
      return r.now;
    } else {
      return null;
      message.error(' 网络接口数据出错!');
    }
  }
}

export default new Store();
