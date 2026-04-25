import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import './Landing.css'

const Landing = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock login - just navigate to dashboard
    navigate('/dashboard')
  }

  return (
    <div className="landing">
      {/* Hero Background */}
      <div className="landing__bg">
        <div className="landing__bg-gradient" />
        <div className="landing__bg-pattern" />
        <div className="landing__bg-shapes">
          <div className="shape shape--1" />
          <div className="shape shape--2" />
          <div className="shape shape--3" />
        </div>
      </div>

      {/* Content */}
      <div className="landing__content">
        {/* Left Side - Marketing */}
        <div className="landing__hero">
          <div className="landing__brand animate-slide-up stagger-1">
            <div className="landing__logo">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#logo-gradient)" />
                <path d="M16 24C16 19.5817 19.5817 16 24 16V16C28.4183 16 32 19.5817 32 24V32H24C19.5817 32 16 28.4183 16 24V24Z" fill="white" opacity="0.9"/>
                <circle cx="24" cy="24" r="4" fill="white"/>
                <defs>
                  <linearGradient id="logo-gradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#14b8a6"/>
                    <stop offset="1" stopColor="#0f766e"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="landing__brand-name">MedAI</span>
          </div>

          <h1 className="landing__title animate-slide-up stagger-2">
            One AI Chat.<br />
            <span className="landing__title-accent">Every Hospital.</span>
          </h1>

          <p className="landing__subtitle animate-slide-up stagger-3">
            Connect your hospital to the future of patient engagement.
            Let AI handle appointment bookings while you focus on care.
          </p>

          <div className="landing__features animate-slide-up stagger-4">
            <div className="landing__feature">
              <div className="landing__feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.17-8.73"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <span>AI-Powered Booking</span>
            </div>
            <div className="landing__feature">
              <div className="landing__feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <span>Real-time Availability</span>
            </div>
            <div className="landing__feature">
              <div className="landing__feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span>Secure Integration</span>
            </div>
          </div>

          <div className="landing__stats animate-slide-up stagger-5">
            <div className="landing__stat">
              <span className="landing__stat-value">50+</span>
              <span className="landing__stat-label">Hospitals</span>
            </div>
            <div className="landing__stat-divider" />
            <div className="landing__stat">
              <span className="landing__stat-value">10K+</span>
              <span className="landing__stat-label">Appointments</span>
            </div>
            <div className="landing__stat-divider" />
            <div className="landing__stat">
              <span className="landing__stat-value">98%</span>
              <span className="landing__stat-label">Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="landing__auth animate-slide-up stagger-3">
          <Card variant="elevated" padding="lg" className="landing__auth-card">
            <div className="landing__auth-header">
              <h2 className="landing__auth-title">
                {isLogin ? 'Welcome Back' : 'Register Hospital'}
              </h2>
              <p className="landing__auth-subtitle">
                {isLogin
                  ? 'Sign in to manage your hospital'
                  : 'Join MedAI to start accepting appointments'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="landing__form">
              <Input
                label="Email Address"
                type="email"
                placeholder="manager@hospital.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                }
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                }
              />

              {isLogin && (
                <button type="button" className="landing__forgot">
                  Forgot password?
                </button>
              )}

              <Button type="submit" size="lg" fullWidth>
                {isLogin ? 'Sign In' : 'Continue to Registration'}
              </Button>
            </form>

            <div className="landing__auth-switch">
              <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
              <button
                type="button"
                className="landing__auth-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register Hospital' : 'Sign In'}
              </button>
            </div>

            {!isLogin && (
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => navigate('/register')}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                }
              >
                Start Hospital Registration
              </Button>
            )}
          </Card>

          <p className="landing__terms">
            By continuing, you agree to our{' '}
            <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Landing