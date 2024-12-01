import axios, { AxiosError } from 'axios'
import { hostName } from '../global'
const API_URL = hostName

const getMyInterviewer = async (token) => {
  try {
    let config = { headers: { Authorization: `Bearer ${token}` } }
    const res = await axios.get(`${API_URL}/interview/interviewers`, config)
    return res.data.data
  } catch (error) {
    const axiosError = error
    if (axiosError && axiosError.response && axiosError.response.status === 403) {
      throw new Error('no_permistion')
    } else {
      throw error
    }
  }
}

const addInterviewer = async (token, form) => {
  try {
    let config = { headers: { Authorization: `Bearer ${token}` } }
    const res = await axios.post(`${API_URL}/interview/register-interview`, form, config)
    return res.data
  } catch (error) {
    const axiosError = error
    if (axiosError && axiosError.response && axiosError.response.status === 403) {
      throw new Error('no_permistion')
    } else {
      throw error
    }
  }
}

export const interviewerService = {
  getMyInterviewer,
  addInterviewer,
}
