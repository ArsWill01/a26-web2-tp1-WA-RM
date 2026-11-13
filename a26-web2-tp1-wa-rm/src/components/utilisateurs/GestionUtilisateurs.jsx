import {useState} from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import {useLoginContext} from '../../context/LoginContext.jsx';
import {useJournalContext} from '../../context/JournalContext.jsx';
import {aLeDroit, droitsParDefaut, estAdmin, listeDroits} from '../../scripts/admin/droits.js';
import {addUtilisateur, deleteUtilisateur, updateUtilisateur} from "../../scripts/https.js";

// Fait par Claude
function GestionUtilisateurs({utilisateurs, setUtilisateurs}) {
    const {login} = useLoginContext();
    const {journaliser} = useJournalContext();
    const [role, setRole] = useState('utilisateur');
    const [erreur, setErreur] = useState('');

    // première version par claude, modifier par Will pour appeller le backend
    async function creerUtilisateur(event) {
        event.preventDefault();
        setErreur('');
        const formData = new FormData(event.target);
        const nom = formData.get('nom').trim();
        const motDePasse = formData.get('motDePasse');

        if (!nom || !motDePasse) {
            setErreur('Le nom et le mot de passe sont obligatoires.');
            return;
        }
        if (utilisateurs.some((u) => u.nom.toLowerCase() === nom.toLowerCase())) {
            setErreur('Ce nom est déjà utilisé.');
            return;
        }

        const nouveau = role === 'admin'
            ? {nom, motDePasse, role: 'ADMIN'}
            : {nom, motDePasse, role: 'UTILISATEUR', droits: {...droitsParDefaut}};

        const nouveauUuid = await addUtilisateur(nouveau);

        setUtilisateurs([...utilisateurs, {...nouveau, uuid: nouveauUuid}]);
        journaliser(login, 'creation_utilisateur', `${nom} (${role})`);
        event.target.reset();
        setRole('utilisateur');
    }

    // Fait par Claude (partie 1) modifier par moi (partie 2)
    async function supprimerUtilisateur(utilisateur) {
        if (utilisateur.uuid === login.uuid) {
            return;
        }
        if (!window.confirm(`Supprimer ${utilisateur.nom} ?`)) {
            return;
        }
        await deleteUtilisateur(utilisateur.uuid);
        setUtilisateurs(utilisateurs.filter((u) => u.uuid !== utilisateur.uuid));
        journaliser(login, 'suppression_utilisateur', utilisateur.nom);
    }

    // Fait par Claude
    async function basculerDroit(utilisateur, droit) {
        const accorde = !aLeDroit(utilisateur, droit);
        const modifie = {...utilisateur, droits: {...droitsParDefaut, ...utilisateur.droits, [droit]: accorde}};
        await updateUtilisateur(modifie);
        setUtilisateurs(utilisateurs.map((utilisateur) =>
            utilisateur.uuid === utilisateur.uuid
                ? modifie
                : utilisateur
        ));
        journaliser(
            login,
            'modification_droits',
            `${listeDroits[droit]} ${accorde ? 'accordé à' : 'retiré à'} ${utilisateur.nom}`
        );
    }

    return (
        <Box>
            <Paper component="form" onSubmit={creerUtilisateur} sx={{p: 3, mb: 4}}>
                <Typography variant="h6" sx={{mb: 2}}>Créer un compte</Typography>
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center'}}>
                    <TextField name="nom" label="Nom d'utilisateur"/>
                    <TextField name="motDePasse" label="Mot de passe" type="password"/>
                    <TextField
                        select
                        label="Rôle"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        sx={{minWidth: 160}}
                    >
                        <MenuItem value="utilisateur">Utilisateur</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                    <Button type="submit" variant="contained">Créer</Button>
                </Box>
                {erreur && <Alert severity="error" sx={{mt: 2}}>{erreur}</Alert>}
            </Paper>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Rôle</TableCell>
                            {Object.entries(listeDroits).map(([cle, libelle]) => (
                                <TableCell key={cle} align="center">{libelle}</TableCell>
                            ))}
                            <TableCell align="center">Supprimer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {utilisateurs.map((u) => (
                            <TableRow key={u.uuid}>
                                <TableCell>{u.nom}</TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={estAdmin(u) ? 'Admin' : 'Utilisateur'}
                                        color={estAdmin(u) ? 'secondary' : 'default'}
                                    />
                                </TableCell>
                                {Object.keys(listeDroits).map((droit) => (
                                    <TableCell key={droit} align="center">
                                        {estAdmin(u) ? '—' : (
                                            <Switch
                                                checked={aLeDroit(u, droit)}
                                                onChange={() => basculerDroit(u, droit)}
                                            />
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell align="center">
                                    <IconButton
                                        aria-label={`Supprimer ${u.nom}`}
                                        onClick={() => supprimerUtilisateur(u)}
                                        disabled={u.uuid === login.uuid}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default GestionUtilisateurs;
