import { getListGroup } from '@/services/api/group';
import { ControlOutlined, EditOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import DrawerDetailGroup from './components/DrawerDetailGroup';
import ModalFormGroup from './components/ModalFormGroup';
import ModalFormPermission from './components/ModalFormPermission';

const GroupTableList: React.FC = () => {
  const [modalFormPersVisible, setModalFormPersVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [modalFormGroupVisible, setModalFormGroupVisible] = useState<boolean>(false);

  const columns: ProColumns<API.RuleListItem & any>[] = [
    {
      title: 'Tên nhóm',
      dataIndex: 'grpName',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },

    {
      title: 'Code nhóm',
      dataIndex: 'grpCode',
    },

    {
      title: 'Tiêu đề nhóm',
      dataIndex: 'grpTitle',
      hideInSearch: true,
    },
    {
      title: 'ID',
      dataIndex: 'grpUid',
      width: 50,
      hideInSearch: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'grpStatus',
      valueType: 'select',
      valueEnum: {
        ACTIVE: {
          text: 'Hoạt động',
          status: 'Success',
        },
        INACTIVE: {
          text: 'Không hoạt động',
          status: 'Error',
        },
      },
    },
    {
      title: 'Số Người dùng',
      dataIndex: 'totalUser',
      hideInSearch: true,
    },
    {
      title: 'Hành động',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <Button
          onClick={() => {
            setCurrentRow(entity);
            setModalFormGroupVisible(true);
          }}
          icon={<EditOutlined />}
        ></Button>,
        <Button
          onClick={() => {
            setCurrentRow(entity);
            setModalFormPersVisible(true);
          }}
          icon={<ControlOutlined />}
        ></Button>,
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.RuleListItem, API.PageParams>
        actionRef={actionRef}
        formRef={formRef}
        rowKey="grpUid"
        size="large"
        headerTitle="Danh sách nhóm"
        search={{
          labelWidth: 120,
        }}
        options={{
          search: {
            placeholder: 'Nhập từ khoá để tìm kiếm...',
            style: { width: 300 },
          },
        }}
        cardProps={{
          bodyStyle: {
            paddingBottom: 0,
            paddingTop: 0,
          },
        }}
        request={(params, sort, filters) => getListGroup({ params, sort, filters })}
        columns={columns}
      />
      <DrawerDetailGroup
        width={'95%'}
        visible={showDetail}
        groupId={currentRow?.grpUid}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
      />
      <ModalFormGroup
        visible={modalFormGroupVisible}
        initiateData={currentRow}
        onVisibleChange={(visible) => {
          setModalFormGroupVisible(visible);
        }}
        onSuccess={() => {
          setModalFormGroupVisible(false);
          actionRef.current?.reload();
        }}
      />

      <ModalFormPermission
        visible={modalFormPersVisible}
        initiateInfo={currentRow}
        groupId={currentRow?.grpUid}
        onVisibleChange={(visible) => {
          setModalFormPersVisible(visible);
        }}
        onSuccess={() => {
          setModalFormPersVisible(false);
          //   onSuccess?.();
          //   getGroupInfo();
        }}
      />
    </PageContainer>
  );
};

export default GroupTableList;
