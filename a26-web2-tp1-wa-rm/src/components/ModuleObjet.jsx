function ModuleObjet({ photo, nom, description, etat, prix, selectionne, onClick, onDelete }) {
    function handleSupprimer(event) {
        event.stopPropagation();
        onDelete();
    }

    return (
        <div className="photo-card" onClick={onClick}>
            <button type="button" className="remove-button" onClick={handleSupprimer}>
                X
            </button>
            {selectionne && <div className="selected">Sélectionné</div>}
            <img
                alt={nom}
                src={photo}
                style={{
                    width: '100%',
                    aspectRatio: '3 / 2',
                    objectFit: 'contain',
                }}
            />
            <h3>{nom}</h3>
            <p>{description}</p>
            <p>État : {etat} — {prix.toFixed(2)} $</p>
        </div>
    );
}

export default ModuleObjet;
