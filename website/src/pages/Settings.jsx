import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import './Settings.css'

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile')
  const [isEditing, setIsEditing] = useState(null)
  const [formData, setFormData] = useState({
    fullName: 'Sarah Miller',
    phone: '+60 12 345 6789',
    email: 'sarah.miller@klmedical.com',
    hospitalName: 'Kuala Lumpur Medical Center',
    address: '123 Jalan Tun Razak, 50400 Kuala Lumpur, Malaysia',
    workingHours: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '09:00', close: '13:00' },
      sunday: { closed: true }
    }
  })

  const sections = [
    { id: 'profile', label: 'Manager Profile', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )},
    { id: 'hospital', label: 'Hospital Info', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18"/>
        <path d="M5 21V7l8-4v18"/>
        <path d="M19 21V11l-6-4"/>
        <path d="M9 9v.01"/>
        <path d="M9 12v.01"/>
        <path d="M9 15v.01"/>
      </svg>
    )},
    { id: 'documents', label: 'Documents', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    )},
    { id: 'danger', label: 'Danger Zone', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )}
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="settings__section">
            <div className="settings__section-header">
              <div>
                <h2 className="settings__section-title">Manager Profile</h2>
                <p className="settings__section-desc">
                  Update your personal information and credentials
                </p>
              </div>
              {!isEditing && (
                <Button variant="secondary" onClick={() => setIsEditing('profile')}>
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="settings__avatar-section">
              <div className="settings__avatar">
                <span>SM</span>
              </div>
              <Button variant="ghost" size="sm">Change Photo</Button>
            </div>

            <div className="settings__form">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                disabled={!isEditing}
              />
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!isEditing}
              />

              {isEditing && (
                <div className="settings__password-change">
                  <h4>Change Password</h4>
                  <Input label="Current Password" type="password" placeholder="Enter current password" />
                  <Input label="New Password" type="password" placeholder="Enter new password" />
                  <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
                </div>
              )}

              {isEditing && (
                <div className="settings__actions">
                  <Button variant="secondary" onClick={() => setIsEditing(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditing(null)}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        )

      case 'hospital':
        return (
          <div className="settings__section">
            <div className="settings__section-header">
              <div>
                <h2 className="settings__section-title">Hospital Information</h2>
                <p className="settings__section-desc">
                  Manage your hospital details and operating hours
                </p>
              </div>
              {!isEditing && (
                <Button variant="secondary" onClick={() => setIsEditing('hospital')}>
                  Edit Info
                </Button>
              )}
            </div>

            <div className="settings__form">
              <Input
                label="Hospital Name"
                value={formData.hospitalName}
                onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                disabled={!isEditing}
              />
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                disabled={!isEditing}
              />

              <div className="settings__hours">
                <label className="settings__hours-label">Working Hours</label>
                <div className="settings__hours-grid">
                  {Object.entries(formData.workingHours).map(([day, hours]) => (
                    <div key={day} className="settings__hours-row">
                      <span className="settings__hours-day">
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </span>
                      {hours.closed ? (
                        <span className="settings__hours-closed">Closed</span>
                      ) : (
                        <span className="settings__hours-time">
                          {hours.open} - {hours.close}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {isEditing && (
                <div className="settings__actions">
                  <Button variant="secondary" onClick={() => setIsEditing(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditing(null)}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        )

      case 'documents':
        return (
          <div className="settings__section">
            <div className="settings__section-header">
              <div>
                <h2 className="settings__section-title">Documents</h2>
                <p className="settings__section-desc">
                  Manage your hospital documents and certificates
                </p>
              </div>
            </div>

            <div className="settings__documents">
              {[
                { name: 'Hospital License', status: 'approved', date: 'Uploaded Jan 15, 2024' },
                { name: 'Registration Certificate', status: 'approved', date: 'Uploaded Jan 15, 2024' },
                { name: 'Manager ID', status: 'approved', date: 'Uploaded Jan 15, 2024' }
              ].map((doc, index) => (
                <div key={index} className="settings__document">
                  <div className="settings__document-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="settings__document-info">
                    <span className="settings__document-name">{doc.name}</span>
                    <span className="settings__document-date">{doc.date}</span>
                  </div>
                  <span className={`settings__document-status settings__document-status--${doc.status}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.17-8.73"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Approved
                  </span>
                  <Button variant="ghost" size="sm">Replace</Button>
                </div>
              ))}

              <Button variant="secondary" icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              }>
                Add New Document
              </Button>
            </div>
          </div>
        )

      case 'danger':
        return (
          <div className="settings__section">
            <div className="settings__danger-header">
              <h2 className="settings__section-title">Danger Zone</h2>
              <p className="settings__section-desc">
                Irreversible actions. Please proceed with caution.
              </p>
            </div>

            <Card variant="outline" padding="lg" className="settings__danger-card">
              <div className="settings__danger-item">
                <div className="settings__danger-info">
                  <h4>Deactivate Hospital Account</h4>
                  <p>
                    This will temporarily disable your hospital from appearing in MedAI search results
                    and stop all appointment bookings. You can reactivate at any time.
                  </p>
                </div>
                <Button variant="secondary">
                  Deactivate
                </Button>
              </div>

              <div className="settings__danger-divider" />

              <div className="settings__danger-item">
                <div className="settings__danger-info">
                  <h4>Delete Account Permanently</h4>
                  <p>
                    This will permanently delete your hospital account and all associated data.
                    This action cannot be undone.
                  </p>
                </div>
                <Button variant="danger">
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="settings">
      {/* Header */}
      <header className="settings__header">
        <div className="settings__header-content">
          <div className="settings__brand">
            <div className="settings__logo">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#settings-logo)" />
                <path d="M16 24C16 19.5817 19.5817 16 24 16V16C28.4183 16 32 19.5817 32 24V32H24C19.5817 32 16 28.4183 16 24V24Z" fill="white" opacity="0.9"/>
                <circle cx="24" cy="24" r="4" fill="white"/>
                <defs>
                  <linearGradient id="settings-logo" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#14b8a6"/>
                    <stop offset="1" stopColor="#0f766e"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="settings__brand-name">MedAI</span>
          </div>
          <nav className="settings__nav">
            <Link to="/dashboard" className="settings__nav-item">Dashboard</Link>
            <Link to="/settings" className="settings__nav-item settings__nav-item--active">Settings</Link>
            <Link to="/integration" className="settings__nav-item">Integration</Link>
          </nav>
          <button className="settings__logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="settings__main">
        <div className="settings__sidebar">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`settings__sidebar-item ${activeSection === section.id ? 'settings__sidebar-item--active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="settings__sidebar-icon">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        <div className="settings__content">
          {renderSection()}
        </div>
      </main>
    </div>
  )
}

export default Settings