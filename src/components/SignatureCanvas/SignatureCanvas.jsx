import SignatureCanvas from 'react-signature-canvas'
import "./SignatureCanvas.css"
import { useRef, useState } from 'react'
import { Toast } from '../design/alert'




const Signature = ()=>{
    const signRef = useRef(null)
    const [imgurl,setImgurl]  =useState(null);
    const [bgColor,setBgColor] = useState("#181D31");
    const [penColor,setPenColor] = useState("#F0E9D2");
    const [penWeight,setPenWeight] = useState(1);
    const [sigArryData,setSigArryData] = useState(null);
    const [localData,setLocalData] = useState(localStorage.getItem("signatureData") || "")
    const [menu,setMenu]=useState(false);

const clearHandeler = ()=>{
signRef.current.clear();
setSigArryData(null);
}

const handelPenColor =(e)=>{
    setPenColor(e.target.value)
}

const handelPenWeight =(e)=>{
    setPenWeight(Number(e.target.value))
}

const downloadHandeler =()=>{
      clearHandeler();
}


const copyDataUrlHandeler = async ()=>{
    const dataUrl =  await signRef.current.toDataURL();
      try {
        await navigator.clipboard.writeText(dataUrl);
        Toast.fire({
            icon: 'success',
            title: 'لینک با موفقیت کپی شد !'
          })
      } catch (err) {
        Toast.fire({
            icon: 'error',
            title: 'کپی انجام نشد !!!'
          })
      } 
}



const toDataUrlHandeler = ()=>{
  let arryData = signRef.current.toData();
  setSigArryData(arryData);
  const dataUrl =  signRef.current.toDataURL();
  setImgurl(dataUrl)
}
const handelUndo = (e)=>{

const newArry = sigArryData; 
newArry.reverse(); 
newArry.shift()
setSigArryData(newArry.reverse());
signRef.current.fromData(sigArryData);
if(!newArry.length){
    setSigArryData(null)
}
}

const saveTolocalHandeler = ()=>{
    localStorage.setItem("signatureData",JSON.stringify(signRef.current.toData()))
    setLocalData(localStorage.getItem("signatureData"))
    Toast.fire({
        icon: 'success',
        title: ' با موفقیت ثبت شد !'
      })
}
const importFromlocalHandeler = ()=>{
    signRef.current.fromData(JSON.parse(localStorage.getItem("signatureData")))
    Toast.fire({
        icon: 'success',
        title: ' با موفقیت واکشی شد !'
      })
}

const removeFromlocalHandeler = ()=>{
    localStorage.removeItem("signatureData")
    setLocalData("")
    Toast.fire({
        icon: 'success',
        title: ' با موفقیت حذف شد !'
      })
    clearHandeler();
}


    return(
        <>
        <div className={`btns neumorphism ${menu ? "show" :""}`}>

        <div onClick={()=>setMenu(menu ? false : true )} className={`btn-menu ${menu ? "show" :""}`}>
            <span className='item-1'></span>
            <span className='item-2'></span>
            <span className='item-3'></span>
        </div>

            <button >
            <span>وزن قلم</span>
            <box-icon name='pencil'></box-icon><input  value={penWeight} title='وزن قلم' min={1} max={10} type={'range'} onChange={handelPenWeight}/>
            </button> 

            <button >
            <span>رنگ قلم</span>
            <box-icon type='solid' name='eyedropper'></box-icon>
            <input defaultValue={"#F0E9D2"} title='رنگ قلم' type={'color'} onChange={handelPenColor}/>
            </button>
             {sigArryData && 
             (
            <>

            <button title='Clear Canvas' className='neumorphism' onClick={clearHandeler}>
            <span>پاک کردن صفحه</span>
            <box-icon name='trash'></box-icon>
            </button>

            <button title='برگشت به عقب' onClick={handelUndo}>
            <span>بازگشت به عقب</span>
            <box-icon name='undo'></box-icon>
            </button>

            <button style={{cursor:"copy"}} title='کپی به صورت لینک' className='neumorphism' onClick={copyDataUrlHandeler}>
            <span>کپی به صورت لینک</span>
            <box-icon name='copy-alt'></box-icon>
            </button>


            <button style={{cursor:"pointer"}} title='دانلود به صورت عکس' className='neumorphism'>
            <a onClick={downloadHandeler} target={"_blank"} href={imgurl} download >
            <span>دانلود به صورت عکس</span>
            <box-icon name='download'></box-icon>
            </a>
            </button>


            <button onClick={saveTolocalHandeler} style={{cursor:"pointer"}} title='ذخیره در حافظه' className='neumorphism'>
            <span>ذخیره در مرورگر</span>
            <box-icon name='save'></box-icon>
            </button>

            </>
            )
        }
        {localData &&(
            <>
            <button onClick={importFromlocalHandeler} style={{cursor:"pointer"}} title='واکشی از حافظه' className='neumorphism'>
            <span>واکشی از حافظه</span>
            <box-icon name='file-import' type='solid' ></box-icon>
            </button>

            <button onClick={removeFromlocalHandeler} style={{cursor:"pointer"}} title='حذف از حافظه' className='neumorphism'>
            <span>حذف از حافظه</span>
            <box-icon name='message-alt-x'></box-icon>
            </button>     

            </>
                )
        }
        </div>
        <SignatureCanvas
        backgroundColor={bgColor}
        ref={signRef}
        onEnd={toDataUrlHandeler}
        velocityFilterWeight={penWeight} 
        penColor={penColor}
        canvasProps={{className:"sigCanvas neumorphism"}}/>
         </>
    )
}

export default Signature