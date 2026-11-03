import { useState } from 'react';
import { useLoginContext } from '../context/LoginContext';
import FormPropositionEchange from './FormPropositionEchange';
import PropositionEchange from './PropositionEchange';
import { aLeDroit } from '../scripts/droits';
import '../styles/echanges.css';
import '../styles/titres.css';

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
            <h1 className="titre-degrade">Échanges</h1>
            <div className="echanges-onglets">
                {peutProposer && (
                    <button
                        onClick={() => setOnglet('proposer')}
                        className={`echanges-onglet ${onglet === 'proposer' ? 'actif' : ''}`}
                    >
                        Proposer un échange
                    </button>
                )}
                <button
                    onClick={() => setOnglet('mesEchanges')}
                    className={`echanges-onglet ${onglet === 'mesEchanges' ? 'actif' : ''}`}
                >
                    Mes échanges
                </button>
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
                    <h2 className="titre-section">Propositions reçues</h2>
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

                    <h2 className="titre-section">Propositions envoyées</h2>
                    {propositionsEnvoyees.length === 0 && (
                        <p className="echanges-vide">Aucune proposition envoyée.</p>
                    )}
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