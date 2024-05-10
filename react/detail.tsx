/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/display-name */
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Divider,
  Layout,
  Modal,
  PageBlock,
  PageHeader,
  Tab,
  Tabs,
} from 'vtex.styleguide'

import { Filter } from './components'
import PayoutReport from './components/PayoutReport'
import SellerInvoices from './components/SellerInvoices'
import { defaultFinalString, defaultStartString } from './constants'

const dateDefaultPicker = {
  startDatePicker: new Date(`${defaultStartString}T00:00:00`),
  finalDatePicker: new Date(`${defaultFinalString}T00:00:00`),
  defaultStartDate: defaultStartString,
  defaultFinalDate: defaultFinalString,
}

const CommissionReportDetail: FC<DetailProps> = (props) => {
  const { account, dataSellers, invoicesQuery, payoutReportsQuery } = props

  const [startDate, setStartDate] = useState('')
  const [finalDate, setFinalDate] = useState('')
  const [optionsSelect, setOptionsSelect] = useState<SellerSelect[]>([])
  const [sellerName, setSellerName] = useState(account ?? '')
  const [sellerId, setSellerId] = useState('')
  const [tabs, setTabs] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [dateRate] = useState<dateRateType[]>([])
  const [tableInvoices, setTableInvoices] = useState<Invoice[]>([])
  const [tablePayouts, setTablePayouts] = useState<any[]>([])
  const [today, setToday] = useState(true)
  const isSeller = Boolean(account)

  const formatDate = (valueDate: number) => {
    const validateDate = valueDate <= 9 ? `0${valueDate}` : valueDate

    return validateDate
  }

  useEffect(() => {
    // eslint-disable-next-line vtex/prefer-early-return
    if (dataSellers) {
      const builtSelectSeller: SellerSelect[] = []

      dataSellers.getSellers.sellers.forEach((seller: DataSellerSelect) => {
        builtSelectSeller.push({
          value: { id: seller.id, name: seller.name },
          label: seller.name,
        })
      })
      setOptionsSelect(builtSelectSeller)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSellers])

  useEffect(() => {
    const defaultDate = new Date()
    let defaultStart: Date = new Date()
    const defaultfinal = new Date(
      defaultDate.getFullYear(),
      defaultDate.getMonth(),
      defaultDate.getDate()
    )

    const defaultFinalString = `${defaultfinal.getFullYear()}-${formatDate(
      defaultfinal.getMonth() + 1
    )}-${formatDate(defaultfinal.getDate())}`

    if (defaultDate.getDate() <= 1) {
      defaultStart = defaultfinal
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
  }, [])

  const filterDates = (start: string, final: string) => {
    setStartDate(start)
    setFinalDate(final)
  }

  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin/navigation.detail-title" />}
        />
      }
    >
      <Modal
        centered
        isOpen={openModal}
        onClose={() => setOpenModal(!openModal)}
      >
        <div className="mb3">
          {dateRate.map((elmRate: dateRateType) => (
            <div key="elmRate">
              <h2>Item ID: #{elmRate.itemId}</h2>
              <p>
                <b>Name Item: </b> {elmRate.nameItem}
              </p>
              <p>
                <b>Freight Commission Percentage: </b>
                {elmRate.rate.freightCommissionPercentage}%
              </p>
              <p>
                <b>Producto Commission Percentage: </b>
                {elmRate.rate.productCommissionPercentage}%
              </p>
              <Divider />
            </div>
          ))}
        </div>
      </Modal>
      <div className="mt4 mb7">
        {startDate && finalDate && (
          <div className="mt2">
            <PageBlock>
              <Filter
                defaultDate={{ ...dateDefaultPicker, today }}
                optionsSelect={optionsSelect}
                filterDates={filterDates}
                setSellerId={setSellerName}
                setId={setSellerId}
                multiValue={false}
                disableSelect={isSeller}
              />
            </PageBlock>
          </div>
        )}
      </div>
      <div className="mt7">
        <Tabs fullWidth>
          <Tab
            label={<FormattedMessage id="admin/table.title-tab-invoices" />}
            active={tabs === 1}
            onClick={() => {
              setTabs(1)
              setToday(true)
            }}
          >
            <div className="mt5">
              <SellerInvoices
                invoicesQuery={invoicesQuery}
                account={account}
                sellerName={sellerName}
                sellerId={sellerId}
                startDate={startDate}
                finalDate={finalDate}
                dataTableInvoice={tableInvoices}
                setDataTableInvoice={setTableInvoices}
              />
            </div>
          </Tab>
          <Tab
            label={<FormattedMessage id="admin/table.title-tab-payout" />}
            active={tabs === 2}
            onClick={() => {
              setTabs(2)
              setToday(true)
            }}
          >
            <div className="mt5">
              <PayoutReport
                payoutReportsQuery={payoutReportsQuery}
                account={account}
                sellerName={sellerName}
                sellerId={sellerId}
                startDate={startDate}
                finalDate={finalDate}
                dataTableInvoice={tablePayouts}
                setDataTableInvoice={setTablePayouts}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    </Layout>
  )
}

export default CommissionReportDetail
