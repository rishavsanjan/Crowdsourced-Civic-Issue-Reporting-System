from sentence_transformers import SentenceTransformer
import joblib

# Load classifier
clf = joblib.load("./department_classifier_bert.pkl")

# Load SentenceTransformer model
with open("./embedding_model_name.txt", "r") as f:
    model_name = f.read().strip()

model = SentenceTransformer(model_name)
