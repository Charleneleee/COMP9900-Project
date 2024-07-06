DROP TABLE IF EXISTS analysis_histories;
CREATE TABLE analysis_histories (
    user_id INT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    data JSONB NOT NULL
);