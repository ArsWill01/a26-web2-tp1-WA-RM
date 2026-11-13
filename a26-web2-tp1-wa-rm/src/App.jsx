import {useEffect, useState} from 'react';
import ResponsiveAppBar from './components/layout/ResponsiveAppBar.jsx';
import GestionObjetUtilisateur from './components/objets/GestionObjetUtilisateur.jsx';
import SouhaitUtilisateur from './components/souhait/SouhaitUtilisateur.jsx';
import {LoginContext} from './context/LoginContext';
import {fetchAllObjetsAsync, fetchAllSouhaitsAsync, fetchAllUtilisateursAsync} from "./scripts/https.js";
import './App.css';
import Acceuil from "./components/acceuil/Acceuil.jsx";
import ModuleEchange from "./components/echanges/ModuleEchange.jsx";
import {propositionsInitiales} from "./scripts/echange.js";
import ModuleAdmin from "./components/admin/ModuleAdmin.jsx";
import {JournalContext, useJournal} from './context/JournalContext';

function App() {
    const [login, setLogin] = useState(null);
    const [page, setPage] = useState('accueil');
    const [listeObjets, setListeObjets] = useState([]);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [propositions, setPropositions] = useState(propositionsInitiales);
    const [souhaits, setSouhaits] = useState([]);
    const {activites, journaliser} = useJournal();
    //const [error, setError] = useState({error: undefined, message: ""})
    //const [isFetching, setFetching] = useState(false);

    useEffect(() => {
        async function fetchData() {
            //setFetching(true);
            try {
                const data = await fetchAllUtilisateursAsync();
                setUtilisateurs(data);
                setListeObjets(await fetchAllObjetsAsync());
                setSouhaits(await fetchAllSouhaitsAsync());
            //} catch (error) {
                //setError({ error: "error", message: error.message });
            } finally {
                //setFetching(false)
            }
        }

        fetchData();
    }, [fetchAllUtilisateursAsync]);

    const utilisateurCourant = login ? utilisateurs.find((u) => u.uuid === login.uuid) : null;
    const loginCourant = utilisateurCourant
        ? {
            uuid: utilisateurCourant.uuid,
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

        setLogin({uuid: trouve.uuid, nom: trouve.nom});
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
