import PdfPreview from '@/components/PdfPreview';
import api from '@/services/api';
import { actionAllow, base64Uint8Array, saveFileLocal } from '@/utils';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Empty, Image, message, Modal, Popconfirm } from 'antd';
import _ from 'lodash';
import { useRef, useState } from 'react';

type FileAttachmentListProps = {
  isDraft?: boolean;
  ticketId?: string;
  id?: string;
  hideEmpty?: boolean;
};
const FileAttachmentList: React.FC<FileAttachmentListProps> = (props) => {
  const { isDraft, ticketId = '', id = '', hideEmpty = false } = props;
  const actionRef = useRef<ActionType>();
  const [filePreview, setFilePreview] = useState<any>(undefined);
  const [visibleImage, setVisibleImage] = useState<boolean>(false);
  const [visiblePdf, setVisiblePdf] = useState<boolean>(false);

  const columnsTable: ProColumns<any>[] = [
    {
      title: 'Tên tệp',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              handlePreview({ ...entity });
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Kiểu tệp',
      dataIndex: 'type',
    },
    // {
    //     title: 'Dung lượng',
    //     dataIndex: 'type',
    // },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 180,
      // renderText: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss")
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 180,
      // renderText: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss")
    },
    {
      title: 'Hành động',
      dataIndex: 'unit',
      width: 90,
      align: 'center',
      render(dom, entity, index, action, schema) {
        return (
          <Button.Group>
            <Button
              disabled={!actionAllow(entity.action, 'DOWNLOAD')}
              onClick={() => handleDownloadFile({ ...entity, download: true })}
              value="default"
              icon={<DownloadOutlined />}
            />
            <Popconfirm
              disabled={!actionAllow(entity.action, 'DELETE')}
              title="Bạn chắc chắn muốn xoá tệp này?"
              onConfirm={() => handleRemoveFile(entity.docID)}
            >
              <Button
                disabled={!actionAllow(entity.action, 'DELETE')}
                value="small"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Button.Group>
        );
      },
    },
  ];

  const handleRemoveFile = async (docID: string) => {
    const res = await api.document.deleteUploadFile(docID);
    res.body?.status === 'OK' && actionRef.current?.reload();
    return Promise.resolve();
  };

  const handlePreview = async ({ docID, type, docUrl, fileName }: Record<string, string>) => {
    if (_.includes(type, 'image') || _.includes(type, 'pdf')) {
      // show preview
      const base64 = await handleDownloadFile({ docID, type, docUrl, fileName });
      if (!base64) return;
      switch (true) {
        case _.includes(type, 'image'):
          setFilePreview(base64);
          setVisibleImage(true);
          break;
        case _.includes(type, 'pdf'):
          setFilePreview(base64Uint8Array(base64));
          setVisiblePdf(true);
        default:
          break;
      }
    } else {
      //download
      handleDownloadFile({ docID, type, docUrl, fileName, download: true });
    }
  };

  const handleDownloadFile = async ({
    docID,
    fileName,
    docUrl,
    type,
    download,
  }: {
    docUrl: string;
    fileName: string;
    docID: string;
    type: string;
    download?: boolean;
  }) => {
    message.open({
      content: `Đang tải dữ liệu tệp ${fileName}...`,
      duration: 0,
      type: 'loading',
      key: docID,
    });
    try {
      const fileStream = await api.document.downloadFile(
        { docID, fileName, docUrl },
        {
          headers: {
            'X-IBM-CLIENT-ID': 'e09ae72b3022da6cc7977d10a8e7f3df',
            'X-IBM-CLIENT-SECRET': '2a2489dd3ef2811018a7b40dad4414aa',
          },
        },
      );
      message.destroy(docID);
      if (fileStream.body?.status !== 'OK') return false;
      const fileBase64 = 'data:' + type + ';base64,' + fileStream.body?.transaction?.fileStream;
      download && saveFileLocal(fileBase64, fileName);
      return fileBase64;
    } catch (error) {
      message.destroy(docID);
      return '';
    }
  };

  return (
    <>
      <ProTable
        search={false}
        actionRef={actionRef}
        size="small"
        rowKey="docID"
        options={false}
        bordered
        tableViewRender={(props, dom) => {
          if (props.dataSource?.length === 0 && !props.loading && !hideEmpty)
            return <Empty imageStyle={{ height: 50 }} />;
          return dom;
        }}
        pagination={false}
        request={async () => {
          if (!ticketId && !id) return { data: [] };
          const data = isDraft
            ? await api.document.getUploadFileDraft({ ticketId, id })
            : await api.document.getUploadFile(ticketId);
          if (data?.body?.status === 'OK') {
            return { data: data.body.dataRes };
          } else return { data: [] };
        }}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        columns={columnsTable}
        // scroll={{ x: 5000 }}
      />
      <Modal
        visible={visiblePdf}
        onCancel={() => {
          setVisiblePdf(false);
          setFilePreview(undefined);
        }}
        closable={false}
        destroyOnClose
        title={false}
        footer={false}
        centered
        bodyStyle={{ padding: 0 }}
        width={1000}
      >
        <PdfPreview src={filePreview} />
      </Modal>
      <Image
        preview={{
          visible: visibleImage,
          onVisibleChange: (value) => {
            setVisibleImage(value);
            if (value == false) {
              setFilePreview(undefined);
            }
          },
          src: filePreview,
        }}
        hidden
      />
    </>
  );
};
export default FileAttachmentList;
