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
   * HUB 4: Interview Assistant - Topic-based Q&A Helper
   */
  async chatWithAssistant(message: string, topic: string, history: any[] = [], onStatus?: AIStatusCallback) {
    const topicPrompts: Record<string, string> = {
      "Behavioral": `You are a helpful interview coach specializing in behavioral questions.

Your role:
- Answer user's questions about behavioral interviews clearly
- Provide STAR method (Situation, Task, Action, Result) examples
- Give practical tips for common behavioral questions
- Suggest good answer structures for specific scenarios
- Be encouraging, friendly, and actionable

IMPORTANT FORMATTING RULES:
- Use clear sections with headings
- Use numbered lists (1., 2., 3.) for steps or tips
- Use bullet points (•) for examples or sub-points
- Keep paragraphs short (2-3 sentences max)
- Add line breaks between sections
- Make it easy to scan and read

Example format:
**Tips for [Topic]:**
1. First tip here
2. Second tip here

**Example Answer:**
• Point one
• Point two

Keep total response under 200 words.`,

      "Technical": `You are a coding interview expert helping students prepare for technical interviews.

Your role:
- Explain DSA (Data Structures & Algorithms) concepts in simple terms
- Provide coding patterns and problem-solving approaches
- Give tips for solving common problem types
- Suggest practice strategies and resources
- Help with time/space complexity understanding

IMPORTANT FORMATTING RULES:
- Use clear sections with headings
- Use numbered lists (1., 2., 3.) for steps or approaches
- Use bullet points (•) for key concepts or examples
- Keep paragraphs short (2-3 sentences max)
- Add line breaks between sections
- Use code examples when helpful

Example format:
**Concept:**
Brief explanation here.

**Approach:**
1. Step one
2. Step two

**Time Complexity:** O(n)

Keep total response under 200 words.`,

      "System Design": `You are a system design expert helping students understand architecture concepts.

Your role:
- Explain system design concepts in beginner-friendly terms
- Discuss scalability, databases, caching, load balancing
- Provide architectural patterns and trade-offs
- Give tips for system design interviews
- Help break down complex systems into components

IMPORTANT FORMATTING RULES:
- Use clear sections with headings
- Use numbered lists (1., 2., 3.) for steps or components
- Use bullet points (•) for features or trade-offs
- Keep paragraphs short (2-3 sentences max)
- Add line breaks between sections
- Make comparisons clear

Example format:
**Key Components:**
1. Component one
2. Component two

**Trade-offs:**
• Pro: Benefit here
• Con: Drawback here

Keep total response under 200 words.`,

      "HR Skills": `You are a career coach specializing in HR and soft skills for interviews.

Your role:
- Help with salary negotiation strategies
- Suggest good questions to ask interviewers
- Explain interview etiquette and best practices
- Provide tips for offer evaluation
- Help identify company culture and red flags

IMPORTANT FORMATTING RULES:
- Use clear sections with headings
- Use numbered lists (1., 2., 3.) for tips or strategies
- Use bullet points (•) for examples or key points
- Keep paragraphs short (2-3 sentences max)
- Add line breaks between sections
- Make advice actionable

Example format:
**Negotiation Tips:**
1. First strategy
2. Second strategy

**Questions to Ask:**
• Question one
• Question two

Keep total response under 200 words.`,

      "Prep Tips": `You are an interview preparation expert helping students build confidence.

Your role:
- Provide general interview preparation strategies
- Give confidence-building tips and motivation
- Suggest mock interview practices
- Help with interview day preparation (what to wear, bring, etc.)
- Share dos and don'ts for interviews

IMPORTANT FORMATTING RULES:
- Use clear sections with headings
- Use numbered lists (1., 2., 3.) for steps or tips
- Use bullet points (•) for dos/don'ts or examples
- Keep paragraphs short (2-3 sentences max)
- Add line breaks between sections
- Be encouraging and positive

Example format:
**Preparation Steps:**
1. Step one
2. Step two

**Do's:**
• Do this
• Do that

**Don'ts:**
• Avoid this
• Avoid that

Keep total response under 200 words.`
    };

    const systemPrompt = topicPrompts[topic] || topicPrompts["Behavioral"];

    // Build conversation history (keep last 4 messages for context)
    const historyText = history.slice(-4).map(msg =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    const prompt = `${systemPrompt}

${historyText ? `Previous conversation:\n${historyText}\n` : ''}
User's question: ${message}

Provide a helpful, well-formatted answer following the formatting rules above:`;

    try {
      return await this.callAI(prompt, onStatus);
    } catch (error: any) {
      throw new Error(`Interview assistant chat failed: ${error.message}`);
    }
  }

  /**
   * HUB 5: Analyze Code - Student-Friendly Version
   */
  async analyzeCode(code: string, onStatus?: AIStatusCallback) {
    const prompt = `You are a friendly coding tutor helping a student understand their code.

Analyze this code and explain in simple, encouraging terms:

Code:
\`\`\`
${code}
\`\`\`

Respond ONLY in this JSON format (no extra text):
{
  "whatItDoes": "Brief 1-2 sentence explanation of what this code does",
  "expectedOutput": "Describe what output/result this code produces with a simple example",
  "codeQuality": "Works correctly" or "Has issues: [brief issue description]",
  "tips": ["Simple tip 1", "Simple tip 2", "Simple tip 3"],
  "performance": "Fast" or "Medium" or "Slow for large inputs (1000+ items)"
}

Rules:
- Use simple language, avoid technical jargon
- NO Big O notation (O(n), O(n²), etc.) - just say "fast", "medium", or "slow"
- Keep tips short and actionable
- Be encouraging and helpful
- Focus on what the code DOES and what OUTPUT it produces`;

    try {
      const response = await this.callAI(prompt, onStatus);

      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback if AI doesn't return proper JSON
      return {
        whatItDoes: "Code analysis completed",
        expectedOutput: response.slice(0, 200),
        codeQuality: "See details below",
        tips: ["Review the full analysis for suggestions"],
        performance: "Unable to determine"
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
