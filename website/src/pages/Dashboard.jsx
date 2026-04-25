import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import './Dashboard.css'

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('week')

  // Mock data
  const stats = [
    {
      label: 'Appointments Today',
      value: 47,
      change: '+12%',
      trend: 'up',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    {
      label: 'Appeared in AI Chat',
      value: 234,
      change: '+8%',
      trend: 'up',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    {
      label: 'Specialists Listed',
      value: 24,
      change: '0%',
      trend: 'neutral',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      label: 'Available Slots Today',
      value: 186,
      change: '-3%',
      trend: 'down',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      )
    }
  ]

  const appointmentsBySpecialty = [
    { specialty: 'Cardiology', count: 45, percentage: 25 },
    { specialty: 'Dermatology', count: 38, percentage: 21 },
    { specialty: 'Pediatrics', count: 32, percentage: 18 },
    { specialty: 'Orthopedics', count: 28, percentage: 16 },
    { specialty: 'General', count: 36, percentage: 20 }
  ]

  const specialtyColors = ['#0d9488', '#14b8a6', '#5eead4', '#99f6e4', '#ccfbf1']

  const appointmentTrend = [
    { day: 'Mon', value: 32 },
    { day: 'Tue', value: 41 },
    { day: 'Wed', value: 38 },
    { day: 'Thu', value: 47 },
    { day: 'Fri', value: 35 },
    { day: 'Sat', value: 28 },
    { day: 'Sun', value: 18 }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'appointment',
      message: 'New appointment booked via AI chat',
      time: '2 minutes ago',
      patient: 'John Doe',
      specialist: 'Dr. Sarah Chen'
    },
    {
      id: 2,
      type: 'slot',
      message: 'Slot availability updated',
      time: '15 minutes ago',
      specialist: 'Dr. Michael Lim'
    },
    {
      id: 3,
      type: 'cancellation',
      message: 'Appointment cancelled by patient',
      time: '1 hour ago',
      patient: 'Jane Smith',
      specialist: 'Dr. Ahmad Rahman'
    },
    {
      id: 4,
      type: 'integration',
      message: 'API integration status: Healthy',
      time: '2 hours ago'
    }
  ]

  const maxValue = Math.max(...appointmentTrend.map(d => d.value))

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <div className="dashboard__brand">
            <div className="dashboard__logo">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#dashboard-logo)" />
                <path d="M16 24C16 19.5817 19.5817 16 24 16V16C28.4183 16 32 19.5817 32 24V32H24C19.5817 32 16 28.4183 16 24V24Z" fill="white" opacity="0.9"/>
                <circle cx="24" cy="24" r="4" fill="white"/>
                <defs>
                  <linearGradient id="dashboard-logo" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#14b8a6"/>
                    <stop offset="1" stopColor="#0f766e"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="dashboard__brand-name">MedAI</span>
          </div>
          <nav className="dashboard__nav">
            <Link to="/dashboard" className="dashboard__nav-item dashboard__nav-item--active">
              Dashboard
            </Link>
            <Link to="/settings" className="dashboard__nav-item">
              Settings
            </Link>
            <Link to="/integration" className="dashboard__nav-item">
              Integration
            </Link>
          </nav>
          <div className="dashboard__user">
            <div className="dashboard__user-avatar">
              <span>SM</span>
            </div>
            <div className="dashboard__user-info">
              <span className="dashboard__user-name">Sarah Miller</span>
              <span className="dashboard__user-role">Hospital Manager</span>
            </div>
            <button className="dashboard__logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard__main">
        <div className="dashboard__welcome">
          <div className="dashboard__welcome-text">
            <h1 className="dashboard__title">Good morning, Sarah!</h1>
            <p className="dashboard__subtitle">
              Here's what's happening at Kuala Lumpur Medical Center today.
            </p>
          </div>
          <div className="dashboard__date-filter">
            <button
              className={`dashboard__filter-btn ${dateRange === 'today' ? 'dashboard__filter-btn--active' : ''}`}
              onClick={() => setDateRange('today')}
            >
              Today
            </button>
            <button
              className={`dashboard__filter-btn ${dateRange === 'week' ? 'dashboard__filter-btn--active' : ''}`}
              onClick={() => setDateRange('week')}
            >
              This Week
            </button>
            <button
              className={`dashboard__filter-btn ${dateRange === 'month' ? 'dashboard__filter-btn--active' : ''}`}
              onClick={() => setDateRange('month')}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard__stats">
          {stats.map((stat, index) => (
            <Card key={index} variant="elevated" padding="lg" className="dashboard__stat-card">
              <div className="dashboard__stat-header">
                <div className={`dashboard__stat-icon dashboard__stat-icon--${stat.trend}`}>
                  {stat.icon}
                </div>
                <Badge variant={stat.trend === 'up' ? 'success' : stat.trend === 'down' ? 'error' : 'default'}>
                  {stat.change}
                </Badge>
              </div>
              <div className="dashboard__stat-value">{stat.value}</div>
              <div className="dashboard__stat-label">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="dashboard__charts">
          {/* Line Chart */}
          <Card variant="elevated" padding="lg" className="dashboard__chart">
            <div className="dashboard__chart-header">
              <h3 className="dashboard__chart-title">Appointments Over Time</h3>
              <span className="dashboard__chart-period">Last 7 days</span>
            </div>
            <div className="dashboard__line-chart">
              <div className="dashboard__chart-y-axis">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{Math.round(maxValue - (i * maxValue / 4))}</span>
                ))}
              </div>
              <div className="dashboard__chart-bars">
                {appointmentTrend.map((day, index) => (
                  <div key={index} className="dashboard__chart-bar-container">
                    <div
                      className="dashboard__chart-bar"
                      style={{ height: `${(day.value / maxValue) * 100}%` }}
                    />
                    <span className="dashboard__chart-label">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Pie Chart */}
          <Card variant="elevated" padding="lg" className="dashboard__chart">
            <div className="dashboard__chart-header">
              <h3 className="dashboard__chart-title">By Specialty</h3>
              <span className="dashboard__chart-period">This week</span>
            </div>
            <div className="dashboard__pie-container">
              <div className="dashboard__pie-chart">
                <svg viewBox="0 0 100 100" className="dashboard__pie-svg">
                  {appointmentsBySpecialty.map((item, index) => {
                    const prevPercentage = appointmentsBySpecialty
                      .slice(0, index)
                      .reduce((sum, i) => sum + i.percentage, 0)
                    const offset = prevPercentage * 3.6 - 90
                    return (
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={specialtyColors[index]}
                        strokeWidth="20"
                        strokeDasharray={`${item.percentage * 2.51} ${251.2 - item.percentage * 2.51}`}
                        strokeDashoffset={-offset}
                        className="dashboard__pie-segment"
                      />
                    )
                  })}
                </svg>
              </div>
              <div className="dashboard__pie-legend">
                {appointmentsBySpecialty.map((item, index) => (
                  <div key={index} className="dashboard__legend-item">
                    <span
                      className="dashboard__legend-dot"
                      style={{ background: specialtyColors[index] }}
                    />
                    <span className="dashboard__legend-label">{item.specialty}</span>
                    <span className="dashboard__legend-value">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card variant="elevated" padding="lg" className="dashboard__activity">
          <h3 className="dashboard__activity-title">Recent Activity</h3>
          <div className="dashboard__activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="dashboard__activity-item">
                <div className={`dashboard__activity-icon dashboard__activity-icon--${activity.type}`}>
                  {activity.type === 'appointment' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  )}
                  {activity.type === 'slot' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  )}
                  {activity.type === 'cancellation' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  )}
                  {activity.type === 'integration' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.17-8.73"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  )}
                </div>
                <div className="dashboard__activity-content">
                  <p className="dashboard__activity-message">{activity.message}</p>
                  {activity.patient && (
                    <span className="dashboard__activity-detail">
                      Patient: {activity.patient} • {activity.specialist}
                    </span>
                  )}
                  {activity.specialist && !activity.patient && (
                    <span className="dashboard__activity-detail">
                      {activity.specialist}
                    </span>
                  )}
                </div>
                <span className="dashboard__activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}

export default Dashboard