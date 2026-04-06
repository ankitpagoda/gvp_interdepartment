import React, { useState } from 'react';
import { Plus, GripVertical, Trash2, ChevronDown, HelpCircle, MoreVertical, FileText, Settings, Eye, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SurveyBuilder: React.FC = () => {
    const [surveyTitle, setSurveyTitle] = useState('Untitled Survey');
    const [activeQuestion, setActiveQuestion] = useState(1);
    const [questions, setQuestions] = useState([
        { id: 1, text: 'What is your primary role in the organization?', type: 'Single Choice', required: true }
    ]);

    const addQuestion = () => {
        const newId = questions.length + 1;
        setQuestions([...questions, { id: newId, text: '', type: 'Single Choice', required: false }]);
        setActiveQuestion(newId);
    };

    return (
        <div className="survey-builder-root">
            {/* Toolbar / Header */}
            <div className="survey-toolbar">
                <div className="toolbar-left">
                    <FileText className="text-blue-500" size={20} />
                    <span className="toolbar-status">Draft saved 2m ago</span>
                </div>
                <div className="toolbar-right">
                    <button className="toolbar-btn"><Eye size={18} /> Preview</button>
                    <button className="toolbar-btn"><Settings size={18} /> Settings</button>
                    <button className="send-btn">Send Survey</button>
                </div>
            </div>

            <div className="survey-body">
                {/* Left Sidebar */}
                <aside className="survey-sidebar">
                    <div className="sidebar-header">
                        <h3>Questions ({questions.length})</h3>
                    </div>
                    <div className="sidebar-list">
                        {questions.map((q) => (
                            <motion.div
                                key={q.id}
                                whileHover={{ x: 4 }}
                                className={`sidebar-item ${activeQuestion === q.id ? 'active' : ''}`}
                                onClick={() => setActiveQuestion(q.id)}
                            >
                                <span className="q-num">{q.id}</span>
                                <span className="q-preview">{q.text || 'Untitled Question'}</span>
                            </motion.div>
                        ))}
                    </div>
                    <button className="add-q-sidebar" onClick={addQuestion}>
                        <Plus size={16} /> Add Question
                    </button>
                </aside>

                {/* Main Editor */}
                <main className="survey-main">
                    <div className="survey-editor-container">
                        {/* Survey Header Card */}
                        <div className="editor-card survey-header-card">
                            <input
                                type="text"
                                className="survey-title-input"
                                value={surveyTitle}
                                onChange={(e) => setSurveyTitle(e.target.value)}
                                placeholder="Untitled Survey"
                            />
                            <div className="title-divider"></div>
                            <input
                                type="text"
                                className="survey-desc-input"
                                placeholder="Add a description for this survey..."
                            />
                        </div>

                        {/* Question Editor Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeQuestion}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="editor-card question-card active"
                            >
                                <div className="card-top-bar">
                                    <GripVertical className="drag-handle" size={20} />
                                </div>
                                <div className="question-header-row">
                                    <div className="q-text-wrapper">
                                        <input
                                            type="text"
                                            className="question-input"
                                            placeholder="Enter your question here"
                                            defaultValue={questions.find(q => q.id === activeQuestion)?.text}
                                        />
                                    </div>
                                    <div className="type-selector">
                                        <div className="selector-inner">
                                            <span>Single Choice</span>
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div className="options-list">
                                    <div className="option-row">
                                        <div className="radio-circle"></div>
                                        <input type="text" className="option-input" defaultValue="Choice 1" />
                                    </div>
                                    <div className="option-row">
                                        <div className="radio-circle"></div>
                                        <input type="text" className="option-input" defaultValue="Choice 2" />
                                    </div>
                                    <button className="add-option-btn">+ Add choice</button>
                                </div>

                                <div className="card-footer">
                                    <div className="footer-left">
                                        <button className="footer-action-btn"><Copy size={18} /></button>
                                        <button className="footer-action-btn"><Trash2 size={18} /></button>
                                        <div className="action-divider"></div>
                                        <button className="footer-action-btn"><MoreVertical size={18} /></button>
                                    </div>
                                    <div className="footer-right">
                                        <div className="toggle-group">
                                            <span className="toggle-label">Required</span>
                                            <label className="ios-toggle">
                                                <input type="checkbox" defaultChecked={questions.find(q => q.id === activeQuestion)?.required} />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                        <div className="toggle-group">
                                            <span className="toggle-label">Show as dropdown</span>
                                            <label className="ios-toggle">
                                                <input type="checkbox" />
                                                <span className="toggle-slider"></span>
                                            </label>
                                            <HelpCircle size={16} className="text-gray-400 cursor-help" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Floating Action Bar */}
                        <div className="floating-actions">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="fab-add"
                                onClick={addQuestion}
                            >
                                <Plus size={24} />
                            </motion.button>
                        </div>
                    </div>
                </main>
            </div>

            <style>{`
                .survey-builder-root {
                    background: #f4f6f9;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }

                .survey-toolbar {
                    background: #ffffff;
                    padding: 0.75rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e1e4e8;
                    z-index: 10;
                }

                .toolbar-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .toolbar-status {
                    font-size: 0.8rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .toolbar-right {
                    display: flex;
                    gap: 1rem;
                }

                .toolbar-btn {
                    padding: 0.5rem 1rem;
                    background: transparent;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #475569;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .toolbar-btn:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                .send-btn {
                    padding: 0.5rem 1.5rem;
                    background: #3b82f6;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #ffffff;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
                    transition: all 0.2s;
                }

                .send-btn:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }

                .survey-body {
                    flex: 1;
                    display: flex;
                    overflow: hidden;
                }

                .survey-sidebar {
                    width: 280px;
                    background: #ffffff;
                    border-right: 1px solid #e1e4e8;
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem 1rem;
                }

                .sidebar-header h3 {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 1.5rem;
                    padding-left: 0.5rem;
                }

                .sidebar-list {
                    flex: 1;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }

                .sidebar-item:hover {
                    background: #f8fafc;
                }

                .sidebar-item.active {
                    background: #eff6ff;
                    border-color: #bfdbfe;
                }

                .q-num {
                    width: 24px;
                    height: 24px;
                    background: #f1f5f9;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #475569;
                }

                .sidebar-item.active .q-num {
                    background: #3b82f6;
                    color: #ffffff;
                }

                .q-preview {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #475569;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .sidebar-item.active .q-preview {
                    color: #1e40af;
                    font-weight: 600;
                }

                .add-q-sidebar {
                    margin-top: 1rem;
                    width: 100%;
                    padding: 0.75rem;
                    background: #f8fafc;
                    border: 1.5px dashed #cbd5e1;
                    border-radius: 12px;
                    color: #64748b;
                    font-size: 0.85rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .add-q-sidebar:hover {
                    background: #f1f5f9;
                    border-color: #94a3b8;
                    color: #475569;
                }

                .survey-main {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2.5rem;
                    position: relative;
                }

                .survey-editor-container {
                    max-width: 800px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    padding-bottom: 5rem;
                }

                .editor-card {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e1e4e8;
                    padding: 2.5rem;
                }

                .survey-header-card {
                    border-top: 8px solid #3b82f6;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .survey-title-input {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #1e293b;
                    border: none;
                    outline: none;
                    width: 100%;
                    padding: 0;
                }

                .title-divider {
                    height: 1px;
                    background: #f1f5f9;
                    width: 100%;
                    margin: 0.5rem 0;
                }

                .survey-desc-input {
                    font-size: 0.95rem;
                    color: #64748b;
                    border: none;
                    outline: none;
                    width: 100%;
                    padding: 0;
                }

                .question-card {
                    position: relative;
                }

                .question-card.active {
                    border-left: 6px solid #3b82f6;
                }

                .card-top-bar {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 0.5rem;
                    color: #cbd5e1;
                }

                .drag-handle {
                    cursor: grab;
                }

                .question-header-row {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .q-text-wrapper {
                    flex: 1;
                }

                .question-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .question-input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                    background: #ffffff;
                }

                .type-selector {
                    width: 200px;
                }

                .selector-inner {
                    padding: 0.75rem 1rem;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                }

                .options-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .option-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .radio-circle {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #cbd5e1;
                    border-radius: 50%;
                }

                .option-input {
                    flex: 1;
                    border: none;
                    border-bottom: 1px solid transparent;
                    padding: 0.5rem 0;
                    font-size: 0.95rem;
                    color: #475569;
                    outline: none;
                    transition: border-color 0.2s;
                }

                .option-input:focus {
                    border-color: #e2e8f0;
                }

                .add-option-btn {
                    background: transparent;
                    border: none;
                    color: #3b82f6;
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 0;
                    width: fit-content;
                    cursor: pointer;
                    text-align: left;
                    margin-left: 2.25rem;
                }

                .card-footer {
                    border-top: 1px solid #f1f5f9;
                    padding-top: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .footer-left {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .footer-action-btn {
                    padding: 0.5rem;
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .footer-action-btn:hover {
                    background: #f1f5f9;
                    color: #475569;
                }

                .action-divider {
                    width: 1px;
                    height: 24px;
                    background: #e2e8f0;
                    margin: 0 0.5rem;
                }

                .footer-right {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .toggle-group {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .toggle-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #64748b;
                }

                .ios-toggle {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                }

                .ios-toggle input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #e2e8f0;
                    transition: .4s;
                    border-radius: 24px;
                }

                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                input:checked + .toggle-slider {
                    background-color: #3b82f6;
                }

                input:checked + .toggle-slider:before {
                    transform: translateX(20px);
                }

                .floating-actions {
                    position: fixed;
                    bottom: 3rem;
                    right: 3rem;
                }

                .fab-add {
                    width: 60px;
                    height: 60px;
                    background: #3b82f6;
                    color: white;
                    border-radius: 50%;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default SurveyBuilder;
