import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import {
  ButtonWithIcon,
  IconVisibilityOff,
  PageBlock,
  Tag,
} from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'
import type { DocumentNode } from 'graphql'

import { status } from '../../constants'
import ModalConfirm from '../ModalConfirm'
import TableComponent from '../Table'
import PaginationComponent from '../Table/pagination'

interface DetailProps {
  account?: string
  ordersQuery: DocumentNode
  invoiceMutation: DocumentNode
  settingsQuery: DocumentNode
  sellerName?: string
  startDate?: string
  finalDate?: string
  statusOrders?: string
  setDataRate: (data: dateRateType[]) => void
  sellerId?: string
  setOpenModal?: (open: boolean) => void
  openModal?: boolean
  dataTableOrders: TableOrdersType[]
  setDataTableOrders: (data: TableOrdersType[]) => void
  validRange: boolean
}

const SellerOrders: FC<DetailProps> = ({
  account,
  sellerName,
  ordersQuery,
  settingsQuery,
  startDate,
  finalDate,
  statusOrders,
  setDataRate,
  sellerId,
  invoiceMutation,
  setOpenModal,
  openModal,
  dataTableOrders,
  setDataTableOrders,
  validRange,
}) => {
  const { query } = useRuntime()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [itemFrom, setItemFrom] = useState(1)
  const [itemTo, setItemTo] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [integration, setIntegration] = useState('')

  const { data: settings } = useQuery(settingsQuery, {
    ssr: false,
    pollInterval: 0,
  })

  useEffect(() => {
    if (settings) {
      setIntegration(settings.getSettings.integration)
    }
  }, [settings])

  const { data: dataOrders, loading: loadingDataOrders } = useQuery(
    ordersQuery,
    {
      ssr: false,
      pollInterval: 0,
      variables: {
        searchOrdersParams: {
          dateStart: startDate,
          dateEnd: finalDate,
          sellerName,
          page,
          perpage: pageSize,
          status: statusOrders,
        },
      },
    }
  )

  const IDCell = (props: CellRendererProps) => {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a
        href={`admin/checkout/#/orders/${props.data}`}
        style={{ color: '#0C389F' }}
        target="_blank"
        rel="noreferrer"
      >
        {props.data}
      </a>
    )
  }

  const TotalOrderCell = (props: CellRendererProps) => {
    return <span>${props.data}</span>
  }

  const TotalCommissionCell = (props: CellRendererProps) => {
    return <span>${props.data}</span>
  }

  const RateCell = (props: any) => {
    return (
      <div>
        <ButtonWithIcon
          icon={<IconVisibilityOff />}
          variation="tertiary"
          onClick={() => {
            if (setOpenModal) setOpenModal(!openModal)
            setDataRate(props.data)
          }}
        />
      </div>
    )
  }

  const StatusCell = (props: any) => {
    return (
      <Tag bgColor={props.data.bgColor} color={props.data.fontColor}>
        {props.data.status}
      </Tag>
    )
  }

  const schemaTable = [
    {
      id: 'id',
      title: <FormattedMessage id="admin/table-seller-order" />,
      cellRenderer: IDCell,
    },
    {
      id: 'creationDate',
      title: <FormattedMessage id="admin/table-creation-order" />,
    },
    {
      id: 'totalOrder',
      title: <FormattedMessage id="admin/table-total-order" />,
      cellRenderer: TotalOrderCell,
    },
    {
      id: 'totalCommission',
      title: <FormattedMessage id="admin/table-commission-order" />,
      cellRenderer: TotalCommissionCell,
    },
    {
      id: 'rate',
      title: <FormattedMessage id="admin/table-rate-order" />,
      cellRenderer: RateCell,
    },
    {
      id: 'status',
      title: <FormattedMessage id="admin/table-seller-status" />,
      cellRenderer: StatusCell,
    },
  ]

  const changeRows = (row: number) => {
    setPageSize(row)
    setItemTo(row)
    setItemFrom(1)
    setPage(1)
  }

  const onNextClick = () => {
    const nextPage = page + 1

    const currentTo = pageSize * nextPage
    const currentFrom = itemTo + 1

    setItemTo(currentTo)
    setItemFrom(currentFrom)
    setPage(nextPage)
  }

  const onPrevClick = () => {
    const previousPage = page - 1

    const currentTo = itemTo - pageSize
    const currentFrom = itemFrom - pageSize

    setItemTo(currentTo)
    setItemFrom(currentFrom)
    setPage(previousPage)
  }

  useEffect(() => {
    if (sellerName === '' && !query?.sellerName) {
      setDataTableOrders([])
      setTotalItems(0)
    }
  }, [query, sellerName, setDataTableOrders])

  useEffect(() => {
    if (dataOrders) {
      const dataTable: TableOrdersType[] = []

      dataOrders.orders.data.forEach((item: TableDataOrder) => {
        const keyColor = Object.keys(status).find(
          (itemStatus: string) => itemStatus === item.status
        )

        dataTable.push({
          id: account ? item.sellerOrderId : item.orderId,
          creationDate: item.creationDate.substring(
            0,
            item.creationDate.indexOf('T')
          ),
          totalOrder: item.totalOrderValue,
          totalCommission: item.totalComission,
          rate: item.rate,
          status: {
            status: item.status,
            bgColor: keyColor ? status[keyColor].bgColor : '',
            fontColor: keyColor ? status[keyColor].fontColor : '',
          },
        })
      })
      if (sellerName === '') setDataTableOrders([])
      else setDataTableOrders(dataTable)
      setTotalItems(dataOrders.orders.paging.total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataOrders, sellerName])

  return (
    <PageBlock>
      <ModalConfirm
        settingsQuery={settingsQuery}
        integration={integration}
        invoiceMutation={invoiceMutation}
        disabled={
          !(
            statusOrders === 'invoiced' &&
            dataOrders?.orders.data.length &&
            validRange
          )
        }
        buttonMessage={
          <FormattedMessage id="admin/form-settings.button-invoice" />
        }
        messages={{
          warning: <FormattedMessage id="admin/modal-setting.warning" />,
          noEmailWarning: (
            <FormattedMessage id="admin/modal-setting.noEmailWarning" />
          ),
          confirmation: (
            <FormattedMessage id="admin/modal-setting.confirmation" />
          ),
        }}
        sellerData={{
          startDate: startDate ?? '',
          finalDate: finalDate ?? '',
          sellerName: sellerName ?? '',
          id: sellerId ?? '',
        }}
      />
      <div className="mt2">
        <TableComponent
          schemaTable={schemaTable}
          items={dataTableOrders}
          loading={loadingDataOrders}
        />
        <PaginationComponent
          setPageSize={setPageSize}
          currentPage={itemFrom}
          pageSize={itemTo}
          setPage={setPage}
          totalItems={totalItems}
          onNextClick={onNextClick}
          changeRows={changeRows}
          onPrevClick={onPrevClick}
        />
      </div>
    </PageBlock>
  )
}

export default SellerOrders
