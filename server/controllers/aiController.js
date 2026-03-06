const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client
// The SDK automatically picks up the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({});

exports.askTutor = async (req, res, next) => {
  try {
    const { questionContext, userPrompt } = req.body;

    if (!questionContext || !userPrompt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both the question context and your specific doubt.',
      });
    }

    const systemInstruction = `You are a strict but encouraging, highly expert Chartered Accountancy (CA) tutor at CaQuest.
You are helping a student understand a specific practice question. 
Here is the context of the question they are struggling with:
---
Question: ${questionContext.questionText}
Type: ${questionContext.type}
Options: ${questionContext.options ? questionContext.options.join(' | ') : 'Subjective'}
Correct Answer: ${questionContext.correctAnswerText || 'N/A'}
Official Explanation: ${questionContext.explanation || 'N/A'}
---
Your rules:
1. Answer the student's specific question directly based on the context above.
2. Be extremely clear, concise, and focused on ICAI syllabus concepts.
3. Do not solve homework or answer queries entirely unrelated to CA exams. If they drift, politely refocus them on the question context.
4. Format your response using clean Markdown (bolding key terms, using bullet points if needed).`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: userPrompt }] }
        ],
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
        }
    });

    res.status(200).json({
      success: true,
      text: response.text,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to communicate with the Native AI Tutor. Please verify your API key and try again.',
      error: error.message
    });
  }
};
