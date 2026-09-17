function PageHeader({ title, subtitle, action, className = 'mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4' }) {
  return (
    <div className={className}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export default PageHeader
