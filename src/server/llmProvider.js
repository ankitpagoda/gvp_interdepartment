import llmClient from './llmClient.js';

// Wrapper for future Copilot gpt-5-mini integration. For now, falls back to local parser for deterministic tests.
export async function callLLM({ user, message }) {
    try {
        if (process.env.COPILOT_API_KEY) {
            // TODO: Replace this placeholder with actual Copilot gpt-5-mini API call using Copilot SDK or fetch.
            // Keep a deterministic fallback to the local parser while developing and testing offline.
            return llmClient.parseMessage({ user, message });
        }
        return llmClient.parseMessage({ user, message });
    } catch (e) {
        return llmClient.parseMessage({ user, message });
    }
}

export default { callLLM };