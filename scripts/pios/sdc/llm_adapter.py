"""
Semantic Derivation Compiler — LLM Adapter (P-8)
Provider-isolated LLM call boundary.
Structured prompt → structured JSON response.
Provider-specific logic stays HERE; governance logic stays OUT.
"""

import json
import os
import sys
from dataclasses import dataclass
from typing import Optional


@dataclass
class LLMResponse:
    content: str
    model: str
    usage: dict
    raw_response: Optional[object] = None

    def parse_json(self) -> dict:
        text = self.content.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())


class LLMAdapterError(Exception):
    pass


class LLMProviderUnavailable(LLMAdapterError):
    pass


def _get_provider() -> str:
    if os.environ.get("ANTHROPIC_API_KEY"):
        return "anthropic"
    if os.environ.get("SDC_LLM_PROVIDER"):
        return os.environ["SDC_LLM_PROVIDER"]
    return "anthropic"


def call_llm(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.0,
    max_tokens: int = 8192,
    model: Optional[str] = None,
) -> LLMResponse:
    """
    Single entry point for all LLM calls from the compiler.
    Returns structured response. Raises LLMProviderUnavailable on failure.
    """
    provider = _get_provider()

    if provider == "anthropic":
        return _call_anthropic(system_prompt, user_prompt, temperature, max_tokens, model)
    else:
        raise LLMProviderUnavailable(f"Unknown LLM provider: {provider}")


def _call_anthropic(
    system_prompt: str,
    user_prompt: str,
    temperature: float,
    max_tokens: int,
    model: Optional[str],
) -> LLMResponse:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise LLMProviderUnavailable(
            "ANTHROPIC_API_KEY not set. AI-assisted phases require an API key."
        )

    try:
        import anthropic
    except ImportError:
        raise LLMProviderUnavailable(
            "anthropic package not installed. Run: pip install anthropic"
        )

    resolved_model = model or os.environ.get("SDC_MODEL", "claude-sonnet-4-20250514")

    try:
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model=resolved_model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
    except Exception as e:
        raise LLMProviderUnavailable(f"Anthropic API call failed: {e}")

    content = ""
    for block in response.content:
        if block.type == "text":
            content += block.text

    return LLMResponse(
        content=content,
        model=resolved_model,
        usage={
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
        },
        raw_response=response,
    )
