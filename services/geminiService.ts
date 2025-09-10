import { GoogleGenAI, Type } from "@google/genai";
import type { Book, Chapter, Question, QuizResult, ReportData, Difficulty } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const generateWithSchema = async <T,>(prompt: string, schema: any, disableThinking = false): Promise<T> => {
    try {
        const config: any = {
            responseMimeType: "application/json",
            responseSchema: schema,
        };
        if (disableThinking) {
            config.thinkingConfig = { thinkingBudget: 0 };
        }
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config,
        });
        let jsonText = response.text.trim();
        // Clean up potential markdown formatting before parsing
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.slice(7, -3).trim();
        } else if (jsonText.startsWith("```")) {
            jsonText = jsonText.slice(3, -3).trim();
        }
        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to generate content from AI. The response may not be valid JSON.");
    }
};

export const getBooks = async (subject: string): Promise<Book[]> => {
  let prompt: string;
  const publicationsList = "NCERT, RS Aggarwal, S. Chand, Lakhmir Singh, Oswaal Books, Arihant Publications, Evergreen Publications, Ratna Sagar, Frank EMU Books, Creative Kids, and other relevant publications";

  if (subject === 'Social Science') {
    prompt = `Generate a list of 10 popular 8th-grade Social Science textbooks used in India. The list should contain a mix of books covering History, Geography, and Civics (Social and Political Life). Include books from a variety of publications like ${publicationsList}.`;
  } else {
    prompt = `Generate a list of 10 popular 8th-grade ${subject} textbooks used in India from a wide range of different publications. Include publications like ${publicationsList}.`;
  }

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        publication: { type: Type.STRING },
        title: { type: Type.STRING },
      },
      required: ["publication", "title"],
    },
  };
  return generateWithSchema<Book[]>(prompt, schema);
};

export const getChapters = async (subject: string, bookTitle: string, publication: string): Promise<Chapter[]> => {
  const prompt = `Generate a comprehensive list of all chapter titles for the 8th-grade ${subject} textbook "${bookTitle}" by ${publication}.`;
  const schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING }
        },
        required: ["name"]
    }
  };
  return generateWithSchema<Chapter[]>(prompt, schema);
};

export const getQuestions = async (subject: string, bookTitle: string, publication: string, chapter: string, batch: number, difficulty: Difficulty): Promise<Question[]> => {
    const difficultyPrompt = difficulty === 'Classic'
        ? "The difficulty for this set should be a mix of Easy, Medium, and Hard questions."
        : `The difficulty level for this set of questions should be: ${difficulty}.`;

    const prompt = `You are an expert question designer for 8th-grade Indian students. Generate a set of 10 multiple-choice questions for the chapter "${chapter}" from the ${subject} book "${bookTitle}" by ${publication}.
${difficultyPrompt}
For each question, provide the question text, four options (A, B, C, D), the correct answer key (e.g., 'A'), and its difficulty level ('Easy', 'Medium', or 'Hard'). Ensure questions are relevant to the Indian CBSE curriculum.`;
    
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING },
                options: {
                    type: Type.OBJECT,
                    properties: {
                        A: { type: Type.STRING },
                        B: { type: Type.STRING },
                        C: { type: Type.STRING },
                        D: { type: Type.STRING },
                    },
                    required: ["A", "B", "C", "D"],
                },
                correctAnswer: { type: Type.STRING },
                difficulty: { type: Type.STRING },
            },
            required: ["question", "options", "correctAnswer", "difficulty"],
        }
    };

    return generateWithSchema<Question[]>(prompt, schema);
};


export const generateReport = async (subject: string, chapter: string, results: QuizResult[]): Promise<ReportData> => {
    const performanceData = results.map(r => ({
        question: r.question.question,
        difficulty: r.question.difficulty,
        userAnswer: r.userAnswer ? `${r.userAnswer}: ${r.question.options[r.userAnswer]}` : "Skipped",
        correctAnswer: `${r.question.correctAnswer}: ${r.question.options[r.question.correctAnswer]}`,
        isCorrect: r.isCorrect,
    }));
    
    const prompt = `An 8th-grade student has completed a quiz on the chapter '${chapter}' in the subject '${subject}'. Here is their performance data:
    ${JSON.stringify(performanceData)}

    Analyze this performance and generate a detailed report card. The report should be encouraging and constructive. It must include:
    1. A brief, motivational summary of their performance.
    2. The final percentage score, calculated from the data.
    3. A 'Strengths' section highlighting topics or types of questions they answered correctly.
    4. An 'Areas for Improvement' section. For each incorrect answer, identify the core concept, explain why their answer was wrong, and clarify the correct concept.
    5. A 'Key Topics to Review' section with a list of 3-5 specific concepts from the chapter they should focus on.
    6. A 'Topic Analysis' section. Identify 2-3 specific concepts or question types the student struggled with (e.g., "Word problems involving percentages," "Identifying metaphors"). For each, describe their performance and give a short, actionable recommendation.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            score: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementAreas: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        userAnswer: { type: Type.STRING },
                        correctAnswer: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                    },
                    required: ["question", "userAnswer", "correctAnswer", "explanation"],
                },
            },
            reviewTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            topicAnalysis: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        topic: { type: Type.STRING },
                        performance: { type: Type.STRING },
                        recommendation: { type: Type.STRING },
                    },
                    required: ["topic", "performance", "recommendation"],
                },
            },
        },
        required: ["summary", "score", "strengths", "improvementAreas", "reviewTopics", "topicAnalysis"],
    };

    return generateWithSchema<ReportData>(prompt, schema, true);
};