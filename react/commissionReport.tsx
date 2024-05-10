import type { DocumentNode } from 'graphql'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from 'react-apollo'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import {
  ActionMenu,
  ButtonWithIcon,
  Divider,
  IconArrowUp,
  IconCog,
  IconInfo,
  IconOptionsDots,
  IconShoppingCart,
  IconUser,
  Layout,
  Modal,
  PageBlock,
  PageHeader,
  Toggle,
} from 'vtex.styleguide'

import { Filter, Totalizer } from './components'
import TableComponent from './components/Table'
import PaginationComponent from './components/Table/pagination'
import { defaultFinalString, defaultStartString } from './constants'

const dateDefaultPicker = {
  startDatePicker: new Date(`${defaultStartString}T00:00:00`),
  finalDatePicker: new Date(`${defaultFinalString}T00:00:00`),
  defaultStartDate: defaultStartString,
  defaultFinalDate: defaultFinalString,
  today: false,
}

interface ReportProps {
  getSellersQuery: DocumentNode
  searchStatsQuery: DocumentNode
  searchSellersQuery: DocumentNode
}

const idMessage: MessageType = defineMessages({
  actions: { id: 'admin/table-actions' },
  totalComission: { id: 'admin/table-total-commission' },
  totalOrderValue: { id: 'admin/table-total-amount' },
  ordersCount: { id: 'admin/table-total-order' },
  name: { id: 'admin/table-seller-name' },
})

const CommissionReport: FC<ReportProps> = (props) => {
  const { getSellersQuery, searchStatsQuery, searchSellersQuery } = props
  const intl = useIntl()

  const { navigate } = useRuntime()
  const [optionsSelect, setOptionsSelect] = useState<SellerSelect[]>([])
  const [startDate, setStartDate] = useState('')
  const [finalDate, setFinalDate] = useState('')
  const [sellersId, setSellersId] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [itemFrom, setItemFrom] = useState(1)
  const [itemTo, setItemTo] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [totalAmount, setTotalAmout] = useState(0)
  const [totalCommission, setTotalCommission] = useState(0)
  const [totalOrder, setTotalOrder] = useState(0)
  const [orderSort, setOrderSort] = useState('totalComission DSC')
  const [totalItemsFilter, setTotalItemsFilter] = useState(0)
  const [statsTotalizer, setStatsTotalizer] = useState<StatsTotalizer[]>([
    {
      label: '',
      value: '',
      iconBackgroundColor: '',
    },
  ])

  const columnModal: JSX.Element[] = []
  const [hideColumns, setHideColumn] = useState<string[]>([])
  const [modalColumns, setModalColumns] = useState(false)

  const [sellersDashboard, setSellersDashboard] = useState<DataSeller[]>([])

  const { data: dataSellers } = useQuery(getSellersQuery, {
    ssr: false,
    pollInterval: 0,
  })

  const [stats, { data: dataStats, loading: loadingStats }] = useLazyQuery(
    searchStatsQuery,
    {
      ssr: false,
      pollInterval: 0,
      variables: {
        params: {
          dateStart: startDate,
          dateEnd: finalDate,
        },
      },
    }
  )

  const [dashboard, { data: dataDashboard, loading: loadingDataDashboard }] =
    useLazyQuery(searchSellersQuery, {
      ssr: false,
      pollInterval: 0,
      variables: {
        param: {
          dateStart: startDate,
          dateEnd: finalDate,
          page,
          pageSize,
          sellersId,
          sort: orderSort,
        },
      },
    })

  // id name ordersCount totalComission totalOrderValue

  const hideShowColumns = (e: string) => {
    const temp = [...hideColumns]

    if (temp.find((id) => id === e)) {
      temp.splice(temp.indexOf(e), 1)
    } else {
      temp.push(e)
    }

    setHideColumn(temp)
  }

  const schemaTable = [
    {
      id: 'name',
      title: <FormattedMessage id="admin/table-seller-name" />,
      // eslint-disable-next-line react/display-name
      cellRenderer: (cellProps: CellRendererProps) => {
        return <span>{cellProps.data}</span>
      },
      sortable: true,
    },
    {
      id: 'ordersCount',
      title: <FormattedMessage id="admin/table-total-order" />,
      sortable: true,
    },
    {
      id: 'totalOrderValue',
      title: <FormattedMessage id="admin/table-total-amount" />,
      sortable: true,
    },
    {
      id: 'totalComission',
      title: <FormattedMessage id="admin/table-total-commission" />,
      sortable: true,
    },
    {
      id: 'name',
      title: <FormattedMessage id="admin/table-actions" />,
      // eslint-disable-next-line react/display-name
      cellRenderer: (cellProps: CellRendererProps) => {
        return (
          <ActionMenu
            buttonProps={{
              variation: 'tertiary',
              icon: <IconOptionsDots />,
            }}
            options={[
              {
                label: 'Detail',
                onClick: () => {
                  navigate({
                    to: `/admin/app/commission-report/detail?sellerName=${cellProps.data}&status=invoiced`,
                  })
                },
              },
            ]}
          />
        )
      },
    },
  ]

  useEffect(() => {
    dashboard()
    // eslint-disable-next-line vtex/prefer-early-return
    if (dataDashboard) {
      if (sellersId) {
        setTotalCommission(
          dataDashboard.searchSellersDashboard.statistics.totalComission
        )
        setTotalAmout(
          dataDashboard.searchSellersDashboard.statistics.totalOrderValue
        )
        setTotalOrder(
          dataDashboard.searchSellersDashboard.statistics.ordersCount
        )
      } else {
        setTotalCommission(0)
        setTotalAmout(0)
        setTotalOrder(0)
      }

      if (!dataDashboard.searchSellersDashboard.sellers.length) {
        setTotalItems(0)
      } else {
        const total = dataSellers ? dataSellers.getSellers.sellers.length : 0

        setTotalItems(total)
      }

      const dataTableDashboard: DataSeller[] = []

      setPage(dataDashboard.searchSellersDashboard.pagination.currentPage)
      dataDashboard.searchSellersDashboard.sellers.forEach(
        (item: DataDashboardSeller) => {
          dataTableDashboard.push({
            id: item.id,
            name: item.name,
            ordersCount: item.statistics.ordersCount.toString(),
            totalComission: item.statistics.totalComission.toFixed(2),
            totalOrderValue: item.statistics.totalOrderValue.toFixed(2),
          })
        }
      )
      setSellersDashboard(dataTableDashboard)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard, dataDashboard])

  useEffect(() => {
    stats()
    // eslint-disable-next-line vtex/prefer-early-return
    if (dataStats) {
      let valueSellersStats = 0
      const getStatistics = dataStats.searchStatisticsDashboard.statistics
      let totalStats = 0

      if (dataDashboard) {
        valueSellersStats = dataDashboard.searchSellersDashboard.sellers.length
        totalStats =
          valueSellersStats <= 0
            ? 0
            : totalItemsFilter > 0
            ? totalItemsFilter
            : totalItems

        if (
          getStatistics.ordersCount === 0 &&
          getStatistics.totalComission === 0 &&
          getStatistics.totalOrderValue === 0
        ) {
          setSellersDashboard([])
          setTotalItems(0)
          // setOptionsSelect([])
        }
      }

      // TODO: Change labels to FormattedText components
      setStatsTotalizer([
        {
          label: 'Number of Sellers',
          value: totalStats,
          iconBackgroundColor: '#EAFCE3',
          icon: <IconUser color="#79B03A" size={18} />,
        },
        {
          label: 'Total Orders',
          value: sellersId
            ? totalOrder
            : dataStats.searchStatisticsDashboard.statistics.ordersCount,
          iconBackgroundColor: '#CCE8FF',
          icon: <IconShoppingCart color="#368DF7" size={18} />,
        },
        {
          label: 'Total Amount Orders',
          value: sellersId
            ? `$${totalAmount}`
            : `$${dataStats.searchStatisticsDashboard.statistics.totalOrderValue
                .toFixed(2)
                .toString()}`,
          iconBackgroundColor: '#FFDCF8',
          icon: <IconArrowUp color="#F67CC7" size={14} />,
        },
        {
          label: 'Total Commission',
          value: sellersId
            ? `$${totalCommission}`
            : `$${dataStats.searchStatisticsDashboard.statistics.totalComission
                .toFixed(2)
                .toString()}`,
          iconBackgroundColor: '#FFF0EC',
          icon: <IconInfo color="#F7634A" size={14} />,
        },
      ])
    }
  }, [
    dataDashboard,
    dataStats,
    sellersId,
    stats,
    totalAmount,
    totalCommission,
    totalItems,
    totalItemsFilter,
    totalOrder,
    setOptionsSelect,
  ])

  const formatDate = (valueDate: number) => {
    const validateDate = valueDate <= 9 ? `0${valueDate}` : valueDate

    return validateDate
  }

  useEffect(() => {
    const defaultDate = new Date()
    let defaultStart: Date = new Date()
    const defaultfinal = new Date(
      defaultDate.getFullYear(),
      defaultDate.getMonth(),
      defaultDate.getDate() - 1
    )

    const defaultFinalString = `${defaultfinal.getFullYear()}-${formatDate(
      defaultfinal.getMonth() + 1
    )}-${formatDate(defaultfinal.getDate())}`

    if (defaultDate.getDate() <= 1) {
      defaultStart = new Date(
        defaultDate.getFullYear(),
        defaultDate.getMonth() - 1,
        1
      )
    } else {
      defaultStart = new Date(
        defaultDate.getFullYear(),
        defaultDate.getMonth(),
        1
      )
    }

    const defaultStartString = `${defaultStart.getFullYear()}-${formatDate(
      defaultStart.getMonth() + 1
    )}-${formatDate(defaultStart.getDate())}`

    setStartDate(defaultStartString)
    setFinalDate(defaultFinalString)

    // eslint-disable-next-line vtex/prefer-early-return
    if (dataSellers) {
      const builtSelectSeller: SellerSelect[] = []

      dataSellers.getSellers?.sellers.forEach((seller: DataSellerSelect) => {
        builtSelectSeller.push({
          value: { id: seller.id, name: seller.name },
          label: seller.name,
        })
      })
      setOptionsSelect(builtSelectSeller)
      setTotalItems(dataSellers.getSellers.sellers.length)
    }
  }, [dataSellers])

  const onNextClick = () => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const nextPage = page + 1

    const currentTo = pageSize * nextPage
    const currentFrom = itemTo + 1

    setItemTo(currentTo)
    setItemFrom(currentFrom)
    setPage(nextPage)
  }

  const changeRows = (row: number) => {
    setPageSize(row)
    setItemTo(row)
    setItemFrom(1)
    setPage(1)
  }

  const onPrevClick = () => {
    const previousPage = page - 1

    const currentTo = itemTo - pageSize
    const currentFrom = itemFrom - pageSize

    setItemTo(currentTo)
    setItemFrom(currentFrom)
    setPage(previousPage)
  }

  const sorting = (dataSorting: SortObj) => {
    setOrderSort(`${dataSorting.by} ${dataSorting.order}`)
  }

  const filterDates = (start: string, final: string) => {
    setStartDate(start)
    setFinalDate(final)
  }

  return (
    <Layout
      pageHeader={
        <PageHeader title={<FormattedMessage id="admin/navigation.title" />} />
      }
    >
      <div className="w-100 flex justify-end">
        <ButtonWithIcon
          icon={<IconCog color="blue" />}
          variation="tertiary"
          onClick={() => setModalColumns(true)}
        />
      </div>
      {modalColumns && (
        <Modal
          centered
          isOpen={modalColumns}
          onClose={() => setModalColumns(false)}
        >
          <p>Choose the columns to display</p>
          <Divider orientation="horizontal" />
          {schemaTable.forEach((itemColum) => {
            const validateCheck =
              hideColumns.find((item) => item === itemColum.id) || false

            const key = itemColum.id

            columnModal.push(
              <div className="mt3">
                <Toggle
                  id={itemColum.id}
                  label={intl.formatMessage(idMessage[key])}
                  checked={validateCheck}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    hideShowColumns(e.target.id)
                  }}
                />
                <div className="mt3">
                  <Divider orientation="horizontal" />
                </div>
              </div>
            )
          })}
          {columnModal}
        </Modal>
      )}
      {startDate && finalDate && (
        <div className="mt2">
          <PageBlock>
            <div className="mt4">
              <Filter
                defaultDate={dateDefaultPicker}
                optionsSelect={optionsSelect}
                setSellerId={setSellersId}
                multiValue
                filterDates={filterDates}
                setTotalItems={setTotalItemsFilter}
              />
            </div>
          </PageBlock>
        </div>
      )}
      <div className="mt2">
        <PageBlock>
          <div className="mt4 mb5">
            <Totalizer item={statsTotalizer} loading={loadingStats} />
          </div>
        </PageBlock>
      </div>
      <div className="mt2">
        <PageBlock>
          <div>
            <TableComponent
              schemaTable={schemaTable}
              items={sellersDashboard}
              loading={loadingDataDashboard}
              sorting={sorting}
              hiddenColumn={hideColumns}
            />
            <PaginationComponent
              setPageSize={setPageSize}
              currentPage={itemFrom}
              pageSize={itemTo}
              setPage={setPage}
              totalItems={totalItemsFilter > 0 ? totalItemsFilter : totalItems}
              onNextClick={onNextClick}
              changeRows={changeRows}
              onPrevClick={onPrevClick}
            />
          </div>
        </PageBlock>
      </div>
    </Layout>
  )
}

export default CommissionReport
