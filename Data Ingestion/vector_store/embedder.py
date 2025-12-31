"""
embedder.py
High-quality multilingual embedding engine

Features:
✔ Multilingual Sentence Transformer
✔ Handles Hindi, Tamil, Telugu, Kannada, Bengali, English etc.
✔ Batch embedding support
✔ L2 normalization (improves semantic similarity)
✔ Caching for repeat embeddings
✔ Lightweight & production safe
"""

from sentence_transformers import SentenceTransformer
import numpy as np
from functools import lru_cache


class EmbeddingEngine:
    def __init__(self):
        print("🔄 Loading Multilingual Embedding Model...")

        self.model_name = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        self.model = SentenceTransformer(self.model_name)

        print("✅ Embedding Model Loaded Successfully")
        print(
            "🌍 Multilingual Ready: Hindi | Tamil | Telugu | Kannada | Bengali | English"
        )

    # ------------------------------
    # Normalize embedding
    # ------------------------------
    def _normalize(self, vector):
        norm = np.linalg.norm(vector)
        if norm == 0:
            return vector
        return vector / norm

    # ------------------------------
    # Cache single embeddings
    # ------------------------------
    @lru_cache(maxsize=5000)
    def get_embedding(self, text: str):
        if not text or not text.strip():
            # Return empty numpy array instead of empty list
            return np.array([])

        emb = self.model.encode(text)
        emb = self._normalize(emb)

        return emb

    # ------------------------------
    # Batch embedding support
    # ------------------------------
    def get_batch_embeddings(self, texts):
        embeddings = self.model.encode(texts)

        normalized = []
        for e in embeddings:
            normalized.append(self._normalize(e))

        return normalized


# -----------------------------------------
# Manual Test
# -----------------------------------------
if __name__ == "__main__":
    engine = EmbeddingEngine()

    sample = "Tamil Nadu government startup funding policy"
    emb = engine.get_embedding(sample)

    print("\nEmbedding created!")
    print("Vector length:", len(emb))
    print("Preview (first 10 values):", emb[:10])
