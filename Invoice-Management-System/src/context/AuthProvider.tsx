import React, { useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../domain/types.ts';
import { MOCK_USERS } from '../domain/rbac.ts';
import { AuthContext } from './AuthContext.ts';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(MOCK_USERS.ADMIN);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
