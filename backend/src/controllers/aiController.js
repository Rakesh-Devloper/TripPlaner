// AI Controller for Travel Planning & Assistant Chat
import { generateAIPlanTrip, askAITravelAssistant } from '../services/geminiService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const planTrip = async (req, res) => {
  try {
    const plan = await generateAIPlanTrip(req.body);
    return successResponse(res, { plan }, 'Trip planned successfully');
  } catch (err) {
    return errorResponse(res, 'Failed to plan trip with AI', 500, err);
  }
};

export const chatAssistant = async (req, res) => {
  try {
    const { message, context } = req.body;
    const answer = await askAITravelAssistant(message || 'Help me plan my trip', context);
    return successResponse(res, answer, 'Chat response generated');
  } catch (err) {
    return errorResponse(res, 'Failed to get chat response', 500, err);
  }
};

export default {
  planTrip,
  chatAssistant,
};
