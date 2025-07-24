import json
import faiss
import numpy as np
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

# === Configuration ===
MODEL_NAME = "BAAI/bge-small-en"
INDEX_PATH = "faiss_index.index"
STORE_PATH = "memory_store.json"
TOP_K = 5

# === Chargement modèle et index Faiss ===
print("Chargement du modèle d'embedding...")
model = SentenceTransformer(MODEL_NAME)
print("Chargement de l'index Faiss...")
index = faiss.read_index(INDEX_PATH)
with open(STORE_PATH, "r", encoding="utf-8") as f:
    memory_store = json.load(f)

# === Serveur Flask ===
app = Flask(__name__)

@app.route("/search", methods=["POST"])
def search():
    data = request.json
    query = data.get("query", "")
    top_k = data.get("top_k", TOP_K)

    if not query:
        return jsonify({"error": "No query provided."}), 400

    embedding = model.encode([query], convert_to_numpy=True)
    distances, indices = index.search(embedding, top_k)

    results = [memory_store[idx] for idx in indices[0]]
    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=7861)
