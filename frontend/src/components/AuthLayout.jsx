function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        <div className="card p-8 border">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
