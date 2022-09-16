import { colorSla, getDueDateAsMinute, getMasterDataByTypeUtil } from '@/utils';
import { ProColumns } from '@ant-design/pro-components';
import { Badge, Tag } from 'antd';
import moment from 'moment';

type columnsDefault = {
  setCurrentRow: any;
  setShowDetail: any;
};

function columnsDefault({ setCurrentRow, setShowDetail }: columnsDefault) {
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
      filters: true,
      // filteredValue: filteredInfo?.status || null,
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
      width: 160,
    },
    {
      title: 'NH hưởng/Số Pin + Tên NH',
      width: 190,
      dataIndex: 'bank',
      hideInSearch: true,
    },
    {
      title: 'Ngày duyệt GD gốc',
      dataIndex: 'transDate',
      hideInSearch: true,
      width: 140,
    },
    {
      title: 'Chiều GD',
      dataIndex: 'typeTransaction',
      request: async () => getMasterDataByTypeUtil('TypeTransaction', true, true),
      // renderText: (text) => <NameMasterData type='TypeTransaction' value={text} />,
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
      width: 120,
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

  return columns;
}

export default columnsDefault;
