import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类
import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { type MethodArg, digitalPrecision, setObjBigNumber } from '@/utils/utils';
//个人钱包方法
import Web3Provider from '@/store/Web3Provider';
import { createContainer, useContainer } from 'unstated-next';
//实例化合约方法
import {
  useMultiFactory
} from '@/hooks/useContract'
//提示
import toast from 'react-hot-toast';
import { addressConvert, addressRecover } from '@/utils/utils';
//状态管理
import TransferInfo from '@/store/TransferInfo';
import { ethereumAddressImage } from '@/utils/Avatar';
const AddressBooksStore = () => {
  const [addressBook, setAddressBook] = useState<any[]>();
  const [name,setName] = useState<string>();
  const [address,setAddress] = useState<string>();
  const [sendIndex,setSendIndex] = useState<number>();
  const [editFlag,setEditFlag] = useState<boolean>(false);
  let local_addressBook = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("addressBook") ?? "[]") : [];

  const InitAddressBook = () => {
    setAddressBook(local_addressBook);
  }

  const SaveAddressBook = ()=>{
    //更新缓存
    let tempArr:any = JSON.parse(JSON.stringify(addressBook));
    tempArr.push({
      address:address,
      name:name,
      img:ethereumAddressImage(address)
    })
    localStorage.setItem("addressBook",JSON.stringify(tempArr));
    //更新addressBook
    setAddressBook(tempArr);
    // InitAddressBook();
  }

  const EditAddressBook = (index:number)=>{
    let tempArr:any = JSON.parse(JSON.stringify(addressBook));
    tempArr[index].name = name;
    tempArr[index].address = address;
    localStorage.setItem("addressBook",JSON.stringify(tempArr));
    //更新addressBook
    setAddressBook(tempArr);
  }

  const DeleteAddressBook = (index:number)=>{
    console.log(index);
    let tempArr:any =JSON.parse(JSON.stringify(addressBook));
    tempArr.splice(index,1);
    console.log(tempArr);
    
    localStorage.setItem("addressBook",JSON.stringify(tempArr));
    //更新addressBook
    setAddressBook(tempArr);
  }

   //名称输入框
   const HandleName = (name: string) => {
    setName(name)
  }
  //地址输入框
  const HandleAddress = (address: string) => {
    let tempAddress = address;
    if (tempAddress.substring(0, 2).includes("fb")) {
      tempAddress = addressRecover(tempAddress);
    }
    setAddress(tempAddress)
  }


  useEffect(() => {
    InitAddressBook()
    console.log(local_addressBook);
  }, [])


  return {
    addressBook,
    address,
    name,
    sendIndex,
    setEditFlag,
    editFlag,
    setSendIndex,
    setName,
    setAddress,
    HandleAddress,
    HandleName,
    SaveAddressBook,
    DeleteAddressBook,
    EditAddressBook
  }

}

export default createContainer(AddressBooksStore)