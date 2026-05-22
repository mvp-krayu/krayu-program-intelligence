"""Chronicle event emission for cognitive genesis replay."""

from .emitter import ChronicleEmitter
from .hero_moment_detector import detect_hero_moments

__all__ = ["ChronicleEmitter", "detect_hero_moments"]
