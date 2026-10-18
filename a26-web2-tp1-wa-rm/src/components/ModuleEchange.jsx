import { useState } from 'react';
import { loginContext } from '../context/LoginContext';
import FormPropositionEchange from './FormPropositionEchange';
import PropositionEchange from './PropositionEchange';

function ModuleEchange({propositions, setPropositions, objets, setObjets, utilisateurs, setUtilisateurs,}) {
    const { login } = loginContext();
    const [onglet, setOnglet] = useState('proposer');

    const propositionsRecues = propositions.filter((p) => p.recepteurId === login?.id);

    const propositionsEnvoyees = propositions.filter((p) => p.proposeurId === login?.id);

    const objetsDesAutres = objets.filter((o) => o.proprietaireId !== login?.id);

    const mesObjets = objets.filter((o) => o.proprietaireId === login?.id);

    return (
        <>
            <h1>Échanges</h1>
            <div>
                <button onClick={() => setOnglet('proposer')}>Proposer un échange</button>
                <button onClick={() => setOnglet('mesEchanges')}>Mes échanges</button>
            </div>

            {onglet === 'proposer' && (
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
                    <h2>Propositions reçues</h2>
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

                    <h2>Propositions envoyées</h2>
                    {propositionsEnvoyees.length === 0 && <p>Aucune proposition envoyée.</p>}
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