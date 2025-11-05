export interface ElectronAPI {
  isElectron: boolean;
  platform: string;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};
