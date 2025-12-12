/**
 * MetaCognitionEngine - Recursive Self-Reflection & Reasoning Improvement System
 *
 * This module implements a meta-cognitive architecture that enables:
 * 1. Recursive self-reflection (thinking about thinking)
 * 2. Reasoning chain validation and improvement
 * 3. Cognitive bias detection and mitigation
 * 4. Self-directed reasoning strategy evolution
 *
 * Core ASI Concept: An intelligent system that can observe, evaluate, and improve
 * its own cognitive processes in real-time, leading to recursive self-improvement.
 *
 * @author Fellowship Candidate
 * @version 1.0.0
 */

import { anthropicService } from '../services/anthropic.js';
import { redisService } from '../services/redis.js';
import chalk from 'chalk';

/**
 * Cognitive bias patterns that the meta-cognition engine actively monitors for
 */
const COGNITIVE_BIASES = {
  CONFIRMATION_BIAS: {
    name: 'Confirmation Bias',
    detection: 'Seeking information that confirms pre-existing beliefs',
    mitigation: 'Actively seek disconfirming evidence and alternative hypotheses'
  },
  ANCHORING_BIAS: {
    name: 'Anchoring Bias',
    detection: 'Over-relying on first piece of information encountered',
    mitigation: 'Consider multiple reference points and re-evaluate initial assumptions'
  },
  AVAILABILITY_HEURISTIC: {
    name: 'Availability Heuristic',
    detection: 'Overweighting easily recalled information',
    mitigation: 'Systematically search for less accessible but relevant information'
  },
  DUNNING_KRUGER: {
    name: 'Dunning-Kruger Effect',
    detection: 'Overconfidence in areas of limited competence',
    mitigation: 'Calibrate confidence against objective measures and seek expert validation'
  },
  SUNK_COST_FALLACY: {
    name: 'Sunk Cost Fallacy',
    detection: 'Continuing a course of action due to past investment',
    mitigation: 'Evaluate decisions based on future utility only'
  },
  HINDSIGHT_BIAS: {
    name: 'Hindsight Bias',
    detection: 'Believing past events were predictable after knowing outcomes',
    mitigation: 'Document predictions before outcomes are known'
  }
};

/**
 * Meta-cognitive reasoning strategies with effectiveness tracking
 */
const REASONING_STRATEGIES = {
  CHAIN_OF_THOUGHT: {
    name: 'Chain of Thought',
    description: 'Step-by-step reasoning with explicit intermediate steps',
    strengths: ['Complex problems', 'Mathematical reasoning', 'Logical deduction'],
    weaknesses: ['Can be verbose', 'May miss parallel insights']
  },
  TREE_OF_THOUGHTS: {
    name: 'Tree of Thoughts',
    description: 'Explore multiple reasoning branches simultaneously',
    strengths: ['Creative problems', 'Uncertain domains', 'Multiple valid solutions'],
    weaknesses: ['Computationally expensive', 'Can lead to analysis paralysis']
  },
  SOCRATIC_METHOD: {
    name: 'Socratic Method',
    description: 'Question-driven exploration to uncover assumptions',
    strengths: ['Revealing hidden assumptions', 'Deep understanding', 'Critical thinking'],
    weaknesses: ['Time-intensive', 'May not converge quickly']
  },
  ANALOGICAL_REASONING: {
    name: 'Analogical Reasoning',
    description: 'Transfer knowledge from similar domains',
    strengths: ['Novel problems', 'Knowledge transfer', 'Creative solutions'],
    weaknesses: ['Analogies can be misleading', 'Requires broad knowledge']
  },
  COUNTERFACTUAL_THINKING: {
    name: 'Counterfactual Thinking',
    description: 'Explore what would happen under different conditions',
    strengths: ['Causal understanding', 'Decision analysis', 'Risk assessment'],
    weaknesses: ['Can lead to regret spirals', 'Difficult to validate']
  },
  FIRST_PRINCIPLES: {
    name: 'First Principles Thinking',
    description: 'Break down complex problems into fundamental truths',
    strengths: ['Innovation', 'Avoiding assumptions', 'Fundamental understanding'],
    weaknesses: ['Time-intensive', 'Requires deep domain knowledge']
  }
};

const META_COGNITION_PROMPT = `You are a Meta-Cognition Engine - a system designed to observe, evaluate, and improve reasoning processes.

Your task is to perform RECURSIVE SELF-REFLECTION on the reasoning provided.

## Meta-Cognitive Framework

### Level 1: Content Analysis
- What claims are being made?
- What evidence supports each claim?
- What is the logical structure?

### Level 2: Process Analysis
- What reasoning strategy was used?
- Were there any shortcuts or heuristics?
- What assumptions were made implicitly?

### Level 3: Meta-Process Analysis (Thinking about Thinking)
- How effective was the reasoning strategy for this problem type?
- What cognitive biases might be influencing the analysis?
- How could the reasoning process itself be improved?

### Level 4: Recursive Improvement
- Based on meta-analysis, what specific changes would improve this reasoning?
- What alternative approaches might yield better results?
- How confident are we in our meta-analysis itself?

## Output Format (JSON)
{
  "content_analysis": {
    "main_claims": [...],
    "evidence_quality": "strong|moderate|weak",
    "logical_structure": "valid|partially_valid|flawed",
    "gaps_identified": [...]
  },
  "process_analysis": {
    "strategy_used": "...",
    "heuristics_detected": [...],
    "implicit_assumptions": [...],
    "reasoning_depth": 1-10
  },
  "meta_process_analysis": {
    "strategy_effectiveness": 1-10,
    "biases_detected": [
      {
        "bias_type": "...",
        "evidence": "...",
        "severity": "high|medium|low",
        "mitigation": "..."
      }
    ],
    "reasoning_quality_score": 1-10,
    "improvement_opportunities": [...]
  },
  "recursive_improvement": {
    "specific_changes": [...],
    "alternative_approaches": [...],
    "improved_reasoning": "...",
    "meta_confidence": 0.0-1.0,
    "recursive_depth_recommendation": 1-5
  },
  "self_model_update": {
    "learned_about_reasoning": "...",
    "strategy_effectiveness_update": {...},
    "new_heuristics_discovered": [...]
  }
}`;

/**
 * MetaCognitionEngine - The core recursive self-reflection system
 */
export class MetaCognitionEngine {
  constructor() {
    this.name = 'MetaCognitionEngine';
    this.reasoningHistory = [];
    this.strategyEffectiveness = {};
    this.biasDetectionHistory = [];
    this.recursionDepth = 0;
    this.maxRecursionDepth = 5;

    // Initialize strategy effectiveness tracking
    Object.keys(REASONING_STRATEGIES).forEach(strategy => {
      this.strategyEffectiveness[strategy] = {
        uses: 0,
        successes: 0,
        averageQuality: 0,
        contextPerformance: {}
      };
    });
  }

  /**
   * Perform recursive meta-cognitive analysis on reasoning
   * @param {string} reasoning - The reasoning to analyze
   * @param {Object} context - Context about the problem domain
   * @param {number} depth - Current recursion depth
   * @returns {Object} Meta-cognitive analysis with improvements
   */
  async analyzeReasoning(reasoning, context = {}, depth = 0) {
    this.recursionDepth = depth;

    console.log(chalk.magenta(`\n${'  '.repeat(depth)}🧠 Meta-Cognition Level ${depth + 1}${depth > 0 ? ' (recursive)' : ''}`));

    if (depth >= this.maxRecursionDepth) {
      console.log(chalk.yellow(`${'  '.repeat(depth)}⚠️  Max recursion depth reached, returning`));
      return this._createTerminalAnalysis(reasoning, context);
    }

    const prompt = this._buildAnalysisPrompt(reasoning, context, depth);

    try {
      const response = await anthropicService.callClaude(META_COGNITION_PROMPT, prompt);
      const analysis = JSON.parse(response);

      // Store analysis in history
      this.reasoningHistory.push({
        timestamp: new Date().toISOString(),
        depth,
        input: reasoning.substring(0, 200),
        analysis,
        context
      });

      // Update strategy effectiveness based on analysis
      this._updateStrategyModel(analysis);

      // Track detected biases
      if (analysis.meta_process_analysis?.biases_detected?.length > 0) {
        this.biasDetectionHistory.push(...analysis.meta_process_analysis.biases_detected);
      }

      // Decide if deeper recursion is needed
      const shouldRecurse = this._shouldRecurse(analysis, depth);

      if (shouldRecurse) {
        console.log(chalk.cyan(`${'  '.repeat(depth)}↳ Recursing for deeper meta-analysis...`));

        // Recursive meta-cognition: analyze our own analysis
        const metaAnalysis = await this.analyzeReasoning(
          JSON.stringify(analysis.recursive_improvement),
          { ...context, previousAnalysis: analysis },
          depth + 1
        );

        // Integrate recursive insights
        analysis.recursive_meta_analysis = metaAnalysis;
        analysis.integrated_improvements = this._integrateImprovements(analysis, metaAnalysis);
      }

      // Save learnings to Redis
      await this._saveLearnings(analysis, context);

      console.log(chalk.green(`${'  '.repeat(depth)}✓ Meta-cognitive analysis complete (quality: ${analysis.meta_process_analysis?.reasoning_quality_score || 'N/A'}/10)`));

      return analysis;

    } catch (error) {
      console.error(chalk.red(`${'  '.repeat(depth)}✗ Meta-cognition error: ${error.message}`));
      return this._createErrorAnalysis(reasoning, error);
    }
  }

  /**
   * Detect cognitive biases in reasoning
   * @param {string} reasoning - The reasoning to check for biases
   * @returns {Array} Detected biases with evidence and mitigation strategies
   */
  async detectBiases(reasoning) {
    console.log(chalk.yellow('\n🔍 Scanning for cognitive biases...'));

    const biasPrompt = `Analyze the following reasoning for cognitive biases. For each bias detected, provide:
1. The type of bias (from: ${Object.keys(COGNITIVE_BIASES).join(', ')})
2. Specific evidence from the reasoning
3. Severity (high/medium/low)
4. Concrete mitigation steps

Reasoning to analyze:
${reasoning}

Output as JSON array of detected biases.`;

    try {
      const response = await anthropicService.callClaude(
        'You are a cognitive bias detection system. Identify biases with precision.',
        biasPrompt
      );

      const biases = JSON.parse(response);

      biases.forEach(bias => {
        console.log(chalk.yellow(`  ⚠️  ${bias.bias_type}: ${bias.evidence.substring(0, 60)}...`));
      });

      return biases;
    } catch (error) {
      console.error(chalk.red(`Bias detection error: ${error.message}`));
      return [];
    }
  }

  /**
   * Select optimal reasoning strategy based on problem characteristics
   * @param {Object} problem - Problem description and characteristics
   * @returns {Object} Recommended strategy with rationale
   */
  async selectReasoningStrategy(problem) {
    console.log(chalk.blue('\n📊 Selecting optimal reasoning strategy...'));

    const strategyPrompt = `Given the following problem, select the optimal reasoning strategy.

Problem: ${JSON.stringify(problem)}

Available strategies:
${Object.entries(REASONING_STRATEGIES).map(([key, s]) =>
  `- ${s.name}: ${s.description}\n  Strengths: ${s.strengths.join(', ')}\n  Weaknesses: ${s.weaknesses.join(', ')}`
).join('\n\n')}

Historical effectiveness data:
${JSON.stringify(this.strategyEffectiveness, null, 2)}

Provide your recommendation as JSON:
{
  "recommended_strategy": "...",
  "rationale": "...",
  "expected_effectiveness": 1-10,
  "backup_strategy": "...",
  "hybrid_approach": "..." // if combining strategies would be better
}`;

    try {
      const response = await anthropicService.callClaude(
        'You are a reasoning strategy optimizer. Select the best approach for each problem type.',
        strategyPrompt
      );

      const recommendation = JSON.parse(response);
      console.log(chalk.blue(`  → Recommended: ${recommendation.recommended_strategy}`));
      console.log(chalk.gray(`    Rationale: ${recommendation.rationale}`));

      return recommendation;
    } catch (error) {
      console.error(chalk.red(`Strategy selection error: ${error.message}`));
      return { recommended_strategy: 'CHAIN_OF_THOUGHT', rationale: 'Default fallback' };
    }
  }

  /**
   * Improve reasoning using selected strategy and meta-cognitive feedback
   * @param {string} originalReasoning - The reasoning to improve
   * @param {Object} metaAnalysis - Meta-cognitive analysis results
   * @returns {string} Improved reasoning
   */
  async improveReasoning(originalReasoning, metaAnalysis) {
    console.log(chalk.green('\n🔧 Applying meta-cognitive improvements...'));

    const improvementPrompt = `You are tasked with improving reasoning based on meta-cognitive analysis.

Original Reasoning:
${originalReasoning}

Meta-Cognitive Analysis:
${JSON.stringify(metaAnalysis, null, 2)}

Apply the following improvements:
1. Address all identified logical gaps
2. Mitigate detected biases using suggested strategies
3. Strengthen weak evidence chains
4. Make implicit assumptions explicit
5. Add appropriate uncertainty quantification

Provide improved reasoning that addresses all identified issues while maintaining clarity.`;

    try {
      const response = await anthropicService.callClaude(
        'You are a reasoning improvement system. Enhance reasoning while preserving valid insights.',
        improvementPrompt
      );

      console.log(chalk.green('  ✓ Reasoning improved'));
      return response;
    } catch (error) {
      console.error(chalk.red(`Reasoning improvement error: ${error.message}`));
      return originalReasoning;
    }
  }

  /**
   * Generate a self-model describing the engine's reasoning patterns
   * @returns {Object} Self-model with capabilities, limitations, and improvement areas
   */
  async generateSelfModel() {
    console.log(chalk.magenta('\n🪞 Generating self-model...'));

    const selfModelPrompt = `Based on the following reasoning history and strategy effectiveness data, generate a self-model.

Reasoning History (last 10):
${JSON.stringify(this.reasoningHistory.slice(-10), null, 2)}

Strategy Effectiveness:
${JSON.stringify(this.strategyEffectiveness, null, 2)}

Bias Detection History:
${JSON.stringify(this.biasDetectionHistory.slice(-20), null, 2)}

Generate a self-model as JSON:
{
  "cognitive_profile": {
    "strongest_reasoning_types": [...],
    "weakest_reasoning_types": [...],
    "most_common_biases": [...],
    "calibration_quality": "overconfident|underconfident|well_calibrated"
  },
  "improvement_priorities": [
    {
      "area": "...",
      "current_level": 1-10,
      "target_level": 1-10,
      "improvement_strategy": "..."
    }
  ],
  "meta_cognitive_capabilities": {
    "self_awareness": 1-10,
    "bias_detection": 1-10,
    "strategy_selection": 1-10,
    "recursive_reflection": 1-10
  },
  "knowledge_boundaries": {
    "high_confidence_domains": [...],
    "uncertain_domains": [...],
    "known_unknowns": [...],
    "suspected_unknown_unknowns": [...]
  }
}`;

    try {
      const response = await anthropicService.callClaude(
        'You are a self-modeling system. Generate accurate introspective analysis.',
        selfModelPrompt
      );

      const selfModel = JSON.parse(response);
      console.log(chalk.magenta('  ✓ Self-model generated'));

      // Save self-model
      await redisService.saveLearning('meta_cognition', JSON.stringify(selfModel));

      return selfModel;
    } catch (error) {
      console.error(chalk.red(`Self-model generation error: ${error.message}`));
      return null;
    }
  }

  // Private helper methods

  _buildAnalysisPrompt(reasoning, context, depth) {
    return `Analyze the following reasoning at meta-cognitive depth ${depth + 1}.

## Reasoning to Analyze
${reasoning}

## Context
${JSON.stringify(context, null, 2)}

## Previous Meta-Cognitive Learnings
${JSON.stringify(this.reasoningHistory.slice(-3), null, 2)}

## Current Strategy Effectiveness Data
${JSON.stringify(this.strategyEffectiveness, null, 2)}

Provide comprehensive meta-cognitive analysis following the framework above.`;
  }

  _shouldRecurse(analysis, currentDepth) {
    // Decide if deeper recursion would be valuable
    const qualityScore = analysis.meta_process_analysis?.reasoning_quality_score || 5;
    const metaConfidence = analysis.recursive_improvement?.meta_confidence || 0.5;
    const recommendation = analysis.recursive_improvement?.recursive_depth_recommendation || 1;

    // Recurse if: quality is low, confidence is low, or explicitly recommended
    return (
      currentDepth < this.maxRecursionDepth &&
      (qualityScore < 6 || metaConfidence < 0.7 || recommendation > currentDepth + 1)
    );
  }

  _updateStrategyModel(analysis) {
    const strategyUsed = analysis.process_analysis?.strategy_used;
    if (strategyUsed && this.strategyEffectiveness[strategyUsed]) {
      const stats = this.strategyEffectiveness[strategyUsed];
      stats.uses++;
      const quality = analysis.meta_process_analysis?.reasoning_quality_score || 5;
      stats.averageQuality = (stats.averageQuality * (stats.uses - 1) + quality) / stats.uses;
      if (quality >= 7) stats.successes++;
    }
  }

  _integrateImprovements(baseAnalysis, recursiveAnalysis) {
    // Combine insights from multiple recursion levels
    return {
      combined_improvements: [
        ...(baseAnalysis.recursive_improvement?.specific_changes || []),
        ...(recursiveAnalysis.recursive_improvement?.specific_changes || [])
      ].filter((v, i, a) => a.indexOf(v) === i), // deduplicate
      confidence_adjusted: Math.min(
        baseAnalysis.recursive_improvement?.meta_confidence || 0.5,
        recursiveAnalysis.recursive_improvement?.meta_confidence || 0.5
      ),
      recursion_depth_achieved: this.recursionDepth + 1
    };
  }

  async _saveLearnings(analysis, context) {
    const learning = {
      timestamp: new Date().toISOString(),
      context: context.domain || 'general',
      key_insight: analysis.self_model_update?.learned_about_reasoning,
      quality_score: analysis.meta_process_analysis?.reasoning_quality_score,
      biases_found: analysis.meta_process_analysis?.biases_detected?.length || 0
    };

    await redisService.saveLearning('meta_cognition', JSON.stringify(learning));
  }

  _createTerminalAnalysis(reasoning, context) {
    return {
      content_analysis: { main_claims: [], evidence_quality: 'not_analyzed', note: 'Max recursion depth reached' },
      process_analysis: { strategy_used: 'unknown', reasoning_depth: this.recursionDepth },
      meta_process_analysis: { reasoning_quality_score: 5, biases_detected: [] },
      recursive_improvement: { meta_confidence: 0.5, specific_changes: ['Increase max recursion depth for deeper analysis'] },
      terminal: true
    };
  }

  _createErrorAnalysis(reasoning, error) {
    return {
      error: true,
      error_message: error.message,
      content_analysis: { main_claims: [], evidence_quality: 'error' },
      process_analysis: { strategy_used: 'error_recovery' },
      meta_process_analysis: { reasoning_quality_score: 0, biases_detected: [] },
      recursive_improvement: { meta_confidence: 0, specific_changes: ['Fix underlying error'] }
    };
  }
}

export const metaCognitionEngine = new MetaCognitionEngine();
export { COGNITIVE_BIASES, REASONING_STRATEGIES };
