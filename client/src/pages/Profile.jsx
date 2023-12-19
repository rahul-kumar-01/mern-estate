import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import {app} from '../firebase';
import {getDownloadURL, getStorage ,ref, uploadBytesResumable } from 'firebase/storage'
import {updateUserStart,updateUserFailure,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutFailure,signOutStart,signOutSuccess} from "../redux/user/userSlice.js";
import {useDispatch} from "react-redux";
import {Link} from 'react-router-dom'
import { getUserListings } from '../../../api/controllers/user.controller.js';


export default function Profile() {
  const {currentUser,loading,error} = useSelector((state) => state.user);
  const [file,setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData,setFormData] = useState({});
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updatedSuccess , setUpdatedSuccess]  = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  // console.log(file);
  const fileRef = useRef(null);
  // console.log(formData);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);



  const handleFileUpload = (file) =>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    // const storageRef = ref(storage,`avatars/${fileName}`); this will create a filder
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);
    uploadTask.on('state_changed',
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
      console.log('Upload is '+progress + '%done');
      setFilePerc(Math.round(progress));
    }, 
    (error) => {
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=>{
        setFormData({...formData,avatar:downloadURL})
      })
    }
  )

  }
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id] : e.target.value});

  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
      const data = await res.json();
        if(data.success === false){
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdatedSuccess(true);

    }catch(error){
        dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try{
      dispatch(signOutStart());
      const data = await fetch('/api/auth/signout');
      if(data.success === false){
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));

    }catch(error){
      dispatch(signOutFailure(data.message));
    }
  }

  const handleShowListing = async () => {
    try{
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingError(true);
        return;
      }
      setUserListing(data);
    }catch(error){
      setShowListingError(error); 
    }
  }

  const handleListingDelete = async (listingId) => {
    try{
      const res = await fetch(`/api/listing/delete/${listingId}` ,{
        method : 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }

      setUserListing((prev) => prev.filter((listing) => listing._id !== listingId))

    }catch(error){
      console.log(error.message);
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} accept='image/*' hidden/>
        <img onClick={()=> fileRef.current.click()} src={currentUser.avatar} alt="" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          {fileUploadError ? 
            (<span className='text-red-700'>Error Image upload(image must be less than 2MB)</span> )
            :
            filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uplading ${filePerc}%`}</span> )
              :
              filePerc === 100 ? (
                <span className='text-green-700'>Image Succesfully uploaded</span> )
                :
                ('')
          }
        </p>
        <input type="text"
               defaultValue={currentUser.username}
               placeholder='username'
               className='border p-3 rounded-lg '
               id='username'
               onChange={handleChange}
        />
        <input type="text"
               defaultValue={currentUser.email}
               placeholder='email'
               className='border p-3 rounded-lg '
               id='email'
               onChange={handleChange}
        />
        <input type="password"
               placeholder='password'
               className='border p-3 rounded-lg '
               id='password'
               onChange={handleChange}
        />
        <button disabled={loading} type="submit" className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading? 'Loading...':'Update'}
        </button>

        <Link to={"/create-listing"}
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
        >
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>

      <p className={'text-red-700 mt-5'}>
        {error ? error : ""}
      </p>
      <p className='text-green-700'>
        {updatedSuccess ? 'User updated successfully' : ""}
      </p>
      <button onClick={handleShowListing} className='text-green-700 w-full'>Show Listing</button>
      <p className='text-red-700 mt-5'>{showListingError ? 'Error showing listings' : ''}</p>

      
      {userListing && 
      userListing.length > 0 &&
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>
          Your Listing
        </h1>
        {
        userListing.map((listing) => (
          <div className='flex items-center' key={listing._id}>
            <Link to={`/listings/${listing.imagesUrls[0]}`}>
                <img src={listing.imagesUrls[0]} alt="" className='h-16 w-16 object-contain'/>
            </Link>

            <Link className='text-slate-700 font-semibold hover:underline truncate flex-1 ' to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>

            <div className='flex flex-col items-center'>
                <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
                
            </div>
            <div>
              
            </div>

          </div>
        )
        )
      }
      </div>}
    </div>
  )
}
