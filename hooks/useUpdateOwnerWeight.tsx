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
export const useUpdateOwnerWeight = () => {
  const { walletInfo } = useWallet.useContainer();
  const [newWeightOwner, setNewWeightOwner] = useState<any>([]);

  const ChangeOwnerWeight = (index: number, weight: string) => {
    let temp_newWeightOwner: any = JSON.parse(JSON.stringify(newWeightOwner));
    temp_newWeightOwner[index].weight = parseInt(weight);
    console.log(temp_newWeightOwner);
    setNewWeightOwner(temp_newWeightOwner);
  }





  useEffect(() => {
    if (walletInfo) {
      JSON.parse(JSON.stringify(walletInfo?.data?.ownerArr))
      setNewWeightOwner(JSON.parse(JSON.stringify(walletInfo?.data?.ownerArr)))
    }
  }, [walletInfo])




  return {
    newWeightOwner,
    ChangeOwnerWeight
  }
}