import React, { useEffect, useState } from 'react'
//状态管理
import { createContainer, useContainer } from 'unstated-next';
import { digitalPrecision } from '@/utils/utils';
//个人钱包方法
import useWallet from '@/hooks/useWallet'
import AddressBooksStore from '@/store/AddressBooksStore';
import Coin from '@/store/Coin';
import dayjs from 'dayjs';
const TransferInfo = ()=>{
  const {walletInfo} = useWallet.useContainer();
  const {coinList} = Coin.useContainer();
  // const {} = AddressBooksStore.useContainer()
  const [receiveAddress,setReceiveAddress] = useState<string>();
  const [fromAddress,setFromAddress] = useState<string>();
  const [amount,setAmount] = useState<number>(0);
  const [coinInfo,setCoinInfo] = useState<any>();
  const [createTime,setCreateTime] = useState<string>();
  //发起事务之后把所有信息存在这里
  const [transferInfo,setTransferInfo] = useState<any>();
  let local_transferInfo = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("transferInfo") ?? "{}") : {};
  useEffect(()=>{
    setFromAddress(walletInfo?.address);
  },[walletInfo])



  //存储转
  const SaveTransferInfo = (coinInfo:any,amount:number,walletInfo_:any,createTime:string,receiveAddress:string,name:string,img:any,nonce:number)=>{
    //这里存储到缓存 创建事务需要把这个东西传进去  
    let temp_TransFerInfo = {
      coinInfo:coinInfo,
      amount:amount,
      walletInfo:walletInfo_,
      createTime:createTime,
      receiveAddress:receiveAddress,
      receiveName:name,
      receiveImg:img,
      nonce:nonce
    }
    localStorage.setItem("transferInfo",JSON.stringify(temp_TransFerInfo));
    setTransferInfo(temp_TransFerInfo)
  }


  //跳转任务队列
  const NavigateTransferInfo = (transferInfo:any)=>{
    localStorage.setItem("transferInfo",JSON.stringify(transferInfo));
    setTransferInfo(transferInfo)

  }

//更改权重
  const SaveUpdateTransInfo = (temp_transferInfo:any)=>{
    localStorage.setItem("transferInfo",JSON.stringify(temp_transferInfo));
    setTransferInfo(temp_transferInfo)
  }

  useEffect(()=>{
    setTransferInfo(local_transferInfo);
    setCoinInfo(coinList[0])
  },[])
  
  
  return {
    receiveAddress,
    fromAddress,
    amount,
    coinInfo,
    setReceiveAddress,
    setFromAddress,
    setAmount,
    setCoinInfo,
    SaveTransferInfo,
    SaveUpdateTransInfo,
    transferInfo,
    NavigateTransferInfo
  }
}


export default createContainer(TransferInfo)