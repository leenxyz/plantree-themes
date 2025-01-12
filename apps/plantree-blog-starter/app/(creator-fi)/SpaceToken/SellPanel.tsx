import { useState } from 'react'
import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import { precision } from '@/lib/math'
import { toFloorFixed } from '@/lib/utils'
import { AmountInput } from './AmountInput'
import { EthBalance } from './EthBalance'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'
import { SellBtn } from './SellBtn'
import { SpaceTokenBalance } from './SpaceTokenBalance'
import { Button } from '@/components/ui/button'

interface Props {
  isConnected: boolean
}

export const SellPanel = ({ isConnected }: Props) => {
  const [ethAmount, setEthAmount] = useState<string>('')
  const [tokenAmount, setTokenAmount] = useState<string>('')
  const { space } = useSpace()
  const { data: tokenBalance } = useSpaceTokenBalance()

  const isAmountValid = parseFloat(tokenAmount) > 0

  const isInsufficientBalance = precision.toDecimal(tokenBalance! || '0') < parseFloat(tokenAmount)

  const handleEthAmount = (value: string) => {}

  const handleTokenChange = (value: string) => {
    setTokenAmount(value)
    if (!value) {
      return setEthAmount('')
    }

    const ethAmountDecimal = precision.toDecimal(space.getEthAmount(precision.token(value)))
    setEthAmount(toFloorFixed(ethAmountDecimal, 4).toString())
  }

  const handleMax = () => {
    if (!tokenBalance) return

    setTokenAmount(toFloorFixed(precision.toDecimal(tokenBalance), 4).toString())

    const ethAmountDecimal = precision.toDecimal(space.getEthAmount(tokenBalance))

    setEthAmount(toFloorFixed(ethAmountDecimal, 4).toString())
  }

  return (
    <>
      <div className="mb-2 rounded-xl bg-gray-100 p-4 dark:bg-zinc-900">
        <div className="text-sm">Sell</div>

        <AmountInput
          symbolName={space.symbolName}
          icon={
            space.logo && (
              <img src={space.logo} alt={space.symbolName} className="h-auto w-5 rounded-full" />
            )
          }
          value={tokenAmount}
          onChange={(value) => handleTokenChange(value)}
        />

        <div className="flex h-6 items-center justify-end gap-2">
          <SpaceTokenBalance />
          <Button
            onClick={handleMax}
            disabled={typeof tokenBalance === undefined || precision.toDecimal(tokenBalance!) <= 0}
            className="h-6 cursor-pointer rounded-md px-2 text-xs text-white"
          >
            Max
          </Button>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-gray-100 p-4 dark:bg-zinc-900">
        <div className="text-sm">Buy</div>

        <AmountInput
          symbolName="ETH"
          disabled
          icon={<img src="/eth.png" alt="ETH" className="h-auto w-5 rounded-full" />}
          value={ethAmount}
          onChange={(value) => handleEthAmount(value)}
        />
        <div className="flex h-6 items-center justify-end gap-2">
          <EthBalance />
        </div>
      </div>

      <SellBtn
        ethAmount={ethAmount}
        tokenAmount={tokenAmount}
        isConnected={isConnected}
        handleSwap={() => {
          setEthAmount('')
          setTokenAmount('')
        }}
        isInsufficientBalance={isInsufficientBalance}
        isAmountValid={isAmountValid}
        space={space}
      />
    </>
  )
}
