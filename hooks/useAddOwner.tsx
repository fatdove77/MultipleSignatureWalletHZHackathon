import React, { useEffect, useState } from 'react'
//状态管理
import { createContainer, useContainer } from 'unstated-next';
import FIBO from '@/public/FIBO.png'
import { digitalPrecision } from '@/utils/utils';
//个人钱包方法
import Web3Provider from '@/store/Web3Provider';
import useWallet from '@/hooks/useWallet'
import { getContract } from '@/hooks';
import { useTokenContract } from '@/hooks/useContract';
import ERC20_ABI from '@/constance/abi/erc20.json';
import { ethereumAddressImage } from '@/utils/Avatar';
import { CheckAddressCorrect } from '@/utils/utils';
import Coin from '@/store/Coin';
import { addressConvert, addressRecover } from '@/utils/utils';
import { toast } from 'react-hot-toast';
export const useAddOwner = () => {
  const { walletInfo } = useWallet.useContainer();
  const [showWalletArr, setShowWalletArr] = useState<any>([]);

  const AddNewOwner = () => {
    let temp_showWalletArr: any = JSON.parse(JSON.stringify(showWalletArr))
    console.log(temp_showWalletArr.length,walletInfo?.data?.ownerArr.length + 1);
    
    if (temp_showWalletArr.length === walletInfo?.data?.ownerArr.length + 1) {
      toast.error("单次只能添加一个拥有者");
      return;
    }
    else {
      temp_showWalletArr.push({});
      console.log(temp_showWalletArr);
      setShowWalletArr(temp_showWalletArr);
    }

  }

  const DeleteOwner = (index: number) => {
    let temp_showWalletArr: any = JSON.parse(JSON.stringify(showWalletArr))
    temp_showWalletArr.splice(index, 1);
    setShowWalletArr(temp_showWalletArr);
  }

  const handleOwnerName = (index: number, name: string) => {
    let temp_showWalletArr: any = JSON.parse(JSON.stringify(showWalletArr));
    temp_showWalletArr[index].name = name;
    console.log(temp_showWalletArr);
    setShowWalletArr(temp_showWalletArr);
  }



  const handleOwnerAddress = (index: number, address: string) => {
    let temp_showWalletArr: any = JSON.parse(JSON.stringify(showWalletArr));
    temp_showWalletArr[index].address = address;
    if (address.substring(0, 2).includes("fb")) {
      temp_showWalletArr[index].address = addressRecover(address);
    }
    console.log(temp_showWalletArr);
    setShowWalletArr(temp_showWalletArr);
  }


  const handleOwnerWeight = (index: number, weight: string) => {
    let temp_showWalletArr: any = JSON.parse(JSON.stringify(showWalletArr));
    temp_showWalletArr[index].weight = parseInt(weight);
    console.log(temp_showWalletArr);
    setShowWalletArr(temp_showWalletArr);
  }





  useEffect(() => {
    if (walletInfo) {
      JSON.parse(JSON.stringify(walletInfo?.data?.ownerArr))
      setShowWalletArr(JSON.parse(JSON.stringify(walletInfo?.data?.ownerArr)))
    }
  }, [walletInfo])




  return {
    showWalletArr,
    AddNewOwner,
    DeleteOwner,
    handleOwnerName,
    handleOwnerAddress,
    handleOwnerWeight
  }
}