import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Initialize Gemini SDK only if key is present
let genAI: any = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (e) {
    console.error("Gemini SDK Initialization failed:", e);
  }
}

export function isGeminiConnected() {
  return !!genAI;
}

// -------------------------------------------------------------
// MODULE 1: AI MOCK INTERVIEW - QUESTIONS GENERATION
// -------------------------------------------------------------

export async function generateInterviewQuestions(
  role: string,
  difficulty: string,
  type: string
): Promise<string[]> {
  const prompt = `You are a Senior Technical Recruiter and Hiring Manager. 
Generate exactly 10 interview questions for a candidate interviewing for the following role:
- Role: ${role}
- Difficulty: ${difficulty}
- Interview Style / Category: ${type} (HR, Technical, or Behavioral)

Format your response strictly as a JSON array of strings, containing exactly 10 questions.
Do not include any formatting markdown like \`\`\`json or surrounding text. Return ONLY the raw JSON array.
Example:
["Question 1?", "Question 2?", ...]`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 10);
      }
    } catch (error) {
      console.error("Error generating questions with Gemini:", error);
    }
  }

  // Resilient Mock Fallback questions tailored to selected parameters
  console.log("⚠️ Using mock interview questions fallback!");
  return getMockQuestions(role, difficulty, type);
}

// Helper mock question generator
function getMockQuestions(role: string, difficulty: string, type: string): string[] {
  if (type.toLowerCase() === "technical") {
    return [
      `What are the key trade-offs between SQL and NoSQL databases for a scalable ${role} architecture?`,
      `How do you handle race conditions or asynchronous operations safely in a production environment?`,
      `Can you explain how caching strategies (like Redis) work and when they might introduce cache invalidation bugs?`,
      `How do you optimize API response times when dealing with complex, nested database queries?`,
      `What is your approach to writing clean, maintainable unit and integration tests?`,
      `Explain the differences between client-side rendering and server-side rendering, and when you would choose one over the other.`,
      `How do you approach securing APIs against common security vulnerabilities like CSRF or SQL injection?`,
      `Describe a time you had to debug a severe memory leak or performance bottleneck. What tools did you use?`,
      `What is the difference between horizontal and vertical scaling, and how does it relate to stateful vs stateless services?`,
      `How do you manage schema migrations in a live database without causing downtime?`
    ];
  }

  if (type.toLowerCase() === "behavioral") {
    return [
      `Describe a time you had a major technical disagreement with a team member. How did you resolve it?`,
      `Tell me about a project that failed or missed its deadline. What did you learn and how did you communicate it?`,
      `How do you manage your time and prioritize tasks when you have multiple urgent deadlines?`,
      `Describe a time you went above and beyond to solve a customer pain point or deliver a crucial feature.`,
      `Tell me about a time you had to adapt quickly to a major shift in product requirements or architecture.`,
      `How do you handle critical feedback from a peer or manager regarding your design decisions?`,
      `Describe a situation where you had to lead a project or initiative with little to no guidance.`,
      `Tell me about a time you mentored a junior engineer or helped a colleague debug a critical issue.`,
      `How do you maintain code quality standards while working under tight product delivery pressures?`,
      `Tell me about a time you made a technical mistake that impacted production. How did you handle the aftermath?`
    ];
  }

  // HR / Mixed Default
  return [
    `Why are you interested in joining our company as a ${role}, and what makes you a great fit?`,
    `Tell me about a recent project you worked on that you are most proud of. What was your role?`,
    `What are your greatest professional strengths, and in what areas are you actively looking to grow?`,
    `How do you stay up-to-date with emerging tech stacks, tools, and industry trends?`,
    `Where do you see yourself professionally in the next 3 to 5 years, and how does this role align with that?`,
    `How do you handle high-pressure situations or tight release schedules?`,
    `Describe your ideal engineering culture and what kind of team structure you thrive in.`,
    `Tell me about a time you had to learn a completely new technology under a very tight timeline.`,
    `What is your approach to collaborating with non-technical stakeholders, like Product Managers or Designers?`,
    `Do you have any questions for us about our engineering roadmap or product goals?`
  ];
}

// -------------------------------------------------------------
// MODULE 2: AI INTERVIEW ANSWER EVALUATION
// -------------------------------------------------------------

export interface AnswerEval {
  score: number;
  communicationScore: number;
  technicalAccuracyScore: number;
  relevanceScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  betterSampleAnswer: string;
}

export interface InterviewEvaluationReport {
  overallScore: number;
  feedbackSummary: string;
  questions: {
    question: string;
    answer: string;
    score: number;
    communicationScore: number;
    technicalAccuracyScore: number;
    relevanceScore: number;
    confidenceScore: number;
    problemSolvingScore: number;
    feedback: string;
    strengths: string[];
    weaknesses: string[];
    betterSampleAnswer: string;
  }[];
}

export async function evaluateInterviewAnswers(
  role: string,
  difficulty: string,
  type: string,
  questions: string[],
  answers: string[]
): Promise<InterviewEvaluationReport> {
  const prompt = `You are a Principal Software Engineer and Elite Hiring Manager grading a mock interview transcript.
Given the candidate's chosen role, difficulty level, questions, and responses, perform a strict, detailed evaluation.

Parameters:
- Candidate Role: ${role}
- Difficulty: ${difficulty}
- Type: ${type}

Transcript:
${questions.map((q, idx) => `
Q${idx + 1}: ${q}
A${idx + 1}: ${answers[idx] || "(No Answer Provided)"}
`).join("\n")}

You MUST return a JSON object with the following structure:
{
  "overallScore": 82, // overall score out of 100
  "feedbackSummary": "Detailed multi-line summary of overall strengths and core growth points...",
  "questions": [
    {
      "question": "Question text...",
      "answer": "Answer text...",
      "score": 8, // out of 10
      "communicationScore": 8, // out of 10
      "technicalAccuracyScore": 7, // out of 10
      "relevanceScore": 9, // out of 10
      "confidenceScore": 8, // out of 10
      "problemSolvingScore": 8, // out of 10
      "feedback": "Detailed answer feedback...",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "betterSampleAnswer": "A high-quality, professional model answer..."
    },
    ... // repeat for all 10 questions
  ]
}

Format your response strictly as valid JSON. Do not include markdown \`\`\`json wrappers.`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error evaluating answers with Gemini:", error);
    }
  }

  // Mock fallback evaluation
  console.log("⚠️ Using mock interview evaluation fallback!");
  return getMockEvaluation(role, questions, answers);
}

function getMockEvaluation(
  role: string,
  questions: string[],
  answers: string[]
): InterviewEvaluationReport {
  let scoreSum = 0;
  const gradedQuestions = questions.map((q, idx) => {
    const ans = answers[idx] || "";
    // If no answer, give minimal score, else calculate a realistic score
    const hasAns = ans.trim().length > 5;
    const baseVal = hasAns ? Math.min(6 + (ans.length % 5), 10) : 1;
    const cScore = hasAns ? Math.min(baseVal + 1, 10) : 0;
    const tScore = hasAns ? Math.min(baseVal - 1, 10) : 0;
    const rScore = hasAns ? Math.min(baseVal, 10) : 0;
    const cfScore = hasAns ? Math.min(baseVal + 1, 10) : 0;
    const pScore = hasAns ? Math.min(baseVal, 10) : 0;
    const qScore = hasAns ? Math.round((cScore + tScore + rScore + cfScore + pScore) / 5) : 0;
    
    scoreSum += qScore * 10;

    return {
      question: q,
      answer: ans || "(No answer was submitted)",
      score: qScore,
      communicationScore: cScore,
      technicalAccuracyScore: tScore,
      relevanceScore: rScore,
      confidenceScore: cfScore,
      problemSolvingScore: pScore,
      feedback: hasAns 
        ? "Great structuring of your answer. You clearly illustrated your concepts with examples. However, you could dive deeper into technical tradeoffs and explain alternative approaches to make your answer bulletproof."
        : "You did not provide an answer. In an actual interview, always attempt a guess or walk through your logical thinking process.",
      strengths: hasAns 
        ? ["Structured logical flow", "Good explanation of core terms"] 
        : ["Attempted to advance"],
      weaknesses: hasAns 
        ? ["Lacks deep coverage of edge-cases", "Could mention scaling bottlenecks"]
        : ["Did not submit text"],
      betterSampleAnswer: `Here is a strong answer for this role: "A senior ${role} would approach this by first analyzing constraints, designing a stateless service architecture, implementing robust logging, and setting up thorough performance load testing to preempt scaling blockers."`
    };
  });

  const overallScore = Math.round(scoreSum / questions.length);

  return {
    overallScore,
    feedbackSummary: `You demonstrated solid capabilities for the ${role} position. Your communication was structured and easy to follow. To move to the next level, focus on strengthening your domain-specific deep architectural trade-offs, and detail specific metrics when outlining past project successes.`,
    questions: gradedQuestions
  };
}

// -------------------------------------------------------------
// MODULE 3: AI PDF RESUME ANALYSIS
// -------------------------------------------------------------

export interface ResumeAnalysisResult {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
}

export async function analyzeResumeContent(
  resumeText: string
): Promise<ResumeAnalysisResult> {
  const prompt = `You are an elite Applicant Tracking System (ATS) auditor and Technical Hiring Director.
Analyze the following extracted resume text in detail. Rate its ATS compatibility, layout structure, and depth.

Resume Text:
${resumeText}

You MUST return a JSON object with the following structure:
{
  "atsScore": 76, // score from 0 to 100
  "summary": "Detailed summary paragraph critiquing the resume's focus and formatting...",
  "strengths": ["Strength bullet 1", "Strength bullet 2"],
  "weaknesses": ["Weakness bullet 1", "Weakness bullet 2"],
  "missingSkills": ["Key missing skill 1", "Key missing skill 2"],
  "suggestions": ["Improvement suggestion 1", "Improvement suggestion 2"]
}

Format your response strictly as valid JSON. Do not include markdown \`\`\`json wrappers.`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error analyzing resume with Gemini:", error);
    }
  }

  // Mock fallback resume analysis
  console.log("⚠️ Using mock resume analysis fallback!");
  return getMockResumeAnalysis(resumeText);
}

function getMockResumeAnalysis(resumeText: string): ResumeAnalysisResult {
  const score = 78;
  return {
    atsScore: score,
    summary: "Your resume is clean and has a decent distribution of action verbs. However, it lacks robust numerical impact metrics (e.g. '% speedup', '$ savings') and has a slightly crowded structure that makes it harder for automated ATS scanners to index your key competencies cleanly.",
    strengths: [
      "Excellent skill grid covering modern frameworks.",
      "Clear chronological sequence in professional experiences.",
      "Good usage of engineering action verbs (e.g. Architected, Streamlined)."
    ],
    weaknesses: [
      "Missing critical business impact data (e.g. didn't specify user scale, performance speeds).",
      "Slightly lengthy paragraphs under experience items instead of crisp bullet points.",
      "Underrepresents core testing/deployment competencies (CI/CD, Docker)."
    ],
    missingSkills: [
      "Docker / Kubernetes (Containerization)",
      "CI/CD Pipelines (GitHub Actions / Jenkins)",
      "Advanced caching (Redis / Memcached)",
      "System Design & Microservices architectures"
    ],
    suggestions: [
      "Rewrite bullet points using the Google XYZ framework: 'Accomplished [X] as measured by [Y], by doing [Z]'.",
      "Shorten long narrative blocks into structured, single-line high-impact bullet items.",
      "Add a dedicated 'Tools & Infrastructure' sub-header to list containerization and hosting platforms."
    ]
  };
}

// -------------------------------------------------------------
// MODULE 4: AI SKILL GAP ANALYZER & ROADMAP
// -------------------------------------------------------------

export interface RoadmapResult {
  role: string;
  missingSkills: {
    skillName: string;
    priority: "High" | "Medium" | "Low";
    description: string;
  }[];
  weeklyRoadmap: {
    weekNumber: number;
    weekTitle: string;
    description: string;
    tasks: string[];
    suggestedTopics: string[];
  }[];
}

export async function generateSkillRoadmap(
  resumeGaps: string[],
  interviewWeaknesses: string[],
  role: string
): Promise<RoadmapResult> {
  const prompt = `You are a Principal Technical Architect and career engineering coach.
Given a candidate's resume gaps and mock interview weaknesses for their target role, formulate a personalized training program.

Inputs:
- Target Role: ${role}
- Resume Missing Skills: ${JSON.stringify(resumeGaps)}
- Interview Weaknesses: ${JSON.stringify(interviewWeaknesses)}

You MUST return a JSON object with the following structure:
{
  "role": "${role}",
  "missingSkills": [
    {
      "skillName": "Skill Name...",
      "priority": "High", // "High" | "Medium" | "Low"
      "description": "Short explanation of why this skill is a blocker..."
    }
  ],
  "weeklyRoadmap": [
    {
      "weekNumber": 1,
      "weekTitle": "Structured Week Title...",
      "description": "Short overview of the week's focal point...",
      "tasks": ["Checkbox Task 1...", "Checkbox Task 2..."],
      "suggestedTopics": ["Deep topic 1", "Deep topic 2"]
    }
  ] // generate a highly practical 4 to 6 week roadmap
}

Format your response strictly as valid JSON. Do not include markdown \`\`\`json wrappers.`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating roadmap with Gemini:", error);
    }
  }

  // Mock fallback roadmap
  console.log("⚠️ Using mock skill gap roadmap fallback!");
  return getMockRoadmap(role, resumeGaps, interviewWeaknesses);
}

function getMockRoadmap(
  role: string,
  resumeGaps: string[],
  interviewWeaknesses: string[]
): RoadmapResult {
  const finalGaps = resumeGaps.length > 0 ? resumeGaps : ["System Design", "CI/CD Pipelines", "Redis caching"];
  
  return {
    role,
    missingSkills: [
      {
        skillName: finalGaps[0],
        priority: "High",
        description: "Crucial blocker for senior engineering screening. Must master latency, database selection, and stateless operations."
      },
      {
        skillName: finalGaps[1] || "CI/CD & Testing",
        priority: "Medium",
        description: "Expected skill in modern teams to automate build scripts, lint checks, and testing pipelines."
      },
      {
        skillName: finalGaps[2] || "Advanced Caching",
        priority: "Low",
        description: "Important optimization technique to lower database read overheads and increase performance throughput."
      }
    ],
    weeklyRoadmap: [
      {
        weekNumber: 1,
        weekTitle: "Core Foundations & Architectural Trade-offs",
        description: "Establish a robust mental model of scaling bottlenecks, load balancing, and data patterns.",
        tasks: [
          "Study horizontal vs vertical scaling concepts and stateless setups.",
          "Design a mock URL shortener architecture covering SQL vs NoSQL selections.",
          "Draw out read-heavy vs write-heavy database optimizations."
        ],
        suggestedTopics: ["Load Balancers (Nginx/HAProxy)", "CAP Theorem", "Sharding & Replication"]
      },
      {
        weekNumber: 2,
        weekTitle: "Caching Strategies & Performance Tuning",
        description: "Learn caching mechanics to accelerate response latencies and mitigate database stress.",
        tasks: [
          "Implement a basic Redis cache layer in a sample node server.",
          "Analyze cache write strategies: Write-Through, Write-Behind, and Cache-Aside.",
          "Solve 3 practice questions detailing cache invalidation edge-cases."
        ],
        suggestedTopics: ["Redis Eviction Policies (LRU/LFU)", "Cache Stampede", "CDN caching edge-workers"]
      },
      {
        weekNumber: 3,
        weekTitle: "Automated Workflows & CI/CD Pipelines",
        description: "Configure code sanity checks, build pipelines, and automated test runners.",
        tasks: [
          "Create a GitHub Actions workflow that executes linting on push triggers.",
          "Set up automated unit test suites linked to code integration pipelines.",
          "Write a simple Dockerfile to containerize your application environment."
        ],
        suggestedTopics: ["Docker Layer Caching", "GitHub Secrets & Encrypted Vars", "Semantic Versioning automations"]
      },
      {
        weekNumber: 4,
        weekTitle: "Mock Simulation & Dynamic Retrials",
        description: "Put your accumulated knowledge to work inside intense simulated hiring rounds.",
        tasks: [
          "Conduct a 10-question Mock Interview inside PlacementGPT under Hard setting.",
          "Critique your answered transcripts against Gemini model answers.",
          "Review and rewrite your weaknesses points in the Resume analysis report."
        ],
        suggestedTopics: ["STAR Framework", "Time-complexity reviews", "System design mock reviews"]
      }
    ]
  };
}
