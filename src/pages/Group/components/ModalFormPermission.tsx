import api from '@/services/api';
import { ModalForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';

import { Badge, Checkbox, Col, notification, Row, Spin, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type ModalFormPermissionProps = {
  visible: boolean;
  initiateInfo?: any;
  initiatePers?: any;
  groupId: string;
  onSuccess?: (data: any) => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

const ModalFormPermission: React.FC<ModalFormPermissionProps> = (props) => {
  const { visible, onVisibleChange, initiateInfo, initiatePers, onSuccess, onFailure, groupId } =
    props;

  const restFormRef = useRef<ProFormInstance>();
  const [loadingPermission, setLoadingPermission] = useState<boolean>(true);
  const [permission, setPermission] = useState<any>();
  //   const handleSubmit = async (formValues: any) => {
  //     try {
  //       const res = await api.group.updateCoreGroup({ ...formValues, grpUid: initiateData?.grpUid });
  //       if (res.body?.status === 'OK') {
  //         onVisibleChange(false);
  //         onSuccess?.(res.body?.dataRes);
  //         notification.success({
  //           message: initiateData?.grpUid ? 'Cập nhật Nhóm thành công' : 'Tạo mới Nhóm thành công',
  //         });
  //         return Promise.resolve();
  //       } else {
  //         onFailure?.(res.body);
  //         return Promise.reject();
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const getPermission = async () => {
    setLoadingPermission(true);
    const res = await api.group.getCoreGroupPermissionById(groupId);
    setLoadingPermission(false);
    if (res.body?.status === 'OK') {
      setPermission(res.body.dataRes);
    } else {
      setPermission([]);
    }
  };

  useEffect(() => {
    if (!groupId) return;
    // getGroupInfo();
    getPermission();
  }, [groupId]);

  return (
    <ModalForm
      visible={visible}
      //   initialValues={initiateData || { grpStatus: 'Y' }}
      // request={() => initiateData || { status: 'Y' }}
      modalProps={{
        // destroyOnClose: true,
        okText: 'Xác nhận',
        centered: true,
        zIndex: 9999,
      }}
      formRef={restFormRef}
      //   onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={`Phân quyền: ${initiateInfo?.grpName}`}
    >
      {loadingPermission && (
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải..." />
        </div>
      )}
      {!loadingPermission && (
        <>
          {/* <ProFormSelect request={} /> */}
          <Tabs
            tabPosition="left"
            type="card"
            items={(permission?.coreFunctions || []).map((_: any, i: number) => {
              const id = String(i + 1);
              return {
                label: _?.perName,
                key: id,
                children: (
                  //   <Checkbox.Group style={{ width: '100%' }}>
                  <Row gutter={[16, 16]}>
                    {((permission?.coreActions as Array<any>) || [])
                      .filter((value) => value.perUid === _.perUid)
                      .map((data, index) => (
                        <Col sm={24} md={8} lg={8} key={index}>
                          <Checkbox
                            defaultChecked={data.status === 'ACTIVE'}
                            value={data?.actionCode}
                          >
                            {data?.actionName}
                          </Checkbox>
                        </Col>
                      ))}
                  </Row>
                  //   </Checkbox.Group>
                ),
              };
            })}
          />
        </>
      )}
    </ModalForm>
  );
};

export default ModalFormPermission;
