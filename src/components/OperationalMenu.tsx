import React, { useRef } from 'react';

interface OperationalMenuProps {
    activeActivity: string;
    onActivityChange: (activity: string) => void;
    activities: string[];
}

const OperationalMenu: React.FC<OperationalMenuProps> = ({ activeActivity, onActivityChange, activities }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="operational-menu-strip">
            <div className="operational-tabs-container no-scrollbar" ref={scrollRef}>
                {activities.map((activity: string, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => onActivityChange(activity)}
                        className={`operational-tab ${activeActivity === activity ? 'active' : ''}`}
                        title={activity}
                    >
                        {activity}
                    </button>
                ))}
            </div>
            {/* Scroll Fade Indicators */}
            <div className="scroll-indicator left"></div>
            <div className="scroll-indicator right"></div>
        </div>
    );
};

export default OperationalMenu;
