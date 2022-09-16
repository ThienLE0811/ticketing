import PdfPreview from '@/components/PdfPreview';
import api from '@/services/api';
import graphql from '@/services/graphql';
import {
  colorSla,
  getBase64,
  getDueDateAsMinute,
  getMasterDataByTypeUtil,
  readFileToUnit8Array,
} from '@/utils';
import {
  CloseCircleOutlined,
  FolderAddOutlined,
  QuestionCircleOutlined,
  RightCircleOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  // FooterToolbar,
  ModalForm,
  ProCard,
  ProColumns,
  ProCoreActionType,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProForm,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { faClockFour, faEdit, faMoneyBill1Wave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Badge,
  Button,
  Col,
  Image,
  Input,
  message,
  Modal,
  ModalProps,
  notification,
  Popconfirm,
  Row,
  Spin,
  Tooltip,
  UploadFile,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import DrawerDetailTicket from '../DrawerDetailTicket';
import AttachmentDoc from './AttachmentDoc';
import ProcessInput from './ProcessInput';
import RequestInput from './RequestInput';
import './styles.less';
import TransactionInput from './TransactionInput';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type ModalFormTicketProps = {
  visible: boolean;
  ticketId?: string;
  isDraft?: boolean;
  id?: string;
  modalProps?: Omit<ModalProps, 'visible'>;
  onSuccess?: (data: any) => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

const ModalFormTicket: React.FC<ModalFormTicketProps> = (props) => {
  const {
    visible,
    onVisibleChange,
    ticketId,
    onSuccess,
    onFailure,
    modalProps,
    id = '',
    isDraft,
  } = props;
  const [loadFetchTransaction, setLoadFetchTransaction] = useState<boolean>(false);
  const [loadGenTicket, setLoadGenTicket] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [genTicketId, setGenTicketId] = useState<Record<string, string> | undefined | null>({});
  const [statusGenTicketId, setStatusGenTicketId] = useState<boolean | undefined>(undefined);
  const [transactionInfo, setTransactionInfo] = useState<any>(undefined);
  const { initialState } = useModel('@@initialState');
  const [ticketInfo, setTicketInfo] = useState<any>(undefined);
  const [listDecision, setListDecision] = useState<any[]>([]);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const restFormRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const actionRefTransaction = useRef<ProCoreActionType>();
  const [filePreview, setFilePreview] = useState<any>(undefined);
  const [visibleImage, setVisibleImage] = useState<boolean>(false);
  const [visiblePdf, setVisiblePdf] = useState<boolean>(false);
  // const [showQuickDecision, setShowQuickDecision] = useState<boolean>(false);
  const [nextTaskSelected, setNexTaskSelected] = useState<any>(undefined);

  const columnsCreateBy: ProColumns<any>[] = [
    {
      title: 'Người khởi tạo',
      dataIndex: 'usrFullName',
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
      dataIndex: 'unit',
    },
    {
      title: 'IPPhone',
      dataIndex: 'amount',
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createTime',
      renderText: () => ticketInfo?.createdDate || `${moment().format('DD/MM/YYYY hh:mm:ss')}`,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'usrPhone',
    },
    {
      title: 'Email CC',
      dataIndex: 'ftRelated',
    },
  ];

  const columnsTicketRelated: ProColumns<any>[] = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      render: (dom: React.ReactNode, entity) => {
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
      title: 'Tiêu đề',
      dataIndex: 'ticketTitle',
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      hideInForm: true,
      request: async () => getMasterDataByTypeUtil('StatusTicket', true, true),
      valueType: 'select',
    },
    {
      title: 'FT Giao dịch + FT Gốc',
      dataIndex: 'ft',
    },
    {
      title: 'Số LCC tra soát',
      dataIndex: 'lcc',
    },
    {
      title: 'FM tra soát',
      dataIndex: 'fm',
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
      title: 'Số tiền',
      dataIndex: 'amount',
    },
    {
      title: 'Nội dung trả lời',
      // dataIndex: 'userEmailCc',
    },
    {
      title: 'Email CC',
      dataIndex: 'userEmailCc',
    },
    {
      title: 'Kênh giao dịch/đối tác',
      dataIndex: 'channel',
    },
    {
      title: 'NH hưởng/Số Pin + Tên NH',
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
    },
    {
      title: 'ID KH',
      dataIndex: 'customerAccount',
    },
    {
      title: 'Tên Khách hàng',
      dataIndex: 'customerName',
    },
    {
      title: 'Nhóm nghiệp vụ',
      request: async () => getMasterDataByTypeUtil('TypeBusiness', true, true),
      valueType: 'select',
      dataIndex: 'typeBusiness',
    },
    {
      title: 'Thời gian khởi tạo',
      dataIndex: 'createdDate',
    },
    {
      title: 'Thời gian hết hạn SLA',
      dataIndex: 'dueDate',
    },
    {
      title: 'Thời gian SLA còn lại(phút)',
      width: 200,
      // dataIndex: 'userEmailCc',
    },
    {
      title: 'Thời gian xử lý(phút)',
      dataIndex: 'timeProcess',
    },
  ];

  const columnsProcess: ProColumns<any>[] = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      renderText: (dom, entity) => (
        <>
          <Badge color={colorSla(getDueDateAsMinute(entity?.dueDate))} />
          {dom}
        </>
      ),
    },
    {
      title: 'Bước xử lý hiện tại',
      dataIndex: 'tasTitle',
      renderText: (text) => <span style={{ color: '#3f51b5' }}>{text}</span>,
    },
    {
      title: 'Thời gian yêu cầu',
      dataIndex: 'createdDate',
    },
    {
      title: 'Thời gian hết hạn',
      dataIndex: 'dueDate',
    },
  ];

  const handlePreview = async (file: UploadFile) => {
    try {
      switch (true) {
        case _.includes(file?.type, 'image'):
          const fileBase64 = await getBase64(file.originFileObj as File);
          setFilePreview(fileBase64);
          setVisibleImage(true);
          return;
        case _.includes(file?.type, 'pdf'):
          const fileUint8Array = await readFileToUnit8Array(file.originFileObj as File);
          setFilePreview(fileUint8Array);
          setVisiblePdf(true);
          return;
      }
    } catch (error: any) {
      message.error(error?.toString());
    }
  };

  const handleFetchTransaction = async () => {
    setLoadFetchTransaction(true);
    try {
      const transactionId = restFormRef.current?.getFieldValue(['fm_ft']);
      const res = await graphql.transaction.getAllDocTransaction(
        { transactionId },
        { fetchPolicy: 'no-cache' },
      );
      setLoadFetchTransaction(false);
      if (res.data?.graphql?.body?.status === 'OK') {
        restFormRef.current?.setFieldsValue(res.data?.graphql?.body?.enquiry);
        setTransactionInfo(res.data?.graphql?.body?.enquiry);
        actionRef.current?.reload();
      }
    } catch (error: any) {
      message.error(error.toString());
      setLoadFetchTransaction(false);
    }
  };

  const generateTicketId = async () => {
    setLoadGenTicket(true);
    const res = await api.ticket.generateTicketId();
    setLoadGenTicket(false);
    if (res.body?.status === 'OK') {
      setGenTicketId(res.body?.dataRes);
      // const { id, tasUid } = res.body?.dataRes as any
      // restFormRef.current?.setFieldsValue({ ticketId: id })
      setStatusGenTicketId(true);
    } else setStatusGenTicketId(false);
  };

  const handleSubmit = async (formValues: any, saveDraft?: boolean) => {
    const fileUpload = ((restFormRef.current?.getFieldValue(['file']) as any[]) || [])
      .filter((predicate) => predicate?.status === 'done')
      .map(
        ({
          size,
          type,
          response: {
            body: {
              transaction: { fileName, version, docID, docUrl },
            },
          },
          name,
        }) => {
          return {
            name: name,
            fileSize: size,
            fileType: type,
            fileName,
            docID,
            docUrl,
            version,
            categoryID: 'Ticketing-TTTN',
            type,
            createdBy: initialState?.currentUser?.usrUsername,
            createdDate: moment().format('DD/MM/YYYY HH:mm:ss'),
          };
        },
      );
    try {
      setSubmitForm(true);
      const res = saveDraft
        ? await api.ticket.saveDraftTicket({
            ticketInfo: {
              ticketId: genTicketId?.id,
              tasUid: genTicketId?.tasUid,
              ...ticketInfo,
              ...transactionInfo,
              ...formValues,
              ...restFormRef.current?.getFieldsValue(),
            },
            fileUpload,
          })
        : ticketId
        ? await api.ticket.saveSendTicket({
            ticketInfo: {
              ...ticketInfo,
              ...formValues,
              nextTasUid: nextTaskSelected,
            },
            fileUpload,
          })
        : await api.ticket.saveTicket({
            ticketInfo: {
              ticketId: genTicketId?.id,
              tasUid: genTicketId?.tasUid,
              ...transactionInfo,
              ...formValues,
            },
            fileUpload,
          });
      setSubmitForm(false);
      if (res.body?.status === 'OK') {
        onVisibleChange(false);
        onSuccess?.(res.body?.dataRes);
        notification.success({
          message: saveDraft
            ? 'Lưu nháp thành công!'
            : ticketId
            ? 'Cập nhật Ticket thành công'
            : 'Tạo mới Ticket thành công',
        });
        return Promise.resolve();
      } else {
        onFailure?.(res.body);
        return Promise.reject();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getListDecision = async (taskUid: string) => {
    const res = await api.ticket.getCoreTaskDecisionByTaskId(taskUid);
    if (res.body?.status === 'OK') {
      setListDecision(res.body.dataRes?.rows);
    }
  };

  useEffect(() => {
    if (!ticketId) {
      generateTicketId();
    }
  }, [ticketId]);

  return (
    <ModalForm
      visible={visible}
      width={'95%'}
      className="modalFormTicket"
      // initialValues={initiateData as API.SaveTicket || { typeFetch: 'fm' }}
      scrollToFirstError={{ behavior: 'smooth' }}
      onFinishFailed={(errorInfo) => {
        if (errorInfo.errorFields) {
          errorInfo.errorFields.map((value, index) => {
            notification.warning({
              message: `Lỗi trường ${value.name}`,
              description: value.errors?.[0],
            });
          });
        }
      }}
      request={async () => {
        if (ticketId) {
          const ticketData = isDraft
            ? await api.ticket.getDraftByTicketId(id)
            : await api.ticket.getTicketById(ticketId);
          setTicketInfo(ticketData?.body?.dataRes);
          getListDecision(ticketData?.body?.dataRes?.tasUid);
          return ticketData?.body?.dataRes;
        } else {
          return Promise.resolve({ typeFetch: 'fm' });
        }
      }}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        okText: 'Xác nhận',
        className: 'modal-form-ticket',
        ...modalProps,
      }}
      submitter={
        loadGenTicket
          ? false
          : {
              render: ({ submit, reset, submitButtonProps }) => (
                <FooterToolbar style={{ zIndex: 9999, lineHeight: '42px' }}>
                  <Popconfirm
                    arrowPointAtCenter={true}
                    onConfirm={() => onVisibleChange(false)}
                    title={`Bạn chắc chắn muốn thoát`}
                    key="popconfirm-cancel"
                    icon={<QuestionCircleOutlined style={{ color: '#ff4d4f' }} />}
                  >
                    <Button
                      key="cancel"
                      type="dashed"
                      style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }}
                      icon={<CloseCircleOutlined />}
                    >
                      Thoát
                    </Button>
                  </Popconfirm>
                  {(!ticketId || listDecision.length > 0) && (
                    <Button
                      key="saveDraft"
                      loading={submitForm}
                      icon={<FolderAddOutlined />}
                      onClick={() => handleSubmit(null, true)}
                    >
                      Lưu nháp
                    </Button>
                  )}
                  {!ticketId && (
                    <Button
                      key="submit"
                      loading={submitForm}
                      icon={<SendOutlined />}
                      type="primary"
                      onClick={submit}
                    >
                      {'Tạo yêu cầu'}
                    </Button>
                  )}
                  {ticketId &&
                    listDecision.map((value, index) => (
                      <Popconfirm
                        key={index}
                        title={`Bạn có chắc chắn muốn ${value?.decisionName} không?`}
                        onConfirm={submit}
                        onVisibleChange={() => {
                          setNexTaskSelected(value?.nextTaskUid);
                        }}
                      >
                        <Button
                          type="primary"
                          icon={<RightCircleOutlined />}
                          {...submitButtonProps}
                          style={
                            value?.decisionCode === 'ADD_DOCUMENT'
                              ? { background: '#ff5722', borderColor: '#ff5722' }
                              : undefined
                          }
                        >
                          {value?.decisionName}
                        </Button>
                      </Popconfirm>
                    ))}
                </FooterToolbar>
              ),
            }
      }
      formRef={restFormRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={
        ticketId ? (
          <ProDescriptions<API.RuleListItem & any>
            column={{ xl: 4, lg: 4, sm: 4 }}
            layout="vertical"
            size="small"
            className="modalFormTicket"
            labelStyle={{
              color: '#1677ff',
              fontWeight: 600,
            }}
            title={false}
            dataSource={ticketInfo}
            columns={columnsProcess as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        ) : (
          `Tạo mới Ticket: ${genTicketId?.id || ''}`
        )
      }
    >
      {loadGenTicket && (
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" tip="Đang khởi tạo Ticket ID" />
        </div>
      )}
      {!loadGenTicket && statusGenTicketId === false && (
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" size="large" onClick={generateTicketId}>
            Tạo lại Ticket ID
          </Button>
        </div>
      )}
      {!loadGenTicket && statusGenTicketId !== false && (
        <>
          <Row gutter={[16, 16]}>
            <ProCard
              bordered
              size="small"
              title={
                <>
                  <FontAwesomeIcon icon={faMoneyBill1Wave} /> Thông tin giao dịch
                </>
              }
              headerBordered
              className="card-fill-header"
            >
              {!ticketId && (
                <>
                  <Col span={24}>
                    <ProForm.Item label="Mã FM Tra soát/FT Giao dịch" required name="fm_ft">
                      <Input.Group compact>
                        <Input
                          style={{ width: 'calc(100% - 80px)' }}
                          allowClear
                          name="fm_ft"
                          onKeyDown={(e) => {
                            e.key === 'Enter' && handleFetchTransaction();
                          }}
                          onChange={(e) => {
                            restFormRef.current?.setFieldsValue({ fm_ft: e.target.value });
                            if (e.target.value === '') {
                              setTransactionInfo(undefined);
                            }
                          }}
                          // defaultValue={initiateData?.usrUsername}
                          required
                        />
                        <Tooltip title="Lấy dữ liệu">
                          <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            loading={loadFetchTransaction}
                            onClick={handleFetchTransaction}
                          >
                            Tìm
                          </Button>
                        </Tooltip>
                      </Input.Group>
                    </ProForm.Item>
                  </Col>
                </>
              )}
              <TransactionInput formRef={restFormRef.current} disable={ticketId != undefined} />
            </ProCard>
            <RequestInput formRef={restFormRef.current} />
            <AttachmentDoc
              handlePreview={handlePreview}
              ticketId={ticketId}
              id={id}
              isDraft={isDraft}
              formRef={restFormRef.current}
            />
            {ticketId && <ProcessInput formRef={restFormRef.current} />}
            <ProCard
              size="small"
              bordered
              headerBordered
              title={
                <>
                  <FontAwesomeIcon icon={faEdit} /> Thông tin khởi tạo
                </>
              }
              className="card-fill-header"
            >
              <ProDescriptions
                columns={columnsCreateBy}
                layout="vertical"
                size="small"
                column={{ xl: 5, lg: 4, sm: 4, xxl: 8 }}
                dataSource={initialState?.currentUser}
                labelStyle={{
                  color: '#37474f',
                  fontWeight: 600,
                }}
              />
            </ProCard>
            <ProCard
              size="small"
              bordered
              headerBordered
              className="card-fill-header"
              title={
                <>
                  <FontAwesomeIcon icon={faClockFour} /> Lịch sử hỗ trợ
                </>
              }
            >
              <ProTable
                search={false}
                actionRef={actionRef}
                size="small"
                rowKey="ticketId"
                options={false}
                pagination={{ pageSize: 5 }}
                request={(params, sort, filters) => {
                  const typeFetch = restFormRef.current?.getFieldValue(['typeFetch']);
                  const trace = restFormRef.current?.getFieldValue(['trace']);
                  const code = restFormRef.current?.getFieldValue(['fm_ft']);
                  if (!code && !ticketInfo?.fm && !ticketInfo?.ft) return Promise.resolve({});
                  return api.ticket.getListTicket(
                    {
                      params: {
                        ...params,
                        ft: typeFetch === 'ft' ? code : '',
                        fm: typeFetch === 'fm' ? code : '',
                        trace: trace,
                      },
                      sort,
                      filters,
                    },
                    'getHisTicketByFtFmTrace',
                  );
                }}
                cardProps={{
                  bodyStyle: { padding: 0 },
                }}
                columns={columnsTicketRelated}
                scroll={{ x: 'max-content' }}
              />
            </ProCard>
          </Row>
          <DrawerDetailTicket
            visible={showDetail}
            ticketId={currentRow?.ticketId}
            onClose={() => {
              setCurrentRow(undefined);
              setShowDetail(false);
            }}
          />
          <Modal
            visible={visiblePdf}
            onCancel={() => {
              setVisiblePdf(false);
              setFilePreview(undefined);
            }}
            closable={false}
            destroyOnClose
            title={false}
            footer={false}
            centered
            bodyStyle={{ padding: 0 }}
            width={1000}
          >
            <PdfPreview src={filePreview} />
          </Modal>
          <Image
            preview={{
              visible: visibleImage,
              onVisibleChange: (value) => {
                setVisibleImage(value);
                if (value == false) {
                  setFilePreview(undefined);
                }
              },
              src: filePreview,
            }}
            hidden
          />
        </>
      )}
    </ModalForm>
  );
};

export default ModalFormTicket;
