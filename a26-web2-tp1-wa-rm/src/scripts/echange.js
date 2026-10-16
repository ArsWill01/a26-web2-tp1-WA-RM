export const propositionsInitiales = [
    {
        id: 1,
        proposeurId: 2,
        recepteurId: 1,
        itemsOfferts: [2],
        itemsDemandes: [1],
        statut: 'en_attente',
        parentId: null
    },
    {   // obj 1 en attente, mais dans l'autre sens
        id: 2,
        proposeurId: 1,
        recepteurId: 2,
        itemsOfferts: [3, 5],
        itemsDemandes: [7],
        statut: 'en_attente',
        parentId: null,
    },
    {
        id: 3,
        proposeurId: 3,
        recepteurId: 1,
        itemsOfferts: [4],
        itemsDemandes: [6],
        statut: 'acceptee',
        parentId: null
    },
    {   // Obj proposition refusée
        id: 4,
        proposeurId: 2,
        recepteurId: 3,
        itemsOfferts: [5],
        itemsDemandes: [4],
        statut: 'refusee',
        parentId: null,
    },
    {   // Obj Contre-proposition ( pour la régle de "au moins un item identique").
        id: 5,
        proposeurId: 1,
        recepteurId: 2,
        itemsOfferts: [1],
        itemsDemandes: [2],
        statut: 'en_attente',
        parentId: 1,
    },
];