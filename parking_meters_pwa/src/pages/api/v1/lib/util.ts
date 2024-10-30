export function validateEnvironmentVariables<T>(config: T): void {
    const missingVars: string[] = [];
  
    for (const key in config) {
      if (!process.env[key] && config[key] === undefined) {
        missingVars.push(key);
      }
    }
  
    if (missingVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
    }
  }
  