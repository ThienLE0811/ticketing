import api from '@/services/api';
import { ModalForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';

import { Badge, Col, notification, Row } from 'antd';
import React, { useRef } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type ModalFormRoleProps = {
  visible: boolean;
  initiateData?: any;
  onSuccess?: (data: any) => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

const ModalFormRole: React.FC<ModalFormRoleProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } = props;

  const restFormRef = useRef<ProFormInstance>();

  const handleSubmit = async (formValues: any) => {
    try {
      const res = await api.group.updateCoreGroup({ ...formValues, grpUid: initiateData?.grpUid });
      if (res.body?.status === 'OK') {
        onVisibleChange(false);
        onSuccess?.(res.body?.dataRes);
        notification.success({
          message: initiateData?.grpUid ? 'Cập nhật Nhóm thành công' : 'Tạo mới Nhóm thành công',
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

  return (
    <ModalForm
      visible={visible}
      initialValues={initiateData || { grpStatus: 'Y' }}
      // request={() => initiateData || { status: 'Y' }}
      modalProps={{
        destroyOnClose: true,
        okText: 'Xác nhận',
      }}
      formRef={restFormRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={initiateData?.grpUid ? 'Cập nhật nhóm' : 'Tạo mới nhóm'}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            label="Tên"
            name="grpName"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="Tiêu đề"
            name="grpTitle"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="Mã"
            name="grpCode"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            label="Trạng thái"
            required
            name="grpStatus"
            allowClear={false}
            valueEnum={{
              Y: { text: <Badge status="success" text="Hoạt động" /> },
              N: { text: <Badge status="error" text="Không hoạt động" /> },
            }}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormRole;
