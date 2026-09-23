export type FraudType = 
  | 'Investment Scam'
  | 'Task-Based Fraud'
  | 'Sextortion'
  | 'Phishing'
  | 'Ransomware'
  | 'Darknet Transaction'
  | 'Other';

export type CryptoChain = 'BTC' | 'ETH' | 'TRON' | 'SOL';

export interface ComplaintData {
  walletAddress: string;
  chain: CryptoChain;
  fraudType: FraudType;
  transactionDate: string;
  complaintRef: string;
  amountEstimated: string;
  victimNotes?: string;
}

export interface CandidateExchange {
  name: string;
  confidenceScore: number;
  hopsCount: number;
  riskLabel: 'Low' | 'Moderate' | 'Elevated';
  depositAddress: string;
  clusterType: string;
  vaspJurisdiction: string;
  leiOrLicence: string;
  heuristics: {
    hopsAnalysis: string;
    timingCorrelation: string;
    clusterBehavior: string;
    depositPattern: string;
  };
  freezeProtocol: {
    leDeskUrl: string;
    recommendedOrderType: string;
    statutoryReference: string;
  };
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'victim' | 'scam_root' | 'mule_hop' | 'mixer' | 'deposit_cluster' | 'exchange';
  address: string;
  amount: string;
  txHash?: string;
  tag?: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amount: string;
  txHash: string;
  timestamp: string;
  flag?: 'direct' | 'peeling_chain' | 'mixer_hop' | 'consolidated';
}

export interface TraceResult {
  traceId: string;
  timestamp: string;
  complaint: ComplaintData;
  topCandidates: CandidateExchange[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  caseRisk: 'HIGH' | 'MODERATE' | 'LOW';
  launderingRisk: {
    detected: boolean;
    type: string;
    description: string;
    warningLevel: 'ELEVATED' | 'CRITICAL' | 'NONE';
    tumblerOrMixerName?: string;
  };
  urgency: {
    status: 'IMMEDIATE_ACTION' | 'ACTIVE_WINDOW' | 'HISTORIC_COLD';
    lastMovementText: string;
    lastMovementMinutesAgo: number;
    freezeRecommendation: string;
    urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  };
}

export interface HistoricalCase {
  id: string;
  complaintRef: string;
  fraudType: FraudType;
  walletAddress: string;
  matchedExchange: string;
  confidenceScore: number;
  caseRisk: 'HIGH' | 'MODERATE' | 'LOW';
  urgency: string;
  date: string;
  status: 'FROZEN' | 'UNDER_REVIEW' | 'FLAGGED' | 'COMPLETED';
}
