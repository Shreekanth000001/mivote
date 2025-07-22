import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
// In a real app with routing, you would use this hook.
// import { useLocation } from 'react-router-dom';

// Import the sound file from your assets folder
import VotedSound from '../assets/voted.mp3';

// --- CONSTANTS ---
const backendUrl = 'http://localhost:3000';

// --- HELPER COMPONENTS ---

// A reusable card for displaying a single candidate
const CandidateCard = ({ candidate, onSelect, isSelected }) => {
    const ringClass = isSelected ? 'ring-indigo-500' : 'ring-transparent';
    const containerClasses = isSelected ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-gray-200 hover:border-indigo-400';

    return (
        <li 
            onClick={() => onSelect(candidate._id, candidate.categorytype)}
            className={`rounded-xl shadow-lg border-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer ${containerClasses} ${ringClass} ring-4 overflow-hidden`}
        >
            <div className="flex flex-col items-center p-6">
                <img
                    src={`${backendUrl}${candidate.img}`}
                    alt={candidate.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/CCCCCC/FFFFFF?text=Image'; }}
                />
                <h3 className="mt-4 text-xl font-bold text-gray-800 text-center">{candidate.name}</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4 text-center h-10">{candidate.description}</p>
                <div 
                    className={`w-full mt-2 py-2 px-4 rounded-lg font-semibold text-sm text-center transition-colors duration-200 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                >
                    {isSelected ? 'Selected' : 'Select'}
                </div>
            </div>
        </li>
    );
};

// A component for a category of candidates
const CategorySection = ({ title, candidates, onSelect, selectedCandidateId }) => (
    <section className="mb-16">
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h2>
            <p className="text-md text-gray-500 mt-1">Select one candidate for this position.</p>
        </div>
        {candidates.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {candidates.map(cand => (
                    <CandidateCard
                        key={cand._id}
                        candidate={cand}
                        onSelect={onSelect}
                        isSelected={selectedCandidateId === cand._id}
                    />
                ))}
            </ul>
        ) : (
            <p className="text-center text-gray-500">No candidates available for this category.</p>
        )}
    </section>
);

// A modal to confirm the user's final selections
const ConfirmationModal = ({ selections, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300 scale-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Your Vote</h2>
      <p className="text-gray-600 mb-6">Please review your selections. This action cannot be undone.</p>
      <div className="space-y-4 mb-8">
        {Object.entries(selections).map(([position, candidate]) => (
          <div key={position} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
            <span className="font-semibold text-gray-500">{position.replace('VicePresident', 'Vice President')}:</span>
            <span className="font-bold text-indigo-700">{candidate ? candidate.name : 'Not Selected'}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-4">
        <button 
          onClick={onCancel}
          className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold transition-colors"
        >
          Go Back
        </button>
        <button 
          onClick={onConfirm}
          className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition-colors flex items-center space-x-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Submit Vote</span>
        </button>
      </div>
    </div>
  </div>
);


// --- MAIN APP COMPONENT (Candidates.jsx) ---

export default function App() {
    const [candidates, setCandidates] = useState([]);
    // This state now tracks selections before they are submitted
    const [selections, setSelections] = useState({
        President: null,
        VicePresident: null,
        Secretary: null,
    });
    const [showModal, setShowModal] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const voterid = new URLSearchParams(window.location.search).get('voterid') || 'guest_voter';

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await fetch(`${backendUrl}/candidate/show`);
                if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
                const data = await response.json();
                setCandidates(data.candidates || []);
            } catch (err) {
                console.error('Error fetching candidates:', err);
                setError('Could not load candidates. Please ensure the server is running and try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const presidentCandidates = useMemo(() => candidates.filter(c => c.categorytype === 'President'), [candidates]);
    const vicePresidentCandidates = useMemo(() => candidates.filter(c => c.categorytype === 'VicePresident'), [candidates]);
    const secretaryCandidates = useMemo(() => candidates.filter(c => c.categorytype === 'Secretary'), [candidates]);

    // This function now only handles selecting a candidate, not submitting.
    const handleSelect = (candidateid, category) => {
        setSelections(prev => ({
            ...prev,
            [category]: candidateid,
        }));
    };

    // A helper to get full candidate objects from IDs for the modal
    const getFullSelections = () => {
        const fullSelections = {};
        for (const category in selections) {
            const candidateId = selections[category];
            fullSelections[category] = candidates.find(c => c._id === candidateId);
        }
        return fullSelections;
    };

    // This function is called when the final "Confirm Vote" button is clicked in the modal.
    const handleConfirmVote = async () => {
        setIsSubmitting(true);
        setError('');

        const payload = {
            voterid,
            president: selections.President,
            vicePresident: selections.VicePresident,
            secretary: selections.Secretary,
        };

        try {
            const response = await fetch(`${backendUrl}/votes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Vote submission failed.');
            
            // Play the sound on successful submission
            const audio = new Audio(VotedSound);
            audio.play();

            setShowModal(false);
            setShowThankYou(true);

        } catch (err) {
            console.error('Error submitting vote:', err);
            setError('Your vote could not be saved. Please try again.');
            setShowModal(false); // Close modal on error to show the message
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSubmissionDisabled = Object.values(selections).some(id => id === null);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading Voting Session...</div>;
    }

    if (showThankYou) {
        return (
            <div className="flex items-center justify-center min-h-screen text-center">
                <div>
                    <CheckCircle className="w-24 h-24 mx-auto text-green-500" />
                    <h2 className="text-4xl font-bold text-gray-800 mt-6">Thank You for Voting!</h2>
                    <p className="text-gray-600 mt-2">Your ballot has been successfully submitted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {showModal && (
                <ConfirmationModal 
                  selections={getFullSelections()}
                  onConfirm={handleConfirmVote}
                  onCancel={() => setShowModal(false)}
                />
            )}
            <main className="container mx-auto px-6 py-12">
                {error && <p className="text-red-500 mb-8 text-center bg-red-100 p-3 rounded-lg">{error}</p>}
                
                <CategorySection
                    title="President"
                    candidates={presidentCandidates}
                    onSelect={handleSelect}
                    selectedCandidateId={selections['President']}
                />
                <CategorySection
                    title="Vice President"
                    candidates={vicePresidentCandidates}
                    onSelect={handleSelect}
                    selectedCandidateId={selections['VicePresident']}
                />
                <CategorySection
                    title="Secretary"
                    candidates={secretaryCandidates}
                    onSelect={handleSelect}
                    selectedCandidateId={selections['Secretary']}
                />

                <div className="mt-12 text-center">
                    <button 
                      onClick={() => setShowModal(true)}
                      disabled={isSubmissionDisabled || isSubmitting}
                      className="bg-green-600 text-white font-bold text-lg py-4 px-12 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Your Vote'}
                    </button>
                    {isSubmissionDisabled && <p className="text-sm text-gray-500 mt-3">Please select a candidate for each category to submit.</p>}
                </div>
            </main>
        </div>
    );
}
