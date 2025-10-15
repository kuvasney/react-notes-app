import { useLocation, useNavigate } from 'react-router-dom'
import { useNotesStore } from '@/stores/notesStore'
import './Header.scss'

export default function Header () {
    const location = useLocation()
    const navigate = useNavigate()
    const { reset } = useNotesStore()
    const isHomePage = location.pathname === '/'

    const logout = () => {
      try {
        reset()
        // Navegar usando React Router (sem recarregar a página)
        navigate('/', { replace: true })
      } catch (error) {
        console.error('Error resetting notes store:', error)
        // Em caso de erro, fallback para navegação tradicional
        window.location.href = '/'
      }
    }

    return (
        <div className="page-header">
            <p>Logo</p>
            {!isHomePage && <a onClick={logout}>Exit</a>}
        </div>
    )
}
