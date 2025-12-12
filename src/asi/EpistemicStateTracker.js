/**
 * EpistemicStateTracker - Uncertainty Quantification & Knowledge Boundary Management
 *
 * This module implements an epistemic state tracking system that enables:
 * 1. Bayesian belief updating with explicit uncertainty quantification
 * 2. Knowledge boundary detection (knowing what you don't know)
 * 3. Confidence calibration and metacognitive monitoring
 * 4. Information value estimation for optimal learning paths
 *
 * Core ASI Concept: A truly intelligent system must maintain accurate beliefs about
 * its own knowledge state, including uncertainty quantification and explicit
 * representation of knowledge boundaries (known unknowns and unknown unknowns).
 *
 * @author Fellowship Candidate
 * @version 1.0.0
 */

import { anthropicService } from '../services/anthropic.js';
import { redisService } from '../services/redis.js';
import chalk from 'chalk';

/**
 * Epistemic status categories for knowledge claims
 */
const EPISTEMIC_STATUS = {
  CERTAIN: {
    level: 5,
    label: 'Certain',
    description: 'Logically necessary or empirically verified beyond reasonable doubt',
    confidenceRange: [0.95, 1.0]
  },
  HIGHLY_CONFIDENT: {
    level: 4,
    label: 'Highly Confident',
    description: 'Strong evidence with minimal uncertainty',
    confidenceRange: [0.8, 0.95]
  },
  MODERATELY_CONFIDENT: {
    level: 3,
    label: 'Moderately Confident',
    description: 'Good evidence but notable uncertainty remains',
    confidenceRange: [0.6, 0.8]
  },
  UNCERTAIN: {
    level: 2,
    label: 'Uncertain',
    description: 'Limited evidence, multiple plausible alternatives',
    confidenceRange: [0.4, 0.6]
  },
  SPECULATIVE: {
    level: 1,
    label: 'Speculative',
    description: 'Minimal evidence, primarily hypothesis or conjecture',
    confidenceRange: [0.2, 0.4]
  },
  UNKNOWN: {
    level: 0,
    label: 'Unknown',
    description: 'No reliable information available',
    confidenceRange: [0, 0.2]
  }
};

/**
 * Types of knowledge boundaries
 */
const BOUNDARY_TYPES = {
  KNOWN_KNOWNS: {
    description: 'Things we know we know',
    action: 'Use confidently, update with new evidence'
  },
  KNOWN_UNKNOWNS: {
    description: 'Things we know we don\'t know',
    action: 'Prioritize research and information gathering'
  },
  UNKNOWN_UNKNOWNS: {
    description: 'Things we don\'t know we don\'t know',
    action: 'Employ exploratory research, question assumptions'
  },
  FALSE_KNOWNS: {
    description: 'Things we think we know but are wrong about',
    action: 'Challenge beliefs, seek disconfirming evidence'
  }
};

const EPISTEMIC_PROMPT = `You are an Epistemic State Analyzer - a system for precise uncertainty quantification.

Your task is to analyze claims and beliefs, producing rigorous epistemic assessments.

## Epistemic Analysis Framework

### For Each Claim:
1. **Evidence Assessment**
   - What evidence supports this claim?
   - What is the quality of each evidence source?
   - What evidence contradicts this claim?

2. **Uncertainty Decomposition**
   - Aleatoric uncertainty (inherent randomness)
   - Epistemic uncertainty (lack of knowledge)
   - Model uncertainty (limitations of reasoning framework)

3. **Confidence Calibration**
   - Historical calibration data
   - Base rate considerations
   - Reference class forecasting

4. **Knowledge Boundary Classification**
   - Is this a known known, known unknown, etc.?
   - What would change our assessment?
   - What are we assuming without evidence?

## Output Format (JSON)
{
  "claims_analysis": [
    {
      "claim": "...",
      "epistemic_status": "CERTAIN|HIGHLY_CONFIDENT|MODERATELY_CONFIDENT|UNCERTAIN|SPECULATIVE|UNKNOWN",
      "confidence": 0.0-1.0,
      "confidence_interval": [lower, upper],
      "uncertainty_decomposition": {
        "aleatoric": 0.0-1.0,
        "epistemic": 0.0-1.0,
        "model": 0.0-1.0
      },
      "evidence_for": [...],
      "evidence_against": [...],
      "key_assumptions": [...],
      "would_change_if": [...],
      "boundary_type": "KNOWN_KNOWNS|KNOWN_UNKNOWNS|UNKNOWN_UNKNOWNS|FALSE_KNOWNS"
    }
  ],
  "aggregate_epistemic_state": {
    "overall_confidence": 0.0-1.0,
    "knowledge_coverage": 0.0-1.0,
    "critical_unknowns": [...],
    "suspected_false_knowns": [...],
    "information_value_opportunities": [
      {
        "area": "...",
        "expected_value_of_information": 1-10,
        "cost_to_acquire": 1-10,
        "priority_score": 1-10
      }
    ]
  },
  "calibration_assessment": {
    "likely_overconfident_claims": [...],
    "likely_underconfident_claims": [...],
    "calibration_recommendation": "..."
  }
}`;

/**
 * EpistemicStateTracker - The core uncertainty quantification system
 */
export class EpistemicStateTracker {
  constructor() {
    this.name = 'EpistemicStateTracker';
    this.beliefState = new Map(); // claim -> epistemic assessment
    this.calibrationHistory = [];
    this.knowledgeBoundaries = {
      knownKnowns: new Set(),
      knownUnknowns: new Set(),
      unknownUnknowns: new Set(),
      falseKnowns: new Set()
    };
    this.predictionLog = []; // For calibration tracking
  }

  /**
   * Analyze epistemic state of a set of claims or beliefs
   * @param {Array|string} claims - Claims to analyze
   * @param {Object} context - Context for the claims
   * @returns {Object} Epistemic analysis with confidence and boundaries
   */
  async analyzeEpistemicState(claims, context = {}) {
    console.log(chalk.cyan('\n📊 Analyzing epistemic state...'));

    const claimsArray = Array.isArray(claims) ? claims : [claims];

    const prompt = `Analyze the epistemic state of the following claims:

Claims:
${claimsArray.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Context:
${JSON.stringify(context, null, 2)}

Historical calibration data:
${JSON.stringify(this.calibrationHistory.slice(-10), null, 2)}

Provide rigorous epistemic analysis following the framework above.`;

    try {
      const response = await anthropicService.callClaude(EPISTEMIC_PROMPT, prompt);
      const analysis = JSON.parse(response);

      // Update belief state
      analysis.claims_analysis.forEach(claimAnalysis => {
        this.beliefState.set(claimAnalysis.claim, claimAnalysis);
        this._updateBoundaries(claimAnalysis);
      });

      // Log for calibration
      this.calibrationHistory.push({
        timestamp: new Date().toISOString(),
        claims_count: claimsArray.length,
        average_confidence: analysis.aggregate_epistemic_state.overall_confidence,
        context_domain: context.domain || 'general'
      });

      // Display summary
      this._displayEpistemicSummary(analysis);

      // Save to Redis
      await this._saveEpistemicState(analysis, context);

      return analysis;

    } catch (error) {
      console.error(chalk.red(`Epistemic analysis error: ${error.message}`));
      return this._createFallbackAnalysis(claimsArray, error);
    }
  }

  /**
   * Calculate the Expected Value of Information (EVOI) for potential queries
   * @param {Array} potentialQueries - Queries that could be pursued
   * @param {Object} currentState - Current knowledge state
   * @returns {Array} Ranked queries by information value
   */
  async calculateInformationValue(potentialQueries, currentState = {}) {
    console.log(chalk.yellow('\n💎 Calculating Expected Value of Information...'));

    const evoiPrompt = `Calculate the Expected Value of Information (EVOI) for each potential query.

Current Knowledge State:
${JSON.stringify(currentState, null, 2)}

Current Known Unknowns:
${JSON.stringify([...this.knowledgeBoundaries.knownUnknowns], null, 2)}

Potential Queries:
${potentialQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

For each query, estimate:
1. **Prior Uncertainty**: How uncertain are we about this topic? (0-1)
2. **Expected Reduction**: How much would this query reduce uncertainty? (0-1)
3. **Decision Impact**: How much would this information affect decisions? (1-10)
4. **Query Cost**: Time/resources needed (1-10, 1=cheap)
5. **Information Decay**: How quickly will this information become stale? (1-10, 10=stable)

Output as JSON:
{
  "query_rankings": [
    {
      "query": "...",
      "prior_uncertainty": 0.0-1.0,
      "expected_reduction": 0.0-1.0,
      "decision_impact": 1-10,
      "query_cost": 1-10,
      "information_decay": 1-10,
      "evoi_score": 0.0-100.0,
      "recommendation": "high_priority|medium_priority|low_priority|skip"
    }
  ],
  "optimal_query_sequence": [...],
  "rationale": "..."
}`;

    try {
      const response = await anthropicService.callClaude(
        'You are an information value optimizer using decision theory principles.',
        evoiPrompt
      );

      const evoiAnalysis = JSON.parse(response);

      // Display rankings
      console.log(chalk.yellow('\nQuery Rankings by EVOI:'));
      evoiAnalysis.query_rankings.forEach((q, i) => {
        const color = q.recommendation === 'high_priority' ? 'green' :
          q.recommendation === 'medium_priority' ? 'yellow' : 'gray';
        console.log(chalk[color](`  ${i + 1}. [${q.evoi_score.toFixed(1)}] ${q.query}`));
      });

      return evoiAnalysis;

    } catch (error) {
      console.error(chalk.red(`EVOI calculation error: ${error.message}`));
      return { query_rankings: [], optimal_query_sequence: [] };
    }
  }

  /**
   * Perform Bayesian belief update given new evidence
   * @param {string} claim - The claim to update
   * @param {Object} newEvidence - New evidence to incorporate
   * @returns {Object} Updated belief with reasoning
   */
  async updateBelief(claim, newEvidence) {
    console.log(chalk.blue('\n📈 Performing Bayesian belief update...'));

    const priorBelief = this.beliefState.get(claim);

    const updatePrompt = `Perform a Bayesian belief update.

Prior Belief:
${JSON.stringify(priorBelief || { claim, confidence: 0.5, epistemic_status: 'UNCERTAIN' }, null, 2)}

New Evidence:
${JSON.stringify(newEvidence, null, 2)}

Apply Bayesian reasoning:
1. What is the likelihood of this evidence given the claim is true? P(E|H)
2. What is the likelihood of this evidence given the claim is false? P(E|~H)
3. Calculate the likelihood ratio: P(E|H) / P(E|~H)
4. Update the posterior probability

Output as JSON:
{
  "prior": {
    "probability": 0.0-1.0,
    "rationale": "..."
  },
  "likelihood_ratio": {
    "p_evidence_given_true": 0.0-1.0,
    "p_evidence_given_false": 0.0-1.0,
    "ratio": number,
    "rationale": "..."
  },
  "posterior": {
    "probability": 0.0-1.0,
    "confidence_interval": [lower, upper],
    "epistemic_status": "...",
    "rationale": "..."
  },
  "belief_change": {
    "direction": "increased|decreased|unchanged",
    "magnitude": "large|moderate|small|negligible",
    "key_factors": [...]
  },
  "remaining_uncertainties": [...],
  "recommended_next_evidence": [...]
}`;

    try {
      const response = await anthropicService.callClaude(
        'You are a Bayesian reasoning system. Apply rigorous probabilistic inference.',
        updatePrompt
      );

      const update = JSON.parse(response);

      // Update belief state
      this.beliefState.set(claim, {
        claim,
        confidence: update.posterior.probability,
        epistemic_status: update.posterior.epistemic_status,
        confidence_interval: update.posterior.confidence_interval,
        last_update: new Date().toISOString(),
        update_history: [
          ...(priorBelief?.update_history || []),
          { evidence: newEvidence, update }
        ]
      });

      // Log for calibration
      this.predictionLog.push({
        claim,
        prior: update.prior.probability,
        posterior: update.posterior.probability,
        evidence: newEvidence,
        timestamp: new Date().toISOString()
      });

      console.log(chalk.blue(`  Prior: ${(update.prior.probability * 100).toFixed(1)}%`));
      console.log(chalk.blue(`  Posterior: ${(update.posterior.probability * 100).toFixed(1)}%`));
      console.log(chalk.blue(`  Change: ${update.belief_change.direction} (${update.belief_change.magnitude})`));

      return update;

    } catch (error) {
      console.error(chalk.red(`Belief update error: ${error.message}`));
      return null;
    }
  }

  /**
   * Detect potential unknown unknowns through adversarial questioning
   * @param {string} domain - Domain to probe
   * @param {Object} currentKnowledge - What we currently know
   * @returns {Array} Potential unknown unknowns with probing questions
   */
  async detectUnknownUnknowns(domain, currentKnowledge = {}) {
    console.log(chalk.red('\n🔮 Probing for unknown unknowns...'));

    const probePrompt = `You are an adversarial questioner designed to uncover unknown unknowns.

Domain: ${domain}

Current Knowledge:
${JSON.stringify(currentKnowledge, null, 2)}

Current Known Unknowns:
${JSON.stringify([...this.knowledgeBoundaries.knownUnknowns], null, 2)}

Your task:
1. Identify assumptions that haven't been questioned
2. Find blind spots in the current knowledge model
3. Generate questions that challenge the framing itself
4. Look for meta-level unknowns (unknowns about our uncertainty model)

Techniques to employ:
- Pre-mortem analysis: "If we failed, what would we have missed?"
- Inversion: "What would need to be false for our beliefs to be wrong?"
- Reference class expansion: "What similar domains have surprises we haven't considered?"
- Red team perspective: "What would an adversary know that we don't?"

Output as JSON:
{
  "challenged_assumptions": [
    {
      "assumption": "...",
      "why_assumed": "...",
      "potential_falsity": "...",
      "probe_question": "..."
    }
  ],
  "blind_spots_identified": [
    {
      "area": "...",
      "why_blind": "...",
      "potential_importance": 1-10,
      "probe_question": "..."
    }
  ],
  "meta_unknowns": [
    {
      "description": "...",
      "about": "our_model|our_uncertainty|our_values|our_goals",
      "probe_question": "..."
    }
  ],
  "recommended_explorations": [...],
  "confidence_in_detection": 0.0-1.0,
  "note": "..." // Any important caveats about this analysis
}`;

    try {
      const response = await anthropicService.callClaude(
        'You are a Socratic adversary designed to find what is missing from our knowledge.',
        probePrompt
      );

      const probeResults = JSON.parse(response);

      // Update unknown unknowns boundary
      probeResults.blind_spots_identified.forEach(spot => {
        this.knowledgeBoundaries.unknownUnknowns.add(spot.area);
      });

      console.log(chalk.red(`  Found ${probeResults.blind_spots_identified.length} potential blind spots`));
      console.log(chalk.red(`  Challenged ${probeResults.challenged_assumptions.length} assumptions`));

      return probeResults;

    } catch (error) {
      console.error(chalk.red(`Unknown unknowns detection error: ${error.message}`));
      return { challenged_assumptions: [], blind_spots_identified: [], meta_unknowns: [] };
    }
  }

  /**
   * Assess calibration quality - how well confidence matches accuracy
   * @returns {Object} Calibration assessment with recommendations
   */
  async assessCalibration() {
    console.log(chalk.magenta('\n📏 Assessing calibration quality...'));

    if (this.predictionLog.length < 5) {
      console.log(chalk.yellow('  Insufficient data for calibration assessment'));
      return { status: 'insufficient_data', predictions_needed: 5 - this.predictionLog.length };
    }

    const calibrationPrompt = `Assess calibration quality from prediction history.

Prediction Log:
${JSON.stringify(this.predictionLog.slice(-50), null, 2)}

Calibration History:
${JSON.stringify(this.calibrationHistory.slice(-20), null, 2)}

Analyze:
1. Are high-confidence predictions more accurate than low-confidence ones?
2. Is there systematic overconfidence or underconfidence?
3. What domains show best/worst calibration?
4. How should confidence estimates be adjusted?

Output as JSON:
{
  "calibration_score": 0.0-1.0,
  "tendency": "overconfident|underconfident|well_calibrated",
  "brier_score_estimate": 0.0-1.0,
  "calibration_by_confidence_band": {
    "90-100%": { "predicted": number, "actual": number },
    "70-90%": { "predicted": number, "actual": number },
    "50-70%": { "predicted": number, "actual": number },
    "below_50%": { "predicted": number, "actual": number }
  },
  "domain_calibration": {...},
  "adjustment_recommendations": [
    {
      "condition": "...",
      "current_behavior": "...",
      "recommended_adjustment": "..."
    }
  ],
  "confidence_adjustment_factor": number // multiply future confidences by this
}`;

    try {
      const response = await anthropicService.callClaude(
        'You are a calibration assessment system. Evaluate prediction accuracy.',
        calibrationPrompt
      );

      const calibration = JSON.parse(response);

      console.log(chalk.magenta(`  Calibration score: ${(calibration.calibration_score * 100).toFixed(1)}%`));
      console.log(chalk.magenta(`  Tendency: ${calibration.tendency}`));

      return calibration;

    } catch (error) {
      console.error(chalk.red(`Calibration assessment error: ${error.message}`));
      return { calibration_score: 0.5, tendency: 'unknown', error: error.message };
    }
  }

  /**
   * Get the current epistemic state summary
   * @returns {Object} Summary of current knowledge state
   */
  getEpistemicSummary() {
    return {
      total_beliefs: this.beliefState.size,
      boundaries: {
        known_knowns: this.knowledgeBoundaries.knownKnowns.size,
        known_unknowns: this.knowledgeBoundaries.knownUnknowns.size,
        unknown_unknowns: this.knowledgeBoundaries.unknownUnknowns.size,
        false_knowns: this.knowledgeBoundaries.falseKnowns.size
      },
      calibration_samples: this.predictionLog.length,
      high_confidence_beliefs: [...this.beliefState.entries()]
        .filter(([_, v]) => v.confidence > 0.8)
        .map(([k, _]) => k),
      critical_unknowns: [...this.knowledgeBoundaries.knownUnknowns]
    };
  }

  // Private helper methods

  _updateBoundaries(claimAnalysis) {
    const claim = claimAnalysis.claim;

    // Clear from all boundaries first
    Object.values(this.knowledgeBoundaries).forEach(set => set.delete(claim));

    // Add to appropriate boundary
    switch (claimAnalysis.boundary_type) {
      case 'KNOWN_KNOWNS':
        this.knowledgeBoundaries.knownKnowns.add(claim);
        break;
      case 'KNOWN_UNKNOWNS':
        this.knowledgeBoundaries.knownUnknowns.add(claim);
        break;
      case 'UNKNOWN_UNKNOWNS':
        this.knowledgeBoundaries.unknownUnknowns.add(claim);
        break;
      case 'FALSE_KNOWNS':
        this.knowledgeBoundaries.falseKnowns.add(claim);
        break;
    }
  }

  _displayEpistemicSummary(analysis) {
    console.log(chalk.cyan('\n--- Epistemic State Summary ---'));
    console.log(chalk.white(`Overall Confidence: ${(analysis.aggregate_epistemic_state.overall_confidence * 100).toFixed(1)}%`));
    console.log(chalk.white(`Knowledge Coverage: ${(analysis.aggregate_epistemic_state.knowledge_coverage * 100).toFixed(1)}%`));

    if (analysis.aggregate_epistemic_state.critical_unknowns?.length > 0) {
      console.log(chalk.yellow('\nCritical Unknowns:'));
      analysis.aggregate_epistemic_state.critical_unknowns.forEach(u =>
        console.log(chalk.yellow(`  • ${u}`))
      );
    }

    if (analysis.calibration_assessment?.likely_overconfident_claims?.length > 0) {
      console.log(chalk.red('\nPotentially Overconfident:'));
      analysis.calibration_assessment.likely_overconfident_claims.forEach(c =>
        console.log(chalk.red(`  ⚠️  ${c}`))
      );
    }
  }

  async _saveEpistemicState(analysis, context) {
    const state = {
      timestamp: new Date().toISOString(),
      domain: context.domain || 'general',
      overall_confidence: analysis.aggregate_epistemic_state.overall_confidence,
      claims_count: analysis.claims_analysis.length,
      critical_unknowns_count: analysis.aggregate_epistemic_state.critical_unknowns?.length || 0
    };

    await redisService.saveLearning('epistemic_state', JSON.stringify(state));
  }

  _createFallbackAnalysis(claims, error) {
    return {
      error: true,
      error_message: error.message,
      claims_analysis: claims.map(c => ({
        claim: c,
        epistemic_status: 'UNKNOWN',
        confidence: 0.5,
        boundary_type: 'KNOWN_UNKNOWNS'
      })),
      aggregate_epistemic_state: {
        overall_confidence: 0.5,
        knowledge_coverage: 0,
        critical_unknowns: claims
      }
    };
  }
}

export const epistemicStateTracker = new EpistemicStateTracker();
export { EPISTEMIC_STATUS, BOUNDARY_TYPES };
