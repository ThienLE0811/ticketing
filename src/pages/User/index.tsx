import api from '@/services/api';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Badge, Button, Drawer, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import ModalFormUser from './components/ModalFormUser';

const UserTableList: React.FC = () => {
  const [modalFormUserVisible, setModalFormUserVisible] = useState<boolean>(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<API.CreateUserReqParams & any>();
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const fetchUserInfo = async (userId: string) => {
    setLoadingUserInfo(true);
    const res = await api.user.getUserById(userId);
    setLoadingUserInfo(false);
    if (res.body?.status === 'OK') {
      setUserInfo(res.body?.dataRes);
    }
  };

  const columns: ProColumns<API.RuleListItem & any>[] = [
    // {
    //   title: 'Ảnh',
    //   dataIndex: 'usrPhotoPath',
    //   valueType: 'avatar',
    //   initialValue: 'A',
    //   hideInSearch: true,
    //   width: 45,
    // },
    {
      title: 'Tài khoản',
      dataIndex: 'usrUsername',
      width: 90,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
              fetchUserInfo(entity?.usrUid);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'usrStatus',
      valueType: 'select',
      initialValue: 'ACTIVE',
      valueEnum: {
        ACTIVE: { text: <Badge status="success" text="Hoạt động" /> },
        INACTIVE: { text: <Badge status="error" text="Không hoạt động" /> },
      },
    },
    {
      title: 'Email',
      dataIndex: 'usrEmail',
    },
    {
      title: 'Vị trí',
      dataIndex: 'usrPosition',
      ellipsis: true,
      hideInDescriptions: true,
      render: (text, record) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word', maxWidth: 500 }}>{text}</div>
      ),
    },
    {
      title: 'Họ tên',
      dataIndex: 'usrFirstName',
      renderText: (text, record) => `${record?.usrLastName} ${record?.usrFirstName}`,
    },
    {
      title: 'Role',
      dataIndex: 'usrRole',
      width: 45,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'usrPhone',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'usrCreateDate',
      valueType: 'date',
      fieldProps: {
        format: 'DD/MM/YYYY',
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'usrUpdateDate',
      hideInTable: true,
    },
    {
      title: 'Hành động',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (_, record) => [
        <Button
          key={'1'}
          icon={<EditOutlined />}
          onClick={() => {
            !currentRow?.usrUid && setCurrentRow(record);
            setModalFormUserVisible(true);
          }}
        />,
        <Popconfirm title="Bạn có chắc chắn muốn xoá không?">
          <Button danger key={'2'} icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.RuleListItem, API.PageParams>
        actionRef={actionRef}
        formRef={formRef}
        rowKey="usrUid"
        headerTitle="Danh sách người dùng"
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 315px)' }}
        options={{
          search: {
            placeholder: 'Nhập từ khoá để tìm kiếm...',
            style: { width: 300 },
          },
        }}
        // cardProps={{
        //   bodyStyle: {
        //     padding: 8,
        //   },
        // }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            danger
            onClick={() => {
              setModalFormUserVisible(true);
            }}
          >
            <PlusOutlined /> Tạo người dùng
          </Button>,
        ]}
        request={(params, sort, filters) => api.user.getListUser({ params, sort, filters })}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalFormUser
        visible={modalFormUserVisible}
        initiateData={currentRow}
        onVisibleChange={(visible) => {
          if (!visible && !showDetail) setCurrentRow(undefined);
          setModalFormUserVisible(visible);
        }}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setUserInfo(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.usrUid && (
          <ProDescriptions<API.RuleListItem & any>
            column={2}
            loading={loadingUserInfo}
            title={`${currentRow?.usrLastName} ${currentRow?.usrFirstName}`}
            dataSource={currentRow}
            // request={async () => ({
            //   data: userInfo || {},
            // })}
            params={{
              id: currentRow?.usrUid,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserTableList;
