import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类
import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { type MethodArg, digitalPrecision, setObjBigNumber } from '@/utils/utils';
//个人钱包方法
import Web3Provider from '@/store/Web3Provider';
//实例化合约方法
import {
  useMultiFactory
} from '@/hooks/useContract'
//提示
import toast from 'react-hot-toast';
import { addressConvert, addressRecover } from '@/utils/utils';
//状态管理
import { createContainer, useContainer } from 'unstated-next';
import Coin from '@/store/Coin';
import TransferInfo from '@/store/TransferInfo';
import useWallet from './useWallet';
import AddressBooksStore from '@/store/AddressBooksStore';
export const useSendCoin = () => {
  const { coinList } = Coin.useContainer();
  const { walletInfo } = useWallet.useContainer();
  const {
    receiveAddress,
    fromAddress,
    amount,
    coinInfo,
    setReceiveAddress,
    setFromAddress,
    setAmount,
    setCoinInfo
  } = TransferInfo.useContainer();  
  const { 
    addressBook,
    sendIndex,
    setSendIndex,
    setName,
    setAddress,
    DeleteAddressBook
   } = AddressBooksStore.useContainer();
  const [_address, set_address] = useState<string>();
  const [_amount, set_amount] = useState<number>(0);
  const [coinIndex, setCoinIndex] = useState<number>(0);

   console.log(addressBook);
   

  //名称输入框
  const HandleAmount = (amount: string) => {
    setAmount(parseFloat(amount))
  }
  //地址输入框
  const HandleAddress = (address: string) => {
    let tempAddress = address;
    if (tempAddress.substring(0, 2).includes("fb")) {
      tempAddress = addressRecover(tempAddress);
    }
    setReceiveAddress(tempAddress)
  }

  //代币选择
  const HandleCoinIndex = (index: any) => {
    setCoinIndex(parseFloat(index));
    setCoinInfo(coinList[index]);
  }


  //max
  const EnMax = () => {
    setAmount(coinList[coinIndex]?.balance ?? 0);
  }


  // const SetStore = () => {
  //   setReceiveAddress(_address);
  //   setFromAddress(walletInfo.address);
  //   setAmount(_amount);
  //   setCoinInfo(coinList[coinIndex]);
  // }


  return useMemo(() => {
    return {
      _address,
      _amount,
      coinIndex,
      HandleAmount,
      HandleAddress,
      HandleCoinIndex,
      EnMax,
    }
  }, [_address, _amount, coinIndex,])
}