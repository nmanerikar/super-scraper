#!/usr/bin/env tsx
/**
 * OpenAPI specification generator for SuperScraper API
 *
 * Generates openapi.json from:
 * - Parameter enums from src/params.ts
 * - Parameter metadata from src/openapi/parameter-metadata.ts
 * - Response schemas from src/openapi/response-schemas.ts
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { parameterMetadata } from '../src/openapi/parameter-metadata.js';
import { componentSchemas } from '../src/openapi/response-schemas.js';
import type { OpenAPISpec, ParameterObject, SchemaObject } from '../src/openapi/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Build OpenAPI parameter object from metadata
 */
function buildParameter(name: string, meta: typeof parameterMetadata[string]): ParameterObject {
    const schema: SchemaObject = {
        type: meta.type,
    };

    if (meta.enum) {
        schema.enum = meta.enum;
    }
    if (meta.minimum !== undefined) {
        schema.minimum = meta.minimum;
    }
    if (meta.maximum !== undefined) {
        schema.maximum = meta.maximum;
    }
    if (meta.default !== undefined && meta.default !== false) {
        schema.default = meta.default;
    }

    const param: ParameterObject = {
        name,
        in: 'query',
        description: meta.description,
        required: meta.required ?? false,
        schema,
    };

    if (meta.example !== undefined) {
        param.example = meta.example;
    }

    return param;
}

/**
 * Generate the complete OpenAPI specification
 */
function generateOpenAPISpec(): OpenAPISpec {
    // Build parameters array
    const parameters: ParameterObject[] = Object.entries(parameterMetadata).map(
        ([name, meta]) => buildParameter(name, meta),
    );

    const spec: OpenAPISpec = {
        openapi: '3.0.3',
        info: {
            title: 'SuperScraper API',
            description: `SuperScraper is a unified web scraping API that provides compatibility with multiple scraping services (ScrapingBee, ScrapingAnt, ScraperAPI).

## Features
- JavaScript rendering with headless browser
- Screenshot capture (viewport, full page, or specific element)
- Custom JavaScript execution via scenarios
- Data extraction with CSS selectors
- Proxy support (datacenter and residential)
- Cookie and header forwarding
- XHR/Fetch request capture

## Response Formats
- **HTML (default)**: Returns raw HTML content
- **JSON (json_response=true)**: Returns structured response with metadata
- **Screenshot**: Returns PNG image when only screenshot is requested
- **Extracted data**: Returns JSON when extract_rules are provided

## Compatibility
This API accepts parameters from multiple scraping services:
- **ScrapingBee** (primary): All parameters use ScrapingBee naming
- **ScrapingAnt**: Compatible parameters like \`browser\`, \`js_snippet\`, \`proxy_type\`
- **ScraperAPI**: Compatible parameters like \`render\`, \`premium\`, \`binary_target\``,
            version: '1.0.0',
            contact: {
                name: 'Apify',
                url: 'https://apify.com',
            },
            license: {
                name: 'ISC',
            },
        },
        servers: [
            {
                url: 'https://super-scraper.apify.actor',
                description: 'Production server',
            },
            {
                url: 'http://localhost:3000',
                description: 'Local development server',
            },
        ],
        tags: [
            {
                name: 'Scraping',
                description: 'Web scraping operations',
            },
        ],
        paths: {
            '/': {
                get: {
                    summary: 'Scrape a web page',
                    description: `Fetches and processes a web page with optional JavaScript rendering, screenshots, and data extraction.

## Basic Usage
\`\`\`
GET /?url=https://example.com
\`\`\`

## With JavaScript Rendering
\`\`\`
GET /?url=https://example.com&render_js=true&wait=2000
\`\`\`

## With Data Extraction
\`\`\`
GET /?url=https://example.com&extract_rules={"title":{"selector":"h1","type":"item","output":"@text"}}
\`\`\`

## With Screenshot
\`\`\`
GET /?url=https://example.com&screenshot=true&json_response=true
\`\`\``,
                    operationId: 'scrape',
                    tags: ['Scraping'],
                    parameters,
                    responses: {
                        '200': {
                            description: 'Successful response. Content type depends on request parameters.',
                            content: {
                                'text/html': {
                                    schema: {
                                        type: 'string',
                                        description: 'Raw HTML content of the page',
                                    },
                                },
                                'application/json': {
                                    schema: {
                                        oneOf: [
                                            { $ref: '#/components/schemas/VerboseResult' },
                                            {
                                                type: 'object',
                                                description: 'Extracted data (when using extract_rules without json_response)',
                                                additionalProperties: true,
                                            },
                                        ],
                                    },
                                },
                                'image/png': {
                                    schema: {
                                        type: 'string',
                                        format: 'binary',
                                        description: 'Screenshot image (when screenshot requested without json_response)',
                                    },
                                },
                                'application/octet-stream': {
                                    schema: {
                                        type: 'string',
                                        format: 'binary',
                                        description: 'Binary file content (when binary_target=true)',
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Bad request - missing or invalid parameters',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                },
                            },
                        },
                        '408': {
                            description: 'Request timeout - page took too long to load',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                },
                            },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                },
                            },
                        },
                        '502': {
                            description: 'Target website error (when transparent_status_code=true)',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                },
                            },
                        },
                    },
                },
            },
        },
        components: {
            schemas: componentSchemas,
        },
    };

    return spec;
}

/**
 * Main function
 */
function main(): void {
    console.log('Generating OpenAPI specification...');

    const spec = generateOpenAPISpec();
    const outputPath = resolve(__dirname, '../.actor/openapi.json');

    writeFileSync(outputPath, JSON.stringify(spec, null, 2));

    console.log(`OpenAPI specification written to: ${outputPath}`);
    console.log(`Total parameters documented: ${Object.keys(parameterMetadata).length}`);
    console.log(`Total schemas documented: ${Object.keys(componentSchemas).length}`);
}

main();
