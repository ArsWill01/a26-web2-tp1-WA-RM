import { useState } from 'react';
import { useLoginContext } from '../context/LoginContext';
import FormPropositionEchange from './FormPropositionEchange';
import PropositionEchange from './PropositionEchange';
import { aLeDroit } from '../scripts/droits';

function ModuleEchange({propositions, setPropositions, objets, setObjets, utilisateurs, setUtilisateurs,}) {
    const { login } = useLoginContext();
    const peutProposer = aLeDroit(login, 'proposer');
    const [onglet, setOnglet] = useState(peutProposer ? 'proposer' : 'mesEchanges');

    const propositionsRecues = propositions.filter((p) => p.recepteurId === login?.id);

    const propositionsEnvoyees = propositions.filter((p) => p.proposeurId === login?.id);

    const objetsDesAutres = objets.filter((o) => o.proprietaireId !== login?.id);

    const mesObjets = objets.filter((o) => o.proprietaireId === login?.id);

    return (
        <>
            <h1
                style={{
                    fontFamily: "Trebuchet MS, sans-serif",
                    fontSize: "42px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "30px",
                    background:
                        "linear-gradient(90deg, #1976d2, #7b2cbf, #00a896)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}
            >Échanges</h1>
            <div>
                {peutProposer && <button onClick={() => setOnglet('proposer')}
                    style={{
                        background:
                            onglet === 'proposer'
                                ? "linear-gradient(90deg, #1976d2, #7b2cbf)"
                                : "#ffffff",
                        color:
                            onglet === 'proposer'
                                ? "#ffffff"
                                : "#000000",
                        border: "2px solid #7b2cbf",
                        padding: "13px 25px",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow:
                            onglet === 'proposer'
                                ? "0 6px 15px rgba(90, 60, 180, 0.3)"
                                : "none"
                    }}
                >Proposer un échange</button>}
                <button onClick={() => setOnglet('mesEchanges')}
                    style={{
                        background:
                            onglet === 'mesEchanges'
                                ? "linear-gradient(90deg, #1976d2, #7b2cbf)"
                                : "#ffffff",
                        color:
                            onglet === 'mesEchanges'
                                ? "#ffffff"
                                : "#000000",
                        border: "2px solid #7b2cbf",
                        padding: "13px 25px",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow:
                            onglet === 'mesEchanges'
                                ? "0 6px 15px rgba(90, 60, 180, 0.3)"
                                : "none"
                    }}
                >Mes échanges</button>
            </div>

            {onglet === 'proposer' && peutProposer && (
                <FormPropositionEchange
                    mode="creation"
                    mesObjets={mesObjets}
                    objetsDesAutres={objetsDesAutres}
                    utilisateurs={utilisateurs}
                    propositions={propositions}
                    setPropositions={setPropositions}
                    login={login}
                />
            )}

            {onglet === 'mesEchanges' && (
                <div>
                    <h2 style={{
                        fontFamily: "Trebuchet MS, sans-serif",
                        fontSize: "28px",
                        color: "#7b2cbf",
                        marginBottom: "20px"
                    }}
                    >Propositions reçues</h2>
                    {propositionsRecues.length === 0 && <p>Aucune proposition reçue.</p>}
                    {propositionsRecues.map((p) => (
                        <PropositionEchange
                            key={p.id}
                            proposition={p}
                            objets={objets}
                            utilisateurs={utilisateurs}
                            login={login}
                            propositions={propositions}
                            setPropositions={setPropositions}
                            setObjets={setObjets}
                            setUtilisateurs={setUtilisateurs}
                        />
                    ))}

                    <h2 style={{
                        fontFamily: "Trebuchet MS, sans-serif",
                        fontSize: "28px",
                        color: "#7b2cbf",
                        marginBottom: "20px"
                    }}
                    >Propositions envoyées</h2>
                    {propositionsEnvoyees.length === 0 && <p
                    style={{
                        fontFamily: "Arial, sans-serif",
                        color: "#666",
                        fontSize: "16px"
                    }}
                    >Aucune proposition envoyée.</p>}
                    {propositionsEnvoyees.map((p) => (
                        <PropositionEchange
                            key={p.id}
                            proposition={p}
                            objets={objets}
                            utilisateurs={utilisateurs}
                            login={login}
                            propositions={propositions}
                            setPropositions={setPropositions}
                            setObjets={setObjets}
                            setUtilisateurs={setUtilisateurs}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default ModuleEchange;