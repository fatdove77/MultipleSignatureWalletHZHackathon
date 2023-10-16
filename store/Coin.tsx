import React, { useEffect, useState } from 'react'
//状态管理
import { createContainer, useContainer } from 'unstated-next';
import FIBO from '@/public/ETH.png'
import { digitalPrecision } from '@/utils/utils';
//个人钱包方法
import Web3Provider from '@/store/Web3Provider';
import useWallet from '@/hooks/useWallet'
import { getContract } from '@/hooks';
import { useTokenContract } from '@/hooks/useContract';
import ERC20_ABI from '@/constance/abi/erc20.json';
import { ethereumAddressImage } from '@/utils/Avatar';
type CoinType = {
  name: string,
  address: string,
  accuracy: number,
  img: any,
  balance?: number
}

let init: CoinType[] = [
  {
    name: 'ETH',
    address: "",
    accuracy: 18,
    img: FIBO,
    balance: 0,
  },
  {
    name: 'C-ETH',
    address: "0xff8B62ab02B7eEF19E09e1Dfafb6688F1Af84a03",  //后续换为fly地址
    accuracy: 18,
    img: FIBO,
    // balance:0,
  }
]




const Coin = () => {
  const { provider, account } = Web3Provider.useContainer();
  const [coinList, setCoinList] = useState<CoinType[]>(init);
  const { walletInfo } = useWallet.useContainer();
  const [loading, setLoading] = useState<boolean>(true);


  const InitCoinList = async () => {
    setLoading(true);
    //如果缓存有值 ，整理好数据结构添加
    let addCoinList = window !== undefined ? JSON.parse(localStorage.getItem("addCoinList") ?? "[]") : [];
    if (addCoinList.length > 2) {
      const temp_init = [...init, ...addCoinList];
      init = Array.from(new Set(temp_init.map(item => item.address)))
        .map(address => {
          return temp_init.find(item => item.address === address);
        });
    }
    //整理数据结构
    Promise.all(init?.map(async(item: any, index: number) => {
      let balance: any;
      if (index === 0) {
        try {
          await provider.getBalance(walletInfo?.address).then((res: any) => {
            balance = digitalPrecision(res,18,true) 
            console.log(balance);
            item.balance = parseFloat(balance);
          });
        } catch (error) {
          console.log(error);
        }
      }
      else {
        const contract = getContract(item?.address, ERC20_ABI, provider);
        try {
          await contract['balanceOf'](...[walletInfo?.address]).then((res: any) => {
            balance = digitalPrecision(res,18,true) 
            console.log(balance);
            item.balance = parseFloat(balance);
          });
        } catch (error) {
          console.log(error);
        }
      }
      if (!item.img) {
        item.img = ethereumAddressImage(item?.address);
      }
      setCoinList(init);
      localStorage.setItem('addCoinList', JSON.stringify(init));
      setLoading(false);

    }))
  }

  useEffect(() => {
    InitCoinList();
  }, [provider, walletInfo])

  return {
    coinList,
    loading,
    InitCoinList
  }

}
export default createContainer(Coin)