import api from '@/services/api';
import {
  ModalForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

import { Col, notification, Row } from 'antd';
import React, { useRef } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type ModalFormMdmProps = {
  open: boolean;
  initiateData?: any;
  onSuccess?: (data: any) => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

const ModalFormMdm: React.FC<ModalFormMdmProps> = (props) => {
  const { open, onVisibleChange, initiateData, onSuccess, onFailure } = props;
  console.log(initiateData);

  const restFormRef = useRef<ProFormInstance>();

  const handleSubmit = async (formValues: any) => {
    const { name, type, code, defaultValue, description } = formValues;
    if (Array.isArray(type)) {
    }
    try {
      const res = !initiateData?.masterId
        ? await api.mdm.createMasterData({
            name,
            code,
            defaultValue,
            description,
            type: Array.isArray(type) ? type?.[0] : type,
          })
        : await api.mdm.updateMasterData({
            name,
            code,
            defaultValue,
            description,
            masterId: initiateData.masterId,
            type: Array.isArray(type) ? type?.[0] : type,
          });
      if (res.body?.status === 'OK') {
        onVisibleChange(false);
        onSuccess?.(res.body?.dataRes);
        notification.success({
          message: initiateData?.masterId ? 'Cập nhật MDM thành công' : 'Tạo mới MDM thành công',
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
      open={open}
      initialValues={initiateData}
      modalProps={{
        destroyOnClose: true,
        okText: 'Xác nhận',
      }}
      formRef={restFormRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={initiateData?.id ? 'Cập nhật MDM' : 'Tạo mới MDM'}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormSelect
            mode="tags"
            label="Type"
            tooltip="Hệ thống tự động thêm Type mới nếu không có sẵn"
            name="type"
            fieldProps={{
              onChange(value, option) {
                if (value?.length > 1) {
                  value.pop();
                }
              },
            }}
            request={async () => {
              return api.mdm.getMasterDataType().then((data) =>
                ((data.body?.dataRes as Array<string>) || []).map((value) => ({
                  label: value,
                  value,
                })),
              );
            }}
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="Code"
            name="code"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="Name"
            name="name"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText label="Default Value" required name="defaultValue" allowClear={false} />
        </Col>
        <Col span={24}>
          <ProFormTextArea label="Description" required name="description" allowClear={false} />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormMdm;
