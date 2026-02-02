/**
 * TypeScript interfaces for OpenAPI schema objects
 */

export interface SchemaObject {
    type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
    description?: string;
    enum?: string[];
    items?: SchemaObject;
    properties?: Record<string, SchemaObject>;
    additionalProperties?: SchemaObject | boolean;
    required?: string[];
    nullable?: boolean;
    example?: unknown;
    default?: unknown;
    oneOf?: SchemaObject[];
    $ref?: string;
    minimum?: number;
    maximum?: number;
}

export interface ParameterObject {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    description?: string;
    required?: boolean;
    schema: SchemaObject;
    example?: unknown;
}

export interface ResponseObject {
    description: string;
    content?: Record<string, { schema: SchemaObject }>;
}

export interface OperationObject {
    summary?: string;
    description?: string;
    operationId?: string;
    parameters?: ParameterObject[];
    responses: Record<string, ResponseObject>;
    tags?: string[];
}

export interface PathItemObject {
    get?: OperationObject;
    post?: OperationObject;
    put?: OperationObject;
    delete?: OperationObject;
    patch?: OperationObject;
}

export interface OpenAPISpec {
    openapi: string;
    info: {
        title: string;
        description?: string;
        version: string;
        contact?: {
            name?: string;
            url?: string;
            email?: string;
        };
        license?: {
            name: string;
            url?: string;
        };
    };
    servers?: Array<{
        url: string;
        description?: string;
    }>;
    paths: Record<string, PathItemObject>;
    components?: {
        schemas?: Record<string, SchemaObject>;
    };
    tags?: Array<{
        name: string;
        description?: string;
    }>;
}
