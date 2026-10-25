export const listeDroits = {
    proposer: 'Droit de proposition',
    contreProposer: 'Droit de contre-proposer',
    accepter: "Droit d'acceptation",
};

export const droitsParDefaut = {
    proposer: true,
    contreProposer: true,
    accepter: true,
};

// Fait par Claude
export function estAdmin(utilisateur) {
    return utilisateur?.role === 'admin';
}

// Fait par Claude
export function aLeDroit(utilisateur, droit) {
    if (!utilisateur || estAdmin(utilisateur)) {
        return false;
    }
    return utilisateur.droits?.[droit] ?? true;
}
