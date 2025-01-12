import { useState } from 'react'
import { useAddress } from '@/app/(creator-fi)/hooks/useAddress'
import { useQueryEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
import { useTrades } from '@/app/(creator-fi)/hooks/useTrades'
import { erc20Abi, spaceAbi } from '@/lib/abi'
import { checkChain } from '@/lib/checkChain'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { Space } from '@/app/(creator-fi)/domains/Space'
import { waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'
import { wagmiConfig } from '@/lib/wagmi'
import LoadingDots from '../loading/loading-dots'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'

interface Props {
  ethAmount: string
  tokenAmount: string
  handleSwap: () => void
  isInsufficientBalance: boolean
  isAmountValid: boolean
  isConnected: boolean
  space: Space
}

export const SellBtn = ({
  ethAmount,
  tokenAmount,
  isInsufficientBalance,
  isAmountValid,
  handleSwap,
  isConnected,
  space,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const balance = useSpaceTokenBalance()
  const address = useAddress()
  const { refetch: refetchEth } = useQueryEthBalance()
  const trade = useTrades()

  const onSell = async () => {
    setLoading(true)
    try {
      await checkChain()
      const value = precision.toExactDecimalBigint(tokenAmount)
      const contractAddress = space.address as Address
      const approveTx = await writeContractAsync({
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [contractAddress, value],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: approveTx })

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: spaceAbi,
        functionName: 'sell',
        args: [value, BigInt(0)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      await Promise.all([balance.refetch(), refetchEth()])
      trade.refetch()
      handleSwap()
      toast.success(`Sold ${space?.symbolName} successfully!`)
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'sell error')
    }
    setLoading(false)
  }

  return (
    <>
      {isConnected ? (
        <Button
          className="h-[50px] w-full rounded-xl"
          disabled={!isAmountValid || isInsufficientBalance || loading}
          onClick={() => onSell()}
        >
          {loading ? (
            <LoadingDots color="white" />
          ) : isInsufficientBalance ? (
            `Insufficient ${space.symbolName} balance`
          ) : isAmountValid ? (
            'Sell'
          ) : (
            'Enter an amount'
          )}
        </Button>
      ) : (
        <WalletConnectButton className="h-[50px] w-full rounded-full">
          Connect wallet
        </WalletConnectButton>
      )}
    </>
  )
}
