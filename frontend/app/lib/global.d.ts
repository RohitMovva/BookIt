// types/global.d.ts
declare global {
  interface Window {
    test?: (response: any) => void; // Marking it as optional
  }
}

export {};
