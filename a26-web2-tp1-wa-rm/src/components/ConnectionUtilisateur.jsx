import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { loginContext } from '../context/LoginContext';

function ConnectionUtilisateur({ open, onClose }) {
    const { connecter } = loginContext();
    const nomRef = React.useRef(null);
    const motDePasseRef = React.useRef(null);
    const [erreur, setErreur] = React.useState(false);

    const handleClose = () => {
        setErreur(false);
        onClose();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (connecter(nomRef.current.value, motDePasseRef.current.value)) {
            handleClose();
        } else {
            setErreur(true);
        }
    };

    // Retourne un pop-up au lieu de gérer des pages, je garde l'utilisateur dans le context
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Connexion</DialogTitle>

            <DialogContent>
                <form id="form-connexion" onSubmit={handleSubmit}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nom d'utilisateur"
                        fullWidth
                        inputRef={nomRef}
                        error={erreur}
                    />
                    <TextField
                        margin="dense"
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        inputRef={motDePasseRef}
                        error={erreur}
                        helperText={erreur ? 'Nom ou mot de passe incorrect' : ' '}
                    />
                </form>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button type="submit" form="form-connexion" variant="contained">
                    Se connecter
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConnectionUtilisateur;
