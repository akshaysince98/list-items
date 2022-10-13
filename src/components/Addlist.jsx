import { doc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { db } from '../Firebase'
import './addlist.css'

function Addlist(props) {

  const [lii, setLii] = useState('')
  const [error, setError] = useState('')

  // console.log(props.priority)

  const addItem = async () => {
    console.log(props.priority)
    if (!lii) {
      setError("Empty field not allowed");
      setTimeout(() => {
        setError('')
      }, 3000)
      return
    }
    try {
      props.addText(lii)
      await setDoc(doc(db, "items", String(props.priority)), {
        text: lii,
        priority: props.priority
      })


    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError('')
      }, 3000)
    }
    setLii('');
  }


  return (
    <>
      {
        error ? <div className='add-box' >{error}</div> :
          <div className='add-box'>
            <input placeholder='Enter Text' type="text" onChange={(e) => { setLii(e.target.value) }} />
            <button onClick={addItem}>Add</button>
          </div>
      }
    </>
  )
}

export default Addlist
