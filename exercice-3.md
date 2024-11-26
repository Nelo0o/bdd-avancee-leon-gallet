## Fonction 'fullname_short'

```SQL
DROP FUNCTION IF EXISTS fullname_short;

CREATE FUNCTION fullname_short(prenom VARCHAR(255), nom VARCHAR(255))
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    RETURN CONCAT(
        UPPER(LEFT(LOWER(prenom), 1)),
        '. ',
        CONCAT(UPPER(LEFT(LOWER(nom), 1)), LOWER(SUBSTRING(nom, 2)))
    );
END;

SELECT fullname_short(first_name, last_name) AS nom_court
FROM authors
```

---

## Procédure stockée 'last_post_from_author'

```SQL
DROP PROCEDURE IF EXISTS last_post_from_author;

CREATE PROCEDURE last_post_from_author(IN author_id INT)
BEGIN
    SELECT p.*
    FROM posts p
    WHERE p.author_id = author_id
    ORDER BY p.date DESC
    LIMIT 1;
END;

CALL last_post_from_author((SELECT id FROM authors WHERE first_name = 'Savanah'));
```
