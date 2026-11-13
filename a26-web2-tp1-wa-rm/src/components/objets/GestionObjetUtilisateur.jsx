import {useState} from 'react';
import ModuleObjet from './ModuleObjet.jsx';
import {useLoginContext} from '../../context/LoginContext.jsx';
import {useJournalContext} from '../../context/JournalContext.jsx';
import {addObjet, deleteObjet, updateObjet} from '../../scripts/https.js';
import '../../styles/objets.css';
import '../../styles/theme/boutons.css';
import '../../styles/theme/titres.css';

function GestionObjetUtilisateur({objets, setObjets, lesMiens}) {
    const {login} = useLoginContext();
    const {journaliser} = useJournalContext();
    const [objetEnEdition, setObjetEnEdition] = useState(null);
    const mesObjets = objets.filter((objet) =>
        lesMiens ? objet.uuidUtilisateur === login?.uuid : objet.uuidUtilisateur !== login?.uuid
    );

    // set objet avec des valeurs vides
    function ouvrirAjout() {
        setObjetEnEdition({nom: '', description: '', etat: '', photo: '', prix: ''});
    }

    // fait un update ou un ajout
    async function enregistrerObjet(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const valeurs = {
            nom: formData.get('nom'),
            description: formData.get('description'),
            etat: formData.get('etat'),
            photo: formData.get('photo'),
            prix: Number(formData.get('prix')),
        };

        if (objetEnEdition.uuid) {
            await updateObjet(login.uuid, {...objetEnEdition, ...valeurs});
            setObjets(objets.map((objet) =>
                objet.uuid === objetEnEdition.uuid ? {...objet, ...valeurs} : objet
            ));
            journaliser(login, 'modification_item', valeurs.nom);
        } else {
            const nouveauUuid = await addObjet(login.uuid, valeurs);
            setObjets([...objets, {uuid: nouveauUuid, uuidUtilisateur: login.uuid, ...valeurs}]);
            journaliser(login, 'ajout_item', valeurs.nom);
        }

        setObjetEnEdition(null);
    }

    // supprime un objet
    async function supprimerObjet(uuid) {
        await deleteObjet(uuid);
        journaliser(login, 'retrait_item', objets.find((objet) => objet.uuid === uuid)?.nom ?? `#${uuid}`);
        setObjets(objets.filter((objet) => objet.uuid !== uuid));

        if (objetEnEdition?.uuid === uuid) {
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

            <div className="gallery objets-galerie">
                {mesObjets.map((objet) => (
                    <ModuleObjet
                        key={objet.uuid}
                        {...objet}
                        selectionne={objetEnEdition?.uuid === objet.uuid}
                        onClick={lesMiens ? () => setObjetEnEdition(objet) : undefined}
                        onDelete={lesMiens ? () => supprimerObjet(objet.uuid) : undefined}
                    />
                ))}
            </div>

            {lesMiens && objetEnEdition && (
                <form key={objetEnEdition.uuid ?? 'nouveau'} onSubmit={enregistrerObjet} className="objet-form">
                    <h3 className="objet-form-titre">
                        {objetEnEdition.uuid ? "Modifier l'objet" : "Nouvel objet"}
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
