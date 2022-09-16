import api from '@/services/api';
import { filterOptionWithVietnamese, getMasterDataByTypeUtil } from '@/utils';
import { ModalForm, ProFormInstance, ProFormSelect } from '@ant-design/pro-components';
import { notification } from 'antd';
import { useRef } from 'react';

type ModalTransferTypeBusinessProps = {
  ticketId?: string;
  ticketIds?: string[];
  ticketSelected?: any[];
  visible: boolean;
  initiateValue?: string;
  onVisibleChange?: (visible: boolean) => void;
  onSuccess?: (typeBusiness: string) => void;
  onFailure?: (reason?: string) => void;
};
const ModalTransferTypeBusiness: React.FC<ModalTransferTypeBusinessProps> = (props) => {
  const {
    visible,
    onVisibleChange,
    ticketId = '',
    onSuccess,
    onFailure,
    ticketIds = [],
    initiateValue,
    ticketSelected = [],
  } = props;
  const restFormRef = useRef<ProFormInstance>();
  return (
    <ModalForm
      visible={visible}
      onVisibleChange={onVisibleChange}
      formRef={restFormRef}
      title={`Chuyển nhóm nghiệp vụ của ${
        ticketId ? `Ticket ID: ${ticketId}` : `${ticketIds.length} ticket được chọn`
      }`}
      modalProps={{
        destroyOnClose: true,
      }}
      initialValues={{
        typeBusiness:
          initiateValue || ticketSelected.length === 1
            ? ticketSelected[0]?.typeBusiness
            : undefined,
      }}
      onFinish={async (values) => {
        const res = await api.ticket.updateTypeBusinessOfTickets({
          ticketIds: [ticketId, ...ticketIds],
          ...values,
        });
        if (res.body?.status === 'OK') {
          notification.success({ message: 'Chuyển nhóm nghiệp vụ thành công' });
          onSuccess?.(values?.typeBusiness);
        } else onFailure?.();
        return res.body?.status === 'OK';
      }}
      submitter={{
        searchConfig: {
          submitText: 'Chuyển nhóm',
        },
      }}
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
    </ModalForm>
  );
};

export default ModalTransferTypeBusiness;
