import Editor from '@/components/Editor';
import api from '@/services/api';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormGroup,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

import { Badge, Button, Col, Input, message, notification, Row, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type ModalFormUserProps = {
  visible: boolean;
  initiateData?: any;
  onSuccess?: (data: any) => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

const ModalFormUser: React.FC<ModalFormUserProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } = props;
  const [loadLdap, setLoadLdap] = useState<boolean>(false);
  // const [usrUserName, setUsrUserName] = useState<string>(initiateData?.usrUsername)
  const restFormRef = useRef<ProFormInstance>();

  const handleSubmit = async (formValues: any) => {
    console.log(formValues);

    try {
      const res = !initiateData?.usrUid
        ? await api.user.createUser(formValues)
        : await api.user.updateUser({
            ...formValues,
            usrUid: restFormRef.current?.getFieldValue(['usrUsername']),
          });
      if (res.body?.status === 'OK') {
        onVisibleChange(false);
        onSuccess?.(res.body?.dataRes);
        notification.success({
          message: initiateData?.usrUid
            ? 'Cập nhật Người dùng thành công'
            : 'Tạo mới Người dùng thành công',
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

  const handleLoadLdap = async () => {
    if (!restFormRef.current?.getFieldValue(['usrUsername']))
      return message.error('Vui lòng nhập tài khoản trước!');
    setLoadLdap(true);
    const res = await api.user.fetchUserLdap(restFormRef.current?.getFieldValue(['usrUsername']));
    setLoadLdap(false);
    if (res.body?.status === 'OK' && res.body.dataRes?.user_name) {
      message.success('Truy vấn dữ liệu thành công!');
      const {
        email = '',
        first_name = '',
        full_name = '',
        ipPhone = '',
        last_name = '',
        telephoneNumber = '',
        unit = '',
        user_dn = '',
      } = res.body.dataRes;
      restFormRef.current?.setFieldsValue({
        usrEmail: email,
        usrFirstName: first_name,
        usrLastName: last_name,
        usrPhone: telephoneNumber,
      });
    } else {
      message.warning('Không có dữ liệu!');
    }
  };

  return (
    <ModalForm
      open={visible}
      initialValues={initiateData || { usrStatus: 'ACTIVE' }}
      // request={() => initiateData || { status: 'Y' }}
      modalProps={{
        destroyOnClose: true,
        okText: 'Xác nhận',
      }}
      formRef={restFormRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={initiateData?.usrUid ? 'Cập nhật người dùng' : 'Tạo mới người dùng'}
    >
      <Row gutter={16}>
        <Col span={8}>
          <ProForm.Item label="Tài khoản" required name="usrUsername">
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 80px)' }}
                allowClear
                name="usrUsername"
                onKeyDown={(e) => {
                  e.key === 'Enter' && handleLoadLdap();
                }}
                onChange={(e) =>
                  restFormRef.current?.setFieldsValue({ usrUsername: e.target.value })
                }
                defaultValue={initiateData?.usrUsername}
                required
              />
              <Tooltip title="Lấy dữ liệu LDAP">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  loading={loadLdap}
                  onClick={handleLoadLdap}
                >
                  Tìm
                </Button>
              </Tooltip>
            </Input.Group>
          </ProForm.Item>
        </Col>
        <Col span={8}>
          <ProFormText
            label="Email"
            name="usrEmail"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="Trạng thái"
            required
            name="usrStatus"
            allowClear={false}
            valueEnum={{
              ACTIVE: { text: <Badge status="success" text="Hoạt động" /> },
              INACTIVE: { text: <Badge status="error" text="Không hoạt động" /> },
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="Họ"
            name="usrFirstName"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="Tên"
            name="usrLastName"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="Số điện thoại"
            name="usrPhone"
            required
            // rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="Vai trò"
            name="usrRole"
            required
            request={async () => (await api.group.getListGroup()).data}
            // rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormUser;
