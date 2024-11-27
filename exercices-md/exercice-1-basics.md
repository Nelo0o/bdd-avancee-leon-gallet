## Sélectionner toutes les classes et afficher le libellé de celle-ci :
```SQL
SELECT classe_libelle_long
FROM classe;
```
---

## Sélectionner toutes les classes dont le titre professionnel est CDA :
```SQL
SELECT c.classe_libelle_long
FROM classe c
INNER JOIN titre_professionnel tp ON c.titre_professionnel_id = tp.titre_professionnel_id
WHERE tp.titre_professionnel_libelle = 'CDA';
```
---

## Sélectionner toutes les classes qui n'ont pas de titre professionnel lié :
```SQL
SELECT classe_libelle_long
FROM classe
WHERE titre_professionnel_id IS NULL;
```

---

## Selectionner touts les titres professionnels qui n'ont pas de classe liée :
```SQL
SELECT *
FROM titre_professionnel
LEFT JOIN classe ON titre_professionnel.titre_professionnel_id = classe.titre_professionnel_id
WHERE classe.titre_professionnel_id IS NULL;
```
---

## Selectionner tous les tuteurs (Nom et prénom) dont les étudiants sont en CDA :
```SQL
SELECT *
FROM tuteur
JOIN etudiant ON tuteur.tuteur_id = etudiant.tuteur_id
JOIN integrer ON etudiant.etudiant_id = integrer.etudiant_id
JOIN classe ON integrer.classe_id = classe.classe_id
JOIN titre_professionnel ON classe.titre_professionnel_id = titre_professionnel.titre_professionnel_id
WHERE titre_professionnel.titre_professionnel_libelle = 'CDA';
```
