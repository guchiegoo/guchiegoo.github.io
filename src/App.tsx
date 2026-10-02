import { Route, Routes } from 'react-router-dom'
import { CatalogProvider } from './catalog/CatalogContext'
import { Layout } from './components/Layout'
import About from './pages/About'
import Faq from './pages/Faq'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import Shop from './pages/Shop'
import Thanks from './pages/Thanks'

/** Routes only; the router itself is supplied by main.tsx (or a MemoryRouter in tests). */
export default function App() {
  return (
    <CatalogProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/p/:code" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </CatalogProvider>
  )
}
