import {useState} from "react";
import FormPropositionEchange from './FormPropositionEchange';
import {aLeDroit} from '../scripts/droits';
import {useJournalContext} from '../context/JournalContext';

function PropositionEchange({proposition, objets, utilisateurs, login, propositions, setPropositions, setObjets, setUtilisateurs,}) {
    const [enContre, setEnContre] = useState(false);
    const {journaliser} = useJournalContext();
    const peutAccepter = aLeDroit(login, 'accepter');
    const peutContreProposer = aLeDroit(login, 'contreProposer');

    const proposeur = utilisateurs.find((u) => u.id === proposition.proposeurId);
    const recepteur = utilisateurs.find((u) => u.id === proposition.recepteurId);

    const nomDe = (id) => objets.find((o) => o.id === id)?.nom ?? '?';
    const unitesDe = (id) => objets.find((o) => o.id === id)?.unites ?? 0;

    const somme = (ids) => ids.reduce((t, id) => t + unitesDe(id), 0);
    const balance = somme(proposition.itemsOfferts) - somme(proposition.itemsDemandes);

    const estRecepteur = proposition.recepteurId === login.id;
    const estProposeur = proposition.proposeurId === login.id;
    const enAttente = proposition.statut === 'en_attente';

    // retrouve les id de tous les objets impliqués (offerts par le proposeur et demandés)
    const itemsOfferts = proposition.itemsOfferts;
    const itemsDemandes = proposition.itemsDemandes;

    function transfererItems() {
        setObjets((prev) =>
            prev.map((o) => {
                if (itemsOfferts.includes(o.id)) return {...o, proprietaireId: proposition.recepteurId};
                if (itemsDemandes.includes(o.id)) return {...o, proprietaireId: proposition.proposeurId};
                return o;
            })
        );

        // update des cotes
        setUtilisateurs((prev) =>
            prev.map((u) => {
                if (u.id === proposition.proposeurId) {
                    return {...u, cote: (u.cote ?? 0) + balance};
                }
                if (u.id === proposition.recepteurId) {
                    return {...u, cote: (u.cote ?? 0) - balance};
                }
                return u;
            })
        );
    }

    function accepter() {
        transfererItems();
        setPropositions((prev) =>
            prev.map((p) =>
                p.id === proposition.id ? {...p, statut: 'acceptee'} : p
            )
        );
        journaliser(login, 'acceptation', `Proposition #${proposition.id} acceptée`);
    }

    function refuser() {
        setPropositions((prev) =>
            prev.map((p) =>
                p.id === proposition.id ? {...p, statut: 'refusee'} : p
            )
        );
        journaliser(
            login,
            estProposeur ? 'annulation' : 'refus',
            `Proposition #${proposition.id} ${estProposeur ? 'annulée' : 'refusée'}`
        );
    }

    return (
        <div style={{border: '1px solid #000', borderRadius: '15px', marginBottom: '20px', background: "linear-gradient(135deg, #ffffff, #f8f5ff)", boxShadow: "0 5px 15px rgba(70, 50, 150, 0.10)"}}>
            <h4
                style={{
                    fontFamily: "Trebuchet MS, sans-serif",
                    color: "#1976d2",
                    fontSize: "22px",
                    marginBottom: "20px"
                }}
            >
                {proposeur?.nom} → {recepteur?.nom}
            </h4>

            <p style={{fontFamily: "Arial, sans-serif", color: "#333"}}><strong>Items offerts :</strong> {
                itemsOfferts.length > 0 ? itemsOfferts.map(nomDe).join(', ') : '(aucun)'
            }</p>
            <p style={{fontFamily: "Arial, sans-serif", color: "#333"}}><strong>Items demandés :</strong> {
                itemsDemandes.length > 0
                    ? itemsDemandes.map(nomDe).join(', ')
                    : '(aucun)'
            }</p>
            <p style={{fontFamily: "Arial, sans-serif", color: "#333"}}><strong>Balance :</strong> {balance} unité(s)</p>
            <p><strong>Statut :</strong> {proposition.statut}</p>

            {estRecepteur && enAttente && (
                <div style={{display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap"}}>
                    <button onClick={accepter}
                        style={{
                            background:
                                "linear-gradient(90deg, #1976d2, #7b2cbf)",
                            color: "white",
                            border: "none",
                            padding: "11px 22px",
                            borderRadius: "25px",
                            fontSize: "15px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            boxShadow:
                                "0 5px 12px rgba(90, 60, 180, 0.25)"
                        }}
                    >Accepter</button>
                    <button onClick={refuser}
                        style={{
                            backgroundColor: "#ffffff",
                            color: "#7b2cbf",
                            border: "2px solid #7b2cbf",
                            padding: "10px 22px",
                            borderRadius: "25px",
                            fontSize: "15px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >Refuser</button>
                    <button onClick={() => setEnContre(true)}
                        style={{
                            backgroundColor: "#ffffff",
                            color: "#7b2cbf",
                            border: "2px solid #7b2cbf",
                            padding: "10px 22px",
                            borderRadius: "25px",
                            fontSize: "15px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >Contre-proposer</button>
                <div>
                    {peutAccepter && <button onClick={accepter}>Accepter</button>}
                    <button onClick={refuser}>Refuser</button>
                    {peutContreProposer && <button onClick={() => setEnContre(true)}>Contre-proposer</button>}
                </div>
            )}

            {estProposeur && enAttente && (
                <button onClick={refuser}
                    style={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        border: "2px solid #000000",
                        padding: "10px 22px",
                        borderRadius: "25px",
                        fontSize: "15px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "15px"
                    }}
                >Annuler</button>
            )}

            {/* Formulaire de contre-proposition */}
            {enContre && estRecepteur && peutContreProposer && (
                <FormPropositionEchange
                    mode="contre"
                    propositionOriginale={proposition}
                    mesObjets={objets.filter((o) => o.proprietaireId === login.id)}
                    objetsDesAutres={objets.filter((o) => o.proprietaireId !== login.id)}
                    utilisateurs={utilisateurs}
                    propositions={propositions}
                    setPropositions={(maj) => {
                        // setPropositions est un state setter, on accepte les deux formes
                        if (typeof maj === 'function') {
                            setPropositions(maj);
                        } else {
                            setPropositions(maj);
                        }
                        setEnContre(false);
                    }}
                    login={login}
                />
            )}
        </div>
    );

}

export default PropositionEchange;