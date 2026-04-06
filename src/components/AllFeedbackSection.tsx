import React from 'react';

const AllFeedbackSection: React.FC = () => {
    const feedbackCategories = [
        {
            label: 'GVP', emblem: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/1999/xlink">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22V12" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 12L2 7" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 12L22 7" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 12" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 17L12 12" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            label: 'DPVT', emblem: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/1999/xlink">
                    <circle cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="1.5" />
                    <path d="M12 2V22" stroke="#D4AF37" strokeWidth="1.5" />
                    <path d="M2 12H22" stroke="#D4AF37" strokeWidth="1.5" />
                    <path d="M4.93 4.93L19.07 19.07" stroke="#D4AF37" strokeWidth="1.5" />
                    <path d="M4.93 19.07L19.07 4.93" stroke="#D4AF37" strokeWidth="1.5" />
                </svg>
            )
        },
        {
            label: 'Souvenir', emblem: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/1999/xlink">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            label: 'Food Court', emblem: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/1999/xlink">
                    <path d="M12 3L4 9V21H20V9L12 3Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 21V12H15V21" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            label: 'Dhammalay', emblem: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/1999/xlink">
                    <path d="M12 3L2 12H5V20H19V12H22L12 3Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="3" stroke="#D4AF37" strokeWidth="1.5" />
                </svg>
            )
        },
        {
            label: 'Museum', emblem: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/1999/xlink">
                    <path d="M4 22H20" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 22V10" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 22V10" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 10L12 2L22 10H2Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 22V15H15V22" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
    ];

    const handleCardClick = (label: string) => {
        console.log(`Routing to feedback form for: ${label}`);
        // Navigation logic would go here
    };

    return (
        <div className="feedback-page-root">
            <div className="feedback-container">
                <h1 className="feedback-title">Feedback & Suggestions</h1>

                <div className="feedback-grid">
                    {feedbackCategories.map((category, index) => (
                        <div
                            key={index}
                            className="feedback-card"
                            onClick={() => handleCardClick(category.label)}
                        >
                            <div className="feedback-emblem">
                                {category.emblem}
                            </div>
                            <div className="feedback-label">
                                {category.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .feedback-page-root {
          background-color: #ffffff;
          min-height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4rem 2rem;
          font-family: 'Inter', sans-serif;
        }

        .feedback-container {
          max-width: 1000px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .feedback-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #000000;
          text-align: center;
          margin-bottom: 3rem;
          text-decoration: underline;
          text-underline-offset: 8px;
          text-transform: none;
          letter-spacing: -0.02em;
        }

        .feedback-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 2rem;
          width: 100%;
        }

        .feedback-card {
          background-color: #ffffff;
          border: 1px solid #00008b;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          cursor: pointer;
          transition: none;
          aspect-ratio: 4 / 3;
        }

        .feedback-card:hover {
          /* Explicitly no hover animations or scale as requested */
        }

        .feedback-emblem {
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .feedback-label {
          font-size: 1.25rem;
          font-weight: 700;
          color: #000000;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .feedback-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
          }
        }

        @media (max-width: 480px) {
          .feedback-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(6, 1fr);
          }
        }
      `}</style>
        </div>
    );
};

export default AllFeedbackSection;
