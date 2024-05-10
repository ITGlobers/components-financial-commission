import type { FC } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { DatePicker } from 'vtex.styleguide'
import { addDays } from 'date-fns'

const DatePickerComponent: FC<DatepickerProps> = (props) => {
  const { culture } = useRuntime()
  const numDates = props.today ? 0 : -1

  return (
    <div className="flex flex-nowrap">
      <div id="datepicker-left">
        <DatePicker
          label={<FormattedMessage id="admin/table.title-datepicker-start" />}
          value={props.startDatePicker}
          maxDate={props.finalDatePicker}
          onChange={(start: Date) => {
            if (props.finalDatePicker.getTime() >= start.getTime()) {
              props.changeDate(start, 'start')
            }
          }}
          locale={culture.locale}
          size="small"
        />
      </div>
      <div id="datepicker-right">
        <DatePicker
          label={<FormattedMessage id="admin/table.title-datepicker-final" />}
          value={props.finalDatePicker}
          minDate={props.startDatePicker}
          maxDate={addDays(new Date(), numDates)}
          onChange={(final: Date) => {
            if (props.startDatePicker.getTime() <= final.getTime()) {
              props.changeDate(final, 'final')
            }
          }}
          locale={culture.locale}
          size="small"
        />
      </div>
    </div>
  )
}

export default DatePickerComponent
