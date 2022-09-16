import api from '@/services/api';
import { getMasterDataByTypeUtil } from '@/utils';
import {
  ModalForm,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import { Badge, Col, notification, Row } from 'antd';
import React, { useRef, useState } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type ModalFormSlaProps = {
  visible: boolean;
  initiateData?: any;
  onSuccess?: (data: any) => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

const ModalFormSla: React.FC<ModalFormSlaProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } = props;
  console.log(initiateData);

  const restFormRef = useRef<ProFormInstance>();

  const handleSubmit = async (formValues: any) => {
    console.log(formValues);

    try {
      const res = !initiateData?.id
        ? await api.sla.createSla(formValues)
        : await api.sla.updateSla({ ...formValues, id: initiateData.id });
      if (res.body?.status === 'OK') {
        onVisibleChange(false);
        onSuccess?.(res.body?.dataRes);
        notification.success({
          message: initiateData?.id ? 'Cập nhật SLA thành công' : 'Tạo mới SLA thành công',
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
      open={visible}
      initialValues={initiateData || { status: 'ACTIVE' }}
      modalProps={{
        destroyOnClose: true,
        okText: 'Xác nhận',
      }}
      formRef={restFormRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={initiateData?.id ? 'Cập nhật SLA' : 'Tạo mới SLA'}
    >
      <Row gutter={16}>
        <Col span={8}>
          <ProFormText
            label="Mã code"
            name="code"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={8}>
          <ProFormDigit
            label="Thời gian đóng"
            name="timeCloseSla"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={8}>
          <ProFormDigit
            label="Thời gian xử lý"
            name="timeSla"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="Nhóm nghiệp vụ"
            name="typeBusiness"
            required
            request={async () => getMasterDataByTypeUtil('TypeBusiness', true, true)}
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="Trạng thái"
            required
            name="status"
            allowClear={false}
            valueEnum={{
              ACTIVE: { text: <Badge status="success" text="Hoạt động" /> },
              INACTIVE: { text: <Badge status="error" text="Không hoạt động" /> },
            }}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormSla;
