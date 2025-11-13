import { useState, useMemo } from 'react'
import { AbiFunction } from 'ox'
import type { Abi } from 'viem'
import { parseEther } from 'viem'
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from 'wagmi'
import { ALL_CHAINS } from '../config/wagmi'
import { Button } from './Button'
import { ParameterInput } from './ParameterInput'

interface ParsedFunction {
  name: string
  inputs: Array<{
    name: string
    type: string
    internalType?: string
  }>
}

export const SendTransactionForm = () => {
  const [functionSignature, setFunctionSignature] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [value, setValue] = useState('0')
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const parsedFunction = useMemo<ParsedFunction | null>(() => {
    if (!functionSignature.trim()) {
      setError(null)
      return null
    }

    try {
      setError(null)
      // Try to parse as full signature: "transfer(address,uint256)"
      let signature = functionSignature.trim()

      // If it doesn't start with "function ", add it
      if (!signature.startsWith('function ')) {
        signature = `function ${signature}`
      }

      const abiFunction = AbiFunction.from(signature) as unknown as {
        name: string
        inputs: Array<{
          name?: string
          type: string
          internalType?: string
        }>
      }

      // Verify it's actually a function with name and inputs
      if (!abiFunction.name || !Array.isArray(abiFunction.inputs)) {
        throw new Error('Invalid function signature')
      }

      return {
        name: abiFunction.name,
        inputs: abiFunction.inputs.map((input, index) => ({
          name: input.name || `param${index}`,
          type: input.type,
          internalType: input.internalType,
        })),
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Invalid function signature',
      )
      return null
    }
  }, [functionSignature])

  const handleParamChange = (name: string, value: string) => {
    setParamValues(prev => ({ ...prev, [name]: value }))
  }

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })
  const chainId = useChainId()

  // Compute explorer URL for the transaction
  const explorerUrl = useMemo(() => {
    if (!hash) return null
    const chain = ALL_CHAINS.find(c => c.id === chainId)
    if (!chain?.blockExplorers?.default?.url) return null
    return `${chain.blockExplorers.default.url}/tx/${hash}`
  }, [hash, chainId])

  const handleSend = () => {
    if (!parsedFunction || !toAddress) {
      setError('Please provide function signature and to address')
      return
    }

    try {
      // Convert param values to array in the correct order
      const args = parsedFunction.inputs.map(input => {
        const value = paramValues[input.name] || ''
        // Basic type conversion - could be enhanced
        if (input.type.startsWith('uint') || input.type.startsWith('int')) {
          return BigInt(value || '0')
        }
        if (input.type === 'bool') {
          return value === 'true' || value === '1'
        }
        if (input.type === 'address') {
          return value as `0x${string}`
        }
        // For arrays and other types, return as string for now
        return value
      })

      // Create ABI with the function
      const abi: Abi = [
        {
          type: 'function',
          name: parsedFunction.name,
          inputs: parsedFunction.inputs.map(input => ({
            name: input.name,
            type: input.type,
          })),
          outputs: [],
          stateMutability: 'nonpayable',
        },
      ] as Abi

      // Convert ether value to wei
      let valueInWei = 0n
      try {
        valueInWei = parseEther(value || '0')
      } catch {
        setError('Invalid ETH value. Please enter a valid number.')
        return
      }

      writeContract({
        address: toAddress as `0x${string}`,
        abi,
        functionName: parsedFunction.name,
        args,
        value: valueInWei,
      })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send transaction',
      )
    }
  }

  const displayError = error || (writeError?.message ?? null)

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6">
      <div className="bg-retro-surface border-4 border-retro-accent p-6 space-y-6">
        <h2 className="text-3xl font-bold text-retro-accent text-center uppercase tracking-wider">
          Send Transaction
        </h2>

        {/* To Address Input */}
        <div className="space-y-2">
          <label className="block text-retro-text-muted text-sm uppercase tracking-wider">
            To Address
          </label>
          <input
            type="text"
            value={toAddress}
            onChange={e => setToAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-retro-bg border-4 border-retro-accent text-retro-accent px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-retro-accent focus:ring-offset-2 focus:ring-offset-retro-bg"
          />
        </div>

        {/* Value Input */}
        <div className="space-y-2">
          <label className="block text-retro-text-muted text-sm uppercase tracking-wider">
            Value (ETH)
          </label>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="0"
            className="w-full bg-retro-bg border-4 border-retro-accent text-retro-accent px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-retro-accent focus:ring-offset-2 focus:ring-offset-retro-bg"
          />
        </div>

        {/* Function Signature Input */}
        <div className="space-y-2">
          <label className="block text-retro-text-muted text-sm uppercase tracking-wider">
            ABI Function
          </label>
          <input
            type="text"
            value={functionSignature}
            onChange={e => {
              setFunctionSignature(e.target.value)
              setParamValues({})
            }}
            placeholder="e.g., transfer(address,uint256) or transfer"
            className="w-full bg-retro-bg border-4 border-retro-accent text-retro-accent px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-retro-accent focus:ring-offset-2 focus:ring-offset-retro-bg"
          />
          {parsedFunction && (
            <div className="text-retro-secondary text-sm mt-1">
              Function: <span className="font-bold">{parsedFunction.name}</span>
            </div>
          )}
        </div>

        {/* Parameter Inputs */}
        {parsedFunction && parsedFunction.inputs.length > 0 && (
          <div className="space-y-4">
            <label className="block text-retro-text-muted text-sm uppercase tracking-wider">
              Parameters
            </label>
            {parsedFunction.inputs.map((input, index) => (
              <ParameterInput
                key={`${input.name}-${index}`}
                name={input.name}
                type={input.type}
                value={paramValues[input.name] || ''}
                onChange={value => handleParamChange(input.name, value)}
              />
            ))}
          </div>
        )}

        {/* Error Display */}
        {displayError && (
          <div className="bg-red-900/30 border-2 border-red-500 text-red-300 px-4 py-3 text-sm">
            {displayError}
          </div>
        )}

        {/* Success Display */}
        {isConfirmed && hash && (
          <div className="bg-green-900/30 border-2 border-green-500 text-green-300 px-4 py-3 text-sm space-y-2">
            <div>Transaction confirmed!</div>
            <div className="font-mono text-xs break-all">Hash: {hash}</div>
            {explorerUrl && (
              <div>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-200 underline font-bold"
                >
                  View on Explorer →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Send Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleSend}
          disabled={
            isPending ||
            isConfirming ||
            !parsedFunction ||
            !toAddress ||
            parsedFunction.inputs.some(input => {
              // Allow empty strings for string type fields
              if (input.type === 'string') {
                return false
              }
              // Require non-empty values for all other types
              return !paramValues[input.name]?.trim()
            })
          }
          className="w-full"
        >
          {isPending
            ? 'Sending...'
            : isConfirming
              ? 'Confirming...'
              : 'Send Transaction'}
        </Button>
      </div>
    </div>
  )
}
