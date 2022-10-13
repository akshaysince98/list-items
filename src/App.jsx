import './App.css';
import Listitems from './components/Listitems';
import Addlist from './components/Addlist';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { useEffect, useState } from 'react';

function App() {

  const [texts, setTexts] = useState([])
  const [loading, setLoading] = useState(true)
  const [priority, setPriority] = useState(0)


  useEffect(() => {
    (async () => {
      let arr = []
      const q = query(collection(db, "items"), orderBy("priority"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((t) => {
        arr.push(t.data().text)
        // console.log(t.id);
      })
      setPriority(arr.length)
      setTexts(arr)
      setLoading(false)
    })();
  }, [])

  const priorityChange = async (x, text) => {
    let ntexts = texts.slice()
    // console.log(ntexts)
    let idx = texts.findIndex((t) => t == text)
    if (x == -1 && idx == 0) {
      return
    }
    if (x == 1 && idx == texts.length - 1) {
      return
    }

    ntexts.splice(idx + x, 0, ntexts.splice(idx, 1)[0]);
    for (let key in ntexts) {

      await setDoc(doc(db, "items", String(key)), {
        text: ntexts[key],
        priority: key
      })
      // console.log("doc updated")
    }
    setTexts(ntexts)
    // console.log(texts)

  }

  const deleteText = async (text) => {
    let ntexts = texts.filter((t) => t != text)
    // console.log(ntexts)
    await deleteDoc(doc(db, "items", String(texts.length - 1)));
    for (let key in ntexts) {

      await setDoc(doc(db, "items", String(key)), {
        text: ntexts[key],
        priority: key
      })
      // console.log("doc updated")
    }
    setPriority(ntexts.length)
    setTexts(ntexts)
  }

  const addText = (text) => {
    let ntexts = texts.slice()

    ntexts.push(text)
    // console.log(ntexts)
    setPriority(ntexts.length)
    setTexts(ntexts)
  }

  return (
    <>
      <div className='general'>
        {
          loading ? <div>loading...</div> :
            texts.map((t, i, arr) => <Listitems key={i} t={t} i={i} length={arr.length} priorityChange={priorityChange} deleteText={deleteText} />)
        }
        <Addlist priority={priority} addText={addText} />
      </div>
    </>
  );
}

export default App;
