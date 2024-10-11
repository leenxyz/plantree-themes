'use client'

import { ReactNode, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSpace } from '@/hooks/useSpace'
import { HolderList } from '../Space/HolderList'
import { SpaceNav } from '../Space/SpaceNav'
import { TradeList } from '../Space/TradeList'
import { Transaction } from '../Transaction'
import { SpaceBasicInfo } from '../Space/SpaceBasicInfo'
import { ClientOnly } from '@/components/ClientOnly'
import { WalletConnectButton } from '@/components/WalletConnectButton'

enum TabTypes {
  Holders = 'Holders',
  Trades = 'Trades',
}

export default function Layout({ children }: { children: ReactNode }) {
  const { space } = useSpace()
  const [type, setType] = useState(TabTypes.Trades)

  if (!space) return null

  return (
    <div>
      <div className="mx-auto mt-4 flex w-full flex-col gap-12 p-3 sm:w-full">
        <div className="mx-auto flex w-full flex-col gap-6  rounded-2xl md:max-w-2xl">
          {/* <SpaceNav /> */}
        </div>

        <div className="mx-auto w-full xl:max-w-5xl">{children}</div>

        {/* <div className="flex w-full flex-shrink-0 flex-col lg:w-[360px]">
          <div className="mt-8 lg:block">
            <Tabs
              className="w-full"
              value={type}
              onValueChange={(v) => {
                setType(v as TabTypes)
              }}
            >
              <TabsList className="pb-2">
                <TabsTrigger value={TabTypes.Trades}>Trades</TabsTrigger>
                <TabsTrigger value={TabTypes.Holders}>Holders</TabsTrigger>
              </TabsList>

              {type === TabTypes.Trades && (
                <TabsContent value={TabTypes.Trades}>
                  <TradeList />
                </TabsContent>
              )}
              {type === TabTypes.Holders && (
                <TabsContent value={TabTypes.Holders}>
                  <HolderList />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div> */}
      </div>
    </div>
  )
}
