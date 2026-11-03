import {useState} from 'react';
import {useLoginContext} from '../context/LoginContext';
import {useJournalContext} from '../context/JournalContext';
import '../styles/souhaits.css';
import '../styles/titres.css';
import '../styles/boutons.css';

function SouhaitUtilisateur({souhaits, setSouhaits}) {
    const {login} = useLoginContext();
    const {journaliser} = useJournalContext();
    const [mesSouhaits, setMesSouhaits] = useState(() =>
        souhaits
            .filter((souhait) => souhait.idUtilisateur === login?.id)
            .map((souhait) => ({id: souhait.id, description: souhait.description}))
    );

    function ajouterSouhait() {
        const nouvelId = Math.max(0, ...souhaits.map((souhait) => souhait.id)) + 1;
        setMesSouhaits([...mesSouhaits, {id: {nouvelId}, description: ''}]);
    }

    function supprimerSouhait(id) {
        setMesSouhaits(mesSouhaits.filter((souhait) => souhait.id !== id));
    }

    function enregistrerSouhaits(event) {
        event.preventDefault();
        const descriptions = new FormData(event.target)
            .getAll('description')
            .map((description) => description.trim())
            .filter((description) => description !== '');

        const autres = souhaits.filter((souhait) => souhait.idUtilisateur !== login.id);
        let nouvelId = Math.max(0, ...souhaits.map((souhait) => souhait.id));
        const miens = descriptions.map((description) => ({
            id: ++nouvelId,
            idUtilisateur: login.id,
            description,
        }));

        setSouhaits([...autres, ...miens]);
        journaliser(login, 'modification_souhaits', `${miens.length} souhait(s)`);
        setMesSouhaits(miens.map((souhait) => ({id: souhait.id, description: souhait.description})));
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
