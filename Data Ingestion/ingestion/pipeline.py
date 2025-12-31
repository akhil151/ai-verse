"""
pipeline.py
Ultimate Ingestion Orchestrator ⚡
Brings together:
✔ pdf_loader
✔ cleaner
✔ chunker
✔ metadata
"""

from typing import Dict, List

from ingestion.pdf_loader import load_pdf
from ingestion.cleaner import normalize_text
from ingestion.chunker import hybrid_chunker
from ingestion.metadata_extractor import generate_metadata


def process_pdf(
    path: str, aggressive_clean: bool = False, chunk_size: int = 700
) -> Dict:
    """
    Main processing pipeline
    Returns:
    {
       chunks: [...]
       metadata: {...}
       page_count:
       language:
       raw_text:
    }
    """

    # Load PDF / OCR automatically
    pdf = load_pdf(path)

    raw_text = pdf["full_text"]

    # Clean
    mode = "aggressive" if aggressive_clean else "basic"
    cleaned = normalize_text(raw_text, mode=mode)

    language = cleaned["language"]
    clean_text = cleaned["clean_text"]

    # Chunk
    chunks: List[str] = hybrid_chunker(clean_text, chunk_size=chunk_size)

    # Metadata
    metadata = generate_metadata(
        file_path=path,
        language=language,
        doc_type="startup_policy",
        source="ingestion_pipeline",
        extra={"pages": len(pdf["pages"]), "used_ocr": pdf["used_ocr"]},
    )

    return {
        "chunks": chunks,
        "metadata": metadata,
        "page_count": len(pdf["pages"]),
        "language": language,
        "raw_text": raw_text,
    }


if __name__ == "__main__":
    path = "StartupPolicy.pdf"  # change to your file
    result = process_pdf(path)

    print("LANG:", result["language"])
    print("PAGES:", result["page_count"])
    print("CHUNKS:", len(result["chunks"]))
    print("META:", result["metadata"])
    print("SAMPLE:", result["chunks"][0][:500])
