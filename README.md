# AutoResearch Lab

Autonomous AI researcher that hits APIs, runs experiments, and ships research reports in minutes.

## Overview

AutoResearch Lab is a multi-agent system that conducts autonomous research using Claude AI agents. It orchestrates specialized agents that work together to plan, execute, analyze, critique, and report on research questions.

### ⭐ Key Features

- **🔄 Reflexion Loop** - System learns from past research and improves over time
- **📦 Mock Data Fallbacks** - Works without API keys using realistic mock data
- **🎨 Colorful Console Output** - Beautiful, readable output with chalk
- **💾 Persistent Learning** - Stores insights in Redis for future research
- **🔌 Flexible API Integration** - Seamless fallback to mock data when APIs unavailable
- **⚡ Command-Line Interface** - Easy to use: `node src/index.js "Your question"`

### 🧠 NEW: ASI Demonstration Module

**Cutting-edge implementation of recursive self-improvement and autonomous research:**

- **MetaCognitionEngine** - Recursive self-reflection on reasoning (up to 5 levels deep)
- **EpistemicStateTracker** - Bayesian uncertainty quantification and calibration
- **SelfDirectedLearner** - Autonomous curriculum generation and knowledge gap identification
- **AlignmentGuard** - Constitutional AI principles and safety verification
- **RecursiveResearchOrchestrator** - Unified coordination of all ASI components

```bash
# Run the ASI demonstration
node examples/asi-demo.js "How can recursive self-improvement be made safe?"
```

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
│   ├── asi/             # 🧠 ASI Demonstration Module
│   │   ├── MetaCognitionEngine.js    # Recursive self-reflection
│   │   ├── EpistemicStateTracker.js  # Uncertainty quantification
│   │   ├── SelfDirectedLearner.js    # Autonomous curriculum
│   │   ├── AlignmentGuard.js         # Safety verification
│   │   ├── RecursiveResearchOrchestrator.js  # Unified coordination
│   │   └── index.js     # ASI module exports
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
│   ├── test-basic.js    # Core test suite
│   └── test-asi.js      # ASI component tests
├── examples/            # Example scripts
│   ├── asi-demo.js          # 🧠 ASI demonstration
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

## 🧠 ASI Demonstration Module

The ASI (Artificial Superintelligence) module demonstrates cutting-edge concepts in recursive self-improvement and autonomous research. This implementation showcases architectural principles for beneficial superintelligent systems.

### Core Components

#### MetaCognitionEngine
Recursive self-reflection system that can think about its own thinking:
- **Multi-level recursion** - Up to 5 levels of meta-cognitive analysis
- **Cognitive bias detection** - Identifies confirmation bias, anchoring, Dunning-Kruger, etc.
- **Reasoning strategy optimization** - Selects optimal approaches (Chain of Thought, Tree of Thoughts, etc.)
- **Self-model generation** - Creates introspective analysis of its own reasoning patterns

```javascript
import { metaCognitionEngine } from './src/asi/index.js';

const analysis = await metaCognitionEngine.analyzeReasoning(
  "Your reasoning text here",
  { domain: 'AI safety', purpose: 'research' }
);
```

#### EpistemicStateTracker
Uncertainty quantification and knowledge boundary management:
- **Bayesian belief updating** - Updates beliefs based on new evidence
- **Uncertainty decomposition** - Separates aleatoric, epistemic, and model uncertainty
- **Knowledge boundary classification** - Tracks known knowns, known unknowns, unknown unknowns
- **Calibration assessment** - Evaluates how well confidence matches accuracy

```javascript
import { epistemicStateTracker } from './src/asi/index.js';

const analysis = await epistemicStateTracker.analyzeEpistemicState(
  ["Claim 1", "Claim 2"],
  { domain: 'research' }
);
```

#### SelfDirectedLearner
Autonomous curriculum generation and knowledge gap identification:
- **Curriculum generation** - Creates learning paths for any goal
- **Knowledge gap identification** - Finds what's missing to achieve understanding
- **Active learning** - Selects queries that maximize information gain
- **Knowledge synthesis** - Builds transferable knowledge structures

```javascript
import { selfDirectedLearner } from './src/asi/index.js';

const curriculum = await selfDirectedLearner.generateCurriculum(
  "Understand recursive self-improvement in AI",
  { background: 'ML fundamentals' }
);
```

#### AlignmentGuard
Safety verification and value alignment system:
- **Constitutional AI principles** - Enforces beneficence, honesty, corrigibility
- **Deception detection** - Identifies misleading or manipulative patterns
- **Corrigibility verification** - Ensures system remains controllable
- **Impact assessment** - Evaluates potential consequences

```javascript
import { alignmentGuard } from './src/asi/index.js';

const evaluation = await alignmentGuard.evaluateAlignment(
  { action: "research proposal", content: "..." },
  { context: 'AI research' }
);
```

#### RecursiveResearchOrchestrator
Unified coordination of all ASI components:
- **7-phase research pipeline** - Question → Alignment → Acquisition → Reasoning → Meta-Reflection → Synthesis → Self-Improvement
- **Recursive improvement** - System improves its own processes based on meta-analysis
- **Integrated safety** - Alignment checks at every phase

```javascript
import { recursiveResearchOrchestrator } from './src/asi/index.js';

const results = await recursiveResearchOrchestrator.conductRecursiveResearch(
  "How can AI systems be made reliably beneficial?",
  { maxIterations: 3, depthLimit: 5 }
);
```

### Why This Matters for ASI

This architecture demonstrates five key principles for beneficial superintelligent systems:

1. **Recursive Self-Improvement** - The system can analyze and improve its own reasoning processes
2. **Epistemic Humility** - Quantifies uncertainty and acknowledges knowledge boundaries
3. **Autonomous Learning** - Identifies gaps and generates its own curriculum
4. **Robust Alignment** - Safety checks integrated at every step, not bolted on
5. **Value Integration** - Constitutional AI principles guide all reasoning

### Running the ASI Demo

```bash
# Full demonstration
node examples/asi-demo.js

# With custom research question
node examples/asi-demo.js "How can recursive self-improvement be made safe?"

# Run ASI component tests
node test/test-asi.js
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    RecursiveResearchOrchestrator                        │
│                     (Unified Coordination Layer)                        │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
  │    Meta       │    │  Epistemic    │    │    Self       │
  │  Cognition    │◄──►│    State      │◄──►│  Directed     │
  │   Engine      │    │   Tracker     │    │   Learner     │
  └───────┬───────┘    └───────┬───────┘    └───────┬───────┘
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                               ▼
                    ┌───────────────────┐
                    │   Alignment       │
                    │     Guard         │
                    │  (Safety Layer)   │
                    └───────────────────┘
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
