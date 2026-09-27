import {useState} from 'react';
import ModuleObjet from './ModuleObjet.jsx';

function GestionObjetUtilisateur({objets, setObjets}) {
    const [objetEnEdition, setObjetEnEdition] = useState(null);

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
        } else {
            const nouvelId = Math.max(0, ...objets.map((objet) => objet.id)) + 1;
            setObjets([...objets, {id: nouvelId, ...valeurs}]);
        }

        setObjetEnEdition(null);
    }

    // supprime un objet
    function supprimerObjet(id) {
        setObjets(objets.filter((objet) => objet.id !== id));

        if (objetEnEdition?.id === id) {
            setObjetEnEdition(null);
        }
    }

    return (
        <>
            <h2>Objets</h2>
            <h3>Nombre d'objets : {objets.length}</h3>

            <button type="button" onClick={ouvrirAjout}>Ajouter</button>

            <div className="gallery">
                {objets.map((objet) => (
                    <ModuleObjet
                        key={objet.id}
                        {...objet}
                        selectionne={objetEnEdition?.id === objet.id}
                        onClick={() => setObjetEnEdition(objet)}
                        onDelete={() => supprimerObjet(objet.id)}
                    />
                ))}
            </div>

            {objetEnEdition && (
                <form key={objetEnEdition.id ?? 'nouveau'} onSubmit={enregistrerObjet}>
                    <h3>{objetEnEdition.id ? "Modifier l'objet" : 'Nouvel objet'}</h3>

                    <label htmlFor="nom">Nom de l'objet :</label><br/>
                    <input type="text" id="nom" name="nom" defaultValue={objetEnEdition.nom}/><br/>
                    <label htmlFor="description">Description :</label><br/>
                    <input type="text" id="description" name="description"
                           defaultValue={objetEnEdition.description}/><br/>
                    <label htmlFor="etat">État :</label><br/>
                    <input type="text" id="etat" name="etat" defaultValue={objetEnEdition.etat}/><br/>
                    <label htmlFor="photo">URL de la photo :</label><br/>
                    <input type="text" id="photo" name="photo" defaultValue={objetEnEdition.photo}/><br/>
                    <label htmlFor="prix">Prix :</label><br/>
                    <input type="number" id="prix" name="prix" min="0" step="0.01"
                           defaultValue={objetEnEdition.prix}/><br/>

                    <button type="submit">Enregistrer</button>
                    <button type="button" onClick={() => setObjetEnEdition(null)}>Annuler</button>
                </form>
            )}
        </>
    );
}

export default GestionObjetUtilisateur;
