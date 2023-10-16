import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类
import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { type MethodArg, digitalPrecision, setObjBigNumber } from '@/utils/utils';
//个人钱包方法
import Web3Provider from '@/store/Web3Provider';
//提示
import toast from 'react-hot-toast';
//状态管理
import TransferInfo from '@/store/TransferInfo';
import dayjs from 'dayjs';
import { GetSignature } from '@/utils/CommonSignature';
import { useDoorContract, uesWeightContract } from '@/hooks/useContract';
import {
  AddSignature,
  GetSignedAddress,
  GetOwnerSignList,
  PostFinished,
  GetHistoryList,
  DeleteOwner
} from '@/request/api';
import config from '@/config';
import { ethers } from 'ethers';
import { createContainer, useContainer } from 'unstated-next';
const useCommonProcess = () => {
  const { provider, account } = Web3Provider.useContainer();
  const { transferInfo } = TransferInfo.useContainer();
  console.log("信息✅✅✅✅✅:", transferInfo);
  const { Message } = useMessage();
  const DoorContract = useDoorContract(transferInfo?.walletInfo.address);
  const WeightContract = uesWeightContract(transferInfo?.walletInfo.address);
  const [diffTime, setDiffTime] = useState<string>();
  const [flag, setFlag] = useState<boolean>(true);
  const [steps, setSteps] = useState<any>([
    {
      label: flag ? '创建' : '在链上创建被拒绝'
    },
    {
      label: '确认',
      description: '(1 out of 2)',
    },
    {
      label: '执行',
      description: ``,
      type: "execute"
    },
  ])
  const initSteps = [
    {
      label: flag ? '创建' : '在链上创建被拒绝'
    },
    {
      label: '确认',
      description: '(1 out of 2)',
    },
    {
      label: '执行',
      description: ``,
      type: "execute"
    },
  ];  //用于初始化 每次更新 先从这里取值 进行插入操作之后再赋值给step

  const [activeNumber, setActiveNumber] = useState<number>(2);//控制步骤
  const [isOwner, setIsOwner] = useState<boolean>(false);  //当前用户是否是多签内用户
  const [isSign, setIsSign] = useState<boolean>(false);//当前用户是否签名
  const [signedArr, setSignedArr] = useState<any>([]); //已经签名的数组
  const [isExecute, setIsExecute] = useState<boolean>(false);  //是否可以执行
  const [isSignAndExecute, setIsSignAndExecute] = useState<boolean>(false);  //可以签名并执行
  const [executeLoading, setExecuteLoading] = useState<boolean>(false);
  const [isEqual, setIsEqual] = useState<number>(0); //当前nonce和后端nonce
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [listLoading,setListLoading] = useState<boolean>(true);


  //更新过程队列 把数组插入进去
  const MakeProcess = async () => {
    let signedList: any = [];
    let unSignedList: any = [];
    try {
      await GetSignedAddress(transferInfo?.walletInfo.address, transferInfo?.nonce)
        .then(async (res: any) => {
          console.log(res.data);
          //更新steps
          let flag = await CheckIsFinish();
          if (flag) {
            let finishStep = transferInfo?.walletInfo?.data?.ownerArr.map((item: any, index: number) => ({
              label: item.name ?? `用户${index}`,
              description: item?.address,
              img: item?.img,
              type: "account",
              weight: item?.weight ?? undefined
            }))
            console.log("已完成数组", finishStep);
            let temp_steps = initSteps;
            if (transferInfo?.walletInfo.data.signType === 0) {
              temp_steps[1].description = `(${transferInfo?.walletInfo?.data?.door} out of ${transferInfo?.walletInfo?.data?.ownerArr.length})`
            }
            else {
              temp_steps[1].description = `(权重 ≥ ${transferInfo?.walletInfo?.data?.weight}执行)`
            }
            temp_steps.splice(2, 0, ...finishStep);
            let deMultiTempSteps = Array.from(new Set(temp_steps.map(item => item.label))).map((label) => {
              return temp_steps.find(item => item.label === label)
            })
            console.log(temp_steps, deMultiTempSteps);
            setSteps(deMultiTempSteps);
          }
          else {
            //1.签名数组
            signedList = transferInfo?.walletInfo.data.ownerArr.filter((obj: any) => (res.data?.signed_addresses)?.includes(obj.address));
            setSignedArr(signedList)
            //2.未签名数组
            unSignedList = transferInfo?.walletInfo.data.ownerArr.filter((obj: any) => (res.data.unsigned_addresses)?.includes(obj.address));
            //3.修改数组数据结构
            signedList = signedList.map((item: any, index: number) => ({
              label: item.name ?? `用户${index}`,
              description: item?.address,
              img: item?.img,
              type: "account",
              weight: item?.weight ?? undefined
            }))
            unSignedList = unSignedList.map((item: any, index: number) => ({
              label: item.name ?? `用户${index}`,
              description: item?.address,
              img: item?.img,
              type: "account",
              weight: item?.weight ?? undefined

            }))
            console.log("签名地址数组", signedList, "未签名地址数组", unSignedList);
            //4.插入  如果完成了 插入老walletInfo 如果没完成 那么调用接口
            let temp_steps = initSteps;
            if (transferInfo?.walletInfo.data.signType === 0) {
              temp_steps[1].description = `(${transferInfo?.walletInfo?.data?.door} out of ${transferInfo?.walletInfo?.data?.ownerArr.length})`
            }
            else {
              temp_steps[1].description = `(权重 ≥ ${transferInfo?.walletInfo?.data?.weight}执行)`
            }
            temp_steps.splice(2, 0, ...signedList, ...unSignedList);
            let deMultiTempSteps = Array.from(new Set(temp_steps.map(item => item.label))).map((label) => {
              return temp_steps.find(item => item.label === label)
            })
            console.log(temp_steps, deMultiTempSteps);
            setSteps(deMultiTempSteps);

          }

        })
      return { signedList, unSignedList }
    } catch (error) {
      console.log(error);
      console.log("调用历史队列接口出错");
    }
  }

  //查看当前nonce是否成功 如果成功就直接把stepNumber拉满
  const CheckIsFinish = async () => {
    let flag: boolean = false;//判断是否完成
    try {
      await GetHistoryList(transferInfo?.walletInfo?.address).then((res: any) => {
        console.log(res.data[transferInfo?.nonce].Hash);
        if (res.data[transferInfo?.nonce].Hash != '') {
          flag = true;
        }
      })
    } catch (error) {
      console.log("获取事务列表出错");
      console.log(error);
    }
    return flag;
  }
  //更新交易队列
  const UpdateSignProcess = async () => {
    let list: any;
    let signedList: any = [];
    let unSignedList: any = [];
    let flag: boolean = false;  //是否已执行
    console.log(isEqual);
    // 获取签名成功和未签名的数组
    console.log(transferInfo?.walletInfo.address, transferInfo?.nonce);
    list = await MakeProcess();
    console.log("返回数组:", list);
    signedList = list.signedList;
    unSignedList = list.unSignedList;
    console.log("已签名数组", signedList, unSignedList);
    flag = await CheckIsFinish();
    console.log("是否执行", flag);
    setIsFinish(flag);
    // //5.设置stepnumber
    if (flag === true) {
      setActiveNumber(transferInfo?.walletInfo?.data?.ownerArr.length+3);

    }
    else {
      setActiveNumber(2 + signedList?.length)
      //检验用户是否签名
      console.log(account, signedList);
      if (signedList.some((obj: any) => obj.description === account)) {
        setIsSign(true);
        console.log("已签名");
      }
      else {
        setIsSign(false);
        console.log("未签名");
      }
      //检验是否可以执行
      console.log(isEqual);
      if (transferInfo?.walletInfo.data.signType === 0) {
        if (signedList.length >= transferInfo?.walletInfo.data.door) {
          setIsExecute(true);
        }
        //没签名并且现在就差一个人 并且nonce值相等
        else if (transferInfo?.walletInfo.data.door - signedList.length === 1 && isSign == false) {
          setIsSignAndExecute(true);
        }
        else {
          setIsExecute(false);
          setIsSignAndExecute(false);
        }
      }
      else {
        let weight: number = 0; //已经签名的用户累计的权重
        //当前用户权重
        let nowAccountWeight: number = 0;
        transferInfo?.walletInfo.data.ownerArr.map((item: any) => {
          if (item.address === account) {
            nowAccountWeight = item?.weight
          }
        })
        console.log("当前用户的权重", nowAccountWeight);
        signedList.map((item: any) => { weight += item.weight });
        console.log("已签名用户权重", weight);
        if (weight >= transferInfo?.walletInfo?.data?.weight) {
          setIsExecute(true);
        }
        else if (transferInfo?.walletInfo.data.weight - weight <= nowAccountWeight && isSign === false) {
          setIsSignAndExecute(true);
        }
        else {
          setIsExecute(false);
          setIsSignAndExecute(false)
        }
      }
    }
    setListLoading(false);

  }



  return {
    
  }
}


export default createContainer(useCommonProcess)



