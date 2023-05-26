import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import {
  Layout,
  PageHeader,
  Button,
  EXPERIMENTAL_Select as Select,
  Box,
  EXPERIMENTAL_Table as Table,
  Alert,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { useMutation, useQuery } from 'react-apollo'
import type { DocumentNode } from 'graphql'

import { TokenAuth } from './components'

const DATE_CUT_OPTIONS = [
  {
    value: 1,
    label: 'Daily',
  },
  {
    value: 30,
    label: 'Monthly',
  },
]

interface SettingsDetailProps {
  createTokenMutation: DocumentNode
  editToken: DocumentNode
  getTokenQuery: DocumentNode
  createSettingsMutation: DocumentNode
  getSettingsQuery: DocumentNode
}

const SettingsDetail: FC<SettingsDetailProps> = (props) => {
  const {
    createTokenMutation,
    editToken,
    getTokenQuery,
    createSettingsMutation,
    getSettingsQuery,
  } = props

  const { navigate, route, query } = useRuntime()

  const [selectedValue, setSelectValue] = useState<SelectObj | null>()
  const [openAlert, setOpenAlert] = useState(false)
  const [infoSettings, setInfoSettings] = useState<SettingInfoType[]>([])
  const [tokenSeller, setTokenSeller] = useState<any>({})

  const { data: getToken } = useQuery(getTokenQuery, {
    ssr: false,
    pollInterval: 0,
    fetchPolicy: 'no-cache',
    variables: {
      accountId: route.params.sellerId,
    },
  })

  const [createSettings, { data: dataSettings }] = useMutation(
    createSettingsMutation
  )

  const { data: settings } = useQuery(getSettingsQuery, {
    ssr: false,
    pollInterval: 0,
    variables: {
      id: tokenSeller.getToken ? tokenSeller.getToken.name : '',
    },
  })

  const handleSaveBilling = () => {
    if (selectedValue) {
      const nowDate = new Date()
      let date = ''
      let lastDateString = ''

      const month =
        nowDate.getMonth() + 1 <= 9
          ? `0${nowDate.getMonth() + 1}`
          : nowDate.getMonth() + 1

      if (selectedValue.label === 'Monthly') {
        const day =
          nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : nowDate.getDate()

        date = `${nowDate.getFullYear()}-${month}-${day}`

        const lastDate = new Date(
          nowDate.getFullYear(),
          nowDate.getMonth() + 1,
          0
        )

        const lastMonth =
          lastDate.getMonth() + 1
            ? `0${lastDate.getMonth() + 1}`
            : lastDate.getMonth() + 1

        const lastDay =
          lastDate.getDate() < 10
            ? `0${lastDate.getDate()}`
            : lastDate.getDate()

        lastDateString = `${lastDate.getFullYear()}-${lastMonth}-${lastDay}`
      } else {
        const day =
          nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : nowDate.getDate()

        const finalDay =
          nowDate.getDate() + 1 < 10
            ? `0${nowDate.getDate() + 1}`
            : nowDate.getDate() + 1

        date = `${nowDate.getFullYear()}-${month}-${day}`
        lastDateString = `${nowDate.getFullYear()}-${month}-${finalDay}`
      }

      createSettings({
        variables: {
          settingsData: {
            sellerName: query.name,
            startDate: date,
            endDate: lastDateString,
            billingCycle: selectedValue.label,
          },
        },
      })
    }
  }

  useEffect(() => {
    if (dataSettings) {
      setInfoSettings([
        {
          idbilling: dataSettings.createSettings.billingCycle,
          start: dataSettings.createSettings.startDate,
          end: dataSettings.createSettings.endDate,
        },
      ])

      setOpenAlert(true)
    }
  }, [dataSettings])

  useEffect(() => {
    if (settings) {
      setInfoSettings([
        {
          idbilling: settings.getSettings.billingCycle,
          start: settings.getSettings.startDate,
          end: settings.getSettings.endDate,
        },
      ])
      setSelectValue({
        value: 30,
        label: settings.getSettings.billingCycle,
      })
    }
  }, [settings])

  useEffect(() => {
    if (getToken) setTokenSeller(getToken)
  }, [getToken])

  return (
    <Layout
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage
              id="admin/navigation.setting"
              values={{ name: query?.name }}
            />
          }
          linkLabel={<FormattedMessage id="admin/navigation.settings" />}
          onLinkClick={() => {
            navigate({
              to: `/admin/app/commission-report/settings/`,
            })
          }}
        />
      }
    >
      {tokenSeller && (
        <TokenAuth
          activateToogle={false}
          editToken={editToken}
          createTokenMutation={createTokenMutation}
          sellerId={route.params.sellerId}
          tokenSeller={tokenSeller}
        />
      )}
      {query?.integration === 'true' && (
        <div className="mt4">
          <Box>
            <h2 className="mt0 mb6">Billing cycle</h2>
            <div className="mb5 flex w-100">
              <div className="w-90">
                <Select
                  menuPosition="fixed"
                  options={DATE_CUT_OPTIONS}
                  value={selectedValue}
                  multi={false}
                  onChange={(values: SelectObj) => {
                    setSelectValue(values)
                  }}
                />
              </div>
              <div className="w-10 pl2">
                <Button variation="primary" onClick={handleSaveBilling}>
                  SAVE
                </Button>
              </div>
            </div>
            <div className="w-100">
              <p className="t-small w-100 c-muted-1">
                <FormattedMessage id="admin/modal-settings.billingCycle-helpText" />
              </p>
            </div>
            {openAlert ? (
              <div className="mt7">
                <Alert type="success" onClose={() => setOpenAlert(false)}>
                  Data was updated successfully
                </Alert>
              </div>
            ) : (
              <div />
            )}
            <div className="mt7">
              <Table
                stickyHeader
                measures={[]}
                items={infoSettings}
                columns={[
                  {
                    id: 'idbilling',
                    title: 'Billing Cycle',
                  },
                  {
                    id: 'start',
                    title: 'Start Date',
                  },
                  {
                    id: 'end',
                    title: 'End Date',
                  },
                ]}
              />
            </div>
          </Box>
        </div>
      )}
    </Layout>
  )
}

export default SettingsDetail
