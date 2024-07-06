DROP TABLE IF EXISTS favourites;
CREATE TABLE favourites (
    user_id INT NOT NULL,
    company_id BIGINT NOT NULL
);

-- Test data
INSERT INTO favourites (user_id, company_id) VALUES (1, 4294969614);
INSERT INTO favourites (user_id, company_id) VALUES (1, 4295533401);
