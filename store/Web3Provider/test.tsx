import React,{useState} from 'react'
//状态管理
import { createContainer, useContainer } from 'unstated-next';
const useTest = ()=>{
  const [count,setCount] = useState<number>(1);

  return {
    count,setCount
  }

}
export default createContainer(useTest)