"""
app.py
Master Control Center for Startup Funding Intelligence System

Controls:
1️⃣ Ingest PDFs
2️⃣ Build Vector DB
3️⃣ Semantic Search
4️⃣ Full RAG Answer Mode
"""

import os
import json

# ----------------------------
# IMPORT PIPELINE MODULES
# ----------------------------
from ingestion.pipeline import process_pdf

# ----------------------------
# VECTOR DB
# ----------------------------
from vector_store.build_store import build_vector_database
from vector_store.retriever import Retriever

# ----------------------------
# RAG ENGINE
# ----------------------------
from rag.rag_engine import RAGEngine


# ----------------------------
# PATHS
# ----------------------------
RAW_DIR = "data/raw"
PROCESSED_DIR = "data/processed"
CHUNK_DIR = "data/chunks"


# ----------------------------
# UTILITY
# ----------------------------
def ensure_dirs():
    os.makedirs(RAW_DIR, exist_ok=True)
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    os.makedirs(CHUNK_DIR, exist_ok=True)


# ----------------------------
# SAVE HELPERS
# ----------------------------
def save_processed(filename, text):
    path = os.path.join(PROCESSED_DIR, filename.replace(".pdf", "_clean.txt"))
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"✔ Saved Clean Text → {path}")


def save_chunks(filename, chunks, metadata):
    path = os.path.join(CHUNK_DIR, filename.replace(".pdf", "_chunks.json"))

    result = {
        "file_name": filename,
        "chunk_count": len(chunks),
        "metadata": metadata,
        "chunks": chunks,
    }

    with open(path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"✔ Saved Chunks → {path}")


# ----------------------------
# INGEST PDFs
# ----------------------------
def ingest_pdfs():
    ensure_dirs()

    files = [f for f in os.listdir(RAW_DIR) if f.lower().endswith(".pdf")]

    if not files:
        print("\n⚠ No PDF files found in data/raw/")
        print("👉 Please add PDFs inside data/raw/ and try again.")
        return

    for file in files:
        print("\n======================================")
        print(f"📄 Processing: {file}")
        print("======================================")

        path = os.path.join(RAW_DIR, file)
        result = process_pdf(path)

        save_processed(file, result["raw_text"])
        save_chunks(file, result["chunks"], result["metadata"])

        print("\n🎯 Completed")
        print(f"Language : {result['language']}")
        print(f"Pages    : {result['page_count']}")
        print(f"Chunks   : {len(result['chunks'])}")


# ----------------------------
# SEARCH MODE
# ----------------------------
def interactive_search():
    try:
        retriever = Retriever()
        
        print("\n" + "="*50)
        print("🔍 Semantic Search Mode")
        print("="*50)
        print("Type 'exit' to return to main menu\n")
        
        while True:
            query = input("💬 Ask something about startup funding: ").strip()

            if query.lower() in ['exit', 'quit', 'q']:
                print("\n👋 Returning to main menu...\n")
                break

            if not query:
                continue

            try:
                docs, metas = retriever.search(query, top_k=3)

                if not docs:
                    print("\n❌ No results found. Try a different question or check if vector database is built.\n")
                    continue

                print("\n" + "-"*50)
                print(f"📚 Found {len(docs)} result(s):\n")
                
                for i, (doc, meta) in enumerate(zip(docs, metas), 1):
                    print(f"Result #{i}")
                    print("-" * 50)
                    print(doc[:600])
                    if len(doc) > 600:
                        print("...")
                    print(f"\nSource: {meta.get('source_file', 'unknown')}")
                    print(f"Language: {meta.get('language', 'unknown')}")
                    print(f"Type: {meta.get('document_type', 'unknown')}\n")
                    
            except Exception as e:
                print(f"\n❌ Error searching: {e}")
                print("Please try again or type 'exit' to return.\n")
    
    except Exception as e:
        print(f"\n❌ Error initializing retriever: {e}")
        print("Make sure you have built the vector database first (option 2)\n")


# ----------------------------
# RAG MODE
# ----------------------------
def rag_chat_mode():
    try:
        engine = RAGEngine()

        print("\n" + "="*50)
        print("🤖 RAG Startup Funding Assistant")
        print("="*50)
        print("Ask me anything about startup funding!")
        print("Type 'exit' or 'quit' to return to main menu.\n")

        while True:
            query = input("💬 Your Question: ").strip()

            if query.lower() in ['exit', 'quit', 'q']:
                print("\n👋 Returning to main menu...\n")
                break

            if not query:
                continue

            try:
                result = engine.ask(query, debug=False)

                print("\n" + "="*60)
                print("📝 ANSWER")
                print("="*60)
                print(result["answer"])
                print("="*60)

                if result.get("references"):
                    print("\n📚 Sources Used:")
                    for i, ref in enumerate(result["references"], 1):
                        print(f"  {i}. {ref.get('source_file', 'unknown')} ({ref.get('language', 'unknown')})")

                print(f"\nStatus: {result.get('status', 'unknown')}\n")

            except Exception as e:
                print(f"\n❌ Error processing question: {e}")
                print("Please try again or type 'exit' to return.\n")

    except Exception as e:
        print(f"\n❌ Error initializing RAG engine: {e}")
        print("Make sure:")
        print("  1. Vector database is built (option 2)")
        print("  2. GROQ_API_KEY environment variable is set")
        print("  3. You have internet connection\n")


# ----------------------------
# MAIN MENU
# ----------------------------
if __name__ == "__main__":
    print("\n🚀 Startup Funding Intelligence System")
    print("======================================")
    print("1️⃣ Ingest PDFs (Extract + Clean + Chunk)")
    print("2️⃣ Build Vector Database")
    print("3️⃣ Semantic Search (Retriever Only)")
    print("4️⃣ Ask RAG Assistant (LLM + Retrieval)")
    print("5️⃣ Exit")
    print("======================================")

    while True:
        choice = input("\n👉 Enter your choice: ")

        if choice == "1":
            ingest_pdfs()

        elif choice == "2":
            build_vector_database()

        elif choice == "3":
            interactive_search()

        elif choice == "4":
            rag_chat_mode()

        else:
            print("\n✨ Exiting System. See you later!")
            break
