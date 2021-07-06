/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { dump } from 'js-yaml';

// read json object and convert it into a yaml content
export function convertJsonToYaml(json: Record<string, unknown>): string {
  try {
    const yamlContent: string = dump(json, { noArrayIndent: true });
    return yamlContent;
    //TODO: add yaml content validation
  } catch (error) {
    throw new Error(error);
  }
}
