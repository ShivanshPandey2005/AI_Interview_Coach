import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

// In-Memory Database Fallback for smooth, zero-config developer launch
interface MockDBStore {
  users: any[];
  interviews: any[];
  resumes: any[];
  roadmaps: any[];
}

// Attach mock storage to global object so it survives Next.js HMR reloads
declare global {
  var mockDb: MockDBStore | undefined;
}

if (!global.mockDb) {
  global.mockDb = {
    users: [],
    interviews: [],
    resumes: [],
    roadmaps: []
  };
}

export const mockDb = global.mockDb;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return true;
  }

  if (!MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI is not set. Operating in resilient In-Memory Mock Database mode!");
    return false;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("🔌 Connected to MongoDB successfully!");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.warn("⚠️ Failing back to resilient In-Memory Mock Database mode!");
    return false;
  }
}

// --- MONGOOSE SCHEMA DEFINITIONS ---

// 1. User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 2. Interview Schema
const InterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  difficulty: { type: String, required: true },
  type: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    score: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    technicalAccuracyScore: { type: Number, default: 0 },
    relevanceScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    feedback: { type: String, default: "" },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    betterSampleAnswer: { type: String, default: "" }
  }],
  overallScore: { type: Number, default: 0 },
  feedbackSummary: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

// 3. ResumeAnalysis Schema
const ResumeAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  atsScore: { type: Number, required: true },
  summary: { type: String, required: true },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  missingSkills: [{ type: String }],
  suggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// 4. SkillRoadmap Schema
const SkillRoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  missingSkills: [{
    skillName: { type: String, required: true },
    priority: { type: String, required: true }, // High, Medium, Low
    description: { type: String, default: "" }
  }],
  weeklyRoadmap: [{
    weekNumber: { type: Number, required: true },
    weekTitle: { type: String, required: true },
    description: { type: String, default: "" },
    tasks: [{ type: String }],
    suggestedTopics: [{ type: String }]
  }],
  createdAt: { type: Date, default: Date.now }
});

// Prevent model overwrite compile issues during hot reload
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Interview = mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);
export const ResumeAnalysis = mongoose.models.ResumeAnalysis || mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);
export const SkillRoadmap = mongoose.models.SkillRoadmap || mongoose.model("SkillRoadmap", SkillRoadmapSchema);
