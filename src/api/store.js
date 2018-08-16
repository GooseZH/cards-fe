import request from '@/utils/request'

export function getStore() {
  return request({
    url: '/store/query',
    method: 'get'
  })
}

export function createStore(params) {
  return request({
    url: '/store/add',
    method: 'post',
    params: params
  })
}

export function updateStore(params) {
  return request({
    url: '/store/update',
    method: 'post',
    params: params
  })
}

export function deleteStore(params) {
  return request({
    url: '/store/delete',
    method: 'post',
    params: params
  })
}
