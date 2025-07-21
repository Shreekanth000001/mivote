import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const voter = () => {

    const [voters, setVoters] = useState([]);
    const [searchvoters, setSearchVoters] = useState([]);

    const regnoSearch = () => {
        const input = document.getElementById('regno').value.toUpperCase();
        console.log(input);
        const filtered = voters.filter(voter => voter.erp.includes(input));
    setSearchVoters(filtered);
    }
     const nameSearch = () => {
  const input = document.getElementById('name').value.trim().toLowerCase();
  console.log(input);

  const filtered = voters.filter(voter =>
    voter.name.toLowerCase().includes(input)
  );

  setSearchVoters(filtered);
};


    useEffect(() => {
        fetch(`http://localhost:3000/voter/show`)
            .then(response => response.json())
            .then(data => {setVoters(data);
        setSearchVoters(data);})
            .catch(error => console.error('Error fetching category:', error));

        setSearchVoters(voters);
    }, []);

    return (
        <div className='p-2'>
            <h4 className='text-2xl md:text-[32px] font-bold mb-3'>Voters List</h4>
            <div className='flex justify-center my-2'>
                <input id='regno' className='bg-white w-[80%] h-10 ml-4 px-2 rounded-2xl border' type='search' placeholder='reg no. search' />
                <button type='submit' onClick={regnoSearch}>
                    <svg width='28' height='28' fill="none" stroke='black' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
            </div>
             <div className='flex justify-center my-2'>
                <input id='name' className='bg-white w-[80%] h-10 ml-4 px-2 rounded-2xl border' type='search' placeholder='name search' />
                <button type='submit' onClick={nameSearch}>
                    <svg width='28' height='28' fill="none" stroke='black' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
            </div>
            <ul className='grid md:grid-cols-4 gap-4 my-4 mx-2'>
                {searchvoters.map(voter => (
                    <li key={voter._id} >
                        <Link to={`/category/${voter._id}`}>

                            <div className="  bg-white border border-gray-200 rounded-2xl shadow flex flex-col">

                                <div className="p-2 ">
                                    <h5 className="mb-2 text-[13px] leading-relaxed tracking-wider font-bold text-gray-900">{voter.name}</h5>
                                    <h5 className="mb-2 text-[13px] leading-relaxed tracking-wider font-bold text-gray-900">{voter.erp}</h5>
                                </div>

                            </div>

                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default voter
