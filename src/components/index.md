---
title: Nghiệp vụ bộ phận
sidemenu: false
---

> Này công năng từ [dumi](https://d.umijs.org/zh-CN/guide/advanced#umi-%E9%A1%B9%E7%9B%AE%E9%9B%86%E6%88%90%E6%A8%A1%E5%BC%8F) Cung cấp, dumi Là một cái 📖 Vì bộ phận khai phát tràng cảnh mà sinh văn kiện công cụ, dùng qua đều nói xong.

# Nghiệp vụ bộ phận

Nơi này liệt cử Pro Bên trong tất cả dùng đến bộ phận, những này bộ phận không thích hợp làm bộ phận kho, nhưng là làm việc vụ bên trong lại chân thực cần. Cho nên chúng ta chuẩn bị cái này văn kiện, đến chỉ đạo mọi người phải chăng cần sử dụng cái này bộ phận.

## Footer Trang chân bộ phận

Cái này bộ phận tự mang một chút Pro Phối trí, ngươi đồng dạng đều cần từ bỏ tin tức của nó.

```tsx
*
 * background: '#f0f2f5'
 */
import Footer from '@/components/Footer';

export default  => <Footer />;
```

## HeaderDropdown Đầu hạ kéo liệt biểu

HeaderDropdown Là antd Dropdown Đóng gói, nhưng là tăng lên di động quả nhiên đặc thù xử lý, cách dùng cũng là giống nhau.

```tsx
*
 * background: '#f0f2f5'
 */
import HeaderDropdown from '@/components/HeaderDropdown';
import { Button, Menu } from 'antd';

export default  => {
 const menuHeaderDropdown = (
  <Menu selectedKeys={}>
   <Menu.Item key="center"> Trung tâm Cá nhân </Menu.Item>
   <Menu.Item key="settings"> Người thiết trí </Menu.Item>
   <Menu.Divider />
   <Menu.Item key="logout"> Logout </Menu.Item>
  </Menu>
 );
 return (
  <HeaderDropdown overlay={menuHeaderDropdown}>
   <Button>hover Biểu hiện ra menu </Button>
  </HeaderDropdown>
 );
};
```

## HeaderSearch Đầu lục soát khung

Một cái mang bù đắp số liệu đưa vào khung, ủng hộ thu hồi cùng triển khai Input

```tsx
*
 * background: '#f0f2f5'
 */
import HeaderSearch from '@/components/HeaderSearch';

export default  => {
 return (
  <HeaderSearch
   placeholder="Đứng ở giữa lục soát"
   defaultValue="umi ui"
   options={[
    { label: 'Ant Design Pro', value: 'Ant Design Pro' },
    {
     label: 'Ant Design',
     value: 'Ant Design',
    },
    {
     label: 'Pro Table',
     value: 'Pro Table',
    },
    {
     label: 'Pro Layout',
     value: 'Pro Layout',
    },
   ]}
   onSearch={(value) => {
    console.log('input', value);
   }}
  />
 );
};
```

### API

| Tham số | Nói rõ | Loại hình | Ngầm thừa nhận giá trị |
| --- | --- | --- | --- |
| value | Đưa vào khung giá trị | `string` | - |
| onChange | Giá trị sửa chữa sau phát động | `(value?: string) => void` | - |
| onSearch | Thẩm tra sau phát động | `(value?: string) => void` | - |
| options | Tuyển hạng menu liệt biểu | `{label,value}` | - |
| defaultVisible | Đưa vào khung ngầm thừa nhận phải chăng biểu hiện, chỉ có lần thứ nhất có hiệu lực | `boolean` | - |
| visible | Đưa vào khung phải chăng biểu hiện | `boolean` | - |
| onVisibleChange | Đưa vào khung biểu hiện ẩn tàng về công hàm thuyên chuyển công tác số | `(visible: boolean) => void` | - |

## NoticeIcon Thông tri công cụ

Thông tri công cụ cung cấp một triển lãm cá nhân bày ra nhiều loại thông tri tin tức giao diện.

```tsx
*
 * background: '#f0f2f5'
 */
import NoticeIcon from '@/components/NoticeIcon/NoticeIcon';
import { message } from 'antd';

export default  => {
 const list = [
  {
   id: '000000001',
   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
   title: 'Ngươi nhận được 14 Phần mới báo tuần',
   datetime: '2017-08-09',
   type: 'notification',
  },
  {
   id: '000000002',
   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
   title: 'Ngươi đề cử Khúc Ni Ni Đã thông qua vòng thứ ba phỏng vấn',
   datetime: '2017-08-08',
   type: 'notification',
  },
 ];
 return (
  <NoticeIcon
   count={10}
   onItemClick={(item) => {
    message.info(`${item.title} Bị điểm đánh `);
   }}
   onClear={(title: string, key: string) => message.info('Điểm kích thanh không càng nhiều')}
   loading={false}
   clearText="Thanh không"
   viewMoreText="Xem thêm"
   onViewMore={ => message.info('Điểm kích xem thêm')}
   clearClose
  >
   <NoticeIcon.Tab
    tabKey="notification"
    count={2}
    list={list}
    title="Thông tri"
    emptyText="Ngươi đã xem xét tất cả thông tri"
    showViewMore
   />
   <NoticeIcon.Tab
    tabKey="message"
    count={2}
    list={list}
    title="Tin tức"
    emptyText="Ngài đã đọc xong tất cả tin tức"
    showViewMore
   />
   <NoticeIcon.Tab
    tabKey="event"
    title="Chờ làm"
    emptyText="Ngươi đã hoàn thành tất cả chờ làm"
    count={2}
    list={list}
    showViewMore
   />
  </NoticeIcon>
 );
};
```

### API

| Tham số | Nói rõ | Loại hình | Ngầm thừa nhận giá trị |
| --- | --- | --- | --- |
| value | Đưa vào khung giá trị | `string` | - |
| onChange | Giá trị sửa chữa sau phát động | `(value?: string) => void` | - |
| onSearch | Thẩm tra sau phát động | `(value?: string) => void` | - |
| options | Tuyển hạng menu liệt biểu | `{label,value}` | - |
| defaultVisible | Đưa vào khung ngầm thừa nhận phải chăng biểu hiện, chỉ có lần thứ nhất có hiệu lực | `boolean` | - |
| visible | Đưa vào khung phải chăng biểu hiện | `boolean` | - |
| onVisibleChange | Đưa vào khung biểu hiện ẩn tàng về công hàm thuyên chuyển công tác số | `(visible: boolean) => void` | - |

## NoticeIcon Thông tri công cụ

Thông tri công cụ cung cấp một triển lãm cá nhân bày ra nhiều loại thông tri tin tức giao diện.

```tsx
*
 * background: '#f0f2f5'
 */
import NoticeIcon from '@/components/NoticeIcon/NoticeIcon';
import { message } from 'antd';

export default  => {
 const list = [
  {
   id: '000000001',
   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
   title: 'Ngươi nhận được 14 Phần mới báo tuần',
   datetime: '2017-08-09',
   type: 'notification',
  },
  {
   id: '000000002',
   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
   title: 'Ngươi đề cử Khúc Ni Ni Đã thông qua vòng thứ ba phỏng vấn',
   datetime: '2017-08-08',
   type: 'notification',
  },
 ];
 return (
  <NoticeIcon
   count={10}
   onItemClick={(item) => {
    message.info(`${item.title} Bị điểm đánh `);
   }}
   onClear={(title: string, key: string) => message.info('Điểm kích thanh không càng nhiều')}
   loading={false}
   clearText="Thanh không"
   viewMoreText="Xem thêm"
   onViewMore={ => message.info('Điểm kích xem thêm')}
   clearClose
  >
   <NoticeIcon.Tab
    tabKey="notification"
    count={2}
    list={list}
    title="Thông tri"
    emptyText="Ngươi đã xem xét tất cả thông tri"
    showViewMore
   />
   <NoticeIcon.Tab
    tabKey="message"
    count={2}
    list={list}
    title="Tin tức"
    emptyText="Ngài đã đọc xong tất cả tin tức"
    showViewMore
   />
   <NoticeIcon.Tab
    tabKey="event"
    title="Chờ làm"
    emptyText="Ngươi đã hoàn thành tất cả chờ làm"
    count={2}
    list={list}
    showViewMore
   />
  </NoticeIcon>
 );
};
```

### NoticeIcon API

| Tham số | Nói rõ | Loại hình | Ngầm thừa nhận giá trị |
| --- | --- | --- | --- |
| count | Có bao nhiêu chưa đọc thông tri | `number` | - |
| bell | Linh đang biểu đồ | `ReactNode` | - |
| onClear | Điểm kích thanh không số liệu nút bấm | `(tabName: string, tabKey: string) => void` | - |
| onItemClick | Chưa đọc tin tức liệt bị điểm kích | `(item: API.NoticeIconData, tabProps: NoticeIconTabProps) => void` | - |
| onViewMore | Xem thêm nút bấm điểm kích | `(tabProps: NoticeIconTabProps, e: MouseEvent) => void` | - |
| onTabChange | Thông tri Tab Hoán đổi | `(tabTile: string) => void;` | - |
| popupVisible | Thông tri biểu hiện phải chăng biểu hiện ra | `boolean` | - |
| onPopupVisibleChange | Thông tri tin tức biểu hiện ẩn tàng về công hàm thuyên chuyển công tác số | `(visible: boolean) => void` | - |
| clearText | Thanh không nút bấm văn tự | `string` | - |
| viewMoreText | Xem thêm nút bấm văn tự | `string` | - |
| clearClose | Biểu hiện ra thanh không nút bấm | `boolean` | - |
| emptyImage | Liệt biểu vì không lúc lật tẩy biểu hiện ra | `ReactNode` | - |

### NoticeIcon.Tab API

| Tham số | Nói rõ | Loại hình | Ngầm thừa nhận giá trị |
| --- | --- | --- | --- |
| count | Có bao nhiêu chưa đọc thông tri | `number` | - |
| title | Thông tri Tab Tiêu đề | `ReactNode` | - |
| showClear | Biểu hiện ra thanh trừ nút bấm | `boolean` | `true` |
| showViewMore | Biểu hiện ra tăng thêm càng | `boolean` | `true` |
| tabKey | Tab Duy nhất key | `string` | - |
| onClick | Tử hạng đơn kích sự kiện | `(item: API.NoticeIconData) => void` | - |
| onClear | Rõ ràng nút bấm điểm kích | `=>void` | - |
| emptyText | Vì không thời điểm khảo thí | `=>void` | - |
| viewMoreText | Xem thêm nút bấm văn tự | `string` | - |
| onViewMore | Xem thêm nút bấm điểm kích | `( e: MouseEvent) => void` | - |
| list | Thông tri tin tức liệt biểu | `API.NoticeIconData` | - |

### NoticeIconData

```tsx | pure
export type NoticeIconData {
  id: string;
  key: string;
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  read?: boolean;
  description: string;
  clickClose?: boolean;
  extra: any;
  status: string;
}
```

## RightContent

RightContent Là trở lên mấy cái bộ phận tổ hợp, đồng thời mới tăng plugins `SelectLang` Plug-in.

```tsx | pure
<Space>
 <HeaderSearch
  placeholder="Đứng ở giữa lục soát"
  defaultValue="umi ui"
  options={[
   { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
   {
    label: <a href="next.ant.design">Ant Design</a>,
    value: 'Ant Design',
   },
   {
    label: <a href="https://protable.ant.design/">Pro Table</a>,
    value: 'Pro Table',
   },
   {
    label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
    value: 'Pro Layout',
   },
  ]}
 />
 <Tooltip title="Sử dụng văn kiện">
  <span
   className={styles.action}
   onClick={ => {
    window.location.href = 'https://pro.ant.design/docs/getting-started';
   }}
  >
   <QuestionCircleOutlined />
  </span>
 </Tooltip>
 <Avatar />
 {REACT_APP_ENV && (
  <span>
   <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
  </span>
 )}
 <SelectLang className={styles.action} />
</Space>
```
