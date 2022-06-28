import type { FC } from 'react'
import React, { useState } from 'react'
import {
  ButtonWithIcon,
  IconCog,
  Modal,
  Divider,
  Toggle,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

interface SettingsTableData {
  schemaTable: any
}


const SettingsTable: FC<SettingsTableData> = (props) => {
  const [hideColumns, setHideColumn] = useState<string[]>([])
  const [modalColumns, setModalColumns] = useState(false)
  let columnModal: JSX.Element[] = []

  const hideShowColumns = (e: string) => {

    let temp = [...hideColumns]
    if (temp.find(id => id === e)) {
      temp.splice(temp.indexOf(e), 1)
    } else {
      temp.push(e)
    }
    setHideColumn(temp)
  }
  return (
    <div>
      <div className='w-100 flex justify-end'>
        <ButtonWithIcon icon={<IconCog color="#979899" />} variation="tertiary" onClick={() => setModalColumns(true)} />
      </div>
      <Modal centered isOpen={modalColumns} onClose={() => setModalColumns(false)}>
        <p>Choose the columns to display</p>
        <Divider orientation="horizontal" />
        {
          props.schemaTable.forEach((itemColum: any) => {
            const validateCheck = hideColumns.find(item => item === itemColum.id)
            const idLabel = <FormattedMessage id={itemColum.title.props.id} />
            columnModal.push(<div className='mt3'>
              <Toggle id={itemColum.id} label={idLabel} onChange={(e: any) => hideShowColumns(e.target.id)} checked={validateCheck ? true : false} />
              <div className='mt3'><Divider orientation="horizontal" /></div>
            </div>)

          })}
        {columnModal}

      </Modal>
    </div>
  )
}

export default SettingsTable
