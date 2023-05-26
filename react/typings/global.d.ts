declare module 'vtex.render-runtime'
interface Invoice {
  comment?: string
  invoiceCreateDate?: string
  orders?: [Order]
  seller?: Seller
  status?: string
  totalizers?: Totalizers
  jsonData?: any
}
interface Order {
  orderId: string
  sellerOrderId: string
  totalComission: number
  totalOrderRate: number
  totalOrderValue: number
}
interface DateFilter {
  startDateFilter: Date
  finalDateFilter: Date
  dataFilter: SellerSelect[]
  statusFilter: SellerSelect[]
}
interface CellRendererProps {
  data: string
  density: string
  motion: {
    transaction: string
    willChange: string
  }
  rowHeight: number
}
interface DataSellerSelect {
  account: string
  freightCommissionPercentage: number
  id: string
  isActive: boolean
  name: string
  productCommissionPercentage: number
}
interface ModalConfirmData {
  buttonMessage: any
  messages: MessagesData
  sellerData: SellerData
  invoiceMutation: any
  disabled: boolean
  integration?: string
  settingsQuery?: DocumentNode
}
interface MessagesData {
  confirmation: any
  warning: any
  noEmailWarning: any
}
interface SellerData {
  startDate: string
  finalDate: string
  sellerName: string
  id: string
}
interface TableData {
  items: any
  schemaTable: SchemaTable[]
  loading: boolean
  sorting?: any
  hiddenColumn?: string[]
}
interface SchemaTable {
  id: string
  title: JSX.Element
  cellRenderer?: (props: CellRendererProps) => void
}
interface CellRendererProps {
  data: string
  density: string
  motion: {
    transaction: string
    willChange: string
  }
  rowHeight: number
}
interface FilterProps {
  defaultDate?: {
    startDatePicker: Date
    finalDatePicker: Date
    defaultStartDate: string
    defaultFinalDate: string
    today: boolean
  }
  optionsSelect: SellerSelect[]
  filterDates?: (v: string, x: string) => void
  setTotalItems?: (v: number) => void
  setPages?: (v: number) => void
  setSellerId: (v: string) => void
  setId?: (v: string) => void
  multiValue: boolean
  optionsStatus?: SellerSelect[]
  setStatusOrders?: (v: string) => void
  disableSelect?: boolean
}
interface StatsTotalizer {
  label: any
  value: any
  iconBackgroundColor?: string
  icon?: any
}
interface DataSeller {
  id: string
  name: string
  ordersCount: string
  totalComission: string
  totalOrderValue: string
}
interface DataDashboardSeller {
  account: string
  id: string
  name: string
  statistics: DataStatistics
}
interface SellerSelect {
  label: string
  value: {
    id: string
    name: string
  }
}
interface SelectProps {
  options: SellerSelect[]
  dataFilter: SellerSelect[]
  setDataFilter: (v: SellerSelect[]) => void
  multi: boolean
  customLabel: any
}
interface DatepickerProps {
  startDatePicker: Date
  finalDatePicker: Date
  changeDate: (date: Date, type: string) => void
  today: boolean
}
interface PaginationProps {
  setPageSize: (v: number) => void
  currentPage: number
  pageSize: number
  setPage: (v: number) => void
  totalItems: number
  onNextClick: () => void
  changeRows: (row: number) => void
  onPrevClick: () => void
}
interface SettingsSellers {
  id: string
  name: string
}
interface DataSeller {
  id: string
  name: string
  ordersCount: string
  totalComission: string
  totalOrderValue: string
}
interface Pagination {
  currentPage: number
  pageSize: number
  totalPage: number
}
interface DetailProps {
  account?: string
  dataSellers?: {
    getSellers: {
      pagination: Pagination
      sellers: [DataSellerSelect]
    }
  }
  ordersQuery: DocumentNode
  invoiceMutation: DocumentNode
  invoicesQuery: DocumentNode
  settingsQuery?: DocumentNode
}

type SellerSettingsToken = Partial<TokenConfiguration>
interface MessageType {
  [key: string]: { id: string }
}
interface rateType {
  freightCommissionPercentage: number
  productCommissionPercentage: number
}
interface dateRateType {
  itemId: string
  nameItem: string
  rate: rateType
}
interface StatusType {
  status: string
  bgColor: string
  fontColor: string
}
interface TableOrdersType {
  creationDate: string
  id: string
  rate: [rateType]
  status: StatusType
  totalCommission: number
  totalOrder: number
}

interface TableDataOrder {
  creationDate: string
  marketplaceOrderId: string | null
  orderId: string
  rate: [rateType]
  sellerOrderId: string
  status: string
  statusDescription: string
  totalComission: number
  totalOrderValue: number
}
interface SortObj {
  by: string
  order: string
}
interface SelectObj {
  value: number
  label: string
}
interface SettingInfoType {
  idbilling: string
  start: string
  end: string
}
interface responseToken {
  getToken: {
    autheticationToken: string
    enabled: boolean
    name: string
  }
}
interface TokenAuthProps {
  activateToogle: boolean
  sellerId: string
  editToken: DocumentNode
  createTokenMutation: DocumentNode
  tokenSeller: responseToken
}
interface DataActions {
  id: string
  name: string
}

interface ResponseFilter {
  stringId: string
  sellerFilter: string
  countTotalItems: number
  sellerId: string
}
