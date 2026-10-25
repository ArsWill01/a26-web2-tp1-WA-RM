import {useState} from 'react';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import GestionObjetUtilisateur from './components/GestionObjetUtilisateur';
import SouhaitUtilisateur from './components/SouhaitUtilisateur';
import {LoginContext} from './context/LoginContext';
import {utilisateur} from './scripts/utilisateur';
import {objets} from './scripts/objets';
import {souhait} from './scripts/souhait.js';
import './App.css';
import Acceuil from "./components/Acceuil.jsx";
import ModuleEchange from "./components/ModuleEchange.jsx";
import {propositionsInitiales} from "./scripts/echange.js";
import ModuleAdmin from "./components/ModuleAdmin.jsx";
import {JournalContext, useJournal} from './context/JournalContext';

function App() {
    const [login, setLogin] = useState(null);
    const [page, setPage] = useState('accueil');
    const [listeObjets, setListeObjets] = useState(objets);
    const [utilisateurs, setUtilisateurs] = useState(utilisateur);
    const [propositions, setPropositions] = useState(propositionsInitiales);
    const [souhaits, setSouhaits] = useState(souhait);
    const {activites, journaliser} = useJournal();

    const utilisateurCourant = login ? utilisateurs.find((u) => u.id === login.id) : null;
    const loginCourant = utilisateurCourant
        ? {
            id: utilisateurCourant.id,
            nom: utilisateurCourant.nom,
            role: utilisateurCourant.role,
            droits: utilisateurCourant.droits,
        }
        : null;

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
        journaliser(trouve, 'connexion');
        return true;
    };

    const deconnecter = () => {
        journaliser(loginCourant, 'deconnexion');
        setLogin(null);
        setPage('accueil');
    };

    // Fait par Claude
    const naviguer = (nouvellePage) => {
        if (loginCourant) {
            journaliser(loginCourant, 'consultation', `Page ${nouvellePage}`);
        }
        setPage(nouvellePage);
    };

    return (
        <JournalContext.Provider value={{activites, journaliser}}>
        <LoginContext.Provider value={{login: loginCourant, connecter, deconnecter}}>
            <ResponsiveAppBar onNavigate={naviguer}/>

            {page === 'accueil' && <Acceuil onNavigate={naviguer}/>}
            {page === 'echanges' && <ModuleEchange
                propositions={propositions}
                setPropositions={setPropositions}
                objets={listeObjets}
                setObjets={setListeObjets}
                utilisateurs={utilisateurs}
                setUtilisateurs={setUtilisateurs}
            />
            }
            {page === 'objets' && <GestionObjetUtilisateur objets={listeObjets} setObjets={setListeObjets} lesMiens={true}/>}
            {page === 'souhaits' && <SouhaitUtilisateur souhaits={souhaits} setSouhaits={setSouhaits}/>}
            {page === 'autreObjets' && <GestionObjetUtilisateur objets={listeObjets} setObjets={setListeObjets} lesMiens={false}/>}
            {page === 'admin' && <ModuleAdmin utilisateurs={utilisateurs} setUtilisateurs={setUtilisateurs}/>}
        </LoginContext.Provider>
        </JournalContext.Provider>
    );
}

export default App
