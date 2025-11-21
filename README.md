# AutoResearch Lab

Autonomous AI researcher that hits APIs, runs experiments, and ships research reports in minutes.

## Overview

AutoResearch Lab is a multi-agent system that conducts autonomous research using Claude AI agents. It orchestrates five specialized agents that work together to plan, execute, analyze, critique, and report on research questions.

### ⭐ Key Features

- **🔄 Reflexion Loop** - System learns from past research and improves over time
- **📦 Mock Data Fallbacks** - Works without API keys using realistic mock data
- **🎨 Colorful Console Output** - Beautiful, readable output with chalk
- **💾 Persistent Learning** - Stores insights in Redis for future research
- **🔌 Flexible API Integration** - Seamless fallback to mock data when APIs unavailable
- **⚡ Command-Line Interface** - Easy to use: `node src/index.js "Your question"`

## Stack

- **Agents**: Anthropic Claude (Planner, Executor, Analyst, Critic, Reporter)
- **Memory**: Redis (learnings + cache)
- **APIs**: TRM Labs, Finster AI, Senso via Postman
- **Security**: Skyflow
- **Knowledge Base**: Sanity CMS
- **Compute**: AWS / Parallel
- **UI**: Chalk for colorful console output

## Architecture

The system uses five specialized AI agents:

1. **Planner Agent** - Creates structured research plans with clear objectives
2. **Executor Agent** - Executes API calls and collects data (with mock data fallback)
3. **Analyst Agent** - Analyzes results and identifies insights
4. **Critic Agent** - Provides critical evaluation and extracts learnings
5. **Reporter Agent** - Synthesizes findings into comprehensive reports

All agents use:
- **Redis** for caching and storing learnings
- **Reflexion loops** to improve through self-critique
- **Mock data** for development without API credentials
- **Sanity CMS** to build a knowledge base over time

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Anthropic API key to .env
# ANTHROPIC_API_KEY=your_key_here

# Run the system with a question
node src/index.js "What are the highest risks in DeFi bridges right now?"

# Or run the default demo
npm run dev

# Run tests
npm test
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

**Command Line (Easiest):**
```bash
# Run with a custom question
node src/index.js "What are the highest risks in DeFi bridges right now?"

# Run default demo question
npm run dev
```

**Programmatically:**
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

### Research Process (6 Phases)

1. **Memory** - Retrieves past learnings for context
2. **Planning** - Breaks down the question into actionable steps
3. **Execution** - Queries APIs and collects data (with mock fallback)
4. **Analysis** - Identifies patterns and insights
5. **Reporting** - Generates comprehensive report
6. **Critique** - Evaluates findings and saves learnings (Reflexion Loop)

### Memory & Learning (Reflexion Loop)

The system continuously improves through the Reflexion Loop:
- 🔄 **Critic agent** evaluates each research and extracts key learnings
- 💾 **Learnings are stored** in Redis, categorized by topic
- 🧠 **Future research** uses past learnings for better context
- 📈 **Quality improves** over time through accumulated insights

Example learnings:
```javascript
// Get learnings for a specific topic
const defiLearnings = await redisService.getLearnings('defi');

// Save a new learning
await redisService.saveLearning('security', 
  'Always check multi-sig implementations in bridge protocols');
```

### Mock Data System

The system includes realistic mock data for all APIs, enabling:
- ✅ Development without API credentials
- ✅ Testing complete workflows offline  
- ✅ Consistent, reproducible results
- ✅ Cost-free experimentation

Mock data is automatically used when:
- API keys are not configured
- API calls fail or timeout
- You're in development/testing mode

See `examples/mock-data-demo.js` for a full demonstration.

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
│   │   ├── ReporterAgent.js
│   │   ├── prompts.js   # System prompts for all agents
│   │   └── index.js     # Agent wrapper functions
│   ├── services/        # External service integrations
│   │   ├── anthropic.js # Claude API with callClaude helper
│   │   ├── redis.js     # Redis with learning storage
│   │   ├── api.js       # External API clients
│   │   ├── mockData.js  # Mock data for development
│   │   ├── sanity.js
│   │   └── skyflow.js
│   ├── orchestrator.js  # Main research coordinator
│   └── index.js         # Entry point with CLI support
├── config/
│   └── index.js         # Configuration management
├── test/
│   └── test-basic.js    # Test suite
├── examples/            # Example scripts
│   ├── reflexion-loop.js    # Demonstrates learning system
│   ├── mock-data-demo.js    # Shows mock data usage
│   ├── custom-research.js
│   └── multiple-research.js
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

**Note:** Mock data is automatically provided for all APIs when credentials are not configured.

## Testing

```bash
# Run test suite
npm test

# Run mock data demo (no API keys needed)
node examples/mock-data-demo.js

# Run Reflexion Loop example (requires Anthropic API key)
node examples/reflexion-loop.js
```

The test suite validates:
- Mock data structure and availability
- Redis learning storage and retrieval
- Cache functionality
- Basic system integration

## Security

Sensitive data is protected using Skyflow:
- Tokenization of API keys and credentials
- Secure vault storage
- Data privacy compliance

## Development

```bash
# Install dependencies
npm install

# Run in development mode (with default question)
npm run dev

# Run with custom question
node src/index.js "Your research question"

# Run tests
npm test

# Try examples
node examples/mock-data-demo.js
node examples/reflexion-loop.js
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
