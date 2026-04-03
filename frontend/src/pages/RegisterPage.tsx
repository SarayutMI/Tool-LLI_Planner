import React from 'react'
import { Link } from 'react-router-dom'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent-blue rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Create account</h1>
          <p className="text-text-muted text-sm mt-2">Start managing your projects</p>
        </div>
        <div className="bg-surface-secondary border border-border-primary rounded-2xl p-6 shadow-2xl">
          <RegisterForm />
          <p className="text-center text-sm text-text-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-blue-light hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
