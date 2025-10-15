import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginForm.scss'

// Mock de usuários para teste
const MOCK_USERS = [
  { email: 'kuvasney@gmail.com', password: '123456' },
  { email: 'user@teste.com', password: 'senha123' }
]

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Verifica credenciais mock
    const user = MOCK_USERS.find(
      u => u.email === email && u.password === password
    )

    if (user) {
      // Login sucesso - salva no localStorage e redireciona
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', email)
      navigate('/notes')
    } else {
      setError('Email ou senha inválidos')
    }

    setIsLoading(false)
  }

  return (
    <section className="login">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-container">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>

        {/* Credenciais para teste */}
        <div className="test-credentials">
          <h4>Credenciais para teste:</h4>
          <p><strong>Admin:</strong> admin@teste.com / 123456</p>
          <p><strong>User:</strong> user@teste.com / senha123</p>
        </div>
      </form>
    </section>
  )
}