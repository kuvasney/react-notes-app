import { Routes, Route } from 'react-router-dom'
import './App.scss'
import Home from './pages/Home'
import Notes from './pages/Notes'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Archive from './pages/Notes/Archive'

function App() {

  return (
    <div className='wrapper-content'>
      <Header />
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
