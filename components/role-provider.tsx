'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Role = 'admin' | 'viewer' | null;

interface RoleContextValue {
  role: Role;
  loading: boolean;
}

const RoleContext = createContext<RoleContextValue>({ role: null, loading: true });

export function useRole() {
  return useContext(RoleContext);
}

export default function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setRole(data.role ?? null);
        setLoading(false);
      })
      .catch(() => {
        setRole(null);
        setLoading(false);
      });
  }, []);

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  );
}
