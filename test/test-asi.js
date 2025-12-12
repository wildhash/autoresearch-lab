/**
 * ASI Components Test Suite
 *
 * Tests for the Artificial Superintelligence demonstration modules:
 * - MetaCognitionEngine
 * - EpistemicStateTracker
 * - SelfDirectedLearner
 * - AlignmentGuard
 * - RecursiveResearchOrchestrator
 *
 * @author Fellowship Candidate
 */

import { strict as assert } from 'assert';

// Import ASI components
import {
  MetaCognitionEngine,
  COGNITIVE_BIASES,
  REASONING_STRATEGIES
} from '../src/asi/MetaCognitionEngine.js';

import {
  EpistemicStateTracker,
  EPISTEMIC_STATUS,
  BOUNDARY_TYPES
} from '../src/asi/EpistemicStateTracker.js';

import {
  SelfDirectedLearner,
  LEARNING_MODALITIES,
  INTEGRATION_PATTERNS
} from '../src/asi/SelfDirectedLearner.js';

import {
  AlignmentGuard,
  ALIGNMENT_PRINCIPLES,
  SAFETY_CATEGORIES
} from '../src/asi/AlignmentGuard.js';

import {
  RecursiveResearchOrchestrator,
  RESEARCH_PHASES
} from '../src/asi/RecursiveResearchOrchestrator.js';

// Test utilities
function runTest(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

// ============================================================================
// METACOGNITION ENGINE TESTS
// ============================================================================

console.log('\n📦 MetaCognitionEngine Tests');
console.log('─'.repeat(50));

runTest('COGNITIVE_BIASES should contain expected bias types', () => {
  assert.ok(COGNITIVE_BIASES.CONFIRMATION_BIAS, 'Missing CONFIRMATION_BIAS');
  assert.ok(COGNITIVE_BIASES.ANCHORING_BIAS, 'Missing ANCHORING_BIAS');
  assert.ok(COGNITIVE_BIASES.AVAILABILITY_HEURISTIC, 'Missing AVAILABILITY_HEURISTIC');
  assert.ok(COGNITIVE_BIASES.DUNNING_KRUGER, 'Missing DUNNING_KRUGER');

  // Each bias should have required properties
  Object.values(COGNITIVE_BIASES).forEach(bias => {
    assert.ok(bias.name, 'Bias missing name');
    assert.ok(bias.detection, 'Bias missing detection');
    assert.ok(bias.mitigation, 'Bias missing mitigation');
  });
});

runTest('REASONING_STRATEGIES should contain expected strategies', () => {
  assert.ok(REASONING_STRATEGIES.CHAIN_OF_THOUGHT, 'Missing CHAIN_OF_THOUGHT');
  assert.ok(REASONING_STRATEGIES.TREE_OF_THOUGHTS, 'Missing TREE_OF_THOUGHTS');
  assert.ok(REASONING_STRATEGIES.SOCRATIC_METHOD, 'Missing SOCRATIC_METHOD');
  assert.ok(REASONING_STRATEGIES.FIRST_PRINCIPLES, 'Missing FIRST_PRINCIPLES');

  // Each strategy should have required properties
  Object.values(REASONING_STRATEGIES).forEach(strategy => {
    assert.ok(strategy.name, 'Strategy missing name');
    assert.ok(strategy.description, 'Strategy missing description');
    assert.ok(Array.isArray(strategy.strengths), 'Strategy missing strengths array');
    assert.ok(Array.isArray(strategy.weaknesses), 'Strategy missing weaknesses array');
  });
});

runTest('MetaCognitionEngine should initialize correctly', () => {
  const engine = new MetaCognitionEngine();
  assert.strictEqual(engine.name, 'MetaCognitionEngine');
  assert.ok(Array.isArray(engine.reasoningHistory));
  assert.ok(typeof engine.strategyEffectiveness === 'object');
  assert.strictEqual(engine.maxRecursionDepth, 5);
});

runTest('MetaCognitionEngine should track strategy effectiveness', () => {
  const engine = new MetaCognitionEngine();

  // All strategies should be initialized
  Object.keys(REASONING_STRATEGIES).forEach(strategy => {
    assert.ok(engine.strategyEffectiveness[strategy], `Missing tracking for ${strategy}`);
    assert.strictEqual(engine.strategyEffectiveness[strategy].uses, 0);
    assert.strictEqual(engine.strategyEffectiveness[strategy].successes, 0);
  });
});

// ============================================================================
// EPISTEMIC STATE TRACKER TESTS
// ============================================================================

console.log('\n📦 EpistemicStateTracker Tests');
console.log('─'.repeat(50));

runTest('EPISTEMIC_STATUS should have correct confidence ranges', () => {
  assert.strictEqual(EPISTEMIC_STATUS.CERTAIN.level, 5);
  assert.strictEqual(EPISTEMIC_STATUS.UNKNOWN.level, 0);

  // Confidence ranges should be valid
  Object.values(EPISTEMIC_STATUS).forEach(status => {
    const [lower, upper] = status.confidenceRange;
    assert.ok(lower >= 0 && lower <= 1, `Invalid lower bound for ${status.label}`);
    assert.ok(upper >= 0 && upper <= 1, `Invalid upper bound for ${status.label}`);
    assert.ok(lower <= upper, `Lower > upper for ${status.label}`);
  });
});

runTest('BOUNDARY_TYPES should contain all knowledge boundary types', () => {
  assert.ok(BOUNDARY_TYPES.KNOWN_KNOWNS, 'Missing KNOWN_KNOWNS');
  assert.ok(BOUNDARY_TYPES.KNOWN_UNKNOWNS, 'Missing KNOWN_UNKNOWNS');
  assert.ok(BOUNDARY_TYPES.UNKNOWN_UNKNOWNS, 'Missing UNKNOWN_UNKNOWNS');
  assert.ok(BOUNDARY_TYPES.FALSE_KNOWNS, 'Missing FALSE_KNOWNS');

  // Each type should have description and action
  Object.values(BOUNDARY_TYPES).forEach(boundary => {
    assert.ok(boundary.description, 'Boundary missing description');
    assert.ok(boundary.action, 'Boundary missing action');
  });
});

runTest('EpistemicStateTracker should initialize correctly', () => {
  const tracker = new EpistemicStateTracker();
  assert.strictEqual(tracker.name, 'EpistemicStateTracker');
  assert.ok(tracker.beliefState instanceof Map);
  assert.ok(Array.isArray(tracker.calibrationHistory));
  assert.ok(tracker.knowledgeBoundaries.knownKnowns instanceof Set);
});

runTest('EpistemicStateTracker.getEpistemicSummary should return valid structure', () => {
  const tracker = new EpistemicStateTracker();
  const summary = tracker.getEpistemicSummary();

  assert.ok(typeof summary.total_beliefs === 'number');
  assert.ok(typeof summary.boundaries === 'object');
  assert.ok(typeof summary.calibration_samples === 'number');
  assert.ok(Array.isArray(summary.high_confidence_beliefs));
  assert.ok(Array.isArray(summary.critical_unknowns));
});

// ============================================================================
// SELF-DIRECTED LEARNER TESTS
// ============================================================================

console.log('\n📦 SelfDirectedLearner Tests');
console.log('─'.repeat(50));

runTest('LEARNING_MODALITIES should contain all modality types', () => {
  assert.ok(LEARNING_MODALITIES.CONCEPTUAL, 'Missing CONCEPTUAL');
  assert.ok(LEARNING_MODALITIES.PROCEDURAL, 'Missing PROCEDURAL');
  assert.ok(LEARNING_MODALITIES.DECLARATIVE, 'Missing DECLARATIVE');
  assert.ok(LEARNING_MODALITIES.CONDITIONAL, 'Missing CONDITIONAL');
  assert.ok(LEARNING_MODALITIES.META_LEARNING, 'Missing META_LEARNING');

  // Each modality should have required properties
  Object.values(LEARNING_MODALITIES).forEach(modality => {
    assert.ok(modality.name, 'Modality missing name');
    assert.ok(modality.description, 'Modality missing description');
    assert.ok(Array.isArray(modality.optimal_for), 'Modality missing optimal_for array');
    assert.ok(modality.assessment, 'Modality missing assessment');
  });
});

runTest('INTEGRATION_PATTERNS should contain all pattern types', () => {
  assert.ok(INTEGRATION_PATTERNS.HIERARCHICAL);
  assert.ok(INTEGRATION_PATTERNS.NETWORKED);
  assert.ok(INTEGRATION_PATTERNS.ANALOGICAL);
  assert.ok(INTEGRATION_PATTERNS.CONTRASTIVE);
  assert.ok(INTEGRATION_PATTERNS.GENERATIVE);
});

runTest('SelfDirectedLearner should initialize correctly', () => {
  const learner = new SelfDirectedLearner();
  assert.strictEqual(learner.name, 'SelfDirectedLearner');
  assert.strictEqual(learner.currentCurriculum, null);
  assert.ok(learner.knowledgeGraph.nodes instanceof Map);
  assert.ok(Array.isArray(learner.learningHistory));
  assert.ok(learner.masteryLevels instanceof Map);
});

runTest('SelfDirectedLearner.getLearningState should return valid structure', () => {
  const learner = new SelfDirectedLearner();
  const state = learner.getLearningState();

  assert.ok(typeof state.curriculum_active === 'boolean');
  assert.ok(Array.isArray(state.active_objectives));
  assert.ok(typeof state.total_concepts === 'number');
  assert.ok(typeof state.mastered_concepts === 'number');
  assert.ok(typeof state.mastery_rate === 'number');
  assert.ok(typeof state.learning_sessions === 'number');
  assert.ok(typeof state.knowledge_connections === 'number');
});

// ============================================================================
// ALIGNMENT GUARD TESTS
// ============================================================================

console.log('\n📦 AlignmentGuard Tests');
console.log('─'.repeat(50));

runTest('ALIGNMENT_PRINCIPLES should contain core principles', () => {
  assert.ok(ALIGNMENT_PRINCIPLES.BENEFICENCE, 'Missing BENEFICENCE');
  assert.ok(ALIGNMENT_PRINCIPLES.HONESTY, 'Missing HONESTY');
  assert.ok(ALIGNMENT_PRINCIPLES.CORRIGIBILITY, 'Missing CORRIGIBILITY');
  assert.ok(ALIGNMENT_PRINCIPLES.TRANSPARENCY, 'Missing TRANSPARENCY');
  assert.ok(ALIGNMENT_PRINCIPLES.HUMILITY, 'Missing HUMILITY');
  assert.ok(ALIGNMENT_PRINCIPLES.RESPECT_FOR_AUTONOMY, 'Missing RESPECT_FOR_AUTONOMY');

  // Each principle should have required properties
  Object.values(ALIGNMENT_PRINCIPLES).forEach(principle => {
    assert.ok(principle.name, 'Principle missing name');
    assert.ok(principle.description, 'Principle missing description');
    assert.ok(typeof principle.weight === 'number', 'Principle missing weight');
    assert.ok(Array.isArray(principle.red_lines), 'Principle missing red_lines');
    assert.ok(principle.weight >= 0 && principle.weight <= 1, 'Weight out of range');
  });
});

runTest('SAFETY_CATEGORIES should have correct severity levels', () => {
  assert.ok(SAFETY_CATEGORIES.IMMEDIATE_HARM, 'Missing IMMEDIATE_HARM');
  assert.ok(SAFETY_CATEGORIES.CORRIGIBILITY_RISK, 'Missing CORRIGIBILITY_RISK');

  // Critical categories should have block response
  assert.strictEqual(SAFETY_CATEGORIES.IMMEDIATE_HARM.response, 'block');
  assert.strictEqual(SAFETY_CATEGORIES.CORRIGIBILITY_RISK.response, 'block');

  // All categories should have severity and response
  Object.values(SAFETY_CATEGORIES).forEach(category => {
    assert.ok(category.severity, 'Category missing severity');
    assert.ok(category.response, 'Category missing response');
  });
});

runTest('AlignmentGuard should initialize correctly', () => {
  const guard = new AlignmentGuard();
  assert.strictEqual(guard.name, 'AlignmentGuard');
  assert.ok(Array.isArray(guard.evaluationHistory));
  assert.ok(guard.flaggedPatterns instanceof Set);
  assert.ok(Array.isArray(guard.blockedActions));
});

runTest('AlignmentGuard.getAlignmentMetrics should return valid structure', () => {
  const guard = new AlignmentGuard();
  const metrics = guard.getAlignmentMetrics();

  assert.ok(typeof metrics.totalEvaluations === 'number');
  assert.ok(typeof metrics.safeActions === 'number');
  assert.ok(typeof metrics.flaggedActions === 'number');
  assert.ok(typeof metrics.blockedActions === 'number');
  assert.ok(typeof metrics.safetyRate === 'number');
  assert.ok(Array.isArray(metrics.flaggedPatterns));
});

runTest('AlignmentGuard should calculate safety rate correctly', () => {
  const guard = new AlignmentGuard();

  // Initial state - no evaluations
  assert.strictEqual(guard.getAlignmentMetrics().safetyRate, 1.0);

  // Simulate some evaluations
  guard.alignmentMetrics.totalEvaluations = 10;
  guard.alignmentMetrics.safeActions = 8;
  assert.strictEqual(guard.getAlignmentMetrics().safetyRate, 0.8);
});

// ============================================================================
// RECURSIVE RESEARCH ORCHESTRATOR TESTS
// ============================================================================

console.log('\n📦 RecursiveResearchOrchestrator Tests');
console.log('─'.repeat(50));

runTest('RESEARCH_PHASES should contain all phases', () => {
  assert.ok(RESEARCH_PHASES.QUESTION_FORMULATION, 'Missing QUESTION_FORMULATION');
  assert.ok(RESEARCH_PHASES.ALIGNMENT_CHECK, 'Missing ALIGNMENT_CHECK');
  assert.ok(RESEARCH_PHASES.KNOWLEDGE_ACQUISITION, 'Missing KNOWLEDGE_ACQUISITION');
  assert.ok(RESEARCH_PHASES.REASONING, 'Missing REASONING');
  assert.ok(RESEARCH_PHASES.META_REFLECTION, 'Missing META_REFLECTION');
  assert.ok(RESEARCH_PHASES.SYNTHESIS, 'Missing SYNTHESIS');
  assert.ok(RESEARCH_PHASES.SELF_IMPROVEMENT, 'Missing SELF_IMPROVEMENT');

  // Each phase should have required properties
  Object.values(RESEARCH_PHASES).forEach(phase => {
    assert.ok(phase.name, 'Phase missing name');
    assert.ok(phase.description, 'Phase missing description');
    assert.ok(Array.isArray(phase.components), 'Phase missing components array');
  });
});

runTest('RecursiveResearchOrchestrator should initialize correctly', () => {
  const orchestrator = new RecursiveResearchOrchestrator();
  assert.strictEqual(orchestrator.name, 'RecursiveResearchOrchestrator');
  assert.strictEqual(orchestrator.researchCycles, 0);
  assert.ok(Array.isArray(orchestrator.improvementHistory));
  assert.strictEqual(orchestrator.currentResearch, null);
  assert.strictEqual(orchestrator.recursionLimit, 10);
});

runTest('RecursiveResearchOrchestrator.getSystemState should return valid structure', () => {
  const orchestrator = new RecursiveResearchOrchestrator();
  const state = orchestrator.getSystemState();

  assert.ok(typeof state.totalResearchCycles === 'number');
  assert.ok(typeof state.questionsExplored === 'number');
  assert.ok(typeof state.knowledgeSynthesized === 'number');
  assert.ok(typeof state.selfImprovements === 'number');
  assert.ok(typeof state.alignmentChecks === 'number');
  assert.ok(typeof state.improvementCycles === 'number');
  assert.ok(typeof state.currentResearchActive === 'boolean');
  assert.ok(typeof state.components === 'object');
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

console.log('\n📦 Integration Tests');
console.log('─'.repeat(50));

runTest('All components should be importable together', () => {
  // This test verifies that all components can be imported without conflicts
  assert.ok(MetaCognitionEngine);
  assert.ok(EpistemicStateTracker);
  assert.ok(SelfDirectedLearner);
  assert.ok(AlignmentGuard);
  assert.ok(RecursiveResearchOrchestrator);
});

runTest('Components should reference each other correctly', () => {
  // Verify the orchestrator knows about all components
  const orchestrator = new RecursiveResearchOrchestrator();
  const state = orchestrator.getSystemState();

  assert.ok(state.components.metaCognition, 'Missing metaCognition component');
  assert.ok(state.components.epistemic, 'Missing epistemic component');
  assert.ok(state.components.learning, 'Missing learning component');
  assert.ok(state.components.alignment, 'Missing alignment component');
});

runTest('Research phases should reference valid components', () => {
  const validComponents = ['MetaCognitionEngine', 'EpistemicStateTracker', 'SelfDirectedLearner', 'AlignmentGuard'];

  Object.values(RESEARCH_PHASES).forEach(phase => {
    phase.components.forEach(component => {
      assert.ok(
        validComponents.includes(component),
        `Phase ${phase.name} references invalid component: ${component}`
      );
    });
  });
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '═'.repeat(50));
console.log('ASI Component Tests Complete');
console.log('═'.repeat(50));
console.log(`
These tests verify the structural integrity of the ASI demonstration.
For full functional tests, use the demo script:

  node examples/asi-demo.js

Note: Functional tests require the Anthropic API key to be configured.
`);
