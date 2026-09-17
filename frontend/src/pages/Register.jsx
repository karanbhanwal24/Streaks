import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { UserPlus, Mail, Lock } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import ErrorAlert from '../components/ErrorAlert'
import IconInput from '../components/IconInput'
import LoadingButton from '../components/LoadingButton'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const result = await register(email, password)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <AuthLayout title="Create Account" subtitle="Start building better habits today">
      <form onSubmit={handleSubmit} className="space-y-5">
        <ErrorAlert message={error} />

        <IconInput
          label="Email Address"
          icon={<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <IconInput
          label="Password"
          icon={<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <IconInput
          label="Confirm Password"
          icon={<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <LoadingButton
          type="submit"
          loading={loading}
          loadingLabel="Creating account..."
          icon={<UserPlus size={18} />}
        >
          Create Account
        </LoadingButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-900 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Register
