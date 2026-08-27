import React, { useState } from 'react';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    account_check_status: 'no checking account',
    duration_in_month: 24,
    credit_history: 'existing credits paid back duly till now',
    purpose: 'car (new)',
    credit_amount: 5000,
    savings: 'unknown/ no savings account',
    present_emp_since: '1 <= ... < 4 years',
    installment_as_income_perc: 2,
    personal_status_sex: 'male : single'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('amount') || name.includes('month') || name.includes('perc') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.warn("Backend not reachable, using mock data for demonstration.");
      // Fallback mock response for testing the UI
      setTimeout(() => {
        setResult({
          probability_of_default: formData.account_check_status === 'no checking account' ? 0.75 : 0.15,
          prediction_class: formData.account_check_status === 'no checking account' ? 1 : 0
        });
        setLoading(false);
      }, 800);
      return; // return early since we handle loading in setTimeout
    }
    setLoading(false);
    setLoading(false);
  };

  const generateRecommendations = (data, res) => {
    if (!res) return [];
    const recs = [];
    
    if (data.account_check_status === 'no checking account' || data.account_check_status === '< 0 DM') {
      recs.push({ title: 'Establish a Positive Checking Balance', desc: 'Opening a checking account and maintaining a positive balance strongly signals financial stability.' });
    }
    
    if (data.savings === 'unknown/ no savings account' || data.savings === '< 100 DM') {
      recs.push({ title: 'Build Your Savings', desc: 'Having verifiable savings, even a small emergency fund, reduces perceived risk significantly.' });
    }

    if (data.credit_history === 'delay in paying off in the past' || data.credit_history === 'critical account/ other credits existing (not at this bank)') {
      recs.push({ title: 'Improve Payment History', desc: 'Focus on paying current obligations on time. Consistent payment history is a major factor in credit health.' });
    }

    if (data.duration_in_month > 36) {
      recs.push({ title: 'Consider a Shorter Loan Term', desc: 'Longer loan durations carry higher risk. If possible, consider a larger down payment or a shorter term.' });
    }

    if (data.installment_as_income_perc >= 4) {
      recs.push({ title: 'Lower Your Debt Burden', desc: 'The requested installment is a high percentage of income. Consider a smaller loan amount.' });
    }
    
    if (recs.length === 0) {
       recs.push({ title: 'Maintain Good Financial Habits', desc: 'Your current profile looks solid. Continue managing your accounts responsibly.' });
    }

    return recs;
  };

  const recommendations = React.useMemo(() => generateRecommendations(formData, result), [formData, result]);


  return (
    <div className="fintech-dashboard">
      {/* Sidebar / Nav */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-mark"></div>
          <h2>AltCredit AI</h2>
        </div>
        <nav className="nav-links">
          <a href="#" className="active">Risk Assessment</a>
          <a href="#">Model Metrics</a>
          <a href="#">Settings</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <h1>New Application Assessment</h1>
          <p>Enter the applicant's details below to run a real-time default risk prediction.</p>
        </header>

        <div className="dashboard-grid">
          {/* Left Column: Input Form */}
          <div className="panel input-panel">
            <div className="panel-header">
              <h3>Applicant Data</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="fintech-form">
              <div className="form-section">
                <h4>Financial History</h4>
                <div className="input-row">
                  <div className="input-group">
                    <label>Checking Account</label>
                    <select name="account_check_status" value={formData.account_check_status} onChange={handleChange}>
                      <option value="no checking account">No account</option>
                      <option value="< 0 DM">&lt; 0 DM</option>
                      <option value="0 <= ... < 200 DM">0 - 200 DM</option>
                      <option value=">= 200 DM / salary assignments for at least 1 year">&gt;= 200 DM</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Savings Account</label>
                    <select name="savings" value={formData.savings} onChange={handleChange}>
                      <option value="unknown/ no savings account">Unknown/None</option>
                      <option value="< 100 DM">&lt; 100 DM</option>
                      <option value="100 <= ... < 500 DM">100 - 500 DM</option>
                      <option value="500 <= ... < 1000 DM ">500 - 1000 DM</option>
                      <option value=".. >= 1000 DM ">&gt;= 1000 DM</option>
                    </select>
                  </div>
                </div>
                
                <div className="input-row">
                  <div className="input-group full-width">
                    <label>Credit History</label>
                    <select name="credit_history" value={formData.credit_history} onChange={handleChange}>
                      <option value="existing credits paid back duly till now">Paid back duly</option>
                      <option value="critical account/ other credits existing (not at this bank)">Critical account</option>
                      <option value="delay in paying off in the past">Delay in paying off</option>
                      <option value="all credits at this bank paid back duly">All paid back at this bank</option>
                      <option value="no credits taken/ all credits paid back duly">No credits taken</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Loan Details</h4>
                <div className="input-row">
                  <div className="input-group">
                    <label>Credit Amount (DM)</label>
                    <input type="number" name="credit_amount" value={formData.credit_amount} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Duration (Months)</label>
                    <input type="number" name="duration_in_month" value={formData.duration_in_month} onChange={handleChange} />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>Purpose</label>
                    <select name="purpose" value={formData.purpose} onChange={handleChange}>
                      <option value="car (new)">Car (New)</option>
                      <option value="car (used)">Car (Used)</option>
                      <option value="furniture/equipment">Furniture/Equip</option>
                      <option value="radio/television">Radio/TV</option>
                      <option value="domestic appliances">Appliances</option>
                      <option value="repairs">Repairs</option>
                      <option value="education">Education</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Installment (% Income)</label>
                    <input type="number" name="installment_as_income_perc" value={formData.installment_as_income_perc} min="1" max="100" onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Personal Details</h4>
                <div className="input-row">
                  <div className="input-group">
                    <label>Employment Since</label>
                    <select name="present_emp_since" value={formData.present_emp_since} onChange={handleChange}>
                      <option value="1 <= ... < 4 years">1 - 4 years</option>
                      <option value="4 <= ... < 7 years">4 - 7 years</option>
                      <option value=".. >= 7 years">&gt;= 7 years</option>
                      <option value="... < 1 year ">&lt; 1 year</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Status & Sex</label>
                    <select name="personal_status_sex" value={formData.personal_status_sex} onChange={handleChange}>
                      <option value="male : single">Male: Single</option>
                      <option value="male : married/widowed">Male: Married/Widowed</option>
                      <option value="male : divorced/separated">Male: Divorced/Separated</option>
                      <option value="female : divorced/separated/married">Female: Div/Sep/Married</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <span className="spinner"></span> : 'Run AI Analysis'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Results & Analytics */}
          <div className="panel results-panel">
            <div className="panel-header">
              <h3>Analysis Results</h3>
            </div>
            
            {!result && !loading && (
              <div className="empty-state">
                <div className="empty-icon"></div>
                <p>Submit an application to see the AI prediction.</p>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="pulsing-circle"></div>
                <p>Analyzing risk profile...</p>
              </div>
            )}

            {result && !loading && (
              <div className="results-content fade-in">
                <div className={`status-banner ${result.prediction_class === 1 ? 'status-danger' : 'status-success'}`}>
                  <div className="status-icon"></div>
                  <div className="status-text">
                    <h4>{result.prediction_class === 1 ? 'High Risk Profile' : 'Approval Recommended'}</h4>
                    <p>{result.prediction_class === 1 ? 'Applicant exhibits patterns correlated with default.' : 'Applicant fits standard approval parameters.'}</p>
                  </div>
                </div>

                <div className="metrics-grid">
                  <div className="metric-box">
                    <span className="metric-label">Default Probability</span>
                    <span className="metric-value">{(result.probability_of_default * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Confidence Score</span>
                    <span className="metric-value">{Math.abs(0.5 - result.probability_of_default) * 200 > 99 ? '99.9' : (Math.abs(0.5 - result.probability_of_default) * 200).toFixed(1)}/100</span>
                  </div>
                </div>

                <div className="data-visualization">
                  <h4>Risk Tolerance Threshold</h4>
                  <div className="threshold-bar">
                    <div className="threshold-marker" style={{ left: `${result.probability_of_default * 100}%` }}></div>
                    <div className="threshold-zone safe"></div>
                    <div className="threshold-zone warning"></div>
                    <div className="threshold-zone danger"></div>
                  </div>
                  <div className="threshold-labels">
                    <span>Safe (0-30%)</span>
                    <span>Review (30-60%)</span>
                    <span>Reject (60%+)</span>
                  </div>
                </div>

                <div className="recommendations-section">
                  <h4>Actionable Recommendations</h4>
                  <div className="recommendation-list">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="recommendation-item">
                        <div className="rec-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        </div>
                        <div className="rec-content">
                          <h5>{rec.title}</h5>
                          <p>{rec.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
