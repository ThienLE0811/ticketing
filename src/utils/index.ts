import api from '@/services/api';
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker';
import Cookies from 'js-cookie';
import _ from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';

export function transformReqByCommand(command: 'GET_ENQUIRY' | 'GET_TRANSACTION') {
  switch (command) {
    case 'GET_ENQUIRY':
      return 'enquiry';
    case 'GET_TRANSACTION':
      return 'transaction';
    default:
      return '';
  }
}

export function renameKeySort(sort: 'ascend' | 'descend') {
  switch (sort) {
    case 'ascend':
      return 'asc';
    case 'descend':
      return 'desc';
    default:
      return '';
  }
}

export function trim(string: string) {
  return (string || '').trim();
}

export function typeGetListTicketByTab(tab: string) {
  switch (tab) {
    case 'my':
      return 'getMyTicket';
    case 'pending':
      return 'getListTicket';
    case 'processing':
      return 'getProcessTicket';
    case 'processed':
      return 'getProcessedTicket';
    case 'completed':
      return 'getCompleteTicket';
    case 'cancel':
      return 'getCancelTicket';
    case 'pause':
      return 'getPauseTicket';
    case 'draft':
      return 'getDraftTicket';
    default:
      return 'getListTicket';
  }
}

export function bodyBuilder(
  command: 'GET_ENQUIRY' | 'GET_TRANSACTION',
  authenType: string,
  data?: Record<string, any>,
  isGetList?: boolean,
) {
  return {
    body: {
      command,
      [transformReqByCommand(command)]: {
        authenType,
        ...(isGetList
          ? {
              searchDataInfo: {
                sortingInfo: {
                  column: Object.keys(data?.sort)?.[0],
                  direction:
                    Object.keys(data?.sort)?.[0] &&
                    renameKeySort(data?.sort?.[Object.keys(data?.sort)?.[0]]),
                },
                filterInfo: {
                  searchValue: data?.params?.keyword,
                  ..._.omit(data?.params, ['current', 'pageSize', 'keyword']),
                  ...data?.filters,
                },
                paginatorInfo: {
                  page: data?.params?.current,
                  pageSize: data?.params?.pageSize,
                },
              },
            }
          : data),
      },
    },
  };
}

export function logout() {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove('my_user_id');
  // const { search, pathname } = history.location;
  // const urlParams = new URL(window.location.href).searchParams;
  // const redirect = urlParams.get('redirect');
  // history.push('/auth/login');
  window.location.reload();

  // if (window.location.pathname !== '/auth/login' && !redirect) {
  //   history.replace({
  //     pathname: '/auth/login',
  //     search: stringify({
  //       redirect: pathname + search,
  //     }),
  //   });
  // }
}
type RangePickerValue = RangePickerProps<moment.Moment>['value'];
export function fixedZero(val: number) {
  return val * 1 < 10 ? `0${val}` : val;
}

export async function getMasterDataByTypeUtil(
  type: string,
  formatSelect?: boolean,
  cache?: boolean,
): Promise<any[]> {
  try {
    let masterData;
    async function getMasterDataByTypeServer(type: string): Promise<any[]> {
      const res = await api.mdm.getMasterDataByType(type);
      if (res.body?.status === 'OK') return res.body.dataRes?.[type];
      return [];
    }
    if (cache) {
      masterData = sessionStorage.getItem(`masterData::ticketing::tttn::${type}`);
      masterData === 'undefined' && (masterData = '[]');
      if (
        masterData &&
        Array.isArray(JSON.parse(masterData)) &&
        JSON.parse(masterData).length > 0
      ) {
        masterData = JSON.parse(masterData);
      } else {
        masterData = await getMasterDataByTypeServer(type);
      }
    } else {
      masterData = await getMasterDataByTypeServer(type);
    }
    sessionStorage.setItem(`masterData::ticketing::tttn::${type}`, JSON.stringify(masterData));
    return formatSelect
      ? masterData?.map?.((value: any) => {
          return { label: value?.name, value: value?.code };
        })
      : masterData;
  } catch (error) {
    return [];
  }
}

export function getNameMasterDataByValue(type: string, value: any): React.FC {
  const [masterData, setMasterData] = useState<any[]>([]);
  // const masterData = await getMasterDataByTypeUtil(type, false, true)

  return masterData.filter((data) => data.code === value)?.[0]?.name || `[${value}]`;
}

export function getTimeDistance(type: 'today' | 'week' | 'month' | 'year'): RangePickerValue {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }
  const year = now.getFullYear();

  if (type === 'month') {
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function nonAccentVietnamese(str: any) {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export function filterOptionWithVietnamese(input: any, option: any) {
  return (
    nonAccentVietnamese(option?.value)
      .toLowerCase()
      .indexOf(nonAccentVietnamese(input)?.trim().toLowerCase()) >= 0 ||
    `${nonAccentVietnamese(option?.label)}`
      ?.toLowerCase?.()
      .indexOf(nonAccentVietnamese(input)?.trim().toLowerCase()) >= 0
  );
}

export function base64Uint8Array(dataURI: string) {
  if (_.isEmpty(dataURI)) return;
  const BASE64_MARKER = ';base64,';
  const base64Index = dataURI?.indexOf?.(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export function readFileToUnit8Array(file: File) {
  return new Promise((resolve, reject) => {
    // Create file reader
    let reader = new FileReader();

    // Register event listeners
    //@ts-ignore
    reader.addEventListener('loadend', (e) => resolve(new Uint8Array(e.target.result)));
    reader.addEventListener('error', reject);

    // Read file
    reader.readAsArrayBuffer(file);
  });
}

export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function colorSla(minute: number): string {
  switch (true) {
    case minute > 1 * 60:
      return 'green';
    case minute <= 1 * 60 && minute >= 18:
      return 'orange';
    case minute < 18:
      return 'red';
    default:
      return 'green';
  }
}

export function getDueDateAsMinute(dueDate: string) {
  const start = moment();
  const end = moment(dueDate, 'DD/MM/YYYY HH:mm:ss');
  const duration = moment.duration(end.diff(start));
  return Math.floor(duration.asMinutes());
}

export function actionAllow(action: string, type: string) {
  const index = action.indexOf(`${type}:`);
  const perms = action.substring(index + type.length + 1, index + 2 + type.length);
  return perms === 'Y';
}

export function saveFileLocal(file: string, name: string) {
  if (!file) return;
  // const prefixStr = file.indexOf('/', 0)
  // const subStr = file.indexOf(';base64', 0)
  // const extension = file.slice(prefixStr + 1, subStr)
  const a = document.createElement('a'); //Create <a>
  a.href = file; //Image Base64 Goes here
  a.download = `${name}`; //File name Here
  a.click(); //Downloaded file
}

export function headerRequestDpw(urlBase: string) {
  let api: string = '';

  switch (urlBase) {
    case TICKETING_BASE_URL:
      api = 'TTTN_TICKETING_API';
      break;
    case TICKETING_CORE_URL:
      api = 'PM_Core_API';
      break;
    case TICKETING_FILE_STORE:
      api = 'FILE_STORE_API';
      break;
    default:
      api = 'TTTN_TICKETING_API';
      break;
  }

  const data = {
    api,
    apiKey: API_KEY,
    channel: 'Ticketing',
    context: 'PC',
    location: '10.9.12.90',
    priority: 1,
    reqType: 'REQUEST',
    requestAPI: 't24Server',
    requestNode: '10.9.10.14',
    subChannel: 'VHT',
    sync: true,
    trusted: false,
    userID: '1365778600',
  };
  return data;
}
