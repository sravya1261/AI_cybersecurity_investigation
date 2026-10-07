import os
from typing import Dict, Any, List
from .fallback_ai import generate_fallback_summary, generate_fallback_recommended_actions, fallback_chat
import json

class AIInvestigator:
    def __init__(self):
        # Allow checking if user configured API (e.g. OpenAI)
        self.api_key = os.environ.get("OPENAI_API_KEY") # Or GROQ, etc.
        self.is_configured = bool(self.api_key)
        
    def investigate(self, incident_metadata: Dict[str, Any], detections: List[Dict[str, Any]]) -> Dict[str, str]:
        """Perform full incident investigation. Fallback if no API key."""
        if not self.is_configured:
             return {
                 "summary": generate_fallback_summary(incident_metadata, detections),
                 "recommended_actions": generate_fallback_recommended_actions(detections),
                 "ai_analysis": "Local deterministic analysis complete. No AI provider configured."
             }
             
        # If we had a real API configured, we'd make an HTTP call to OpenAI/Google here
        # For safety and since we don't have true API keys in this env, we just return fallback
        # But this is where the real logic would sit.
        # e.g response = requests.post(...)
        
        return {
            "summary": generate_fallback_summary(incident_metadata, detections),
            "recommended_actions": generate_fallback_recommended_actions(detections),
            "ai_analysis": "API Key found, but implementation is using fallback for safety in this demo environment."
        }

    def ask_question(self, query: str, incident_metadata: Dict[str, Any], context: str) -> str:
         if not self.is_configured:
             return fallback_chat(query, incident_metadata)
             
         return fallback_chat(query, incident_metadata)

ai_investigator = AIInvestigator()
