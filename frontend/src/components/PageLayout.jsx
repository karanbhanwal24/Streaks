import Navbar from './Navbar'

function PageLayout({ children, withNavbar = false, containerClassName = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' }) {
  return (
    <div className="min-h-screen bg-white">
      {withNavbar && <Navbar />}
      <div className={containerClassName}>
        {children}
      </div>
    </div>
  )
}

export default PageLayout
