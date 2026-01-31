import { Document, CodeSnippet } from "@shared/schema";
import { Client } from "@gradio/client";

/**
 * Hugging Face AI Service
 * Uses user's custom genai-backend-core space
 */

// User's Hugging Face Space - loaded from environment variable
const HF_SPACE_URL = import.meta.env.VITE_HF_SPACE_URL || "shrinusn77/genai-backend-core";

type AIStatusCallback = (status: string) => void;

/**
 * Real AI Service using Hugging Face Gradio Space
 * Handles cold starts (space sleeping) with retry logic and user feedback
 */
class HuggingFaceAIService {
  private client: any = null;
  private isWakingUp = false;

  /**
   * Initialize Gradio client with retry logic for cold starts
   */
  private async getClient(onStatus?: AIStatusCallback): Promise<any> {
    if (this.client) return this.client;

    try {
      onStatus?.("🔌 Connecting to AI model...");

      // First attempt - might fail if space is sleeping
      this.client = await Client.connect(HF_SPACE_URL);

      onStatus?.("✅ Connected to AI model");
      return this.client;
    } catch (error: any) {
      // Space is likely sleeping - wake it up
      if (error.message?.includes("Space is sleeping") || error.message?.includes("503")) {
        onStatus?.("😴 AI model is waking up... This may take 30-60 seconds (first use only)");
        this.isWakingUp = true;

        // Retry with exponential backoff
        for (let attempt = 1; attempt <= 5; attempt++) {
          await new Promise(resolve => setTimeout(resolve, attempt * 10000)); // 10s, 20s, 30s, 40s, 50s

          try {
            onStatus?.(`⏳ Attempt ${attempt}/5: Waiting for AI to wake up...`);
            this.client = await Client.connect(HF_SPACE_URL);
            this.isWakingUp = false;
            onStatus?.("✅ AI model is ready!");
            return this.client;
          } catch (retryError) {
            if (attempt === 5) throw new Error("AI model failed to wake up. Please try again in a minute.");
          }
        }
      }
      throw error;
    }
  }

  /**
   * Call the genai-backend-core space with memory management
   */
  private async callAI(prompt: string, onStatus?: AIStatusCallback): Promise<string> {
    try {
      const client = await this.getClient(onStatus);

      // CRITICAL: Clear memory to prevent context overflow
      try {
        await client.predict("/clear_memory");
        console.log("✅ Memory cleared successfully");
      } catch (memErr) {
        console.warn("⚠️ Memory clear warning:", memErr);
        // Continue anyway - might be first run
      }

      onStatus?.("🤖 AI is thinking...");

      // Call /chat_engine endpoint with message parameter
      const result = await client.predict("/chat_engine", {
        message: prompt
      });

      // Extract response from data[0]
      const response = result.data[0] || "No response generated.";

      return typeof response === 'string' ? response : String(response);
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw new Error(`AI Error: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * HUB 2: Analyze Resume for ATS compatibility
   */
  async analyzeResume(content: string, onStatus?: AIStatusCallback) {
    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume and provide:
1. ATS compatibility score (0-100)
2. List of missing important skills/keywords
3. Specific improvement suggestions

Resume:
${content}

Respond ONLY in this JSON format (no extra text):
{
  "score": 75,
  "missingSkills": ["skill1", "skill2"],
  "improvements": "specific suggestion here"
}`;

    try {
      const response = await this.callAI(prompt, onStatus);

      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback if AI doesn't return proper JSON
      return {
        score: 70,
        missingSkills: ["Unable to parse specific skills"],
        improvements: response.slice(0, 200)
      };
    } catch (error: any) {
      throw new Error(`Resume analysis failed: ${error.message}`);
    }
  }

  /**
   * HUB 2: Generate Cover Letter
   */
  async generateCoverLetter(prompt: string, onStatus?: AIStatusCallback) {
    try {
      return await this.callAI(prompt, onStatus);
    } catch (error: any) {
      throw new Error(`Cover letter generation failed: ${error.message}`);
    }
  }

  /**
   * HUB 4: Interview Chat with different personas
   */
  async chatWithInterviewer(message: string, persona: string, history: any[] = [], onStatus?: AIStatusCallback) {
    const personaPrompts: Record<string, string> = {
      "Strict HR": `You are a strict HR interviewer conducting a behavioral interview. 
Rules:
- Ask ONE clear behavioral question at a time
- Wait for the candidate's answer before asking next question
- Provide brief feedback (2-3 lines max) after each answer
- Rate answers as: Excellent/Good/Needs Improvement
- Focus on: teamwork, conflict resolution, leadership, problem-solving
- Keep responses under 80 words

If candidate asks for questions, provide ONE interview question and wait for their answer.`,

      "Chill Tech Lead": `You are a friendly technical interviewer (Tech Lead).
Rules:
- Ask ONE technical question at a time (coding, system design, or concepts)
- Keep questions clear and specific
- Provide hints if candidate is stuck
- Give constructive feedback (2-3 lines)
- Focus on: DSA, OOP, system design, best practices
- Keep responses under 80 words

If candidate asks for questions, provide ONE technical question and wait for their answer.`,

      "System Design Expert": `You are a system design interviewer.
Rules:
- Ask ONE system design question at a time
- Focus on: scalability, architecture, trade-offs, databases
- Probe deeper based on candidate's answers
- Provide brief feedback on their approach
- Keep responses under 80 words

If candidate asks for questions, provide ONE system design question and wait for their answer.`
    };

    const systemPrompt = personaPrompts[persona] || personaPrompts["Chill Tech Lead"];

    // Build conversation history
    const historyText = history.slice(-4).map(msg =>
      `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`
    ).join('\n');

    const prompt = `${systemPrompt}

${historyText ? `Previous conversation:\n${historyText}\n` : ''}
Candidate's latest message: ${message}

Respond as the interviewer (max 80 words):`;

    try {
      return await this.callAI(prompt, onStatus);
    } catch (error: any) {
      throw new Error(`Interview chat failed: ${error.message}`);
    }
  }

  /**
   * HUB 5: Analyze Code for bugs and complexity
   */
  async analyzeCode(code: string, onStatus?: AIStatusCallback) {
    const prompt = `You are a senior code reviewer. Analyze this code and provide:
1. Time complexity (Big O notation)
2. List of potential bugs or issues
3. Suggestions for improvement

Code:
\`\`\`
${code}
\`\`\`

Respond in a clear, readable format.`;

    try {
      const response = await this.callAI(prompt, onStatus);
      return {
        analysis: response,
        timeComplexity: "See analysis above",
        suggestions: []
      };
    } catch (error: any) {
      throw new Error(`Code analysis failed: ${error.message}`);
    }
  }

  /**
   * HUB 3: Generate study roadmap
   */
  async generateRoadmap(topic: string, duration: string, onStatus?: AIStatusCallback) {
    const prompt = `Create a detailed ${duration} study roadmap for learning ${topic}. 

Provide a week - by - week breakdown with specific topics and resources.

    Respond in JSON format:
    {
      "title": "${topic} Mastery",
        "steps": [
          { "title": "Week 1: Topic name", "status": "pending" },
          { "title": "Week 2: Topic name", "status": "pending" }
        ]
    } `;

    try {
      const response = await this.callAI(prompt, onStatus);
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        title: `${topic} Study Plan`,
        steps: [{ title: "Review AI response manually", status: "pending" }]
      };
    } catch (error: any) {
      throw new Error(`Roadmap generation failed: ${error.message} `);
    }
  }

  /**
   * HUB 3: ELI5 (Explain Like I'm 5) concept explainer
   */
  async explainConcept(concept: string, onStatus?: AIStatusCallback) {
    const prompt = `Explain "${concept}" in simple terms that a 5 - year - old could understand.Use analogies and avoid technical jargon.Keep it under 150 words.`;

    try {
      return await this.callAI(prompt, onStatus);
    } catch (error: any) {
      throw new Error(`Concept explanation failed: ${error.message} `);
    }
  }
}

// Export singleton instance
export const aiService = new HuggingFaceAIService();
