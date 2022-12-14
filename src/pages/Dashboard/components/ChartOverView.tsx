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
          .filter((predicate) => predicate?.status === 'T???ng s???')
          .reduce((total, value) => total + value?.ticket, 0),
        completed: data
          .filter((predicate) => predicate?.status === '???? x??? l??')
          .reduce((total, value) => total + value?.ticket, 0),
        processing: data
          .filter((predicate) => predicate?.status === '??ang x??? l??')
          .reduce((total, value) => total + value?.ticket, 0),
        pending: data
          .filter((predicate) => predicate?.status === 'Ch??? x??? l??')
          .reduce((total, value) => total + value?.ticket, 0),
        canceled: data
          .filter((predicate) => predicate?.status === 'H???y')
          .reduce((total, value) => total + value?.ticket, 0),
      });
    }
    setLoadingChart(false);
  };
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();

  const columns: ProColumns<API.RuleListItem & any>[] = [
    // {
    //   title: 'H??nh ?????ng',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   hideInDescriptions: true,
    //   hideInForm: true,
    //   hideInSearch: true,
    //   hideInTable: activeTab !== 'processing',
    //   // width: 100,
    //   render: (dom, entity) => <Button onClick={() => { setCurrentRow(entity); setShowQuickAction(true) }} >Ph???n h???i</Button>
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
      title: 'Ti??u ?????',
      dataIndex: 'ticketTitle',
      // width: 300,
      ellipsis: true,
      hideInSearch: true,
      render: (text, record) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word', width: 300 }}>{text}</div>
      ),
    },

    {
      title: 'Tr???ng th??i',
      dataIndex: 'status',
      // width: 80,
      filters: true,
      //   filteredValue: filteredInfo?.status || null,
      hideInForm: true,
      request: async () => getMasterDataByTypeUtil('StatusTicket', true, true),
      valueType: 'select',
    },
    {
      title: 'FT Giao d???ch + FT G???c',
      order: 5,
      width: 170,
      dataIndex: 'ft',
    },
    {
      title: 'S??? LCC tra so??t',
      width: 120,
      order: 4,
      dataIndex: 'lcc',
    },
    {
      title: 'FM tra so??t',
      order: 3,
      dataIndex: 'fm',
      width: 100,
    },
    {
      title: 'S??? Trace/REF/MTCN',
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
      title: 'S??? ti???n',
      dataIndex: 'amount',
      hideInSearch: true,
      width: 70,
    },
    {
      title: 'N???i dung g???i ?? + N???i dung tra so??t/h???i',
      dataIndex: 'contentRequest',
      width: 300,
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'N???i dung tr??? l???i',
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
      title: 'K??nh giao d???ch/?????i t??c',
      dataIndex: 'channel',
      request: async () => getMasterDataByTypeUtil('PaymentChannel', true, true),
      valueType: 'select',
      width: 170,
    },
    {
      title: 'NH h?????ng/S??? Pin + T??n NH',
      width: 200,
      dataIndex: 'bank',
      hideInSearch: true,
    },
    {
      title: 'Ng??y duy???t GD g???c',
      dataIndex: 'transDate',
      hideInSearch: true,
      width: 150,
    },
    {
      title: 'Chi???u GD',
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
      title: 'T??n Kh??ch h??ng',
      dataIndex: 'customerName',
      hideInSearch: true,
      width: 140,
    },
    {
      title: 'Nh??m nghi???p v???',
      order: 7,
      request: async () => getMasterDataByTypeUtil('TypeBusiness', true, true),
      ellipsis: true,
      valueType: 'select',
      width: 140,
      dataIndex: 'typeBusiness',
    },
    {
      title: 'Th???i gian kh???i t???o',
      dataIndex: 'createdDate',
      width: 165,
      sorter: true,
    },
    {
      title: 'Ng??y s???a ?????i',
      dataIndex: 'modifyDate',
      width: 165,
      sorter: true,
      hideInSearch: true,
    },
    //modifyDate
    {
      title: 'Th???i gian h???t h???n SLA',
      dataIndex: 'dueDate',
      width: 165,
      hideInSearch: true,
    },
    {
      title: 'SLA c??n l???i',
      width: 120,
      hideInSearch: true,
      renderText: (text, record) => {
        const mins = getDueDateAsMinute(record?.dueDate);
        return <Tag color={colorSla(mins)}>{mins ? `${mins} ph??t` : '---'}</Tag>;
      },
    },
    {
      title: 'Th???i gian x??? l??',
      dataIndex: 'timeProcess',
      hideInSearch: true,
      width: 120,
      renderText: (text, record) => {
        const mins = moment().diff(moment(record?.modifyDate, 'DD/MM/YYYY HH:mm:ss'), 'minutes');
        return <Tag>{mins ? `${mins} ph??t` : '---'}</Tag>;
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
                <ProFormSwitch name="mySelf" label="C???a t??i" />
                <ProFormSelect
                  name="typeBusiness"
                  placeholder={'Nh??m nghi???p v???'}
                  fieldProps={{
                    onChange() {
                      setUsers([]);
                      debounceFetcher();
                      restFormRef.current?.resetFields(['userProcess']);
                    },
                  }}
                  // label="Nh??m nghi???p v???"
                  style={{ width: 200 }}
                  request={async () => {
                    const data = await getMasterDataByTypeUtil('TypeBusiness', true, true);
                    return [...data, { label: 'T???t c???', value: '' }];
                  }}
                  allowClear
                />

                <ProFormSelect
                  name="userProcess"
                  placeholder={'Ng?????i x??? l??'}
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
                          ???? {item?.usrEmail}
                          <div>{`${item?.usrLastName} ${item?.usrFirstName}`}</div>
                        </div>
                      );
                    },
                  }}
                  // label="Ng?????i x??? l??"
                  style={{ width: 200 }}
                  allowClear
                />

                <ProFormSelect
                  name="status"
                  placeholder={'Tr???ng th??i'}
                  // label="Tr???ng th??i"
                  style={{ width: 200 }}
                  request={async () => getMasterDataByTypeUtil('StatusTicket', true, true)}
                  allowClear
                />

                <ProFormDateRangePicker
                  // label="Ng??y Y??u c???u"
                  placeholder={['Ng??y x??? l??', 'Ng??y x??? l??']}
                  fieldProps={{
                    format: 'DD/MM/YYYY',
                    ranges: {
                      'H??m nay': [moment().startOf('d'), moment().endOf('d')],
                      'H??m qua': [
                        moment().subtract(1, 'd').startOf('d'),
                        moment().subtract(1, 'd').endOf('d'),
                      ],
                      'Tu???n n??y': [moment().startOf('week'), moment().endOf('week')],
                      'Tu???n tr?????c': [
                        moment().subtract(1, 'w').startOf('week'),
                        moment().subtract(1, 'w').endOf('week'),
                      ],
                      'Th??ng n??y': [moment().startOf('month'), moment().endOf('month')],
                      'Th??ng tr?????c': [
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
                  title="B???n c?? mu???n xu???t ra Excel kh??ng?"
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
            <TabPane tab="Th???ng k?? Ticket" key="sales">
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
                      data={chartData.filter((predicate) => predicate?.status !== 'T???ng s???') as any}
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
                          text: 'Tr???ng th??i',
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
                      //   text: 'S??? ti???n',
                      //   style: {
                      //     fontSize: 14,
                      //   },
                      // }}
                      // meta={{
                      //     y: {
                      //         alias: 'S??? l?????ng',
                      //     },
                      // }}
                    />
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                  <Pie
                    appendPadding={10}
                    data={chartData.filter((predicate) => predicate?.status === 'T???ng s???') as any}
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
        // headerTitle='Danh s??ch ticket'
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
