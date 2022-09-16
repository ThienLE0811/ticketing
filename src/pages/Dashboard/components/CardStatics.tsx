import {
  faBarsProgress,
  faCancel,
  faCheckCircle,
  faHourglassEnd,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Statistic } from 'antd';

export type CardStaticsProps = {
  total?: number;
  pending?: number;
  processing?: number;
  completed?: number;
  canceled?: number;
};

const CardStatics: React.FC<CardStaticsProps> = (props) => {
  const { total, pending, processing, completed, canceled } = props;

  return (
    <Row gutter={[16, 16]}>
      <Col flex={'auto'}>
        <Statistic
          valueStyle={{ color: '#fff' }}
          style={{
            height: 100,
            borderRadius: 14,
            padding: 16,
            // boxShadow: 'rgb(0 0 0 / 40%) 0px 2px 6px 0px',
            objectFit: 'contain',
            background: 'url("/images/bg-card-1.png") 0% 0% / cover no-repeat rgb(154, 113, 183)',
          }}
          title={<span style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>Tổng</span>}
          value={total}
          prefix={<FontAwesomeIcon icon={faTicket} />}
        />
      </Col>
      <Col flex={'auto'}>
        <Statistic
          valueStyle={{ color: '#fff' }}
          style={{
            height: 100,
            borderRadius: 14,
            padding: 16,
            // boxShadow: 'rgb(0 0 0 / 40%) 0px 2px 6px 0px',
            objectFit: 'contain',
            background: 'url("/images/bg-card-1.png") 0% 0% / cover no-repeat rgb(220, 57, 68)',
          }}
          title={<span style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>Chờ xử lý</span>}
          value={pending}
          prefix={<FontAwesomeIcon icon={faHourglassEnd} />}
        />
      </Col>
      <Col flex={'auto'}>
        <Statistic
          valueStyle={{ color: '#fff' }}
          style={{
            height: 100,
            borderRadius: 14,
            padding: 16,
            // boxShadow: 'rgb(0 0 0 / 40%) 0px 2px 6px 0px',
            objectFit: 'contain',
            background: 'url("/images/bg-card-1.png") 0% 0% / cover no-repeat rgb(53, 162, 237)',
          }}
          title={<span style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>Đang xử lý</span>}
          value={processing}
          prefix={<FontAwesomeIcon icon={faBarsProgress} />}
        />
      </Col>
      <Col flex={'auto'}>
        <Statistic
          valueStyle={{ color: '#fff' }}
          style={{
            height: 100,
            borderRadius: 14,
            padding: 16,
            // boxShadow: 'rgb(0 0 0 / 40%) 0px 2px 6px 0px',
            objectFit: 'contain',
            background: 'url("/images/bg-card-1.png") 0% 0% / cover no-repeat rgb(60, 179, 62)',
          }}
          title={<span style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>Đã xử lý</span>}
          value={completed}
          prefix={<FontAwesomeIcon icon={faCheckCircle} />}
        />
      </Col>
      <Col flex={'auto'}>
        <Statistic
          valueStyle={{ color: '#fff' }}
          style={{
            height: 100,
            borderRadius: 14,
            padding: 16,
            // boxShadow: 'rgb(0 0 0 / 40%) 0px 2px 6px 0px',
            objectFit: 'contain',
            background: 'url("/images/bg-card-1.png") 0% 0% / cover no-repeat #607d8b',
          }}
          title={<span style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>Huỷ</span>}
          value={canceled}
          prefix={<FontAwesomeIcon icon={faCancel} />}
        />
      </Col>
    </Row>
  );
};

export default CardStatics;
