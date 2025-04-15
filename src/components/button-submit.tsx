import { LoaderCircle } from 'lucide-react'
import { Button } from './ui/button'

export default function SubmitButton({
  children,
  loading,
  disabled,
  ...props
}: {
  children: React.ReactNode
  loading: boolean
  disabled?: boolean
  [key: string]: any
}) {
  return (
    <Button {...props} disabled={loading || disabled} type="submit">
      {loading ? <LoaderCircle className="animate-spin" /> : children}
    </Button>
  )
}
