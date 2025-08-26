import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const category = ({ voterid }) => {
    const backendUrl = 'https://mivote-backend.onrender.com';
    const [category, setCategory] = useState([]);

    useEffect(() => {
        fetch(`https://mivote-backend.onrender.com/category/show`)
            .then(response => response.json())
            .then(data => setCategory(data))
            .catch(error => console.error('Error fetching category:', error));
    }, []);

    return (
        <div className='p-2'>

            <h5 className="text-[23px] font-bold text-light-black">Roles</h5>

            <ul className='grid md:grid-cols-4 gap-4 my-4'>
                {category.map(cat => (
                    <li key={cat._id} >
                        <Link to={`/candidates/${cat.categorytype}?voterid=${voterid}`}>

                            <div className="md:w-[205px] md:h-[250px] bg-white border border-gray-200 rounded-2xl shadow flex flex-col">

                                <img className="rounded-t-2xl md:w-[205px] h-[150px] object-cover" src={`${backendUrl}${cat.img}`} alt={`${cat.categorytype} category`} />

                                <div className='mt-auto m-3'>
                                    <div className="inline-flex mt-auto items-center px-4 py-2 text-sm font-medium text-center text-text-purple bg-light-purple rounded-3xl">
                                        {cat.categorytype}
                                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default category
