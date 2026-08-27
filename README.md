# 🧠 Credeasy (AltCreditScoreAI)

**Bridging the Financial Inclusion Gap**  
AI-powered credit scoring designed for over 1.4 billion unbanked individuals globally who are excluded from formal credit due to a lack of traditional bank records. Built for the HyperFUSION 2026 hackathon (Theme: Fin-Tech), this project provides lenders with a clear, explainable way to assess risk and offers actionable recommendations to applicants.

---

## 🚀 Features

- **Explainable AI (XAI) & Actionable Insights:** The dashboard not only predicts default probabilities but also provides personalized, actionable recommendations for applicants on how to improve their credit profile.
- **FastAPI Backend:** A robust Python backend serving live predictions using a trained Machine Learning model.
- **Modern React Dashboard:** A sleek, premium web interface built with Vite and React for real-time risk assessment and data visualization.
- **Advanced Model Evaluation:** While the live API uses an interpretable **Logistic Regression** model, the data pipeline also trains and evaluates **XGBoost** and **LightGBM** to compare performance metrics (ROC, F1, Precision-Recall, Confusion Matrix).

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, CSS (Responsive Dark Mode)
- **Backend:** FastAPI, Pydantic, Uvicorn
- **Machine Learning:** Scikit-Learn, XGBoost, LightGBM, Pandas, Joblib

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/dasouvik122005/Credeasy.git
cd Credeasy
```

### 2. Run the Backend (Python / FastAPI)
You will need Python installed along with the required C++ build tools (especially for compiling some data science dependencies on Windows).

```bash
# Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn src.api.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

### 3. Run the Frontend Dashboard (Node.js / React)
Open a new terminal window, navigate to the `dashboard` directory, and start the Vite development server.

```bash
cd dashboard
npm install
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

---

## 📄 License
This project is licensed under the **MIT License**.
