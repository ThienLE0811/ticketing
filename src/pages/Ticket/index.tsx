// import { addRule, removeRule, updateRule } from '@/services/ant-design-pro/api';
import api from '@/services/api';
import { getListTicket } from '@/services/api/ticket';
import {
  colorSla,
  getDueDateAsMinute,
  getMasterDataByTypeUtil,
  typeGetListTicketByTab,
} from '@/utils';
import {
  ControlOutlined,
  FileExcelOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { faCircleCheck, faStar } from '@fortawesome/free-regular-svg-icons';
import {
  faBarsProgress,
  faCancel,
  faCompass,
  faDotCircle,
  faListCheck,
  faPause,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModel } from '@umijs/max';
import { Badge, Button, Empty, notification, Popconfirm, TableProps, Tag } from 'antd';
import { FormInstance } from 'antd/es/form';
import { FilterValue } from 'antd/lib/table/interface';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DrawerDetailTicket from './components/DrawerDetailTicket';
import ModalFormTicket from './components/ModalFormTicket';
import ModalQuickAction from './components/ModalQuickAction';
import ModalQuickDecision from './components/ModalQuickDecision';
import ModalTransferTypeBusiness from './components/ModalTransferTypeBussiness';

const TicketTableList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('processing');
  const [isCollapse, setIsCollapse] = useState<boolean>(true);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [modalFormTicketVisible, setModalFormTicketVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem & any[]>([]);
  const [listDecision, setListDecision] = useState<any[]>([]);
  const { initialState } = useModel('@@initialState');
  const [showQuickAction, setShowQuickAction] = useState<boolean>(false);
  const [showQuickDecision, setShowQuickDecision] = useState<boolean>(false);
  const [nextTaskSelected, setNexTaskSelected] = useState<any>(undefined);
  const [showQuickChangeTypeBusiness, setShowQuickChangeTypeBusiness] = useState<boolean>(false);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});

  const handleChange: TableProps<any>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const getListDecision = async () => {
    const res = await api.ticket.getCoreTaskDecisionByGrpCode(initialState?.currentUser?.grpCode);
    if (res.body?.status === 'OK') {
      setListDecision(res.body.dataRes?.rows);
    }
  };

  const columns: ProColumns<API.RuleListItem & any>[] = [
    {
      title: 'Hành động',
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInForm: true,
      hideInSearch: true,
      hideInTable: activeTab !== 'processing',
      // width: 100,
      render: (dom, entity) => (
        <Button
          onClick={() => {
            setCurrentRow(entity);
            setShowQuickAction(true);
          }}
        >
          Phản hồi
        </Button>
      ),
    },
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
      order: 997,
      filters: true,
      //   filteredValue: filteredInfo?.status || null,
      hideInForm: true,
      request: async () => getMasterDataByTypeUtil('StatusTicket', true, true),
      valueType: 'select',
    },
    {
      title: 'FT Giao dịch + FT Gốc',
      order: 996,
      width: 170,
      dataIndex: 'ft',
    },
    {
      title: 'LOS ID TT Lương/CTTL',
      width: 180,
      order: 4,
      dataIndex: 'ttLuongCttl',
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
      // hideInSearch: true,
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
      // hideInSearch: true,
      width: 60,
    },
    {
      title: 'Tên Khách hàng',
      dataIndex: 'customerName',
      hideInSearch: true,
      // width: 120,
    },
    {
      title: 'Nhóm nghiệp vụ',
      order: 998,
      request: async () => {
        const data = await getMasterDataByTypeUtil('TypeBusiness', true, true);
        return [...data, { label: 'Tất cả', value: '' }];
      },
      ellipsis: true,
      valueType: 'select',
      width: 140,
      formItemProps: {
        initialValue: initialState?.currentUser?.typeBusiness,
      },
      dataIndex: 'typeBusiness',
    },

    {
      title: 'Ngày yêu cầu',
      dataIndex: 'requestDate',
      width: 165,
      valueType: 'dateRange',
      fieldProps: {
        format: 'DD/MM/YYYY',
      },
      formItemProps: {
        initialValue: [moment().subtract(3, 'days'), moment()],
      },
      sorter: true,
      order: 999,
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

  useEffect(() => {
    getListDecision();
  }, []);

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.RuleListItem, API.PageParams>
        actionRef={actionRef}
        formRef={formRef}
        rowKey="ticketId"
        size="small"
        className="ticket-protable"
        // sticky={false}
        // tableLayout='fixed'
        onReset={clearFilters}
        onChange={handleChange}
        pagination={{ pageSizeOptions: [10, 20, 50, 100, 200, 1000] }}
        search={{
          labelWidth: 'auto',
          // defaultColsNumber: 1,
          searchText: 'Lọc',
          span: !isCollapse ? undefined : { xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6 },
          layout: !isCollapse ? 'vertical' : 'horizontal',
          onCollapse(collapsed) {
            setIsCollapse(collapsed);
          },
        }}
        options={{
          density: false,
          search: {
            style: { width: 240 },
            placeholder: 'Nhập từ khoá để tìm kiếm...',
          },
        }}
        cardProps={{
          bodyStyle: {
            paddingBottom: 0,
            paddingTop: 0,
          },
        }}
        tableViewRender={(props, dom) => {
          if (props.dataSource?.length === 0 && !props.loading) return <Empty />;
          return dom;
        }}
        // onRow={(record) => {
        //   return {
        //     onClick: () => {
        //       setCurrentRow(record);
        //       setShowDetail(true);
        //     },
        //   };
        // }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 280px)' }}
        toolbar={{
          // search: {
          //   style: { width: 150 },
          //   placeholder: 'Nhập từ khoá để tìm kiếm...',
          // },
          menu: {
            type: 'tab',
            activeKey: activeTab,
            onChange: async (activeKey: any) => {
              // if (activeKey === 'completed') {
              //   // await actionRef.current.
              // } else {
              //   await formRef.current?.resetFields()
              // }
              await formRef.current?.resetFields();
              actionRef.current?.clearSelected?.();
              actionRef.current?.reload?.();
              setSelectedRows([]);
              setActiveTab(activeKey);
            },
            items: [
              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faDotCircle} /> Tất cả
                  </>
                ),
                key: 'all',
              },

              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faBarsProgress} /> Xử lý
                  </>
                ),
                key: 'processing',
              },
              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faListCheck} /> Đã xử lý
                  </>
                ),
                key: 'processed',
              },
              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faPause} /> Tạm dừng
                  </>
                ),
                key: 'pause',
              },
              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faCancel} /> Đã huỷ
                  </>
                ),
                key: 'cancel',
              },
              {
                //@ts-ignore
                label: (
                  <>
                    <FontAwesomeIcon icon={faCircleCheck} /> Hoàn thành
                  </>
                ),
                key: 'completed',
              },
              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faCompass} /> Nháp
                  </>
                ),
                key: 'draft',
              },
              {
                //@ts-ignore
                label: (
                  <>
                    <FontAwesomeIcon icon={faStar} /> Của tôi
                  </>
                ),
                key: 'my',
              },
            ],
          },
        }}
        tableAlertRender={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            danger
            onClick={() => {
              setModalFormTicketVisible(true);
            }}
          >
            <PlusOutlined /> Tạo mới
          </Button>,
          <Popconfirm title="Bạn có muốn xuất ra Excel không?">
            <Button
              type="primary"
              key="excel"
              style={{ background: '#06762f', borderColor: '#06762f' }}
            >
              <FileExcelOutlined />
            </Button>
          </Popconfirm>,
        ]}
        request={(params, sort, filters) =>
          getListTicket({ params, sort, filters }, typeGetListTicketByTab(activeTab))
        }
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Chọn <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> mục&nbsp;
              {/* <span>
                /{' '}{selectedRowsState?.[0]?.totalRecord || 0}
              </span> */}
            </div>
          }
        >
          <Button
            onClick={() => {
              setSelectedRows([]);
              actionRef.current?.clearSelected?.();
            }}
            danger
            key="cancel"
            icon={<MinusCircleOutlined />}
          >
            Bỏ chọn
          </Button>
          <Button
            onClick={() => {
              setShowQuickAction(true);
            }}
            style={{ background: '#4caf50', borderColor: '#4caf50' }}
            type="primary"
            icon={<ControlOutlined />}
            key="feedback"
          >
            Phản hồi
          </Button>
          <Button
            onClick={() => {
              setShowQuickChangeTypeBusiness(true);
            }}
            style={{ background: '#673ab7', borderColor: '#673ab7' }}
            type="primary"
            icon={<ControlOutlined />}
            key="transfer"
          >
            Chuyển nhóm
          </Button>
          {listDecision.map((value, index) => (
            <>
              {value?.decisionCode === 'ADD_DOCUMENT' ? (
                <Button
                  type="primary"
                  // size='small'
                  key={index}
                  icon={<RightCircleOutlined />}
                  onClick={() => {
                    setShowQuickDecision(true);
                    setNexTaskSelected(value);
                  }}
                  style={{ background: '#ff5722', borderColor: '#ff5722' }}
                >
                  {value?.decisionName}
                </Button>
              ) : (
                <Popconfirm
                  key={index}
                  title={`Bạn có chắc chắn muốn ${value?.decisionName} không?`}
                  onConfirm={async () => {
                    const res = await api.ticket.saveListTicket({
                      ticketIds: selectedRowsState.map((value) => {
                        return value?.ticketId;
                      }),
                      nextTasUid: value?.nextTaskUid,
                    });
                    if (res.body?.status === 'OK') {
                      notification.success({ message: 'Thực hiện quyết định thành công' });
                    }
                    return res.body?.status === 'OK';
                  }}
                  okButtonProps={{ size: 'middle' }}
                  cancelButtonProps={{ size: 'middle' }}
                >
                  <Button key={index} type="primary" icon={<RightCircleOutlined />}>
                    {value?.decisionName}
                  </Button>
                </Popconfirm>
              )}
            </>
          ))}
        </FooterToolbar>
      )}

      {/*  Create or Update Ticket - Moal Form */}
      {
        // modalFormTicketVisible &&
        <ModalFormTicket
          visible={modalFormTicketVisible}
          ticketId={currentRow?.ticketId}
          id={currentRow?.id}
          isDraft={activeTab === 'draft'}
          onSuccess={() => actionRef.current?.reload()}
          onVisibleChange={(visible) => {
            if (!visible && !showDetail) setCurrentRow(undefined);
            setModalFormTicketVisible(visible);
          }}
        />
      }
      <DrawerDetailTicket
        width={'97%'}
        visible={showDetail}
        isDraft={activeTab === 'draft'}
        ticketId={currentRow?.ticketId}
        id={currentRow?.id}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
      />
      <ModalQuickAction
        visible={showQuickAction}
        onVisibleChange={(visible) => {
          setShowQuickAction(visible);
          !visible && setCurrentRow(undefined);
        }}
        onSuccess={() => {
          actionRef.current?.reload();
          setShowQuickAction(false);
        }}
        ticketSelected={selectedRowsState}
        ticketId={currentRow?.ticketId}
        ticketIds={selectedRowsState.map((value) => {
          return value?.ticketId;
        })}
      />
      <ModalQuickDecision
        visible={showQuickDecision}
        nextTasInfo={nextTaskSelected}
        onVisibleChange={(visible) => {
          setShowQuickDecision(visible);
          !visible && setNexTaskSelected(undefined);
        }}
        onSuccess={() => {
          setShowQuickDecision(false);
          actionRef.current?.reload();
        }}
        ticketIds={selectedRowsState.map((value) => {
          return value?.ticketId;
        })}
      />
      <ModalTransferTypeBusiness
        visible={showQuickChangeTypeBusiness}
        onVisibleChange={(visible) => {
          setShowQuickChangeTypeBusiness(visible);
          !visible && setCurrentRow(undefined);
        }}
        initiateValue={currentRow?.typeBusiness}
        ticketSelected={selectedRowsState}
        onSuccess={() => {
          setShowQuickChangeTypeBusiness(false);
          actionRef.current?.reload();
        }}
        ticketIds={selectedRowsState.map((value) => {
          return value?.ticketId;
        })}
      />
    </PageContainer>
  );
};

export default TicketTableList;
