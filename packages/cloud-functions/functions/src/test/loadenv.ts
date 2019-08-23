import fs from 'fs';
import YAML from 'yaml';

const envFile = '.env.staging.yaml';

export const loadLocalEnv = () => {
  const file = fs.readFileSync(envFile, 'utf8');
  const doc = YAML.parseDocument(file);
  // @ts-ignore
  process.env = { ...process.env, ...doc.contents };
};
