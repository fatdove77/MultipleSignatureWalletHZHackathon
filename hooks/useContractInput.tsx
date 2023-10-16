import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类
import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { type MethodArg, digitalPrecision, setObjBigNumber, CheckAddressCorrect } from '@/utils/utils';
//个人钱包方法
import Web3Provider from '@/store/Web3Provider';
//提示
import toast from 'react-hot-toast';
//状态管理
import TransferInfo from '@/store/TransferInfo';
import dayjs from 'dayjs';
import { GetSignature } from '@/utils/CommonSignature';
import { useDoorContract, uesWeightContract } from '@/hooks/useContract';
import config from '@/config';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';

export const useContractInput = () => {
  const [inputContract, setInputContract] = useState<string>();  //输入的合约地址
  const [showContract, setShowContract] = useState<string>();  //输入的合约地址
  const [inputAbi, setInputAbi] = useState<string>();  //输入的abi
  const [selectFunc, setSelectFunc] = useState<string[]>([]);  //合约的可写的函数方法
  const [funcName, setFuncName] = useState<string>()  //选择调用的方法名
  const [mintValue, setMintValue] = useState<number>(0);  //往地址里打的钱
  const [paramsArr, setParamsArr] = useState<any>([]);//存放对应的函数名和对应的参数类型
  const [inputParamsArr, setInputParamsArr] = useState<any>();   // 用户输入的参数组
  const [custom, setCustom] = useState(false);  //控制是否自定义数据
  const [inputPayload,setInputPayload] = useState<any>();
  const router = useRouter();
  //修改输入合约地址
  const HandleInputContract = (contract: string) => {
    setInputContract(contract);
    if (CheckAddressCorrect(contract)) {
      console.log("1");
      setShowContract(contract);
    }
  }

  //修改
  const HandleInputAbi = (abi: any) => {
    setInputAbi(abi);
    let abiArr: any;
    try {
      abiArr = JSON.parse(abi);
      console.log(abiArr);
      let temp_selectFunc: any = [];
      let temp_paramsArr: any = [];
      abiArr.map((item: any, index: number) => {
        if ((item.stateMutability === "nonpayable" && item.type === "function") || (item.stateMutability === "payable" && item.type === "function")) {
          temp_selectFunc.push(item.name);
          //存储type数组
          let parmTypeString = item.inputs.map((item: any) => item.internalType).join(",");
          temp_paramsArr.push({
            name: item.name,
            parmTypeString: parmTypeString
          })
          setParamsArr(temp_paramsArr);
        }
      })
      setSelectFunc(temp_selectFunc);
      console.log(temp_selectFunc);
      console.log(temp_paramsArr);
    } catch (error) {

    }
  }


  //传入合约金额
  const HandleMintValue = (value: string) => {
    setMintValue(parseFloat(value))
  }

  const HandleFuncName = (name: string) => {
    setFuncName(name);
    console.log(name);
    paramsArr
      .map((item: any) => {
        if (item?.name === name) {
          let l = item?.parmTypeString.split(",");
          console.log(l.length);
          let temp_inputParamsArr = Array.from(l).fill("");
          setInputParamsArr(temp_inputParamsArr);
          console.log(temp_inputParamsArr);
        }
      })
  }


  //用户输入的参数
  const HandleInputParams = (index: number, param: any) => {
    try {
      let temp = [...inputParamsArr];
      temp[index] = param;
      setInputParamsArr(temp);
      console.log(temp);
    } catch (error) {
    }

  }


  const Generate = ()=>{
    console.log(inputPayload);
    if(inputContract){
      router.push({
        pathname: "/Wallet/InitiateTrade/CallContractConfirm",
        query: {
          payload:inputPayload,
          callContract: inputContract,
          callContractFunc:"自定义数据方法",
          mintValue:mintValue
        },
      })
    }
    else {
      toast.error("请输入正确信息")
    }
  }

  const GeneratePayload = () => {
    if (inputAbi && inputContract && inputParamsArr && funcName) {
      console.log(paramsArr);  //所有可以调用的方法 
      //根据funcName选择出要调用的方法名称和参数种类  
      //inputParamsArr是参数
      let paramsNameArr: any = [];  //参数类型数组
      let paramsContentArr;  //参数内容数组
      let INDEX: number = 0; //  paramsArr对应下标  可以拿到参数的name
      paramsArr.map((item: any, index: number) => {
        if (item.name === funcName) {
          paramsNameArr = item?.parmTypeString.split(",");
          INDEX = index;
          return;
        }
      })
      paramsContentArr = inputParamsArr.map((item: any) => {
        try {
          if (CheckAddressCorrect(item)) {
            return item;
          }
          let temp = JSON.parse(item);
          if (Array.isArray(temp)) {
            return JSON.parse(item);
          }
          else {
            return item;
          }
        } catch (error) {

        }
      })
      const abiCoder = new ethers.utils.AbiCoder();
      let encodeData: string = "";
      try {
        encodeData = abiCoder?.encode([...paramsNameArr], [...paramsContentArr]);
      } catch (error) {
        toast.error("输入参数和格式不符")

      }
      console.log(encodeData);
      const encodedTransactionData = ethers.utils.id(paramsArr[INDEX].name + "(" + paramsArr[INDEX].parmTypeString + ")").slice(0, 10) + encodeData.slice(2)
      console.log("生成的payload📖📖📖", encodedTransactionData);
      router.push({
        pathname: "/Wallet/InitiateTrade/CallContractConfirm",
        query: {
          payload: custom?inputPayload:encodedTransactionData,
          callContract: inputContract,
          callContractFunc: paramsArr[INDEX]?.name??"自定义数据方法",
          mintValue:mintValue
        },
      })
    }
    else {
      toast.error("请输入正确信息")
    }
  }



  return {
    inputContract,
    showContract,
    inputAbi,
    selectFunc,
    mintValue,
    paramsArr,
    HandleInputContract,
    HandleInputAbi,
    funcName,
    custom,
    inputPayload,
    setInputPayload,
    setCustom,
    HandleFuncName,
    inputParamsArr,
    HandleMintValue,
    HandleInputParams,
    GeneratePayload,
    Generate
  }
}
