import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import styles from '../../global/styles';
import LoadingCards from '../../components/loadingCards';
import { getAllItems, uploadDataToFirestore, uploadFileToFirebase, getFirestoreDocumentById, deleteDocument, useAuth } from '../../contexts/FirebaseContext';

const Edit = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [fileName, setFileName] = useState('')
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([])
  const [quantities, setQuantities] = useState([]);
  const [loading, setLoading] = useState(true)

  const {auth, currentUser} = useAuth()

  const { id } = useParams()

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': []
    }
  });

  const onDrop = (acceptedFiles:any) => {
    // Handle file upload logic here
    const file = acceptedFiles[0];
    setImage(acceptedFiles[0])
    setFileName(file.name)
  };

  const handleItemChange = (selectedItems:any) => {
    setItems(selectedItems);
  };

  const handleQuantityChange = (e:any, index:any) => {
    const newQuantities:any = [...quantities];
    newQuantities[index] = e.target.value;
    setQuantities(newQuantities);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setLoading(true)
    
    console.log(image)
    let itemsAndQuantityMap: any = []
    items.forEach((el, index) => {
      itemsAndQuantityMap.push({
        item:el,
        quantities: quantities[index]
      })
    })
    uploadFileToFirebase(image, 'poojas/images/').then(async (resp:any) => {
      const payload = {
        image: resp.url,
        name,
        description,
        duration,
        price: cost,
        items: itemsAndQuantityMap,
        status: 'pending',
        uid: currentUser.uid
      }
      await uploadDataToFirestore('poojas', payload)

      deleteDocument('poojas', id)

      setImage(null);
      setName('');
      setDuration('');
      setDescription('');
      setCost('');
      setItems([]);
      setQuantities([]);

      setTimeout(() => {
        setLoading(false)
      }, 1000)

    })
  };
  


  useEffect(() => {
    getAllItems().then((resp:any) => {
      let items:any = []
      resp.forEach((element:any) => {
        items.push({
          value: element.id,
          label: element.name
        })
      });
      setAllItems(items)
    })

    getFirestoreDocumentById('poojas', id).then((resp:any) => {
      setName(resp.name)
      setDescription(resp.description)
      setDuration(resp.duration)
      setCost(resp.price)
      console.log(resp)
      let itemsArray:any = []
      let quantitiesArray:any = []
      resp.items.forEach((el:any) => {
        getFirestoreDocumentById('items', el.itemId).then((itemsResp: any) => {
          itemsArray.push({value: el.itemId, label: itemsResp.name})
        })
        quantitiesArray.push(el.quantity)
      })
      setTimeout(() => {
        setItems(itemsArray)
        setQuantities(quantitiesArray)
        setTimeout(() => {
          setLoading(false)
        }, 1000);
      }, 1500)
    })

  }, [])

  if(loading) {
    return (<LoadingCards />)
  }

  return (
    <div className="container font-playfair p-5 bg-white rounded-lg w-[90%] md:w-[70%] xl:w-[60%] shadow-lg mx-auto mt-[60px]">
      <h1 className="text-2xl font-playfair font-semibold mb-6">Edit Pooja</h1>
      {!loading && <form onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="mt-[20px] mb-4">
          <label className="block text-sm font-medium text-gray-600">Upload Image</label>
          <div className="mt-[20px]">
            <div className="dropzone">
              {/* <div {...useDropzone({ onDrop })} className="border-dashed border-2 h-[250px] p-4 cursor-pointer">
                Drag & drop an image here, or click to select one.
              </div> */}
              <Dropzone accept={{'image/png': ['.png'], 'image/jpg': ['.jpg'], 'image/jpeg': ['.jpeg']}} maxFiles={1} onDrop={onDrop}>
                {({getRootProps, getInputProps}) => (
                  <section className="border-dashed border-2 h-[250px] flex flex-col items-center justify-center font-playfair p-4 cursor-pointer">
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p className='font-playfair'>{fileName ? fileName : "Drag 'n' drop some files here, or click to select files"}</p>
                    </div>
                  </section>
                )}
              </Dropzone>

            </div>
          </div>
        </div>

        {/* Pooja Name */}
        <div className="mt-[20px] mb-4">
          <label className="block text-sm font-medium text-gray-600">Pooja Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-[14px] p-2 w-full border rounded" required />
        </div>

        {/* Pooja Duration */}
        <div className="mt-[20px] mb-4">
          <label className="block text-sm font-medium text-gray-600">Pooja Duration</label>
          <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-[14px] p-2 w-full border rounded" required />
        </div>

        {/* Pooja Description */}
        <div className="mt-[20px] mb-4">
          <label className="block text-sm font-medium text-gray-600">Pooja Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-[14px] p-2 w-full border rounded" required></textarea>
        </div>

        {/* Pooja Cost */}
        <div className="mt-[20px] mb-4">
          <label className="block text-sm font-medium text-gray-600">Pooja Cost</label>
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="mt-[14px] p-2 w-full border rounded" required />
        </div>

        {/* Multi-select Box for Items */}
        <div className="mt-[20px] mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-[15px]">Select Items</label>
          <Select
            options={allItems} // Provide your item options here
            isMulti
            value={items}
            onChange={handleItemChange}
          />
        </div>

        {/* Quantity for Each Item */}
        <div className="mb-8">
          {items.map((item:any, index:any) => (
            <div key={item.value} className="mt-[20px] mb-4">
              <label className="block text-sm font-medium text-gray-600">Quantity for {item.label}</label>
              <input
                type="number"
                value={quantities[index] || ''}
                onChange={(e) => handleQuantityChange(e, index)}
                className="mt-[14px] p-2 w-full border rounded"
                required
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button disabled={loading} type="submit" className={styles.primaryBtn + ' ' + (loading ? " bg-slate-900 cursor-not-allowed" : "")}>
          Update Pooja
        </button>
      </form>}
    </div>
  );
};

export default Edit;
