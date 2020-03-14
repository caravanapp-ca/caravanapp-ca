import fs from 'fs';
import YAML from 'yaml';

const envFile = '.env.staging.yaml';

export const loadLocalEnv = () => {
  const file = fs.readFileSync(envFile, 'utf8');
  const doc = YAML.parse(file);
  process.env = { ...process.env, ...doc };
  console.log('Loaded local env');
};
