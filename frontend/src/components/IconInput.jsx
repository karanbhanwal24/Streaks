function IconInput({ label, icon, inputClassName = 'input pl-11', wrapperClassName = 'relative', ...inputProps }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <div className={wrapperClassName}>
        {icon}
        <input
          className={inputClassName}
          {...inputProps}
        />
      </div>
    </div>
  )
}

export default IconInput
