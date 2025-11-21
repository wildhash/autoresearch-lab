# AutoResearch Lab

Autonomous AI researcher that hits APIs, runs experiments, and ships research reports in minutes.

## Overview

AutoResearch Lab is a multi-agent system that conducts autonomous research using Claude AI agents. It orchestrates five specialized agents that work together to plan, execute, analyze, critique, and report on research questions.

## Stack

- **Agents**: Anthropic Claude (Planner, Executor, Analyst, Critic, Reporter)
- **Memory**: Redis (learnings + cache)
- **APIs**: TRM Labs, Finster AI, Senso via Postman
- **Security**: Skyflow
- **Knowledge Base**: Sanity CMS
- **Compute**: AWS / Parallel

## Architecture

The system uses five specialized AI agents:

1. **Planner Agent** - Creates structured research plans with clear objectives
2. **Executor Agent** - Executes API calls and collects data
3. **Analyst Agent** - Analyzes results and identifies insights
4. **Critic Agent** - Provides critical evaluation and suggests improvements
5. **Reporter Agent** - Synthesizes findings into comprehensive reports

All agents use:
- **Redis** for caching and storing learnings
- **Reflexion loops** to improve through self-critique
- **Sanity CMS** to build a knowledge base over time

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Anthropic API key to .env
# ANTHROPIC_API_KEY=your_key_here

# Run the system
npm run dev
```

## Configuration

The system requires an Anthropic API key as a minimum. Other services are optional:

### Required
- `ANTHROPIC_API_KEY` - Your Anthropic Claude API key

### Optional
- **Redis** - For caching and learning storage (falls back to mock if unavailable)
- **TRM Labs API** - For blockchain/crypto research
- **Finster AI API** - For AI-powered analysis
- **Senso API** - For additional data sources
- **Skyflow** - For secure data handling
- **Sanity CMS** - For building a persistent knowledge base
- **AWS** - For parallel compute and storage

See `.env.example` for all available configuration options.

## Usage

### Running Research

The system automatically runs a demo research question on startup. To customize:

```javascript
import { ResearchOrchestrator } from './src/orchestrator.js';

const orchestrator = new ResearchOrchestrator();

const result = await orchestrator.conductResearch(
  'Your research question here',
  {
    useCache: true,        // Use cached results when available
    enableReflexion: true, // Enable self-improvement loops
  }
);

console.log(result.report);
```

### Research Process

1. **Planning** - Breaks down the question into actionable steps
2. **Execution** - Queries APIs and collects data
3. **Analysis** - Identifies patterns and insights
4. **Critique** - Evaluates findings for gaps and biases
5. **Reporting** - Generates comprehensive report

### Memory & Learning

The system stores learnings in Redis to improve over time:
- Caches agent responses to speed up similar queries
- Stores insights from past research
- Builds a knowledge base in Sanity CMS

## Project Structure

```
autoresearch-lab/
├── src/
│   ├── agents/          # AI agent implementations
│   │   ├── BaseAgent.js
│   │   ├── PlannerAgent.js
│   │   ├── ExecutorAgent.js
│   │   ├── AnalystAgent.js
│   │   ├── CriticAgent.js
│   │   └── ReporterAgent.js
│   ├── services/        # External service integrations
│   │   ├── anthropic.js
│   │   ├── redis.js
│   │   ├── api.js
│   │   ├── sanity.js
│   │   └── skyflow.js
│   ├── orchestrator.js  # Main research coordinator
│   └── index.js         # Entry point
├── config/
│   └── index.js         # Configuration management
├── .env.example         # Environment template
├── package.json
└── README.md
```

## API Integrations

### TRM Labs
Blockchain intelligence and crypto analytics.

### Finster AI
AI-powered financial and business analysis.

### Senso
Market data and sentiment analysis via Postman.

Each API can be queried through the Executor Agent:
```javascript
await apiService.query('trmlabs', '/endpoint', { params });
```

## Security

Sensitive data is protected using Skyflow:
- Tokenization of API keys and credentials
- Secure vault storage
- Data privacy compliance

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests (when implemented)
npm test
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
