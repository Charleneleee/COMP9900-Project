DROP TABLE IF EXISTS frameworks;
CREATE TABLE frameworks (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    E_weight FLOAT NOT NULL,
    S_weight FLOAT NOT NULL,
    G_weight FLOAT NOT NULL
);

INSERT INTO frameworks (user_id, name, description, E_weight, S_weight, G_weight) VALUES
(0, 'IFRS', 'International Financial Reporting Standards', 0.8, 0.5, 0.1),
(0, 'TCFD', 'Task Force on Climate-related Financial Disclosures', 0.3, 0.4, 0.6),
(0, 'TNFD', 'Task Force on Nature-related Financial Disclosures', 0.5, 0.5, 0.2),
(0, 'APRA-CPG', 'Australian Prudential Regulation Authority - Corporate Governance Practice Guide', 0.3, 0.6, 0.7);
