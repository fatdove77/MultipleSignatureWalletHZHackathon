import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类

import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { type MethodArg, digitalPrecision, setObjBigNumber } from '@/utils/utils';
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
import { CreateWallet, AddMembers, AddWeightMembers } from '@/request/api'
//ABI
import MultiSignatureThreshold_ABI from '@/constance/abi/MultiSignatureThreshold.json'
import MultiSignatureWeight_ABI from '@/constance/abi/MultiSignatureWeight.json'
//提示
import toast from 'react-hot-toast';
import { addressConvert, addressRecover } from '@/utils/utils';
//状态管理
import { createContainer, useContainer } from 'unstated-next';
import { ethers } from 'ethers';
import { type ownerType } from './useCreateAccount';
import { ethereumAddressImage } from '@/utils/Avatar'
import { useMainNetBalances } from './useToken';
import { getContract } from '@/hooks';
import axios from 'axios';
export type walletArrType = {
  name: string,
  address: string,
  balance: number,
  member: ownerType[]
}




//完成 获取当下地址的多签列表 创建安全账户
export const useHome = () => {
  const { provider, account } = Web3Provider.useContainer();
  const { Message } = useMessage();
  //实例化多签工厂合约
  const FactoryContract = useMultiFactory();
  //实例化门限值合约 需要拿到多签地址 多钱地址需要合约工厂传入用户地址获取
  // const DoorContract = 

  //控制列表加载
  const [loading, setLoading] = useState<boolean>(false);
  //该用户全部钱包数据
  const [walletArr, setWalletArr] = useState<any>([]);
  const [current, setCurrent] = useState<number>(0); //控制页面
  const [newWalletName, setNewWalletName] = useState<string>();
  const [newWalletAddress, setNewWalletAddress] = useState<string>(); //添加的多钱地址
  const [newSignType, setNewSignType] = useState<number>();  //添加成员种类
  const [newDoor, setNewDoor] = useState<number>();  //钱包门槛
  const [newWeight, setNewWeight] = useState<number>();  //钱包权重
  const [newMemberAddress, setNewMemberAddress] = useState<string[]>([]);  //成员地址
  const [newMemberWeight, setNewMemberWeight] = useState<number[]>([])  //成员的权重
  const [isImport, setIsImport] = useState<boolean>(false);

  const GetOwnerWalletArr = async () => {
    let localWalletArr = window !== undefined ? JSON.parse(localStorage.getItem("walletArr") ?? "[]") : [];
    console.log(localWalletArr);
    if (localWalletArr.length !== walletArr.length) {
      setLoading(true);
      let balance: any;
      //更新
      //这里要data中更新权重   门限值  拿到用户地址 更新用户的权重 
      console.log(localWalletArr);
      //添加余额和头像
      try {
        const temp = localWalletArr.map(async (item: any, index: number) => {
          try {
            await provider.getBalance(item?.address).then((res: any) => {
              balance = digitalPrecision(res?.toString(), 18, true);
              console.log(item.address, balance);
            })
          } catch (error) {

          }
          //添加余额 //添加头像
          return {
            ...item,
            balance: balance,
            img: ethereumAddressImage(item?.address)
          }
        })
        console.log(temp);
        const resolvedValues = await Promise.all(temp);
        console.log(resolvedValues);
        //修改内容存入缓存
        localStorage.setItem("walletArr", JSON.stringify(resolvedValues));
        setWalletArr(resolvedValues);
        setLoading(false);

      } catch (error) {

      }

    }

  }

  //名称输入框
  const HandleWalletName = (name: string) => {
    setNewWalletName(name)
  }
  //地址输入框
  const HandleWalletAddress = (address: string) => {
    let tempAddress = address;
    if (tempAddress.substring(0, 2).includes("fb")) {
      tempAddress = addressRecover(tempAddress);
    }
    setNewWalletAddress(tempAddress);
  }


  //读取门槛值
  const GetDoorNumber = async (contract: any) => {
    try {
      const res = await contract.threshold();
      console.log("门槛", res.toNumber());
      setNewDoor(res.toNumber());

    } catch (error) {
      console.log(error);
      console.log("门限值获取错误");
    }
  }
  //读取权重类型
  const GetWeightNumber = async (contract: any) => {
    try {
      const res = await contract.weightThreshold();
      console.log(res.toNumber());
      setNewWeight(res.toNumber());

    } catch (error) {
      console.log(error);
      console.log("门限值获取错误");
    }

  }

  //拿到成员地址数组
  const GetMemberAddress = async (contract: any) => {
    try {
      const res = await contract.getOwners();
      console.log("成员地址:", res);
      setNewMemberAddress(res);

    } catch (error) {
      console.log(error);
      console.log("门限值获取错误");
    }
  }


  //拿到用户权重
  // const GetMemberWeight = async(contract:any)=>{
  //   try {
  //     const res = await contract.getOwners();
  //     console.log("成员地址:", res);
  //     setNewMemberAddress(res);

  //   } catch (error) {
  //     console.log(error);
  //     console.log("门限值获取错误");
  //   }
  // }




  const GetOwnerWalletArr1 = async () => {
    let temp: any = [];
    setLoading(true);
    try {
      await FactoryContract?.['getWalletPaginated'](...[
        account,
        account,
        10000
      ]).then((res: any) => {
        console.log(res.array);
      })
    } catch (error) {
      console.log(error);
    }
  }


  //判断多签类型函数
  const TellWalletSignType = async () => {
    let DoorContract: any;
    let WeightContract: any;
    let flag = false;
    //查看地址是否已经添加
    if (walletArr.some((item: any) => {
      return item.address === newWalletAddress
    })) {
      toast.error("该地址已添加");
      return;
    }
    //实例化钱包合约
    try {
      console.log(provider, account);
      DoorContract = getContract(newWalletAddress ?? '', MultiSignatureThreshold_ABI, provider, account)
      WeightContract = getContract(newWalletAddress ?? '', MultiSignatureWeight_ABI, provider, account);
    } catch (error) {
      console.log(error);
    }
    //查看是否是门限钱包
    try {
      console.log(newWalletAddress);
      console.log(DoorContract, WeightContract);
      const res = await DoorContract.ADD_OWNER_HASH();
      console.log("ssssssssssssssssssss");
      if (res === '0xcbfa87bf4ea5fb99f2e1122e4ba912396befd7f9b9efde1e42c629d0fa219ad0') {
        setNewSignType(0);
        //读取门限值
        GetDoorNumber(DoorContract);
        //读取用户地址
        GetMemberAddress(DoorContract);
        flag = true
      }
      else {
        try {
          const res = await WeightContract.ADD_OWNER_HASH();
          if (res === '0x9e93e99987f5988cec4a4b335b20b997a0ca08229db72db26b0d10e2169f2c0a') {
            setNewSignType(1);
            //读取门槛值
            GetWeightNumber(WeightContract);
            //读取用户地址
            GetMemberAddress(WeightContract);
            //用户权重
            console.log("ssssssssssssssssssss");
            flag = true
          }
        } catch (error) {
          console.log(error);
        }

      }
    } catch (error) {
      console.log(error);
    }
    //查看是否是权重钱包

    finally {
      if (!flag) {
        toast.error("该地址不是多签地址")
      }
    }
  }


  const AddWalletArr = async () => {
    if (newSignType !== undefined) {
      console.log("添加数组");
      console.log(newDoor, newMemberAddress);

      //存到缓存
      console.log("钱包种类：" + newSignType);
      //计算余额
      let balance;
      await provider.getBalance(newWalletAddress).then((res: any) => {
        console.log(res.toString());
        balance = digitalPrecision(res.toString(), 18, true)
      });

      let temp_walletArr: any;   //钱包数据类型
      //成员数据类型  //门槛
      if (newSignType === 0) {
        let temp_ownerArr = newMemberAddress.map((item: any, index: number) => {
          return {
            name: `name${index + 1}`,
            address: item,
            img: ethereumAddressImage(item)
          }
        })
        temp_walletArr = {
          address: newWalletAddress,
          name: newWalletName,
          balance: balance,
          img: ethereumAddressImage(newWalletAddress),
          data: {
            signType: newSignType,
            door: newDoor,
            ownerArr: temp_ownerArr,
          }
        }
      }
      //成员数据类型  //权重
      else {
        try {
          //钱包用户数据类型
          let WeightContract = getContract(newWalletAddress ?? '', MultiSignatureWeight_ABI, provider, account);
          let member_weight: any;//单独地址
          //用户权重数组
          console.log(newMemberAddress);
          let member_weightArr = newMemberAddress.map(async (item) => {
            await WeightContract['getWeight'](...[item]).then((res: any) => {
              console.log(res.toString());
              member_weight = res.toNumber()
            })
            return member_weight;
          })
          //转化成数组
          const weightArr: any = await Promise.all(member_weightArr);
          console.log("成员权重数组", weightArr);
          let temp_ownerArr: any = newMemberAddress.map(async (item: any, index: number) => {
            return {
              name: `name${index + 1}`,
              address: item,
              weight: weightArr[index],
              img: ethereumAddressImage(item)
            }
          })
          temp_ownerArr = await Promise.all(temp_ownerArr);
          temp_walletArr = {
            address: newWalletAddress,
            name: newWalletName,
            balance: balance,
            img: ethereumAddressImage(newWalletAddress),
            data: {
              signType: newSignType,
              weight: newWeight,
              ownerArr: temp_ownerArr
            }
          }
        } catch (error) {
        }
      }
      let tempArr = walletArr; //当前已有多签数组
      tempArr.push(temp_walletArr);
      console.log(tempArr);
      console.log("添加的多签信息", temp_walletArr);
      setWalletArr(tempArr);  //添加到当前数组
      // RequestWallet(temp_walletArr);
      //更新当前缓存
      localStorage.setItem("walletArr", JSON.stringify(tempArr));
      setIsImport(false);
    }
  }



  const RequestWallet = async (addWalletInfo: any) => {
    try {
      const res = await CreateWallet(addWalletInfo?.address, addWalletInfo?.data.signType === 0 ? addWalletInfo?.data.door : addWalletInfo?.data.weight, addWalletInfo?.data.signType === 0 ? 1 : 2, addWalletInfo?.name);
      console.log(res);
      if (addWalletInfo?.data.signType === 0) {
        await addWalletInfo?.data.ownerArr.map(async (item: any) => {
          await AddMembers(addWalletInfo?.address, item.address, item.name);
        })
      }
      else {
        await addWalletInfo?.data.ownerArr.map(async (item: any) => {
          await AddWeightMembers(addWalletInfo?.address, item.address, item.name, item.weight);
        })
      }
    } catch (error) {
      console.log("接口出错");
    }


  }



  useEffect(() => {
    if (provider) {
      GetOwnerWalletArr();
    }
  }, [provider])

  // useEffect(()=>{
  //   console.log(GetOwnerWalletArr1());
  // },[FactoryContract])

  useEffect(() => {
    if (newSignType === 0) {
      if (newDoor && newMemberAddress.length !== 0) {
        AddWalletArr();
      }
    }
    else if (newSignType === 1) {
      console.log("ssssssssssssssssssss");
      console.log(newWeight, newMemberAddress.length);
      if (newWeight && newMemberAddress.length !== 0) {
        console.log(newWeight);
        AddWalletArr();
      }
    }
  }, [newSignType, newDoor, newWeight, newMemberAddress, newWalletAddress])


  return useMemo(() => {
    return {
      walletArr,
      loading,
      current,
      isImport,
      setIsImport,
      setCurrent,
      newWalletName,
      newWalletAddress,
      newSignType,
      TellWalletSignType,
      HandleWalletName,
      HandleWalletAddress,
      AddWalletArr
    }
  }, [walletArr, loading, current, newWalletName, newWalletAddress, newSignType, isImport])

}