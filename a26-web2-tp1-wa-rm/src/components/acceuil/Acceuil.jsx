import {useLoginContext} from "../../context/LoginContext.jsx"
import {useState} from "react";
import ConnectionUtilisateur from "../utilisateurs/ConnectionUtilisateur.jsx";
import {estAdmin} from "../../scripts/admin/droits.js";
import '../../styles/acceuil.css';
import '../../styles/theme/boutons.css';
import '../../styles/theme/titres.css';

function Acceuil({onNavigate}) {

    const {login} = useLoginContext();
    const [dialogConnexionOpen, setDialogConnexionOpen] = useState(false);

    return (
        <div className="accueil-container">
            <div className="accueil-card">
                <h1 className="accueil-titre">
                    Troc-O-Deal
                </h1>

                {!login ? (
                    <>
                        <p className="accueil-texte">
                            Vous devez vous connecter pour accéder au site d'échange.
                            <br/>
                            Connectez-vous pour échanger, découvrir et partager en ligne!
                        </p>

                        <button
                            onClick={() => setDialogConnexionOpen(true)}
                            className="btn-principal"
                        >
                            Login/Se Connecter
                        </button>
                    </>
                ) : (
                    <>
                        <p className="accueil-texte">
                            Bienvenue sur mon application, {login.nom}!
                            <br/>
                            Échangez, découvrez et partagez en ligne!.
                        </p>

                        {estAdmin(login) ? (
                            <button onClick={() => onNavigate("admin")} className="btn-principal">
                                Administration
                            </button>
                        ) : (
                            <div className="accueil-boutons-groupe">
                                <button onClick={() => onNavigate("echanges")} className="btn-principal">
                                    Découvrir les échanges
                                </button>

                                <button onClick={() => onNavigate("objets")} className="btn-principal">
                                    Découvrez les objets
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <ConnectionUtilisateur
                open={dialogConnexionOpen}
                onClose={() => setDialogConnexionOpen(false)}
            />
        </div>
    );
}

export default Acceuil;