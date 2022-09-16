import { colorSla, getMasterDataByTypeUtil } from '@/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Divider, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

type DetailGroupProps = {
  loading?: boolean;
  groupInfo?: any;
  groupId?: string;
};

const DetailGroup: React.FC<DetailGroupProps> = (props) => {
  const { loading, groupInfo = {}, groupId } = props;
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem & any>();
  const [activeTabHis, setActiveTabHis] = useState<'ticketRelated' | 'modTrack'>('ticketRelated');

  useEffect(() => {
    actionRef.current?.reload();
  }, [groupInfo]);

  const columns: ProColumns<API.RuleListItem & any>[] = [
    {
      title: 'Code nhóm',
      dataIndex: 'grpCode',
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'grpName',
      hideInSearch: true,
      hideInDescriptions: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Tiêu đề nhóm',
      dataIndex: 'grpTitle',
      hideInSearch: true,
    },
    {
      title: 'ID Nhóm',
      dataIndex: 'grpUid',
      hideInSearch: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'grpStatus',
      valueType: 'select',
      // initialValue: 'ACTIVE',
      valueEnum: {
        ACTIVE: {
          text: 'Hoạt động',
          status: 'Success',
        },
        INACTIVE: {
          text: 'Không hoạt động',
          status: 'Error',
        },
      },
    },
    {
      title: 'Số Người dùng',
      dataIndex: 'totalUser',
      hideInSearch: true,
    },
  ];

  return (
    <>
      <ProDescriptions<API.RuleListItem & any>
        column={{ xl: 5, lg: 4, sm: 4 }}
        layout="vertical"
        size="small"
        className="modalFormTicket"
        labelStyle={{
          // color: '#607d8b',
          fontWeight: 600,
        }}
        loading={loading}
        dataSource={groupInfo}
        // request={async () => ({
        //     data: ticketInfo || {},
        // })}
        // params={{
        //     id: ticketInfo?.ticketId,
        // }}
        columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
      />
    </>
  );
};

export default DetailGroup;
