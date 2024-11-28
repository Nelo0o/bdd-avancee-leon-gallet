import { getAllAuthors, closeConnection, getAuthorById, connexion, insertOneAuthor, updateOneAuthor, searchAuthorByName } from "./database.js"

let nouvelIdDuDidier;

beforeAll(async () => {
  await connexion.query("DELETE FROM authors where email='didier.super@yahoo.com'")
  const [resultset, _] = await connexion.query(
    "INSERT INTO authors (first_name, last_name, email, birthdate) VALUES (?,?,?,?)",
    ["didier", "super", "didier.super@yahoo.com", "1960-01-01"])
  nouvelIdDuDidier = resultset.insertId;
})

afterAll(async () => {
  await connexion.query("DELETE FROM authors where email='test.auteur@test.com'")
  await connexion.query("DELETE FROM authors where email='didier.super@yahoo.com'")
  await closeConnection();
})

describe('API des Auteurs', () => {
  // getAllAuthors
  test('Quand getAllAuthors() est appelé, la réponse devrait être une [liste] d\'Auteurs', async () => {
    const listeDesAuteurs = await getAllAuthors();
    expect(listeDesAuteurs.length).not.toEqual(0)
  });

  // getAuthorById
  test('Devrait retourner les détails de Didier quand getAuthorById est appelé avec l\'ID correct', async () => {
    const detailsDeDidier = {
      first_name: "didier",
      last_name: "super",
      email: "didier.super@yahoo.com"
    }
    const resultatDeDidier = await getAuthorById(nouvelIdDuDidier)
    expect(resultatDeDidier).toBeDefined();
    expect(resultatDeDidier).not.toEqual({});
    expect(resultatDeDidier).toEqual(expect.objectContaining(detailsDeDidier));
  });

  // insertOneAuthor
  test('Devrait créer un nouvel auteur avec insertOneAuthor', async () => {
    const nouvelAuteur = {
      first_name: "Test",
      last_name: "Auteur",
      email: "test.auteur@test.com",
      birthdate: "1990-01-01"
    };

    const idInsertion = await insertOneAuthor(nouvelAuteur);
    expect(idInsertion).toBeDefined();
    expect(typeof idInsertion).toBe('number');

    const auteurCree = await getAuthorById(idInsertion);
    expect(auteurCree).toEqual(expect.objectContaining({
      first_name: nouvelAuteur.first_name,
      last_name: nouvelAuteur.last_name,
      email: nouvelAuteur.email
    }));
  });

  // updateOneAuthor
  test('Devrait mettre à jour un auteur existant avec updateOneAuthor', async () => {
    const detailsMisAJour = {
      id: nouvelIdDuDidier,
      first_name: "Didier",
      last_name: "MisAJour",
      email: "didier.super@yahoo.com",
      birthdate: "1960-01-01"
    };

    const resultatMiseAJour = await updateOneAuthor(detailsMisAJour);
    expect(resultatMiseAJour).toBe(true);

    const auteurMisAJour = await getAuthorById(nouvelIdDuDidier);
    expect(auteurMisAJour).toEqual(expect.objectContaining({
      first_name: detailsMisAJour.first_name,
      last_name: detailsMisAJour.last_name
    }));
  });

  // searchAuthorByName
  test('Devrait trouver des auteurs par nom en utilisant searchAuthorByName', async () => {
    const resultatsRecherche = await searchAuthorByName("Didier");
    expect(resultatsRecherche.length).toBeGreaterThan(0);
    expect(resultatsRecherche[0]).toEqual(expect.objectContaining({
      first_name: "Didier"
    }));

    const resultatsNomDeFamille = await searchAuthorByName("MisAJour");
    expect(resultatsNomDeFamille.length).toBeGreaterThan(0);
    expect(resultatsNomDeFamille[0]).toEqual(expect.objectContaining({
      last_name: "MisAJour"
    }));
  });

  // insertOneAuthor
  test('Devrait retourner null lors de la tentative d\'insertion d\'un auteur invalide', async () => {
    const auteurInvalide = {
      first_name: "Test"
    };
    const resultat = await insertOneAuthor(auteurInvalide);
    expect(resultat).toBeNull();
  });
});
