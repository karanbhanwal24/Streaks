function LoadingButton({ loading, loadingLabel, icon, children, className = 'btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm', ...buttonProps }) {
  return (
    <button
      className={className}
      disabled={loading}
      {...buttonProps}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          {loadingLabel}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  )
}

export default LoadingButton
