import React from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  errorMessage: string | null
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      errorMessage: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so fallback UI renders
    return {
      hasError: true,
      errorMessage: error.message,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // console.error("error:", error);
    // console.error("errorInfo:", errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false })
    // Optional reload full page:
    // window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[100dvh] flex items-center justify-center bg-red-50 dark:bg-gray-900 transition-colors">
          <div
            className="
                w-full h-[100dvh] bg-white dark:bg-gray-800 shadow-md transition-colors
                rounded-none overflow-y-auto
                md:h-auto md:max-w-md md:max-h-[95vh] md:rounded-md
            "
          >
            <div className="p-6 flex flex-col gap-4 text-center">
              <h1 className="capitalize text-lg font-bold text-light-base dark:text-gray-200">
                If the issue persists <br />
                Please reinstall the module or <a className="text-lightblue" href="https://digitalwoods.io/support" target="_blank">contact the administrator</a>
              </h1>

              <pre className="p-3 border border-warning text-warning dark:text-warning bg-red-50 dark:bg-gray-700 rounded whitespace-pre-wrap overflow-x-auto">
                {this.state.errorMessage}
              </pre>

              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-richRed text-white rounded hover:bg-warning"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
