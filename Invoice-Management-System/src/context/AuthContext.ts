import { createContext } from 'react';
import type { User } from '../domain/types.ts';

export interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
