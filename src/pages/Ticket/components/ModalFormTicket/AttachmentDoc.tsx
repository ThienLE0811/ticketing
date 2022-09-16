import { deleteUploadFile, requestFormDataFileStore } from '@/services/api/document';
import { ProCard, ProFormInstance, ProFormUploadButton } from '@ant-design/pro-components';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message, notification, UploadFile } from 'antd';
import _ from 'lodash';
import FileAttachmentList from '../FileAttachmentList';
import './styles.less';

type AttachmentDocProps = {
  formRef?: ProFormInstance;
  ticketId?: string;
  id?: string;
  isDraft?: boolean;
  handlePreview?: (file: UploadFile) => void;
};

const AttachmentDoc: React.FC<AttachmentDocProps> = (props) => {
  const { formRef, id, isDraft, ticketId, handlePreview } = props;

  return (
    <ProCard
      size="small"
      bordered
      headerBordered
      title={
        <>
          <FontAwesomeIcon icon={faFolderOpen} /> Chứng từ đính kèm
        </>
      }
      className="card-fill-header"
    >
      <ProFormUploadButton
        accept=".jpg,.jpeg,.png,application/pdf,application/doc,application/docx,application/xls,application/xlsx"
        title="Chọn tệp"
        name="file"
        extra={`Tối đa 5MB/tệp. Định dạng Ảnh/PDF/Word/Excel.`}
        fieldProps={{
          listType: 'picture-card',
          multiple: true,
          method: 'POST',
          onPreview: handlePreview,
          headers: {
            'X-IBM-CLIENT-ID': 'e09ae72b3022da6cc7977d10a8e7f3df',
            'X-IBM-CLIENT-SECRET': '2a2489dd3ef2811018a7b40dad4414aa',
          },
          onRemove: (file) => {
            if (file.status === 'done') {
              deleteUploadFile(file?.response?.body?.transaction?.docID);
              return Promise.resolve();
            }
          },
          onChange: (info) => {
            // console.log("info", info);
            if (info.file.status === 'done') {
              if (info.file?.response?.body?.status === 'OK') {
                message.success('Tải tệp lên thành công!');
              } else {
                notification.error({
                  message: 'Có lỗi xảy ra khi tải lên tệp đính kèm!',
                  description: info.file?.response?.error?.desc,
                });
              }
            }
            if (info.file.status === 'error') {
              notification.error({
                message: 'Có lỗi xảy ra khi tải lên tệp đính kèm!',
                description: info.file?.response?.moreInformation,
              });
            }
            _.includes(['done', 'error'], info.file.status) &&
              formRef?.setFieldsValue({
                file: info.fileList?.map((value) => {
                  return {
                    ...value,
                    status: value?.response?.body?.status === 'OK' ? 'done' : 'error',
                    thumbUrl: _.includes(value.type, 'pdf') ? '/images/icon-pdf.png' : undefined,
                  };
                }),
              });
          },
          openFileDialogOnClick: true,
          data(file) {
            return {
              request: new Blob(
                [JSON.stringify(requestFormDataFileStore({ fileName: file.name || file.uid }))],
                {
                  type: 'application/json',
                },
              ),
            };
          },
        }}
        action={TICKETING_FILE_STORE + '/upload'}
      />
      {ticketId && <FileAttachmentList ticketId={ticketId} id={id} isDraft={isDraft} hideEmpty />}
    </ProCard>
  );
};

export default AttachmentDoc;
