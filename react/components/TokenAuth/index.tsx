import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { Input, Button, Toggle, Box } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'
import { FormattedMessage } from 'react-intl'

const TokenAuth: FC<TokenAuthProps> = (props) => {
  const [sellerSettingsToken, setSellerSettingsToken] =
    useState<SellerSettingsToken>({})

  const { editToken, createTokenMutation } = props

  const [editTokenMutation] = useMutation(editToken)

  const [
    authenticationToken,
    { data: createToken, loading: loadingCreateToken },
  ] = useMutation(createTokenMutation)

  const handleIsEnable = () => {
    setSellerSettingsToken({
      ...sellerSettingsToken,
      enabled: !sellerSettingsToken.enabled,
    })
    /* authenticationToken: !sellerSettingsToken.enabled
    ? sellerSettingsToken.authenticationToken
    : '', */
    editTokenMutation({
      variables: {
        sellerId: props.sellerId,
        isEnable: !sellerSettingsToken.enabled,
      },
    })
  }

  const handleCreateToken = () => {
    authenticationToken({ variables: { accountId: props.sellerId } })
  }

  useEffect(() => {
    // eslint-disable-next-line vtex/prefer-early-return
    if (createToken) {
      const newToken = createToken.createToken.autheticationToken

      setSellerSettingsToken({
        ...sellerSettingsToken,
        authenticationToken: newToken,
      })
    }
  }, [createToken])

  return (
    <div className="mt7">
      <Box>
        <h2 className="mt0 mb6">Autentication Token</h2>
        <div className="mt2 mb8">
          {props.activateToogle && (
            <Toggle
              label={sellerSettingsToken.enabled ? 'Activated' : 'Deactivated'}
              checked={sellerSettingsToken.enabled}
              semantic
              onChange={() => handleIsEnable()}
            />
          )}
        </div>
        <div className="mb5">
          <Input
            placeholder="Token"
            readOnly
            label="Seller Token"
            value={
              sellerSettingsToken.authenticationToken
                ? sellerSettingsToken.authenticationToken
                : props.tokenSeller.getToken?.autheticationToken
            }
          />
        </div>
        <div className="mb4 flex justify-end ">
          <Button
            variation="primary"
            loading={loadingCreateToken}
            onClick={() => handleCreateToken()}
            disabled={!sellerSettingsToken.enabled && props.activateToogle}
          >
            {<FormattedMessage id="admin/form-settings.button-new" />}
          </Button>
        </div>
      </Box>
    </div>
  )
}

export default TokenAuth
