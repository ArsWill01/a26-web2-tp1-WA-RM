import {useState} from 'react';
import {loginContext} from '../context/LoginContext';

function SouhaitUtilisateur({souhaits, setSouhaits}) {
    const {login} = loginContext();
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
        setMesSouhaits(miens.map((souhait) => ({id: souhait.id, description: souhait.description})));
    }

    return (
        <div>
            <h2 style={{fontFamily: "Trebuchet MS, sans-serif", fontSize: "42px", fontWeight: "bold", textAlign: "center", marginBottom: "10px", background: "linear-gradient(90deg, #1976d2, #7b2cbf, #00a896)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                Liste de souhaits
            </h2>

            <div style={{display: "flex", justifyContent: "center", marginBottom: "30px"}}>
                <button type="button" onClick={ajouterSouhait} style={{
                    background: "linear-gradient(90deg, #1976d2, #7b2cbf)",
                    color: "white",
                    border: "none",
                    padding: "14px 32px",
                    borderRadius: "30px",
                    fontSize: "17px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 6px 15px rgba(90, 60, 180, 0.3)"
                }}>Ajouter</button>
            </div>
            <form onSubmit={enregistrerSouhaits}>
            {mesSouhaits.map((ligne) => (
                <div key={ligne.id} style={{ display: 'flex', justifyContent: 'center', margin: '8px' }}>
                    <input
                        type="text"
                        name="description"
                        defaultValue={ligne.description}
                        style={{ width: "680px", fontSize: "16px" }}
                    />
                    <button type="button" onClick={() => supprimerSouhait(ligne.id)}>X</button>
                </div>
            ))}
            <br/>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                    type="submit"
                    style={{
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        border: "2px solid #000000",
                        padding: "11px 25px",
                        borderRadius: "5px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Enregistrer
                </button>
            </div>
            </form>
        </div>
    );
}

export default SouhaitUtilisateur;
