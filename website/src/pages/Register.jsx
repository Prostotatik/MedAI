import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Stepper from '../components/ui/Stepper'
import Upload from '../components/ui/Upload'
import Checkbox from '../components/ui/Checkbox'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1 - Manager Info
    fullName: '',
    passportNumber: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2 - Hospital Info
    hospitalName: '',
    address: '',
    workingHours: {
      monday: { open: '08:00', close: '17:00', closed: false },
      tuesday: { open: '08:00', close: '17:00', closed: false },
      wednesday: { open: '08:00', close: '17:00', closed: false },
      thursday: { open: '08:00', close: '17:00', closed: false },
      friday: { open: '08:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '09:00', close: '13:00', closed: true }
    },
    // Step 3 - Documents
    documents: [],
    // Step 4 - Review
    confirmInfo: false
  })

  const steps = [
    { title: 'Manager Info', description: 'Personal details' },
    { title: 'Hospital Info', description: 'Location & hours' },
    { title: 'Documents', description: 'Upload files' },
    { title: 'Review', description: 'Confirm & submit' }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 5000)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="register__step">
            <h3 className="register__step-title">Manager Information</h3>
            <p className="register__step-desc">
              Please provide your personal details for verification.
            </p>
            <div className="register__fields">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
              <Input
                label="Passport Number"
                placeholder="Enter your passport number"
                value={formData.passportNumber}
                onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+60 12 345 6789"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="manager@hospital.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
                required
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="register__step">
            <h3 className="register__step-title">Hospital Information</h3>
            <p className="register__step-desc">
              Tell us about your hospital and operating hours.
            </p>
            <div className="register__fields">
              <Input
                label="Hospital Name"
                placeholder="Enter hospital name"
                value={formData.hospitalName}
                onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                required
              />
              <Input
                label="Address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />

              <div className="register__hours">
                <label className="register__hours-label">Working Hours</label>
                <div className="register__hours-grid">
                  {Object.entries(formData.workingHours).map(([day, hours]) => (
                    <div key={day} className="register__hours-row">
                      <div className="register__hours-day">
                        <Checkbox
                          checked={!hours.closed}
                          onChange={(checked) => setFormData({
                            ...formData,
                            workingHours: {
                              ...formData.workingHours,
                              [day]: {...hours, closed: !checked}
                            }
                          })}
                        />
                        <span className="register__hours-day-name">
                          {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                        </span>
                      </div>
                      {!hours.closed ? (
                        <div className="register__hours-time">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => setFormData({
                              ...formData,
                              workingHours: {
                                ...formData.workingHours,
                                [day]: {...hours, open: e.target.value}
                              }
                            })}
                            className="register__time-input"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => setFormData({
                              ...formData,
                              workingHours: {
                                ...formData.workingHours,
                                [day]: {...hours, close: e.target.value}
                              }
                            })}
                            className="register__time-input"
                          />
                        </div>
                      ) : (
                        <span className="register__hours-closed">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="register__step">
            <h3 className="register__step-title">Upload Documents</h3>
            <p className="register__step-desc">
              Upload the required documents for verification.
            </p>

            <div className="register__documents">
              <div className="register__document-item">
                <div className="register__document-header">
                  <div className="register__document-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Hospital License</h4>
                    <p>Official hospital operating license</p>
                  </div>
                </div>
                <Upload
                  label="Upload License"
                  description="PDF, JPG, PNG (max 10MB)"
                  onFiles={(files) => console.log('License:', files)}
                />
              </div>

              <div className="register__document-item">
                <div className="register__document-header">
                  <div className="register__document-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="16" rx="2"/>
                      <path d="M3 10h18"/>
                      <path d="M7 15h4"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Registration Certificate</h4>
                    <p>Hospital registration document</p>
                  </div>
                </div>
                <Upload
                  label="Upload Certificate"
                  description="PDF, JPG, PNG (max 10MB)"
                  onFiles={(files) => console.log('Certificate:', files)}
                />
              </div>

              <div className="register__document-item">
                <div className="register__document-header">
                  <div className="register__document-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Manager ID</h4>
                    <p>Passport or national ID scan</p>
                  </div>
                </div>
                <Upload
                  label="Upload ID"
                  description="PDF, JPG, PNG (max 10MB)"
                  onFiles={(files) => console.log('ID:', files)}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="register__step">
            <h3 className="register__step-title">Review & Submit</h3>
            <p className="register__step-desc">
              Please verify all information before submitting.
            </p>

            <div className="register__review">
              <div className="register__review-section">
                <div className="register__review-header">
                  <h4>Manager Information</h4>
                  <button
                    className="register__review-edit"
                    onClick={() => setCurrentStep(0)}
                  >
                    Edit
                  </button>
                </div>
                <div className="register__review-grid">
                  <div className="register__review-item">
                    <span className="register__review-label">Full Name</span>
                    <span className="register__review-value">{formData.fullName || '—'}</span>
                  </div>
                  <div className="register__review-item">
                    <span className="register__review-label">Passport</span>
                    <span className="register__review-value">{formData.passportNumber || '—'}</span>
                  </div>
                  <div className="register__review-item">
                    <span className="register__review-label">Phone</span>
                    <span className="register__review-value">{formData.phoneNumber || '—'}</span>
                  </div>
                  <div className="register__review-item">
                    <span className="register__review-label">Email</span>
                    <span className="register__review-value">{formData.email || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="register__review-section">
                <div className="register__review-header">
                  <h4>Hospital Information</h4>
                  <button
                    className="register__review-edit"
                    onClick={() => setCurrentStep(1)}
                  >
                    Edit
                  </button>
                </div>
                <div className="register__review-grid">
                  <div className="register__review-item">
                    <span className="register__review-label">Hospital Name</span>
                    <span className="register__review-value">{formData.hospitalName || '—'}</span>
                  </div>
                  <div className="register__review-item">
                    <span className="register__review-label">Address</span>
                    <span className="register__review-value">{formData.address || '—'}</span>
                  </div>
                  <div className="register__review-item register__review-item--full">
                    <span className="register__review-label">Working Hours</span>
                    <div className="register__review-hours">
                      {Object.entries(formData.workingHours).map(([day, hours]) => (
                        <span key={day} className="register__review-hour">
                          {hours.closed
                            ? `${day.slice(0,3)}: Closed`
                            : `${day.slice(0,3)}: ${hours.open} - ${hours.close}`
                          }
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="register__review-section">
                <div className="register__review-header">
                  <h4>Documents</h4>
                  <button
                    className="register__review-edit"
                    onClick={() => setCurrentStep(2)}
                  >
                    Edit
                  </button>
                </div>
                <div className="register__review-docs">
                  <span className="register__review-docs-note">
                    3 documents pending upload
                  </span>
                </div>
              </div>
            </div>

            <div className="register__confirm">
              <Checkbox
                checked={formData.confirmInfo}
                onChange={(checked) => setFormData({...formData, confirmInfo: checked})}
                label="I confirm that all information provided is accurate and complete"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isSuccess) {
    return (
      <div className="register">
        <div className="register__bg" />
        <div className="register__container">
          <Card variant="elevated" padding="xl" className="register__success">
            <div className="register__success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.17-8.73"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 className="register__success-title">Application Submitted!</h2>
            <p className="register__success-desc">
              Your application is now under review. We'll contact you at{' '}
              <strong>{formData.email || 'your email'}</strong> within 5 seconds with
              approval details.
            </p>
            <div className="register__success-actions">
              <Button onClick={() => navigate('/dashboard')} variant="primary" size="lg">
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="register">
      <div className="register__bg" />
      <div className="register__container">
        <button className="register__back" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </button>

        <div className="register__header">
          <h1 className="register__title">Register Your Hospital</h1>
          <p className="register__subtitle">
            Join MedAI and start accepting AI-powered appointment bookings
          </p>
        </div>

        <Stepper steps={steps} currentStep={currentStep} />

        <Card variant="elevated" padding="lg" className="register__form-card">
          {renderStepContent()}

          <div className="register__actions">
            {currentStep > 0 && (
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={!formData.confirmInfo}
              >
                Submit Application
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Register