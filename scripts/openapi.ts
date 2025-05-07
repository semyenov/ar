import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Define interface for endpoint information
interface EndpointInfo {
  path: string;
  method: string;
  operationId: string;
  summary: string;
}

// Simplified interface that only includes the requested fields
interface SimplifiedEndpointInfo {
  operationId: string;
  summary: string;
}

// Main function to parse the OpenAPI file
async function parseOpenApi(filePath: string): Promise<EndpointInfo[]> {
  try {
    // Read the YAML file
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse the YAML content
    const apiSpec = yaml.load(fileContent) as any;

    // Array to store the endpoint information
    const endpoints: EndpointInfo[] = [];

    // Iterate through all paths
    for (const path in apiSpec.paths) {
      // Iterate through all HTTP methods for this path
      for (const method in apiSpec.paths[path]) {
        const endpoint = apiSpec.paths[path][method];

        // Check if operationId and summary exist
        if (endpoint.operationId && endpoint.summary) {
          endpoints.push({
            path,
            method,
            operationId: endpoint.operationId,
            summary: endpoint.summary
          });
        }
      }
    }

    return endpoints;
  } catch (error) {
    console.error('Error parsing OpenAPI file:', error);
    throw error;
  }
}

// Function to output the results
function outputResults(endpoints: EndpointInfo[], saveToFile: boolean = false): void {
  console.log('Parsed Endpoints:');
  console.log('-----------------');

  // Create simplified array with only operationId and summary
  const simplifiedEndpoints: SimplifiedEndpointInfo[] = endpoints.map(endpoint => ({
    operationId: endpoint.operationId,
    summary: endpoint.summary
  }));

  // Console output
  endpoints.forEach(endpoint => {
    console.log(`OperationId: use${endpoint.operationId[0].toUpperCase() + endpoint.operationId.slice(1)}`);
    console.log(`Summary: ${endpoint.summary}`);
    console.log('-----------------');
  });

  // Save to file if requested
  if (saveToFile) {
    const outputFilePath = path.resolve(process.cwd(), 'openapi-endpoints.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(simplifiedEndpoints, null, 2));
    console.log(`Endpoints saved to: ${outputFilePath}`);
  }
}

// Main execution
async function main() {
  const openApiFilePath = path.resolve(process.cwd(), 'openapi.yaml');
  const saveToFile = process.argv.includes('--save');

  try {
    const endpoints = await parseOpenApi(openApiFilePath);
    outputResults(endpoints, saveToFile);
    console.log(`Total endpoints found: ${endpoints.length}`);
  } catch (error) {
    process.exit(1);
  }
}

main();
