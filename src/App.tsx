import { ConnectWalletButton } from './components/ConnectWalletButton'

function App() {
  return (
    <div className="min-h-screen bg-retro-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-4xl">
            <div className="bg-retro-surface border-4 border-retro-accent p-12 md:p-16 lg:p-20 shadow-[0_0_30px_rgba(255,107,53,0.3)]">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-center text-retro-accent mb-8 tracking-wider">
                SEND ANY TX
              </h1>
              <div className="mt-12 flex justify-center">
                <ConnectWalletButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
