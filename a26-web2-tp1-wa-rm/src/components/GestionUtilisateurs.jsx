import { useState } from 'react';
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
import { useLoginContext } from '../context/LoginContext';
import { useJournalContext } from '../context/JournalContext';
import { aLeDroit, droitsParDefaut, estAdmin, listeDroits } from '../scripts/droits';

// Fait par Claude
function GestionUtilisateurs({ utilisateurs, setUtilisateurs }) {
    const { login } = useLoginContext();
    const { journaliser } = useJournalContext();
    const [role, setRole] = useState('utilisateur');
    const [erreur, setErreur] = useState('');

    // Fait par Claude
    function creerUtilisateur(event) {
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

        const nouvelId = Math.max(0, ...utilisateurs.map((u) => u.id)) + 1;
        const nouveau = role === 'admin'
            ? { id: nouvelId, nom, motDePasse, role: 'admin' }
            : { id: nouvelId, nom, motDePasse, role: 'utilisateur', droits: { ...droitsParDefaut } };

        setUtilisateurs([...utilisateurs, nouveau]);
        journaliser(login, 'creation_utilisateur', `${nom} (${role})`);
        event.target.reset();
        setRole('utilisateur');
    }

    // Fait par Claude
    function supprimerUtilisateur(utilisateur) {
        if (utilisateur.id === login.id) {
            return;
        }
        if (!window.confirm(`Supprimer ${utilisateur.nom} ?`)) {
            return;
        }
        setUtilisateurs(utilisateurs.filter((u) => u.id !== utilisateur.id));
        journaliser(login, 'suppression_utilisateur', utilisateur.nom);
    }

    // Fait par Claude
    function basculerDroit(utilisateur, droit) {
        const accorde = !aLeDroit(utilisateur, droit);
        setUtilisateurs(utilisateurs.map((u) =>
            u.id === utilisateur.id
                ? { ...u, droits: { ...droitsParDefaut, ...u.droits, [droit]: accorde } }
                : u
        ));
        journaliser(
            login,
            'modification_droits',
            `${listeDroits[droit]} ${accorde ? 'accordé à' : 'retiré à'} ${utilisateur.nom}`
        );
    }

    return (
        <Box>
            <Paper component="form" onSubmit={creerUtilisateur} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Créer un compte</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                    <TextField name="nom" label="Nom d'utilisateur" />
                    <TextField name="motDePasse" label="Mot de passe" type="password" />
                    <TextField
                        select
                        label="Rôle"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value="utilisateur">Utilisateur</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                    <Button type="submit" variant="contained">Créer</Button>
                </Box>
                {erreur && <Alert severity="error" sx={{ mt: 2 }}>{erreur}</Alert>}
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
                            <TableRow key={u.id}>
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
                                        disabled={u.id === login.id}
                                    >
                                        <DeleteIcon />
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
