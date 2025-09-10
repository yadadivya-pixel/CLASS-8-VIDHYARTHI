import React, { useState, useEffect, useRef } from 'react';
import type { GenieState, GenieAction, Screen } from '../types';
import GenieIcon from './icons/GenieIcon';
import CakeIcon from './icons/CakeIcon';

const ACTION_ANIMATION_MAP: Record<GenieAction, string> = {
  idle: 'animate-float',
  talk: 'animate-wiggle',
  correct: 'animate-jump',
  incorrect: 'animate-shake',
  skip: 'animate-wiggle',
  celebrate: 'animate-celebrate',
  thinking: 'animate-thinking',
};

interface GenieProps {
  state: GenieState;
  screen: Screen;
}

const Genie: React.FC<GenieProps> = ({ state, screen }) => {
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [animationClass, setAnimationClass] = useState(ACTION_ANIMATION_MAP.idle);
    const [position, setPosition] = useState<React.CSSProperties>({ top: '60%', right: '1rem' });
    const messageTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        // Always update the animation class based on the current action
        const newAnimation = ACTION_ANIMATION_MAP[state.action] || ACTION_ANIMATION_MAP.idle;
        setAnimationClass(newAnimation);

        // Clear any previous message-hiding timeout
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        
        // Update the displayed message
        setDisplayedMessage(state.message);

        // Define which actions are temporary and should revert
        const temporaryActions = ['talk', 'correct', 'incorrect', 'skip'];

        // If the action is temporary, set a timeout to hide the message
        if (temporaryActions.includes(state.action) && state.message) {
            messageTimeoutRef.current = window.setTimeout(() => {
                setDisplayedMessage('');
            }, 4000);
        }

        // If the action is temporary, also set a timeout to revert the animation to idle
        if (temporaryActions.includes(state.action)) {
            const animationTimer = setTimeout(() => {
                setAnimationClass(ACTION_ANIMATION_MAP.idle);
            }, 1500); // Animation duration should be longer than the animation itself
            return () => clearTimeout(animationTimer);
        }
    }, [state]);

    useEffect(() => {
        let interval: number | undefined;
        let celebrationTimeout: number | undefined;

        const cleanup = () => {
            if (interval) clearInterval(interval);
            if (celebrationTimeout) clearTimeout(celebrationTimeout);
        };

        if (screen === 'CELEBRATION') {
            // Start in the center for the celebration
            setPosition({ top: '25%', left: '50%', transform: 'translateX(-50%)' });
            
            // After 1.5s, move quickly to the side to get out of the way
            celebrationTimeout = window.setTimeout(() => {
                setPosition({ bottom: '5rem', right: '1rem' });
            }, 1500);
            return cleanup;
        } 
        
        if (screen === 'QUIZ') {
            // Anchor genie to the bottom-right to avoid blocking options.
            setPosition({ bottom: '1rem', right: '1rem' });
            return cleanup; // No interval needed for fixed position
        }
        
        let positions: React.CSSProperties[];

        if (screen === 'HOME' || screen === 'BOOKS' || screen === 'CHAPTERS') {
             // Keep genie on the right side to avoid blocking selections
             positions = [
                { top: '60%', right: '1rem' },
                { top: '20%', right: '4rem' },
                { top: '40%', right: '2rem' },
            ];
        } else {
            // For other screens like REPORT, let him move around the sides.
            positions = [
                { top: '60%', right: '1rem' },
                { top: '20%', right: '4rem' },
                { top: '50%', left: '1rem' },
                { top: '25%', left: '2rem' }
            ];
        }

        const moveGenie = () => {
            setPosition(positions[Math.floor(Math.random() * positions.length)]);
        };
        
        moveGenie(); // Move once
        interval = window.setInterval(moveGenie, 15000);
        
        return cleanup;
    }, [screen]);
    
    const isCelebrating = state.action === 'celebrate';
    const isGenieOnLeft = position.left !== undefined;

    // Adjust genie size based on the context
    let sizeClass = isCelebrating ? 'w-64 h-64' : 'w-32 h-32';
    if (screen === 'QUIZ') {
        sizeClass = 'w-28 h-28'; // Make genie smaller and less intrusive during the quiz
    }
    
    // Dynamically adjust bubble and pointer based on genie's position
    const messageBubbleClasses = isGenieOnLeft ? "rounded-bl-none" : "rounded-br-none";
    const messagePointerClasses = isGenieOnLeft 
        ? "absolute bottom-0 left-[-10px] w-0 h-0 border-r-[10px] border-r-transparent border-t-[15px] border-t-white" 
        : "absolute bottom-0 right-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-white";
    const messagePointerBorderClasses = isGenieOnLeft
        ? "absolute bottom-[-2.5px] left-[-13px] w-0 h-0 border-r-[13px] border-r-transparent border-t-[19px] border-t-indigo-300 -z-10"
        : "absolute bottom-[-2.5px] right-[-13px] w-0 h-0 border-l-[13px] border-l-transparent border-t-[19px] border-t-indigo-300 -z-10";


    return (
        <div 
            className={`fixed z-50 flex items-end transition-all duration-1000 ease-in-out ${isGenieOnLeft ? 'flex-row-reverse' : ''}`}
            style={{ ...position, pointerEvents: 'none' }}
        >
            {displayedMessage && (
                <div 
                    className={`bg-white p-4 rounded-lg shadow-xl max-w-xs relative border-2 border-indigo-300 animate-fade-in-up ${messageBubbleClasses} ${isGenieOnLeft ? 'ml-2' : 'mr-2'}`} 
                    style={{pointerEvents: 'auto'}}
                >
                    <p className="text-brand-text text-md">{displayedMessage}</p>
                    <div className={messagePointerClasses}></div>
                    <div className={messagePointerBorderClasses}></div>
                </div>
            )}
            <div className={`${animationClass} ${sizeClass}`}>
                {isCelebrating && <CakeIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-20 h-20" />}
                <GenieIcon />
            </div>
        </div>
    );
};

export default Genie;