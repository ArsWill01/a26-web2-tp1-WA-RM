import {useState} from 'react';
import ModuleObjet from './ModuleObjet.jsx';
import {useLoginContext} from '../context/LoginContext';
import {useJournalContext} from '../context/JournalContext';
import '../styles/objets.css';
import '../styles/boutons.css';
import '../styles/titres.css';

function GestionObjetUtilisateur({objets, setObjets, lesMiens}) {
    const {login} = useLoginContext();
    const {journaliser} = useJournalContext();
    const [objetEnEdition, setObjetEnEdition] = useState(null);
    const mesObjets = objets.filter((objet) =>
        lesMiens ? objet.idUtilisateur === login?.id : objet.idUtilisateur !== login?.id
    );

    // set objet avec des valeurs vides
    function ouvrirAjout() {
        setObjetEnEdition({nom: '', description: '', etat: '', photo: '', prix: ''});
    }

    // fait un update ou un ajout
    function enregistrerObjet(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const valeurs = {
            nom: formData.get('nom'),
            description: formData.get('description'),
            etat: formData.get('etat'),
            photo: formData.get('photo'),
            prix: Number(formData.get('prix')),
        };

        if (objetEnEdition.id) {
            setObjets(objets.map((objet) =>
                objet.id === objetEnEdition.id ? {...objet, ...valeurs} : objet
            ));
            journaliser(login, 'modification_item', valeurs.nom);
        } else {
            const nouvelId = Math.max(0, ...objets.map((objet) => objet.id)) + 1;
            setObjets([...objets, {id: nouvelId, idUtilisateur: login.id, ...valeurs}]);
            journaliser(login, 'ajout_item', valeurs.nom);
        }

        setObjetEnEdition(null);
    }

    // supprime un objet
    function supprimerObjet(id) {
        journaliser(login, 'retrait_item', objets.find((objet) => objet.id === id)?.nom ?? `#${id}`);
        setObjets(objets.filter((objet) => objet.id !== id));

        if (objetEnEdition?.id === id) {
            setObjetEnEdition(null);
        }
    }

    return (
        <div>
            <h2 className="titre-degrade">
                Objets
            </h2>
            <h3 className="sous-titre">Nombre d'objets : {mesObjets.length}</h3>

            {lesMiens && (
                <div className="objets-bouton-ajout">
                    <button type="button" onClick={ouvrirAjout} className="btn-principal">Ajouter</button>
                </div>
            )}

            <div className="gallery objets-galerie" >
                {mesObjets.map((objet) => (
                    <ModuleObjet
                        key={objet.id}
                        {...objet}
                        selectionne={objetEnEdition?.id === objet.id}
                        onClick={lesMiens ? () => setObjetEnEdition(objet) : undefined}
                        onDelete={lesMiens ? () => supprimerObjet(objet.id) : undefined}
                    />
                ))}
            </div>

            {lesMiens && objetEnEdition && (
                <form key={objetEnEdition.id ?? 'nouveau'} onSubmit={enregistrerObjet} className="objet-form">
                    <h3 className="objet-form-titre">
                        {objetEnEdition.id ? "Modifier l'objet" : "Nouvel objet"}
                    </h3>

                    <label htmlFor="nom" className="objet-form-label">
                        Nom de l'objet :
                    </label>

                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        defaultValue={objetEnEdition.nom}
                        className="objet-form-input"
                    />

                    <label htmlFor="description" className="objet-form-label">
                        Description :
                    </label>

                    <input
                        type="text"
                        id="description"
                        name="description"
                        defaultValue={objetEnEdition.description}
                        className="objet-form-input"
                    />

                    <label htmlFor="etat" className="objet-form-label">
                        État :
                    </label>

                    <input
                        type="text"
                        id="etat"
                        name="etat"
                        defaultValue={objetEnEdition.etat}
                        className="objet-form-input"
                    />

                    <label htmlFor="photo" className="objet-form-label">
                        URL de la photo :
                    </label>

                    <input
                        type="text"
                        id="photo"
                        name="photo"
                        defaultValue={objetEnEdition.photo}
                        className="objet-form-input"
                    />

                    <label htmlFor="prix" className="objet-form-label">
                        Prix :
                    </label>

                    <input
                        type="number"
                        id="prix"
                        name="prix"
                        min="0"
                        step="0.01"
                        defaultValue={objetEnEdition.prix}
                        className="objet-form-input"
                    />

                    <div className="objet-form-actions">
                        <button type="submit" className="btn-noir">
                            Enregistrer
                        </button>

                        <button type="button" onClick={() => setObjetEnEdition(null)} className="btn-blanc-noir">
                            Annuler
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default GestionObjetUtilisateur;
