import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() { 
  const navigate = useNavigate();
  const [formData,setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    })
  };
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // const res = await fetch('/api/auth/signup' ,formData);  we have to stringfy the formdata it's not secure 
    // if error come  use try and catch to fix it in catch setEroor(err.message);
    try{
      const res = await fetch('/api/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      console.log(data);
      navigate('/sign-in');
    }catch(error){
      setLoading(false);
      setError(error.message)
    }
  }
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className=' flex flex-col gap-4' onSubmit={handleSubmit}>
        <input className="border p-3 rounded-lg" id='username' type="text" placeholder='username' onChange={handleChange}/>
        <input className="border p-3 rounded-lg" id='email' type="text" placeholder='email' onChange={handleChange}/>
        <input className="border p-3 rounded-lg" id='password' type="text" placeholder='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign up' } 
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
            <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
