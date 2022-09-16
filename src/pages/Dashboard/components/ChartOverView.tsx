import DrawerDetailTicket from '@/pages/Ticket/components/DrawerDetailTicket';
import api from '@/services/api';
import { colorSla, getDueDateAsMinute, getMasterDataByTypeUtil } from '@/utils';
import { Column, Pie } from '@ant-design/charts';
import { FileExcelOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProForm,
  ProFormDateRangePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormSwitch,
  ProTable,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Badge, Button, Card, Col, Divider, Popconfirm, Row, Select, Spin, Tabs, Tag } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import CardStatics, { CardStaticsProps } from './CardStatics';
import styles from './styles.less';

// const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
// type RangePickerValue = RangePickerProps<moment.Moment>['value'];
export type TimeType = 'today' | 'week' | 'month' | 'year';

type ChartOverViewProps = {};
const ChartOverView: React.FC<ChartOverViewProps> = (props) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const [chartData, setChartData] = useState<any[]>([]);
  const [loadingChart, setLoadingChart] = useState<boolean>(false);
  const [statusCount, setStatusCount] = useState<CardStaticsProps>({});
  const restFormRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [fetching, setFetching] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const fetchRef = useRef(0);
  const { Option } = Select;
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value?: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setUsers([]);
      setFetching(true);
      console.log(value);
      api.user
        .getListUserByTypeBusiness(restFormRef.current?.getFieldValue(['typeBusiness']), value)
        .then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }

          setUsers(
            newOptions?.data?.map((value) => {
              return {
                ...value,
                value: value?.usrUid,
                label: `${value?.usrEmail} - ${value?.usrLastName} ${value?.usrFirstName}`,
              };
            }) || [],
          );
          setFetching(false);
        });
    };

    return debounce(loadOptions, 800);
  }, []);

  const getChartTicket = async (values: any) => {
    const { status = '', dateRange = [], typeBusiness = '', userProcess = '' } = values;
    setLoadingChart(true);
    const res = await api.statistic.getChartTicket({
      fromDate: dateRange?.[0] || moment().subtract(3, 'days').format('DD/MM/YYYY'),
      toDate: dateRange?.[1] || moment().format('DD/MM/YYYY'),
      status,
      typeBusiness,
      userProcess: values?.mySelf ? currentUser?.usrUid : values?.userProcess,
    });
    if (res.body?.status === 'OK') {
      const data = (res.body?.dataRes as any[]) || [];
      setChartData(data);
      setStatusCount({
        total: data
          .filter((predicate) => predicate?.status === 'Tổng số')
          .reduce((total, value) => total + value?.ticket, 0),
        completed: data
          .filter((predicate) => predicate?.status === 'Đã xử lý')
          .reduce((total, value) => total + value?.ticket, 0),
        processing: data
          .filter((predicate) => predicate?.status === 'Đang xử lý')
          .reduce((total, value) => total + value?.ticket, 0),
        pending: data
          .filter((predicate) => predicate?.status === 'Chờ xử lý')
          .reduce((total, value) => total + value?.ticket, 0),
        canceled: data
          .filter((predicate) => predicate?.status === 'Hủy')
          .reduce((total, value) => total + value?.ticket, 0),
      });
    }
    setLoadingChart(false);
  };
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();

  const columns: ProColumns<API.RuleListItem & any>[] = [
    // {
    //   title: 'Hành động',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   hideInDescriptions: true,
    //   hideInForm: true,
    //   hideInSearch: true,
    //   hideInTable: activeTab !== 'processing',
    //   // width: 100,
    //   render: (dom, entity) => <Button onClick={() => { setCurrentRow(entity); setShowQuickAction(true) }} >Phản hồi</Button>
    // },
    {
      title: 'Ticket ID',
      filters: true,
      valueType: 'text',
      // width: 190,
      hideInSearch: true,
      dataIndex: 'ticketId',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {' '}
            <Badge color={colorSla(getDueDateAsMinute(entity?.dueDate))} />
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'ticketTitle',
      // width: 300,
      ellipsis: true,
      hideInSearch: true,
      render: (text, record) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word', width: 300 }}>{text}</div>
      ),
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      // width: 80,
      filters: true,
      //   filteredValue: filteredInfo?.status || null,
      hideInForm: true,
      request: async () => getMasterDataByTypeUtil('StatusTicket', true, true),
      valueType: 'select',
    },
    {
      title: 'FT Giao dịch + FT Gốc',
      order: 5,
      width: 170,
      dataIndex: 'ft',
    },
    {
      title: 'Số LCC tra soát',
      width: 120,
      order: 4,
      dataIndex: 'lcc',
    },
    {
      title: 'FM tra soát',
      order: 3,
      dataIndex: 'fm',
      width: 100,
    },
    {
      title: 'Số Trace/REF/MTCN',
      order: 2,
      width: 150,
      dataIndex: 'trace',
    },
    {
      title: 'LCC/GBC',
      order: 6,
      dataIndex: 'lccGbc',
      width: 80,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      hideInSearch: true,
      width: 70,
    },
    {
      title: 'Nội dung gợi ý + Nội dung tra soát/hỏi',
      dataIndex: 'contentRequest',
      width: 300,
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'Nội dung trả lời',
      hideInSearch: true,
      width: 120,
      // dataIndex: 'userEmailCc',
    },
    {
      title: 'Email CC',
      dataIndex: 'userEmailCc',
      hideInSearch: true,
      width: 80,
    },
    {
      title: 'Kênh giao dịch/đối tác',
      dataIndex: 'channel',
      request: async () => getMasterDataByTypeUtil('PaymentChannel', true, true),
      valueType: 'select',
      width: 170,
    },
    {
      title: 'NH hưởng/Số Pin + Tên NH',
      width: 200,
      dataIndex: 'bank',
      hideInSearch: true,
    },
    {
      title: 'Ngày duyệt GD gốc',
      dataIndex: 'transDate',
      hideInSearch: true,
      width: 150,
    },
    {
      title: 'Chiều GD',
      dataIndex: 'typeTransaction',
      request: async () => getMasterDataByTypeUtil('TypeTransaction', true, true),
      // renderText: (text) => <NameMasterData type='TypeTransaction' value={text} />,
      valueType: 'select',
      width: 80,
    },
    {
      title: 'ID KH',
      dataIndex: 'customerAccount',
      hideInSearch: true,
      width: 60,
    },
    {
      title: 'Tên Khách hàng',
      dataIndex: 'customerName',
      hideInSearch: true,
      width: 140,
    },
    {
      title: 'Nhóm nghiệp vụ',
      order: 7,
      request: async () => getMasterDataByTypeUtil('TypeBusiness', true, true),
      ellipsis: true,
      valueType: 'select',
      width: 140,
      dataIndex: 'typeBusiness',
    },
    {
      title: 'Thời gian khởi tạo',
      dataIndex: 'createdDate',
      width: 165,
      sorter: true,
    },
    {
      title: 'Ngày sửa đổi',
      dataIndex: 'modifyDate',
      width: 165,
      sorter: true,
      hideInSearch: true,
    },
    //modifyDate
    {
      title: 'Thời gian hết hạn SLA',
      dataIndex: 'dueDate',
      width: 165,
      hideInSearch: true,
    },
    {
      title: 'SLA còn lại',
      width: 120,
      hideInSearch: true,
      renderText: (text, record) => {
        const mins = getDueDateAsMinute(record?.dueDate);
        return <Tag color={colorSla(mins)}>{mins ? `${mins} phút` : '---'}</Tag>;
      },
    },
    {
      title: 'Thời gian xử lý',
      dataIndex: 'timeProcess',
      hideInSearch: true,
      width: 120,
      renderText: (text, record) => {
        const mins = moment().diff(moment(record?.modifyDate, 'DD/MM/YYYY HH:mm:ss'), 'minutes');
        return <Tag>{mins ? `${mins} phút` : '---'}</Tag>;
      },
    },
  ];

  useEffect(() => {
    getChartTicket({
      // status: "",
      typeBusiness: currentUser?.typeBusiness,
      userProcess: currentUser?.usrUid,
    });
  }, []);

  return (
    <>
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <div className={styles.salesCard}>
          <Tabs
            tabBarExtraContent={
              <ProForm
                submitter={false}
                layout="inline"
                labelWrap={true}
                formRef={restFormRef}
                initialValues={{
                  dateRange: [moment().subtract(3, 'days'), moment()],
                  typeBusiness: currentUser?.typeBusiness,
                  mySelf: true,
                }}
                onValuesChange={(change, values) => {
                  getChartTicket(values), actionRef.current?.reload();
                }}
              >
                <ProFormSwitch name="mySelf" label="Của tôi" />
                <ProFormSelect
                  name="typeBusiness"
                  placeholder={'Nhóm nghiệp vụ'}
                  fieldProps={{
                    onChange() {
                      setUsers([]);
                      debounceFetcher();
                      restFormRef.current?.resetFields(['userProcess']);
                    },
                  }}
                  // label="Nhóm nghiệp vụ"
                  style={{ width: 200 }}
                  request={async () => {
                    const data = await getMasterDataByTypeUtil('TypeBusiness', true, true);
                    return [...data, { label: 'Tất cả', value: '' }];
                  }}
                  allowClear
                />

                <ProFormSelect
                  name="userProcess"
                  placeholder={'Người xử lý'}
                  dependencies={['mySelf']}
                  showSearch
                  disabled={
                    !restFormRef.current?.getFieldValue(['typeBusiness']) ||
                    restFormRef.current?.getFieldValue(['mySelf'])
                  }
                  fieldProps={{
                    onSearch: debounceFetcher,
                    options: users,
                    loading: fetching,
                    notFoundContent: fetching ? <Spin size="small" /> : null,
                    optionItemRender(item) {
                      return (
                        <div>
                          📧 {item?.usrEmail}
                          <div>{`${item?.usrLastName} ${item?.usrFirstName}`}</div>
                        </div>
                      );
                    },
                  }}
                  // label="Người xử lý"
                  style={{ width: 200 }}
                  allowClear
                />

                <ProFormSelect
                  name="status"
                  placeholder={'Trạng thái'}
                  // label="Trạng thái"
                  style={{ width: 200 }}
                  request={async () => getMasterDataByTypeUtil('StatusTicket', true, true)}
                  allowClear
                />

                <ProFormDateRangePicker
                  // label="Ngày Yêu cầu"
                  placeholder={['Ngày xử lý', 'Ngày xử lý']}
                  fieldProps={{
                    format: 'DD/MM/YYYY',
                    ranges: {
                      'Hôm nay': [moment().startOf('d'), moment().endOf('d')],
                      'Hôm qua': [
                        moment().subtract(1, 'd').startOf('d'),
                        moment().subtract(1, 'd').endOf('d'),
                      ],
                      'Tuần này': [moment().startOf('week'), moment().endOf('week')],
                      'Tuần trước': [
                        moment().subtract(1, 'w').startOf('week'),
                        moment().subtract(1, 'w').endOf('week'),
                      ],
                      'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                      'Tháng trước': [
                        moment().subtract(1, 'M').startOf('month'),
                        moment().subtract(1, 'M').endOf('month'),
                      ],
                    },
                    defaultValue: [moment().subtract(7, 'days'), moment()],
                  }}
                  style={{ width: 240 }}
                  name="dateRange"
                />
                <Popconfirm
                  title="Bạn có muốn xuất ra Excel không?"
                  okButtonProps={{ size: 'middle' }}
                  cancelButtonProps={{ size: 'large' }}
                >
                  <Button
                    type="primary"
                    key="excel"
                    style={{ background: '#06762f', borderColor: '#06762f' }}
                  >
                    <FileExcelOutlined />
                  </Button>
                </Popconfirm>
              </ProForm>
            }
            size="large"
            tabBarStyle={{ marginBottom: 24 }}
          >
            <TabPane tab="Thống kê Ticket" key="sales">
              <Row>
                <Col span={24} style={{ marginBottom: 20 }}>
                  <CardStatics {...statusCount} />
                </Col>
                <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                  <div className={styles.salesBar}>
                    <Column
                      height={300}
                      loading={loadingChart}
                      isGroup={true}
                      data={chartData.filter((predicate) => predicate?.status !== 'Tổng số') as any}
                      seriesField="typeBusiness"
                      xField="status"
                      yField="ticket"
                      marginRatio={0}
                      label={{
                        position: 'middle',
                        layout: [
                          {
                            type: 'interval-adjust-position',
                          },
                          {
                            type: 'interval-hide-overlap',
                          },
                          {
                            type: 'adjust-color',
                          },
                        ],
                      }}
                      xAxis={{
                        // visible: true,
                        title: {
                          text: 'Trạng thái',
                          // visible: false,
                        },
                      }}
                      yAxis={{
                        // visible: true,
                        title: {
                          text: 'Ticket',
                          // visible: false,
                        },
                      }}
                      // title={{
                      //   visible: true,
                      //   text: 'Số tiền',
                      //   style: {
                      //     fontSize: 14,
                      //   },
                      // }}
                      // meta={{
                      //     y: {
                      //         alias: 'Số lượng',
                      //     },
                      // }}
                    />
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                  <Pie
                    appendPadding={10}
                    data={chartData.filter((predicate) => predicate?.status === 'Tổng số') as any}
                    angleField="ticket"
                    colorField="typeBusiness"
                    radius={0.75}
                    loading={loadingChart}
                    label={{
                      type: 'inner',
                      offset: '-30%',
                      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                      style: {
                        fontSize: 14,
                        textAlign: 'center',
                      },
                    }}
                    interactions={[
                      {
                        type: 'element-selected',
                      },
                      {
                        type: 'element-active',
                      },
                    ]}
                  />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </Card>
      <Divider dashed style={{ margin: 8 }} />
      <ProTable
        // headerTitle='Danh sách ticket'
        search={false}
        columns={columns}
        actionRef={actionRef}
        // cardBordered={false}
        scroll={{ x: 'max-content' }}
        // sticky={{ offsetHeader: 56 }}
        rowKey="ticketId"
        size="small"
        options={false}
        // pagination={{ pageSize: 10 }}
        request={(params, sort, filter) =>
          api.ticket.getListTicket(
            {
              params,
              sort,
              filters: {
                typeBusiness: restFormRef.current?.getFieldValue(['typeBusiness']),
                userProcess: restFormRef.current?.getFieldValue(['mySelf'])
                  ? currentUser?.usrUid
                  : restFormRef.current?.getFieldValue(['userProcess']),
                status: restFormRef.current?.getFieldValue(['status']),
                fromDate:
                  restFormRef.current?.getFieldValue(['dateRange'])?.[0]?.format?.('DD/MM/YYYY') ||
                  moment().subtract(7, 'days').format('DD/MM/YYYY'),
                toDate:
                  restFormRef.current?.getFieldValue(['dateRange'])?.[1]?.format?.('DD/MM/YYYY') ||
                  moment().format('DD/MM/YYYY'),
              },
            },
            'getDashboardTicket',
          )
        }
      />

      <DrawerDetailTicket
        width={'90%'}
        visible={showDetail}
        ticketId={currentRow?.ticketId}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      />
    </>
  );
};

export default ChartOverView;
