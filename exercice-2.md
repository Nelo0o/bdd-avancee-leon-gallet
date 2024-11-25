## Nombre de posts par auteurs
```SQL
SELECT
    a.id AS author_id,
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    COUNT(p.id) AS post_count
FROM
    authors a
LEFT JOIN
    posts p
ON
    a.id = p.author_id
GROUP BY
    a.id, a.first_name, a.last_name;
```

---

## Nombre de posts moyens par auteurs

```SQL
SELECT
    COUNT(p.id) * 1.0 / COUNT(DISTINCT a.id) AS average_posts_per_author
FROM
    authors a
LEFT JOIN
    posts p
ON
    a.id = p.author_id;
```

---

## Liste des auteurs (nom et prenom) dont les posts sont supérieurs à 10 avec la clause having

```SQL
SELECT
    a.id AS author_id,
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    COUNT(p.id) AS post_count
FROM
    authors a
LEFT JOIN
    posts p
ON
    a.id = p.author_id
GROUP BY
    a.id, a.first_name, a.last_name
HAVING
    COUNT(p.id) > 10;
```

---

## Liste des auteurs (nom et prenom) dont les posts sont supérieurs à 10 avec une sous-requête

```SQL

```
---

## Liste des auteurs qui ont créé plus de post que la moyenne

```SQL

```
