// global.d.ts
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: {
              theme: string;
              size: string;
              text: string;
            },
          ) => void;
        };
      };
    };
  }
}

// This is needed for the file to be a module
export {};
