import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useLoginContext } from '../../context/LoginContext.jsx';
import { estAdmin } from '../../scripts/droits.js';
import GestionUtilisateurs from '../utilisateurs/GestionUtilisateurs.jsx';
import JournalActivites from './JournalActivites.jsx';
import '../../styles/admin.css';
import '../../styles/titres.css';

// Fait par Claude
function ModuleAdmin({ utilisateurs, setUtilisateurs }) {
    const { login } = useLoginContext();
    const [onglet, setOnglet] = useState('utilisateurs');

    if (!estAdmin(login)) {
        return <p style={{ textAlign: 'center', marginTop: '40px' }}>Accès réservé aux administrateurs.</p>;
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <h2 className="titre-degrade">
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
