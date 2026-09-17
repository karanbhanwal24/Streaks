import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export const AuthContext = createContext(null)

const getErrorMessage = (error, fallbackMessage) => {
    if (error.response?.data?.message) {
        return error.response.data.message
    }

    const validationErrors = error.response?.data?.errors
    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        return validationErrors[0].msg || fallbackMessage
    }

    if (error.code === 'ERR_NETWORK') {
        return 'Cannot reach the server. Check that the backend is running and the API URL is configured correctly.'
    }

    return fallbackMessage
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if (token && savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password })
            const { token, user } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            setUser(user)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, 'Login failed'),
            }
        }
    }

    const register = async (email, password) => {
        try {
            const response = await api.post('/api/auth/register', { email, password })
            const { token, user } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            setUser(user)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, 'Registration failed'),
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
