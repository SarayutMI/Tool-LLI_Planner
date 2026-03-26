import React from 'react'
import { Link } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent-blue rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-text-muted text-sm mt-2">Sign in to your workspace</p>
        </div>
        <div className="bg-surface-secondary border border-border-primary rounded-2xl p-6 shadow-2xl">
          <LoginForm />
          <p className="text-center text-sm text-text-muted mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-blue-light hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
