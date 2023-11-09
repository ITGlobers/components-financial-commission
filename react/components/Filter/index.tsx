import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import {
  ButtonWithIcon,
  IconFilter,
  IconDelete,
  ButtonGroup,
} from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'

import { SelectComponent, DatePickerComponent } from './itemsFilter'
import {
  getDateString,
  firstDay,
  yesterday,
  today,
  filterEmptyObj,
  filterSellerValues,
} from '../../utils/calculateDate'

const Filter: FC<FilterProps> = (props) => {
  const { query, setQuery } = useRuntime()
  const [dataFilter, setDataFilter] = useState<DateFilter>({
    startDateFilter: firstDay,
    finalDateFilter: props.defaultDate?.today ? today : yesterday,
    dataFilter: [],
    statusFilter: [],
  })

  useEffect(() => {
    if (props.optionsSelect.length > 0) {
      let filterQuery = []
      let filterQueryStatus = []

      if (query.sellerName) {
        const separateString = query.sellerName.split(',')

        filterQuery = separateString.map((seller: any) =>
          props.optionsSelect.find((nameQuery) => nameQuery.label === seller)
        )
      }

      if (query.status && props.optionsStatus) {
        const separateString = query.status.split(',')

        filterQueryStatus = separateString.map((seller: any) =>
          props.optionsStatus?.find((nameQuery) => nameQuery.label === seller)
        )
      }

      setDataFilter({
        ...dataFilter,
        statusFilter: filterQueryStatus,
        dataFilter: filterQuery,
      })
      changesValuesTable(filterQuery, filterQueryStatus)
    }
  }, [props.optionsSelect])

  const changesValuesTable = (
    dataFilterValues?: SellerSelect[],
    dataFilterStatus?: SellerSelect[]
  ) => {
    let response: ResponseFilter = {
      stringId: '',
      sellerFilter: '',
      countTotalItems: 0,
      sellerId: '',
    }

    let stringStatus = ''

    if (dataFilterValues?.length) {
      response = filterSellerValues(dataFilterValues, !!props.setStatusOrders)
    } else {
      response = filterSellerValues(
        dataFilter.dataFilter,
        !!props.setStatusOrders
      )
    }

    if (dataFilterStatus?.length) {
      dataFilterStatus.forEach((status) => {
        stringStatus += `${status.label},`
      })
    } else {
      dataFilter.statusFilter.forEach((status) => {
        stringStatus += `${status.label},`
      })
    }

    props.filterDates &&
      props.filterDates(
        getDateString(dataFilter.startDateFilter),
        getDateString(dataFilter.finalDateFilter)
      )

    props.setSellerId(response.stringId.slice(0, -1))
    props.setId && props.setId(response.sellerId.slice(0, -1))
    props.setStatusOrders && props.setStatusOrders(stringStatus.slice(0, -1))
    props.setTotalItems && props.setTotalItems(response.countTotalItems)

    let queryObj = {
      sellerName: response.sellerFilter.slice(0, -1),
      status: stringStatus.slice(0, -1),
      startDate: props.defaultDate
        ? getDateString(dataFilter.startDateFilter)
        : '',
      finalDate: props.defaultDate
        ? getDateString(dataFilter.finalDateFilter)
        : '',
    }

    queryObj = filterEmptyObj(queryObj)
    setQuery(queryObj)
  }

  const modifyDataFilterSeller = (values: SellerSelect[]) => {
    setDataFilter({ ...dataFilter, dataFilter: values })
  }

  // const modifyDataFilterStatus = (values: SellerSelect[]) => {
  //   setDataFilter({ ...dataFilter, statusFilter: values })
  // }

  const changeDate = (date: Date, type: string) => {
    if (type === 'start') {
      setDataFilter({ ...dataFilter, startDateFilter: date })
    } else if (type === 'final') {
      setDataFilter({ ...dataFilter, finalDateFilter: date })
    }
  }

  const cleanFilter = () => {
    const lastDate = props.defaultDate?.today ? today : yesterday

    setDataFilter({
      ...dataFilter,
      dataFilter: [],
      startDateFilter: firstDay,
      finalDateFilter: lastDate,
      statusFilter: [],
    })
    props.filterDates &&
      props.filterDates(getDateString(firstDay), getDateString(lastDate))
    props.setSellerId('')
    props.setTotalItems && props.setTotalItems(0)
    setQuery({
      sellerName: undefined,
      status: undefined,
      startDate: undefined,
      finalDate: undefined,
    })
  }

  return (
    <div className="flex flex-wrap pa0">
      {!props.disableSelect && (
        <div className="w-100">
          <SelectComponent
            options={props.optionsSelect}
            dataFilter={dataFilter.dataFilter}
            setDataFilter={modifyDataFilterSeller}
            multi={props.multiValue}
            customLabel={
              <FormattedMessage id="admin/table.title-seller-label" />
            }
          />
        </div>
      )}
      {/* {props.optionsStatus && (
        <div className="w-100 pt5 mb3">
          <SelectComponent
            options={props.optionsStatus}
            dataFilter={dataFilter.statusFilter}
            setDataFilter={modifyDataFilterStatus}
            multi
            customLabel={
              <FormattedMessage id="admin/table.title-status-label" />
            }
          />
        </div>
      )} */}
      <div className="flex-ns w-100 justify-around items-end justify-end">
        <div className="w-100-ns pt2 pr2">
          {props.defaultDate && (
            <DatePickerComponent
              startDatePicker={dataFilter.startDateFilter}
              changeDate={changeDate}
              finalDatePicker={dataFilter.finalDateFilter}
              today={props.defaultDate ? props.defaultDate.today : false}
            />
          )}
        </div>
        <div className="pt7 fr z-0">
          <ButtonGroup
            buttons={[
              <ButtonWithIcon
                key="filter"
                isActiveOfGroup
                onClick={() => changesValuesTable()}
                icon={<IconFilter />}
                size="small"
              >
                {<FormattedMessage id="admin/table.title-filter" />}
              </ButtonWithIcon>,
              <ButtonWithIcon
                key="delete"
                isActiveOfGroup={false}
                size="small"
                onClick={() => cleanFilter()}
                icon={<IconDelete />}
              />,
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default Filter
