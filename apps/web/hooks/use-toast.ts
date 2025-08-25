import * as React from "react"; 

export function useToast() { 
  return { 
    toasts: [], 
    toast: () => {}, 
    dismiss: () => {} 
  }; 
}
