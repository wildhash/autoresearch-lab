# Examples

This directory contains example scripts showing how to use AutoResearch Lab.

## Available Examples

### 1. Custom Research (`custom-research.js`)

Shows how to conduct a single custom research query with full output.

**Usage:**
```bash
node examples/custom-research.js
```

**What it demonstrates:**
- Initializing the research system
- Conducting a custom research query
- Accessing all phases of research (plan, execution, analysis, critique, report)
- Displaying formatted output

### 2. Multiple Research (`multiple-research.js`)

Shows how to run multiple related research queries in sequence.

**Usage:**
```bash
node examples/multiple-research.js
```

**What it demonstrates:**
- Running multiple research queries
- Building on previous learnings
- Accessing research history from Redis
- Summarizing results across multiple queries

### 3. Reflexion Loop (`reflexion-loop.js`) ⭐ NEW

Demonstrates the Reflexion Loop - how the system learns from past research and improves over time.

**Usage:**
```bash
node examples/reflexion-loop.js
```

**What it demonstrates:**
- How the system stores learnings from research
- How past learnings inform future research
- Self-improvement through critical reflection
- Building a knowledge base automatically
- Memory and context persistence

**Note:** Requires Anthropic API key to run.

### 4. Mock Data Demo (`mock-data-demo.js`) ⭐ NEW

Shows how the mock data system enables development without API credentials.

**Usage:**
```bash
node examples/mock-data-demo.js
```

**What it demonstrates:**
- Available mock data sources (TRM Labs, Finster AI, Senso)
- How mock data is used as fallback
- Executing research with mock data
- Transitioning to real APIs
- Benefits of the mock data system

**Note:** Works without any API keys!

## Prerequisites

Before running examples:

1. Complete the quickstart setup
2. Configure your `.env` file with at least:
   ```bash
   ANTHROPIC_API_KEY=your_key_here
   ```
3. Install dependencies: `npm install`

**Note:** Examples 1, 2, and 3 require an Anthropic API key. Example 4 (Mock Data Demo) works without any credentials.

## Creating Your Own

You can use these examples as templates for your own research scripts:

```javascript
import { ResearchOrchestrator } from '../src/orchestrator.js';
import { anthropicService } from '../src/services/anthropic.js';
import { redisService } from '../src/services/redis.js';

async function myResearch() {
  // Initialize
  anthropicService.initialize();
  await redisService.connect();
  
  // Create orchestrator
  const orchestrator = new ResearchOrchestrator();
  
  // Run research
  const result = await orchestrator.conductResearch(
    'Your research question here',
    { useCache: true, enableReflexion: true }
  );
  
  // Use results
  console.log(result.report);
  
  // Cleanup
  await redisService.disconnect();
}

myResearch();
```

## Tips

- Use `useCache: true` to speed up repeated queries
- Enable `enableReflexion: true` for better quality through self-critique
- Store results in Redis to build a knowledge base over time
- Chain related queries to build comprehensive understanding of a topic
- Use mock data for development and testing without API costs
