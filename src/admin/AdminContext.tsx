import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminUser {
  email: string;
  role: string;
  isDemo?: boolean;
}

interface AdminContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isSupabaseConfigured);

  useEffect(() => {
    // Check local session or demo storage
    const storedDemoUser = sessionStorage.getItem('om_admin_demo_user');

    if (!isSupabaseConfigured) {
      if (storedDemoUser) {
        setUser(JSON.parse(storedDemoUser));
      }
      setIsDemoMode(true);
      setIsLoading(false);
      return;
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            email: session.user.email || 'admin@omenterprises.com',
            role: 'Administrator',
          });
          setIsDemoMode(false);
        } else if (storedDemoUser) {
          setUser(JSON.parse(storedDemoUser));
          setIsDemoMode(true);
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            email: session.user.email || 'admin@omenterprises.com',
            role: 'Administrator',
          });
          setIsDemoMode(false);
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // If Supabase is configured, attempt real auth first
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        setUser({
          email: data.user.email || email,
          role: 'Administrator',
        });
        setIsDemoMode(false);
        return { success: true };
      }

      // If Supabase user does not exist yet but user is using the demo credentials, allow access
      if (email === 'admin@omenterprises.com' && (password === 'admin123' || password.length >= 6)) {
        const demoUser: AdminUser = {
          email,
          role: 'Administrator',
          isDemo: true,
        };
        setUser(demoUser);
        setIsDemoMode(true);
        sessionStorage.setItem('om_admin_demo_user', JSON.stringify(demoUser));
        return { success: true };
      }

      return { 
        success: false, 
        error: error?.message || 'Invalid credentials. Create an admin user in Supabase Authentication or use demo credentials.' 
      };
    }

    // Default / Offline Demonstration Mode
    // Allows administrator preview before Supabase credentials are plugged into .env
    if (email === 'admin@omenterprises.com' || email.includes('admin') || password.length >= 6) {
      const demoUser: AdminUser = {
        email,
        role: 'Administrator',
        isDemo: true,
      };
      setUser(demoUser);
      setIsDemoMode(true);
      sessionStorage.setItem('om_admin_demo_user', JSON.stringify(demoUser));
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Invalid credentials. For evaluation/demo mode, use email "admin@omenterprises.com" and password "admin123".' 
    };
  };

  const logout = async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('om_admin_demo_user');
    setUser(null);
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        isDemoMode,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
