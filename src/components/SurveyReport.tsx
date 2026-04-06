import React from 'react';
import { User, ThumbsUp, ThumbsDown, MessageSquare, Share2, RefreshCw, Volume2, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface SurveyData {
    id: string;
    question: string;
    options: { label: string; votes: number; color: string }[];
    reason?: string;
    requester: string;
}

const mockSurveys: SurveyData[] = [
    {
        id: '1',
        question: 'Proposed changes to the weekly meditation schedule?',
        options: [
            { label: 'Option A: 6AM Start', votes: 42, color: '#3b82f6' },
            { label: 'Option B: 7AM Start', votes: 15, color: '#f97316' },
            { label: 'Option C: No Change', votes: 28, color: '#94a3b8' }
        ],
        reason: 'To better accommodate commuters from further distances.',
        requester: 'Admin Dept'
    },
    {
        id: '2',
        question: 'Utility of the new digital library system?',
        options: [
            { label: 'Very Useful', votes: 85, color: '#3b82f6' },
            { label: 'Acceptable', votes: 34, color: '#f97316' },
            { label: 'Needs Rework', votes: 12, color: '#94a3b8' }
        ],
        reason: 'Evaluating ROI on recent software acquisitions.',
        requester: 'IT Dept'
    }
];

const SurveyReport: React.FC = () => {
    return (
        <div className="survey-report-root">
            <header className="report-header">
                <h1 className="report-title">Survey Report</h1>
            </header>

            <div className="reports-container">
                {mockSurveys.map((survey) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={survey.id}
                        className="survey-report-card"
                    >
                        <div className="card-main-content">
                            {/* Left Side: Avatar */}
                            <div className="avatar-section">
                                <div className="avatar-circle-black">
                                    <User size={24} color="#000" />
                                </div>
                            </div>

                            {/* Center Section: Question & Info */}
                            <div className="details-section">
                                <h2 className="survey-question-text">{survey.question}</h2>
                                <div className="pill-container">
                                    {survey.options.map((opt, idx) => (
                                        <div key={idx} className="data-pill">
                                            <span className="pill-label">{opt.label}</span>
                                        </div>
                                    ))}
                                    {survey.reason && (
                                        <div className="data-pill reason-pill">
                                            <span className="pill-label italic">Reason: {survey.reason}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Analytics Chart */}
                            <div className="analytics-section">
                                <div className="result-container">
                                    <div className="result-header">
                                        <h3>Survey Result</h3>
                                    </div>
                                    <div className="bar-chart">
                                        {survey.options.map((opt, idx) => {
                                            const maxVotes = Math.max(...survey.options.map(o => o.votes));
                                            const heightPercentage = (opt.votes / maxVotes) * 100;
                                            return (
                                                <div key={idx} className="bar-wrapper">
                                                    <div
                                                        className="bar"
                                                        style={{
                                                            height: `${heightPercentage}%`,
                                                            backgroundColor: opt.color
                                                        }}
                                                    >
                                                        <span className="bar-val">{opt.votes}</span>
                                                    </div>
                                                    <span className="bar-label">{String.fromCharCode(65 + idx)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action Row */}
                        <div className="card-action-row">
                            <div className="action-icons-left">
                                <button className="action-icon-btn"><ThumbsUp size={18} /></button>
                                <button className="action-icon-btn"><ThumbsDown size={18} /></button>
                                <button className="action-icon-btn"><MessageSquare size={18} /></button>
                                <button className="action-icon-btn"><Share2 size={18} /></button>
                                <button className="action-icon-btn"><RefreshCw size={18} /></button>
                                <button className="action-icon-btn"><Volume2 size={18} /></button>
                            </div>
                            <div className="action-verified">
                                <CheckCheck size={20} className="text-green-600" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style>{`
                .survey-report-root {
                    background: #ffffff;
                    min-height: 100%;
                    padding: 2rem 3rem;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                .report-header {
                    margin-bottom: 2.5rem;
                }

                .report-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #1e293b;
                    text-decoration: underline;
                    text-underline-offset: 6px;
                    text-align: left;
                }

                .reports-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    max-width: 1200px;
                }

                .survey-report-card {
                    background: #ffffff;
                    border: 1px solid #bfdbfe;
                    border-radius: 16px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .card-main-content {
                    display: flex;
                    padding: 2rem;
                    gap: 2rem;
                }

                .avatar-section {
                    flex-shrink: 0;
                }

                .avatar-circle-black {
                    width: 52px;
                    height: 52px;
                    background: #3b82f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .details-section {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .survey-question-text {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                }

                .pill-container {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .data-pill {
                    padding: 0.6rem 1.25rem;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 9999px;
                    width: fit-content;
                }

                .pill-label {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #475569;
                }

                .reason-pill {
                    background: #f8fafc;
                    border-style: dashed;
                }

                .italic { font-style: italic; }

                .analytics-section {
                    width: 320px;
                    flex-shrink: 0;
                }

                .result-container {
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 1.25rem;
                    background: #ffffff;
                    height: 100%;
                }

                .result-header h3 {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 1.5rem;
                    text-align: center;
                }

                .bar-chart {
                    height: 180px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    gap: 1.5rem;
                    padding-top: 1rem;
                }

                .bar-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    height: 100%;
                    justify-content: flex-end;
                }

                .bar {
                    width: 36px;
                    border-radius: 8px 8px 0 0;
                    position: relative;
                    transition: height 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .bar-val {
                    position: absolute;
                    top: -24px;
                    width: 100%;
                    text-align: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .bar-label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #94a3b8;
                }

                .card-action-row {
                    background: #f8fafc;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #f1f5f9;
                }

                .action-icons-left {
                    display: flex;
                    gap: 1.5rem;
                }

                .action-icon-btn {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 4px;
                    transition: all 0.2s;
                }

                .action-icon-btn:hover {
                    color: #3b82f6;
                    transform: scale(1.1);
                }

                /* Responsiveness */
                @media (max-width: 992px) {
                    .card-main-content {
                        flex-direction: column;
                    }

                    .analytics-section {
                        width: 100%;
                    }

                    .result-container {
                        max-width: 400px;
                        margin: 0 auto;
                    }
                }

                @media (max-width: 600px) {
                    .survey-report-root {
                        padding: 1.5rem;
                    }

                    .action-icons-left {
                        gap: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default SurveyReport;
