DROP TYPE IF EXISTS data_type CASCADE;
CREATE TYPE data_type AS ENUM ('float', 'int');

DROP TYPE IF EXISTS disclosure_type CASCADE;
CREATE TYPE disclosure_type AS ENUM (
    'Calculated',
    'Estimated',
    'Reported',
    'Adjusted',
    'Imputed'
);