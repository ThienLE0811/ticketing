// @ts-ignore
/* eslint-disable */
import { bodyBuilder } from '@/utils';
import { request } from '@umijs/max';

// export async function uploadMultipart(body: API.LoginReqParams, options?: { [key: string]: any }) {
//     return request<API.LoginRes>(TICKETING_BASE_URL, {
//         method: 'POST',
//         data: bodyBuilder('GET_TRANSACTION', 'get_token', {
//             userName: body.username,
//             passWord: body.password,
//         }),
//         ...(options || {}),
//     });
// }
export async function deleteUploadFile(
  docID: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.LoginRes>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'deleteUploadFile', {
      docID,
    }),
    ...(options || {}),
  });
}

export async function getUploadFile(
  ticketId: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.LoginRes>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getUploadFile', {
      ticketId,
    }),
    ...(options || {}),
  });
}

export async function getUploadFileDraft(
  { ticketId, id }: { ticketId: string; id: string },
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.LoginRes>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getUploadFileDraft', {
      ticketId,
      id,
    }),
    ...(options || {}),
  });
}

export async function downloadFile(
  { docID, fileName, docUrl }: { docUrl: string; fileName: string; docID: string },
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.LoginRes>(TICKETING_FILE_STORE, {
    method: 'POST',
    data: {
      header: requestFormDataFileStore({}).header,
      ...bodyBuilder('GET_TRANSACTION', 'downloadFile', {
        docID,
        fileName,
        docUrl,
      }),
    },
    ...(options || {}),
  });
}

export function requestFormDataFileStore({
  fileName,
  metaData,
}: {
  fileName?: string;
  metaData?: any[];
}) {
  return {
    header: {
      reqType: 'REQUEST',
      api: 'FILE_STORE_API',
      apiKey: 'qmklfoni1ezxlf2ckpygpfx122020fs',
      priority: 1,
      channel: 'SEANET',
      subChannel: 'ONLINE',
      location: '10.9.12.90',
      context: 'PC',
      trusted: 'false',
      requestAPI: 't24Server',
      requestNode: '10.9.10.14',
      userID: '313709469627390b77ce538082665164',
      synasyn: 'true',
    },
    body: {
      command: 'GET_TRANSACTION',
      resTopic: '',
      transaction: {
        authenType: 'uploadMultipart',
        categoryID: 'ticketing-tttn',
        secID: '1',
        uploadMethod: 'multipart',
        inputFileName: fileName || 'fileUpload.png',
        fileURL: 'https://dc2-miniotest01.seabank.com.vn/filestore/avata',
        fileStream: '',
        title: fileName || '',
        authorID: '0013',
        departmentID: '',
        metadata: metaData || [],
      },
    },
  };
}
