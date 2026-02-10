import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Home, Table, BarChart3, LogOut } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/habits', label: 'Habit Table', icon: Table },
    { path: '/analysis', label: 'Analysis', icon: BarChart3 },
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">Streaks</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-all text-sm ${isActive(item.path)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                      }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${active ? 'mobile-nav-item-active' : 'mobile-nav-item-inactive'}`}
              >
                <div className={`p-1.5 rounded transition-all ${active ? 'bg-gray-100' : ''}`}>
                  <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="mt-1 text-[10px]">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={logout}
            className="mobile-nav-item mobile-nav-item-inactive"
          >
            <div className="p-1.5 rounded">
              <LogOut size={24} />
            </div>
            <span className="mt-1 text-[10px]">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
