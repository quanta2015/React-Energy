import { toJS } from 'mobx'
import request from '@/util/request'
import { param } from '@/util/param'


export const get =async (api = '', params = {}, allRes) => {
  let url
  if (api.indexOf('?') === -1) {
    url = api + `?${param(params)}`
  } else {
    url = api + `&${param(params)}`
  }
  let data = await request(url, {}, allRes)
  return toJS(data)
}

export const post = async (api, data, allRes) => {
  return await request(
    api,
    {
      method: 'POST',
      data
    },
    allRes
  )
}
