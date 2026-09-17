import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LogIn, Mail, Lock } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import ErrorAlert from '../components/ErrorAlert'
import IconInput from '../components/IconInput'
import LoadingButton from '../components/LoadingButton'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <AuthLayout title="Sign In" subtitle="Track your daily habits">
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

        <LoadingButton
          type="submit"
          loading={loading}
          loadingLabel="Signing in..."
          icon={<LogIn size={18} />}
        >
          Sign In
        </LoadingButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-gray-900 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
