/**
 * OpenAPI response schemas derived from types.ts
 */

import type { SchemaObject } from './types.js';

export const cookieSchema: SchemaObject = {
    type: 'object',
    description: 'Browser cookie',
    properties: {
        name: { type: 'string', description: 'Cookie name' },
        value: { type: 'string', description: 'Cookie value' },
        domain: { type: 'string', description: 'Cookie domain' },
        path: { type: 'string', description: 'Cookie path' },
        expires: { type: 'number', description: 'Expiration timestamp', nullable: true },
        httpOnly: { type: 'boolean', description: 'HTTP-only flag' },
        secure: { type: 'boolean', description: 'Secure flag' },
        sameSite: {
            type: 'string',
            enum: ['Strict', 'Lax', 'None'],
            description: 'SameSite attribute',
        },
    },
};

export const xhrRequestDataSchema: SchemaObject = {
    type: 'object',
    description: 'Captured XHR/Fetch request data',
    properties: {
        url: { type: 'string', description: 'Request URL' },
        statusCode: { type: 'integer', description: 'HTTP status code' },
        method: { type: 'string', description: 'HTTP method (GET, POST, etc.)' },
        requestHeaders: {
            type: 'object',
            additionalProperties: { type: 'string' },
            description: 'Request headers sent',
        },
        headers: {
            type: 'object',
            additionalProperties: { type: 'string' },
            description: 'Response headers received',
        },
        body: { type: 'string', description: 'Response body' },
    },
    required: ['url', 'statusCode', 'method', 'requestHeaders', 'headers', 'body'],
};

export const iframeDataSchema: SchemaObject = {
    type: 'object',
    description: 'Iframe content data',
    properties: {
        src: { type: 'string', description: 'Iframe source URL' },
        content: { type: 'string', description: 'Iframe HTML content' },
    },
    required: ['src', 'content'],
};

export const individualInstructionReportSchema: SchemaObject = {
    type: 'object',
    description: 'Report for a single JS scenario instruction',
    properties: {
        task: {
            type: 'string',
            enum: ['wait', 'wait_for', 'click', 'scroll_x', 'scroll_y', 'fill', 'wait_browser', 'evaluate'],
            description: 'The action that was executed',
        },
        params: {
            oneOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'array', items: { type: 'string' } },
            ],
            description: 'Parameters passed to the action',
        },
        success: { type: 'boolean', description: 'Whether the action succeeded' },
        duration: { type: 'number', description: 'Execution time in milliseconds' },
    },
    required: ['task', 'params', 'success', 'duration'],
};

export const jsScenarioReportSchema: SchemaObject = {
    type: 'object',
    description: 'Report of JS scenario execution',
    properties: {
        tasks: {
            type: 'array',
            items: individualInstructionReportSchema,
            description: 'Individual task reports',
        },
        taskExecuted: { type: 'integer', description: 'Number of tasks executed' },
        taskSuccess: { type: 'integer', description: 'Number of successful tasks' },
        taskFailure: { type: 'integer', description: 'Number of failed tasks' },
        totalDuration: { type: 'number', description: 'Total execution time in milliseconds' },
    },
    required: ['tasks', 'taskExecuted', 'taskSuccess', 'taskFailure', 'totalDuration'],
};

export const verboseResultSchema: SchemaObject = {
    type: 'object',
    description: 'Full response with metadata (returned when json_response=true)',
    properties: {
        body: {
            oneOf: [
                { type: 'string', description: 'HTML content or extracted data as string' },
                { type: 'object', description: 'Extracted data as JSON object' },
            ],
            description: 'Page content or extracted data',
        },
        cookies: {
            type: 'array',
            items: cookieSchema,
            description: 'Cookies set by the page',
        },
        evaluateResults: {
            type: 'array',
            items: { type: 'string' },
            description: 'Results from evaluate actions in js_scenario',
        },
        jsScenarioReport: {
            oneOf: [
                jsScenarioReportSchema,
                { type: 'object', additionalProperties: false, description: 'Empty object if no scenario was executed' },
            ],
            description: 'JS scenario execution report',
        },
        headers: {
            type: 'object',
            additionalProperties: {
                oneOf: [
                    { type: 'string' },
                    { type: 'array', items: { type: 'string' } },
                ],
            },
            description: 'Response headers from the target page',
        },
        type: {
            type: 'string',
            enum: ['html', 'json', 'file'],
            description: 'Content type of the response body',
        },
        screenshot: {
            type: 'string',
            nullable: true,
            description: 'Base64-encoded PNG screenshot (if requested)',
        },
        iframes: {
            type: 'array',
            items: iframeDataSchema,
            description: 'Content of iframes on the page',
        },
        xhr: {
            type: 'array',
            items: xhrRequestDataSchema,
            description: 'Captured XHR/Fetch requests made by the page',
        },
        initialStatusCode: {
            type: 'integer',
            nullable: true,
            description: 'HTTP status code of the initial page request',
        },
        resolvedUrl: {
            type: 'string',
            description: 'Final URL after any redirects',
        },
        metadata: {
            type: 'string',
            description: 'Additional metadata (if available)',
        },
    },
    required: ['body', 'cookies', 'evaluateResults', 'jsScenarioReport', 'headers', 'type', 'screenshot', 'iframes', 'xhr', 'initialStatusCode', 'resolvedUrl'],
};

export const errorResponseSchema: SchemaObject = {
    type: 'object',
    description: 'Error response',
    properties: {
        errorMessage: {
            type: 'string',
            description: 'Human-readable error message',
        },
    },
    required: ['errorMessage'],
};

export const extractRuleSchema: SchemaObject = {
    type: 'object',
    description: 'Rule for extracting data from the page',
    properties: {
        selector: {
            type: 'string',
            description: 'CSS selector to target elements',
        },
        type: {
            type: 'string',
            enum: ['list', 'item'],
            description: 'Whether to extract a single item or a list of items',
        },
        output: {
            oneOf: [
                { type: 'string', description: 'Attribute name or special value (@text, @html)' },
                {
                    type: 'object',
                    additionalProperties: { $ref: '#/components/schemas/ExtractRule' },
                    description: 'Nested extraction rules',
                },
            ],
            description: 'What to extract from matched elements',
        },
        clean: {
            type: 'boolean',
            description: 'Whether to clean/trim the extracted text',
        },
    },
    required: ['selector', 'type', 'output'],
};

export const extractRulesSchema: SchemaObject = {
    type: 'object',
    description: 'Extract rules object. Keys are output field names, values are extraction rules.',
    additionalProperties: extractRuleSchema,
    example: {
        title: {
            selector: 'h1',
            type: 'item',
            output: '@text',
        },
        links: {
            selector: 'a',
            type: 'list',
            output: '@href',
        },
    },
};

export const jsScenarioSchema: SchemaObject = {
    type: 'object',
    description: 'JavaScript scenario to execute on the page. Each instruction is an object with the action name as key and parameter as value.',
    properties: {
        instructions: {
            type: 'array',
            items: {
                type: 'object',
                description: 'Single instruction object where key is the action name and value is the parameter. Actions: wait (ms), wait_for (selector), click (selector), scroll_x (pixels), scroll_y (pixels), fill ([selector, value]), wait_browser (load|domcontentloaded|networkidle), evaluate (js code), wait_for_and_click (selector)',
                minProperties: 1,
                maxProperties: 1,
                additionalProperties: {
                    oneOf: [
                        { type: 'string' },
                        { type: 'number' },
                        { type: 'array', items: { type: 'string' } },
                    ],
                },
            },
            description: 'List of actions to perform in order',
        },
        strict: {
            type: 'boolean',
            description: 'If true, stop execution on first failure. Default is true.',
            default: true,
        },
    },
    required: ['instructions'],
    example: {
        instructions: [
            { click: '#load-more' },
            { wait: 1000 },
            { scroll_y: 500 },
            { wait_for: '.lazy-content' },
        ],
        strict: false,
    },
};

/**
 * All schemas for components section
 */
export const componentSchemas = {
    VerboseResult: verboseResultSchema,
    ErrorResponse: errorResponseSchema,
    Cookie: cookieSchema,
    XHRRequestData: xhrRequestDataSchema,
    IFrameData: iframeDataSchema,
    JsScenarioReport: jsScenarioReportSchema,
    IndividualInstructionReport: individualInstructionReportSchema,
    ExtractRule: extractRuleSchema,
    ExtractRules: extractRulesSchema,
    JsScenario: jsScenarioSchema,
};
