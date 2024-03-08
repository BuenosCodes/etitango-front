import React, { createContext, useState, useContext, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';

interface IGlobalState {
  isOpen: boolean;
  toggleOpen: () => void;
  isMobile: boolean;
}

const message = 'useGlobalState must be used within a GlobalStateProvider';
const userPanelContext = createContext<IGlobalState | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState<boolean>(!isMobile);

  useEffect(() => {
    setIsOpen(!isOpen);
  }, [isMobile]);

  const toggleOpen = () => {
    if (isMobile) {
      setIsOpen((prevOpen) => !prevOpen);
    }
  };

  const contextValue: IGlobalState = {
    isOpen,
    toggleOpen,
    isMobile
  };

  return <userPanelContext.Provider value={contextValue}>{children}</userPanelContext.Provider>;
};

export const useGlobalState = (): IGlobalState => {
  const context = useContext(userPanelContext);
  if (!context) {
    throw new Error(message);
  }
  return context;
};