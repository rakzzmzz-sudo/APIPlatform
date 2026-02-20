"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { User } from '@db/db-js';
import { db, Profile, User } from '../lib/db';

type CompanyInfo = {
  companyName: string;
  companyRegistrationNumber?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  country?: string;
};

type MenuAccess = {
  menu_key: string;
  menu_name: string;
  is_enabled: boolean;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  menuAccess: MenuAccess[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, companyInfo: CompanyInfo) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasMenuAccess: (menuKey: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuAccess, setMenuAccess] = useState<MenuAccess[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  };

  const fetchMenuAccess = async (userId: string) => {
    const { data, error } = await db
      .from('menu_access_control')
      .select('menu_key, menu_name, is_enabled')
      .eq('user_id', userId)
      .eq('is_enabled', true);

    if (error) {
      console.error('Error fetching menu access:', error);
      return [];
    }

    return data || [];
  };

  const hasMenuAccess = (menuKey: string) => {
    if (profile?.role === 'admin') return true;
    if (menuAccess.length === 0) return true;
    return menuAccess.some(menu => menu.menu_key === menuKey && menu.is_enabled);
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
      const menuData = await fetchMenuAccess(user.id);
      setMenuAccess(menuData);
    }
  };

  useEffect(() => {
    // Restore session from localStorage
    const storedUser = localStorage.getItem('cpaas_user');
    const storedProfile = localStorage.getItem('cpaas_profile');

    if (storedUser && storedProfile) {
      setUser(JSON.parse(storedUser));
      setProfile(JSON.parse(storedProfile));
      setMenuAccess([]); // Empty means full access
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Predefined credentials
      const predefinedUsers = [
        { email: 'admin@cpaas.com', password: 'admin123', role: 'admin' as const, name: 'Admin User'},
        { email: 'presales@cpaas.com', password: 'presales123', role: 'user' as const, name: 'Presales User' },
        { email: 'sales@cpaas.com', password: 'sales123', role: 'user' as const, name: 'Sales User' },
      ];

      const matchedUser = predefinedUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!matchedUser) {
        return { error: new Error('Invalid email or password') };
      }

      // Create mock user and profile with all required fields
      const mockUser: User = {
        id: matchedUser.email,
        aud: 'authenticated',
        role: 'authenticated',
        email: matchedUser.email,
        app_metadata: { role: matchedUser.role },
        user_metadata: { full_name: matchedUser.name },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockProfile: Profile = {
        id: matchedUser.email,
        email: matchedUser.email,
        full_name: matchedUser.name,
        organization_name: null,
        balance: 1000.00,
        role: matchedUser.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store in localStorage for persistence
      localStorage.setItem('cpaas_user', JSON.stringify(mockUser));
      localStorage.setItem('cpaas_profile', JSON.stringify(mockProfile));

      setUser(mockUser);
      setProfile(mockProfile);
      setMenuAccess([]); // Empty means full access for all

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, companyInfo: CompanyInfo) => {
    try {
      const { data: authData, error: authError } = await db.auth.signUp({
        email,
        password,
      });

      if (authError) return { error: authError };

      if (authData.user) {
        const { error: profileError } = await db
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            balance: 6.00,
            role: 'user',
          });

        if (profileError) return { error: profileError };

        const slug = companyInfo.companyName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const { data: tenantData, error: tenantError } = await db
          .from('tenants')
          .insert({
            name: companyInfo.companyName,
            slug: `${slug}-${Date.now()}`,
            contact_email: email,
            contact_phone: companyInfo.contactPhone || null,
            company_registration_number: companyInfo.companyRegistrationNumber || null,
            address: companyInfo.address || null,
            city: companyInfo.city || null,
            country: companyInfo.country || null,
            status: 'active',
            subscription_tier: 'free',
          })
          .select()
          .single();

        if (tenantError) {
          console.error('Error creating tenant:', tenantError);
          return { error: tenantError };
        }

        const { error: tenantUserError } = await db
          .from('tenant_users')
          .insert({
            tenant_id: tenantData.id,
            user_id: authData.user.id,
            role: 'tenant_admin',
            is_active: true,
          });

        if (tenantUserError) {
          console.error('Error linking user to tenant:', tenantUserError);
          return { error: tenantUserError };
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('cpaas_user');
    localStorage.removeItem('cpaas_profile');
    setUser(null);
    setProfile(null);
    setMenuAccess([]);
  };

  return (
    <AuthContext.Provider value={{ user, profile, menuAccess, loading, signIn, signUp, signOut, refreshProfile, hasMenuAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
