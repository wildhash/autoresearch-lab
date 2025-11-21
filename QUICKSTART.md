# AutoResearch Lab - Quickstart Guide

## Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)
- An Anthropic API key (required)
- Optional: Redis, API keys for TRM Labs, Finster AI, Senso, Skyflow, Sanity CMS

## Installation

1. Clone the repository:
```bash
git clone https://github.com/wildhash/autoresearch-lab.git
cd autoresearch-lab
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

4. Edit `.env` and add at minimum your Anthropic API key:
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

5. Run the system:
```bash
npm run dev
```

## First Research Query

By default, the system runs a demo research query about blockchain security trends. You can modify this in `src/index.js` or create your own script:

```javascript
import { ResearchOrchestrator } from './src/orchestrator.js';

const orchestrator = new ResearchOrchestrator();

const result = await orchestrator.conductResearch(
  'What are the key innovations in quantum computing in 2024?',
  {
    useCache: true,
    enableReflexion: true,
  }
);

console.log(result.report);
```

## Understanding the Output

The research process follows 5 phases:

1. **Planning** - Creates a structured research plan
2. **Execution** - Queries APIs and collects data
3. **Analysis** - Identifies patterns and insights
4. **Critical Review** - Evaluates findings for gaps and biases
5. **Report Generation** - Synthesizes everything into a comprehensive report

## Optional Services

### Redis (Memory & Cache)
Install Redis locally or use a cloud provider:
```bash
# Using Docker
docker run -p 6379:6379 redis:latest

# Or install locally
# macOS: brew install redis
# Ubuntu: sudo apt-get install redis-server
```

Then update `.env`:
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
```

### API Services

Add API keys for additional data sources:
```bash
TRM_LABS_API_KEY=your_key
FINSTER_AI_API_KEY=your_key
SENSO_API_KEY=your_key
```

### Sanity CMS (Knowledge Base)

1. Create a Sanity project at https://www.sanity.io/
2. Get your project ID and token
3. Update `.env`:
```bash
SANITY_PROJECT_ID=your_project_id
SANITY_TOKEN=your_token
```

### Skyflow (Security)

For handling sensitive data:
```bash
SKYFLOW_VAULT_ID=your_vault_id
SKYFLOW_VAULT_URL=your_vault_url
SKYFLOW_API_KEY=your_api_key
```

## Troubleshooting

### "Anthropic API key not configured"
- Make sure you've created a `.env` file from `.env.example`
- Verify your API key is correct and active

### "Redis not available"
- This is normal if Redis isn't installed
- The system uses a mock client automatically
- No impact on core functionality

### Module errors
- Run `npm install` to ensure all dependencies are installed
- Verify you're using Node.js 18.0.0 or higher: `node --version`

## Next Steps

- Customize the demo research question in `src/index.js`
- Add your own API integrations in `src/services/api.js`
- Adjust agent prompts in `src/agents/` for your use case
- Build a web interface or API around the orchestrator

## Getting Help

- Check the main README.md for architecture details
- Review the code in `src/` for implementation details
- Open an issue on GitHub for bugs or questions
