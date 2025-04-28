import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const RootLayout = () => {
  // Temporary mock categories, replace with real data later
  const categories = [ { id: '1', name: 'Electronics' }, { id: '2', name: 'Accesories' }]

  return (
    <div>
      <Navbar categories={categories} />
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout
