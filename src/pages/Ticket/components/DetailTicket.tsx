import api from '@/services/api';
import { colorSla, getMasterDataByTypeUtil } from '@/utils';
import { LeftSquareOutlined, RightSquareOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProCard,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import {
  faBarsProgress,
  faClockFour,
  faEdit,
  faFolderOpen,
  faHistory,
  faMoneyBill1Wave,
  faQuestionCircle,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Tag, Typography } from 'antd';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import DrawerDetailTicket from './DrawerDetailTicket';
import FileAttachmentList from './FileAttachmentList';

type DetailTicketProps = {
  loading?: boolean;
  ticketInfo?: any;
  ticketId?: string;
  id?: string;
  isDraft?: boolean;
};

const DetailTicket: React.FC<DetailTicketProps> = (props) => {
  const { loading, ticketInfo = {}, isDraft, ticketId, id } = props;
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();
  const [activeTabHis, setActiveTabHis] = useState<'ticketRelated' | 'modTrack'>('ticketRelated');

  useEffect(() => {
    actionRef.current?.reload();
  }, [ticketInfo]);

  const columnsCreateBy: ProColumns<any>[] = [
    {
      title: 'Người khởi tạo',
      dataIndex: 'createdBy',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'grpName',
    },
    {
      title: 'Email',
      dataIndex: 'usrEmail',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'userJob',
    },
    {
      title: 'IPPhone',
      dataIndex: 'userIpPhone',
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createTime',
      renderText: () => `${moment().format('DD/MM/YYYY hh:mm:ss')}`,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'userPhone',
    },
    {
      title: 'Email CC',
      dataIndex: 'userEmailCc',
    },
  ];

  const columnsProcess: ProColumns<any>[] = [
    {
      title: 'Kênh thanh toán',
      dataIndex: 'unit',
    },
    {
      title: 'Email CC',
      dataIndex: 'amount',
    },
    {
      title: 'FT hoạch toán cập nhật',
      dataIndex: 'ftRelated',
    },
    {
      title: 'Nội dung hoạch toán',
      dataIndex: 'ftRelated',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
  ];
  const columnsDebit: ProColumns<any>[] = [
    {
      title: 'Tài khoản',
      dataIndex: 'debitAccount',
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'debitAccountName',
    },
    {
      title: 'Số tiền',
      dataIndex: 'debitAmount',
    },
    {
      title: 'Loại tiền',
      dataIndex: 'debitCurrency',
    },
  ];

  const columnsCredit: ProColumns<any>[] = [
    {
      title: 'Tài khoản',
      dataIndex: 'creditAccount',
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'creditAccountName',
    },
    {
      title: 'Số tiền',
      dataIndex: 'creditAmount',
    },
    {
      title: 'Loại tiền',
      dataIndex: 'creditCurrency',
    },
  ];

  const columnsDetail: ProColumns<API.RuleListItem & any>[] = [
    // {
    //     title: 'Ticket ID',
    //     dataIndex: 'ticketId',
    //     render: (dom, entity) => {
    //         return (
    //             <a
    //                 onClick={() => {
    //                     setCurrentRow(entity);
    //                     setShowDetail(true);
    //                 }}
    //             >
    //                 {dom}
    //             </a>
    //         );
    //     },
    // },
    // {
    //     title: 'Trạng thái',
    //     dataIndex: 'status',
    //     valueType: 'select',
    //     hideInForm: true,
    //     request: async () => getMasterDataByTypeUtil('StatusTicket', true, true),
    // },
    {
      title: 'Nhóm nghiệp vụ',
      dataIndex: 'typeBusiness',
      valueType: 'select',
      request: async () => getMasterDataByTypeUtil('TypeBusiness', true, true),
    },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'createdDate',
    },
    {
      title: 'Thời gian hết hạn SLA',
      dataIndex: 'dueDate',
    },
    {
      title: 'SLA còn lại',
      // width: 200,
      renderText: (text, record) => {
        const start = moment();
        const end = moment(record?.dueDate, 'DD/MM/YYYY HH:mm:ss');
        const duration = moment.duration(end.diff(start));
        const mins = Math.floor(duration.asMinutes());
        return <Tag color={colorSla(mins)}>{mins ? `${mins} phút` : '---'}</Tag>;
      },
    },
    {
      title: 'Thời gian xử lý(phút)',
      dataIndex: 'timeProcess',
    },
    {
      title: 'Bước xử lý hiện tại',
      dataIndex: 'tasTitle',
      renderText: (text) => <span style={{ color: '#3f51b5' }}>{text}</span>,
    },
  ];

  const columns: ProColumns<API.RuleListItem & any>[] = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      hideInForm: true,
      request: async () => getMasterDataByTypeUtil('StatusTicket', true, true),
    },
    {
      title: 'Nhóm nghiệp vụ',
      dataIndex: 'typeBusiness',
      valueType: 'select',
      request: async () => getMasterDataByTypeUtil('TypeBusiness', true, true),
    },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'createdDate',
    },
    {
      title: 'Thời gian hết hạn SLA',
      dataIndex: 'dueDate',
    },
    {
      title: 'SLA còn lại',
      // width: 200,
      renderText: (text, record) => {
        const start = moment();
        const end = moment(record?.dueDate, 'DD/MM/YYYY HH:mm:ss');
        const duration = moment.duration(end.diff(start));
        const mins = Math.floor(duration.asMinutes());
        return <Tag color={colorSla(mins)}>{mins ? `${mins} phút` : '---'}</Tag>;
      },
    },
    {
      title: 'Thời gian xử lý(phút)',
      dataIndex: 'timeProcess',
    },
    {
      title: 'Bước xử lý hiện tại',
      dataIndex: 'tasTitle',
      renderText: (text) => <span style={{ color: '#3f51b5' }}>{text}</span>,
    },
  ];

  const columnsTransaction: ProColumns<API.RuleListItem & any>[] = [
    {
      title: 'ID KH',
      dataIndex: 'customerId',
    },
    {
      title: 'Tên Khách hàng',
      dataIndex: 'customerName',
    },
    {
      title: 'TK Khách hàng',
      dataIndex: 'customerAccount',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
    },
    {
      title: 'FT Giao dịch + FT Gốc',
      dataIndex: 'ft',
    },
    {
      title: 'FT liên quan',
      dataIndex: 'ftRelated',
    },
    {
      title: 'FM tra soát',
      dataIndex: 'fm',
    },
    {
      title: 'Số LCC tra soát',
      dataIndex: 'lcc',
    },
    {
      title: 'LOS ID TT Lương/CTTL',
      dataIndex: 'ttLuongCttl',
    },

    {
      title: 'Số Trace/REF/MTCN',
      dataIndex: 'trace',
    },
    {
      title: 'LCC/GBC',
      dataIndex: 'lccGbc',
    },
    {
      title: 'Kênh giao dịch/đối tác',
      dataIndex: 'channel',
      valueType: 'select',
      request: async () => getMasterDataByTypeUtil('PaymentChannel', true, true),
    },
    {
      title: 'NH hưởng/Số Pin/Tên NH',
      width: 200,
      dataIndex: 'bank',
    },
    {
      title: 'Ngày duyệt GD gốc',
      dataIndex: 'transDate',
    },
    {
      title: 'Chiều GD',
      dataIndex: 'typeTransaction',
      valueType: 'select',
      request: async () => getMasterDataByTypeUtil('TypeTransaction', true, true),
      // renderText: (text) => <NameMasterData type='TypeTransaction' value={text} />
    },
  ];

  return (
    <div style={{ padding: '0px 16px' }}>
      <Row gutter={[16, 16]}>
        <ProDescriptions<API.RuleListItem & any>
          column={{ xl: 6, lg: 4, sm: 4 }}
          layout="vertical"
          size="small"
          className="modalFormTicket"
          labelStyle={{
            // color: '#607d8b',
            fontWeight: 600,
          }}
          loading={loading}
          dataSource={ticketInfo}
          // request={async () => ({
          //     data: ticketInfo || {},
          // })}
          // params={{
          //     id: ticketInfo?.ticketId,
          // }}
          columns={columnsDetail as ProDescriptionsItemProps<API.RuleListItem>[]}
        />
        <ProCard
          size="small"
          bordered
          headerBordered
          className="card-fill-header"
          title={
            <>
              <FontAwesomeIcon icon={faMoneyBill1Wave} /> Thông tin giao dịch
            </>
          }
        >
          <ProDescriptions<API.RuleListItem & any>
            column={{ xl: 6, lg: 4, sm: 4, xxl: 8 }}
            layout="vertical"
            size="small"
            className="modalFormTicket"
            // bordered
            labelStyle={{
              // color: '#607d8b',
              fontWeight: 600,
            }}
            loading={loading}
            title={false}
            dataSource={ticketInfo}
            // request={async () => ({
            //     data: ticketInfo || {},
            // })}
            columns={columnsTransaction as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        </ProCard>
        <ProCard
          size="small"
          bordered
          headerBordered
          className="card-fill-header"
          title={
            <>
              <FontAwesomeIcon icon={faQuestionCircle} /> Nội dung tra soát/Hỏi
            </>
          }
        >
          <Typography.Title level={5} style={{ color: '#283593' }}>
            <FontAwesomeIcon icon={faTicket} /> {ticketInfo?.ticketTitle}
          </Typography.Title>
          {ticketInfo?.contentRequest && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(ticketInfo?.contentRequest || ''),
              }}
            />
          )}
        </ProCard>
        <ProCard
          size="small"
          bordered
          headerBordered
          className="card-fill-header"
          title={
            <>
              <FontAwesomeIcon icon={faFolderOpen} /> Chứng từ đính kèm
            </>
          }
        >
          <FileAttachmentList ticketId={ticketId} id={id} isDraft={isDraft} />
        </ProCard>

        <DrawerDetailTicket
          visible={showDetail}
          ticketId={currentRow?.ticketId}
          onClose={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
          }}
        />
        <ProCard
          size="small"
          bordered
          headerBordered
          className="card-fill-header"
          title={
            <>
              <FontAwesomeIcon icon={faEdit} /> Thông tin khởi tạo
            </>
          }
        >
          <ProDescriptions<API.RuleListItem & any>
            column={{ xl: 8, lg: 4, sm: 4, xxl: 8 }}
            layout="vertical"
            size="small"
            className="modalFormTicket"
            // bordered
            labelStyle={{
              // color: '#607d8b',
              fontWeight: 600,
            }}
            loading={loading}
            title={false}
            request={async () => ({
              data: ticketInfo || {},
            })}
            params={{
              id: ticketInfo?.ticketId,
            }}
            columns={columnsCreateBy as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        </ProCard>
        <ProCard
          size="small"
          bordered
          headerBordered
          className="card-fill-header"
          title={
            <>
              <FontAwesomeIcon icon={faBarsProgress} /> Thông tin xử lý
            </>
          }
        >
          <ProDescriptions<API.RuleListItem & any>
            column={{ xl: 5, lg: 4, sm: 4 }}
            layout="vertical"
            size="small"
            className="modalFormTicket"
            // bordered
            labelStyle={{
              // color: '#607d8b',
              fontWeight: 600,
            }}
            loading={loading}
            title={false}
            request={async () => ({
              data: ticketInfo || {},
            })}
            params={{
              id: ticketInfo?.ticketId,
            }}
            columns={columnsProcess as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Title level={5} style={{ marginTop: 10 }}>
                <RightSquareOutlined /> Tài khoản ghi nợ
              </Typography.Title>
              <ProDescriptions<API.RuleListItem & any>
                column={{ xl: 4, lg: 4, sm: 4 }}
                layout="vertical"
                size="small"
                className="modalFormTicket"
                // bordered
                loading={loading}
                request={async () => ({
                  data: ticketInfo || {},
                })}
                params={{
                  id: ticketInfo?.ticketId,
                }}
                columns={columnsDebit as ProDescriptionsItemProps<API.RuleListItem>[]}
              />
            </Col>
            <Col span={12} style={{ borderLeft: '1px solid #ccc' }}>
              {/* <Divider style={{ margin: 4 }} /> */}
              <Typography.Title level={5} style={{ marginTop: 10 }}>
                <LeftSquareOutlined /> Tài khoản ghi có
              </Typography.Title>
              <ProDescriptions<API.RuleListItem & any>
                column={{ xl: 4, lg: 4, sm: 4 }}
                layout="vertical"
                size="small"
                className="modalFormTicket"
                // bordered
                loading={loading}
                request={async () => ({
                  data: ticketInfo || {},
                })}
                params={{
                  id: ticketInfo?.ticketId,
                }}
                columns={columnsCredit as ProDescriptionsItemProps<API.RuleListItem>[]}
              />
            </Col>
          </Row>
        </ProCard>
        <ProCard
          size="small"
          bordered
          headerBordered
          className="card-fill-header"
          title={
            <>
              <FontAwesomeIcon icon={faClockFour} /> Lịch sử
            </>
          }
        >
          <ProTable
            // headerTitle='Lịch sử hỗ trợ khách hàng'
            search={false}
            actionRef={actionRef}
            size="small"
            rowKey="ticketId"
            ghost
            options={{ setting: false, density: false }}
            pagination={{ pageSize: 5 }}
            toolbar={{
              menu: {
                type: 'tab',
                onChange: (activeKey: any) => {
                  setActiveTabHis(activeKey);
                  actionRef.current?.reload();
                },
                items: [
                  {
                    label: (
                      <>
                        <FontAwesomeIcon icon={faTicket} /> Lịch sử hỗ trợ khách hàng
                      </>
                    ),
                    key: 'ticketRelated',
                  },
                  {
                    label: (
                      <>
                        <FontAwesomeIcon icon={faHistory} /> Lịch sử thay đổi Ticket
                      </>
                    ),
                    key: 'modTrack',
                  },
                ],
              },
            }}
            request={(params, sort, filters) => {
              const trace = ticketInfo?.trace;
              const code = ticketInfo?.ft;
              if (!code && !ticketInfo?.fm && !ticketInfo?.ft) return Promise.resolve({});
              return api.ticket.getListTicket(
                {
                  params: {
                    ...params,
                    ft: code,
                    fm: code,
                    trace: trace,
                  },
                  sort,
                  filters,
                },
                activeTabHis === 'ticketRelated' ? 'getHisTicketByFtFmTrace' : 'getHisTicketById',
              );
            }}
            cardProps={{
              bodyStyle: { padding: 0 },
            }}
            columns={[...columns, ...columnsTransaction, ...columnsProcess]}
            scroll={{ x: 'max-content' }}
          />
        </ProCard>
      </Row>
    </div>
  );
};

export default DetailTicket;
