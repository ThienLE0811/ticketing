import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const ForbiddenPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Xin lỗi, bạn không có quyền truy cập trang này"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Về lại trang chủ
      </Button>
    }
  />
);

export default ForbiddenPage;
