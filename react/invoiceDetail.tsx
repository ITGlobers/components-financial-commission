import Handlebars from 'handlebars'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Layout, Spinner } from 'vtex.styleguide'
import type { DocumentNode } from 'graphql'

interface InvoiceDetailProps {
  invoiceQuery: DocumentNode
  getTemplate: DocumentNode
  sendEmail: DocumentNode
}

const InvoiceDetail: FC<InvoiceDetailProps> = (props) => {
  const { invoiceQuery, getTemplate, sendEmail } = props

  const { route } = useRuntime()
  const { params } = route
  const { id } = params

  const [, setEmailSent] = useState(false)
  const [template, setTemplate] = useState('')
  const [htmlString, setHtmlString] = useState('')
  const [, { data: emailData }] = useMutation(sendEmail)

  const { data } = useQuery(invoiceQuery, {
    ssr: false,
    pollInterval: 0,
    variables: {
      id,
    },
  })

  const templateSrc = useQuery(getTemplate, {
    ssr: false,
    pollInterval: 0,
  })

  useEffect(() => {
    setTemplate(templateSrc?.data?.getTemplate)
  }, [templateSrc, template])

  useEffect(() => {
    if (emailData) {
      setEmailSent(true)
    }
  }, [emailData])

  useEffect(() => {
    if (data !== undefined && template !== '') {
      const hbTemplate = Handlebars.compile(template)

      template && setHtmlString(hbTemplate({ id, ...data?.getInvoice }))
    }
  }, [data, template])

  if (!template || htmlString === '') {
    return (
      <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <Spinner />
      </div>
    )
  }

  return (
    <Layout>
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

export default InvoiceDetail
