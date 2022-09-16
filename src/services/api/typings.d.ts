declare namespace API {
  type BaseBodyResDPW = {
    responseCode?: string;
    status: 'OK' | 'FAILE';
    dataRes?: Record<string, any> | null | undefined | any;
  };
  type BaseReponseDatapowerSB = {
    body?: BaseBodyResDPW & Record<string, any>;
    error?: {
      code?: string;
      desc?: string;
    };
    header: Record<string, any>;
  };

  type LoginReqParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
  };

  interface LoginRes extends BaseReponseDatapowerSB {}

  type AccountInfo = {
    usrUsername: string;
    usrFullName: string;
    usrEmail: string;
    usrUid: string;
  };

  type GetListReqBase = {
    sortinfInfo: {
      column?: string;
      direction?: string;
    };
    paginatorInfo: {
      page: number;
      pageSize: number;
    };
  };

  type CreateUserReqParams = {
    usrUsername: string;
    usrFirstName: string;
    usrLastName: string;
    usrEmail: string;
    usrPosition?: string;
    usrPhone?: string;
    depUId?: string;
    grpUid: string;
    usrRole: string;
    usrJob: string;
    typeBusiness: string;
    usrStatus: 'ACTIVE' | 'INACTIVE';
  };

  type UpdateUserReqParams = {
    usrUsername: string;
    usrFirstName: string;
    usrLastName: string;
    usrEmail: string;
    usrPosition?: string;
    usrPhone?: string;
    depUId?: string;
    grpUid: string;
    usrRole: string;
    usrJob: string;
    usrUid: string;
    typeBusiness: string;
    usrStatus: 'ACTIVE' | 'INACTIVE';
  };

  //Ticket

  type QuickFeedbackTicket = {
    ticketIds: string[];
    emailCcProcess: string;
    ftContent: string;
    typeBusiness: string;
  };

  type ChangeTypeBusinessTicket = {
    ticketIds: string[];
    typeBusiness: string;
  };

  type SaveListTicketReq = {
    ticketIds: string[];
    nextTasUid: string;
    note?: string;
  };

  interface GetMyTicketReqParams extends GetListReqBase {
    filterInfo: {
      searchValue?: string;
      status?: string;
      fromDate?: string;
      toDate?: string;
      channel?: string;
      typeTransaction?: string;
      typeBusiness?: string;
      bank?: string;
    };
  }

  type ProTableRequest = {
    params: U & {
      pageSize?: number;
      current?: number;
      keyword?: string;
    };
    sort: Record<string, SortOrder>;
    filters: Record<string, React.ReactText[] | null>;
  };

  // Email Template

  type EmailTemplteModel = {
    code: string;
    title: string;
    description: string;
    content: string;
    status: 'Y' | 'N';
  };

  type SaveTicket = {
    ticketInfo: {
      ticketId: string;
      tasUid: string;
      caseId: string;
      typeBusiness: string;
      ticketTitle?: string;
      customerId?: string;
      lcc?: string;
      customerName?: string;
      fm?: string;
      customerAccount?: string;
      ft?: string;
      amount?: string;
      ftRelated?: string;
      channel?: string;
      bank?: string;
      trace?: string;
      lccGbc?: string;
      transDate?: string;
      typeTransaction?: string;
      contentRequest?: string;
      userJob?: string;
      userIpPhone?: string;
      userPhone?: string;
      userEmailCc?: string;
      paymentChannel?: string;
    };
    fileUpload?: {
      name: string;
      fileName: string;
      docUrl: string;
      docID: string;
      version: string;
      fileSize: string;
      fileType: string;
      type: string;
      createdBy: string;
      createdDate: string;
      categoryID: string;
    }[];
  };

  // Master Data

  type CreateMasterData = {
    type: string;
    code: any;
    name: string;
    defaultValue?: any;
    description?: string;
    masterId?: number;
  };

  //

  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  //

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type GetChartTicketReq = {
    fromDate?: string;
    toDate?: string;
    status?: string;
    typeBusiness?: string;
    userProcess?: string;
  };

  type CreateCoreGroupPermission = Array<{
    tasUid: string;
    actionCode: string;
    grpUid: string;
    perUid: string;
  }>;

  type UpdateCoreGroup = {
    grpTitle: string;
    grpName: string;
    grpStatus: 'Y' | 'N';
    grpCode: string;
    grpUid: string;
  };

  type CreateSla = {
    id: string;
    code: string;
    timeCloseSla: number;
    typeBusiness: string;
    timeSla: string;
    status: 'ACTIVE' | 'INACTIVE';
  };
}
