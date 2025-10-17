'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useLollypopContract } from '@/hooks/useLollypopContract'
import { useAccount } from 'wagmi'
import { isAddress } from 'viem'
import { toast } from 'sonner'
import {
  Settings,
  Pause,
  Play,
  Shield,
  DollarSign,
  Users,
  Ban,
  AlertTriangle,
  Crown
} from 'lucide-react'

export default function AdminPanel() {
  const { address } = useAccount()
  const {
    contractOwner,
    totalSupply,
    maxSupply,
    maxMintAmountPerTx,
    paused,
    emergencyStop,
    // Admin functions
    pause,
    unpause,
    toggleEmergencyStop,
    setMaxMintAmountPerTx,
    setMaxSupply,
    mintForAddress,
    withdraw,
    blockToken,
    blockMultipleTokens,
    // Transaction states
    isPending,
    isConfirmed,
    refetchTotalSupply
  } = useLollypopContract()

  const [newMaxSupply, setNewMaxSupply] = useState('')
  const [newMaxMintPerTx, setNewMaxMintPerTx] = useState('')
  const [mintToAddress, setMintToAddress] = useState('')
  const [mintAmount, setMintAmount] = useState('')
  const [tokenIdToBlock, setTokenIdToBlock] = useState('')
  const [tokenIdsToBlock, setTokenIdsToBlock] = useState('')

  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase()

  if (!isOwner) {
    return (
      <div className="py-20 bg-gradient-to-b from-red-50 to-orange-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Only the contract owner can access the admin panel.</p>
          </motion.div>
        </div>
      </div>
    )
  }

  const handleSetMaxSupply = () => {
    const supply = parseInt(newMaxSupply)
    if (isNaN(supply) || supply <= 0) {
      toast.error('Please enter a valid supply number')
      return
    }
    setMaxSupply(supply)
    setNewMaxSupply('')
  }

  const handleSetMaxMintPerTx = () => {
    const amount = parseInt(newMaxMintPerTx)
    if (isNaN(amount) || amount <= 0 || amount > 10) {
      toast.error('Please enter a valid amount (1-10)')
      return
    }
    setMaxMintAmountPerTx(amount)
    setNewMaxMintPerTx('')
  }

  const handleMintForAddress = () => {
    if (!isAddress(mintToAddress)) {
      toast.error('Please enter a valid address')
      return
    }
    const amount = parseInt(mintAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid mint amount')
      return
    }
    mintForAddress(mintToAddress as `0x${string}`, amount)
    setMintToAddress('')
    setMintAmount('')
  }

  const handleBlockToken = () => {
    const tokenId = parseInt(tokenIdToBlock)
    if (isNaN(tokenId) || tokenId < 0) {
      toast.error('Please enter a valid token ID')
      return
    }
    blockToken(tokenId)
    setTokenIdToBlock('')
  }

  const handleBlockMultipleTokens = () => {
    try {
      const tokenIds = tokenIdsToBlock
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id) && id >= 0)
      
      if (tokenIds.length === 0) {
        toast.error('Please enter valid token IDs separated by commas')
        return
      }
      
      blockMultipleTokens(tokenIds)
      setTokenIdsToBlock('')
    } catch {
      toast.error('Please enter valid token IDs separated by commas')
    }
  }

  if (isConfirmed) {
    refetchTotalSupply()
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Panel
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your Lollypop NFT contract settings and operations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contract Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Contract Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalSupply?.toString() || '0'}
                    </div>
                    <div className="text-sm text-gray-600">Minted</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {maxSupply?.toString() || '0'}
                    </div>
                    <div className="text-sm text-gray-600">Max Supply</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Contract Paused</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={paused ? 'destructive' : 'secondary'}>
                        {paused ? 'Paused' : 'Active'}
                      </Badge>
                      <Button
                        onClick={paused ? unpause : pause}
                        disabled={isPending}
                        variant="outline"
                        size="sm"
                      >
                        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        {paused ? 'Unpause' : 'Pause'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Emergency Stop</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={emergencyStop ? 'destructive' : 'secondary'}>
                        {emergencyStop ? 'Stopped' : 'Normal'}
                      </Badge>
                      <Button
                        onClick={toggleEmergencyStop}
                        disabled={isPending}
                        variant="outline"
                        size="sm"
                      >
                        <Shield className="h-4 w-4" />
                        Toggle
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Max Mint Per Tx</span>
                    <Badge variant="outline">
                      {maxMintAmountPerTx?.toString() || '1'}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={withdraw}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Withdraw Contract Balance
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Admin Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Set Max Supply */}
                <div className="space-y-2">
                  <Label>Set Max Supply</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="New max supply"
                      value={newMaxSupply}
                      onChange={(e) => setNewMaxSupply(e.target.value)}
                      type="number"
                    />
                    <Button
                      onClick={handleSetMaxSupply}
                      disabled={isPending || !newMaxSupply}
                      variant="outline"
                    >
                      Set
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Set Max Mint Per Tx */}
                <div className="space-y-2">
                  <Label>Set Max Mint Per Transaction</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Max mint per tx (1-10)"
                      value={newMaxMintPerTx}
                      onChange={(e) => setNewMaxMintPerTx(e.target.value)}
                      type="number"
                      min="1"
                      max="10"
                    />
                    <Button
                      onClick={handleSetMaxMintPerTx}
                      disabled={isPending || !newMaxMintPerTx}
                      variant="outline"
                    >
                      Set
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Mint for Address */}
                <div className="space-y-2">
                  <Label>Mint for Address</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Address"
                      value={mintToAddress}
                      onChange={(e) => setMintToAddress(e.target.value)}
                    />
                    <Input
                      placeholder="Amount"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      type="number"
                      className="w-24"
                    />
                    <Button
                      onClick={handleMintForAddress}
                      disabled={isPending || !mintToAddress || !mintAmount}
                      variant="outline"
                    >
                      Mint
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Token Blocking */}
                <div className="space-y-4">
                  <Label>Token Management</Label>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Token ID to block"
                        value={tokenIdToBlock}
                        onChange={(e) => setTokenIdToBlock(e.target.value)}
                        type="number"
                      />
                      <Button
                        onClick={handleBlockToken}
                        disabled={isPending || !tokenIdToBlock}
                        variant="outline"
                        className="text-red-600"
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Block
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Token IDs (comma separated)"
                        value={tokenIdsToBlock}
                        onChange={(e) => setTokenIdsToBlock(e.target.value)}
                      />
                      <Button
                        onClick={handleBlockMultipleTokens}
                        disabled={isPending || !tokenIdsToBlock}
                        variant="outline"
                        className="text-red-600"
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Block Multiple
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}