-- [Important] These two indexes are used to ensure the uniqueness of google_id and microsoft_id. Do not delete.
-- Create a partial unique index to ensure google_id is unique when not empty
DROP INDEX IF EXISTS idx_unique_google_id;
CREATE UNIQUE INDEX idx_unique_google_id ON users (google_id) WHERE google_id <> '';

-- Create a partial unique index to ensure microsoft_id is unique when not empty
DROP INDEX IF EXISTS idx_unique_microsoft_id;
CREATE UNIQUE INDEX idx_unique_microsoft_id ON users (microsoft_id) WHERE microsoft_id <> '';

-- [Less Important] These indexes are used for query acceleration and aggregation. Removing them may lead to performance degradation.
-- Create indexes for columns used in joins
DROP INDEX IF EXISTS idx_scores_company_id;
CREATE INDEX idx_scores_company_id ON scores (company_id);

DROP INDEX IF EXISTS idx_companies_id;
CREATE INDEX idx_companies_id ON companies (id);

DROP INDEX IF EXISTS idx_metrics_id;
CREATE INDEX idx_metrics_id ON metrics (id);

DROP INDEX IF EXISTS idx_indicator_metrics_metric_id;
CREATE INDEX idx_indicator_metrics_metric_id ON indicator_metrics (metric_id);

DROP INDEX IF EXISTS idx_indicator_metrics_indicator_id;
CREATE INDEX idx_indicators_id ON indicators (id);

DROP INDEX IF EXISTS idx_indicator_weights_indicator_id;
CREATE INDEX idx_indicator_weights_indicator_id ON indicator_weights (indicator_id);

DROP INDEX IF EXISTS idx_frameworks_id;
CREATE INDEX idx_frameworks_id ON frameworks (id);

-- Create indexes for columns used in query conditions, grouping, and sorting
DROP INDEX IF EXISTS idx_companies_name;
CREATE INDEX idx_companies_name ON companies (name);

DROP INDEX IF EXISTS idx_frameworks_name;
CREATE INDEX idx_frameworks_name ON frameworks (name);

DROP INDEX IF EXISTS idx_metrics_name;
CREATE INDEX idx_metrics_pillar ON metrics (pillar);

DROP INDEX IF EXISTS idx_indicators_name;
CREATE INDEX idx_indicators_name ON indicators (name);

DROP INDEX IF EXISTS idx_indicator_weights_framework_id;
CREATE INDEX idx_indicator_weights_framework_id ON indicator_weights (framework_id);

DROP INDEX IF EXISTS idx_metric_weights_metric_id;
CREATE INDEX idx_metric_weights_indicator_id ON metric_weights (indicator_id);

-- Accelerate the calculation of AVG(scores.score)
DROP INDEX IF EXISTS idx_scores_score;
CREATE INDEX idx_scores_score ON scores (score);
