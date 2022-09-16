import api from '@/services/api';
import { AppstoreOutlined, BarsOutlined, BookOutlined } from '@ant-design/icons';
import { ActionType, ProFormInstance, ProList } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Divider, Input, Modal, Radio, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import ModalFormPosts from './components/ModalFormPosts';
import PostsDetail from './components/PostsDetail';
import './styles.less';
const { Search } = Input;

const KnowledgeBaseList: React.FC = () => {
  const [layout, setLayout] = useState<'list' | 'grid'>('list');
  const [currentRow, setCurrentRow] = useState<any>();
  const [showPosts, setShowPosts] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [modalFormPostsVisible, setModalFormPostsVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  return (
    <PageContainer pageHeaderRender={false}>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: 100 }}>
        <Typography.Title
          level={2}
          style={{
            textAlign: 'center',
          }}
        >
          Trung tâm kiến thức
        </Typography.Title>
        <Search
          style={{
            maxWidth: 400,
          }}
          allowClear
          onSearch={(e) => {
            setKeyword(e);
            actionRef.current?.reload();
          }}
          onChange={(e) => {}}
          placeholder="Tìm kiếm nội dung kiến thức..."
          size="large"
          enterButton
        />
      </div>
      <Divider dashed />
      <ProList<{ title: string; status: number }>
        toolBarRender={() => {
          return [
            <Typography.Text>Kiểu hiển thị: </Typography.Text>,
            <Radio.Group defaultValue="list" onChange={(e) => setLayout(e.target.value)}>
              <Radio.Button value="grid">
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value="list">
                <BarsOutlined />
              </Radio.Button>
            </Radio.Group>,
            <Button key="3" type="primary" onClick={() => setModalFormPostsVisible(true)}>
              Tạo
            </Button>,
          ];
        }}
        onItem={(record) => {
          return {
            onClick: () => {
              // console.log(record);
              setCurrentRow(record), setShowPosts(true);
            },
          };
        }}
        actionRef={actionRef}
        formRef={formRef}
        itemLayout="vertical"
        rowKey="docId"
        request={(params, sort, filters) =>
          api.knowledgeBase.getListKnowledgeBaseAdmin({
            params: { ...params, keyword },
            sort,
            filters,
          })
        }
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        grid={layout == 'grid' ? { gutter: 16, column: 3 } : undefined}
        headerTitle="Bài viết"
        metas={{
          title: {
            dataIndex: 'kbTitle',
            render: (dom, entity) => <div className="title">{entity.kbTitle}</div>,
          },
          avatar: {
            render: () =>
              layout == 'list' ? (
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<BookOutlined />} />
              ) : null,
          },
          description: {
            render: (dom, entity) => (
              <>
                <Tag color="blue">{moment(entity?.createdDate).format('DD/MM/YYYY')}</Tag>
              </>
            ),
          },
          actions: {
            render: () => [],
          },
          content: {
            render: (dom, entity) => {
              return (
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: entity?.kbBodyNoHtml }}
                ></div>
              );
            },
          },
        }}
      />
      <Modal width={'70%'} open={showPosts} onCancel={() => setShowPosts(false)} footer={false}>
        <PostsDetail
          title={currentRow?.kbTitle}
          body={currentRow?.kbBody}
          date={currentRow?.createdDate}
        />
      </Modal>
      <ModalFormPosts
        visible={modalFormPostsVisible}
        initiateData={currentRow}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
        onVisibleChange={(visible) => {
          if (!visible && !showPosts) setCurrentRow(undefined);
          setModalFormPostsVisible(visible);
        }}
      />
    </PageContainer>
  );
};

export default KnowledgeBaseList;
