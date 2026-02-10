import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ApiKeyContextValue = {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  headers: () => HeadersInit;
  showKeyModal: boolean;
  triggerKeyModal: () => void;
  closeKeyModal: () => void;
};

const ApiKeyContext = createContext<ApiKeyContextValue | undefined>(undefined);

const STORAGE_KEY = 'gemini_api_key';

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKeyState(stored);
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const clearApiKey = () => {
    setApiKeyState('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const headers = (): HeadersInit => {
    const baseHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      return {
        ...baseHeaders,
        'x-gemini-api-key': apiKey,
      };
    }
    
    return baseHeaders;
  };

  const triggerKeyModal = () => {
    setShowKeyModal(true);
  };

  const closeKeyModal = () => {
    setShowKeyModal(false);
  };

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        setApiKey,
        clearApiKey,
        headers,
        showKeyModal,
        triggerKeyModal,
        closeKeyModal,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within ApiKeyProvider');
  }
  return context;
}
