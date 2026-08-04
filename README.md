# mcp-cataas

CATAAS MCP — Cat as a Service (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `random_cat` | Get a random cat image. Returns image URL, cat ID, and associated tags. |
| `cat_by_tag` | Get a random cat image matching a specific tag (e.g., 'orange', 'cute', 'sleepy'). Returns image URL, cat ID, and tags. |
| `list_tags` | List all available cat tags for filtering. Use tag names with cat_by_tag to find cats by appearance or behavior. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "cataas": {
      "url": "https://gateway.pipeworx.io/cataas/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Cataas data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
