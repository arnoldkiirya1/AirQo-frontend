import axios from 'axios';
import {
  GET_DATA_MAP,
  GET_SITES,
  DOWNLOAD_CUSTOMISED_DATA_URI,
  D3_CHART_DATA_URI,
  GENERATE_AIRQLOUD_DATA_SUMMARY_URI,
  SCHEDULE_EXPORT_DATA
} from 'config/urls/analytics';
import { BASE_AUTH_TOKEN } from 'utils/envVariables';

export const getMonitoringSitesInfoApi = async (pm25Category) => {
  return await axios
    .get(GET_DATA_MAP + pm25Category, { params: { token: BASE_AUTH_TOKEN } })
    .then((response) => response.data);
};

export const getSitesApi = async () => {
  return await axios
    .get(GET_SITES, { params: { token: BASE_AUTH_TOKEN } })
    .then((response) => response.data);
};

export const downloadDataApi = async (data) => {
  const headers = {
    service: 'data-export'
  };

  return axios
    .post(DOWNLOAD_CUSTOMISED_DATA_URI, data, { headers }, { params: { token: BASE_AUTH_TOKEN } })
    .then((response) => response.data);
};

export const loadD3ChartDataApi = async (data) => {
  return await axios
    .post(D3_CHART_DATA_URI, data, { params: { token: BASE_AUTH_TOKEN } })
    .then((response) => response.data);
};

export const scheduleExportDataApi = async (data) => {
  return await axios
    .post(SCHEDULE_EXPORT_DATA, data, { params: { token: BASE_AUTH_TOKEN } })
    .then((response) => response.data);
};

export const refreshScheduleExportDataApi = async (requestId) => {
  return await axios
    .patch(SCHEDULE_EXPORT_DATA, { params: { requestId, token: BASE_AUTH_TOKEN } })
    .then((response) => response.data);
};

export const getScheduleExportDataApi = async (USERID) => {
  return await axios
    .get(SCHEDULE_EXPORT_DATA, { params: { userId: USERID, token: BASE_AUTH_TOKEN } })
    .then((response) => response.data);
};

export const generateAirQloudDataSummaryApi = async (data) => {
  return await axios
    .post(GENERATE_AIRQLOUD_DATA_SUMMARY_URI, data, { params: { token: BASE_AUTH_TOKEN } })
    .then((response) => response.data);
};
