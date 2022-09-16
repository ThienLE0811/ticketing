import RightContent from '@/components/RightContent';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import Cookies from 'js-cookie';
import defaultSettings from '../config/defaultSettings';
import ForbiddenPage from './pages/403';
import { errorConfig } from './requestErrorConfig';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import api from './services/api';
import clientGraphQL from './services/graphql';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/auth/login';

/**
 * @see  https://umijs.org/en-US/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.AccountInfo & any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.AccountInfo | undefined>;
}> {
  const fetchUserInfo = async () => {
    if (!Cookies.get('access_token') || !Cookies.get('refresh_token')) return undefined;
    const myUserId = Cookies.get('my_user_id') || '';
    const res = await api.auth.accountInfo(myUserId);
    if (res.body?.responseCode === '00') {
      return res.body?.dataRes;
    } else {
      history.push(loginPath);
      return undefined;
    }
  };

  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser?.usrUid && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: [
      <Link key="openapi" to="#">
        <LinkOutlined />
        <span>Phiên bản 0.0.1-dev</span>
      </Link>,
    ],
    menuHeaderRender: undefined,
    unAccessible: <ForbiddenPage />,
    childrenRender: (children, props) => {
      if (initialState?.loading) return <PageLoading spinning />;
      return (
        <>
          <ApolloProvider client={clientGraphQL} >
            <ConfigProvider locale={viVN}>{children}</ConfigProvider>
          </ApolloProvider>
          {/* {!props.location?.pathname?.includes('/login') && ( */}
          {/* <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          /> */}
          {/* // )} */}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request
 *  axios - ahooks - useRequest Cung cấp một yêu cầu mạng thống nhất và sơ đồ xử lý lỗi.
 * @doc https://umijs.org/docs/max/request
 */
export const request = {
  ...errorConfig,
};
