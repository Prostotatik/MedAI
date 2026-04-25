import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Tabs from '../components/ui/Tabs'
import Badge from '../components/ui/Badge'
import './Integration.css'

const Integration = () => {
  return (
    <div className="integration">
      {/* Header */}
      <header className="integration__header">
        <div className="integration__header-content">
          <div className="integration__brand">
            <div className="integration__logo">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#integration-logo)" />
                <path d="M16 24C16 19.5817 19.5817 16 24 16V16C28.4183 16 32 19.5817 32 24V32H24C19.5817 32 16 28.4183 16 24V24Z" fill="white" opacity="0.9"/>
                <circle cx="24" cy="24" r="4" fill="white"/>
                <defs>
                  <linearGradient id="integration-logo" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#14b8a6"/>
                    <stop offset="1" stopColor="#0f766e"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="integration__brand-name">MedAI</span>
          </div>
          <nav className="integration__nav">
            <Link to="/dashboard" className="integration__nav-item">Dashboard</Link>
            <Link to="/settings" className="integration__nav-item">Settings</Link>
            <Link to="/integration" className="integration__nav-item integration__nav-item--active">Integration</Link>
          </nav>
          <button className="integration__logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="integration__main">
        <div className="integration__intro">
          <h1 className="integration__title">API Integration</h1>
          <p className="integration__subtitle">
            Connect your hospital systems to MedAI for seamless appointment management
          </p>
        </div>

        <Tabs
          tabs={[
            { label: 'API Key', content: <ApiKeyTab /> },
            { label: 'Documentation', content: <DocsTab /> },
            { label: 'API Tester', content: <TesterTab /> }
          ]}
        />
      </main>
    </div>
  )
}

const ApiKeyTab = () => {
  const [showKey, setShowKey] = useState(false)
  const apiKey = 'med_sk_live_8f7g6h5j4k3l2m1n0p9q8r7s6t5u4v3w'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
  }

  return (
    <div className="integration__tab">
      <Card variant="elevated" padding="lg">
        <div className="apikey__header">
          <div>
            <h3 className="apikey__title">Your API Key</h3>
            <p className="apikey__desc">
              Use this key to authenticate requests from your hospital backend to MedAI
            </p>
          </div>
          <Badge variant="success">Active</Badge>
        </div>

        <div className="apikey__key-display">
          <div className="apikey__key">
            <span className="apikey__key-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </span>
            <code className="apikey__key-value">
              {showKey ? apiKey : 'med_••••••••••••••••••••••••••••••'}
            </code>
          </div>
          <div className="apikey__actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKey(!showKey)}
              icon={
                showKey ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )
              }
            >
              {showKey ? 'Hide' : 'Show'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              }
            >
              Copy
            </Button>
          </div>
        </div>

        <div className="apikey__meta">
          <div className="apikey__meta-item">
            <span className="apikey__meta-label">Created</span>
            <span className="apikey__meta-value">January 15, 2024</span>
          </div>
          <div className="apikey__meta-item">
            <span className="apikey__meta-label">Last Used</span>
            <span className="apikey__meta-value">2 minutes ago</span>
          </div>
          <div className="apikey__meta-item">
            <span className="apikey__meta-label">Environment</span>
            <span className="apikey__meta-value">Production</span>
          </div>
        </div>

        <div className="apikey__danger">
          <h4>Regenerate API Key</h4>
          <p>
            Regenerating your API key will immediately invalidate the current key.
            You'll need to update your hospital backend with the new key.
          </p>
          <Button variant="danger" size="sm">
            Regenerate Key
          </Button>
        </div>
      </Card>

      <Card variant="elevated" padding="lg" className="integration__info-card">
        <h3 className="integration__card-title">Security Best Practices</h3>
        <ul className="integration__tips">
          <li>
            <span className="integration__tip-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span>Never expose your API key in client-side code or public repositories</span>
          </li>
          <li>
            <span className="integration__tip-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span>Store your API key in environment variables on your server</span>
          </li>
          <li>
            <span className="integration__tip-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span>Rotate your API key periodically for enhanced security</span>
          </li>
          <li>
            <span className="integration__tip-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span>Contact support immediately if you suspect your key has been compromised</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}

const DocsTab = () => {
  const endpoints = [
    {
      method: 'GET',
      path: '/specialists',
      description: 'Returns all specialists available for booking in MedAI'
    },
    {
      method: 'GET',
      path: '/slots',
      description: 'Returns only free appointment slots by specialty and date'
    },
    {
      method: 'POST',
      path: '/appointment/confirm',
      description: 'Confirms a slot booking requested by MedAI'
    },
    {
      method: 'POST',
      path: '/appointment/cancel',
      description: 'Cancels an existing booking initiated via MedAI'
    },
    {
      method: 'POST',
      path: '/postback',
      description: 'Sends slot/booking updates to MedAI postback URL'
    }
  ]

  const codeExamples = {
    curl: `curl -X GET "https://api.medai.com/v1/specialists" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    javascript: `const response = await fetch('https://api.medai.com/v1/specialists', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const specialists = await response.json();`,
    python: `import requests

response = requests.get(
    'https://api.medai.com/v1/specialists',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)

specialists = response.json()`
  }

  const [activeTab, setActiveTab] = useState('curl')

  return (
    <div className="integration__tab">
      {/* Overview */}
      <Card variant="elevated" padding="lg" className="integration__doc-section">
        <h3 className="integration__card-title">Integration Overview</h3>
        <p className="integration__card-desc">
          MedAI integrates with your hospital backend through a REST API. Your system exposes
          endpoints that MedAI calls to fetch availability and manage bookings. You also send
          updates to MedAI via our postback URL.
        </p>

        <div className="integration__flow-diagram">
          <div className="integration__flow-box">
            <span className="integration__flow-label">Your Hospital Backend</span>
            <span className="integration__flow-endpoints">GET /specialists<br/>GET /slots<br/>POST /appointment/*</span>
          </div>
          <div className="integration__flow-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <div className="integration__flow-box integration__flow-box--primary">
            <span className="integration__flow-label">MedAI Platform</span>
            <span className="integration__flow-endpoints">AI Chat Interface<br/>Patient App</span>
          </div>
          <div className="integration__flow-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <div className="integration__flow-box">
            <span className="integration__flow-label">Postback URL</span>
            <span className="integration__flow-endpoints">POST /postback</span>
          </div>
        </div>
      </Card>

      {/* Endpoints */}
      <Card variant="elevated" padding="lg" className="integration__doc-section">
        <h3 className="integration__card-title">Hospital API Endpoints</h3>
        <p className="integration__card-desc">
          These endpoints must be implemented by your hospital backend for MedAI to call.
        </p>

        <div className="integration__endpoints">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="integration__endpoint">
              <span className={`integration__method integration__method--${endpoint.method.toLowerCase()}`}>
                {endpoint.method}
              </span>
              <code className="integration__path">{endpoint.path}</code>
              <span className="integration__endpoint-desc">{endpoint.description}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Code Example */}
      <Card variant="elevated" padding="lg" className="integration__doc-section">
        <h3 className="integration__card-title">Code Example</h3>
        <p className="integration__card-desc">
          Example request to fetch specialists from your hospital API.
        </p>

        <div className="integration__code-tabs">
          {['curl', 'javascript', 'python'].map((lang) => (
            <button
              key={lang}
              className={`integration__code-tab ${activeTab === lang ? 'integration__code-tab--active' : ''}`}
              onClick={() => setActiveTab(lang)}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>

        <div className="integration__code-block">
          <pre><code>{codeExamples[activeTab]}</code></pre>
          <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(codeExamples[activeTab])}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 16, height: 16, marginRight: 4}}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy
          </Button>
        </div>
      </Card>

      {/* Response Example */}
      <Card variant="elevated" padding="lg" className="integration__doc-section">
        <h3 className="integration__card-title">Response Example</h3>
        <p className="integration__card-desc">
          Sample response from <code>GET /specialists</code>
        </p>

        <div className="integration__code-block">
          <pre><code>{JSON.stringify({
  specialists: [
    {
      id: 'spec_001',
      name: 'Dr. Sarah Chen',
      specialty: 'Cardiology',
      price: 150,
      available: true
    },
    {
      id: 'spec_002',
      name: 'Dr. Michael Lim',
      specialty: 'Dermatology',
      price: 120,
      available: true
    }
  ]
}, null, 2)}</code></pre>
        </div>
      </Card>
    </div>
  )
}

const TesterTab = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('specialists')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)

  const endpoints = [
    { value: 'specialists', label: 'GET /specialists' },
    { value: 'slots', label: 'GET /slots' },
    { value: 'confirm', label: 'POST /appointment/confirm' },
    { value: 'cancel', label: 'POST /appointment/cancel' },
    { value: 'postback', label: 'POST /postback' }
  ]

  const handleSendRequest = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (selectedEndpoint === 'specialists') {
        setResponse({
          status: 200,
          headers: {
            'content-type': 'application/json',
            'x-request-id': 'req_abc123'
          },
          body: {
            specialists: [
              { id: 'spec_001', name: 'Dr. Sarah Chen', specialty: 'Cardiology', price: 150 },
              { id: 'spec_002', name: 'Dr. Michael Lim', specialty: 'Dermatology', price: 120 },
              { id: 'spec_003', name: 'Dr. Ahmad Rahman', specialty: 'Pediatrics', price: 100 }
            ]
          }
        })
      } else {
        setResponse({
          status: 200,
          headers: {
            'content-type': 'application/json',
            'x-request-id': 'req_xyz789'
          },
          body: { success: true, message: 'Request processed successfully' }
        })
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="integration__tab">
      <Card variant="elevated" padding="lg" className="integration__tester">
        <h3 className="integration__card-title">API Tester</h3>
        <p className="integration__card-desc">
          Test your integration by making requests to your hospital API endpoints.
        </p>

        <div className="tester__config">
          <div className="tester__endpoint-select">
            <label className="tester__label">Endpoint</label>
            <select
              className="tester__select"
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
            >
              {endpoints.map((ep) => (
                <option key={ep.value} value={ep.value}>{ep.label}</option>
              ))}
            </select>
          </div>

          <div className="tester__params">
            <label className="tester__label">Request Parameters</label>
            <div className="tester__param-row">
              <input
                type="text"
                className="tester__param-input"
                placeholder="Parameter name"
                defaultValue={selectedEndpoint === 'slots' ? 'specialty' : ''}
              />
              <input
                type="text"
                className="tester__param-input"
                placeholder="Value"
                defaultValue={selectedEndpoint === 'slots' ? 'Cardiology' : ''}
              />
              <Button variant="ghost" size="sm">+</Button>
            </div>
          </div>

          <Button onClick={handleSendRequest} loading={loading} icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          }>
            Send Request
          </Button>
        </div>
      </Card>

      {response && (
        <Card variant="elevated" padding="lg" className="integration__response">
          <div className="tester__response-header">
            <h4>Response</h4>
            <Badge variant={response.status === 200 ? 'success' : 'error'}>
              {response.status} OK
            </Badge>
          </div>

          <div className="tester__response-section">
            <span className="tester__response-label">Headers</span>
            <div className="tester__response-headers">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="tester__response-header-item">
                  <span className="tester__response-key">{key}:</span>
                  <span className="tester__response-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="tester__response-section">
            <span className="tester__response-label">Body</span>
            <div className="integration__code-block">
              <pre><code>{JSON.stringify(response.body, null, 2)}</code></pre>
            </div>
          </div>
        </Card>
      )}

      <Card variant="elevated" padding="lg" className="integration__history">
        <h4>Request History</h4>
        <div className="tester__history-list">
          <div className="tester__history-item">
            <span className="tester__history-method">GET</span>
            <code className="tester__history-path">/specialists</code>
            <span className="tester__history-status tester__history-status--success">200</span>
            <span className="tester__history-time">2 min ago</span>
          </div>
          <div className="tester__history-item">
            <span className="tester__history-method">GET</span>
            <code className="tester__history-path">/slots?specialty=Cardiology</code>
            <span className="tester__history-status tester__history-status--success">200</span>
            <span className="tester__history-time">5 min ago</span>
          </div>
          <div className="tester__history-item">
            <span className="tester__history-method">POST</span>
            <code className="tester__history-path">/appointment/confirm</code>
            <span className="tester__history-status tester__history-status--success">200</span>
            <span className="tester__history-time">15 min ago</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Integration