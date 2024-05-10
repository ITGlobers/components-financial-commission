import type { FC } from 'react'
import React, { useState } from 'react'
import {
  ButtonWithIcon,
  IconCog,
  Modal,
  Divider,
  Toggle,
} from 'vtex.styleguide'
import { defineMessages, useIntl } from 'react-intl'
// import { FormattedMessage } from 'react-intl'

interface SettingsTableData {
  schemaTable: any
}

const idMessage: MessageType = defineMessages({
  actions: { id: 'admin/table-actions' },
  totalComission: { id: 'admin/table-total-commission' },
  totalOrderValue: { id: 'admin/table-total-amount' },
  ordersCount: { id: 'admin/table-total-order' },
  name: { id: 'admin/table-seller-name' },
})

const SettingsTable: FC<SettingsTableData> = (props) => {
  const intl = useIntl()
  const [hideColumns, setHideColumn] = useState<string[]>([])
  const [modalColumns, setModalColumns] = useState(false)
  const columnModal: JSX.Element[] = []

  const hideShowColumns = (e: string) => {
    const temp = [...hideColumns]

    if (temp.find((id) => id === e)) {
      temp.splice(temp.indexOf(e), 1)
    } else {
      temp.push(e)
    }

    setHideColumn(temp)
  }

  return (
    <div>
      <div className="w-100 flex justify-end">
        <ButtonWithIcon
          icon={<IconCog color="#979899" />}
          variation="tertiary"
          onClick={() => setModalColumns(true)}
        />
      </div>
      <Modal
        centered
        isOpen={modalColumns}
        onClose={() => setModalColumns(false)}
      >
        <p>Choose the columns to display</p>
        <Divider orientation="horizontal" />
        {props.schemaTable.forEach((itemColum: any) => {
          const validateCheck = hideColumns.find(
            (item) => item === itemColum.id
          )

          const key = itemColum.id

          columnModal.push(
            <div className="mt3">
              <Toggle
                id={itemColum.id}
                label={intl.formatMessage(idMessage[key])}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  hideShowColumns(e.target.id)
                }
                checked={!!validateCheck}
              />
              <div className="mt3">
                <Divider orientation="horizontal" />
              </div>
            </div>
          )
        })}
        {columnModal}
      </Modal>
    </div>
  )
}

export default SettingsTable
