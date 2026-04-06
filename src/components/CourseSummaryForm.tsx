import React, { useState } from 'react';

interface StudentCount {
    indianNew: number;
    indianOld: number;
    foreignNew: number;
    foreignOld: number;
}

interface StudentSummary {
    male: StudentCount;
    female: StudentCount;
    left: StudentCount;
    dhammaSevak: StudentCount;
}

const CourseSummaryForm: React.FC = () => {
    const [formData, setFormData] = useState({
        courseType: '',
        courseDays: '',
        courseDate: '',
        courseLocation: '',
        maleTeacher: '',
        femaleTeacher: '',
        maleCourseManager: '',
        femaleCourseManager: '',
        remark: ''
    });

    const [studentSummary, setStudentSummary] = useState<StudentSummary>({
        male: { indianNew: 0, indianOld: 0, foreignNew: 0, foreignOld: 0 },
        female: { indianNew: 0, indianOld: 0, foreignNew: 0, foreignOld: 0 },
        left: { indianNew: 0, indianOld: 0, foreignNew: 0, foreignOld: 0 },
        dhammaSevak: { indianNew: 0, indianOld: 0, foreignNew: 0, foreignOld: 0 }
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleStudentCountChange = (category: keyof StudentSummary, field: keyof StudentCount, value: string) => {
        const numValue = parseInt(value) || 0;
        setStudentSummary({
            ...studentSummary,
            [category]: {
                ...studentSummary[category],
                [field]: numValue
            }
        });
    };

    const calculateTotal = (counts: StudentCount) => {
        return counts.indianNew + counts.indianOld + counts.foreignNew + counts.foreignOld;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Course Summary submitted:', { formData, studentSummary });
    };

    return (
        <div className="course-summary-root">
            <div className="course-summary-container">
                <div className="course-summary-card">
                    {/* Header */}
                    <div className="form-header">
                        <h1 className="main-title">Dhamma Pattan</h1>
                        <div className="subtitle-wrapper">
                            <h2 className="subtitle">Course Summary Report</h2>
                            <div className="subtitle-underline"></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="course-form">
                        {/* Two-column top section */}
                        <div className="form-row-grid">
                            <div className="form-field">
                                <label htmlFor="courseType">Course Type</label>
                                <input
                                    type="text"
                                    id="courseType"
                                    value={formData.courseType}
                                    onChange={(e) => handleInputChange('courseType', e.target.value)}
                                    placeholder="e.g., 10-Day Course"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="courseDate">Course Date</label>
                                <input
                                    type="date"
                                    id="courseDate"
                                    value={formData.courseDate}
                                    onChange={(e) => handleInputChange('courseDate', e.target.value)}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="courseDays">Course Days</label>
                                <input
                                    type="text"
                                    id="courseDays"
                                    value={formData.courseDays}
                                    onChange={(e) => handleInputChange('courseDays', e.target.value)}
                                    placeholder="e.g., 10 Days"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="courseLocation">Course Location</label>
                                <input
                                    type="text"
                                    id="courseLocation"
                                    value={formData.courseLocation}
                                    onChange={(e) => handleInputChange('courseLocation', e.target.value)}
                                    placeholder="e.g., Main Hall"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Full-width stacked fields */}
                        <div className="form-field">
                            <label htmlFor="maleTeacher">Male Teacher</label>
                            <input
                                type="text"
                                id="maleTeacher"
                                value={formData.maleTeacher}
                                onChange={(e) => handleInputChange('maleTeacher', e.target.value)}
                                placeholder="Enter male teacher name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="femaleTeacher">Female Teacher</label>
                            <input
                                type="text"
                                id="femaleTeacher"
                                value={formData.femaleTeacher}
                                onChange={(e) => handleInputChange('femaleTeacher', e.target.value)}
                                placeholder="Enter female teacher name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="maleCourseManager">Male Course Manager</label>
                            <input
                                type="text"
                                id="maleCourseManager"
                                value={formData.maleCourseManager}
                                onChange={(e) => handleInputChange('maleCourseManager', e.target.value)}
                                placeholder="Enter male course manager name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="femaleCourseManager">Female Course Manager</label>
                            <input
                                type="text"
                                id="femaleCourseManager"
                                value={formData.femaleCourseManager}
                                onChange={(e) => handleInputChange('femaleCourseManager', e.target.value)}
                                placeholder="Enter female course manager name"
                                className="form-input"
                            />
                        </div>

                        {/* Student Summary Table */}
                        <div className="table-section">
                            <h3 className="table-title">Student Summary</h3>
                            <div className="table-wrapper">
                                <table className="student-table">
                                    <thead>
                                        <tr>
                                            <th rowSpan={2} className="header-cell">Student</th>
                                            <th colSpan={2} className="header-cell group-header">Indian</th>
                                            <th colSpan={2} className="header-cell group-header">Foreign</th>
                                            <th rowSpan={2} className="header-cell">Total</th>
                                        </tr>
                                        <tr>
                                            <th className="header-cell sub-header">New</th>
                                            <th className="header-cell sub-header">Old</th>
                                            <th className="header-cell sub-header">New</th>
                                            <th className="header-cell sub-header">Old</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(['male', 'female', 'left', 'dhammaSevak'] as const).map((category) => (
                                            <tr key={category}>
                                                <td className="row-header">
                                                    {category === 'male' ? 'Male' :
                                                        category === 'female' ? 'Female' :
                                                            category === 'left' ? 'Left' :
                                                                'Dhamma-sevak'}
                                                </td>
                                                <td className="data-cell">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={studentSummary[category].indianNew || ''}
                                                        onChange={(e) => handleStudentCountChange(category, 'indianNew', e.target.value)}
                                                        className="table-input"
                                                    />
                                                </td>
                                                <td className="data-cell">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={studentSummary[category].indianOld || ''}
                                                        onChange={(e) => handleStudentCountChange(category, 'indianOld', e.target.value)}
                                                        className="table-input"
                                                    />
                                                </td>
                                                <td className="data-cell">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={studentSummary[category].foreignNew || ''}
                                                        onChange={(e) => handleStudentCountChange(category, 'foreignNew', e.target.value)}
                                                        className="table-input"
                                                    />
                                                </td>
                                                <td className="data-cell">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={studentSummary[category].foreignOld || ''}
                                                        onChange={(e) => handleStudentCountChange(category, 'foreignOld', e.target.value)}
                                                        className="table-input"
                                                    />
                                                </td>
                                                <td className="total-cell">{calculateTotal(studentSummary[category])}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Remarks Section */}
                        <div className="form-field">
                            <label htmlFor="remark">Remark</label>
                            <textarea
                                id="remark"
                                value={formData.remark}
                                onChange={(e) => handleInputChange('remark', e.target.value)}
                                placeholder="Enter any additional remarks or notes"
                                rows={5}
                                className="form-textarea"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button type="submit" className="submit-button">
                                Submit Course Summary
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
        .course-summary-root {
          background-color: #f8fafc;
          min-height: 100%;
          width: 100%;
          padding: 2.5rem 1.5rem;
          display: flex;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .course-summary-container {
          width: 100%;
          max-width: 900px;
        }

        .course-summary-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          padding: 3rem 2.5rem;
          border: 2px solid #3730a3;
        }

        .form-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .main-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1e1b4b;
          margin: 0 0 1rem 0;
          letter-spacing: -0.02em;
        }

        .subtitle-wrapper {
          display: inline-block;
        }

        .subtitle {
          font-size: 1.25rem;
          font-weight: 700;
          color: #475569;
          margin: 0;
        }

        .subtitle-underline {
          height: 3px;
          background: linear-gradient(90deg, transparent, #3730a3, transparent);
          margin-top: 0.5rem;
        }

        .course-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .form-row-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-field label {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 2px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #1e293b;
          background: #ffffff;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: #3730a3;
          box-shadow: 0 0 0 3px rgba(55, 48, 163, 0.1);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #94a3b8;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
          line-height: 1.6;
        }

        .table-section {
          margin-top: 1rem;
        }

        .table-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e1b4b;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .table-wrapper {
          overflow-x: auto;
          border: 2px solid #3730a3;
          border-radius: 8px;
        }

        .student-table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
        }

        .header-cell {
          background: #3730a3;
          color: #ffffff;
          padding: 0.85rem 0.75rem;
          font-weight: 700;
          font-size: 0.85rem;
          text-align: center;
          border: 1px solid #2d1f8f;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .group-header {
          background: #4338ca;
        }

        .sub-header {
          background: #4f46e5;
          font-size: 0.8rem;
        }

        .row-header {
          background: #f1f5f9;
          font-weight: 700;
          color: #1e293b;
          padding: 0.75rem 1rem;
          text-align: left;
          border: 1px solid #cbd5e1;
          text-transform: capitalize;
        }

        .data-cell {
          padding: 0.5rem;
          border: 1px solid #cbd5e1;
          text-align: center;
        }

        .table-input {
          width: 100%;
          max-width: 80px;
          padding: 0.5rem;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          text-align: center;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
        }

        .table-input:focus {
          border-color: #3730a3;
          box-shadow: 0 0 0 2px rgba(55, 48, 163, 0.1);
        }

        .total-cell {
          background: #f1f5f9;
          font-weight: 800;
          color: #1e1b4b;
          padding: 0.75rem;
          text-align: center;
          border: 1px solid #cbd5e1;
          font-size: 1rem;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .submit-button {
          background: #ffffff;
          color: #3730a3;
          border: 2px solid #3730a3;
          padding: 0.9rem 3rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .submit-button:hover {
          background: #3730a3;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(55, 48, 163, 0.3);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .course-summary-card {
            padding: 2rem 1.5rem;
          }

          .main-title {
            font-size: 1.75rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .form-row-grid {
            grid-template-columns: 1fr;
          }

          .table-wrapper {
            overflow-x: scroll;
          }

          .student-table {
            min-width: 600px;
          }

          .submit-button {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default CourseSummaryForm;
