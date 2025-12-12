/**
 * ASI (Artificial Superintelligence) Module Index
 *
 * This module exports the complete ASI demonstration system showcasing
 * cutting-edge concepts in recursive self-improvement and autonomous research.
 *
 * Components:
 * - MetaCognitionEngine: Recursive self-reflection on reasoning processes
 * - EpistemicStateTracker: Uncertainty quantification and belief management
 * - SelfDirectedLearner: Autonomous curriculum and knowledge gap identification
 * - AlignmentGuard: Safety verification and value alignment
 * - RecursiveResearchOrchestrator: Unified orchestration of all components
 *
 * @author Fellowship Candidate
 * @version 1.0.0
 */

// Core ASI Components
export {
  MetaCognitionEngine,
  metaCognitionEngine,
  COGNITIVE_BIASES,
  REASONING_STRATEGIES
} from './MetaCognitionEngine.js';

export {
  EpistemicStateTracker,
  epistemicStateTracker,
  EPISTEMIC_STATUS,
  BOUNDARY_TYPES
} from './EpistemicStateTracker.js';

export {
  SelfDirectedLearner,
  selfDirectedLearner,
  LEARNING_MODALITIES,
  INTEGRATION_PATTERNS
} from './SelfDirectedLearner.js';

export {
  AlignmentGuard,
  alignmentGuard,
  ALIGNMENT_PRINCIPLES,
  SAFETY_CATEGORIES
} from './AlignmentGuard.js';

export {
  RecursiveResearchOrchestrator,
  recursiveResearchOrchestrator,
  RESEARCH_PHASES
} from './RecursiveResearchOrchestrator.js';

/**
 * Quick start function for ASI demonstration
 * @param {string} question - Research question to explore
 * @param {Object} options - Configuration options
 * @returns {Object} Complete research results
 */
export async function runASIDemo(question, options = {}) {
  const { recursiveResearchOrchestrator } = await import('./RecursiveResearchOrchestrator.js');
  return await recursiveResearchOrchestrator.conductRecursiveResearch(question, options);
}

/**
 * Get current state of all ASI components
 * @returns {Object} Comprehensive system state
 */
export async function getASISystemState() {
  const { recursiveResearchOrchestrator } = await import('./RecursiveResearchOrchestrator.js');
  return recursiveResearchOrchestrator.getSystemState();
}
