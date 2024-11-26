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
