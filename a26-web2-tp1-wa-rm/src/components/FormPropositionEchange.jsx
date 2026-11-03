import {useState} from "react";
import {aLeDroit} from "../scripts/droits";
import {useJournalContext} from "../context/JournalContext";
import '../styles/echanges.css';
import '../styles/boutons.css';

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
    const {journaliser} = useJournalContext();

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

        if (!aLeDroit(login, mode === 'contre' ? 'contreProposer' : 'proposer')) {
            setErreur(mode === 'contre'
                ? "Vous n'avez pas le droit de contre-proposer."
                : "Vous n'avez pas le droit de faire une proposition.");
            return;
        }

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
            const itemsInitiaux = [...propositionOriginale.itemsOfferts, ...propositionOriginale.itemsDemandes];
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

        const nomRecepteur = utilisateurs.find((u) => u.id === Number(recepteurId))?.nom ?? '?';
        journaliser(
            login,
            mode === 'contre' ? 'contre_proposition' : 'proposition',
            mode === 'contre'
                ? `Proposition #${nouvelId} envoyée à ${nomRecepteur} (contre la #${propositionOriginale.id})`
                : `Proposition #${nouvelId} envoyée à ${nomRecepteur}`
        );
    }

    const destinatairesPossibles = utilisateurs.filter((u) => u.id !== login.id);

    return (
        <form onSubmit={handleSubmit} className="proposition-form">
            <h3 className="proposition-form-titre">
                {mode === 'contre' ? 'Contre-proposition' : 'Nouvelle proposition'}
            </h3>

            <label className="proposition-label">
                Destinataire :
                <select
                    value={recepteurId}
                    onChange={(e) => {
                        setRecepteurId(e.target.value);
                        setItemsDemandes([]);
                    }}
                    disabled={mode === 'contre'}
                    className="proposition-select"
                >
                    <option value="">-- Choisir --</option>
                    {destinatairesPossibles.map((u) => (
                        <option key={u.id} value={u.id}>{u.nom}</option>
                    ))}
                </select>
            </label>

            <fieldset className="proposition-fieldset">
                <legend className="proposition-legend">Mes items offerts</legend>
                {mesObjets.length === 0 && <p className="proposition-vide">Vous n'avez aucun objet.</p>}
                {mesObjets.map((o) => (
                    <label key={o.id} className="proposition-item-label">
                        <input
                            type="checkbox"
                            checked={itemsOfferts.includes(o.id)}
                            onChange={() => toggleItem(o.id, itemsOfferts, setItemsOfferts)}
                            className="proposition-checkbox"
                        />
                        {o.nom} ({o.unites ?? 0} unités)
                    </label>
                ))}
            </fieldset>

            <fieldset className="proposition-fieldset">
                <legend className="proposition-legend">Items demandés</legend>
                {itemsDemandesPossibles.length === 0 && (
                    <p className="proposition-vide">Choisissez d'abord un destinataire.</p>
                )}
                {itemsDemandesPossibles.map((o) => (
                    <label key={o.id} className="proposition-item-label">
                        <input
                            type="checkbox"
                            checked={itemsDemandes.includes(o.id)}
                            onChange={() => toggleItem(o.id, itemsDemandes, setItemsDemandes)}
                            className="proposition-checkbox"
                        />
                        {o.nom} ({o.unites ?? 0} unités)
                    </label>
                ))}
            </fieldset>

            <p className="proposition-balance">
                Balance : <strong>{balance}</strong> unité(s)
                {balance > 0 && ' (en votre faveur)'}
                {balance < 0 && ' (en défaveur)'}
            </p>

            {erreur && <p className="proposition-erreur">{erreur}</p>}

            <button type="submit" className="btn-submit">
                {mode === 'contre' ? 'Envoyer la contre-proposition' : 'Proposer'}
            </button>
        </form>
    );
}

export default FormPropositionEchange;