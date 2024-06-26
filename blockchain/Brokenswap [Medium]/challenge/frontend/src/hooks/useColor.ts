import * as UbeswapDefaultList from '@ubeswap/default-token-list'
import * as UbeswapExperimentalList from '@ubeswap/default-token-list/ubeswap-experimental.token-list.json'
import { ChainId, Token } from '@ubeswap/sdk'
import Vibrant from 'node-vibrant'
import { shade } from 'polished'
import { useLayoutEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { hex } from 'wcag-contrast'

const images: Record<string, string> = {}

UbeswapDefaultList.tokens.concat(UbeswapExperimentalList.tokens).forEach((token) => {
  images[token.address] = token.logoURI
})

async function getColorFromToken(token: Token): Promise<string | null> {
  if (token.chainId === ChainId.ALFAJORES && token.address === '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735') {
    return Promise.resolve('#FAAB14')
  }

  const path = images[token.address]
  if (!path) {
    return '#FAAB14'
  }

  return Vibrant.from(path)
    .getPalette()
    .then((palette) => {
      if (palette?.Vibrant) {
        let detectedHex = palette.Vibrant.hex
        let AAscore = hex(detectedHex, '#FFF')
        while (AAscore < 3) {
          detectedHex = shade(0.005, detectedHex)
          AAscore = hex(detectedHex, '#FFF')
        }
        return detectedHex
      }
      return null
    })
    .catch(() => null)
}

export function useColor(token?: Token) {
  const theme = useTheme()
  const [color, setColor] = useState(theme.primary1)

  useLayoutEffect(() => {
    let stale = false

    if (token) {
      getColorFromToken(token).then((tokenColor) => {
        if (!stale && tokenColor !== null) {
          setColor(tokenColor)
        }
      })
    }

    return () => {
      stale = true
      setColor('#2172E5')
    }
  }, [token])

  return color
}
