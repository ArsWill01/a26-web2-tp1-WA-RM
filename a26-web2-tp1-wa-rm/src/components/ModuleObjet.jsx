import { useState } from 'react';

function ModuleObjet({ photo, nom, description, etat, prix, width, children, Decoration, onImageClick }) {
    const [ratio, setRatio] = useState(0.66);

    function handleChange(event) {
        const valeur = Number(event.target.value);

        if (valeur > 0 && valeur < 1) {
            setRatio(valeur);
        }
    }

    return (
        <div className="photo-card">
            <img alt={nom} src={photo} width={width} height={width * ratio} onClick={onImageClick}/>
            {children}
            <Decoration/>
            <h3>{nom}</h3>
            <p>{description}</p>
            <p>État : {etat} — {prix.toFixed(2)} $</p>
            <input type="text" placeholder="Ratio de l'image (0 à 1)" onChange={handleChange}/>
        </div>
    );
}

export default ModuleObjet;
