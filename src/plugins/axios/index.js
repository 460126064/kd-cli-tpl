import axios from 'axios'
import {AXIOS_DEFAULT_CONFIG} from '@/config/index'
import {
  reqSucCallback,
  reqFailCallback,
  resSucCallback,
  resFailCallback
} from '@/config/interceptors/axios'
let axiosInstance = axios.create(AXIOS_DEFAULT_CONFIG)
axiosInstance.interceptors.request.use(reqSucCallback, reqFailCallback)
axiosInstance.interceptors.response.use(resSucCallback, resFailCallback)
export default axiosInstance
