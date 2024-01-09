import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Layout, Spinner, PageHeader } from 'vtex.styleguide'
import type { DocumentNode } from 'graphql'
import { FormattedMessage } from 'react-intl'

interface PayoutDetailProps {
  payoutQuery: DocumentNode
}

const PayoutDetail: FC<PayoutDetailProps> = (props) => {
  const { payoutQuery } = props

  const { route, navigate } = useRuntime()
  const { params } = route
  const { id } = params

  const [htmlString, setHtmlString] = useState('')

  const { data, loading } = useQuery(payoutQuery, {
    ssr: false,
    pollInterval: 0,
    variables: {
      id,
    },
  })

  useEffect(() => {
    if (data !== undefined && !loading) {
      setHtmlString(data.getPayout.html)
    }
  }, [data, loading])

  if (loading) {
    return (
      <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <Spinner />
      </div>
    )
  }

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          linkLabel={
            <FormattedMessage id="admin/financial-commission.payout-report-details.page-header.link-label" />
          }
          onLinkClick={() => {
            navigate({
              to: '/admin/app/commission-report/detail',
            })
          }}
        />
      }
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          paddingTop: '100%',
        }}
      >
        <iframe
          srcDoc={htmlString}
          title="invoice detail"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
    </Layout>
  )
}

export default PayoutDetail
