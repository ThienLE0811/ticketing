import type { LocalizationMap } from '@react-pdf-viewer/core';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import vi_VN from '@react-pdf-viewer/locales/lib/vi_VN.json';
import { Result } from 'antd';

type PdfPreviewProps = {
  src: string | Uint8Array;
  title?: string;
};
const ErrorRenderPDF = ({ error }: { error?: string | undefined }) => {
  return (
    <Result status="warning" title="Không thể hiển thị bản xem trước của PDF" subTitle={error} />
  );
};

const PdfPreview: React.FC<PdfPreviewProps> = (props) => {
  const { src } = props;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <>
      <Worker workerUrl="/plugins/pdfjs/pdf.worker.js">
        <div style={{ height: 'calc(96vh)' }}>
          <Viewer
            fileUrl={src}
            localization={vi_VN as unknown as LocalizationMap}
            plugins={[defaultLayoutPluginInstance]}
            theme={{ theme: 'dark' }}
            renderError={(error) => <ErrorRenderPDF error={`${error?.name}: ${error?.message}`} />}
          />
        </div>
      </Worker>
    </>
  );
};

export default PdfPreview;
