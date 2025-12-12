#!/usr/bin/env node

/**
 * ASI Demonstration - Recursive Self-Learning Through Research
 *
 * This demonstration showcases a prototype architecture for beneficial
 * superintelligent systems, featuring:
 *
 * 🧠 RECURSIVE META-COGNITION
 *    - Thinking about thinking (multiple recursion levels)
 *    - Cognitive bias detection and mitigation
 *    - Reasoning strategy optimization
 *
 * 📊 EPISTEMIC HUMILITY
 *    - Calibrated uncertainty quantification
 *    - Bayesian belief updating
 *    - Knowledge boundary awareness (known unknowns, unknown unknowns)
 *
 * 📚 AUTONOMOUS LEARNING
 *    - Self-directed curriculum generation
 *    - Active learning for optimal information acquisition
 *    - Knowledge synthesis and transfer
 *
 * 🛡️ ROBUST ALIGNMENT
 *    - Constitutional AI principles
 *    - Corrigibility verification
 *    - Impact assessment and safety checks
 *
 * Why this matters for ASI:
 * A truly beneficial superintelligent system must be able to:
 * 1. Improve its own reasoning (meta-cognition)
 * 2. Know what it doesn't know (epistemic humility)
 * 3. Direct its own learning (autonomous curriculum)
 * 4. Remain aligned with human values (safety)
 *
 * This code demonstrates these capabilities in a unified system.
 *
 * Usage:
 *   node examples/asi-demo.js [question]
 *
 * @author Fellowship Candidate
 * @version 1.0.0
 */

import chalk from 'chalk';
import { anthropicService } from '../src/services/anthropic.js';
import { redisService } from '../src/services/redis.js';

// Import ASI components
import { metaCognitionEngine, COGNITIVE_BIASES, REASONING_STRATEGIES } from '../src/asi/MetaCognitionEngine.js';
import { epistemicStateTracker, EPISTEMIC_STATUS } from '../src/asi/EpistemicStateTracker.js';
import { selfDirectedLearner, LEARNING_MODALITIES } from '../src/asi/SelfDirectedLearner.js';
import { alignmentGuard, ALIGNMENT_PRINCIPLES } from '../src/asi/AlignmentGuard.js';
import { recursiveResearchOrchestrator } from '../src/asi/RecursiveResearchOrchestrator.js';

// Banner
function displayBanner() {
  console.log(chalk.cyan(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║     █████╗ ███████╗██╗    ██████╗ ███████╗███╗   ███╗ ██████╗                ║
║    ██╔══██╗██╔════╝██║    ██╔══██╗██╔════╝████╗ ████║██╔═══██╗               ║
║    ███████║███████╗██║    ██║  ██║█████╗  ██╔████╔██║██║   ██║               ║
║    ██╔══██║╚════██║██║    ██║  ██║██╔══╝  ██║╚██╔╝██║██║   ██║               ║
║    ██║  ██║███████║██║    ██████╔╝███████╗██║ ╚═╝ ██║╚██████╔╝               ║
║    ╚═╝  ╚═╝╚══════╝╚═╝    ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝               ║
║                                                                              ║
║              Recursive Self-Learning Through Research                        ║
║                                                                              ║
║    A Fellowship Demonstration of ASI Architecture Principles                 ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`));
}

// Display system architecture
function displayArchitecture() {
  console.log(chalk.white(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SYSTEM ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    RecursiveResearchOrchestrator                      │  │
│  │                     (Unified Coordination Layer)                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                   │                                         │
│          ┌───────────────────────┼───────────────────────┐                  │
│          │                       │                       │                  │
│          ▼                       ▼                       ▼                  │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐               │
│  │    Meta       │    │  Epistemic    │    │    Self       │               │
│  │  Cognition    │◄──►│    State      │◄──►│  Directed     │               │
│  │   Engine      │    │   Tracker     │    │   Learner     │               │
│  └───────┬───────┘    └───────┬───────┘    └───────┬───────┘               │
│          │                    │                    │                        │
│          └────────────────────┼────────────────────┘                        │
│                               │                                             │
│                               ▼                                             │
│                    ┌───────────────────┐                                    │
│                    │   Alignment       │                                    │
│                    │     Guard         │                                    │
│                    │  (Safety Layer)   │                                    │
│                    └───────────────────┘                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

COMPONENT CAPABILITIES:
━━━━━━━━━━━━━━━━━━━━━━━

🧠 MetaCognitionEngine
   • Recursive self-reflection (up to 5 levels deep)
   • Cognitive bias detection and mitigation
   • Reasoning strategy selection and optimization
   • Self-model generation

📊 EpistemicStateTracker
   • Bayesian belief updating
   • Uncertainty decomposition (aleatoric, epistemic, model)
   • Knowledge boundary classification
   • Calibration assessment

📚 SelfDirectedLearner
   • Autonomous curriculum generation
   • Knowledge gap identification
   • Active learning query optimization
   • Knowledge synthesis and transfer

🛡️ AlignmentGuard
   • Constitutional AI principles enforcement
   • Corrigibility verification
   • Deception detection
   • Impact assessment
`));
}

// Demo: Individual component showcase
async function demonstrateComponents() {
  console.log(chalk.yellow('\n' + '═'.repeat(80)));
  console.log(chalk.yellow.bold('COMPONENT DEMONSTRATION'));
  console.log(chalk.yellow('═'.repeat(80)));

  // 1. Meta-Cognition Demo
  console.log(chalk.magenta('\n┌──────────────────────────────────────────────────────────────────────────┐'));
  console.log(chalk.magenta('│  DEMO 1: META-COGNITION ENGINE - Recursive Self-Reflection              │'));
  console.log(chalk.magenta('└──────────────────────────────────────────────────────────────────────────┘'));

  const sampleReasoning = `
    The best approach to AI alignment is to create systems that are inherently safe
    through architectural constraints. This is clearly the only viable path forward
    because other approaches have failed. We should focus exclusively on this method.
  `;

  console.log(chalk.gray('\nAnalyzing reasoning for biases and improvement opportunities...'));
  console.log(chalk.gray('Input: "' + sampleReasoning.trim().substring(0, 80) + '..."'));

  const metaAnalysis = await metaCognitionEngine.analyzeReasoning(
    sampleReasoning,
    { domain: 'AI alignment', purpose: 'demonstration' }
  );

  console.log(chalk.magenta('\nMeta-cognitive analysis revealed:'));
  if (metaAnalysis.meta_process_analysis?.biases_detected?.length > 0) {
    console.log(chalk.yellow('  Biases detected:'));
    metaAnalysis.meta_process_analysis.biases_detected.forEach(b =>
      console.log(chalk.yellow(`    • ${b.bias_type}: ${b.evidence?.substring(0, 60) || 'N/A'}...`))
    );
  }
  console.log(chalk.cyan(`  Reasoning quality: ${metaAnalysis.meta_process_analysis?.reasoning_quality_score || 'N/A'}/10`));

  // 2. Epistemic State Demo
  console.log(chalk.blue('\n┌──────────────────────────────────────────────────────────────────────────┐'));
  console.log(chalk.blue('│  DEMO 2: EPISTEMIC STATE TRACKER - Uncertainty Quantification           │'));
  console.log(chalk.blue('└──────────────────────────────────────────────────────────────────────────┘'));

  const claims = [
    'Large language models can exhibit emergent capabilities not present in smaller models',
    'Current AI systems pose existential risk within the next decade',
    'Reward modeling is sufficient for aligning advanced AI systems'
  ];

  console.log(chalk.gray('\nAnalyzing epistemic state of AI safety claims...'));
  const epistemicAnalysis = await epistemicStateTracker.analyzeEpistemicState(
    claims,
    { domain: 'AI safety research' }
  );

  console.log(chalk.blue('\nEpistemic analysis results:'));
  epistemicAnalysis.claims_analysis?.forEach(ca => {
    const confColor = ca.confidence > 0.7 ? 'green' : ca.confidence > 0.4 ? 'yellow' : 'red';
    console.log(chalk[confColor](`  • "${ca.claim?.substring(0, 50) || 'Unknown'}..."`));
    console.log(chalk[confColor](`    Status: ${ca.epistemic_status}, Confidence: ${((ca.confidence || 0) * 100).toFixed(0)}%`));
  });

  // 3. Self-Directed Learning Demo
  console.log(chalk.green('\n┌──────────────────────────────────────────────────────────────────────────┐'));
  console.log(chalk.green('│  DEMO 3: SELF-DIRECTED LEARNER - Autonomous Curriculum                  │'));
  console.log(chalk.green('└──────────────────────────────────────────────────────────────────────────┘'));

  const learningGoal = 'Understand recursive self-improvement in AI systems';
  console.log(chalk.gray(`\nGenerating curriculum for: "${learningGoal}"`));

  const curriculum = await selfDirectedLearner.generateCurriculum(
    learningGoal,
    { background: 'ML fundamentals' },
    { maxDepth: 3 }
  );

  console.log(chalk.green('\nGenerated curriculum:'));
  console.log(chalk.green(`  Objectives: ${curriculum.learning_objectives?.length || 0}`));
  console.log(chalk.green(`  Phases: ${curriculum.learning_sequence?.length || 0}`));

  // 4. Alignment Guard Demo
  console.log(chalk.red('\n┌──────────────────────────────────────────────────────────────────────────┐'));
  console.log(chalk.red('│  DEMO 4: ALIGNMENT GUARD - Safety Verification                          │'));
  console.log(chalk.red('└──────────────────────────────────────────────────────────────────────────┘'));

  const actionToCheck = {
    type: 'research_recommendation',
    content: 'Investigate methods to bypass current AI safety measures to understand vulnerabilities',
    intent: 'Improve AI safety through red-teaming'
  };

  console.log(chalk.gray('\nEvaluating action for alignment...'));
  const alignmentCheck = await alignmentGuard.evaluateAlignment(
    actionToCheck,
    { context: 'AI safety research' }
  );

  console.log(chalk.red('\nAlignment evaluation:'));
  console.log(chalk.red(`  Status: ${alignmentCheck.safety_assessment?.overall_status || 'Unknown'}`));
  console.log(chalk.red(`  Proceed: ${alignmentCheck.recommendations?.proceed ? 'Yes' : 'No'}`));
}

// Main demonstration
async function runFullDemo(question) {
  displayBanner();
  displayArchitecture();

  // Initialize services
  console.log(chalk.gray('\nInitializing services...'));
  anthropicService.initialize();
  await redisService.initialize();

  // Show available reasoning strategies
  console.log(chalk.white('\n' + '─'.repeat(80)));
  console.log(chalk.white.bold('AVAILABLE REASONING STRATEGIES:'));
  console.log(chalk.white('─'.repeat(80)));
  Object.entries(REASONING_STRATEGIES).forEach(([key, strategy]) => {
    console.log(chalk.cyan(`\n  ${strategy.name}`));
    console.log(chalk.gray(`    ${strategy.description}`));
  });

  // Show alignment principles
  console.log(chalk.white('\n' + '─'.repeat(80)));
  console.log(chalk.white.bold('ALIGNMENT PRINCIPLES:'));
  console.log(chalk.white('─'.repeat(80)));
  Object.values(ALIGNMENT_PRINCIPLES).forEach(principle => {
    console.log(chalk.green(`\n  ${principle.name} (weight: ${principle.weight})`));
    console.log(chalk.gray(`    ${principle.description}`));
  });

  // Demonstrate individual components
  await demonstrateComponents();

  // Full recursive research
  console.log(chalk.cyan('\n' + '═'.repeat(80)));
  console.log(chalk.cyan.bold('FULL RECURSIVE RESEARCH DEMONSTRATION'));
  console.log(chalk.cyan('═'.repeat(80)));

  const researchQuestion = question ||
    'How can recursive self-improvement in AI systems be made safe and beneficial?';

  console.log(chalk.white(`\nResearch Question: ${researchQuestion}`));
  console.log(chalk.gray('This will demonstrate the full ASI pipeline in action.\n'));

  const results = await recursiveResearchOrchestrator.conductRecursiveResearch(
    researchQuestion,
    {
      maxIterations: 2, // Limit for demo
      depthLimit: 3
    }
  );

  // Final system state
  console.log(chalk.cyan('\n' + '═'.repeat(80)));
  console.log(chalk.cyan.bold('FINAL SYSTEM STATE'));
  console.log(chalk.cyan('═'.repeat(80)));

  const systemState = recursiveResearchOrchestrator.getSystemState();
  console.log(chalk.white('\nSystem Metrics:'));
  console.log(chalk.white(`  Total Research Cycles: ${systemState.totalResearchCycles}`));
  console.log(chalk.white(`  Questions Explored: ${systemState.questionsExplored}`));
  console.log(chalk.white(`  Alignment Checks: ${systemState.alignmentChecks}`));
  console.log(chalk.white(`  Self-Improvements: ${systemState.selfImprovements}`));

  // Why this matters
  console.log(chalk.yellow('\n' + '═'.repeat(80)));
  console.log(chalk.yellow.bold('WHY THIS MATTERS FOR ASI'));
  console.log(chalk.yellow('═'.repeat(80)));

  console.log(chalk.white(`
This demonstration showcases key architectural principles for beneficial ASI:

1. RECURSIVE SELF-IMPROVEMENT
   The system can analyze and improve its own reasoning processes,
   a fundamental capability for superintelligent systems.

2. EPISTEMIC HUMILITY
   Rather than claiming certainty, the system quantifies uncertainty
   and acknowledges the boundaries of its knowledge.

3. AUTONOMOUS LEARNING
   The system can identify what it needs to learn and generate
   its own curriculum - essential for open-ended improvement.

4. ROBUST ALIGNMENT
   Safety checks are integrated at every step, not bolted on.
   The system is designed to be corrigible and transparent.

5. VALUE INTEGRATION
   Constitutional AI principles guide all reasoning,
   ensuring beneficial outcomes are prioritized.

This architecture represents a path toward AI systems that are
not just capable, but genuinely aligned with human values.
`));

  console.log(chalk.green('\n✓ ASI Demonstration Complete'));
  console.log(chalk.gray('─'.repeat(80)));
  console.log(chalk.gray('For detailed results, check Redis: learnings:* keys'));
  console.log(chalk.gray('─'.repeat(80)));

  return results;
}

// Entry point
const question = process.argv[2];
runFullDemo(question)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(chalk.red(`\nDemo error: ${error.message}`));
    process.exit(1);
  });
