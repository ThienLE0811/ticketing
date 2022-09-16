// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  /**
   * @doc https://umijs.org/docs/api/config#hash
   */
  hash: true,

  /**
   * @doc https://umijs.org/docs/api/config#targets
   */
  // targets: {
  //   ie: 11,
  // },
  /**
   * @doc https://umijs.org/docs/guides/routes
   */
  // umi routes: https://umijs.org/docs/routing
  routes,
  /**
   * @doc https://ant.design/docs/react/customize-theme-cn
   * @doc umi https://umijs.org/docs/api/config#theme
   */
  theme: {
    'root-entry-name': 'variable',
    '@border-radius-base': '8px',
    '@padding-md': '8px',
    '@padding-lg': '12px', // containers
    '@padding-sm': '6px', // Form controls and items
    '@padding-xs': '4px', // small items
    '@padding-xss': '2px',
    '@margin-md': '8px',
    '@margin-lg': '12px', // containers
    '@margin-sm': '6px', // Form controls and items
    '@margin-xs': '4px', // small items
    '@margin-xss': '2px',
    // '@height-base': '32px',
    // '@height-lg': '20px',
    // '@height-sm': '12px',
    '@card-padding-base': '12px',
    '@form-item-margin-bottom': '12px',
    '@table-padding-vertical': '8px',
    '@table-padding-horizontal': '8px',
  },
  /**
   * @doc https://umijs.org/docs/api/config#ignoremomentlocale
   */
  ignoreMomentLocale: true,
  /**
   * @doc https://umijs.org/docs/guides/proxy
   * @doc https://umijs.org/docs/api/config#proxy
   */
  proxy: proxy[REACT_APP_ENV || 'dev'],
  /**
   */
  fastRefresh: true,
  /**
   * @@doc https://umijs.org/docs/max/data-flow
   */
  model: {},
  /**
   * @doc https://umijs.org/docs/max/data-flow#%E5%85%A8%E5%B1%80%E5%88%9D%E5%A7%8B%E7%8A%B6%E6%80%81
   */
  initialState: {},
  /**
   * @doc https://umijs.org/docs/max/layout-menu
   */
  layout: {
    locale: false,
    siderWidth: 208,
    ...defaultSettings,
  },
  /**
   * @doc https://umijs.org/docs/max/i18n
   */
  locale: {
    default: 'vi-VN',
    antd: false,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  /**
   * @doc https://umijs.org/docs/max/antd#antd
   */
  antd: {},
  /**
   * @doc https://umijs.org/docs/max/request
   */
  request: {},
  /**
   * @doc https://umijs.org/docs/max/access
   */
  access: {},
  presets: ['umi-presets-pro'],
  openAPI: [],
  define: {
    TICKETING_BASE_URL: process.env.TICKETING_BASE_URL || '/',
    TICKETING_CORE_URL: process.env.TICKETING_CORE_URL || '/',
    TICKETING_GRAPHQL: process.env.TICKETING_GRAPHQL || '/',
    TICKETING_FILE_STORE: process.env.TICKETING_FILE_STORE || '/',
    IBM_CLIENT_ID: process.env.IBM_CLIENT_ID,
    IBM_CLIENT_SECRET: process.env.IBM_CLIENT_SECRET,
    API_KEY: process.env.API_KEY || '',
  },
});
