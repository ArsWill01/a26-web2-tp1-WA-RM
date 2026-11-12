export async function fetchAllUtilisateursAsync() {
    const response = await fetch('http://localhost:8080/utilisateurs');

    if (!response.ok) {
        throw new Error('Échec du chargement des utilisateurs');
    }

    return await response.json();
}

export async function addUtilisateur(utilisateur) {
    const response = await fetch('http://localhost:8080/utilisateurs',
        {
            method: 'POST',
            body: JSON.stringify(utilisateur),
            headers:
                {
                    'Content-Type': 'application/json'
                }
        }
    );
    if (!response.ok) {
        const raison = await response.json();
        throw new Error('L\'utilisateur n\'a pas pu être créée' + raison.message);
    }
    return await response.text();
}