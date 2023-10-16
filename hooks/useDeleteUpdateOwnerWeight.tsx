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
export const useDeleteUpdateOwnerWeight = () => {
  const { walletInfo } = useWallet.useContainer();
  //删除后的成员对象数组
  const [deleteOwner, setDeleteOwner] = useState<any>([]);
  //删除成员的下标
  const [deleteIndex, setDeleteIndex] = useState<number>(0);
  const ChangeDeleteOwnerWeight = (index: number, weight: string) => {
    let temp_deleteOwner: any = JSON.parse(JSON.stringify(deleteOwner));
    temp_deleteOwner[index].weight = parseInt(weight);
    console.log(temp_deleteOwner);
    setDeleteOwner(temp_deleteOwner);
  }

  useEffect(() => {
    if (walletInfo) {
      let temp_walletInfo = JSON.parse(JSON.stringify(walletInfo?.data?.ownerArr));
      temp_walletInfo.splice(deleteIndex, 1);
      setDeleteOwner(temp_walletInfo)
    }
  }, [walletInfo,deleteIndex])




  return {
    deleteIndex,
    setDeleteIndex,
    deleteOwner,
    ChangeDeleteOwnerWeight
  }
}