// src/pages/freelancer/FreelancerMessages.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const FreelancerMessages = () => {
    const { id } = useParams();
    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-heading font-bold text-[#1A1208]">
                Messages {id && `- Conversation ${id}`}
            </h1>
            {/* Interface de messagerie */}
        </div>
    );
};

export default FreelancerMessages;