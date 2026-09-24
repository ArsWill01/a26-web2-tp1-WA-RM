import {useState} from 'react';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import GestionObjetUtilisateur from './components/GestionObjetUtilisateur';
import {LoginContext} from './context/LoginContext';
import {utilisateur} from './scripts/utilisateur';
import Acceuil from "./components/Acceuil.jsx";
import ModuleEchange from "./components/ModuleEchange.jsx";

function App() {
    const [login, setLogin] = useState(null);
    const [page, setPage] = useState('accueil');

    const connecter = (nom, motDePasse) => {
        const trouve = utilisateur.find(
            (u) =>
                u.nom.toLowerCase() === nom.trim().toLowerCase() &&
                u.motDePasse === motDePasse
        );

        if (!trouve) {
            return false;
        }

        setLogin({id: trouve.id, nom: trouve.nom});
        return true;
    };

    const deconnecter = () => {
        setLogin(null);
        setPage('accueil');
    };

    return (
        <LoginContext.Provider value={{login, connecter, deconnecter}}>
            <ResponsiveAppBar onNavigate={setPage}/>

            {page === 'accueil' && <Acceuil/>}
            {page === 'echanges' && <ModuleEchange/>}
            {page === 'objets' && <GestionObjetUtilisateur/>}
        </LoginContext.Provider>
    )
}

export default App
