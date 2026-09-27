import { createContext, useContext } from 'react';

export const LoginContext = createContext(null);

export function loginContext() {
    return useContext(LoginContext);
}
