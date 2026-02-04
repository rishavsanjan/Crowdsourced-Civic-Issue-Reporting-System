from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import joblib

app = Flask(__name__)

# Load the trained classifier
clf = joblib.load("./department_classifier_bert.pkl")

# Load the SentenceTransformer model
with open("./embedding_model_name.txt", "r") as f:
    model_name = f.read().strip()

model = SentenceTransformer(model_name)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    complaint = data.get("complaint", "")
    
    if not complaint:
        return jsonify({"error": "Complaint text is required"}), 400

    embedding = model.encode([complaint])
    department = clf.predict(embedding)[0]
    confidence = max(clf.predict_proba(embedding)[0])

    return jsonify({
        "complaint": complaint,
        "predicted_department": department,
        "confidence": round(float(confidence), 3)
    })

if __name__ == "__main__":
    app.run(debug=True, port=8000) 

