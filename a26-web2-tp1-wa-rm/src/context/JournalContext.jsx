import { createContext, useCallback, useContext, useState } from 'react';
import { activitesInitiales, typesActivite } from '../scripts/activites';

export const JournalContext = createContext(null);

// Fait par Claude
export function useJournalContext() {
    return useContext(JournalContext);
}

// Fait par Claude
export function useJournal() {
    const [activites, setActivites] = useState(activitesInitiales);

    // Fait par Claude
    const journaliser = useCallback((utilisateur, type, details = '') => {
        if (!typesActivite[type]) {
            console.warn(`Type d'activité inconnu : ${type}`);
        }

        setActivites((prev) => [
            ...prev,
            {
                id: Math.max(0, ...prev.map((a) => a.id)) + 1,
                idUtilisateur: utilisateur?.id ?? null,
                utilisateur: utilisateur?.nom ?? 'Inconnu',
                horodate: new Date().toISOString(),
                type,
                details,
            },
        ]);
    }, []);

    return { activites, journaliser };
}
