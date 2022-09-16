import Footer from '@/components/Footer';
import Cookies from 'js-cookie';
// import { login } from '@/services/api';
import api from '@/services/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Alert, Button, message, Tabs } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<any>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginReqParams) => {
    // return;
    try {
      const msg = await api.auth.login({ ...values });
      if (msg?.body?.status === 'OK') {
        message.success('Đăng nhập thành công');
        const { expiresIn, accessToken, usrUid, refreshToken } = msg?.body?.dataRes;
        Cookies.set('access_token', accessToken, { expires: expiresIn, secure: true });
        if (values.autoLogin) {
          Cookies.set('refresh_token', refreshToken, { expires: expiresIn, secure: true });
        }
        Cookies.set('my_user_id', usrUid, { expires: expiresIn, secure: true });
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      setUserLoginState({ status: msg?.body?.status, type: 'account' });
    } catch (error) {
      message.error('Đăng nhập thất bại!');
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang} />
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo-sb" src="/images/logo-seabank.png" />}
          subTitle="Hệ thống Ticketing Thanh toán trong nước"
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig: { submitText: 'Đăng nhập' },
          }}
          actions={[]}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginReqParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                label: 'Đăng nhập tài khoản',
                tabKey: 'account',
                key: 'account',
                children: (
                  <>
                    <ProFormText
                      name="username"
                      fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={styles.prefixIcon} />,
                      }}
                      placeholder="Tài khoản:"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập tài khoản.',
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={styles.prefixIcon} />,
                      }}
                      placeholder="Mật khẩu:"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập mật khẩu',
                        },
                      ]}
                    />
                  </>
                ),
              },
            ]}
          ></Tabs>

          {status === 'FAILE' && loginType === 'account' && (
            <LoginMessage content="Thông tin đăng nhập không chính xác" />
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              Ghi nhớ
            </ProFormCheckbox>
            {/* <a
              style={{
                float: 'right',
              }}
            >
             Quên mật khẩu
            </a> */}
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
