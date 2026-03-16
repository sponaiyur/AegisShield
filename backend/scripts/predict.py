import joblib
import re
import nltk
from pathlib import Path
from nltk.corpus import stopwords

# Ensure stopwords exist
nltk.download("stopwords", quiet=True)

stop_words = set(stopwords.words("english"))

ROOT_DIR = Path(__file__).resolve().parents[2]
MODELS_DIR = ROOT_DIR / "backend" / "models"

# Load trained model and vectorizer
model = joblib.load(MODELS_DIR / "misinformation_model.pkl")
vectorizer = joblib.load(MODELS_DIR / "tfidf_vectorizer.pkl")


def clean_text(text):
    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+", "", text)

    # Remove non alphabet characters
    text = re.sub(r"[^a-zA-Z ]", "", text)

    words = text.split()

    # Remove stopwords
    words = [w for w in words if w not in stop_words]

    return " ".join(words)


def predict(text):

    text = clean_text(text)

    vec = vectorizer.transform([text])

    probs = model.predict_proba(vec)[0]

    true_prob = float(probs[0])
    fake_prob = float(probs[1])

    label = "fake" if fake_prob > true_prob else "true"

    confidence_score = max(fake_prob, true_prob)
    if confidence_score > 0.8:
        confidence = "high"
    elif confidence_score > 0.6:
        confidence = "medium"
    else:
        confidence = "low"

    return {
        # Canonical response shape used by FastAPI endpoint.
        "label": label,
        "fake_probability": round(fake_prob, 4),
        "true_probability": round(true_prob, 4),
        "confidence": confidence,
        # Backward-compatible aliases used by older scripts.
        "prediction": label,
        "real_probability": round(true_prob, 4)
    }

if __name__ == "__main__":

    print("\nTesting model with sample inputs:\n")

    sample1 = "Doctors claim that drinking garlic water can cure COVID instantly without vaccines"
    print(sample1)
    print(predict(sample1))

    print()

    sample2 = "The World Health Organization said vaccines remain the safest and most effective protection against COVID"
    print(sample2)
    print(predict(sample2))