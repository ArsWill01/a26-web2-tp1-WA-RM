import { createContext, useContext } from 'react';

export const LoginContext = createContext(null);

export function useLoginContext() {
    return useContext(LoginContext);
}
