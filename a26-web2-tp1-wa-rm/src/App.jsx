import { useState } from 'react';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import { LoginContext } from './context/LoginContext';
import { utilisateur } from './scripts/utilisateur';

function App() {
  const [login, setLogin] = useState(null);

  const connecter = (nom, motDePasse) => {
      const trouve = utilisateur.find(
          (u) =>
              u.nom.toLowerCase() === nom.trim().toLowerCase() &&
              u.motDePasse === motDePasse
      );

      if (!trouve) {
          return false;
      }

      setLogin({ id: trouve.id, nom: trouve.nom });
      return true;
  };

  const deconnecter = () => {
      setLogin(null);
  };

  return (
    <LoginContext.Provider value={{ login, connecter, deconnecter }}>
        <ResponsiveAppBar />

        <div>
            <h1>Mon site d'échange</h1>
            <p>Bienvenue sur mon application (test de structure)</p>
        </div>
    </LoginContext.Provider>
  )
}

export default App
