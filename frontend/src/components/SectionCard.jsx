function SectionCard({ children, className = 'card p-6 border' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default SectionCard
