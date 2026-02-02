/**
 * Metadata for OpenAPI query parameters.
 * Contains descriptions, examples, defaults, and validation constraints.
 */

export interface ParameterMetadata {
    description: string;
    example?: string | number | boolean;
    default?: string | number | boolean;
    type: 'string' | 'integer' | 'boolean';
    required?: boolean;
    enum?: string[];
    minimum?: number;
    maximum?: number;
    aliases?: string[];
}

export const parameterMetadata: Record<string, ParameterMetadata> = {
    // Required parameter
    url: {
        description: 'The URL to scrape. Must be a fully qualified URL including the protocol (http:// or https://).',
        example: 'https://example.com',
        type: 'string',
        required: true,
    },

    // JavaScript rendering
    render_js: {
        description: 'Enable JavaScript rendering using a headless browser. When false, uses a simple HTTP request without browser. Also accepts: `browser` (ScrapingAnt), `render` (ScraperAPI).',
        example: true,
        default: true,
        type: 'boolean',
        aliases: ['browser', 'render'],
    },

    // Device and viewport
    device: {
        description: 'Device type to emulate. Affects User-Agent and viewport dimensions. Also accepts: `device_type` (ScraperAPI).',
        example: 'desktop',
        default: 'desktop',
        type: 'string',
        enum: ['desktop', 'mobile'],
        aliases: ['device_type'],
    },

    window_width: {
        description: 'Browser viewport width in pixels. Only applies when render_js is enabled.',
        example: 1920,
        default: 1920,
        type: 'integer',
        minimum: 100,
        maximum: 3840,
    },

    window_height: {
        description: 'Browser viewport height in pixels. Only applies when render_js is enabled.',
        example: 1080,
        default: 1080,
        type: 'integer',
        minimum: 100,
        maximum: 2160,
    },

    // Waiting options
    wait: {
        description: 'Time to wait in milliseconds after page load before returning content.',
        example: 1000,
        type: 'integer',
        minimum: 0,
        maximum: 35000,
    },

    wait_for: {
        description: 'CSS selector to wait for before returning content. Useful for SPAs where content loads dynamically. Also accepts: `wait_for_selector` (ScrapingAnt/ScraperAPI).',
        example: '#main-content',
        type: 'string',
        aliases: ['wait_for_selector'],
    },

    wait_browser: {
        description: 'Browser event to wait for before considering the page loaded.',
        example: 'networkidle',
        default: 'load',
        type: 'string',
        enum: ['load', 'domcontentloaded', 'networkidle'],
    },

    // Screenshot options
    screenshot: {
        description: 'Take a screenshot of the visible viewport. Returns base64-encoded PNG in json_response mode, or raw binary otherwise.',
        example: true,
        default: false,
        type: 'boolean',
    },

    screenshot_full_page: {
        description: 'Take a full-page screenshot (entire scrollable area). Overrides screenshot parameter.',
        example: true,
        default: false,
        type: 'boolean',
    },

    screenshot_selector: {
        description: 'CSS selector of element to screenshot. Overrides screenshot and screenshot_full_page parameters.',
        example: '#hero-image',
        type: 'string',
    },

    // Content extraction
    extract_rules: {
        description: 'JSON object defining extraction rules. Keys are output field names, values define selectors and extraction behavior. Returns extracted data as JSON.',
        example: '{"title": {"selector": "h1", "type": "item"}}',
        type: 'string',
    },

    js_scenario: {
        description: 'JSON object defining a sequence of browser actions. Each instruction is an object with action name as key and parameter as value. Actions: wait (ms), wait_for (selector), click (selector), scroll_x/scroll_y (pixels), fill ([selector, value]), wait_browser (load|domcontentloaded|networkidle), evaluate (js code), wait_for_and_click (selector).',
        example: '{"instructions": [{"click": "#load-more"}, {"wait": 1000}]}',
        type: 'string',
    },

    // Response options
    json_response: {
        description: 'Return response as JSON with metadata including cookies, headers, XHR requests, and more. Without this, returns raw HTML/binary content.',
        example: true,
        default: false,
        type: 'boolean',
    },

    return_page_source: {
        description: 'Return the original page source HTML instead of the rendered DOM. Useful for debugging or when you need the unmodified HTML.',
        example: false,
        default: false,
        type: 'boolean',
    },

    transparent_status_code: {
        description: 'Return the actual HTTP status code from the target website instead of 200. Useful for detecting errors or redirects.',
        example: true,
        default: false,
        type: 'boolean',
    },

    // Headers and cookies
    forward_headers: {
        description: 'Forward custom headers to the target website. Headers should be prefixed with "Spb-" or "spb-" (prefix is stripped before forwarding).',
        example: true,
        default: false,
        type: 'boolean',
    },

    forward_headers_pure: {
        description: 'Forward all non-prefixed headers directly to the target website without modification.',
        example: true,
        default: false,
        type: 'boolean',
    },

    cookies: {
        description: 'Cookies to send with the request. Format: "name1=value1;name2=value2" or JSON array of cookie objects.',
        example: 'session_id=abc123;user=john',
        type: 'string',
    },

    // Timeout
    timeout: {
        description: 'Maximum time in milliseconds to wait for the page to load. Includes all network requests and JavaScript execution.',
        example: 30000,
        default: 140000,
        type: 'integer',
        minimum: 1000,
        maximum: 3600000,
    },

    // Proxy options
    own_proxy: {
        description: 'Use your own proxy server. Format: "http://user:pass@host:port" or "http://host:port".',
        example: 'http://user:pass@proxy.example.com:8080',
        type: 'string',
    },

    premium_proxy: {
        description: 'Use premium residential proxies for better success rates on difficult targets. Also accepts: `stealth_proxy`, `premium` (ScraperAPI), `ultra_premium` (ScraperAPI).',
        example: true,
        default: false,
        type: 'boolean',
        aliases: ['stealth_proxy', 'premium', 'ultra_premium'],
    },

    stealth_proxy: {
        description: 'Alias for premium_proxy. Use premium residential proxies for better success rates.',
        example: true,
        default: false,
        type: 'boolean',
    },

    country_code: {
        description: 'Two-letter ISO country code for geo-targeting. Proxy will use an IP from the specified country. Also accepts: `proxy_country` (ScrapingAnt).',
        example: 'US',
        type: 'string',
        aliases: ['proxy_country'],
    },

    // Resource blocking
    block_resources: {
        description: 'Block resource types to speed up page loading. Set to true to block common resource types (images, fonts, stylesheets, media).',
        example: true,
        default: false,
        type: 'boolean',
    },

    // Google-specific
    custom_google: {
        description: 'Enable optimizations for scraping Google Search results.',
        example: true,
        default: false,
        type: 'boolean',
    },

    // ScrapingAnt-specific parameters
    js_snippet: {
        description: 'Base64-encoded JavaScript snippet to execute on the page. The script runs after page load but before content extraction. (ScrapingAnt compatible)',
        example: 'Y29uc29sZS5sb2coIkhlbGxvIik=',
        type: 'string',
    },

    proxy_type: {
        description: 'Type of proxy to use. "datacenter" is faster but may be blocked by some sites. "residential" has better success rates. (ScrapingAnt compatible)',
        example: 'residential',
        default: 'datacenter',
        type: 'string',
        enum: ['datacenter', 'residential'],
    },

    block_resource: {
        description: 'Comma-separated list of resource types to block (e.g., "image,stylesheet,font"). More granular than block_resources. (ScrapingAnt compatible)',
        example: 'image,stylesheet,font,media',
        type: 'string',
    },

    // ScraperAPI-specific parameters
    binary_target: {
        description: 'Fetch binary files (images, PDFs, etc.) instead of HTML. Returns the raw binary content. (ScraperAPI compatible)',
        example: true,
        default: false,
        type: 'boolean',
    },

    keep_headers: {
        description: 'Forward all request headers to the target website. Similar to forward_headers_pure but may include additional headers. (ScraperAPI compatible)',
        example: true,
        default: false,
        type: 'boolean',
    },
};

/**
 * Get all parameter names including aliases
 */
export function getAllParameterNames(): string[] {
    const names = Object.keys(parameterMetadata);
    for (const meta of Object.values(parameterMetadata)) {
        if (meta.aliases) {
            names.push(...meta.aliases);
        }
    }
    return [...new Set(names)];
}
