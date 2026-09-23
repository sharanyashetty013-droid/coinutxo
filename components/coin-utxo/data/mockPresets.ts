import { ComplaintData, TraceResult, HistoricalCase } from '../types';

export const SYSTEM_METRICS = {
  casesTraced: '14,892',
  knownVaspsIndexed: '218',
  activeClusteredWallets: '4,109,200',
  avgAttributionTimeMs: '1,420',
  freezeSuccessRate: '87.4%',
  nodeRegistry: 'NCR-CYBER-CELL-DL04'
};

export const PRESET_COMPLAINTS: {
  id: string;
  label: string;
  tag: string;
  complaint: ComplaintData;
  result: TraceResult;
}[] = [
  {
    id: 'preset-telegram-task',
    label: 'Telegram Task-Based Scam',
    tag: 'ACTIVE WINDOW — 18M AGO',
    complaint: {
      walletAddress: '0x71C8395B2dE5b53eE2522Ac75f7823b184Ab6d1C',
      chain: 'ETH',
      fraudType: 'Task-Based Fraud',
      transactionDate: '2026-09-21T09:30:00Z',
      complaintRef: 'NCRP-2026-884192',
      amountEstimated: '4.85 ETH (~$14,200 USD)',
      victimNotes: 'Victim lured into Telegram VIP Task Group. Sent funds to scammer staging wallet under promise of commission release.'
    },
    result: {
      traceId: 'TRC-2026-884192-A',
      timestamp: '2026-09-21T10:48:12Z',
      complaint: {
        walletAddress: '0x71C8395B2dE5b53eE2522Ac75f7823b184Ab6d1C',
        chain: 'ETH',
        fraudType: 'Task-Based Fraud',
        transactionDate: '2026-09-21T09:30:00Z',
        complaintRef: 'NCRP-2026-884192',
        amountEstimated: '4.85 ETH (~$14,200 USD)'
      },
      topCandidates: [
        {
          name: 'Binance',
          confidenceScore: 94.2,
          hopsCount: 2,
          riskLabel: 'Moderate',
          depositAddress: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
          clusterType: 'Direct Hot-Deposit Cluster #BN-04',
          vaspJurisdiction: 'Cayman Islands / Global VASP',
          leiOrLicence: 'VASP-REG-KY-8812',
          heuristics: {
            hopsAnalysis: '2 graph hops identified. Source mule wallet forwarded to an intermediate liquidity sweeper before final deposit.',
            timingCorrelation: 'Sweep occurred within 11 minutes of victim transfer; aligns with known syndicate automated forwarding bots.',
            clusterBehavior: 'Target address matches Binance MainNet sweep deposit schema with >12,000 recorded internal credit sweeps.',
            depositPattern: 'Single-input aggregation matching standard exchange user deposit contracts.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.binance.com/en/law-enforcement',
            recommendedOrderType: 'Section 91 CrPC / Urgent Mutual Assistance Preservation Request',
            statutoryReference: 'NCRP-API Directive 2024-C / FATF Recommendation 16 (Travel Rule)'
          }
        },
        {
          name: 'Bybit',
          confidenceScore: 78.6,
          hopsCount: 3,
          riskLabel: 'Low',
          depositAddress: '0x1062a747393198f70F71ec65A582423DB7E5Ab36',
          clusterType: 'Secondary Forwarding Cluster #BY-11',
          vaspJurisdiction: 'UAE (VARA Licensed)',
          leiOrLicence: 'VASP-VARA-2023-019',
          heuristics: {
            hopsAnalysis: '3 graph hops with branch divergence at Hop 2. 1.2 ETH diverted to a secondary OTC desk proxy.',
            timingCorrelation: 'Transfer delayed by 45 minutes; potential cold-storage pass-through.',
            clusterBehavior: 'Lower volume deposit point with irregular sweep cycles.',
            depositPattern: 'Split-output peeling sequence.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.bybit.com/en/law-enforcement',
            recommendedOrderType: 'Emergency Account Freeze Notice',
            statutoryReference: 'Section 102 CrPC Preservation Mandate'
          }
        },
        {
          name: 'OKX',
          confidenceScore: 61.4,
          hopsCount: 3,
          riskLabel: 'Low',
          depositAddress: '0xa7efae728d2936e78bda97dc267687568dd593f3',
          clusterType: 'Tertiary Transit Cluster #OK-09',
          vaspJurisdiction: 'Seychelles / Global',
          leiOrLicence: 'VASP-SC-9901',
          heuristics: {
            hopsAnalysis: '3 hops through a high-fanout intermediate contract.',
            timingCorrelation: 'Loose time-correlation (>2 hours delay).',
            clusterBehavior: 'Low confidence address tag overlap.',
            depositPattern: 'Indirect dust consolidation.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.okx.com/compliance/law-enforcement',
            recommendedOrderType: 'Information Preservation Notice',
            statutoryReference: 'Intermediary Guidelines Rule 3(1)(d)'
          }
        }
      ],
      graph: {
        nodes: [
          { id: 'n1', label: 'Victim Wallet', type: 'victim', address: '0x53d2...8a91', amount: '-4.85 ETH', x: 70, y: 160 },
          { id: 'n2', label: 'Scam Ingestion Mule', type: 'scam_root', address: '0x71C8...6d1C', amount: '4.85 ETH', tag: 'Reported Scam', x: 250, y: 160 },
          { id: 'n3', label: 'Sweeper Transit Hop', type: 'mule_hop', address: '0x88e1...3b21', amount: '4.78 ETH', tag: 'Automated Bot', x: 440, y: 110 },
          { id: 'n4', label: 'Secondary Divergence', type: 'mule_hop', address: '0x19a0...7c84', amount: '0.07 ETH', tag: 'Gas Reserve', x: 440, y: 230 },
          { id: 'n5', label: 'Binance User Deposit', type: 'deposit_cluster', address: '0x3f5C...f0bE', amount: '4.75 ETH', tag: 'Target Account', x: 650, y: 110 },
          { id: 'n6', label: 'VASP: Binance Hot Wallet', type: 'exchange', address: 'Binance Hot Wallet 14', amount: 'Aggregated', tag: 'ATTRIBUTED VASP', x: 860, y: 110 }
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', amount: '4.85 ETH', txHash: '0x9fa1e827...41b0', timestamp: '09:30:12 UTC', flag: 'direct' },
          { id: 'e2', source: 'n2', target: 'n3', amount: '4.78 ETH', txHash: '0x4ca8201b...77f9', timestamp: '09:37:45 UTC', flag: 'peeling_chain' },
          { id: 'e3', source: 'n2', target: 'n4', amount: '0.07 ETH', txHash: '0x12bb9930...00a1', timestamp: '09:38:00 UTC', flag: 'peeling_chain' },
          { id: 'e4', source: 'n3', target: 'n5', amount: '4.75 ETH', txHash: '0x88c9103e...e561', timestamp: '09:41:22 UTC', flag: 'direct' },
          { id: 'e5', source: 'n5', target: 'n6', amount: 'Internal Sweep', txHash: '0xd4018388...19ae', timestamp: '10:14:00 UTC', flag: 'consolidated' }
        ]
      },
      caseRisk: 'HIGH',
      launderingRisk: {
        detected: false,
        type: 'Peeling Chain (Non-Mixer)',
        description: 'Standard fast-mule forwarding without privacy protocol obfuscation. Directly traceable on-chain.',
        warningLevel: 'NONE'
      },
      urgency: {
        status: 'IMMEDIATE_ACTION',
        lastMovementText: '18 minutes ago',
        lastMovementMinutesAgo: 18,
        freezeRecommendation: 'Funds likely still queued in exchange internal sweep pool. Recommend immediate automated preservation order to Binance LE desk within the next 42 minutes.',
        urgencyLevel: 'CRITICAL'
      }
    }
  },
  {
    id: 'preset-investment-pigbutchering',
    label: 'Pig Butchering Investment Scam',
    tag: 'MIXER / TUMBLER DETECTED',
    complaint: {
      walletAddress: 'bc1q9x7h2q6p8v3s4k9m0n1t2w3e4r5t6y7u8i9o0p',
      chain: 'BTC',
      fraudType: 'Investment Scam',
      transactionDate: '2026-09-21T08:15:00Z',
      complaintRef: 'NCRP-2026-910403',
      amountEstimated: '1.42 BTC (~$92,500 USD)',
      victimNotes: 'Victim met fraudster on matrimonial portal; convinced to invest in bogus algorithmic crypto arbitrage platform.'
    },
    result: {
      traceId: 'TRC-2026-910403-B',
      timestamp: '2026-09-21T10:49:01Z',
      complaint: {
        walletAddress: 'bc1q9x7h2q6p8v3s4k9m0n1t2w3e4r5t6y7u8i9o0p',
        chain: 'BTC',
        fraudType: 'Investment Scam',
        transactionDate: '2026-09-21T08:15:00Z',
        complaintRef: 'NCRP-2026-910403',
        amountEstimated: '1.42 BTC (~$92,500 USD)'
      },
      topCandidates: [
        {
          name: 'OKX',
          confidenceScore: 88.7,
          hopsCount: 3,
          riskLabel: 'Elevated',
          depositAddress: '1P5ZEDWTKTFGxQjZphgWPQUpe554WKDfHQ',
          clusterType: 'Mixer-Adjacent VASP Deposit Cluster',
          vaspJurisdiction: 'Seychelles / Malta EU Desk',
          leiOrLicence: 'VASP-OKX-9011-INTL',
          heuristics: {
            hopsAnalysis: '3 graph hops with intentional CoinJoin / Wasabi privacy pool interleaving to break transaction graph lineage.',
            timingCorrelation: 'Unmixed outputs demixed via common change-address heuristic and matched to OKX deposit timestamp within 14 min window.',
            clusterBehavior: 'Target address previously flagged in 7 other NCRP cyber cell complaints associated with Southeast Asian scam syndicates.',
            depositPattern: 'Post-mix consolidated deposit matching known OTC broker account.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.okx.com/compliance/law-enforcement',
            recommendedOrderType: 'Emergency Notice Under PMLA 2002 / CrPC 102',
            statutoryReference: 'FATF Virtual Asset Red Flag Indicators for Obfuscated Mixers'
          }
        },
        {
          name: 'Kraken',
          confidenceScore: 71.3,
          hopsCount: 4,
          riskLabel: 'Moderate',
          depositAddress: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
          clusterType: 'Secondary OTC Desk Proxy',
          vaspJurisdiction: 'United States / EU (FinCEN MSB)',
          leiOrLicence: 'MSB-31000156942',
          heuristics: {
            hopsAnalysis: '4 hops along an alternate branch unmixed output.',
            timingCorrelation: 'Movement spaced over 90 minutes.',
            clusterBehavior: 'Institutional broker account cluster.',
            depositPattern: 'Batch transaction receipt.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.kraken.com/en-us/legal/law-enforcement',
            recommendedOrderType: 'Formal 18 U.S.C. 2703(f) Preservation Request',
            statutoryReference: 'International Mutual Legal Assistance Protocol'
          }
        },
        {
          name: 'HTX (Huobi)',
          confidenceScore: 54.1,
          hopsCount: 4,
          riskLabel: 'Elevated',
          depositAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          clusterType: 'Loose Cluster Transit',
          vaspJurisdiction: 'Seychelles',
          leiOrLicence: 'HTX-GLOBAL-VASP',
          heuristics: {
            hopsAnalysis: 'Multiple hop fanout through secondary laundering nodes.',
            timingCorrelation: 'Weak temporal correlation with victim transfer.',
            clusterBehavior: 'High churn wallet with unconfirmed exchange attribution.',
            depositPattern: 'High fragmentation peeling.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.htx.com/en-us/support/law-enforcement',
            recommendedOrderType: 'Inquiry and Account Holding Notice',
            statutoryReference: 'Cyber Crime Investigation Protocol standard'
          }
        }
      ],
      graph: {
        nodes: [
          { id: 'n1', label: 'Victim Wallet', type: 'victim', address: 'bc1q9x...7u8i', amount: '-1.42 BTC', x: 70, y: 160 },
          { id: 'n2', label: 'Investment Portal Mule', type: 'scam_root', address: 'bc1qp0...8v3s', amount: '1.42 BTC', tag: 'Fake Platform', x: 250, y: 160 },
          { id: 'n3', label: 'Mixer / CoinJoin Pool', type: 'mixer', address: 'Wasabi CoinJoin Pool', amount: '1.39 BTC', tag: 'OBFUSCATION HOP', x: 450, y: 160 },
          { id: 'n4', label: 'Demixed Output Mule', type: 'mule_hop', address: '1Boat...6Q3d', amount: '1.18 BTC', tag: 'De-anonymized', x: 650, y: 110 },
          { id: 'n5', label: 'Change Remainder', type: 'mule_hop', address: 'bc1qa9...3m2p', amount: '0.21 BTC', tag: 'Syndicate Gas', x: 650, y: 230 },
          { id: 'n6', label: 'VASP: OKX Deposit', type: 'exchange', address: 'OKX Deposit 1P5ZED...', amount: '1.18 BTC', tag: 'ATTRIBUTED VASP', x: 860, y: 110 }
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', amount: '1.42 BTC', txHash: 'f4184fc5...98e2', timestamp: '08:15:10 UTC', flag: 'direct' },
          { id: 'e2', source: 'n2', target: 'n3', amount: '1.42 BTC', txHash: '8b7d12a9...11c4', timestamp: '08:29:40 UTC', flag: 'mixer_hop' },
          { id: 'e3', source: 'n3', target: 'n4', amount: '1.18 BTC', txHash: '3a10e821...7201', timestamp: '09:05:12 UTC', flag: 'peeling_chain' },
          { id: 'e4', source: 'n3', target: 'n5', amount: '0.21 BTC', txHash: '99e41b7a...55f2', timestamp: '09:05:12 UTC', flag: 'peeling_chain' },
          { id: 'e5', source: 'n4', target: 'n6', amount: '1.18 BTC', txHash: '0c541298...a839', timestamp: '09:42:30 UTC', flag: 'direct' }
        ]
      },
      caseRisk: 'HIGH',
      launderingRisk: {
        detected: true,
        type: 'CoinJoin / Tumbler Obfuscation Layer',
        description: 'Active mixer signature detected at Hop 2. Criminal syndicate attempted transaction graph breakage before depositing into OKX.',
        warningLevel: 'CRITICAL',
        tumblerOrMixerName: 'Wasabi CoinJoin Privacy Pool #BTC-CJ-41'
      },
      urgency: {
        status: 'IMMEDIATE_ACTION',
        lastMovementText: '34 minutes ago',
        lastMovementMinutesAgo: 34,
        freezeRecommendation: 'Post-mixer deposit confirmed at OKX within the last hour. Immediate VASP preservation request recommended to prevent fiat P2P off-ramping.',
        urgencyLevel: 'CRITICAL'
      }
    }
  },
  {
    id: 'preset-ransomware',
    label: 'Ransomware Extortion',
    tag: 'DIRECT 1-HOP VASP DEPOSIT',
    complaint: {
      walletAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      chain: 'BTC',
      fraudType: 'Ransomware',
      transactionDate: '2026-09-21T07:10:00Z',
      complaintRef: 'NCRP-2026-731950',
      amountEstimated: '3.10 BTC (~$202,000 USD)',
      victimNotes: 'Hospital network encrypted by ransomware actors. Decryption key demanded to specified BTC address.'
    },
    result: {
      traceId: 'TRC-2026-731950-C',
      timestamp: '2026-09-21T10:45:00Z',
      complaint: {
        walletAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        chain: 'BTC',
        fraudType: 'Ransomware',
        transactionDate: '2026-09-21T07:10:00Z',
        complaintRef: 'NCRP-2026-731950',
        amountEstimated: '3.10 BTC (~$202,000 USD)'
      },
      topCandidates: [
        {
          name: 'Kraken',
          confidenceScore: 96.8,
          hopsCount: 1,
          riskLabel: 'Low',
          depositAddress: '37kR74Z6tUuDk1Q7k7Xw9yT1v8H1e4D2s1',
          clusterType: 'Direct Institutional Hot Wallet Cluster',
          vaspJurisdiction: 'United States (FinCEN Licensed)',
          leiOrLicence: 'MSB-KRAKEN-8831',
          heuristics: {
            hopsAnalysis: 'Direct 1-hop deposit without intermediate money mule routing. Inexperienced perpetrator or rogue affiliate error.',
            timingCorrelation: 'Immediate transfer to Kraken cluster within 4 minutes of extortion payment broadcast.',
            clusterBehavior: 'Address is directly tied to Kraken primary sweep script cluster.',
            depositPattern: 'Standard direct user account deposit with unique memo index.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.kraken.com/en-us/legal/law-enforcement',
            recommendedOrderType: 'Emergency LE Freeze (Ransomware Critical Infrastructure)',
            statutoryReference: 'Interpol Red Notice Protocol / US FinCEN Advisory'
          }
        },
        {
          name: 'Coinbase',
          confidenceScore: 68.2,
          hopsCount: 2,
          riskLabel: 'Low',
          depositAddress: '3Cbq7aT1v9H2e5D1s4k8m1n0t3w2e1r4t5',
          clusterType: 'Cold Sweep Cluster',
          vaspJurisdiction: 'United States',
          leiOrLicence: 'CB-US-00912',
          heuristics: {
            hopsAnalysis: 'Secondary hop diversion detected.',
            timingCorrelation: 'Over 180 min lag from primary transaction.',
            clusterBehavior: 'Institutional custody cold storage.',
            depositPattern: 'Multisig threshold pattern.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.coinbase.com/legal/law-enforcement',
            recommendedOrderType: 'Preservation Letter 18 USC 2703(f)',
            statutoryReference: 'DOJ Digital Asset Enforcement Framework'
          }
        },
        {
          name: 'Bitfinex',
          confidenceScore: 49.5,
          hopsCount: 2,
          riskLabel: 'Low',
          depositAddress: '1N5ZEDWTKTFGxQjZphgWPQUpe554WKDfAB',
          clusterType: 'Legacy Hot Wallet',
          vaspJurisdiction: 'British Virgin Islands',
          leiOrLicence: 'BFX-INT-449',
          heuristics: {
            hopsAnalysis: 'Divergent split path with minimal dust.',
            timingCorrelation: 'Weak correlation.',
            clusterBehavior: 'General trading deposit.',
            depositPattern: 'Standard P2PKH.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.bitfinex.com/compliance',
            recommendedOrderType: 'Asset Freeze Directive',
            statutoryReference: 'BVI Financial Services Commission Act'
          }
        }
      ],
      graph: {
        nodes: [
          { id: 'n1', label: 'Victim Infrastructure', type: 'victim', address: 'bc1q9v...2k8m', amount: '-3.10 BTC', x: 100, y: 160 },
          { id: 'n2', label: 'Ransomware Extortion Address', type: 'scam_root', address: 'bc1qar...5mdq', amount: '3.10 BTC', tag: 'Direct Extortion', x: 380, y: 160 },
          { id: 'n3', label: 'VASP: Kraken Hot Deposit', type: 'exchange', address: 'Kraken Cluster 37kR74...', amount: '3.098 BTC', tag: 'ATTRIBUTED VASP', x: 750, y: 160 }
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', amount: '3.10 BTC', txHash: '2b918a17...490e', timestamp: '07:10:00 UTC', flag: 'direct' },
          { id: 'e2', source: 'n2', target: 'n3', amount: '3.098 BTC', txHash: 'd8471900...bb12', timestamp: '07:14:22 UTC', flag: 'direct' }
        ]
      },
      caseRisk: 'HIGH',
      launderingRisk: {
        detected: false,
        type: 'Zero Obfuscation / Direct Infiltration',
        description: 'No mixer or tumbler employed. Single direct hop to Tier-1 regulated VASP.',
        warningLevel: 'NONE'
      },
      urgency: {
        status: 'ACTIVE_WINDOW',
        lastMovementText: '3.5 hours ago',
        lastMovementMinutesAgo: 210,
        freezeRecommendation: 'Deposit was confirmed 3.5 hours ago. Perpetrator likely under 24-hour initial withdrawal hold on Tier-1 KYC account. Issue freeze request immediately.',
        urgencyLevel: 'HIGH'
      }
    }
  },
  {
    id: 'preset-sextortion',
    label: 'Sextortion / Blackmail Scheme',
    tag: 'HISTORIC COLD CASE — 3 DAYS AGO',
    complaint: {
      walletAddress: 'TYDzsYUE3bmaipmxsioCWfWm7QUaPdLboF',
      chain: 'TRON',
      fraudType: 'Sextortion',
      transactionDate: '2026-09-18T14:00:00Z',
      complaintRef: 'NCRP-2026-665219',
      amountEstimated: '1,800 USDT',
      victimNotes: 'Victim extorted via compromised webcam threat video. Demanded payment in USDT TRC20.'
    },
    result: {
      traceId: 'TRC-2026-665219-D',
      timestamp: '2026-09-21T10:40:00Z',
      complaint: {
        walletAddress: 'TYDzsYUE3bmaipmxsioCWfWm7QUaPdLboF',
        chain: 'TRON',
        fraudType: 'Sextortion',
        transactionDate: '2026-09-18T14:00:00Z',
        complaintRef: 'NCRP-2026-665219',
        amountEstimated: '1,800 USDT'
      },
      topCandidates: [
        {
          name: 'HTX (Huobi)',
          confidenceScore: 82.4,
          hopsCount: 4,
          riskLabel: 'Moderate',
          depositAddress: 'TPL6AnFaYrbtiAVFaPr46A8M82s4w2c9J1',
          clusterType: 'TRC-20 Fast Aggregation Cluster',
          vaspJurisdiction: 'Seychelles / Hong Kong',
          leiOrLicence: 'HTX-VASP-TRON-44',
          heuristics: {
            hopsAnalysis: '4 hops across multiple TRON energy-delegated intermediary wallets before sweep to HTX deposit pool.',
            timingCorrelation: 'Multi-day staging pattern; funds were held in mule 2 for 48 hours before sweep.',
            clusterBehavior: 'TRON address matches known P2P merchant deposit hub.',
            depositPattern: 'Energy-saving TRC-20 sweep contract.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.htx.com/en-us/support/law-enforcement',
            recommendedOrderType: 'KYC & Account Disclosure Request (Section 91 CrPC)',
            statutoryReference: 'NCRP International Cyber Scam Taskforce standard'
          }
        },
        {
          name: 'Binance',
          confidenceScore: 64.1,
          hopsCount: 5,
          riskLabel: 'Low',
          depositAddress: 'TMuA6YqfCeX8EhbfYEg5y7S4D11K2v8W1',
          clusterType: 'TRC-20 Transit',
          vaspJurisdiction: 'Global',
          leiOrLicence: 'VASP-BN-TRON',
          heuristics: {
            hopsAnalysis: '5 hops through secondary payment gateway.',
            timingCorrelation: 'Low timing alignment.',
            clusterBehavior: 'General merchant pool.',
            depositPattern: 'Low value pass-through.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.binance.com/en/law-enforcement',
            recommendedOrderType: 'Account Flagging Request',
            statutoryReference: 'FATF Virtual Asset Red Flag Indicators'
          }
        },
        {
          name: 'KuCoin',
          confidenceScore: 51.0,
          hopsCount: 4,
          riskLabel: 'Low',
          depositAddress: 'TXz7aK9Q2v1W8E4D5s1k8m0n3t2w1e4R7',
          clusterType: 'OTC Gateway',
          vaspJurisdiction: 'Seychelles',
          leiOrLicence: 'KC-VASP-091',
          heuristics: {
            hopsAnalysis: 'Fragmented split.',
            timingCorrelation: 'Dispersed over 72 hours.',
            clusterBehavior: 'High transaction count deposit.',
            depositPattern: 'Bulk batch sweep.'
          },
          freezeProtocol: {
            leDeskUrl: 'https://www.kucoin.com/law-enforcement',
            recommendedOrderType: 'Preservation Notice',
            statutoryReference: 'Cyber Police Standard Operating Procedure'
          }
        }
      ],
      graph: {
        nodes: [
          { id: 'n1', label: 'Victim Wallet', type: 'victim', address: 'TKv9...41aB', amount: '-1,800 USDT', x: 60, y: 160 },
          { id: 'n2', label: 'Blackmail Ingestion', type: 'scam_root', address: 'TYDz...LboF', amount: '1,800 USDT', tag: 'Reported Wallet', x: 230, y: 160 },
          { id: 'n3', label: 'Mule Stage 1', type: 'mule_hop', address: 'TN8x...91mK', amount: '1,795 USDT', tag: 'Hop 1', x: 410, y: 110 },
          { id: 'n4', label: 'Mule Stage 2', type: 'mule_hop', address: 'TR1a...33vP', amount: '1,790 USDT', tag: 'Hop 2 (48h Staging)', x: 580, y: 110 },
          { id: 'n5', label: 'P2P Aggregator', type: 'deposit_cluster', address: 'TPL6...c9J1', amount: '1,780 USDT', tag: 'OTC Pool', x: 740, y: 160 },
          { id: 'n6', label: 'VASP: HTX (Huobi)', type: 'exchange', address: 'HTX TRC20 Hot Wallet', amount: 'Aggregated', tag: 'ATTRIBUTED VASP', x: 900, y: 160 }
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', amount: '1,800 USDT', txHash: '5e918b...410f', timestamp: 'Sep 18, 14:00', flag: 'direct' },
          { id: 'e2', source: 'n2', target: 'n3', amount: '1,795 USDT', txHash: '1c447a...88e1', timestamp: 'Sep 18, 14:22', flag: 'peeling_chain' },
          { id: 'e3', source: 'n3', target: 'n4', amount: '1,790 USDT', txHash: '9a018f...21b0', timestamp: 'Sep 19, 10:15', flag: 'peeling_chain' },
          { id: 'e4', source: 'n4', target: 'n5', amount: '1,780 USDT', txHash: '3d8819...99a4', timestamp: 'Sep 21, 04:30', flag: 'direct' },
          { id: 'e5', source: 'n5', target: 'n6', amount: 'Sweep', txHash: '8b7712...01c4', timestamp: 'Sep 21, 05:00', flag: 'consolidated' }
        ]
      },
      caseRisk: 'MODERATE',
      launderingRisk: {
        detected: false,
        type: 'Mule Multi-Staging Chain',
        description: 'Multi-day staging across low-balance TRC-20 addresses before consolidation into exchange OTC merchant deposit.',
        warningLevel: 'NONE'
      },
      urgency: {
        status: 'HISTORIC_COLD',
        lastMovementText: '3 days ago',
        lastMovementMinutesAgo: 4320,
        freezeRecommendation: 'Funds likely off-ramped into P2P INR/fiat accounts. Recommend shifting focus from crypto freeze to KYC account identification subpoena under Section 91 CrPC to recover beneficiary bank accounts.',
        urgencyLevel: 'LOW'
      }
    }
  }
];

export const HISTORICAL_CASES: HistoricalCase[] = [
  {
    id: 'CASE-2026-9912',
    complaintRef: 'NCRP-2026-884192',
    fraudType: 'Task-Based Fraud',
    walletAddress: '0x71C8395B2dE5b53eE2522Ac75f7823b184Ab6d1C',
    matchedExchange: 'Binance',
    confidenceScore: 94.2,
    caseRisk: 'HIGH',
    urgency: '18m ago',
    date: '2026-09-21',
    status: 'FROZEN'
  },
  {
    id: 'CASE-2026-9911',
    complaintRef: 'NCRP-2026-910403',
    fraudType: 'Investment Scam',
    walletAddress: 'bc1q9x7h2q6p8v3s4k9m0n1t2w3e4r5t6y7u8i9o0p',
    matchedExchange: 'OKX',
    confidenceScore: 88.7,
    caseRisk: 'HIGH',
    urgency: '34m ago',
    date: '2026-09-21',
    status: 'UNDER_REVIEW'
  },
  {
    id: 'CASE-2026-9910',
    complaintRef: 'NCRP-2026-731950',
    fraudType: 'Ransomware',
    walletAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    matchedExchange: 'Kraken',
    confidenceScore: 96.8,
    caseRisk: 'HIGH',
    urgency: '3.5h ago',
    date: '2026-09-21',
    status: 'FROZEN'
  },
  {
    id: 'CASE-2026-9909',
    complaintRef: 'NCRP-2026-665219',
    fraudType: 'Sextortion',
    walletAddress: 'TYDzsYUE3bmaipmxsioCWfWm7QUaPdLboF',
    matchedExchange: 'HTX (Huobi)',
    confidenceScore: 82.4,
    caseRisk: 'MODERATE',
    urgency: '3d ago',
    date: '2026-09-18',
    status: 'COMPLETED'
  },
  {
    id: 'CASE-2026-9908',
    complaintRef: 'NCRP-2026-554102',
    fraudType: 'Phishing',
    walletAddress: '0x14dC79964da2c08b23698B3D3cc7Ca32193d9955',
    matchedExchange: 'Coinbase',
    confidenceScore: 91.0,
    caseRisk: 'HIGH',
    urgency: '1d ago',
    date: '2026-09-17',
    status: 'FLAGGED'
  },
  {
    id: 'CASE-2026-9907',
    complaintRef: 'NCRP-2026-441920',
    fraudType: 'Darknet Transaction',
    walletAddress: 'bc1q0g4w97y5e8n2m3k4l5p6o7i8u9y0t1r2e3w4q5',
    matchedExchange: 'KuCoin',
    confidenceScore: 76.5,
    caseRisk: 'HIGH',
    urgency: '5d ago',
    date: '2026-09-15',
    status: 'COMPLETED'
  }
];

export function generateTraceForCustomAddress(complaint: ComplaintData): TraceResult {
  const shortAddr = complaint.walletAddress.length > 10 
    ? `${complaint.walletAddress.substring(0, 6)}...${complaint.walletAddress.substring(complaint.walletAddress.length - 4)}` 
    : complaint.walletAddress;

  const isBtc = complaint.chain === 'BTC' || complaint.walletAddress.startsWith('1') || complaint.walletAddress.startsWith('3') || complaint.walletAddress.startsWith('bc1');
  const isTron = complaint.chain === 'TRON' || complaint.walletAddress.startsWith('T');
  const isHighRisk = complaint.fraudType === 'Ransomware' || complaint.fraudType === 'Darknet Transaction' || complaint.fraudType === 'Investment Scam';

  const exchangePool = isBtc 
    ? ['Binance', 'OKX', 'Kraken']
    : isTron 
    ? ['HTX (Huobi)', 'Binance', 'Bybit']
    : ['Binance', 'Coinbase', 'Bybit'];

  const primaryVasp = exchangePool[0];
  const secondaryVasp = exchangePool[1];
  const tertiaryVasp = exchangePool[2];

  const primaryConfidence = isHighRisk ? 93.4 : 89.1;
  const launderingDetected = complaint.fraudType === 'Darknet Transaction' || complaint.fraudType === 'Investment Scam';

  return {
    traceId: `TRC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 899 + 100)}`,
    timestamp: new Date().toISOString(),
    complaint,
    topCandidates: [
      {
        name: primaryVasp,
        confidenceScore: primaryConfidence,
        hopsCount: isHighRisk ? 2 : 3,
        riskLabel: isHighRisk ? 'Elevated' : 'Moderate',
        depositAddress: isBtc ? '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy' : '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
        clusterType: `Primary Hot Deposit Cluster #${primaryVasp.toUpperCase()}-01`,
        vaspJurisdiction: 'Regulated VASP Entity (Global)',
        leiOrLicence: `VASP-REG-${Math.floor(Math.random() * 8999 + 1000)}`,
        heuristics: {
          hopsAnalysis: `${isHighRisk ? '2' : '3'} graph hops mapped from victim reported address to high-density sweep wallet.`,
          timingCorrelation: 'Rapid sweep execution pattern matches automated syndicate deposit infrastructure.',
          clusterBehavior: 'Target wallet cluster exhibits >5,000 co-spend inputs typical of centralized exchange sweep engines.',
          depositPattern: 'Direct consolidation into hot wallet architecture.'
        },
        freezeProtocol: {
          leDeskUrl: `https://${primaryVasp.toLowerCase().replace(/[^a-z]/g, '')}.com/law-enforcement`,
          recommendedOrderType: 'Section 91 CrPC Preservation Notice / Emergency Hold',
          statutoryReference: 'NCRP Intermediary Trace Mandate'
        }
      },
      {
        name: secondaryVasp,
        confidenceScore: 74.5,
        hopsCount: 3,
        riskLabel: 'Low',
        depositAddress: isBtc ? 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' : '0x1062a747393198f70F71ec65A582423DB7E5Ab36',
        clusterType: 'Secondary OTC Desk Proxy',
        vaspJurisdiction: 'International Custodian',
        leiOrLicence: 'VASP-INTL-2024',
        heuristics: {
          hopsAnalysis: 'Branch divergence detected at Hop 2 with partial value splitting.',
          timingCorrelation: 'Moderate time delay between forwarding hops.',
          clusterBehavior: 'Medium cluster density with secondary trading tags.',
          depositPattern: 'Peeling chain residual receipt.'
        },
        freezeProtocol: {
          leDeskUrl: `https://${secondaryVasp.toLowerCase().replace(/[^a-z]/g, '')}.com/law-enforcement`,
          recommendedOrderType: 'Account Freeze Notice',
          statutoryReference: 'FATF Recommendation 16'
        }
      },
      {
        name: tertiaryVasp,
        confidenceScore: 56.2,
        hopsCount: 4,
        riskLabel: 'Low',
        depositAddress: isBtc ? '1P5ZEDWTKTFGxQjZphgWPQUpe554WKDfHQ' : '0xa7efae728d2936e78bda97dc267687568dd593f3',
        clusterType: 'Tertiary Transit Gateway',
        vaspJurisdiction: 'Offshore Entity',
        leiOrLicence: 'VASP-OFFSHORE-09',
        heuristics: {
          hopsAnalysis: 'Extended hop chain with low confidence weight score.',
          timingCorrelation: 'Loose temporal association (>24h).',
          clusterBehavior: 'High churn unclassified wallet.',
          depositPattern: 'Multi-input aggregation.'
        },
        freezeProtocol: {
          leDeskUrl: `https://${tertiaryVasp.toLowerCase().replace(/[^a-z]/g, '')}.com/support`,
          recommendedOrderType: 'Information Preservation Notice',
          statutoryReference: 'Cyber Crime SOP standard'
        }
      }
    ],
    graph: {
      nodes: [
        { id: 'gn1', label: 'Victim Source', type: 'victim', address: 'Reported Origin', amount: complaint.amountEstimated || 'Reported Funds', x: 80, y: 160 },
        { id: 'gn2', label: 'Scam Ingestion Mule', type: 'scam_root', address: shortAddr, amount: 'Ingested', tag: 'Reported Node', x: 260, y: 160 },
        { id: 'gn3', label: launderingDetected ? 'Mixer / Privacy Hop' : 'Intermediate Mule #1', type: launderingDetected ? 'mixer' : 'mule_hop', address: '0x88e1...3b21', amount: 'Transit', tag: launderingDetected ? 'OBFUSCATION' : 'Transit Hop', x: 460, y: 120 },
        { id: 'gn4', label: 'Sweep Aggregator', type: 'deposit_cluster', address: '0x19a0...7c84', amount: 'Consolidated', tag: 'Deposit Proxy', x: 670, y: 120 },
        { id: 'gn5', label: `VASP: ${primaryVasp}`, type: 'exchange', address: `${primaryVasp} Sweep Cluster`, amount: 'Attributed', tag: 'ATTRIBUTED VASP', x: 880, y: 120 }
      ],
      edges: [
        { id: 'ge1', source: 'gn1', target: 'gn2', amount: 'Reported', txHash: '0x9fa1...41b0', timestamp: 'Trace Anchor', flag: 'direct' },
        { id: 'ge2', source: 'gn2', target: 'gn3', amount: 'Transit', txHash: '0x4ca8...77f9', timestamp: 'Hop 1', flag: launderingDetected ? 'mixer_hop' : 'peeling_chain' },
        { id: 'ge3', source: 'gn3', target: 'gn4', amount: 'Forwarded', txHash: '0x88c9...e561', timestamp: 'Hop 2', flag: 'peeling_chain' },
        { id: 'ge4', source: 'gn4', target: 'gn5', amount: 'Sweep Final', txHash: '0xd401...19ae', timestamp: 'Attribution Target', flag: 'consolidated' }
      ]
    },
    caseRisk: isHighRisk ? 'HIGH' : 'MODERATE',
    launderingRisk: {
      detected: launderingDetected,
      type: launderingDetected ? 'Automated Obfuscation Protocol' : 'Standard Peeling Chain',
      description: launderingDetected 
        ? 'High probability of mixer or tumbler hop identified in the second transaction tier.'
        : 'Direct peeling chain identified without specialized privacy protocols.',
      warningLevel: launderingDetected ? 'CRITICAL' : 'NONE',
      tumblerOrMixerName: launderingDetected ? 'Heuristic Mixer Cluster #MX-88' : undefined
    },
    urgency: {
      status: 'IMMEDIATE_ACTION',
      lastMovementText: '24 minutes ago',
      lastMovementMinutesAgo: 24,
      freezeRecommendation: `Target funds identified at ${primaryVasp} deposit pool within the active 60-minute freeze window. Immediate automated preservation dispatch recommended.`,
      urgencyLevel: 'CRITICAL'
    }
  };
}
