import yaml


# helper function
# Load database configuration from YAML file
def load_config(filename):
    with open(filename, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)
    return config
