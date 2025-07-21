import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";

// --- Reusable Modal Component ---
const AlreadyVotedModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h3>
            <p className="text-gray-700 mb-6">This voter has already cast their ballot and cannot vote again.</p>
            <button
                onClick={onClose}
                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Close
            </button>
        </div>
    </div>
);

const Voters = () => {
    const [voters, setVoters] = useState([]);
    const [searchRegno, setSearchRegno] = useState('');
    const [searchName, setSearchName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Fetch voters from the backend when the component mounts
    useEffect(() => {
        fetch(`http://localhost:3000/voter/show`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setVoters(data);
            })
            .catch(error => console.error('Error fetching voters:', error));
    }, []);

    // Memoized search results to avoid re-calculating on every render
    const filteredVoters = useMemo(() => {
        return voters.filter(voter => {
            const matchesRegno = voter.erp.toUpperCase().includes(searchRegno.toUpperCase());
            const matchesName = voter.name.toLowerCase().includes(searchName.toLowerCase());
            return matchesRegno && matchesName;
        });
    }, [voters, searchRegno, searchName]);

    // Handle clicking on a voter card
    const handleVoterClick = (voter) => {
        if (voter.voted) {
            // If voter has already voted, show the modal
            setShowModal(true);
        } else {
            // Otherwise, navigate to the candidates page
            navigate(`/candidates?voterid=${voter._id}`);
        }
    };

    return (
        <div className='p-4 md:p-8 flex-grow'>
            {showModal && <AlreadyVotedModal onClose={() => setShowModal(false)} />}
            
            <h4 className='text-3xl md:text-4xl font-bold mb-6 w-full text-indigo-700 text-center'>Voters List</h4>
            
            {/* --- Search Inputs --- */}
            <div className='max-w-2xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='relative'>
                    <input 
                        id='regno' 
                        className='bg-white w-full h-12 px-4 pr-12 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition' 
                        type='search' 
                        placeholder='Search by Registration No.'
                        value={searchRegno}
                        onChange={(e) => setSearchRegno(e.target.value)}
                    />
                    <svg className="w-6 h-6 absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <div className='relative'>
                    <input 
                        id='name' 
                        className='bg-white w-full h-12 px-4 pr-12 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition' 
                        type='search' 
                        placeholder='Search by Name'
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <svg className="w-6 h-6 absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            {/* --- Voters List --- */}
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {filteredVoters.map(voter => (
                    <li 
                        key={voter._id} 
                        onClick={() => handleVoterClick(voter)}
                        className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:border-indigo-400 transition-all duration-300 cursor-pointer"
                    >
                        <div className="p-4">
                            <h5 className="text-md font-bold text-gray-800 truncate">{voter.name}</h5>
                            <p className="text-sm text-gray-500 mt-1">{voter.erp}</p>
                            {voter.voted && (
                                <div className="mt-2 text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded-full inline-block">
                                    Voted
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            {filteredVoters.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <p>No voters found matching your search.</p>
                </div>
            )}
        </div>
    );
}

export default Voters;
