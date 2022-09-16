import { PageContainer } from '@ant-design/pro-components';
import { Divider, Tag, Typography } from 'antd';
import moment from 'moment';

type PostsDetailProps = {
  title: string;
  body?: string;
  date?: string;
};

const PostsDetail: React.FC<PostsDetailProps> = (props) => {
  return (
    <PageContainer pageHeaderRender={false}>
      <Typography.Title level={5}>{props.title}</Typography.Title>
      <Tag color="blue">{moment(props?.date).format('DD/MM/YYYY')}</Tag>
      <Divider />
      <div dangerouslySetInnerHTML={{ __html: props?.body || '' }}></div>
    </PageContainer>
  );
};

export default PostsDetail;
