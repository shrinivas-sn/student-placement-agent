import { Document, CodeSnippet } from "@shared/schema";

// Mock AI Service
export const aiService = {
  analyzeResume: async (content: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    return {
      score: 75,
      missingSkills: ["TypeScript", "GraphQL", "Docker"],
      improvements: "Consider adding more quantifiable metrics to your experience section."
    };
  },

  generateCoverLetter: async (jobDescription: string, resume: string) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return `Dear Hiring Manager,

I am writing to express my strong interest in the open position. Based on the job description "${jobDescription.slice(0, 50)}...", I believe my skills in modern web development align perfectly with your team's needs.

[AI Generated Content Placeholder based on resume...]

Sincerely,
[Your Name]`;
  },

  chatWithInterviewer: async (message: string, persona: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses: Record<string, string[]> = {
      "Strict HR": [
        "Can you elaborate on a time you faced a conflict at work?",
        "Why do you want to leave your current role?",
        "What are your salary expectations?"
      ],
      "Chill Tech Lead": [
        "Cool, so how would you optimize that React component?",
        "Have you ever broken production? What happened?",
        "What's your favorite tech stack right now?"
      ]
    };

    const options = responses[persona] || responses["Strict HR"];
    return options[Math.floor(Math.random() * options.length)];
  },

  analyzeCode: async (code: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      complexity: "O(n)",
      suggestions: [
        "Consider using a map for faster lookups.",
        "Variable naming could be more descriptive.",
        "Add error handling for edge cases."
      ]
    };
  }
};
