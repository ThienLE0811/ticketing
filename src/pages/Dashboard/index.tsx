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
      title: 'Tiêu đề',
      dataIndex: 'ticketTitle',
      // width: 300,
      ellipsis: true,
      hideInSearch: true,
      render: (text, record) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word', width: 300 }}>{text}</div>
      ),
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      // width: 80,
      hideInForm: true,
      request: async () => getMasterDataByTypeUtil('StatusTicket', true, true),
      valueType: 'select',
    },
    {
      title: 'FT Giao dịch + FT Gốc',
      order: 5,
      width: 170,
      dataIndex: 'ft',
    },
    {
      title: 'Số LCC tra soát',
      width: 120,
      order: 4,
      dataIndex: 'lcc',
    },
    {
      title: 'FM tra soát',
      order: 3,
      dataIndex: 'fm',
      width: 90,
    },
    {
      title: 'Số Trace/REF/MTCN',
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
      title: 'Số tiền',
      dataIndex: 'amount',
      hideInSearch: true,
      width: 60,
    },
    {
      title: 'Nội dung gợi ý + Nội dung tra soát/hỏi',
      dataIndex: 'contentRequest',
      width: 300,
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'Nội dung trả lời',
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
      title: 'Kênh giao dịch/đối tác',
      dataIndex: 'channel',
      request: async () => getMasterDataByTypeUtil('PaymentChannel', true, true),
      valueType: 'select',
      width: 180,
    },
    {
      title: 'NH hưởng/Số Pin + Tên NH',
      width: 200,
      dataIndex: 'bank',
      hideInSearch: true,
    },
    {
      title: 'Ngày duyệt GD gốc',
      dataIndex: 'transDate',
      hideInSearch: true,
      width: 150,
    },
    {
      title: 'Chiều GD',
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
      title: 'Tên Khách hàng',
      dataIndex: 'customerName',
      hideInSearch: true,
      width: 130,
    },
    {
      title: 'Nhóm nghiệp vụ',
      order: 7,
      request: async () => getMasterDataByTypeUtil('TypeBusiness', true, true),
      ellipsis: true,
      valueType: 'select',
      width: 140,
      dataIndex: 'typeBusiness',
    },
    {
      title: 'Thời gian khởi tạo',
      dataIndex: 'createdDate',
      width: 165,
      sorter: true,
    },
    {
      title: 'Ngày sửa đổi',
      dataIndex: 'modifyDate',
      width: 165,
      sorter: true,
      hideInSearch: true,
    },
    //modifyDate
    {
      title: 'Thời gian hết hạn SLA',
      dataIndex: 'dueDate',
      width: 165,
      hideInSearch: true,
    },
    {
      title: 'SLA còn lại',
      width: 120,
      hideInSearch: true,
      renderText: (text, record) => {
        const mins = getDueDateAsMinute(record?.dueDate);
        return <Tag color={colorSla(mins)}>{mins ? `${mins} phút` : '---'}</Tag>;
      },
    },
    {
      title: 'Thời gian xử lý',
      dataIndex: 'timeProcess',
      hideInSearch: true,
      width: 120,
      renderText: (text, record) => {
        const mins = moment().diff(moment(record?.modifyDate, 'DD/MM/YYYY HH:mm:ss'), 'minutes');
        return <Tag>{mins ? `${mins} phút` : '---'}</Tag>;
      },
    },
  ];

  return (
    <PageContainer title={false}>
      <ChartOverView
      // rangePickerValue={rangePickerValue}
      // salesData={[
      //     {
      //         status: 'Chờ xử lý',
      //         typeBussiness: 'Chuyển tiền trong nước',
      //         ticket: 328,
      //     },
      //     {
      //         status: 'Chờ xử lý',
      //         typeBussiness: 'Chuyển tiền nội bộ',
      //         ticket: 138,
      //     },
      //     {
      //         status: 'Chờ xử lý',
      //         typeBussiness: 'Thanh toán điện tử',
      //         ticket: 328,
      //     },
      //     {
      //         status: 'Chờ xử lý',
      //         typeBussiness: 'Chuyển lương',
      //         ticket: 110,
      //     },
      //     {
      //         status: 'Đã xử lý',
      //         typeBussiness: 'Chuyển tiền trong nước',
      //         ticket: 38,
      //     },
      //     {
      //         status: 'Đã xử lý',
      //         typeBussiness: 'Chuyển tiền nội bộ',
      //         ticket: 38,
      //     },
      //     {
      //         status: 'Đã xử lý',
      //         typeBussiness: 'Thanh toán điện tử',
      //         ticket: 328,
      //     },
      //     {
      //         status: 'Đã xử lý',
      //         typeBussiness: 'Chuyển lương',
      //         ticket: 10,
      //     },
      //     {
      //         status: 'Đang xử lý',
      //         typeBussiness: 'Chuyển tiền trong nước',
      //         ticket: 38,
      //     },
      //     {
      //         status: 'Đang xử lý',
      //         typeBussiness: 'Chuyển tiền nội bộ',
      //         ticket: 328,
      //     },
      //     {
      //         status: 'Đang xử lý',
      //         typeBussiness: 'Thanh toán điện tử',
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
