import { colorSla, getDueDateAsMinute, getMasterDataByTypeUtil, getTimeDistance } from '@/utils';
import { PageContainer, ProColumns } from '@ant-design/pro-components';
import { Badge, Tag } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker';
import moment from 'moment';
import React, { useState } from 'react';
import DrawerDetailTicket from '../Ticket/components/DrawerDetailTicket';
import ChartOverView from './components/ChartOverView';
import styles from './components/styles.less';
type RangePickerValue = RangePickerProps<moment.Moment>['value'];
export type TimeType = 'today' | 'week' | 'month' | 'year';

const Dashboard: React.FC = () => {
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    getTimeDistance('year'),
  );

  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as moment.Moment, 'day') &&
      rangePickerValue[1].isSame(value[1] as moment.Moment, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  const handleRangePickerChange = (value: RangePickerValue) => {
    console.log(value);

    setRangePickerValue(value);
  };

  const selectDate = (type: TimeType) => {
    console.log(type);

    setRangePickerValue(getTimeDistance(type));
  };

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();
  const columns: ProColumns<API.RuleListItem & any>[] = [
    {
      title: 'Ticket ID',
      filters: true,
      valueType: 'text',
      // width: 190,
      hideInSearch: true,
      dataIndex: 'ticketId',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {' '}
            <Badge color={colorSla(getDueDateAsMinute(entity?.dueDate))} />
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Ti??u ?????',
      dataIndex: 'ticketTitle',
      // width: 300,
      ellipsis: true,
      hideInSearch: true,
      render: (text, record) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word', width: 300 }}>{text}</div>
      ),
    },

    {
      title: 'Tr???ng th??i',
      dataIndex: 'status',
      // width: 80,
      hideInForm: true,
      request: async () => getMasterDataByTypeUtil('StatusTicket', true, true),
      valueType: 'select',
    },
    {
      title: 'FT Giao d???ch + FT G???c',
      order: 5,
      width: 170,
      dataIndex: 'ft',
    },
    {
      title: 'S??? LCC tra so??t',
      width: 120,
      order: 4,
      dataIndex: 'lcc',
    },
    {
      title: 'FM tra so??t',
      order: 3,
      dataIndex: 'fm',
      width: 90,
    },
    {
      title: 'S??? Trace/REF/MTCN',
      order: 2,
      width: 150,
      dataIndex: 'trace',
    },
    {
      title: 'LCC/GBC',
      order: 6,
      dataIndex: 'lccGbc',
      width: 80,
    },
    {
      title: 'S??? ti???n',
      dataIndex: 'amount',
      hideInSearch: true,
      width: 60,
    },
    {
      title: 'N???i dung g???i ?? + N???i dung tra so??t/h???i',
      dataIndex: 'contentRequest',
      width: 300,
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'N???i dung tr??? l???i',
      hideInSearch: true,
      width: 120,
      // dataIndex: 'userEmailCc',
    },
    {
      title: 'Email CC',
      dataIndex: 'userEmailCc',
      hideInSearch: true,
      width: 80,
    },
    {
      title: 'K??nh giao d???ch/?????i t??c',
      dataIndex: 'channel',
      request: async () => getMasterDataByTypeUtil('PaymentChannel', true, true),
      valueType: 'select',
      width: 180,
    },
    {
      title: 'NH h?????ng/S??? Pin + T??n NH',
      width: 200,
      dataIndex: 'bank',
      hideInSearch: true,
    },
    {
      title: 'Ng??y duy???t GD g???c',
      dataIndex: 'transDate',
      hideInSearch: true,
      width: 150,
    },
    {
      title: 'Chi???u GD',
      dataIndex: 'typeTransaction',
      request: async () => getMasterDataByTypeUtil('TypeTransaction', true, true),
      //   renderText: (text) => <NameMasterData type='TypeTransaction' value={text} />,
      valueType: 'select',
      width: 80,
    },
    {
      title: 'ID KH',
      dataIndex: 'customerAccount',
      hideInSearch: true,
      width: 60,
    },
    {
      title: 'T??n Kh??ch h??ng',
      dataIndex: 'customerName',
      hideInSearch: true,
      width: 130,
    },
    {
      title: 'Nh??m nghi???p v???',
      order: 7,
      request: async () => getMasterDataByTypeUtil('TypeBusiness', true, true),
      ellipsis: true,
      valueType: 'select',
      width: 140,
      dataIndex: 'typeBusiness',
    },
    {
      title: 'Th???i gian kh???i t???o',
      dataIndex: 'createdDate',
      width: 165,
      sorter: true,
    },
    {
      title: 'Ng??y s???a ?????i',
      dataIndex: 'modifyDate',
      width: 165,
      sorter: true,
      hideInSearch: true,
    },
    //modifyDate
    {
      title: 'Th???i gian h???t h???n SLA',
      dataIndex: 'dueDate',
      width: 165,
      hideInSearch: true,
    },
    {
      title: 'SLA c??n l???i',
      width: 120,
      hideInSearch: true,
      renderText: (text, record) => {
        const mins = getDueDateAsMinute(record?.dueDate);
        return <Tag color={colorSla(mins)}>{mins ? `${mins} ph??t` : '---'}</Tag>;
      },
    },
    {
      title: 'Th???i gian x??? l??',
      dataIndex: 'timeProcess',
      hideInSearch: true,
      width: 120,
      renderText: (text, record) => {
        const mins = moment().diff(moment(record?.modifyDate, 'DD/MM/YYYY HH:mm:ss'), 'minutes');
        return <Tag>{mins ? `${mins} ph??t` : '---'}</Tag>;
      },
    },
  ];

  return (
    <PageContainer title={false}>
      <ChartOverView
      // rangePickerValue={rangePickerValue}
      // salesData={[
      //     {
      //         status: 'Ch??? x??? l??',
      //         typeBussiness: 'Chuy???n ti???n trong n?????c',
      //         ticket: 328,
      //     },
      //     {
      //         status: 'Ch??? x??? l??',
      //         typeBussiness: 'Chuy???n ti???n n???i b???',
      //         ticket: 138,
      //     },
      //     {
      //         status: 'Ch??? x??? l??',
      //         typeBussiness: 'Thanh to??n ??i???n t???',
      //         ticket: 328,
      //     },
      //     {
      //         status: 'Ch??? x??? l??',
      //         typeBussiness: 'Chuy???n l????ng',
      //         ticket: 110,
      //     },
      //     {
      //         status: '???? x??? l??',
      //         typeBussiness: 'Chuy???n ti???n trong n?????c',
      //         ticket: 38,
      //     },
      //     {
      //         status: '???? x??? l??',
      //         typeBussiness: 'Chuy???n ti???n n???i b???',
      //         ticket: 38,
      //     },
      //     {
      //         status: '???? x??? l??',
      //         typeBussiness: 'Thanh to??n ??i???n t???',
      //         ticket: 328,
      //     },
      //     {
      //         status: '???? x??? l??',
      //         typeBussiness: 'Chuy???n l????ng',
      //         ticket: 10,
      //     },
      //     {
      //         status: '??ang x??? l??',
      //         typeBussiness: 'Chuy???n ti???n trong n?????c',
      //         ticket: 38,
      //     },
      //     {
      //         status: '??ang x??? l??',
      //         typeBussiness: 'Chuy???n ti???n n???i b???',
      //         ticket: 328,
      //     },
      //     {
      //         status: '??ang x??? l??',
      //         typeBussiness: 'Thanh to??n ??i???n t???',
      //         ticket: 328,
      //     },
      // ]}
      // isActive={isActive}
      // handleRangePickerChange={handleRangePickerChange}
      // loading={false}
      // selectDate={selectDate}
      />

      <DrawerDetailTicket
        width={'90%'}
        visible={showDetail}
        ticketId={currentRow?.ticketId}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      />
    </PageContainer>
  );
};

export default Dashboard;
