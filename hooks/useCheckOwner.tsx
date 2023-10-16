import { useDoorContract, uesWeightContract } from '@/hooks/useContract';
import { createContainer } from 'unstated-next';
import TransferInfo from '@/store/TransferInfo';
import Web3Provider from '@/store/Web3Provider';
import React, { useEffect, useState } from 'react'
//ABI
import MultiSignatureThreshold_ABI from '@/constance/abi/MultiSignatureThreshold.json'
import MultiSignatureWeight_ABI from '@/constance/abi/MultiSignatureWeight.json'
import { getContract } from '@/hooks';
export const useCheckOwner = () => {
  const { provider, account } = Web3Provider.useContainer();
  const [save, setSave] = useState<boolean>(false);//是否是多签用户
  const {
    transferInfo
  } = TransferInfo.useContainer();

  const CheckOwner = async (temp_transferInfo:any) => {
    const DoorContract = getContract(temp_transferInfo?.walletInfo?.address ?? '', MultiSignatureThreshold_ABI, provider, account)
    const WeightContract = getContract(temp_transferInfo?.walletInfo?.address ?? '', MultiSignatureWeight_ABI, provider, account);
    console.log(DoorContract, WeightContract);
    console.log(temp_transferInfo);
    //门限
    if (temp_transferInfo?.walletInfo?.data?.signType === 0) {
      console.log("门限钱包");
      try {
        const res = await DoorContract?.['isOwner'](...[account]);
        return res
      } catch (error) {
        console.log(error);
      }
    }
    //权重
    else {
      console.log("权重钱包");
      try {
        const res = await WeightContract?.['isOwner'](...[account]);
        return res
      } catch (error) {
        console.log(error);
      }
    }
  }

  return {
    save,
    CheckOwner
  }
}
