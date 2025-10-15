import { ReactElement } from 'react'

export const renderTextWithBreaks = (text: string): ReactElement[] | null => {
  // Tratar casos edge
  if (!text) return null

  return text
    .trim() // Remove espaços extras
    .split('\n')
    .map((line, index, array) => {
      if (line.length > 0) {
        return (
          <span key={index}>
            {line}
            {index < array.length - 1 && <br />}
          </span>
        )
      }
      return <br key={index} />
    })
}

// Outras funções utilitárias podem ser adicionadas aqui
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Função para truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Função para gerar IDs únicos
export const generateId = (): string => {
  return `note_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}


export default {
  renderTextWithBreaks,
  formatDate,
  formatDateTime,
  truncateText,
  generateId
}
