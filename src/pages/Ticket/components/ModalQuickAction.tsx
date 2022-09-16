import api from '@/services/api';
import { filterOptionWithVietnamese, getMasterDataByTypeUtil } from '@/utils';
import {
  ModalForm,
  ProFormInstance,
  ProFormItem,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { notification } from 'antd';
import { useRef } from 'react';

type ModalQuickActionProps = {
  visible: boolean;
  onVisibleChange?: (visible: boolean) => void;
  ticketId?: string;
  ticketIds?: string[];
  ticketSelected?: any[];
  onSuccess?: () => void;
  onFailure?: () => void;
};
const ModalQuickAction: React.FC<ModalQuickActionProps> = (props) => {
  const {
    visible,
    onVisibleChange,
    ticketId = '',
    onSuccess,
    onFailure,
    ticketIds = [],
    ticketSelected = [],
  } = props;
  const restFormRef = useRef<ProFormInstance>();

  return (
    <ModalForm
      visible={visible}
      onVisibleChange={onVisibleChange}
      formRef={restFormRef}
      title={`Thông tin phản hồi ${
        ticketId ? `Ticket ID: ${ticketId}` : `${ticketIds.length} ticket được chọn`
      }`}
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        const res = await api.ticket.updateFastFeedbackTickets({
          ticketIds: [ticketId, ...ticketIds],
          ...values,
        });
        if (res.body?.status === 'OK') {
          notification.success({ message: 'Phản hồi thành công' });
          onSuccess?.();
        } else onFailure?.();
        return res.body?.status === 'OK';
      }}
      submitter={{
        searchConfig: {
          submitText: 'Phản hồi',
        },
      }}
      initialValues={
        ticketSelected.length === 1
          ? { typeBusiness: ticketSelected?.[0]?.typeBusiness }
          : undefined
      }
      onReset={() => console.log('reset')}
      layout="horizontal"
      labelCol={{ span: 6 }}
    >
      <ProFormSelect
        name="typeBusiness"
        required
        label="Nhóm nghiệp vụ"
        showSearch
        request={async () => getMasterDataByTypeUtil('TypeBusiness', true, true)}
        rules={[
          {
            required: true,
            message: 'Nhóm nghiệp vụ là bắt buộc',
          },
        ]}
        fieldProps={{
          filterOption: filterOptionWithVietnamese,
        }}
      />
      <ProFormItem label="Email CC/To">
        <span>{ticketSelected?.[0]?.emailCcProcess || ''}</span>
      </ProFormItem>
      <ProFormText
        name="emailCcProcess"
        label="Thêm Email CC/To"
        // rules={[
        //     {
        //         required: true,
        //         message: 'Email CC/Tolà bắt buộc'
        //     }
        // ]}
      />
      <ProFormTextArea
        name="ftContent"
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

export default ModalQuickAction;
