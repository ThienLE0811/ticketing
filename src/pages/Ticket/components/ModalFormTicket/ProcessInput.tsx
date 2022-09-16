import { filterOptionWithVietnamese, getMasterDataByTypeUtil } from '@/utils';
import { LeftSquareOutlined, RightSquareOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { faBarsProgress } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Typography } from 'antd';
import './styles.less';

type ProcessInputProps = {
  formRef?: ProFormInstance;
};

const ProcessInput: React.FC<ProcessInputProps> = (props) => {
  const { formRef } = props;
  let editorInstance: any;

  return (
    <ProCard
      size="small"
      bordered
      headerBordered
      title={
        <>
          <FontAwesomeIcon icon={faBarsProgress} /> Thông tin xử lý
        </>
      }
      className="card-fill-header"
    >
      <Row gutter={16}>
        {/* <ProDescriptions<API.RuleListItem & any>
              column={{ xl: 4, lg: 4, sm: 4 }}
              layout='vertical'
              size='small'
              className="modalFormTicket"
              labelStyle={{
                color: '#607d8b',
                fontWeight: 600
              }}
              style={{ marginBottom: 10 }}
              title={false}
              request={async () => ({
                data: ticketInfo || {},
              })}
              columns={columnsProcess as ProDescriptionsItemProps<API.RuleListItem>[]}
            /> */}
        <Col span={6} xxl={6}>
          <ProFormSelect
            label="Kênh thanh toán"
            required
            name="paymentChannel"
            allowClear={false}
            rules={[{ required: true, message: 'Nhóm nghiệp vụ không được bỏ trống' }]}
            valueEnum={{
              '1': { text: 'Napas' },
              '2': { text: 'Payoo' },
            }}
          />
        </Col>
        <Col span={6} xxl={6}>
          <ProFormSelect
            label="Nhóm nghiệp vụ"
            required
            name="typeBusinessProcess"
            allowClear={false}
            rules={[{ required: true, message: 'Nhóm nghiệp vụ không được bỏ trống' }]}
            request={async () => getMasterDataByTypeUtil('TypeBusiness', true, true)}
          />
        </Col>
        <Col span={6} xxl={6}>
          <ProFormText
            name="emailCcProcess"
            label="Email CC"
            rules={[{ type: 'email', message: 'Định dạng email không đúng' }]}
          />
        </Col>

        <Col span={6} xxl={6}>
          <ProFormSelect
            label="Nội dung gợi ý"
            name="contentSuggestProcess"
            showSearch
            request={async () => {
              return Promise.resolve(getMasterDataByTypeUtil('ContentSuggest', true, true));
            }}
            fieldProps={{
              onChange(value) {
                formRef?.setFields?.([{ name: 'note', value }]);
                editorInstance?.data?.set?.(value);
              },
              filterOption: filterOptionWithVietnamese,
            }}
          />
        </Col>

        <Col span={24} xxl={24}>
          <ProFormTextArea name="note" label="Nội dung phản hồi" />
        </Col>

        <ProCard bordered headerBordered style={{ marginBottom: 10 }} hoverable>
          <Row gutter={16}>
            <Col span={4} xxl={4}>
              <Typography.Title level={5}>
                <RightSquareOutlined /> Tài khoản ghi nợ
              </Typography.Title>
            </Col>
            <Col span={5} xxl={5}>
              <ProFormText name="debitAccount" label="Tài khoản ghi nợ" />
            </Col>
            <Col span={5} xxl={5}>
              <ProFormText name="debitAccountName" label="Tên tài khoản" />
            </Col>
            <Col span={5} xxl={5}>
              <ProFormDigit
                name="debitAmount"
                label="Số tiền"
                fieldProps={{
                  formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                  parser: (value) => (value || '').replace(/\$\s?|(,*)/g, ''),
                }}
              />
            </Col>
            <Col span={5} xxl={5}>
              <ProFormText name="debitCurrency" label="Loại tiền" />
            </Col>
          </Row>
        </ProCard>
        <ProCard bordered headerBordered style={{ marginBottom: 10 }} hoverable>
          <Row gutter={16}>
            <Col span={4} xxl={4}>
              <Typography.Title level={5}>
                <LeftSquareOutlined /> Tài khoản ghi có
              </Typography.Title>
            </Col>
            <Col span={5} xxl={5}>
              <ProFormText name="creditAccount" label="Tài khoản ghi có" />
            </Col>
            <Col span={5} xxl={5}>
              <ProFormText name="creditAccountName" label="Tên tài khoản" />
            </Col>
            <Col span={5} xxl={5}>
              <ProFormDigit
                name="creditAmount"
                label="Số tiền"
                fieldProps={{
                  formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                  parser: (value) => (value || '').replace(/\$\s?|(,*)/g, ''),
                }}
              />
            </Col>
            <Col span={5} xxl={5}>
              <ProFormText name="creditCurrency" label="Loại tiền" />
            </Col>
          </Row>
        </ProCard>
        <Col span={8} xxl={8}>
          <ProFormText name="ftUpdate" label="FT hoạch toán được cập nhật" />
        </Col>
        <Col span={16} xxl={16}>
          <ProFormTextArea name="ftContent" label="Nội dung hoạch toán (nếu có)" />
        </Col>
      </Row>
    </ProCard>
  );
};

export default ProcessInput;
