import api from '@/services/api';
import { ModalForm, ProFormInstance, ProFormTextArea } from '@ant-design/pro-components';
import { notification } from 'antd';
import { useRef } from 'react';

type ModalQuickDecisionProps = {
  visible: boolean;
  onVisibleChange?: (visible: boolean) => void;
  ticketId?: string;
  ticketIds?: string[];
  nextTasInfo: any;
  onSuccess?: () => void;
  onFailure?: () => void;
};
const ModalQuickDecision: React.FC<ModalQuickDecisionProps> = (props) => {
  const {
    visible,
    onVisibleChange,
    ticketId = '',
    onSuccess,
    onFailure,
    ticketIds = [],
    nextTasInfo = {},
  } = props;
  const restFormRef = useRef<ProFormInstance>();

  return (
    <ModalForm
      visible={visible}
      onVisibleChange={onVisibleChange}
      formRef={restFormRef}
      title={`Thực hiện quyết định ${nextTasInfo?.decisionName} cho ${
        ticketId ? `Ticket ID: ${ticketId}` : `${ticketIds.length} ticket được chọn`
      }`}
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        const res = await api.ticket.saveListTicket({
          ticketIds: [ticketId, ...ticketIds],
          ...values,
          nextTasUid: nextTasInfo?.nextTaskUid,
        });
        if (res.body?.status === 'OK') {
          notification.success({ message: 'Thực hiện quyết định thành công' });
          onSuccess?.();
        } else onFailure?.();
        return res.body?.status === 'OK';
      }}
      submitter={{
        searchConfig: {
          submitText: 'Thực hiện quyết định',
        },
      }}
      onReset={() => console.log('reset')}
      labelCol={{ span: 6 }}
    >
      <ProFormTextArea
        name="note"
        required
        label="Nội dung phản hồi"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập nội dung phản hồi',
          },
        ]}
      />
    </ModalForm>
  );
};

export default ModalQuickDecision;
