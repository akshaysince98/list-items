import './App.css';
import Listitems from './components/Listitems';
import Addlist from './components/Addlist';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { useEffect, useState } from 'react';

function App() {

  const [texts, setTexts] = useState([])
  const [textsName, setTextsName] = useState([])
  const [extraTexts, setExtraTexts] = useState([])
  const [loading, setLoading] = useState(true)
  const [priority, setPriority] = useState(0)


  useEffect(() => {
    (async () => {
      console.log("running")
      let arr = []
      let narr = []
      const q = query(collection(db, "items"), orderBy("priority"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((t) => {
        arr.push(t.data())
        narr.push(t.data().text)
      })
      setPriority(arr.length)
      setTexts(arr)
      setExtraTexts(arr)
      setTextsName(narr)
      setLoading(false)
    })();
  }, [loading])

  const priorityChange = async (x, textname) => {
    let ntexts = texts.slice()
    // console.log(ntexts)
    let idx = texts.findIndex((t) => t.text == textname)
    if (x == -1 && idx == 0) {
      return
    }
    if (x == 1 && idx == texts.length - 1) {
      return
    }

    ntexts.splice(idx + x, 0, ntexts.splice(idx, 1)[0]);
    for (let key in ntexts) {

      await setDoc(doc(db, "items", String(key)), {
        text: ntexts[key].text,
        priority: key,
        pinned: ntexts[key].pinned
      })
    }

    console.log(ntexts)
    setTexts(ntexts)
    setExtraTexts(ntexts)

    let namentexts = ntexts.map((n) => n.text)
    setTextsName(namentexts)
    // console.log(texts)

  }

  const deleteText = async (textname) => {
    let ntexts = texts.filter((t) => t.text != textname)

    await deleteDoc(doc(db, "items", String(texts.length - 1)));
    for (let key in ntexts) {

      await setDoc(doc(db, "items", String(key)), {
        text: ntexts[key].text,
        priority: key,
        pinned: ntexts[key].pinned
      })
    }

    setPriority(ntexts.length)
    setTexts(ntexts)
    setExtraTexts(ntexts)

    let namentexts = ntexts.map((n) => n.text)
    setTextsName(namentexts)
  }

  const pinunpinmain = async (p, textname) => {
    setLoading(true)
    let ntexts = texts.slice()
    let idx = texts.findIndex((t) => t.text == textname)
    ntexts[idx].pinned = p

    for (let key in ntexts) {
      await setDoc(doc(db, "items", String(key)), {
        text: ntexts[key].text,
        priority: key,
        pinned: ntexts[key].pinned
      })
    }
    setTexts(ntexts)
    setExtraTexts(ntexts)

    let ntextname = ntexts.map((t) => t.text)
    setTextsName(ntextname)

    if (p) {
      pinhelper()
    } else {
      unpinhelper()
    }

    setLoading(false)
  }

  const unpinhelper = () => {
    setExtraTexts(texts)
    let nametexts = texts.map((t) => t.text)
    setTextsName(nametexts)
  }


  const pinhelper = () => {
    let ntextname = textsName.slice()
    console.log(textsName)
    let idxarr = []
    let textarr = []
    texts.forEach((t, i) => {
      if (t.pinned == true) {
        idxarr.push(i)
        textarr.push(t.text)
      }
    })

    for (let i = 0; i < textarr.length; i++) {
      ntextname = ntextname.filter((t) => {
        return t != textarr[i]
      })
    }

    for (let i = 0; i < textarr.length; i++) {
      ntextname.unshift(textarr[i])
    }

    let netext = ntextname.map((t) => {

      let ei = extraTexts.findIndex((e) => e.text == t)

      return extraTexts[ei]
    })

    setExtraTexts(netext)
    setTextsName(ntextname)
  }

  const addText = (textobj) => {
    let ntexts = texts.slice()
    ntexts.push(textobj)
    setPriority(ntexts.length)
    setTexts(ntexts)
    setExtraTexts(ntexts)

    let namentexts = ntexts.map((n) => n.text)
    setTextsName(namentexts)
  }

  return (
    <>
      <div className='general'>
        {
          loading ? <div>loading...</div> :
            textsName.map((t, i, arr) => <Listitems key={i} t={t} i={i} tobj={extraTexts[i]} length={arr.length} priorityChange={priorityChange} deleteText={deleteText} pinunpinmain={pinunpinmain} />)
        }
        <Addlist priority={priority} addText={addText} />
      </div>
    </>
  );
}

export default App;
