interface ParameterInputProps {
  name: string
  type: string
  value: string
  onChange: (value: string) => void
}

export const ParameterInput = ({
  name,
  type,
  value,
  onChange,
}: ParameterInputProps) => {
  const getPlaceholder = () => {
    if (type.startsWith('uint') || type.startsWith('int')) {
      return '0'
    }
    if (type === 'bool') {
      return 'true or false'
    }
    if (type === 'address') {
      return '0x...'
    }
    if (type === 'string') {
      return 'Enter string value'
    }
    if (type === 'bytes') {
      return '0x...'
    }
    return `Enter ${type} value`
  }

  return (
    <div className="space-y-2">
      <label className="block text-retro-text-muted text-xs uppercase tracking-wider">
        {name} <span className="text-retro-secondary">({type})</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={getPlaceholder()}
        className="w-full bg-retro-bg border-4 border-retro-secondary text-retro-secondary px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-retro-secondary focus:ring-offset-2 focus:ring-offset-retro-bg"
      />
    </div>
  )
}
