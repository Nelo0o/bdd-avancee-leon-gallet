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

---

## Un trigger d'historisation des posts

```SQL
CREATE TABLE IF NOT EXISTS deleted_posts (
    id INT,
    title VARCHAR(255),
    content TEXT,
    author_id INT,
    date DATETIME,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, deleted_at)
);

DROP TRIGGER IF EXISTS before_posts_delete;

CREATE TRIGGER before_posts_delete
BEFORE DELETE ON posts
FOR EACH ROW
BEGIN
    INSERT INTO deleted_posts (id, title, content, author_id, date)
    VALUES (OLD.id, OLD.title, OLD.content, OLD.author_id, OLD.date);
END;

DELETE FROM posts WHERE id = 10;
SELECT * FROM deleted_posts;
```
