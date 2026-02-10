import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'youtube' | 'instagram' | 'business';

export type UserProfile = {
  userType?: UserType;
  name?: string;
  email?: string;
  niche?: string;
  struggle?: string;
  style?: string;
  goal?: string;
  offer?: string;
  audience?: string;
  videoLength?: string;
  subscribers?: string;
  reelViews?: string;
  postFrequency?: string;
  companyName?: string;
  brandVoice?: string[];
  contentBudget?: string;
  platforms?: string[];
  completedAt?: string;
};

type UserProfileContextValue = {
  userProfile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  clearProfile: () => void;
  isOnboarded: boolean;
  isBusiness: boolean;
  isCreator: boolean;
};

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

const STORAGE_KEY = 'prolytic:onboarding';

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserProfile(parsed);
      } catch (error) {
        console.error('Failed to parse user profile:', error);
      }
    }
  }, []);

  const updateProfile = (patch: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearProfile = () => {
    setUserProfile({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const isOnboarded = Boolean(userProfile.userType && userProfile.completedAt);
  const isBusiness = userProfile.userType === 'business';
  const isCreator = userProfile.userType === 'youtube' || userProfile.userType === 'instagram';

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        updateProfile,
        clearProfile,
        isOnboarded,
        isBusiness,
        isCreator,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
}
