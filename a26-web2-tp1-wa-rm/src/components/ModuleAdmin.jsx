import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { loginContext } from '../context/LoginContext';
import { estAdmin } from '../scripts/droits';
import GestionUtilisateurs from './GestionUtilisateurs';
import JournalActivites from './JournalActivites';

// Fait par Claude
function ModuleAdmin({ utilisateurs, setUtilisateurs }) {
    const { login } = loginContext();
    const [onglet, setOnglet] = useState('utilisateurs');

    if (!estAdmin(login)) {
        return <p style={{ textAlign: 'center', marginTop: '40px' }}>Accès réservé aux administrateurs.</p>;
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <h2 style={{fontFamily: "Trebuchet MS, sans-serif", fontSize: "42px", fontWeight: "bold", textAlign: "center", marginBottom: "10px", background: "linear-gradient(90deg, #1976d2, #7b2cbf, #00a896)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                Administration
            </h2>

            <Tabs value={onglet} onChange={(e, valeur) => setOnglet(valeur)} centered sx={{ mb: 3 }}>
                <Tab value="utilisateurs" label="Utilisateurs et droits" />
                <Tab value="journal" label="Journal d'activités" />
            </Tabs>

            {onglet === 'utilisateurs' && (
                <GestionUtilisateurs utilisateurs={utilisateurs} setUtilisateurs={setUtilisateurs} />
            )}
            {onglet === 'journal' && <JournalActivites />}
        </Box>
    );
}

export default ModuleAdmin;
