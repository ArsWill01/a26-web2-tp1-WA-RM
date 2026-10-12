import { useState } from 'react';

function SouhaitUtilisateur() {
    const [souhaits, setSouhaits] = useState(['']);
    const [modifiable, setModifiable] = useState(false);

    function modifierSouhait(index, valeur) {
        setSouhaits(souhaits.map((souhait, i) => (i === index ? valeur : souhait)));
    }

    function ajouterSouhait() {
        setSouhaits([...souhaits, '']);
        setModifiable(true);
    }

    function supprimerSouhait(index) {
        setSouhaits(souhaits.filter((_, i) => i !== index));
    }

    function activerModification() {
        setModifiable(true);
    }

    function enregistrerSouhaits() {
        setModifiable(false);
    }

    return (
        <div>
            <h2>Liste de souhaits</h2>

            {souhaits.map((souhait, index) => (
                <div key={index} style={{ display: 'flex' }}>
                    <input
                        type="text"
                        value={souhait}
                        disabled={!modifiable}
                        onChange={(event) => modifierSouhait(index, event.target.value)}
                    />
                    <button type="button" onClick={() => supprimerSouhait(index)}>X</button>
                </div>
            ))}

            <button type="button" onClick={ajouterSouhait}>+</button>
            <button type="button" onClick={activerModification}>Modifier</button>
            <button type="button" onClick={enregistrerSouhaits}>Enregistrer</button>
        </div>
    );
}

export default SouhaitUtilisateur;
