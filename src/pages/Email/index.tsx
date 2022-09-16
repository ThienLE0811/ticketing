import api from '@/services/api';
import { DeleteOutlined, EditOutlined, MailFilled } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProList,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Avatar, Button, message, Modal, Popconfirm, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import ModalFormEmailTemplate from './components/ModalFormEmailTemplate';
import DOMPurify from 'dompurify';

const EmailTemplateList: React.FC = () => {
  const [modalFormEmailTmpVisible, setModalFormEmailTmpVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.RuleListItem & any>[] = [
    {
      title: 'Mã',
      dataIndex: 'code',
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
      title: 'Mô tả',
      dataIndex: 'description',
      hideInSearch: true,
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
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
  ];

  const handleDeleteEmail = async (code: string): Promise<any> => {
    const res = await api.email.deleteEmailTemplate(code);
    if (res.body?.status === 'OK') {
      message.success('Xoá thành công!');
      actionRef.current?.reload();
    }
  };

  return (
    <PageContainer ghost title={false}>
      <ProList<{ title: string; status: number }>
        toolBarRender={() => {
          return [
            <Button key="3" type="primary" onClick={() => setModalFormEmailTmpVisible(true)}>
              Tạo mới
            </Button>,
          ];
        }}
        actionRef={actionRef}
        onItem={(record) => {
          return {
            onClick: () => {
              setCurrentRow(record);
              setShowDetail(true);
            },
          };
        }}
        rowKey="code"
        request={(params, sort, filters) =>
          api.email.getListEmailTemplate({
            params,
            sort,
            filters,
          })
        }
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        headerTitle="Email template"
        metas={{
          title: {
            render: (dom, entity) => {
              return (
                <div>
                  {entity?.description} <Tag color="processing">{entity?.code}</Tag>
                </div>
              );
            },
          },
          description: {
            search: false,
            render: (dom, entity) => (
              <>
                <Tag color={entity.status === 'ACTIVE' ? 'success' : 'error'}>{entity?.status}</Tag>
              </>
            ),
          },

          actions: {
            render: (dom, entity) => {
              return [
                <Button
                  key="1"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setCurrentRow(entity);
                    setModalFormEmailTmpVisible(true);
                  }}
                />,
                <Popconfirm
                  title="Bạn chắc chắn muốn xoá email này?"
                  onConfirm={async () => {
                    return handleDeleteEmail(entity.code);
                  }}
                >
                  <Button key="3" icon={<DeleteOutlined />} danger />,
                </Popconfirm>,
              ];
            },
          },
          avatar: {
            render: () => <Avatar style={{ backgroundColor: '#87d068' }} icon={<MailFilled />} />,
            search: false,
          },
        }}
      />

      <ModalFormEmailTemplate
        visible={modalFormEmailTmpVisible}
        initiateData={currentRow}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
        onVisibleChange={(visible) => {
          if (!visible && !showDetail) setCurrentRow(undefined);
          setModalFormEmailTmpVisible(visible);
        }}
      />
      <Modal
        open={showDetail}
        width="70%"
        onCancel={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      >
        <ProDescriptions<API.RuleListItem & any>
          column={2}
          dataSource={currentRow}
          params={{
            id: currentRow?.code,
          }}
          columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
        />

        <Typography.Title level={5}>{`Tiêu đề: ${currentRow?.title}`}</Typography.Title>
        <Typography.Paragraph>
          <div
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentRow?.content || '') }}
          />
        </Typography.Paragraph>
      </Modal>
    </PageContainer>
  );
};

export default EmailTemplateList;
