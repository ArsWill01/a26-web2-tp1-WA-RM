import {useState} from 'react';
import {useLoginContext} from '../../context/LoginContext.jsx';
import {useJournalContext} from '../../context/JournalContext.jsx';
import {addSouhait, deleteSouhait, updateSouhait} from '../../scripts/https.js';
import '../../styles/souhaits.css';
import '../../styles/theme/titres.css';
import '../../styles/theme/boutons.css';

function SouhaitUtilisateur({souhaits, setSouhaits}) {
    const {login} = useLoginContext();
    const {journaliser} = useJournalContext();
    const [mesSouhaits, setMesSouhaits] = useState(() =>
        souhaits
            .filter((souhait) => souhait.uuidUtilisateur === login?.uuid)
            .map((souhait) => ({id: souhait.uuid, uuid: souhait.uuid, description: souhait.description}))
    );

    function ajouterSouhait() {
        // id est ma clé, je met un uuid temporaire dans le id
        setMesSouhaits([...mesSouhaits, {id: crypto.randomUUID(), uuid: null, description: ''}]);
    }

    function supprimerSouhait(id) {
        setMesSouhaits(mesSouhaits.filter((souhait) => souhait.id !== id));
    }

    // DÉBUT AVEC CLAUDE

    // je ne savais pas comment trouver les différence quand je fais un save (update/create/delete)
    // j'aurais du faire comme objet, avec une liste de souhait et un form pour faire le enregistrer.
    async function enregistrerSouhaits(event) {
        event.preventDefault();
        const descriptions = new FormData(event.target)
            .getAll('description')
            .map((description) => description.trim());
        const lignes = mesSouhaits
            .map((ligne, index) => ({...ligne, description: descriptions[index]}))
            .filter((ligne) => ligne.description !== '');

        const anciens = souhaits.filter((souhait) => souhait.uuidUtilisateur === login.uuid);
        for (const ancien of anciens) {
            if (!lignes.some((ligne) => ligne.uuid === ancien.uuid)) {
                await deleteSouhait(ancien.uuid);
            }
        }

        const miens = [];
        for (const ligne of lignes) {
            let uuid = ligne.uuid;
            if (uuid) {
                if (anciens.find((ancien) => ancien.uuid === uuid)?.description !== ligne.description) {
                    await updateSouhait(login.uuid, {uuid, description: ligne.description});
                }
            } else {
                uuid = await addSouhait(login.uuid, {description: ligne.description});
            }
            miens.push({uuid, uuidUtilisateur: login.uuid, description: ligne.description});
        }

        // FIN DE LA PARTIE AVEC CLAUDE

        const autres = souhaits.filter((souhait) => souhait.uuidUtilisateur !== login.uuid);
        setSouhaits([...autres, ...miens]);
        journaliser(login, 'modification_souhaits', `${miens.length} souhait(s)`);
        setMesSouhaits(miens.map((souhait) => ({id: souhait.uuid, uuid: souhait.uuid, description: souhait.description})));
    }

    return (
        <div>
            <h2 className="titre-degrade">Liste de souhaits</h2>

            <div className="souhaits-bouton-ajout">
                <button type="button" onClick={ajouterSouhait} className="btn-principal">Ajouter</button>
            </div>
            <form onSubmit={enregistrerSouhaits}>
                {mesSouhaits.map((ligne) => (
                    <div key={ligne.id} className="souhaits-ligne">
                        <input
                            type="text"
                            name="description"
                            defaultValue={ligne.description}
                            className="souhaits-input"
                        />
                        <button type="button" onClick={() => supprimerSouhait(ligne.id)}>X</button>
                    </div>
                ))}
                <br/>
                <div className="souhaits-actions">
                    <button type="submit" className="btn-noir">
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SouhaitUtilisateur;
