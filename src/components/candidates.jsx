import React, { useEffect, useState } from 'react';
import { useLocation }              from 'react-router-dom';
import { CheckCircle }             from 'lucide-react';
import Splash                      from '../assets/splash.png';

const Candidates = ({ category }) => {
  const [data, setData]           = useState({ candidates: [], hasVoted: false });
  const [showThankYou, setShowThankYou] = useState(false);
  const { search }                = useLocation();
  const voterid                   = new URLSearchParams(search).get('voterid');

  const sendvote = (candidateid) => {
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);

      fetch('http://localhost:3000/votes', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ voterid, category, candidateid }),
      })
      .then(r => r.json())
      .then(res => {
        console.log('Vote submitted:', res);
        // optionally re‑fetch to update hasVoted UI
        return fetch(`http://localhost:3000/candidate/show?category=${category}&voterid=${voterid}`);
      })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(err => console.error('Error submitting vote:', err));
    }, 3000);
  };

  useEffect(() => {
    fetch(`http://localhost:3000/candidate/show?category=${category}&voterid=${voterid}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(err => console.error('Error fetching candidates + vote‑status:', err));
  }, [category, voterid]);

  return (
    <div className="p-2">
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] animate-fadeIn">
            <img
              src={Splash}
              alt="splash background"
              className="w-full h-full object-contain"
            />
            <h1 className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl animate-pulse text-center drop-shadow-md">
              Thank you<br/>for voting!
            </h1>
          </div>
        </div>
      )}

      <h4 className="text-3xl md:text-[32px] font-bold mb-3">Vote for {category}</h4>
      <h5 className="text-[23px] font-bold text-blue-600">{category} Candidates</h5>

      <ul className="grid md:grid-cols-4 gap-4 my-4">
        {data.candidates.map(cand => (
          <li key={cand._id}>
            <div className="md:w-[205px] md:h-[250px] bg-white border border-gray-200 rounded-2xl shadow flex flex-col">
              <img
                className="rounded-t-2xl md:w-[205px]"
                src={cand.img}
                alt={cand.name}
              />
              <div className="p-2">
                <h5 className="mb-2 text-[13px] leading-relaxed tracking-wider font-bold text-gray-900">
                  {cand.name}
                </h5>
              </div>
              <div className="mt-auto m-3 min-h-10">
                <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-text-purple bg-light-purple rounded-3xl">
                  {cand.description}
                </div>
              </div>
              <button
                disabled={data.hasVoted}
                className={`
                  flex items-center justify-center gap-2
                  bg-blue-600 hover:bg-blue-700 text-white font-semibold
                  py-2 px-6 rounded-xl shadow-md transition duration-200 ease-in-out
                  ${data.hasVoted ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => sendvote(cand._id)}
              >
                <CheckCircle size={20} />
                {data.hasVoted ? 'Voted' : 'Vote'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Candidates;
