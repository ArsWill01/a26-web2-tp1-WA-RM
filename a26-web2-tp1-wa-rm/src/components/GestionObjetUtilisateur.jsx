import {useState} from 'react';
import ModuleObjet from './ModuleObjet.jsx';
import {loginContext} from '../context/LoginContext';
import {useJournalContext} from '../context/JournalContext';

function GestionObjetUtilisateur({objets, setObjets, lesMiens}) {
    const {login} = loginContext();
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
            <h2 style={{fontFamily: "Trebuchet MS, sans-serif", fontSize: "42px", fontWeight: "bold", textAlign: "center", marginBottom: "10px", background: "linear-gradient(90deg, #1976d2, #7b2cbf, #00a896)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                Objets
            </h2>
            <h3 style={{fontFamily: "Arial, sans-serif", textAlign: "center", color: "#666", fontSize: "18px", marginBottom: "30px"}}>Nombre d'objets : {mesObjets.length}</h3>

            {lesMiens && (
                <div style={{display: "flex", justifyContent: "center", marginBottom: "30px"}}>
                    <button type="button" onClick={ouvrirAjout} style={{
                        background: "linear-gradient(90deg, #1976d2, #7b2cbf)",
                        color: "white",
                        border: "none",
                        padding: "14px 32px",
                        borderRadius: "30px",
                        fontSize: "17px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 6px 15px rgba(90, 60, 180, 0.3)"
                    }}>Ajouter</button>
                </div>
            )}


            <div className="gallery" style={{
                background: "#ffffff",
                border: "2px solid #e3dcff",
                borderRadius: "20px",
                padding: "15px",
                boxShadow: "0 6px 18px rgba(70, 50, 150, 0.12)",
                transition: "0.2s"
            }}>
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
                <form key={objetEnEdition.id ?? 'nouveau'} onSubmit={enregistrerObjet} style={{padding: "30px", backgroundColor: "#ffffff", border: "2px solid #000000", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"}}>
                    <h3 style={{fontFamily: "Arial, sans-serif", fontSize: "30px", color: "#000000", marginBottom: "35px"}}>
                        {objetEnEdition.id ? "Modifier l'objet" : "Nouvel objet"}
                    </h3>

                    <label htmlFor="nom" style={{display: "block", fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "#000000", marginBottom: "6px"}}>
                        Nom de l'objet :
                    </label>

                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        defaultValue={objetEnEdition.nom}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "20px",
                            border: "1px solid #000000",
                            borderRadius: "5px",
                            fontSize: "16px",
                            boxSizing: "border-box"
                        }}
                    />

                    <label htmlFor="description" style={{display: "block", fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "#000000", marginBottom: "6px"}}>
                        Description :
                    </label>

                    <input
                        type="text"
                        id="description"
                        name="description"
                        defaultValue={objetEnEdition.description}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "20px",
                            border: "1px solid #000000",
                            borderRadius: "5px",
                            fontSize: "16px",
                            boxSizing: "border-box"
                        }}
                    />

                    <label htmlFor="etat" style={{display: "block", fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "#000000", marginBottom: "6px"}}>
                        État :
                    </label>

                    <input
                        type="text"
                        id="etat"
                        name="etat"
                        defaultValue={objetEnEdition.etat}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "20px",
                            border: "1px solid #000000",
                            borderRadius: "5px",
                            fontSize: "16px",
                            boxSizing: "border-box"
                        }}
                    />

                    <label htmlFor="photo" style={{display: "block", fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "#000000", marginBottom: "6px"}}>
                        URL de la photo :
                    </label>

                    <input
                        type="text"
                        id="photo"
                        name="photo"
                        defaultValue={objetEnEdition.photo}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "20px",
                            border: "1px solid #000000",
                            borderRadius: "5px",
                            fontSize: "16px",
                            boxSizing: "border-box"
                        }}
                    />

                    <label htmlFor="prix" style={{display: "block", fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "#000000", marginBottom: "6px"}}>
                        Prix :
                    </label>

                    <input
                        type="number"
                        id="prix"
                        name="prix"
                        min="0"
                        step="0.01"
                        defaultValue={objetEnEdition.prix}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "25px",
                            border: "1px solid #000000",
                            borderRadius: "5px",
                            fontSize: "16px",
                            boxSizing: "border-box"
                        }}
                    />

                    <div style={{display: "flex", justifyContent: "center", gap: "15px"}}>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: "#000000",
                                color: "#ffffff",
                                border: "2px solid #000000",
                                padding: "11px 25px",
                                borderRadius: "5px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            Enregistrer
                        </button>

                        <button
                            type="button"
                            onClick={() => setObjetEnEdition(null)}
                            style={{
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                border: "2px solid #000000",
                                padding: "11px 25px",
                                borderRadius: "5px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default GestionObjetUtilisateur;
