function LoadingScreen({ withNavbar = false, navbar, size = 'h-12 w-12', className = 'py-20' }) {
  return (
    <div className="min-h-screen bg-white">
      {withNavbar && navbar}
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`animate-spin rounded-full ${size} border-2 border-gray-900 border-t-transparent`}></div>
      </div>
    </div>
  )
}

export default LoadingScreen
