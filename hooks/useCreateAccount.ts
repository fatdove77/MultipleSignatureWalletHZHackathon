import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类
import { type MethodArg, digitalPrecision, setObjBigNumber } from '@/utils/utils';
import { toCallState, type CallState } from '../utils/utils';
//个人钱包方法
import Web3Provider from '@/store/Web3Provider';
//实例化合约方法
import {
  useMultiFactory
} from '@/hooks/useContract'
//逻辑合约地址
import { ThresholdContract } from '@/constance'
import { WeightContract } from '@/constance'
//提示
import toast from 'react-hot-toast';
import { addressConvert, addressRecover } from '@/utils/utils';
import { ethers } from 'ethers';
//状态管理
import { createContainer, useContainer } from 'unstated-next';
import { ethereumAddressImage } from '@/utils/Avatar';

export type ownerType = {
  address: string,
  name?: string,
  weight?: number
  img?: string
}


export const useCreateAccount = () => {
  const { provider, account } = Web3Provider.useContainer();
  //第一步 多签钱包名称
  const [walletName, setWalletName] = useState<string>('');
  //第二步 签名种类 0是个数 1是权重
  const [signType, setSignType] = useState<number>(1);
  //第二部 拥有者地址  
  const [ownerArr, setOwnerArr] = useState<ownerType[]>([]);
  //门槛数量
  const [door, setDoor] = useState<number>(1);
  const [weight, setWeight] = useState<number>();
  //gas fee
  const [gasFee, setGasFee] = useState<any>();
  //实例化 多签工厂合约
  const FactoryContract = useMultiFactory();

  //添加用户
  const AddUser = () => {
    const temp: any = [...ownerArr, {}];
    setOwnerArr(temp);
  }

  //删除用户
  const DelUser = (index: number) => {
    console.log(index);
    const temp = [...ownerArr]
    temp.splice(index, 1);
    setOwnerArr(temp);
  }

  //修改对应数组的用户名称
  const HandleChangeOwnerName = (e: any, index: number) => {
    let temp: any[] = [...ownerArr];
    temp[index] = { ...temp[index], name: e.target.value };
    setOwnerArr(temp);
    console.log(temp);
  }

  const HandleChangeOwnerAddress = (e: any, index: number) => {
    let temp: any[] = [...ownerArr];
    let tempAddress = e.target.value;
    if (tempAddress.substring(0, 2).includes("fb")) {
      tempAddress = addressRecover(tempAddress);
      console.log(tempAddress);
    }
    temp[index] = { ...temp[index], address: tempAddress, img: ethereumAddressImage(tempAddress) };
    console.log(temp);
    setOwnerArr(temp);
  }


  const HandleChangeOwnerWeight = (e: any, index: number) => {
    let temp: any[] = [...ownerArr];
    temp[index] = { ...temp[index], weight: parseFloat(e.target.value) };
    setOwnerArr(temp);
  }

  //门限值选择框
  const HandleChangeSignType = (e: any) => {
    setSignType(parseInt(e.target.value))
  }




  //预测gasfee


  const ForecastGas = async () => {
    let addressArr = ownerArr.map((item: any) => item.address);
    let tempNonce = 0;
    console.log(ownerArr);
    for (let i = 0; i < ownerArr.length; i++) {
      const saltNonce = await provider?.getTransactionCount(ownerArr[i]?.address?.toLowerCase());
      tempNonce += saltNonce;
    }
    console.log(ownerArr);
    let weightArr = ownerArr.map((item) => item.weight);
    try {
      const gas: any = await FactoryContract?.estimateGas
        ?.['createMSigWeight'](...[
          WeightContract,
          addressArr,
          weightArr,
          weight,
          tempNonce
        ])
      console.log("gas值为：" + gas?.toNumber());
      let gasLimit = gas.toNumber();
      let gasPrice = 100 * 1e9;
      let fee = gasLimit * gasPrice;
      console.log(gasLimit * gasPrice);
      setGasFee(digitalPrecision(fee, 18, true));
    }
    catch (e) {
      console.log(e);
      // toast.error("gas费预估错误")

    }
  }


  //自动添加
  useEffect(() => {
    if (account) {
      let temp = [{ address: account, img: ethereumAddressImage(account) }];
      setOwnerArr(temp);

    }
  }, [account])




  //生成多签钱包
  // const GetMultiWallet = async()=>{
  //   const 
  // }


  return useMemo(() => {
    return {
      signType,
      ownerArr,
      walletName,
      door,
      weight,
      gasFee,
      setWeight,
      setDoor,
      setWalletName,
      HandleChangeSignType,
      AddUser,
      DelUser,
      HandleChangeOwnerName,
      HandleChangeOwnerAddress,
      HandleChangeOwnerWeight,
      ForecastGas
    }
  }, [walletName, signType, ownerArr, HandleChangeOwnerName])
}

// export default createContainer(useCreateAccount);