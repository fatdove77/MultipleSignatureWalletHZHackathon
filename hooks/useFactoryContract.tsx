import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类

import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { type MethodArg, digitalPrecision, setObjBigNumber, formatAddress } from '@/utils/utils';
import { toCallState, type CallState, FormatGas } from '../utils/utils';
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
//状态管理
import { createContainer, useContainer } from 'unstated-next';
import { ethers } from 'ethers';
import { CreateWallet, AddMembers ,AddWeightMembers} from '@/request/api'
export const useFactoryContract = () => {
  let data: any;
  let isSuccess: boolean;
  let isFail: boolean;
  let preAddress: string;
  let walletName: string
  //读取缓存中的钱包基本信息
  if (typeof window !== 'undefined') {
    data = JSON.parse(localStorage.getItem("nowAccount") ?? '');
  }
  if (typeof window !== 'undefined') {
    isSuccess = localStorage.getItem("isSuccess") == 'true' ? true : false;
  }
  if (typeof window !== 'undefined') {
    isFail = localStorage.getItem("isFail") == 'true' ? true : false;
  }
  if (typeof window !== 'undefined') {
    preAddress = localStorage.getItem("preAddress") ?? '';
  }
  if (typeof window !== 'undefined') {
    walletName = localStorage.getItem("walletName") ?? '';
  }


  const [steps, setSteps] = useState([
    {
      label: '您的多签名称 : ',
      description: ``
    },
    {
      label: '您的多签账户预测地址',
      description: '',
    },
    {
      label: '进行中',
      description: ``,
    },
    {
      label: '多签钱包创建成功',
      description: ``,
    },
  ])
  const [process, setProcess] = useState<number>(25); //控制进度条 每次25
  const [stepNumber, setStepNumber] = useState<number>(1);  //控制步骤 [0,3]
  const [fail, setFail] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [saltNonce, setSaltNonce] = useState<number>();
  //实例化多签工厂合约
  const FactoryContract = useMultiFactory();
  const { provider } = Web3Provider.useContainer();
  const { Message } = useMessage();




  //拿到saltNonce
  const GetSaltNonce = async () => {
    let tempNonce = 0;
    console.log(data.ownerArr);
    for (let i = 0; i < data.ownerArr.length; i++) {
      const saltNonce = await provider?.getTransactionCount(data.ownerArr[i].address?.toLowerCase());
      tempNonce += saltNonce;
    }
    setSaltNonce(tempNonce);
    console.log("saltNonce:" + saltNonce);

  }

  //获取salt
  const GetSalt = () => {
    let addressArr = data.ownerArr.map((item: any) => item.address?.toLowerCase());
    let weightArr = data.ownerArr.map((item: any) => item.weight);
    let packedData: any;
    if (data.signType === 0) {
      packedData = ethers.utils.solidityPack(
        ['address[]', 'uint256', 'uint256'], [addressArr, data.door, saltNonce]
      )
    }
    else {
      packedData = ethers.utils.solidityPack(
        ['address[]', 'address[]', 'uint256'], [addressArr, weightArr, saltNonce]
      )
    }
    const salt = ethers.utils.keccak256(packedData);
    console.log(salt);
    return salt;
  }

  //预测多签地址
  const PredictMultiAddress = async () => {
    const salt = GetSalt();
    console.log("盐值:" + salt);
    try {
      await FactoryContract?.['predictAddress'](...[
        data.signType === 0 ? ThresholdContract : WeightContract,
        salt
      ]).then((res: any) => {
        console.log(res);
        let temp = steps;
        temp[1].description = res;
        console.log(temp);
        setSteps(temp)
        setProcess(50);
        setStepNumber(2);
        localStorage.setItem("preAddress", res);
      })

    } catch (error) {
      console.log(error);
    }
  }


  const RequestWallet = async (walletAddress: string, threshold: number, type: number, walletName: string) => {
    try {
      const res = await CreateWallet(walletAddress, threshold, type, walletName);
      console.log(res);
      if(data.signType===0){
        await data.ownerArr.map(async (item: any) => {
          await AddMembers(walletAddress,item.address,item.name);
        })
      }
      else {
        await data.ownerArr.map(async (item: any) => {
          await AddWeightMembers(walletAddress,item.address,item.name,item.weight);
        })
      }
    } catch (error) {
      toast.error("服务器出错")
      console.log("接口出错");
    }


  }

  //创建门限值多签  
  const CreateDoorWallet = async () => {
    let addressArr = data.ownerArr.map((item: any) => item.address);
    try {
      const gas = await FactoryContract?.estimateGas
        ?.['createMSigThreshold'](...[
          ThresholdContract,
          addressArr,
          data.door,
          saltNonce
        ])
      console.log("gas值为：" + gas?.toNumber());
      let gasLimit = gas?.toNumber();
      let gasPrice = 100 * 1e9;
      localStorage.setItem("isTrade", "true");
      const res = await FactoryContract
        ?.['createMSigThreshold'](...[
          ThresholdContract,
          addressArr,
          data.door,
          saltNonce
        ], { gasLimit, gasPrice })
      Message(
        provider,
        res?.hash,
        () => {
          setProcess(100);
          setStepNumber(4);
          setSuccess(true);
          localStorage.setItem("isSuccess", "true");

          //多签名称 多钱地址 具体信息数组（成员名称地址 种类 门槛/权重） 
          let walletAddress = window !== undefined ? localStorage.getItem("preAddress") : '';
          //存储多钱地址对应名称
          localStorage.setItem(walletAddress ?? '', walletName);
          //存储已经创建的地址
          let obj = {
            name: walletName,
            address: walletAddress,
            data: data
          }
          let tempArr: any = window !== undefined ? JSON.parse(localStorage.getItem("walletArr") ?? "[]") : [];
          tempArr.push(obj);
          localStorage.setItem("walletArr", JSON.stringify(tempArr));

          //后端接口 创建多签 添加成员
          RequestWallet(walletAddress ?? '', data.door, 1, walletName);


        },
        '获取多签地址成功'
      )

    } catch (error: any) {
      console.log(error.code);
      console.log(error);
      
      if (error.code === 'ACTION_REJECTED') {
        setFail(true);
        localStorage.setItem("isFail", "true");
        toast.error("取消创建多签")
      }
      else {
        toast.error("多签钱包创建失败")
        localStorage.setItem("isFail", "true");
        setFail(true);
      }
    }
  }


  //创建权重值多签
  const CreateWeightWallet = async () => {
    let addressArr = data.ownerArr.map((item: any) => item.address);
    let weightArr = data.ownerArr.map((item: any) => item.weight);
    try {
      const gas = await FactoryContract?.estimateGas
        ?.['createMSigWeight'](...[
          WeightContract,
          addressArr,
          weightArr,
          data.weight,
          saltNonce
        ])
      console.log("gas值为：" + gas?.toNumber());
      let gasLimit = gas?.toNumber();
      let gasPrice = 100 * 1e9;
      localStorage.setItem("isTrade", "true");
      const res = await FactoryContract
        ?.['createMSigWeight'](...[
          WeightContract,
          addressArr,
          weightArr,
          data.weight,
          saltNonce
        ], { gasLimit, gasPrice })
      Message(
        provider,
        res?.hash,
        () => {
          setProcess(100);
          setStepNumber(4);
          setSuccess(true);
          localStorage.setItem("isSuccess", "true");
          //多签名称 多钱地址 具体信息数组（成员名称地址 种类 门槛/权重） 
          let walletAddress = window !== undefined ? localStorage.getItem("preAddress") : '';
          //存储多钱地址对应名称
          localStorage.setItem(walletAddress ?? '', walletName);
          //存储已经创建的地址
          let obj = {
            name: walletName,
            address: walletAddress,
            data: data
          }
          let tempArr: any = window !== undefined ? JSON.parse(localStorage.getItem("walletArr") ?? "[]") : [];
          tempArr.push(obj);
          localStorage.setItem("walletArr", JSON.stringify(tempArr));

          //后端接口 创建多签 添加成员
          RequestWallet(walletAddress ?? '', data.weight, 2, walletName);
        },
        '获取多签地址成功'
      )

    } catch (error: any) {
      console.log(error.code);
      console.log(error);
      if (error.code === 'ACTION_REJECTED') {
        setFail(true);
        localStorage.setItem("isFail", "true");
        toast.error("取消创建多签")
      }
      else {
        toast.error("多签钱包创建失败")
        localStorage.setItem("isFail", "true");
        setFail(true);
      }
    }
  }


  //存储多签信息到后端  //创建多签  添加用户


  useEffect(() => {
    setSteps([
      {
        label: '您的多签名称 : ',
        description: walletName
      },
      {
        label: '您的多签账户预测地址',
        description: formatAddress(preAddress),
      },
      {
        label: '进行中',
        description: ``,
      },
      {
        label: '多签钱包创建成功',
        description: ``,
      },
    ])
    if (isSuccess) {
      setProcess(100);
      setStepNumber(4);
      setSuccess(true)
    }
    if (isFail) {
      setFail(true);
      setProcess(50);
      setStepNumber(2)
    }
  }, [])


  return useMemo(() => {
    return {
      steps,
      stepNumber,
      process,
      data,
      fail,
      success,
      saltNonce,
      GetSaltNonce,
      PredictMultiAddress,
      CreateDoorWallet,
      CreateWeightWallet,
      GetSalt

    }
  }, [stepNumber, process, FactoryContract, steps, saltNonce])

}
