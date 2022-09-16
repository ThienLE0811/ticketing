import NameMasterData from '@/hooks/NameMasterData';
import api from '@/services/api';
import { ControlOutlined, EditOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, notification, Popconfirm, Space, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import DetailTicket from './DetailTicket';
import ModalFormTicket from './ModalFormTicket';
import ModalQuickDecision from './ModalQuickDecision';
import ModalTransferTypeBusiness from './ModalTransferTypeBussiness';

type DrawerDetailTicketProps = {
  visible: boolean;
  ticketId: string;
  isDraft?: boolean;
  id?: string;
  width?: string | number;
  onClose?: () => void;
  onSuccess?: () => void;
};
const DrawerDetailTicket: React.FC<DrawerDetailTicketProps> = (props) => {
  const { visible, onClose, ticketId, isDraft, width = '95%', onSuccess, id = '' } = props;
  const [ticketInfo, setTicketInfo] = useState<any>(undefined);
  const [loadingTicket, setLoadingTicket] = useState<boolean>(false);
  const [loadingDecision, setLoadingDecision] = useState<boolean>(true);
  const [listDecision, setListDecision] = useState<any[]>([]);
  const [modalFormTicketVisible, setModalFormTicketVisible] = useState<boolean>(false);
  const [showQuickChangeTypeBusiness, setShowQuickChangeTypeBusiness] = useState<boolean>(false);
  const [showQuickDecision, setShowQuickDecision] = useState<boolean>(false);
  const [nextTaskSelected, setNexTaskSelected] = useState<any>(undefined);

  const getTicketInfo = async () => {
    setLoadingTicket(true);
    const res = isDraft
      ? await api.ticket.getDraftByTicketId(id)
      : await api.ticket.getTicketById(ticketId);
    setLoadingTicket(false);
    if (res.body?.status === 'OK') {
      setTicketInfo(res.body.dataRes);
      getListDecision(res.body.dataRes?.tasUid);
      // actionRef.current?.reload()
    } else {
      setTicketInfo(null);
    }
  };
  const getListDecision = async (tasUid: string) => {
    setLoadingDecision(true);
    const res = await api.ticket.getCoreTaskDecisionByTaskId(tasUid);
    setLoadingDecision(false);
    if (res.body?.status === 'OK') {
      setListDecision(res.body.dataRes?.rows);
    }
  };

  const handleSaveSendTicket = async (tasUid: string) => {
    const res = await api.ticket.saveSendTicket({
      ticketInfo: { ...ticketInfo, nextTasUid: tasUid },
    });
    if (res.body?.status === 'OK') {
      notification.success({ message: 'Thao tác thành công!' });
      getTicketInfo();
      onSuccess?.();
    }
  };

  useEffect(() => {
    ticketId && getTicketInfo();
  }, [ticketId]);

  return (
    <Drawer
      width={width}
      visible={visible}
      destroyOnClose
      headerStyle={{
        padding: '6px 10px',
      }}
      bodyStyle={{
        padding: 10,
      }}
      onClose={() => {
        onClose?.();
        setListDecision([]);
        // setTicketInfo(undefined)
      }}
      title={
        <>
          Ticket: {ticketId} -{' '}
          <Tag color={'blue'}>
            <NameMasterData type="StatusTicket" value={ticketInfo?.status}></NameMasterData>
          </Tag>
        </>
      }
      extra={
        <Space>
          <Button
            onClick={() => {
              setShowQuickChangeTypeBusiness(true);
            }}
            style={{ background: '#673ab7', borderColor: '#673ab7' }}
            type="primary"
            icon={<ControlOutlined />}
            key="cancel"
          >
            Chuyển nhóm
          </Button>
          {loadingDecision && <Spin />}
          {listDecision.map((value, index) =>
            value?.decisionCode === 'ADD_DOCUMENT' ? (
              <Button
                type="primary"
                key={`${index}-button`}
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
                  return handleSaveSendTicket(value.nextTaskUid);
                }}
                okButtonProps={{ size: 'middle' }}
                cancelButtonProps={{ size: 'middle' }}
              >
                <Button type="primary" icon={<RightCircleOutlined />}>
                  {value?.decisionName}
                </Button>
              </Popconfirm>
            ),
          )}
          <Button
            icon={<EditOutlined />}
            danger
            onClick={() => {
              setModalFormTicketVisible(true);
            }}
            type="primary"
          >
            Cập nhật
          </Button>
        </Space>
      }
    >
      <DetailTicket
        loading={loadingTicket}
        ticketInfo={ticketInfo}
        ticketId={ticketId}
        id={id}
        isDraft={isDraft}
      />
      {
        // modalFormTicketVisible &&
        <ModalFormTicket
          visible={modalFormTicketVisible}
          ticketId={ticketId}
          isDraft={isDraft}
          id={id}
          onVisibleChange={(visible) => {
            setModalFormTicketVisible(visible);
          }}
          onSuccess={() => {
            setModalFormTicketVisible(false);
            onSuccess?.();
            getTicketInfo();
          }}
        />
      }
      <ModalQuickDecision
        visible={showQuickDecision}
        nextTasInfo={nextTaskSelected}
        onVisibleChange={(visible) => {
          setShowQuickDecision(visible);
          !visible && setNexTaskSelected(undefined);
        }}
        onSuccess={() => {
          setShowQuickDecision(false);
          onClose?.();
          onSuccess?.();
        }}
        ticketId={ticketId}
      />
      <ModalTransferTypeBusiness
        visible={showQuickChangeTypeBusiness}
        onVisibleChange={(visible) => {
          setShowQuickChangeTypeBusiness(visible);
        }}
        onSuccess={(typeBusiness) => {
          setShowQuickChangeTypeBusiness(false);
          onSuccess?.();
          setTicketInfo((pre: any) => {
            return {
              ...pre,
              typeBusiness,
            };
          });
        }}
        ticketId={ticketId}
        initiateValue={ticketInfo?.typeBusiness}
      />
    </Drawer>
  );
};

export default DrawerDetailTicket;
