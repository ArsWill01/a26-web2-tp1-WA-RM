import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useJournalContext } from '../context/JournalContext';
import { typesActivite } from '../scripts/activites';

const filtresVides = { type: '', utilisateur: '', dateDebut: '', dateFin: '', recherche: '' };

// Fait par Claude
function JournalActivites() {
    const { activites } = useJournalContext();
    const [filtres, setFiltres] = useState(filtresVides);

    const nomsUtilisateurs = [...new Set(activites.map((a) => a.utilisateur))].sort();

    // Fait par Claude
    function changerFiltre(event) {
        setFiltres({ ...filtres, [event.target.name]: event.target.value });
    }

    const debut = filtres.dateDebut ? new Date(`${filtres.dateDebut}T00:00:00`) : null;
    const fin = filtres.dateFin ? new Date(`${filtres.dateFin}T23:59:59.999`) : null;
    const recherche = filtres.recherche.trim().toLowerCase();

    const resultats = activites
        .filter((a) => !filtres.type || a.type === filtres.type)
        .filter((a) => !filtres.utilisateur || a.utilisateur === filtres.utilisateur)
        .filter((a) => !debut || new Date(a.horodate) >= debut)
        .filter((a) => !fin || new Date(a.horodate) <= fin)
        .filter((a) => !recherche || a.details.toLowerCase().includes(recherche))
        .sort((a, b) => new Date(b.horodate) - new Date(a.horodate));

    return (
        <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <TextField
                    select
                    label="Type"
                    name="type"
                    value={filtres.type}
                    onChange={changerFiltre}
                    sx={{ minWidth: 220 }}
                >
                    <MenuItem value="">Tous les types</MenuItem>
                    {Object.entries(typesActivite).map(([cle, libelle]) => (
                        <MenuItem key={cle} value={cle}>{libelle}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Utilisateur"
                    name="utilisateur"
                    value={filtres.utilisateur}
                    onChange={changerFiltre}
                    sx={{ minWidth: 180 }}
                >
                    <MenuItem value="">Tous les utilisateurs</MenuItem>
                    {nomsUtilisateurs.map((nom) => (
                        <MenuItem key={nom} value={nom}>{nom}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    type="date"
                    label="Du"
                    name="dateDebut"
                    value={filtres.dateDebut}
                    onChange={changerFiltre}
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                    type="date"
                    label="Au"
                    name="dateFin"
                    value={filtres.dateFin}
                    onChange={changerFiltre}
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                    label="Rechercher dans les détails"
                    name="recherche"
                    value={filtres.recherche}
                    onChange={changerFiltre}
                    sx={{ flexGrow: 1, minWidth: 200 }}
                />

                <Button variant="outlined" onClick={() => setFiltres(filtresVides)}>
                    Réinitialiser
                </Button>
            </Box>

            <Typography sx={{ mb: 1, color: '#666' }}>
                {resultats.length} activité(s) trouvée(s)
            </Typography>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Horodate</TableCell>
                            <TableCell>Utilisateur</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Détails</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resultats.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Aucune activité.</TableCell>
                            </TableRow>
                        )}
                        {resultats.map((a) => (
                            <TableRow key={a.id}>
                                <TableCell>{new Date(a.horodate).toLocaleString('fr-CA')}</TableCell>
                                <TableCell>{a.utilisateur}</TableCell>
                                <TableCell>{typesActivite[a.type] ?? a.type}</TableCell>
                                <TableCell>{a.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default JournalActivites;
