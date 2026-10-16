import {useState} from 'react';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import GestionObjetUtilisateur from './components/GestionObjetUtilisateur';
import {LoginContext} from './context/LoginContext';
import {utilisateur} from './scripts/utilisateur';
import {objets} from './scripts/objets';
import './App.css';
import Acceuil from "./components/Acceuil.jsx";
import ModuleEchange from "./components/ModuleEchange.jsx";
import {propositionsInitiales} from "./scripts/echange.js";

function App() {
    const [login, setLogin] = useState(null);
    const [page, setPage] = useState('accueil');
    const [listeObjets, setListeObjets] = useState(objets);
    const [utilisateurs, setUtilisateurs] = useState(utilisateur);
    const [propositions, setPropositions] = useState(propositionsInitiales);

    const connecter = (nom, motDePasse) => {
        const trouve = utilisateurs.find(
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

            {page === 'accueil' && <Acceuil onNavigate={setPage}/>}
            {page === 'echanges' && <ModuleEchange
                propositions={propositions}
                setPropositions={setPropositions}
                objets={listeObjets}
                setObjets={setListeObjets}
                utilisateurs={utilisateurs}
                setUtilisateurs={setUtilisateurs}
            />
            }
            {page === 'objets' && <GestionObjetUtilisateur objets={listeObjets} setObjets={setListeObjets}/>}
        </LoginContext.Provider>
    );
}

export default App
