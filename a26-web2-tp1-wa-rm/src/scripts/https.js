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

export async function updateUtilisateur(utilisateur) {
    const response = await fetch(`http://localhost:8080/utilisateurs/${utilisateur.uuid}`,
        {
            method: 'PUT',
            body: JSON.stringify(utilisateur),
            headers:
                {
                    'Content-Type': 'application/json'
                }
        }
    );
    if (!response.ok) {
        throw new Error('L\'utilisateur n\'a pas pu être modifié');
    }
}

export async function deleteUtilisateur(uuid) {
    const response = await fetch(`http://localhost:8080/utilisateurs/${uuid}`,
        {
            method: 'DELETE'
        }
    );
    if (!response.ok) {
        throw new Error('L\'utilisateur n\'a pas pu être supprimé');
    }
}

export async function fetchAllObjetsAsync() {
    const response = await fetch('http://localhost:8080/objets');

    if (!response.ok) {
        throw new Error('Échec du chargement des objets');
    }

    return await response.json();
}

export async function addObjet(uuidUtilisateur, objet) {
    const response = await fetch(`http://localhost:8080/utilisateurs/${uuidUtilisateur}/objets`,
        {
            method: 'POST',
            body: JSON.stringify(objet),
            headers:
                {
                    'Content-Type': 'application/json'
                }
        }
    );
    if (!response.ok) {
        throw new Error('L\'objet n\'a pas pu être créé');
    }
    return await response.text();
}

export async function updateObjet(uuidUtilisateur, objet) {
    const response = await fetch(`http://localhost:8080/utilisateurs/${uuidUtilisateur}/objets/${objet.uuid}`,
        {
            method: 'PUT',
            body: JSON.stringify(objet),
            headers:
                {
                    'Content-Type': 'application/json'
                }
        }
    );
    if (!response.ok) {
        throw new Error('L\'objet n\'a pas pu être modifié');
    }
}

export async function deleteObjet(uuid) {
    const response = await fetch(`http://localhost:8080/objets/${uuid}`,
        {
            method: 'DELETE'
        }
    );
    if (!response.ok) {
        throw new Error('L\'objet n\'a pas pu être supprimé');
    }
}

export async function fetchAllSouhaitsAsync() {
    const response = await fetch('http://localhost:8080/souhaits');

    if (!response.ok) {
        throw new Error('Échec du chargement des souhaits');
    }

    return await response.json();
}

export async function addSouhait(uuidUtilisateur, souhait) {
    const response = await fetch(`http://localhost:8080/utilisateurs/${uuidUtilisateur}/souhaits`,
        {
            method: 'POST',
            body: JSON.stringify(souhait),
            headers:
                {
                    'Content-Type': 'application/json'
                }
        }
    );
    if (!response.ok) {
        throw new Error('Le souhait n\'a pas pu être créé');
    }
    return await response.text();
}

export async function updateSouhait(uuidUtilisateur, souhait) {
    const response = await fetch(`http://localhost:8080/utilisateurs/${uuidUtilisateur}/souhaits/${souhait.uuid}`,
        {
            method: 'PUT',
            body: JSON.stringify(souhait),
            headers:
                {
                    'Content-Type': 'application/json'
                }
        }
    );
    if (!response.ok) {
        throw new Error('Le souhait n\'a pas pu être modifié');
    }
}

export async function deleteSouhait(uuid) {
    const response = await fetch(`http://localhost:8080/souhaits/${uuid}`,
        {
            method: 'DELETE'
        }
    );
    if (!response.ok) {
        throw new Error('Le souhait n\'a pas pu être supprimé');
    }
}