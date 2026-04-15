interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * CATAAS MCP — Cat as a Service (free, no auth)
 *
 * Returns cat image URLs and metadata from cataas.com.
 * Base: https://cataas.com
 *
 * Tools:
 * - random_cat: Get a random cat image URL and metadata
 * - cat_by_tag: Get a cat image URL filtered by a specific tag
 * - list_tags: List all available cat tags
 */


const BASE_URL = 'https://cataas.com';

type RawCatJson = {
  id: string;
  tags: string[];
  url?: string;
  createdAt?: string;
  updatedAt?: string;
  mimetype?: string;
  size?: number;
};

type RawTagsResponse = string[];

const tools: McpToolExport['tools'] = [
  {
    name: 'random_cat',
    description:
      'Get a random cat image from CATAAS (Cat as a Service). Returns the image URL, cat ID, and associated tags.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'cat_by_tag',
    description:
      'Get a random cat image matching a specific tag from CATAAS. Use list_tags first to discover available tags. Returns the image URL, cat ID, and tags.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description:
            'Tag to filter cats by (e.g. "cute", "orange", "grumpy"). Use list_tags to see available tags.',
        },
      },
      required: ['tag'],
    },
  },
  {
    name: 'list_tags',
    description:
      'List all available cat tags on CATAAS. Use these tags with cat_by_tag to find cats of a specific type or appearance.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'random_cat':
      return randomCat();
    case 'cat_by_tag':
      return catByTag(args.tag as string);
    case 'list_tags':
      return listTags();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function buildCatUrl(id: string): string {
  return `${BASE_URL}/cat/${id}`;
}

async function randomCat() {
  const res = await fetch(`${BASE_URL}/cat?json=true`);
  if (!res.ok) throw new Error(`CATAAS API error: ${res.status}`);
  const data = (await res.json()) as RawCatJson;
  return {
    id: data.id,
    url: buildCatUrl(data.id),
    tags: data.tags ?? [],
    mimetype: data.mimetype ?? null,
    created_at: data.createdAt ?? null,
  };
}

async function catByTag(tag: string) {
  const encodedTag = encodeURIComponent(tag);
  const res = await fetch(`${BASE_URL}/cat/${encodedTag}?json=true`);
  if (!res.ok) throw new Error(`CATAAS API error: ${res.status}`);
  const data = (await res.json()) as RawCatJson;
  return {
    id: data.id,
    url: buildCatUrl(data.id),
    tags: data.tags ?? [],
    mimetype: data.mimetype ?? null,
    created_at: data.createdAt ?? null,
    searched_tag: tag,
  };
}

async function listTags() {
  const res = await fetch(`${BASE_URL}/api/tags`);
  if (!res.ok) throw new Error(`CATAAS API error: ${res.status}`);
  const data = (await res.json()) as RawTagsResponse;
  return {
    count: data.length,
    tags: data,
  };
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
