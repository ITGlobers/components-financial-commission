import React from 'react'
import { FormattedMessage } from 'react-intl'
import { PageBlock } from 'vtex.styleguide'

import TableComponent from '../Table'

const PayoutReport: React.FC = () => {
  const schemaTableInvoice = [
    {
      id: 'columnId',
      title: <FormattedMessage id="admin/table-seller-invoice" />,
      // eslint-disable-next-line react/display-name
      cellRenderer: (props: any) => {
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            href={`/admin/app/commission-report/invoice/${props.data.href}`}
            style={{ color: '#0C389F' }}
            target="_self"
            rel="noreferrer"
          >
            {props.data.idVisible}
          </a>
        )
      },
    },
    {
      id: 'invoiceCreatedDate',
      title: <FormattedMessage id="admin/table-seller-created" />,
    },
    // {
    //   id: 'downloadFiles',
    //   title: <FormattedMessage id="admin/table-seller-download" />,
    //   // eslint-disable-next-line react/display-name
    //   cellRenderer: (props: any) => {
    //     return (
    //       // eslint-disable-next-line jsx-a11y/anchor-is-valid
    //       <>
    //         <a
    //           href={`/_v/financial-commission/${props.data.sellerId}/invoice/${props.data.id}/generate/xls?sellerName=${props.data.sellerName}`}
    //           style={{ color: '#0C389F' }}
    //           target="_self"
    //           rel="noreferrer"
    //         >
    //           {/* {props.data.idVisible} */}
    //           XLS
    //         </a>
    //         <span> | </span>
    //         <a
    //           href={`/_v/financial-commission/${props.data.sellerId}/invoice/${props.data.id}/generate/csv?sellerName=${props.data.sellerName}`}
    //           style={{ color: '#0C389F' }}
    //           target="_self"
    //           rel="noreferrer"
    //         >
    //           {/* {props.data.idVisible} */}
    //           CSV
    //         </a>
    //         <span> | </span>
    //         <a
    //           href={`/_v/financial-commission/${props.data.sellerId}/invoice/${props.data.id}/generate/pdf?sellerName=${props.data.sellerName}`}
    //           style={{ color: '#0C389F' }}
    //           target="_self"
    //           rel="noreferrer"
    //         >
    //           {/* {props.data.idVisible} */}
    //           PDF
    //         </a>
    //       </>
    //     )
    //   },
    // },
  ]

  return (
    <PageBlock>
      <div>
        <TableComponent
          schemaTable={schemaTableInvoice}
          items={dataTableInvoice}
          loading={false}
        />
      </div>
    </PageBlock>
  )
}

export default PayoutReport
