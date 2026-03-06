import api from '../../../shared/utils/api';

const askTutor = async (questionContext, userPrompt) => {
  const response = await api.post('/ai/ask', {
    questionContext,
    userPrompt
  });
  return response.data;
};

const aiService = {
  askTutor
};

export default aiService;
