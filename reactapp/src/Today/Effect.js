// import React, { useEffect ,useState} from 'react'

// const Effect = () => {

//     const[num,setNum]=useState(0);
//     useEffect(() => {
//    console.log("Component Did mount");
//     }, [])

//     useEffect(() => {
//       console.log("component Did Update",num);
//     }, [num])

//     useEffect(() => {
     
//         console.log("Component will Unmound");
//       return () => {
//         console.log("data erased");
//       }
//     }, [])
    
    
    
//   return (
//     <div>
//         <button onClick={()=>setNum(num+1)}>Click Me</button>
//     </div>
//   )
// }

// export default Effect