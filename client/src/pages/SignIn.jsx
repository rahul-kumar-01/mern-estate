import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart,signInFailure,signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';


export default function SignIn() { 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData,setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading,setLoading] = useState(false);
  const {loading,error} = useSelector((state) => state.user);
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    })
  };
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

   

    // const res = await fetch('/api/auth/signup' ,formData);  we have to stringfy the formdata it's not secure 
    // if error come  use try and catch to fix it in catch setEroor(err.message);
    try{
       // setLoading(true);
        dispatch(signInStart());
      const res = await fetch('/api/auth/signin',
      {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false) {
        // setError(data.message);
        // setLoading(false);
        dispatch(signInFailure(data.message));
        return;
      }
      // setLoading(false);
      // setError(null);
      dispatch(signInSuccess(data));
      console.log(data);
      navigate('/');
    }catch(error){
      // setLoading(false);
      // setError(error.message)
      dispatch(signInFailure(error.message));
    }
  }
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className=' flex flex-col gap-4' onSubmit={handleSubmit}>
        <input className="border p-3 rounded-lg" id='email' type="text" placeholder='email' onChange={handleChange}/>
        <input className="border p-3 rounded-lg" id='password' type="text" placeholder='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign in' } 
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        {/* //don't use ampostrophy problem in production */}
        <Link to={"/sign-up"}>
            <span className='text-blue-700'>Sign up</span>  
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
