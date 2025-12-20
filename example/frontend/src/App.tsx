import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <header className="header">
        <h1>OnChain Test Kit</h1>
        <p>Example Frontend with Vercel Web Analytics</p>
      </header>

      <main className="main">
        <section className="card">
          <h2>Welcome</h2>
          <p>
            This is an example frontend application showcasing integration of the OnChain Test Kit
            with Vercel Web Analytics for tracking user interactions and page performance.
          </p>
        </section>

        <section className="card">
          <h2>Counter Demo</h2>
          <p>Current count: <strong>{count}</strong></p>
          <button onClick={() => setCount((count) => count + 1)}>
            Increment
          </button>
          <button onClick={() => setCount(0)}>
            Reset
          </button>
        </section>

        <section className="card">
          <h2>Features</h2>
          <ul>
            <li>End-to-end testing toolkit for blockchain applications</li>
            <li>Powered by Playwright</li>
            <li>Support for multiple wallets (MetaMask, Coinbase, Phantom)</li>
            <li>Integrated with Vercel Web Analytics for performance monitoring</li>
          </ul>
        </section>

        <section className="card">
          <h2>Getting Started</h2>
          <p>
            To get started with the OnChain Test Kit, visit the{' '}
            <a href="https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit" target="_blank" rel="noopener noreferrer">
              repository
            </a>
            {' '}for more information.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Coinbase. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
