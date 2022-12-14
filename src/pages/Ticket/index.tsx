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
      title: 'H??nh ?????ng',
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
          Ph???n h???i
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
      order: 997,
      filters: true,
      //   filteredValue: filteredInfo?.status || null,
      hideInForm: true,
      request: async () => getMasterDataByTypeUtil('StatusTicket', true, true),
      valueType: 'select',
    },
    {
      title: 'FT Giao d???ch + FT G???c',
      order: 996,
      width: 170,
      dataIndex: 'ft',
    },
    {
      title: 'LOS ID TT L????ng/CTTL',
      width: 180,
      order: 4,
      dataIndex: 'ttLuongCttl',
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
      width: 160,
    },
    {
      title: 'NH h?????ng/S??? Pin + T??n NH',
      width: 190,
      dataIndex: 'bank',
      // hideInSearch: true,
    },
    {
      title: 'Ng??y duy???t GD g???c',
      dataIndex: 'transDate',
      hideInSearch: true,
      width: 140,
    },
    {
      title: 'Chi???u GD',
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
      title: 'T??n Kh??ch h??ng',
      dataIndex: 'customerName',
      hideInSearch: true,
      // width: 120,
    },
    {
      title: 'Nh??m nghi???p v???',
      order: 998,
      request: async () => {
        const data = await getMasterDataByTypeUtil('TypeBusiness', true, true);
        return [...data, { label: 'T???t c???', value: '' }];
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
      title: 'Ng??y y??u c???u',
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
          searchText: 'L???c',
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
            placeholder: 'Nh???p t??? kho?? ????? t??m ki???m...',
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
          //   placeholder: 'Nh???p t??? kho?? ????? t??m ki???m...',
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
                    <FontAwesomeIcon icon={faDotCircle} /> T???t c???
                  </>
                ),
                key: 'all',
              },

              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faBarsProgress} /> X??? l??
                  </>
                ),
                key: 'processing',
              },
              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faListCheck} /> ???? x??? l??
                  </>
                ),
                key: 'processed',
              },
              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faPause} /> T???m d???ng
                  </>
                ),
                key: 'pause',
              },
              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faCancel} /> ???? hu???
                  </>
                ),
                key: 'cancel',
              },
              {
                //@ts-ignore
                label: (
                  <>
                    <FontAwesomeIcon icon={faCircleCheck} /> Ho??n th??nh
                  </>
                ),
                key: 'completed',
              },
              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faCompass} /> Nh??p
                  </>
                ),
                key: 'draft',
              },
              {
                //@ts-ignore
                label: (
                  <>
                    <FontAwesomeIcon icon={faStar} /> C???a t??i
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
            <PlusOutlined /> T???o m???i
          </Button>,
          <Popconfirm title="B???n c?? mu???n xu???t ra Excel kh??ng?">
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
              Ch???n <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> m???c&nbsp;
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
            B??? ch???n
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
            Ph???n h???i
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
            Chuy???n nh??m
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
                  title={`B???n c?? ch???c ch???n mu???n ${value?.decisionName} kh??ng?`}
                  onConfirm={async () => {
                    const res = await api.ticket.saveListTicket({
                      ticketIds: selectedRowsState.map((value) => {
                        return value?.ticketId;
                      }),
                      nextTasUid: value?.nextTaskUid,
                    });
                    if (res.body?.status === 'OK') {
                      notification.success({ message: 'Th???c hi???n quy???t ?????nh th??nh c??ng' });
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
