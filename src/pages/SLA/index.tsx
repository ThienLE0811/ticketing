import api from '@/services/api';
import { EditOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { ActionType, ProList } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import NameMasterData from '@/hooks/NameMasterData';
import ModalFormSla from './components/ModalFormSla';

const SlaList: React.FC = () => {
  const [modalFormSlaVisible, setModalFormSla] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();
  const actionRef = useRef<ActionType>();

  return (
    <PageContainer ghost title={false}>
      <ProList<{ title: string; status: number }>
        toolBarRender={() => {
          return [
            <Button key="3" type="primary" onClick={() => setModalFormSla(true)}>
              Tạo mới
            </Button>,
          ];
        }}
        actionRef={actionRef}
        rowKey="code"
        request={(params, sort, filters) =>
          api.sla.getListSla({
            params,
            sort,
            filters,
          })
        }
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        headerTitle="Cấu hình SLA"
        metas={{
          title: {
            render: (dom, entity) => {
              return <NameMasterData type="TypeBusiness" value={entity?.typeBusiness} />;
            },
          },
          description: {
            search: false,
            render: (dom, entity) => <Tag color="processing">{entity?.code}</Tag>,
          },
          content: {
            render: (dom, entity) => (
              <div>
                <div>
                  Thời gian đóng: <strong>{entity?.timeCloseSla} giờ</strong>
                </div>
                <div>
                  Thời gian xử lý: <strong>{entity?.timeSla} giờ</strong>
                </div>
                <Tag color={entity.status === 'ACTIVE' ? 'success' : 'error'}>{entity?.status}</Tag>
              </div>
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
                    setModalFormSla(true);
                  }}
                />,
              ];
            },
          },
          avatar: {
            render: () => (
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<FieldTimeOutlined />} />
            ),
            search: false,
          },
        }}
      />

      <ModalFormSla
        visible={modalFormSlaVisible}
        initiateData={currentRow}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
        onVisibleChange={(visible) => {
          if (!visible && !modalFormSlaVisible) setCurrentRow(undefined);
          setModalFormSla(visible);
        }}
      />
    </PageContainer>
  );
};

export default SlaList;
