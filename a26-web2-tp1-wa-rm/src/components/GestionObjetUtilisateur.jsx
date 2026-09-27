import { useState } from 'react';
import ModuleObjet from './ModuleObjet.jsx';

function GestionObjetUtilisateur({ objets, setObjets }) {
    const [isEditing, setIsEditing] = useState(false);

    function handleToggleEditing() {
        setIsEditing((oldEditing) => !oldEditing);
    }

    function ajouteObjet(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const nouvelObjet = {
            id: Math.max(0, ...objets.map((objet) => objet.id)) + 1,
            nom: formData.get('nom'),
            description: formData.get('description'),
            etat: formData.get('etat'),
            photo: formData.get('photo'),
            prix: Number(formData.get('prix')),
            selected: false
        };

        setObjets([...objets, nouvelObjet]);
        event.target.reset();
    }

    function retireObjet(id) {
        setObjets(objets.filter((objet) => objet.id !== id));
    }

    function toggleSelected(id) {
        setObjets(objets.map((objet) =>
            ({ ...objet, selected: objet.id === id ? !objet.selected : false })
        ));
    }

    return (
        <>
            <h2>Objets</h2>
            <h3>
                Nombre d'objets : {objets.length} ({objets.filter((objet) => objet.selected).length} sont sélectionnés)
            </h3>

            <div>
                <input type="checkbox" id="edit-mode" onClick={handleToggleEditing}/>
                <label htmlFor="edit-mode">Mode édition</label>
            </div>

            <div className="gallery">
                {objets.map((objet) => (
                    <ModuleObjet
                        key={objet.id}
                        width="300"
                        {...objet}
                        onImageClick={() => toggleSelected(objet.id)}
                        Decoration={() => isEditing && (
                            <button type="button" className="remove-button" onClick={() => retireObjet(objet.id)}>
                                X
                            </button>
                        )}
                    >
                        {objet.selected && <div className="selected">Sélectionné</div>}
                    </ModuleObjet>
                ))}
            </div>

            {isEditing && (
                <form onSubmit={ajouteObjet}>
                    <label htmlFor="nom">Nom de l'objet :</label><br/>
                    <input type="text" id="nom" name="nom"/><br/>
                    <label htmlFor="description">Description :</label><br/>
                    <input type="text" id="description" name="description"/><br/>
                    <label htmlFor="etat">État :</label><br/>
                    <input type="text" id="etat" name="etat"/><br/>
                    <label htmlFor="photo">URL de la photo :</label><br/>
                    <input type="text" id="photo" name="photo"/><br/>
                    <label htmlFor="prix">Prix :</label><br/>
                    <input type="number" id="prix" name="prix" min="0" step="0.01"/><br/>
                    <button type="submit">Ajouter le nouvel objet</button>
                </form>
            )}
        </>
    );
}

export default GestionObjetUtilisateur;
