import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/vi';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Event from '@ckeditor/ckeditor5-utils/src/eventinfo';
import './index.less';
type EditorProps = {
  initiateData?: string;
  onReady?: (editor: DecoupledEditor) => void;
  onChange?: (event: Event, editor: DecoupledEditor) => void;
  onBlur?: () => void;
  onFocus?: () => void;
};
const editorConfiguration = {
  // plugins: [
  //     FontSize
  // ],
  // plugins: [
  //     // Alignment,
  //     // Autoformat,
  //     // AutoImage,
  //     // AutoLink,
  //     // Autosave,
  //     // BlockQuote,
  //     // Bold,
  //     // CKFinderUploadAdapter,
  //     // CloudServices,
  //     // Code,
  //     // CodeBlock,
  //     // DataFilter,
  //     // DataSchema,
  //     // Essentials,
  //     // FindAndReplace,
  //     // FontBackgroundColor,
  //     // FontColor,
  //     // FontFamily,
  //     // FontSize,
  //     // GeneralHtmlSupport,
  //     // Heading,
  //     // Highlight,
  //     // HorizontalLine,
  //     // HtmlEmbed,
  //     // Image,
  //     // ImageCaption,
  //     // ImageInsert,
  //     // ImageResize,
  //     // ImageStyle,
  //     // ImageToolbar,
  //     // ImageUpload,
  //     // Indent,
  //     // IndentBlock,
  //     // Italic,
  //     // Link,
  //     // LinkImage,
  //     // List,
  //     // ListProperties,
  //     // Markdown,
  //     // MediaEmbed,
  //     // MediaEmbedToolbar,
  //     // Mention,
  //     // PageBreak,
  //     // Paragraph,
  //     // PasteFromOffice,
  //     // RemoveFormat,
  //     // RevisionHistory,
  //     // SpecialCharacters,
  //     // SpecialCharactersArrows,
  //     // SpecialCharactersCurrency,
  //     // SpecialCharactersEssentials,
  //     // SpecialCharactersLatin,
  //     // SpecialCharactersMathematical,
  //     // SpecialCharactersText,
  //     // StandardEditingMode,
  //     // Strikethrough,
  //     // Subscript,
  //     // Superscript,
  //     // Table,
  //     // TableCaption,
  //     // TableCellProperties,
  //     // TableProperties,
  //     // TableToolbar,
  //     // TextPartLanguage,
  //     // TextTransformation,
  //     // Title,
  //     // TodoList,
  //     // Underline,
  //     // WordCount,
  //     // RevisionHistoryAdapter
  // ],
  toolbar: {
    // plugins: [
    //     HtmlEmbed
    // ],
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      'alignment',
      'pageBreak',
      '|',
      'todoList',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'undo',
      'redo',
      '-',
      'imageInsert',
      'highlight',
      'fontFamily',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      'findAndReplace',
      'htmlEmbed',
      'horizontalLine',
      'codeBlock',
      'code',
    ],
    shouldNotGroupWhenFull: true,
  },
  language: {
    // The UI will be English.
    ui: 'vi',

    // But the content will be edited in Arabic.
    // content: 'ar'
  },
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      'linkImage',
    ],
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties',
    ],
  },
};

const Editor: React.FC<EditorProps> = (props) => {
  const { initiateData, onBlur, onFocus, onChange, onReady } = props;
  // const [ready, setReady] = useState<boolean>(false)
  return (
    <CKEditor
      editor={DecoupledEditor}
      data={initiateData || ''}
      // config={editorConfiguration}
      onReady={(editor) => {
        onReady?.(editor);
        // You can store the "editor" and use when it is needed.
        //@ts-ignore
        // editor.ui.view.editable.editableElement?.style.height = '300px';
        //@ts-ignore
        editor.ui.getEditableElement().parentElement.insertBefore(
          //@ts-ignore
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement(),
        );
      }}
      // onError={(error, { willEditorRestart }) => {
      //     // If the editor is restarted, the toolbar element will be created once again.
      //     // The `onReady` callback will be called again and the new toolbar will be added.
      //     // This is why you need to remove the older toolbar.
      //     if (willEditorRestart) {
      //         this.editor.ui.view.toolbar.element.remove();
      //     }
      // }}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};

export default Editor;
