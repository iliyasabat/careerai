from __future__ import annotations

from typing import Iterable

import numpy as np
from sentence_transformers import SentenceTransformer


_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
_MODEL = SentenceTransformer(_MODEL_NAME)


def embed_text(text: str) -> list[float]:
    vec = _MODEL.encode([text], normalize_embeddings=True)[0]
    return vec.astype(float).tolist()


def embed_batch(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    vecs = _MODEL.encode(texts, normalize_embeddings=True)
    return [v.astype(float).tolist() for v in vecs]


def cosine_similarity(a: Iterable[float], b: Iterable[float]) -> float:
    va = np.asarray(list(a), dtype=np.float32)
    vb = np.asarray(list(b), dtype=np.float32)
    denom = (np.linalg.norm(va) * np.linalg.norm(vb)) or 1.0
    return float(np.dot(va, vb) / denom)
