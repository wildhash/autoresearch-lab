/**
 * Mock Data Service
 * Provides realistic fallback data when actual APIs are not configured
 * Used for demos and development without requiring API credentials
 */

export const MOCK_DB = {
  // TRM Labs - Blockchain intelligence and crypto risk data
  TRM_Labs: {
    risk_score: 85,
    risk_level: 'HIGH',
    flagged_wallets: [
      {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        risk_type: 'sanctioned_entity',
        confidence: 0.95,
        last_activity: '2024-01-15T10:30:00Z',
      },
      {
        address: '0x8b3192f5eEBD8579568A2Ed41E6FEB402f93f73F',
        risk_type: 'darknet_marketplace',
        confidence: 0.87,
        last_activity: '2024-01-10T14:22:00Z',
      },
      {
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        risk_type: 'mixing_service',
        confidence: 0.78,
        last_activity: '2024-01-12T08:15:00Z',
      },
    ],
    bridge_risks: {
      bridge_name: 'Multi-Chain Bridge',
      total_tvl: '$1.2B',
      exploits_last_year: 3,
      vulnerability_score: 72,
      key_risks: [
        'Centralized validator set',
        'Unaudited smart contracts',
        'High concentration of funds',
      ],
    },
    defi_protocol_analysis: {
      protocol: 'Example DeFi',
      security_audits: 2,
      bug_bounty: '$500K',
      exploit_history: 'None',
      tvl_risk_ratio: 0.65,
    },
  },

  // Finster AI - AI-powered financial and sector analysis
  Finster_AI: {
    sector: 'DeFi',
    volatility: 'High',
    market_sentiment: {
      overall: 'Cautiously Optimistic',
      score: 62,
      trend: 'Improving',
      drivers: [
        'Increased institutional adoption',
        'Regulatory clarity in key markets',
        'Technical innovation in Layer 2 solutions',
      ],
    },
    sector_analysis: {
      market_cap: '$85.3B',
      weekly_change: '-2.3%',
      monthly_change: '+15.7%',
      dominant_protocols: ['Uniswap', 'Aave', 'Compound'],
      emerging_trends: [
        'Real-world asset tokenization',
        'Liquid staking derivatives',
        'Cross-chain DeFi protocols',
      ],
    },
    risk_factors: {
      regulatory: 'Medium',
      technical: 'High',
      market: 'High',
      operational: 'Medium',
      key_concerns: [
        'Smart contract vulnerabilities in new protocols',
        'Bridge security remains a critical issue',
        'Regulatory uncertainty in major markets',
      ],
    },
    opportunity_analysis: {
      growth_potential: 'High',
      innovation_index: 8.2,
      adoption_rate: '+45% YoY',
      key_opportunities: [
        'Institutional DeFi products',
        'Tokenized securities',
        'Decentralized identity solutions',
      ],
    },
  },

  // Senso - Market sentiment and credit risk analysis
  Senso: {
    sentiment: 'Negative',
    credit_risk: 'Increasing',
    market_data: {
      overall_sentiment_score: 38,
      fear_greed_index: 42,
      market_phase: 'Correction',
      confidence_level: 'Low',
    },
    bridge_sentiment: {
      topic: 'DeFi Bridge Security',
      sentiment_trend: 'Declining',
      mentions_24h: 12847,
      negative_mentions_pct: 68,
      key_concerns: [
        'Recent bridge hacks causing anxiety',
        'Lack of insurance options',
        'Regulatory scrutiny increasing',
      ],
      social_signals: {
        twitter_sentiment: -0.42,
        reddit_sentiment: -0.31,
        telegram_sentiment: -0.28,
      },
    },
    credit_risk_indicators: {
      default_probability: 'Elevated',
      counterparty_risk: 'High',
      liquidity_concerns: 'Present',
      warning_signals: [
        'Declining Total Value Locked (TVL)',
        'Increased token volatility',
        'Team transparency issues',
      ],
    },
    predictive_analysis: {
      short_term_outlook: 'Bearish',
      medium_term_outlook: 'Neutral',
      long_term_outlook: 'Cautiously Bullish',
      key_catalysts: [
        'Upcoming regulatory decisions',
        'Major protocol upgrades',
        'Institutional investment flows',
      ],
    },
  },

  // Generic blockchain security data
  blockchain_security: {
    recent_exploits: [
      {
        date: '2024-01-08',
        protocol: 'BridgeX',
        loss_amount: '$120M',
        attack_vector: 'Private key compromise',
      },
      {
        date: '2023-12-22',
        protocol: 'ChainSwap',
        loss_amount: '$15M',
        attack_vector: 'Smart contract vulnerability',
      },
      {
        date: '2023-12-15',
        protocol: 'MultiVault',
        loss_amount: '$45M',
        attack_vector: 'Oracle manipulation',
      },
    ],
    security_trends: {
      total_losses_2024: '$182M',
      total_losses_2023: '$1.8B',
      most_common_vectors: [
        'Bridge vulnerabilities',
        'Private key compromises',
        'Smart contract bugs',
        'Oracle manipulation',
      ],
      improvement_areas: [
        'Multi-sig implementations',
        'Time-locked transactions',
        'Insurance protocols',
        'Bug bounty programs',
      ],
    },
  },

  // Emerging trends data
  emerging_trends: {
    year: 2024,
    top_trends: [
      {
        trend: 'Zero-Knowledge Proofs in Production',
        adoption: 'Rapidly Growing',
        impact: 'High',
        description: 'ZK-rollups and privacy solutions gaining mainstream adoption',
      },
      {
        trend: 'Account Abstraction',
        adoption: 'Early Stage',
        impact: 'Very High',
        description: 'ERC-4337 enabling programmable wallets and better UX',
      },
      {
        trend: 'Modular Blockchain Architecture',
        adoption: 'Growing',
        impact: 'High',
        description: 'Separation of consensus, execution, and data availability layers',
      },
      {
        trend: 'Intent-Based Architectures',
        adoption: 'Emerging',
        impact: 'Medium-High',
        description: 'User intent-centric design replacing transaction-based models',
      },
    ],
    security_improvements: [
      'Formal verification becoming standard',
      'Real-time monitoring and alerting systems',
      'Decentralized insurance protocols',
      'Improved bridge architectures',
    ],
  },
};

/**
 * Get mock data for a specific API
 * @param {string} apiName - Name of the API (trmlabs, finsterai, senso)
 * @param {string} endpoint - API endpoint (optional, for more specific data)
 * @returns {Object} Mock data response
 */
export function getMockData(apiName, endpoint = '/') {
  const apiMap = {
    trmlabs: MOCK_DB.TRM_Labs,
    finsterai: MOCK_DB.Finster_AI,
    senso: MOCK_DB.Senso,
  };

  const data = apiMap[apiName.toLowerCase()];
  
  if (!data) {
    return {
      error: 'Mock data not available for this API',
      available_apis: Object.keys(apiMap),
    };
  }

  return {
    success: true,
    data,
    source: 'mock',
    timestamp: new Date().toISOString(),
    note: 'This is mock data for demonstration purposes',
  };
}

/**
 * Check if an API should use mock data
 * @param {string} apiName - Name of the API
 * @returns {boolean} True if mock data should be used
 */
export function shouldUseMockData(apiName) {
  // This will be used by the API service to determine fallback behavior
  return true; // In a real scenario, this would check if API keys are configured
}
