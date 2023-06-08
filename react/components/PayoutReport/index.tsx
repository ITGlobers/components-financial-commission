/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-key */
import type { DocumentNode } from 'graphql'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { PageBlock } from 'vtex.styleguide'

import TableComponent from '../Table'
import PaginationComponent from '../Table/pagination'

interface DetailProps {
  payoutReportsQuery: DocumentNode
  account?: string
  sellerName?: string
  startDate?: string
  finalDate?: string
  dataTableInvoice: Invoice[]
  settingsQuery: DocumentNode
  // jsonData: any
  setDataTableInvoice: (data: Invoice[]) => void
}

const PayoutReport: FC<DetailProps> = ({
  sellerName,
  payoutReportsQuery,
  // startDate,
  // finalDate,
  dataTableInvoice,
  settingsQuery,
  setDataTableInvoice,
}) => {
  const { query } = useRuntime()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [itemFrom, setItemFrom] = useState(1)
  const [itemTo, setItemTo] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [showStatus, setShowStatus] = useState(true)

  const { data: settings } = useQuery(settingsQuery, {
    ssr: false,
    pollInterval: 0,
  })

  const { data: dataPayouts } = useQuery(payoutReportsQuery, {
    ssr: false,
    pollInterval: 0,
  })

  useEffect(() => {
    if (settings) {
      setShowStatus(settings.getSettings.showStatus)
    }
  }, [settings])

  useEffect(() => {
    if (sellerName === '' && !query?.sellerName) {
      setDataTableInvoice([])
      setTotalItems(0)
    }
  }, [query, sellerName, setDataTableInvoice])

  useEffect(() => {
    if (dataPayouts) {
      setDataTableInvoice(dataPayouts.searchPayoutReport.data)
      setTotalItems(dataPayouts.searchPayoutReport.paging.total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPayouts, sellerName])

  const schemaTableInvoice = [
    {
      id: 'id',
      title: <FormattedMessage id="admin/table-seller-invoice" />,
    },
    {
      id: 'paymentMethod',
      title: <FormattedMessage id="admin/table-seller-created" />,
    },
    {
      id: 'grossDebit',
      title: <FormattedMessage id="admin/table-seller-status" />,
    },
  ]

  !showStatus && schemaTableInvoice.splice(2, 1)

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

  return (
    <PageBlock>
      <div>
        <TableComponent
          schemaTable={schemaTableInvoice}
          items={dataTableInvoice}
          loading={false}
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

export default PayoutReport
