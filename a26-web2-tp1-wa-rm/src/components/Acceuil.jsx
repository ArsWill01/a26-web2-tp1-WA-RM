import { loginContext } from "../context/LoginContext.jsx"
import { useState } from "react";
import ConnectionUtilisateur from "./ConnectionUtilisateur.jsx";

function Acceuil({ onNavigate }) {

    const { login } = loginContext();
    const [dialogConnexionOpen, setDialogConnexionOpen] = useState(false);

    return (
        <div
            style={{
                minHeight: "calc(125vh - 400px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f5f9ff, #e8f2ff)",
                padding: "40px"
            }}
        >
            <div style={{backgroundColor: "white", padding: "55px", borderRadius: "25px", textAlign: "center", boxShadow: "0 12px 35px rgba(70, 50, 150, 0.18)", maxWidth: "650px", width: "100%", border: "2px solid #e3dcff"}}>
                <h1 style={{fontFamily: "Trebuchet MS, sans-serif", fontSize: "46px", fontWeight: "bold", marginBottom: "15px", background: "linear-gradient(90deg, #1976d2, #7b2cbf, #00a896)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                    Mon site d'échange
                </h1>

                <p style={{fontFamily: "Arial, sans-serif", color: "#555", fontSize: "19px", lineHeight: "1.6", marginBottom: "30px"}}>
                    Bienvenue sur mon application
                    <br/>
                    Échangez, découvrez et partagez en ligne!.
                </p>

                {!login && (
                    <button
                        onClick={() => setDialogConnexionOpen(true)}
                        style={{background: "linear-gradient(90deg, #1976d2, #7b2cbf)", color: "white", border: "none", padding: "14px 32px", borderRadius: "30px", fontSize: "17px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 6px 15px rgba(90, 60, 180, 0.3)"}}
                    >
                        Login/Se Connecter
                    </button>
                )}

                {login && (
                    <div style={{display: "flex", justifyContent: "center", gap: "40px"}}>
                        <button onClick={() => onNavigate("echanges")} style={{background: "linear-gradient(90deg, #1976d2, #7b2cbf)", color: "white", border: "none", padding: "14px 32px", borderRadius: "30px", fontSize: "17px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 6px 15px rgba(90, 60, 180, 0.3)"}}>
                            Découvrir les échanges
                        </button>

                        <button onClick={() => onNavigate("objets")} style={{background: "linear-gradient(90deg, #1976d2, #7b2cbf)", color: "white", border: "none", padding: "14px 32px", borderRadius: "30px", fontSize: "17px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 6px 15px rgba(90, 60, 180, 0.3)"}}>
                            Découvrez les objets
                        </button>
                    </div>
                )}
            </div>
            <ConnectionUtilisateur
                open={dialogConnexionOpen}
                onClose={() => setDialogConnexionOpen(false)}
            />
        </div>
    );
}

export default Acceuil;