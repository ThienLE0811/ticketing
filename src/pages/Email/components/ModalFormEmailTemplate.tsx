import Editor from '@/components/Editor';
import api from '@/services/api';
import {
  ModalForm,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

import { Badge, Col, notification, Row } from 'antd';
import React, { useRef } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type ModalFormEmailTemplateProps = {
  visible: boolean;
  initiateData?: any;
  onSuccess?: (data: any) => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

const ModalFormEmailTemplate: React.FC<ModalFormEmailTemplateProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } = props;

  const restFormRef = useRef<ProFormInstance>();

  const handleSubmit = async (formValues: any) => {
    console.log(formValues);

    try {
      const res = initiateData?.code
        ? await api.email.updateEmailTemplate(formValues)
        : await api.email.createEmailTemplate(formValues);

      if (res.body?.status === 'OK') {
        onVisibleChange(false);
        onSuccess?.(res.body?.dataRes);
        notification.success({
          message: initiateData?.code
            ? 'Cập nhật Mẫu email thành công'
            : 'Tạo mới Mẫu email thành công',
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
      initialValues={initiateData || { status: 'ACTIVE' }}
      modalProps={{
        destroyOnClose: true,
        okText: 'Xác nhận',
      }}
      formRef={restFormRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={initiateData?.code ? 'Cập nhật mẫu email' : 'Tạo mới mẫu email'}
    >
      <Row gutter={16}>
        <Col span={18}>
          <ProFormText
            label="Mã Email"
            name="code"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={6}>
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
        <Col span={24}>
          <ProFormText
            label="Tiêu đề"
            name="title"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={24}>
          <ProFormTextArea
            label="Mô tả"
            name="description"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ProForm.Item name="content" label="Nội dung" required>
            <Editor
              onChange={(event, editor) => {
                restFormRef.current?.setFieldsValue({ content: editor.getData() });
              }}
              initiateData={initiateData?.content}
            />
          </ProForm.Item>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormEmailTemplate;
