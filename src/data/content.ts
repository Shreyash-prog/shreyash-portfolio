/**
 * Single source of truth for all editable site content.
 * Edit names, copy, links, projects, and the tech graph here.
 */

export interface NavLink {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  href: string
}

export interface ExperienceItem {
  org: string
  sub?: string
  dates: string
  role: string
  description: string
}

export interface ProjectButton {
  label: string
  href: string
}

export interface Project {
  id: string
  title: string
  description: string
  chips: string[]
  buttons: ProjectButton[]
  /**
   * Lifecycle state. "upcoming" projects are in the design/architecture phase:
   * they render an architecture-preview placeholder and a single link button
   * (no live demo, reveal token, or screenshot lightbox).
   */
  status?: 'upcoming'
  /** Optional caption shown under the action buttons. */
  caption?: string
  /** Screenshot paths (under /public). Missing files are tolerated at runtime. */
  screenshots?: string[]
  /** Optional reveal-token control (e.g. a deliberately-public POC demo credential). */
  revealToken?: {
    value: string
    label: string
  }
}

export interface ResearchItem {
  id: string
  title: string
  description: string
  chips: string[]
  github: string
}

export interface AcademicResearchItem {
  title: string
  description: string
  /** The headline outcome figure, subtly accented in the UI (e.g. "30%"). */
  outcome: string
  advisor: string
  school: string
}

export interface TechNode {
  id: string
  category: TechCategory
}

export type TechCategory =
  | 'Languages'
  | 'AI / LLM'
  | 'ML'
  | 'Data & Platforms'
  | 'Cloud & Storage'
  | 'DevOps'

export interface TechEdge {
  source: string
  target: string
}

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

export const profile = {
  name: 'Shreyash Kalal',
  role: 'AI & Data Engineer',
  email: 'ssk241@scarletmail.rutgers.edu',
  github: 'https://github.com/Shreyash-prog',
  linkedin: 'https://www.linkedin.com/in/shreyash-k-a89823174/',
}

export const navLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#stack' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Research', href: '#research' },
  { label: 'Contact', href: '#contact' },
]

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const hero = {
  kicker: 'AI & DATA ENGINEER',
  name: 'Shreyash Kalal',
  // The accent phrase is highlighted in the Hero component.
  taglineBefore: 'I build ',
  taglineAccent: 'production AI systems',
  taglineAfter: ' and the large-scale data platforms beneath them.',
  subline:
    'From multi-agent platforms and RAG to modular, metadata-driven data infrastructure at scale. MS in Data Science, Rutgers. Currently a Senior Engineer at Capgemini (Cox Communications).',
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export const about = {
  paragraph:
    'An engineer working at the seam between AI/ML and data-platform engineering — equally at home designing agentic systems that generate and validate production SQL and building the ingestion and quality frameworks that move data reliably at scale. MS in Data Science, Rutgers.',
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export const experience: ExperienceItem[] = [
  {
    org: 'Capgemini',
    sub: 'Cox Communications',
    dates: '2022–Present',
    role: 'Senior Engineer (AI & Data)',
    description:
      'Production data and AI platforms for a major US telecom: modular, metadata-driven ingestion frameworks across tens of thousands of pipelines; multi-agent systems that generate, validate, and deploy warehouse transformation logic with human-in-the-loop review; and statistical data-quality and observability frameworks wired into automated alerting and remediation. In 2026, worked directly on the engineering integration behind the landmark Charter–Cox merger — the $34.5B combination that formed the largest broadband provider in the US.',
  },
  {
    org: 'Aurigo Software Technologies',
    dates: '2020–2022',
    role: 'Data Analyst → Senior Data Analyst',
    description:
      'Applied-ML across the sales and proposal lifecycle: NLP-driven RFP scoring with transformer embeddings, multi-label sentiment classification, and churn / lifetime-value / segmentation models — productionized with shared feature pipelines, batch scoring, and CRM/BI integration.',
  },
]

// ---------------------------------------------------------------------------
// Academic Research
// ---------------------------------------------------------------------------

export const academicResearch: AcademicResearchItem[] = [
  {
    title: 'Multi-Turn Context Retention in Language Models',
    description:
      'Examined multi-turn context retention in language modeling on Reddit conversation data, improving discourse coherence by 30% through hierarchical attention, dynamic memory networks, and adaptive context pruning.',
    outcome: '+30% discourse coherence',
    advisor: 'Dr. Jim Samuel',
    school: 'Edward J. Bloustein School of Planning and Public Policy, Rutgers University',
  },
  {
    title: 'Sparse Regularization for High-Dimensional Data',
    description:
      'Developed sparse regularization techniques using bridge and log-sum penalties on high-dimensional genomic datasets, achieving a 25% reduction in estimation error through ADMM-based optimization.',
    outcome: '−25% estimation error',
    advisor: 'Dr. Koulik Khamaru',
    school: 'School of Arts and Sciences, Rutgers University',
  },
]

// ---------------------------------------------------------------------------
// Projects — Tier 1: Novel Builds
// ---------------------------------------------------------------------------

export const projects: Project[] = [
  {
    id: 'ai-usage-scoring',
    title: 'ai-usage-scoring',
    description:
      "Scores how engineers use AI, not just what they ship. Architecturally a single FastAPI service running a two-pass pipeline: live deterministic heuristics over a WebSocket event stream, then a post-hoc LLM judge constrained to evidence-cited verdicts, with code execution offloaded to a sandboxed runner. The larger vision: turn 'how someone works with AI' into a measurable signal — for fairer technical interviews first, and coaching and self-review beyond that.",
    chips: ['FastAPI', 'WebSockets', 'SQLite', 'OpenAI', 'Anthropic', 'Judge0'],
    buttons: [
      {
        label: 'Live Demo — Candidate',
        href: 'https://ai-usage-scoring.fly.dev/candidate?candidate_name=Demo',
      },
      { label: 'Live Demo — Dashboard', href: 'https://ai-usage-scoring.fly.dev/dashboard' },
      { label: 'GitHub', href: 'https://github.com/Shreyash-prog/ai-usage-scoring' },
    ],
    caption:
      'Open candidate + dashboard side by side. Public demo on a shared free tier — a few seconds of cold-start; ~50 code-runs/day across all visitors.',
    screenshots: [
      '/images/projects/ai-usage-scoring/01-candidate.png',
      '/images/projects/ai-usage-scoring/02-dashboard.png',
      '/images/projects/ai-usage-scoring/03-scores.png',
    ],
  },
  {
    id: 'tidewater',
    title: 'tidewater',
    description:
      'A platform-hygiene framework for AWS. An event-driven, AWS-native design: CDK-provisioned Lambda detectors feed a policy engine, remediations run as snapshot-protected SSM runbooks, and a forecaster uses short-window regression to predict quota exhaustion — all behind a React dashboard. The roadmap extends detection beyond IAM and Lambda to the wider managed-service surface (MWAA, SNS, EventBridge), adds human-approval workflows, and hardens auth toward production SSO — growing a POC into a general platform-hygiene product.',
    chips: ['Python', 'AWS CDK', 'Lambda', 'SSM Automation', 'React', 'TypeScript'],
    buttons: [
      { label: 'Live Demo', href: 'https://d2o52kqdxzqimw.cloudfront.net' },
      { label: 'GitHub', href: 'https://github.com/Shreyash-prog/tidewater' },
    ],
    // NOTE: This token is a DELIBERATELY-PUBLIC POC demo credential — a read-only,
    // rotating access token for a sandboxed demo AWS account. It is intentionally
    // shipped in the public site, NOT an accidental secret leak. Safe for secret
    // scanners to ignore.
    revealToken: {
      value: 'HwdbqPW9T8HFIn1j6e0xr3H_wlmCOyu74PjhSEAEImw',
      label:
        'Read-only POC · live AWS account · paste the token when the dashboard prompts · token may rotate.',
    },
    screenshots: [
      '/images/projects/tidewater/01-findings.png',
      '/images/projects/tidewater/02-finding-detail.png',
      '/images/projects/tidewater/03-rules.png',
    ],
  },
  {
    id: 'team-ai-memory',
    title: 'team-ai-memory',
    description:
      "Shared, searchable AI memory for teams. An edge-first monorepo (React on Cloudflare Pages, Hono workers, Neon Postgres) distills each conversation into a structured representation — facts, open threads, rejected paths, constraints — via an LLM extraction step, made searchable with Postgres full-text search and a browser extension for capture and injection. It's heading toward true multi-tenant teams with auth and workspaces, cross-workspace search, content guardrails, and broader model coverage — the throughline being team context as a durable shared asset rather than ephemeral chat history.",
    chips: [
      'TypeScript',
      'Cloudflare Pages',
      'Cloudflare Workers (Hono)',
      'Neon Postgres',
      'Drizzle',
      'Claude Haiku',
      'WXT',
    ],
    buttons: [
      { label: 'Live Demo', href: 'https://team-ai-memory.pages.dev' },
      { label: 'GitHub', href: 'https://github.com/Shreyash-prog/team-ai-memory' },
    ],
    caption: 'M1 single-user preview on synthetic data.',
    screenshots: [
      '/images/projects/team-ai-memory/01-artifacts.png',
      '/images/projects/team-ai-memory/02-detail.png',
      '/images/projects/team-ai-memory/03-search.png',
    ],
  },
  {
    id: 'ai-native-developer-board',
    title: 'AI-Native Developer Board',
    status: 'upcoming',
    description:
      'A platform for directing AI coding agents like a team rather than pair-programming one session at a time. Work enters as tickets on a JIRA-style board; a durable loop controller (Temporal, one workflow per ticket) runs the develop → verify → iterate cycle while developers steer by comment. Its spine: a canonical Run domain kept separate from JIRA via one-way projections, an append-only event log as the source of truth (agent sessions are disposable), a deterministic Turn Assembler that classifies human feedback into precise directives, optimistic branch-per-ticket concurrency behind a serialized merge queue, and three ordered verification gates with grader anti-gaming. The vision: make AI-assisted development auditable, reproducible, and reviewable — humans directing and verifying rather than hand-writing every change.',
    chips: [
      'Temporal',
      'Event Sourcing',
      'Postgres',
      'S3',
      'JIRA',
      'LLM-as-Judge',
      'CI/CD',
      'Merge Queue',
    ],
    buttons: [
      {
        label: 'View Architecture',
        href: 'https://github.com/Shreyash-prog/ai-native-board',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Projects — Tier 2: Research & Concepts
// ---------------------------------------------------------------------------

export const research: ResearchItem[] = [
  {
    id: 'makemore',
    title: 'MakeMore',
    description:
      'A character-level language model on a ~1.1M-token Shakespeare corpus, built as a comparison of how different architectures capture sequence structure: bag-of-words and an MLP (order-blind), a bigram model (short-range only), an RNN (sequential but strained by long-range dependencies), and finally a Transformer with multi-head attention and GeLU that best captured Elizabethan syntax and style. The real subject was why attention wins — the failure modes of each predecessor at modeling temporal and long-range dependence.',
    chips: ['PyTorch', 'Transformers', 'Multi-Head Attention', 'RNN'],
    github: 'https://github.com/Shreyash-prog/MakeMore',
  },
  {
    id: 'vqvae',
    title: 'VQVAE',
    description:
      'An implementation of the Vector-Quantized VAE (van den Oord et al., Neural Discrete Representation Learning) applied across both images (CIFAR-10) and audio (LibriSpeech). The concepts explored: learning discrete latent representations via vector quantization, sidestepping the posterior collapse that afflicts continuous VAEs, and pairing those discrete codes with autoregressive priors — PixelCNN for images, WaveNet for audio.',
    chips: ['PyTorch', 'VQ-VAE', 'PixelCNN', 'WaveNet', 'CIFAR-10', 'LibriSpeech'],
    github: 'https://github.com/Shreyash-prog/VQVAE',
  },
  {
    id: 'non-convex-penalty-optimization',
    title: 'Non-Convex Penalty Optimization',
    description:
      'A study of the oracle property of non-convex sparsity penalties (SCAD and MCP) on logistic regression, alongside a comparison of optimizers — coordinate descent, proximal gradient, and stochastic descent. The aim: find a penalty/optimizer pairing that matches LARS-level performance on a convex-penalized objective — capturing the statistical benefits of non-convex penalties without losing optimization tractability.',
    chips: ['Logistic Regression', 'SCAD', 'MCP', 'Proximal Gradient', 'Coordinate Descent'],
    github: 'https://github.com/Shreyash-prog/Non-Convex-Penalty-Optimization',
  },
]

// ---------------------------------------------------------------------------
// Tech Stack constellation
// ---------------------------------------------------------------------------

export const techCategories: TechCategory[] = [
  'Languages',
  'AI / LLM',
  'ML',
  'Data & Platforms',
  'Cloud & Storage',
  'DevOps',
]

/** Cohesive tints from the cyan→indigo family plus two complementary hues. */
export const categoryColors: Record<TechCategory, string> = {
  Languages: '#22D3EE', // cyan
  'AI / LLM': '#6366F1', // indigo
  ML: '#818CF8', // soft indigo
  'Data & Platforms': '#2DD4BF', // teal (complementary)
  'Cloud & Storage': '#38BDF8', // sky
  DevOps: '#A78BFA', // violet (complementary)
}

export const techNodes: TechNode[] = [
  // Languages
  { id: 'Python', category: 'Languages' },
  { id: 'SQL', category: 'Languages' },
  { id: 'PL/SQL', category: 'Languages' },
  { id: 'Scala', category: 'Languages' },
  { id: 'TypeScript', category: 'Languages' },
  { id: 'Bash', category: 'Languages' },

  // AI / LLM
  { id: 'OpenAI', category: 'AI / LLM' },
  { id: 'Anthropic', category: 'AI / LLM' },
  { id: 'LangChain', category: 'AI / LLM' },
  { id: 'LlamaIndex', category: 'AI / LLM' },
  { id: 'RAG', category: 'AI / LLM' },
  { id: 'Embeddings', category: 'AI / LLM' },
  { id: 'Fine-Tuning (LoRA/PEFT)', category: 'AI / LLM' },
  { id: 'Pinecone', category: 'AI / LLM' },
  { id: 'Weaviate', category: 'AI / LLM' },
  { id: 'FAISS', category: 'AI / LLM' },
  { id: 'LangSmith', category: 'AI / LLM' },
  { id: 'RAGAS', category: 'AI / LLM' },

  // ML
  { id: 'PyTorch', category: 'ML' },
  { id: 'TensorFlow', category: 'ML' },
  { id: 'scikit-learn', category: 'ML' },
  { id: 'Transformers', category: 'ML' },
  { id: 'XGBoost', category: 'ML' },
  { id: 'MLflow', category: 'ML' },
  { id: 'Weights & Biases', category: 'ML' },

  // Data & Platforms
  { id: 'Spark/PySpark', category: 'Data & Platforms' },
  { id: 'dbt', category: 'Data & Platforms' },
  { id: 'Kafka', category: 'Data & Platforms' },
  { id: 'Flink', category: 'Data & Platforms' },
  { id: 'Kinesis', category: 'Data & Platforms' },
  { id: 'Airflow', category: 'Data & Platforms' },
  { id: 'Snowflake', category: 'Data & Platforms' },
  { id: 'Databricks', category: 'Data & Platforms' },
  { id: 'Hive/Hadoop', category: 'Data & Platforms' },
  { id: 'Informatica', category: 'Data & Platforms' },
  { id: 'CDC/ELT', category: 'Data & Platforms' },

  // Cloud & Storage
  { id: 'AWS', category: 'Cloud & Storage' },
  { id: 'GCP', category: 'Cloud & Storage' },
  { id: 'Azure', category: 'Cloud & Storage' },
  { id: 'Redshift', category: 'Cloud & Storage' },
  { id: 'BigQuery', category: 'Cloud & Storage' },
  { id: 'PostgreSQL', category: 'Cloud & Storage' },
  { id: 'Oracle', category: 'Cloud & Storage' },
  { id: 'MongoDB', category: 'Cloud & Storage' },
  { id: 'Redis', category: 'Cloud & Storage' },
  { id: 'Delta Lake', category: 'Cloud & Storage' },
  { id: 'Iceberg', category: 'Cloud & Storage' },
  { id: 'Parquet/Avro/ORC', category: 'Cloud & Storage' },

  // DevOps
  { id: 'Docker', category: 'DevOps' },
  { id: 'Kubernetes', category: 'DevOps' },
  { id: 'Terraform', category: 'DevOps' },
  { id: 'CI/CD', category: 'DevOps' },
  { id: 'Datadog', category: 'DevOps' },
  { id: 'Grafana', category: 'DevOps' },
  { id: 'OpenTelemetry', category: 'DevOps' },
]

/** Edges connect technologies genuinely used together. */
export const techEdges: TechEdge[] = [
  // Languages internal / bridges
  { source: 'Python', target: 'SQL' },
  { source: 'SQL', target: 'PL/SQL' },
  { source: 'Scala', target: 'Spark/PySpark' },
  { source: 'Python', target: 'Spark/PySpark' },
  { source: 'Python', target: 'PyTorch' },
  { source: 'Python', target: 'scikit-learn' },
  { source: 'Python', target: 'Airflow' },
  { source: 'TypeScript', target: 'OpenAI' },
  { source: 'TypeScript', target: 'Anthropic' },
  { source: 'Bash', target: 'CI/CD' },
  { source: 'Bash', target: 'Docker' },

  // AI / LLM cluster
  { source: 'OpenAI', target: 'LangChain' },
  { source: 'Anthropic', target: 'LangChain' },
  { source: 'LangChain', target: 'LlamaIndex' },
  { source: 'LangChain', target: 'RAG' },
  { source: 'LlamaIndex', target: 'RAG' },
  { source: 'RAG', target: 'Embeddings' },
  { source: 'RAG', target: 'Pinecone' },
  { source: 'RAG', target: 'Weaviate' },
  { source: 'RAG', target: 'FAISS' },
  { source: 'Embeddings', target: 'FAISS' },
  { source: 'Embeddings', target: 'Pinecone' },
  { source: 'RAG', target: 'RAGAS' },
  { source: 'LangChain', target: 'LangSmith' },
  { source: 'OpenAI', target: 'Embeddings' },
  { source: 'Fine-Tuning (LoRA/PEFT)', target: 'Transformers' },
  { source: 'Fine-Tuning (LoRA/PEFT)', target: 'PyTorch' },

  // ML cluster
  { source: 'PyTorch', target: 'Transformers' },
  { source: 'Transformers', target: 'Embeddings' },
  { source: 'TensorFlow', target: 'PyTorch' },
  { source: 'scikit-learn', target: 'XGBoost' },
  { source: 'PyTorch', target: 'MLflow' },
  { source: 'MLflow', target: 'Weights & Biases' },
  { source: 'scikit-learn', target: 'MLflow' },

  // Data & Platforms cluster
  { source: 'Spark/PySpark', target: 'Databricks' },
  { source: 'Spark/PySpark', target: 'Delta Lake' },
  { source: 'dbt', target: 'Snowflake' },
  { source: 'dbt', target: 'BigQuery' },
  { source: 'Kafka', target: 'Flink' },
  { source: 'Kafka', target: 'Kinesis' },
  { source: 'Flink', target: 'Kinesis' },
  { source: 'Airflow', target: 'dbt' },
  { source: 'Airflow', target: 'Spark/PySpark' },
  { source: 'Snowflake', target: 'CDC/ELT' },
  { source: 'Informatica', target: 'CDC/ELT' },
  { source: 'Hive/Hadoop', target: 'Spark/PySpark' },
  { source: 'CDC/ELT', target: 'Kafka' },
  { source: 'Databricks', target: 'MLflow' },

  // Cloud & Storage cluster
  { source: 'AWS', target: 'Redshift' },
  { source: 'AWS', target: 'Kinesis' },
  { source: 'GCP', target: 'BigQuery' },
  { source: 'Azure', target: 'Databricks' },
  { source: 'Redshift', target: 'Parquet/Avro/ORC' },
  { source: 'BigQuery', target: 'Parquet/Avro/ORC' },
  { source: 'Delta Lake', target: 'Parquet/Avro/ORC' },
  { source: 'Iceberg', target: 'Parquet/Avro/ORC' },
  { source: 'Delta Lake', target: 'Iceberg' },
  { source: 'PostgreSQL', target: 'SQL' },
  { source: 'Oracle', target: 'PL/SQL' },
  { source: 'PostgreSQL', target: 'Redis' },
  { source: 'MongoDB', target: 'Redis' },
  { source: 'Snowflake', target: 'Iceberg' },

  // DevOps cluster
  { source: 'Docker', target: 'Kubernetes' },
  { source: 'Kubernetes', target: 'Terraform' },
  { source: 'Terraform', target: 'AWS' },
  { source: 'CI/CD', target: 'Docker' },
  { source: 'Datadog', target: 'Grafana' },
  { source: 'Grafana', target: 'OpenTelemetry' },
  { source: 'Datadog', target: 'OpenTelemetry' },
  { source: 'Kubernetes', target: 'Datadog' },
  { source: 'Airflow', target: 'Kubernetes' },

  // Cross-cluster bridges
  { source: 'MLflow', target: 'Docker' },
  { source: 'OpenAI', target: 'Python' },
  { source: 'Anthropic', target: 'Python' },
  { source: 'Snowflake', target: 'AWS' },
  { source: 'Databricks', target: 'AWS' },
]

export const contact = {
  heading: "Let's build something",
  invitation:
    "I'm open to conversations about AI platforms, data infrastructure, and the engineering in between. Reach out.",
}

export const currentYear = new Date().getFullYear()
