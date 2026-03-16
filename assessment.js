// StrideFlow Fabric Assessment - Application Logic

// Global state
let state = {
  stage: 'landing',
  currentDimension: 0,
  currentQuestion: 0,
  answers: {},
  context: {},
  scores: {
    agentAccessibility: 0,
    semanticClarity: 0,
    autonomySupport: 0,
    eventDriven: 0,
    observability: 0
  },
  assessmentId: generateId()
};

// Question database
const dimensions = [
  {
    name: 'Context',
    key: 'context',
    questions: [
      {
        id: 'industry',
        question: 'What industry does your organization operate in?',
        help: 'This helps us contextualize the assessment results against industry benchmarks.',
        type: 'select',
        options: [
          'Financial Services',
          'Healthcare',
          'Technology/Software',
          'Retail/E-commerce',
          'Manufacturing',
          'Telecommunications',
          'Government/Public Sector',
          'Other'
        ]
      },
      {
        id: 'engineeringSize',
        question: 'Approximately how many engineering/IT staff does your organization have?',
        type: 'select',
        options: [
          'Less than 50',
          '50-200',
          '200-500',
          '500-1000',
          '1000-2000',
          'More than 2000'
        ]
      },
      {
        id: 'appCount',
        question: 'Approximately how many applications are in your enterprise portfolio?',
        help: 'Include all business applications - SaaS, custom-built, legacy systems, etc.',
        type: 'select',
        options: [
          'Less than 50',
          '50-100',
          '100-300',
          '300-500',
          'More than 500'
        ]
      }
    ]
  },
  {
    name: 'Agent Accessibility',
    key: 'agentAccessibility',
    description: 'Evaluates whether applications expose programmatic APIs that allow agents to interact without human intervention.',
    questions: [
      {
        id: 'apiCoverage',
        question: 'What percentage of your applications expose programmatic APIs (REST, GraphQL, gRPC)?',
        help: 'Programmatic APIs allow agents to interact with applications without human intervention. Low API coverage is the #1 blocker to agentic operations.',
        type: 'slider',
        min: 0,
        max: 100,
        step: 5,
        unit: '%',
        default: 30
      },
      {
        id: 'apiDocumentation',
        question: 'Of the applications that have APIs, what percentage have comprehensive, up-to-date documentation?',
        type: 'slider',
        min: 0,
        max: 100,
        step: 5,
        unit: '%',
        default: 40
      },
      {
        id: 'authMechanisms',
        question: 'What authentication mechanisms do your APIs primarily use?',
        help: 'Modern auth mechanisms like OAuth 2.0 and API keys are more agent-friendly than session-based auth.',
        type: 'multiselect',
        options: [
          'OAuth 2.0 / OIDC',
          'API Keys',
          'JWT tokens',
          'Basic Authentication',
          'Session-based (cookies)',
          'Certificate-based'
        ]
      },
      {
        id: 'rateLimiting',
        question: 'Do your APIs implement rate limiting and throttling appropriate for automated access?',
        type: 'select',
        options: [
          'Yes, with generous limits for automation',
          'Yes, but limits are restrictive',
          'Some APIs do, others don\'t',
          'No rate limiting implemented',
          'Not sure'
        ]
      }
    ]
  },
  {
    name: 'Semantic Clarity',
    key: 'semanticClarity',
    description: 'Assesses whether APIs and data models include rich metadata that agents can reason about.',
    questions: [
      {
        id: 'apiSchemas',
        question: 'What percentage of your APIs have machine-readable schemas (OpenAPI, GraphQL schema, Protobuf)?',
        help: 'Machine-readable schemas allow agents to understand API capabilities without human explanation.',
        type: 'slider',
        min: 0,
        max: 100,
        step: 5,
        unit: '%',
        default: 25
      },
      {
        id: 'dataModels',
        question: 'How well are your domain concepts explicitly modeled in APIs?',
        type: 'select',
        options: [
          'Rich domain models with relationships and metadata',
          'Basic models with some metadata',
          'Primitive data structures (strings, numbers, arrays)',
          'Inconsistent across applications',
          'Not sure'
        ]
      },
      {
        id: 'errorHandling',
        question: 'How are API errors communicated?',
        help: 'Structured error responses help agents understand what went wrong and how to recover.',
        type: 'select',
        options: [
          'Structured error codes with detailed messages and recovery suggestions',
          'Standard HTTP status codes with error messages',
          'Generic error messages',
          'Inconsistent error handling',
          'Not sure'
        ]
      },
      {
        id: 'documentation',
        question: 'Do you use any of these tools for internal technical documentation?',
        help: 'Understanding your documentation practices helps us assess knowledge accessibility for future workflow optimization.',
        type: 'multiselect',
        options: [
          'Confluence',
          'Notion',
          'SharePoint',
          'Google Docs/Drive',
          'Microsoft Word/OneDrive',
          'GitHub Wiki/Markdown files',
          'Custom internal wiki',
          'Email/Slack (informal only)',
          'Limited/no standardized documentation'
        ]
      }
    ]
  },
  {
    name: 'Autonomy Support',
    key: 'autonomySupport',
    description: 'Measures whether workflows can execute end-to-end without human intervention.',
    questions: [
      {
        id: 'manualApprovals',
        question: 'What percentage of your critical workflows require manual human approvals?',
        help: 'Manual approval workflows block agent autonomy. High automation enables faster operations.',
        type: 'slider',
        min: 0,
        max: 100,
        step: 5,
        unit: '%',
        default: 60
      },
      {
        id: 'exceptionHandling',
        question: 'When automated processes encounter exceptions, what happens?',
        type: 'select',
        options: [
          'AI/rules engine handles most exceptions automatically',
          'Some exceptions auto-resolved, others escalate to humans',
          'Most exceptions require human intervention',
          'All exceptions halt and require manual review',
          'Not sure'
        ]
      },
      {
        id: 'idempotency',
        question: 'Do your APIs support idempotent operations (safe to retry)?',
        help: 'Idempotency allows agents to safely retry failed operations without causing duplicate side effects.',
        type: 'select',
        options: [
          'Yes, most operations are idempotent by design',
          'Some key operations are idempotent',
          'Limited idempotency support',
          'No, operations are not designed for idempotency',
          'Not sure'
        ]
      },
      {
        id: 'longRunning',
        question: 'How do you handle long-running operations?',
        type: 'select',
        options: [
          'Async patterns with webhooks/polling for status',
          'Background jobs with status endpoints',
          'Synchronous blocking calls',
          'Mixture of approaches',
          'Not sure'
        ]
      }
    ]
  },
  {
    name: 'Event-Driven Architecture',
    key: 'eventDriven',
    description: 'Evaluates adoption of asynchronous, event-based communication patterns.',
    questions: [
      {
        id: 'integrationStyle',
        question: 'What percentage of your application integrations use event-driven patterns (publish-subscribe) versus direct API calls?',
        help: 'Event-driven architecture enables loose coupling and agent-friendly asynchronous operations.',
        type: 'slider',
        min: 0,
        max: 100,
        step: 5,
        unit: '%',
        default: 20
      },
      {
        id: 'eventBus',
        question: 'Do you have an enterprise event bus or message broker?',
        type: 'select',
        options: [
          'Yes, widely adopted (Kafka, AWS EventBridge, Azure Event Grid, etc.)',
          'Yes, but limited adoption',
          'In pilot/planning phase',
          'No centralized event infrastructure',
          'Not sure'
        ]
      },
      {
        id: 'domainEvents',
        question: 'Do applications publish domain events when state changes?',
        help: 'Domain events allow other systems to react to changes without polling or tight coupling.',
        type: 'select',
        options: [
          'Yes, comprehensive event publishing',
          'Some applications publish events',
          'Minimal event publishing',
          'No event publishing',
          'Not sure'
        ]
      },
      {
        id: 'eventSchema',
        question: 'Are your events standardized with consistent schemas?',
        type: 'select',
        options: [
          'Yes, using standards like CloudEvents',
          'Yes, with internal schema registry',
          'Some standardization, but inconsistent',
          'No standardization',
          'Not sure'
        ]
      }
    ]
  },
  {
    name: 'Observability',
    key: 'observability',
    description: 'Assesses whether systems provide structured telemetry that agents can query and act on.',
    questions: [
      {
        id: 'logging',
        question: 'What logging approach do your applications use?',
        help: 'Structured logging enables AI-powered analysis and automated incident response.',
        type: 'select',
        options: [
          'Structured logs (JSON format with consistent fields)',
          'Mix of structured and unstructured',
          'Primarily unstructured text logs',
          'Minimal logging',
          'Not sure'
        ]
      },
      {
        id: 'metricsTraces',
        question: 'Do your applications emit metrics and distributed traces?',
        type: 'select',
        options: [
          'Yes, comprehensive metrics and tracing',
          'Metrics yes, traces limited',
          'Basic metrics only',
          'Minimal instrumentation',
          'Not sure'
        ]
      },
      {
        id: 'observabilityPlatform',
        question: 'Do you have a unified observability platform?',
        type: 'select',
        options: [
          'Yes, with AI-powered analytics (Datadog, Dynatrace, New Relic, etc.)',
          'Yes, but limited AI capabilities',
          'Multiple disconnected tools',
          'Basic monitoring only',
          'Not sure'
        ]
      },
      {
        id: 'aiOps',
        question: 'Can your monitoring systems autonomously detect anomalies and suggest remediation?',
        type: 'select',
        options: [
          'Yes, with automated remediation',
          'Yes, detection and suggestions only',
          'Basic anomaly detection',
          'Manual monitoring and analysis',
          'Not sure'
        ]
      }
    ]
  }
];

function generateId() {
  return 'SF' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function startAssessment() {
  state.stage = 'assessment';
  renderAssessment();
}

function renderAssessment() {
  const dim = dimensions[state.currentDimension];
  const question = dim.questions[state.currentQuestion];
  const progress = ((state.currentDimension * 100 / dimensions.length) + 
                   (state.currentQuestion / dim.questions.length * 100 / dimensions.length));
  
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="card">
      <div class="progress">
        <div class="progress-bar" style="width: ${progress}%"></div>
      </div>
      
      <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
        ${dim.name} · Question ${state.currentQuestion + 1} of ${dim.questions.length}
      </p>
      
      <div class="question-container">
        <div class="question-text">${question.question}</div>
        ${question.help ? `<div class="question-help">💡 ${question.help}</div>` : ''}
        
        <div id="answer-area"></div>
      </div>
      
      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        ${state.currentDimension > 0 || state.currentQuestion > 0 ? 
          '<button class="btn" onclick="previousQuestion()">← Previous</button>' : ''}
        <button class="btn btn-primary" id="nextBtn" onclick="nextQuestion()" style="flex: 1;">
          Next →
        </button>
      </div>
    </div>
  `;
  
  renderQuestionType(question);
}

function renderQuestionType(question) {
  const answerArea = document.getElementById('answer-area');
  const existingAnswer = state.answers[question.id];
  
  if (question.type === 'select') {
    answerArea.innerHTML = `
      <div class="options">
        ${question.options.map((opt, i) => `
          <div class="option ${existingAnswer === opt ? 'selected' : ''}" 
               onclick="selectOption('${question.id}', '${opt.replace(/'/g, "\\'")}')">
            ${opt}
          </div>
        `).join('')}
      </div>
    `;
    document.getElementById('nextBtn').disabled = !existingAnswer;
  } else if (question.type === 'slider') {
    const value = existingAnswer !== undefined ? existingAnswer : question.default;
    if (existingAnswer === undefined) {
      state.answers[question.id] = value;
    }
    answerArea.innerHTML = `
      <div class="slider-container">
        <div class="slider-labels">
          <span>0${question.unit || ''}</span>
          <span>100${question.unit || ''}</span>
        </div>
        <input type="range" 
               min="${question.min || 0}" 
               max="${question.max || 100}" 
               step="${question.step || 1}"
               value="${value}"
               oninput="updateSlider('${question.id}', this.value, '${question.unit || ''}')"
               onchange="selectOption('${question.id}', this.value)">
        <div class="slider-value" id="slider-value">${value}${question.unit || ''}</div>
      </div>
    `;
    document.getElementById('nextBtn').disabled = false;
  } else if (question.type === 'multiselect') {
    const selected = existingAnswer || [];
    answerArea.innerHTML = `
      <div class="checkbox-group">
        ${question.options.map((opt, i) => `
          <label class="checkbox-option">
            <input type="checkbox" 
                   value="${opt}" 
                   ${selected.includes(opt) ? 'checked' : ''}
                   onchange="toggleCheckbox('${question.id}', '${opt.replace(/'/g, "\\'")}')">
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    `;
    document.getElementById('nextBtn').disabled = selected.length === 0;
  }
}

function updateSlider(id, value, unit) {
  document.getElementById('slider-value').textContent = value + unit;
}

function selectOption(id, value) {
  state.answers[id] = value;
  
  if (event && event.target && event.target.classList.contains('option')) {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    event.target.classList.add('selected');
  }
  
  document.getElementById('nextBtn').disabled = false;
}

function toggleCheckbox(id, value) {
  if (!state.answers[id]) {
    state.answers[id] = [];
  }
  
  const index = state.answers[id].indexOf(value);
  if (index > -1) {
    state.answers[id].splice(index, 1);
  } else {
    state.answers[id].push(value);
  }
  
  document.getElementById('nextBtn').disabled = state.answers[id].length === 0;
}

function previousQuestion() {
  if (state.currentQuestion > 0) {
    state.currentQuestion--;
  } else if (state.currentDimension > 0) {
    state.currentDimension--;
    state.currentQuestion = dimensions[state.currentDimension].questions.length - 1;
  }
  renderAssessment();
}

function nextQuestion() {
  const dim = dimensions[state.currentDimension];
  
  if (state.currentQuestion < dim.questions.length - 1) {
    state.currentQuestion++;
    renderAssessment();
  } else if (state.currentDimension < dimensions.length - 1) {
    state.currentDimension++;
    state.currentQuestion = 0;
    renderAssessment();
  } else {
    calculateScores();
    showLoading();
  }
}

function calculateScores() {
  const answers = state.answers;
  
  // Agent Accessibility
  let aaScore = 0;
  aaScore += parseFloat(answers.apiCoverage || 0) * 0.4;
  aaScore += parseFloat(answers.apiDocumentation || 0) * 0.3;
  aaScore += (answers.authMechanisms?.length || 0) * 5;
  aaScore += answers.rateLimiting === 'Yes, with generous limits for automation' ? 20 : 
             answers.rateLimiting === 'Yes, but limits are restrictive' ? 10 : 0;
  state.scores.agentAccessibility = Math.min(100, Math.round(aaScore));
  
  // Semantic Clarity
  let scScore = 0;
  scScore += parseFloat(answers.apiSchemas || 0) * 0.4;
  scScore += answers.dataModels === 'Rich domain models with relationships and metadata' ? 30 :
             answers.dataModels === 'Basic models with some metadata' ? 20 : 10;
  scScore += answers.errorHandling === 'Structured error codes with detailed messages and recovery suggestions' ? 20 :
             answers.errorHandling === 'Standard HTTP status codes with error messages' ? 10 : 0;
  scScore += (answers.documentation?.length || 0) * 2;
  state.scores.semanticClarity = Math.min(100, Math.round(scScore));
  
  // Autonomy Support
  let asScore = 100;
  asScore -= parseFloat(answers.manualApprovals || 0) * 0.3;
  asScore += answers.exceptionHandling === 'AI/rules engine handles most exceptions automatically' ? 20 :
             answers.exceptionHandling === 'Some exceptions auto-resolved, others escalate to humans' ? 10 : 0;
  asScore += answers.idempotency === 'Yes, most operations are idempotent by design' ? 15 : 0;
  asScore += answers.longRunning === 'Async patterns with webhooks/polling for status' ? 15 : 0;
  state.scores.autonomySupport = Math.max(0, Math.min(100, Math.round(asScore)));
  
  // Event-Driven Architecture
  let edScore = 0;
  edScore += parseFloat(answers.integrationStyle || 0) * 0.4;
  edScore += answers.eventBus === 'Yes, widely adopted (Kafka, AWS EventBridge, Azure Event Grid, etc.)' ? 25 :
             answers.eventBus === 'Yes, but limited adoption' ? 15 : 0;
  edScore += answers.domainEvents === 'Yes, comprehensive event publishing' ? 20 :
             answers.domainEvents === 'Some applications publish events' ? 10 : 0;
  edScore += answers.eventSchema === 'Yes, using standards like CloudEvents' ? 15 :
             answers.eventSchema === 'Yes, with internal schema registry' ? 10 : 0;
  state.scores.eventDriven = Math.min(100, Math.round(edScore));
  
  // Observability
  let obScore = 0;
  obScore += answers.logging === 'Structured logs (JSON format with consistent fields)' ? 25 :
             answers.logging === 'Mix of structured and unstructured' ? 15 : 5;
  obScore += answers.metricsTraces === 'Yes, comprehensive metrics and tracing' ? 25 :
             answers.metricsTraces === 'Metrics yes, traces limited' ? 15 : 5;
  obScore += answers.observabilityPlatform === 'Yes, with AI-powered analytics (Datadog, Dynatrace, New Relic, etc.)' ? 25 :
             answers.observabilityPlatform === 'Yes, but limited AI capabilities' ? 15 : 0;
  obScore += answers.aiOps === 'Yes, with automated remediation' ? 25 :
             answers.aiOps === 'Yes, detection and suggestions only' ? 15 : 0;
  state.scores.observability = Math.min(100, Math.round(obScore));
  
  // Overall score
  state.scores.overall = Math.round(
    (state.scores.agentAccessibility + 
     state.scores.semanticClarity + 
     state.scores.autonomySupport + 
     state.scores.eventDriven + 
     state.scores.observability) / 5
  );
}

function showLoading() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="card">
      <div class="loading">
        <div class="spinner"></div>
        <h2>Analyzing your architecture...</h2>
        <p>Calculating agentic readiness scores</p>
      </div>
    </div>
  `;
  
  setTimeout(showResults, 2000);
}

function showResults() {
  state.stage = 'results';
  const app = document.getElementById('app');
  
  const scores = state.scores;
  const overallBadge = scores.overall >= 70 ? 'success' : scores.overall >= 40 ? 'warning' : 'danger';
  const overallLabel = scores.overall >= 70 ? 'Above Average' : scores.overall >= 40 ? 'Below Average' : 'Critical';
  
  app.innerHTML = `
    <div class="card">
      <h1>Your <span class="brand">StrideFlow Fabric™</span> Assessment</h1>
      <p style="font-size: 14px; color: var(--color-text-secondary);">
        Assessment ID: ${state.assessmentId} · Completed: ${new Date().toLocaleDateString()}
      </p>
      
      <div class="score-card">
        <div class="score-label">Overall Agentic Readiness</div>
        <div class="score-value">${scores.overall}<span style="font-size: 24px;">/100</span></div>
        <span class="badge badge-${overallBadge}">${overallLabel}</span>
      </div>
      
      <h2 style="margin-top: 2rem;">Dimensional Breakdown</h2>
      <div style="margin: 1.5rem 0;">
        ${renderDimensionScore('Agent Accessibility', scores.agentAccessibility, 
          'Programmatic access to applications')}
        ${renderDimensionScore('Semantic Clarity', scores.semanticClarity, 
          'Machine-readable APIs and schemas')}
        ${renderDimensionScore('Autonomy Support', scores.autonomySupport, 
          'Unattended operation capabilities')}
        ${renderDimensionScore('Event-Driven Architecture', scores.eventDriven, 
          'Asynchronous communication patterns')}
        ${renderDimensionScore('Observability', scores.observability, 
          'Structured telemetry and monitoring')}
      </div>
      
      <h2 style="margin-top: 2rem;">Key Findings</h2>
      <div class="recommendations">
        ${generateRecommendations()}
      </div>
      
      <div style="position: relative; margin: 2rem 0;">
        <h2>Economic Impact Projection</h2>
        <div class="blur-overlay">
          <div class="metric-grid">
            <div class="metric">
              <div class="metric-label">Current Structural Carrying Cost</div>
              <div class="metric-value">$24.5M</div>
              <p style="font-size: 13px; margin-top: 0.5rem;">annually</p>
            </div>
            <div class="metric">
              <div class="metric-label">Potential Capacity Recovery</div>
              <div class="metric-value">180 FTE</div>
              <p style="font-size: 13px; margin-top: 0.5rem;">equivalents</p>
            </div>
            <div class="metric">
              <div class="metric-label">Projected ROI Timeline</div>
              <div class="metric-value">8-12 mo</div>
              <p style="font-size: 13px; margin-top: 0.5rem;">payback period</p>
            </div>
            <div class="metric">
              <div class="metric-label">3-Year Value Creation</div>
              <div class="metric-value">$65M</div>
              <p style="font-size: 13px; margin-top: 0.5rem;">NPV @ 10% discount</p>
            </div>
          </div>
        </div>
        <div class="blur-message">
          <h3>Detailed Analysis Available</h3>
          <p style="margin: 1rem 0;">Schedule a consultation to receive your complete economic impact analysis and transformation roadmap.</p>
          <button class="btn btn-primary" onclick="alert('Contact: raj@strideflow.com')">
            Schedule Consultation →
          </button>
        </div>
      </div>
      
      <div class="premium-section">
        <h3 style="margin-bottom: 0.5rem; color: #7C3AED;">Share Detailed Recommendations</h3>
        <p style="font-size: 15px; margin: 1rem 0; color: var(--color-text-secondary);">
          Upgrade to Premium service to share detailed recommendations and track team responses
        </p>
        <button class="btn btn-primary" onclick="alert('Contact: raj@strideflow.com')">
          Upgrade to Premium →
        </button>
      </div>
      
      <div style="margin-top: 2rem; padding-top: 2rem; border-top: 0.5px solid var(--color-border-tertiary);">
        <button class="btn" onclick="location.reload()" style="width: 100%;">
          Start New Assessment
        </button>
      </div>
    </div>
  `;
}

function renderDimensionScore(name, score, description) {
  return `
    <div class="dimension-score">
      <div style="flex: 0 0 200px;">
        <div class="dimension-name">${name}</div>
        <div style="font-size: 13px; color: var(--color-text-secondary);">${description}</div>
      </div>
      <div class="bar-container">
        <div class="bar-fill" style="width: ${score}%"></div>
      </div>
      <div class="dimension-value">${score}</div>
    </div>
  `;
}

function generateRecommendations() {
  const scores = state.scores;
  const recommendations = [];
  
  if (scores.agentAccessibility < 50) {
    recommendations.push({
      title: 'Priority: API Accessibility',
      text: 'Your low API coverage (agent accessibility score: ' + scores.agentAccessibility + '/100) is the primary blocker to agentic operations. Recommend implementing API facade layer for your 10-20 most critical applications as Phase 1 quick win.'
    });
  }
  
  if (scores.eventDriven < 40) {
    recommendations.push({
      title: 'High Impact: Event-Driven Architecture',
      text: 'Your synchronous integration patterns (event-driven score: ' + scores.eventDriven + '/100) create brittle coupling. Implementing an enterprise event bus (Kafka, AWS EventBridge) would enable loose coupling and agent-friendly async operations.'
    });
  }
  
  if (scores.autonomySupport < 50) {
    recommendations.push({
      title: 'Workflow Automation Gap',
      text: 'High manual approval requirements (autonomy score: ' + scores.autonomySupport + '/100) prevent end-to-end agent operations. Consider implementing policy-based automation with human-in-loop only for exceptional cases.'
    });
  }
  
  if (scores.semanticClarity < 50) {
    recommendations.push({
      title: 'API Schema Standards',
      text: 'Limited machine-readable schemas (semantic clarity: ' + scores.semanticClarity + '/100) force agents to guess API capabilities. Adopting OpenAPI/GraphQL schemas would enable agent reasoning about your services.'
    });
  }
  
  if (scores.observability >= 70) {
    recommendations.push({
      title: 'Strength: Observability',
      text: 'Your observability practices (score: ' + scores.observability + '/100) are a strong foundation. This will accelerate agent deployment by providing the telemetry needed for autonomous operations.'
    });
  }
  
  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Balanced Architecture',
      text: 'Your architecture shows moderate agentic readiness across dimensions. Focus on incrementally improving your lowest-scoring areas while maintaining current strengths.'
    });
  }
  
  return recommendations.map(rec => `
    <div class="recommendation-item">
      <div class="recommendation-title">${rec.title}</div>
      <p style="font-size: 14px; margin: 0.5rem 0 0 0; color: var(--color-text-secondary);">${rec.text}</p>
    </div>
  `).join('');
}
