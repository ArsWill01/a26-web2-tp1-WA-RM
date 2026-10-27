import {useState} from "react";

function FormPropositionEchange({mode, propositionOriginale, mesObjets, objetsDesAutres, utilisateurs, propositions, setPropositions, login,}) {
    const [recepteurId, setRecepteurId] = useState(
        mode === 'contre' ? propositionOriginale.proposeurId : ''
    );

    const [itemsOfferts, setItemsOfferts] = useState(
        mode === 'contre' ? propositionOriginale.itemsOfferts : []
    );

    const [itemsDemandes, setItemsDemandes] = useState(
        mode === 'contre' ? propositionOriginale.itemsDemandes : []
    );

    const [erreur, setErreur] = useState('');

    function sommeUnites(ids) {
        return ids.reduce((total, id) => {
            const obj = [...mesObjets, ...objetsDesAutres].find((o) => o.id === id);
            return total + (obj?.unites ?? 0);
        }, 0);
    }

    const balance = sommeUnites(itemsOfferts) - sommeUnites(itemsDemandes);

    function toggleItem(id, liste, setListe) {
        if (liste.includes(id)) {
            setListe(liste.filter((i) => i !== id));
        } else {
            setListe([...liste, id]);
        }
    }

    const itemsDemandesPossibles = objetsDesAutres.filter(
        (o) => o.proprietaireId === Number(recepteurId)
    );

    function handleSubmit(event) {
        event.preventDefault();
        setErreur('');

        if (!recepteurId) {
            setErreur('Veuillez choisir un destinataire.');
            return;
        }
        if (itemsOfferts.length === 0 || itemsDemandes.length === 0) {
            setErreur('Vous devez offrir et demander au moins un item.');
            return;
        }

        // contre-proposition : au moins un item identique à la proposition initiale
        if (mode === 'contre') {
            const itemsInitiaux = [
                ...propositionOriginale.itemsOfferts,
                ...propositionOriginale.itemsDemandes,
            ];
            const itemsCourants = [...itemsOfferts, ...itemsDemandes];
            const aItemCommun = itemsCourants.some((id) => itemsInitiaux.includes(id));
            if (!aItemCommun) {
                setErreur(
                    'Une contre-proposition doit contenir au moins un item identique à la proposition initiale.'
                );
                return;
            }
        }

        const nouvelId = Math.max(0, ...propositions.map((p) => p.id)) + 1;

        // Lorsqu'on est en mode 'contre', on marque la proposition originale comme 'contre_proposition'
        // puis on lui crée une nouvelle proposition liée par parentId.
        if (mode === 'contre') {
            setPropositions([
                ...propositions.map((p) =>
                    p.id === propositionOriginale.id
                        ? {...p, statut: 'contre_proposition'}
                        : p
                ),
                {
                    id: nouvelId,
                    proposeurId: login.id,
                    recepteurId: Number(recepteurId),
                    itemsOfferts,
                    itemsDemandes,
                    statut: 'en_attente',
                    parentId: propositionOriginale.id,
                },
            ]);
        } else {
            setPropositions([
                ...propositions,
                {
                    id: nouvelId,
                    proposeurId: login.id,
                    recepteurId: Number(recepteurId),
                    itemsOfferts,
                    itemsDemandes,
                    statut: 'en_attente',
                    parentId: null,
                },
            ]);
        }
    }

    const destinatairesPossibles = utilisateurs.filter((u) => u.id !== login.id);

    return (
        <form onSubmit={handleSubmit}
          style={{
              padding: "30px",
              backgroundColor: "#ffffff",
              border: "2px solid #000000",
              borderRadius: "20px",
              boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.15)",
              maxWidth: "800px",
              margin: "0 auto"
          }}
        >
            <h3 style={{fontFamily: "Arial, sans-serif", fontSize: "30px", color: "#000000", marginBottom: "35px"}}>
                {mode === 'contre' ? 'Contre-proposition' : 'Nouvelle proposition'}
            </h3>

            <label style={{display: "block", fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "#000000", marginBottom: "8px"}}>
                Destinataire :
                <select
                    value={recepteurId}
                    onChange={(e) => {
                        setRecepteurId(e.target.value);
                        setItemsDemandes([]);   // reset car les items disponibles changent
                    }}
                    disabled={mode === 'contre'}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "25px",
                        border: "1px solid #000000",
                        borderRadius: "5px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        backgroundColor: "#ffffff"
                    }}
                >
                    <option value="">-- Choisir --</option>
                    {destinatairesPossibles.map((u) => (
                        <option key={u.id} value={u.id}>{u.nom}</option>
                    ))}
                </select>
            </label>

            <fieldset style={{border: "1px solid #000000", padding: "20px", marginBottom: "25px", borderRadius: "5px"}}>
                <legend style={{fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "#000000", padding: "0 8px"}}>Mes items offerts</legend>
                {mesObjets.length === 0 && <p style={{fontFamily: "Arial, sans-serif", color: "#555"}}>Vous n'avez aucun objet.</p>}
                {mesObjets.map((o) => (
                    <label key={o.id} style={{display: "block", fontFamily: "Arial, sans-serif", color: "#000000", marginBottom: "10px", cursor: "pointer"}}>
                        <input
                            type="checkbox"
                            checked={itemsOfferts.includes(o.id)}
                            onChange={() => toggleItem(o.id, itemsOfferts, setItemsOfferts)}
                            style={{
                                marginRight: "8px"
                            }}
                        />
                        {o.nom} ({o.unites ?? 0} unités)
                    </label>
                ))}
            </fieldset>

            <fieldset style={{border: "1px solid #000000", padding: "20px", marginBottom: "25px", borderRadius: "5px"}}>
                <legend style={{fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "#000000", padding: "0 8px"}}>Items demandés</legend>
                {itemsDemandesPossibles.length === 0 && (
                    <p style={{fontFamily: "Arial, sans-serif", color: "#555"}}>Choisissez d'abord un destinataire.</p>
                )}
                {itemsDemandesPossibles.map((o) => (
                    <label key={o.id} style={{display: "block", fontFamily: "Arial, sans-serif", color: "#000000", marginBottom: "10px", cursor: "pointer"}}>
                        <input
                            type="checkbox"
                            checked={itemsDemandes.includes(o.id)}
                            onChange={() => toggleItem(o.id, itemsDemandes, setItemsDemandes)}
                            style={{marginRight: "8px"}}
                        />
                        {o.nom} ({o.unites ?? 0} unités)
                    </label>
                ))}
            </fieldset>

            <p style={{borderTop: "1px solid #000000", borderBottom: "1px solid #000000", padding: "15px 0", marginBottom: "20px", fontFamily: "Arial, sans-serif", color: "#000000"}}>
                Balance : <strong>{balance}</strong> unité(s)
                {balance > 0 && ' (en votre faveur)'}
                {balance < 0 && ' (en défaveur)'}
            </p>

            {erreur && <p style={{color: 'red'}}>{erreur}</p>}

            <button type="submit"
                    style={{
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        border: "2px solid #000000",
                        padding: "12px 30px",
                        borderRadius: "5px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
            >
                {mode === 'contre' ? 'Envoyer la contre-proposition' : 'Proposer'}
            </button>
        </form>
    );
}

export default FormPropositionEchange;