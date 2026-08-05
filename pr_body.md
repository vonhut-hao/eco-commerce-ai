## Related Issues
Closes #55

## Changes
**Backend** (2afed0e): Switch Gemini API to `interactions` and manually parse JSON due to model output formatting.
**Backend** (2afed0e): Inject product catalog into system prompt to provide full environmental context and prevent hallucinations.
**Frontend** (2afed0e): Implement `renderMarkdown` to support bold, italics, headers, lists, and horizontal rules natively.
**Frontend** (2afed0e): Fix `activeProductId` state loss on page refresh using `sessionStorage` in `App.tsx`.
**Frontend** (2afed0e): Enhance chatbot with `ChatbotIntent` support (pre-filled messages, auto-send prompts, specific tab routing).
**Frontend** (2afed0e): Remove annoying pre-chat promotional widget and make floating bot button toggle chat properly.
