import api from '@/services/api';
import {
  ControlOutlined,
  DeleteFilled,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TableOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProList,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Checkbox, Drawer, message, Popconfirm, Result } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ModalFormMdm from './components/ModalFormMdm';

const MdmTableList: React.FC = () => {
  const [typeSelected, setTypeSelected] = useState<string>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const actionProListRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [modalFormMdmOpen, setModalFormMdmOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!typeSelected) return;
    actionRef.current?.reload();
  }, [typeSelected]);

  const handleDelete = async (id: number) => {
    const res = await api.mdm.delMasterData(id);
    if (res.body?.status === 'OK') {
      message.success('Đã xoá thành công!');
      actionRef.current?.reload();
    }
    return Promise.resolve();
  };

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'masterId',
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
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Default Value',
      dataIndex: 'defaultValue',
    },
    {
      title: 'Hành động',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <Button
          onClick={() => {
            setCurrentRow(entity);
            setModalFormMdmOpen(true);
          }}
          icon={<EditOutlined />}
        ></Button>,
        <Popconfirm
          title="Bạn chắc chắn muốn xoá?"
          onConfirm={async () => handleDelete(entity.masterId)}
        >
          <Button danger icon={<DeleteOutlined />}></Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer pageHeaderRender={false}>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'Dữ liệu'}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        pagination={false}
        tableRender={(_, dom) => {
          return (
            <div
              style={{
                display: 'flex',
                width: '100%',
              }}
            >
              <ProList
                actionRef={actionProListRef}
                rowKey="title"
                style={{ width: 250, marginRight: 10 }}
                onRow={(record: any) => {
                  return {
                    onClick: () => {
                      setTypeSelected(record.title);
                    },
                  };
                }}
                request={async () => {
                  const data = await api.mdm.getMasterDataType();
                  return {
                    data: ((data.body?.dataRes as Array<string>) || []).map((value) => ({
                      title: value,
                    })),
                    success: data.body?.status === 'OK',
                  };
                }}
                metas={{
                  title: {
                    render: (dom, entity) => {
                      return (
                        <div>
                          <Checkbox
                            checked={entity.title === typeSelected}
                            style={{ marginRight: 4 }}
                          />
                          <TableOutlined /> {entity.title}
                        </div>
                      );
                    },
                  },
                }}
              />
              {!typeSelected ? (
                <Result
                  title="Chọn bảng để xem"
                  subTitle="Vui lòng chọn bảng bên trái để xem dữ liệu"
                  extra={
                    <Button
                      type="primary"
                      key="primary"
                      size="large"
                      onClick={() => {
                        setModalFormMdmOpen(true);
                      }}
                    >
                      <PlusOutlined /> Tạo mới
                    </Button>
                  }
                  style={{
                    flex: 1,
                    background: '#fff',
                  }}
                />
              ) : (
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  {dom}
                </div>
              )}
            </div>
          );
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalFormMdmOpen(true);
            }}
          >
            <PlusOutlined /> Tạo mới
          </Button>,
        ]}
        request={async () => {
          if (!typeSelected) return {};
          const data = await api.mdm.getMasterDataByType(typeSelected);
          return { data: data.body?.dataRes?.[typeSelected] };
        }}
        columns={columns}
      />
      <ModalFormMdm
        open={modalFormMdmOpen}
        initiateData={currentRow}
        onSuccess={() => {
          actionRef.current?.reload();
          actionProListRef.current?.reload();
        }}
        onVisibleChange={(visible) => {
          setModalFormMdmOpen(visible);
          !visible && setCurrentRow(undefined);
        }}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default MdmTableList;
