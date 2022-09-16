import { getMasterDataByTypeUtil } from '@/utils';
import {
  ProFormDatePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import './styles.less';

type TransactionInputProps = {
  formRef?: ProFormInstance;
  disable?: boolean;
};

const TransactionInput: React.FC<TransactionInputProps> = (props) => {
  const { formRef, disable } = props;
  console.log(formRef);

  return (
    <Row gutter={16} className="transaction-ticket-form">
      <Col xxl={4} span={6}>
        <ProFormText
          label="ID Khách hàng"
          name="customerId"
          disabled={formRef?.getFieldValue?.(['customerId']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormText
          label="Khách hàng"
          name="customerName"
          disabled={formRef?.getFieldValue?.(['customerName']) || disable}
        />
      </Col>

      <Col xxl={4} span={6}>
        <ProFormText
          label="Tài khoản KH"
          name="customerAccount"
          disabled={formRef?.getFieldValue?.(['customerAccount']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormDigit
          label="Số tiền"
          name="amount"
          fieldProps={{
            formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            parser: (value) => (value || '').replace(/\$\s?|(,*)/g, ''),
          }}
          disabled={formRef?.getFieldValue?.(['amount']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormText
          label="FT giao dịch"
          name="ft"
          disabled={formRef?.getFieldValue?.(['ft']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormText
          label="FT liên quan"
          name="ftRelated"
          disabled={formRef?.getFieldValue?.(['ftRelated']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormText
          label="FM tra soát"
          name="fm"
          disabled={formRef?.getFieldValue?.(['fm']) || disable}
        />
      </Col>

      <Col xxl={4} span={6}>
        <ProFormText
          label="Số Trace/REF/MTCN"
          name="trace"
          disabled={formRef?.getFieldValue?.(['trace']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormText
          label="LCC tra soát"
          name="lcc"
          disabled={formRef?.getFieldValue?.(['lcc']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormSelect
          label="Kênh GD/Đối tác"
          name="channel"
          disabled={formRef?.getFieldValue?.(['channel']) || disable}
          request={() => getMasterDataByTypeUtil('PaymentChannel', true, true)}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormText
          label="NH Hưởng/Chuyển"
          name="bank"
          disabled={formRef?.getFieldValue?.(['bank']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormText
          label="LCC/GBC"
          name="lccGbc"
          disabled={formRef?.getFieldValue?.(['lccGbc']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormDatePicker
          label="Ngày GD/Tra soát"
          name="transDate"
          fieldProps={{
            format: 'DD/MM/YYYY',
            style: { width: '100%' },
          }}
          disabled={formRef?.getFieldValue?.(['transDate']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormSelect
          label="Chiều giao dịch"
          name="channel"
          request={() => getMasterDataByTypeUtil('TypeTransaction', true, true)}
          disabled={formRef?.getFieldValue?.(['channel']) || disable}
        />
      </Col>
      <Col xxl={4} span={6}>
        <ProFormText label="LOS ID TT Lương/CTTL" name="ttLuongCttl" disabled={disable} />
      </Col>
    </Row>
  );
};

export default TransactionInput;
