import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'

interface Props {
  children: React.ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Renderer error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-steam-bg p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c34741]/15 mb-4">
          <AlertTriangle size={28} className="text-[#c34741]" />
        </div>

        <h1 className="text-steam-text text-[20px] font-semibold mb-1">
          Something went wrong
        </h1>
        <p className="text-steam-textMuted text-[13px] max-w-[440px] mb-1 leading-relaxed">
          The Steam client hit a snag. You can try recovering this view, or reload
          the entire window.
        </p>
        <p className="text-steam-textDim text-[11px] font-mono max-w-[520px] mb-6 break-all">
          {error.name}: {error.message}
        </p>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-4 py-2 rounded-sm transition-colors"
          >
            <RefreshCw size={13} />
            Try Again
          </Button>
          <Button
            variant="ghost"
            onClick={this.handleReload}
            className="inline-flex items-center text-[12px] font-semibold text-steam-text bg-steam-card hover:bg-steam-cardHover border border-steam-borderSubtle px-4 py-2 rounded-sm transition-colors"
          >
            Reload Window
          </Button>
        </div>
      </div>
    )
  }
}
