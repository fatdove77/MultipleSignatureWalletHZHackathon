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
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
export const useAddCoin = () => {
  const { provider, account } = Web3Provider.useContainer();
  const { InitCoinList } = Coin.useContainer();
  const [coinContract, setCoinContract] = useState<string>();
  const [coinName, setCoinName] = useState<string>();
  const [coinAccuracy, setCoinAccuracy] = useState<number>();
  const [save, setSave] = useState<boolean>(false);
  const router = useRouter();

  const HandleContract = async (inputContract: string) => {
    setCoinContract(inputContract);
    if (CheckAddressCorrect(inputContract)) {
      console.log("正确的代币地址");
      //解析名称和精度
      try {
        const ErcContract = getContract(inputContract, ERC20_ABI, provider, account);
        await ErcContract.symbol().then((res: any) => {
          console.log(res);
          setCoinName(res);
        })
        await ErcContract.decimals().then((res: any) => {
          console.log(res);
          setCoinAccuracy(res);
          setSave(true)
        })
      } catch (error) {
        setSave(false);
        toast.error("不正确的代币合约")
      }

    }
    else {
      setSave(false);
    }
  }

  const HandleCoinName = (name: string) => {
    setCoinName(name);
  }

  const HandleCoinAccuracy = (acc: number) => {
    setCoinAccuracy(acc);
  }

  const SaveLocalCoin = () => {
    let addCoinList = window !== undefined ? JSON.parse(localStorage.getItem("addCoinList") ?? "[]") : [];
    let temp = {
      name: coinName,
      address: coinContract,
      accuracy: coinAccuracy,
    }
    addCoinList.push(temp);
    console.log(addCoinList);
    localStorage.setItem('addCoinList', JSON.stringify(addCoinList));
    router.push("/Wallet/Assets")
    try {
      InitCoinList()
    } catch (error) {
      console.log(error);
    }


  }

  return {
    coinContract,
    coinName,
    coinAccuracy,
    save,
    HandleContract,
    HandleCoinName,
    HandleCoinAccuracy,
    SaveLocalCoin
  }

}