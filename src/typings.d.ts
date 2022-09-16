declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;
declare const IBM_CLIENT_SECRET: string;
declare const TICKETING_BASE_URL: string;
declare const TICKETING_CORE_URL: string;
declare const TICKETING_GRAPHQL: string;
declare const TICKETING_FILE_STORE: string;
declare const IBM_CLIENT_ID: string;
declare const API_KEY: string;
// declare const HEADER_RAW_REQ_SB: object;
declare const EDITOR_CONFIGURATION: object;
declare module '@ckeditor/ckeditor5-react' {
  import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
  import Event from '@ckeditor/ckeditor5-utils/src/eventinfo';
  import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig';
  import * as React from 'react';
  const CKEditor: React.FunctionComponent<{
    disabled?: boolean;
    editor: typeof DecoupledEditor;
    data?: string;
    id?: string;
    config?: EditorConfig;
    onReady?: (editor: DecoupledEditor) => void;
    onChange?: (event: Event, editor: DecoupledEditor) => void;
    onBlur?: (event: Event, editor: DecoupledEditor) => void;
    onFocus?: (event: Event, editor: DecoupledEditor) => void;
    onError?: (event: Event, editor: DecoupledEditor) => void;
  }>;
  const CKEditorContext: any;
  export { CKEditor, CKEditorContext };
}
