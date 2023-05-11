import React, { useState, FC, useEffect } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { Alert, Button, Input, ModalDialog, Spinner } from 'vtex.styleguide'

import styles from '../../styles.css'

const ModalConfirm: FC<ModalConfirmData> = (props) => {
  const { settingsQuery } = props

  const [email, setEmail] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [validEmail, setValidEmail] = useState(true)
  const [empty, setEmpty] = useState(true)
  const [showEmail, setShowEmail] = useState(true)

  // eslint-disable-next-line no-console
  console.log(showEmail)

  const { data: settings } = useQuery(settingsQuery, {
    ssr: false,
    pollInterval: 0,
  })

  const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

  const checkEmail = (emailAddress: string) => {
    const valid = EMAIL_PATTERN.test(emailAddress)

    if (!emailAddress) {
      setEmpty(true)

      return
    }

    setEmpty(false)
    if (!valid) {
      setValidEmail(false)
    } else {
      setValidEmail(true)
    }
  }

  const [createInvoice, { data, loading, error }] = useMutation(
    props.invoiceMutation
  )

  const getErrorMessage = () => {
    if (empty) {
      return <FormattedMessage id="admin/modal-settings.email-empty" />
    }

    if (!validEmail) {
      return <FormattedMessage id="admin/modal-settings.email-invalid" />
    }

    return null
  }

  const handleCreateInvoice = (
    startDate: string,
    finalDate: string,
    name: string,
    id: string,
    emailAddress: string
    // eslint-disable-next-line max-params
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    createInvoice({
      variables: {
        invoiceData: {
          name,
          id,
          email: emailAddress,
          startDate,
          endDate: finalDate,
        },
      },
    })
  }

  useEffect(() => {
    if (settings) {
      setShowEmail(settings.getSettings.showEmail)
    }
  }, [settings])

  if (loading) {
    return (
      <div className="mb5 flex justify-center">
        <Spinner />
      </div>
    )
  }

  if (data) {
    return (
      <Alert type="success">
        {<FormattedMessage id="admin/invoice-success" />}
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert type="error">
        {<FormattedMessage id="admin/invoice-error" />}
      </Alert>
    )
  }

  return (
    <>
      <ModalDialog
        centered
        confirmation={{
          disabled: showEmail ? empty || !validEmail : false,
          onClick: () => {
            if (showEmail && (empty || !validEmail)) {
              return
            }

            handleCreateInvoice(
              props.sellerData.startDate,
              props.sellerData.finalDate,
              props.sellerData.sellerName,
              props.sellerData.id,
              email
            )
            setIsModalOpen(!isModalOpen)
          },
          label: 'Confirm',
        }}
        cancelation={{
          onClick: () => setIsModalOpen(!isModalOpen),
          label: 'Cancel',
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(!isModalOpen)}
      >
        {showEmail ? (
          <div>
            <p>{props.messages.warning}</p>
            <p>{props.messages.confirmation}</p>
            <div>
              <Input
                placeholder="e-mail"
                size="large"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value)
                  checkEmail(e.target.value)
                }}
                errorMessage={getErrorMessage()}
              />
            </div>
          </div>
        ) : (
          <div>
            <p>{props.messages.noEmailWarning}</p>
            <p>{props.messages.confirmation}</p>
          </div>
        )}
      </ModalDialog>

      {props.integration !== 'internal' ? null : (
        <div className="mb5 justify-end flex items-end items-center">
          {!props.disabled ? (
            ''
          ) : (
            <div className={`ph5 ${styles.large}`}>
              <Alert type="warning">
                <FormattedMessage id="admin/form-settings.invalid-invoice" />
              </Alert>
            </div>
          )}
          <Button
            onClick={() => {
              setIsModalOpen(!isModalOpen)
            }}
            disabled={props.disabled}
            variation="success"
          >
            {props.buttonMessage}
          </Button>
        </div>
      )}

      <div className="mb5 flex justify-end items-end" />
    </>
  )
}

export default ModalConfirm
