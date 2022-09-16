import api from '@/services/api';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ControlOutlined,
  EditOutlined,
  RightCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Drawer,
  notification,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import DetailGroup from './DetailGroup';
import ModalFormGroup from './ModalFormGroup';
import ModalFormPermission from './ModalFormPermission';
// import ModalFormGroup from "./ModalFormGroup";
// import ModalQuickPermission from "./ModalQuickPermission";
// import ModalTransferTypeBusiness from "./ModalTransferTypeBussiness";

type DrawerDetailGroupProps = {
  visible: boolean;
  groupId: string;
  isDraft?: boolean;
  id?: string;
  width?: string | number;
  onClose?: () => void;
  onSuccess?: () => void;
};
const DrawerDetailGroup: React.FC<DrawerDetailGroupProps> = (props) => {
  const { visible, onClose, groupId, isDraft, width = '95%', onSuccess, id = '' } = props;
  const [groupInfo, setGroupInfo] = useState<any>(undefined);
  const [loadingGroup, setLoadingGroup] = useState<boolean>(false);
  const [loadingPermission, setLoadingPermission] = useState<boolean>(true);
  const [permission, setPermission] = useState<any>();
  const [modalFormGroupVisible, setModalFormGroupVisible] = useState<boolean>(false);
  const [modalFormPersVisible, setModalFormPersVisible] = useState<boolean>(false);
  //setModalFormPersVisible

  const getGroupInfo = async () => {
    setLoadingGroup(true);
    const res = await api.group.getCoreGroupById(groupId);
    setLoadingGroup(false);
    if (res.body?.status === 'OK') {
      setGroupInfo(res.body.dataRes);
    } else {
      setGroupInfo(null);
    }
  };

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
    getGroupInfo();
    getPermission();
  }, [groupId]);

  return (
    <>
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
        }}
        title={`Chi tiết nhóm: ${groupInfo?.grpName}`}
        extra={
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setModalFormPersVisible(true);
              }}
              icon={<ControlOutlined />}
              key="cancel"
            >
              Cấu hình phân quyền
            </Button>
            <Button
              icon={<EditOutlined />}
              danger
              onClick={() => {
                setModalFormGroupVisible(true);
              }}
              type="primary"
            >
              Cập nhật thông tin
            </Button>
          </Space>
        }
      >
        <DetailGroup loading={loadingGroup} groupInfo={groupInfo} groupId={groupId} />
        <Divider />
        <ProCard
          title={
            <>
              <ControlOutlined /> Phân quyền
            </>
          }
          loading={loadingPermission}
          size="small"
          bordered
          headerBordered
          className="card-fill-header"
        >
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
                        <Col sm={24} md={6} lg={4} key={index}>
                          <Tag
                            icon={
                              data.status === 'ACTIVE' ? (
                                <CheckCircleOutlined />
                              ) : (
                                <CloseCircleOutlined />
                              )
                            }
                            color={data.status === 'ACTIVE' ? 'processing' : 'error'}
                          >
                            {data?.actionName}
                          </Tag>
                          {/* <Checkbox checked={true} value={data?.actionCode}>
                          {data?.actionName}
                        </Checkbox> */}
                        </Col>
                      ))}
                  </Row>
                  //   </Checkbox.Group>
                ),
              };
            })}
          />
        </ProCard>
      </Drawer>

      <ModalFormGroup
        visible={modalFormGroupVisible}
        initiateData={groupInfo}
        onVisibleChange={(visible) => {
          setModalFormGroupVisible(visible);
        }}
        onSuccess={() => {
          setModalFormGroupVisible(false);
          onSuccess?.();
          getGroupInfo();
        }}
      />

      <ModalFormPermission
        visible={modalFormPersVisible}
        initiateInfo={groupInfo}
        groupId={groupId}
        onVisibleChange={(visible) => {
          setModalFormPersVisible(visible);
        }}
        onSuccess={() => {
          setModalFormPersVisible(false);
          //   onSuccess?.();
          //   getGroupInfo();
        }}
      />
    </>
  );
};

export default DrawerDetailGroup;
