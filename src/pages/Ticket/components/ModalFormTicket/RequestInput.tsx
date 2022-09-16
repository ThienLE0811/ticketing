import Editor from '@/components/Editor';
import { filterOptionWithVietnamese, getMasterDataByTypeUtil } from '@/utils';
import {
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import './styles.less';

type RequestInputProps = {
  formRef?: ProFormInstance;
};

const RequestInput: React.FC<RequestInputProps> = (props) => {
  const { formRef } = props;
  let editorInstance: any;

  return (
    //@ts-ignore
    <ProCard
      size="small"
      bordered
      headerBordered
      title={
        <>
          <FontAwesomeIcon icon={faQuestionCircle} /> Thông tin yêu cầu
        </>
      }
      className="card-fill-header"
    >
      <Row gutter={16}>
        <Col span={24} xxl={4}>
          <ProFormSelect
            label="Nội dung gợi ý"
            name="contentSuggest"
            showSearch
            request={async () => {
              return Promise.resolve(getMasterDataByTypeUtil('ContentSuggest', true, true));
            }}
            fieldProps={{
              onChange(value) {
                formRef?.setFields?.([
                  { name: 'contentRequest', value },
                  { name: 'ticketTitle', value },
                ]);
                editorInstance?.data?.set?.(value);
              },
              filterOption: filterOptionWithVietnamese,
            }}
          />
        </Col>
        <Col span={8} xxl={4}>
          <ProFormSelect
            label="Nhóm nghiệp vụ"
            required
            name="typeBusiness"
            allowClear={false}
            showSearch
            rules={[{ required: true, message: 'Nhóm nghiệp vụ không được bỏ trống' }]}
            request={async () => getMasterDataByTypeUtil('TypeBusiness', true, true)}
            fieldProps={{
              filterOption: filterOptionWithVietnamese,
            }}
          />
        </Col>
        <Col span={16} xxl={16}>
          <ProFormText
            label="Tiêu đề"
            name="ticketTitle"
            required
            rules={[{ required: true, message: 'Tiêu đề không được bỏ trống' }]}
          />
        </Col>

        <Col span={24}>
          <ProForm.Item
            name="contentRequest"
            label="Nội dung"
            required
            rules={[{ required: true, message: 'Nội dung không được bỏ trống' }]}
          >
            <div style={{ border: '1px solid #c4c4c4', borderRadius: 3, padding: 5 }}>
              <Editor
                onChange={(event, editor) => {
                  formRef?.setFieldsValue?.({ contentRequest: editor.getData() });
                }}
                initiateData={formRef?.getFieldValue?.(['contentRequest'])}
                onReady={(editor) => {
                  editorInstance = editor;
                }}
              />
            </div>
          </ProForm.Item>
        </Col>
      </Row>
    </ProCard>
  );
};

export default RequestInput;
