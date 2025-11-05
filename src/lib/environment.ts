export const isElectron = (): boolean => {
  return !!window.electron?.isElectron;
};

export const getPlatform = (): string => {
  return window.electron?.platform || "web";
};

export const isDesktop = (): boolean => {
  return isElectron();
};

export const isWeb = (): boolean => {
  return !isElectron();
};

export const getEnvironmentInfo = () => {
  return {
    isElectron: isElectron(),
    isWeb: isWeb(),
    isDesktop: isDesktop(),
    platform: getPlatform(),
    userAgent: navigator.userAgent,
  };
};
