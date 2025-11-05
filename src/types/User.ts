export interface User {
  username: string;
  email: string;
  ativo: boolean;
  emailVerificado: boolean;
  dataCriacao: string;
  dataUltimaAtualizacao: string;
  id: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
