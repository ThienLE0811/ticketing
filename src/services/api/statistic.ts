import { bodyBuilder } from '@/utils';
import { request } from '@umijs/max';

export async function getChartTicket(
  { fromDate, toDate, status, userProcess, typeBusiness }: API.GetChartTicketReq,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getChartTicket', {
      fromDate,
      toDate,
      status,
      userProcess,
      typeBusiness,
    }),
    ...(options || {}),
  });
}
