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
import { useRouter } from 'next/router';

type wallerType = {
  address: string,
  name: string,
  img: string,
  balance: number,
  data: []
}

const useWallet = () => {
  const INDEX = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("INDEX") ?? "{}") : '';
  const [walletInfo, setWalletInfo] = useState<any>();
  const [walletInfoLoading, setWalletInfoLoading] = useState<boolean>(true);
  const { provider, account } = Web3Provider.useContainer();
  useEffect(() => {
    if (provider) {
      UpdateBalance();
    }
  }, [INDEX, provider, account])

  //如果主页不刷新 其实钱包余额不会更新 所以这里手动写一个
  const UpdateBalance = async () => {
    const INDEX = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("INDEX") ?? "{}") : '';
    let temp: any = JSON.parse(localStorage.getItem("walletArr") ?? "[]");
    //当前钱包对象
    let temp_info = temp[INDEX];
    //调用合约更新链上数据
    // console.log(temp_info);
    if (temp_info) {
      temp_info = await UpdateData(temp_info);
    }

    console.log(temp_info);
    //更新余额
    try {
      const res = await provider.getBalance(temp_info?.address);
      temp_info.balance = digitalPrecision(res.toString(), 18, true);
      // console.log("更新之前的🌹🌹🌹:", temp_info);
      setWalletInfo(temp_info);
      temp[INDEX] = temp_info;
      console.log(temp);
      localStorage.setItem("walletArr", JSON.stringify(temp));
    } catch (error) {
    }
  }



  const UpdateData = async (walletInfo: any) => {
    // console.log(walletInfo);
    // 门限钱包
    if (walletInfo?.data?.signType === 0) {
      let DoorContract = getContract(walletInfo?.address, MultiSignatureThreshold_ABI, provider, account)
      console.log(DoorContract);
      //更新门限值
      try {
        const door = await DoorContract?.threshold();
        console.log("✅✅✅✅✅门限值", door.toNumber());
        walletInfo.data.door = door.toNumber();
        //拿到成员数组进行更新 
        const ownerAddressArr = await DoorContract?.getOwners();
        console.log("✅✅✅✅✅成员地址数组", ownerAddressArr);
        //替换 //如果是替换 找到相同的原ownerArr  找到不同的打包 添加进ownerArr
        if (walletInfo?.data?.ownerArr?.length === ownerAddressArr.length) {
          let temp_ownerArr = walletInfo?.data?.ownerArr?.map((item: any) => item.address);
          let oldAddress: any = temp_ownerArr.filter((item: any) => !ownerAddressArr.includes(item));
          let newAddress: any = ownerAddressArr.filter((item: any) => !temp_ownerArr.includes(item));
          // console.log("老地址", oldAddress);
          // console.log("新地址", newAddress);
          newAddress.map((newOne: any, i: number) => {
            walletInfo?.data?.ownerArr.map((item: any, index: number) => {
              if (item.address === oldAddress[i]) {
                walletInfo.data.ownerArr[index] = {
                  address: newOne,
                  name: "default",
                  img: ethereumAddressImage(newOne)
                }
              }
            })
          })
        }
        //删除 //如果是删除 那就要删除原数组
        else if (walletInfo?.data?.ownerArr?.length > ownerAddressArr.length) {
          walletInfo.data.ownerArr = walletInfo.data.ownerArr.filter((obj: any) => ownerAddressArr.includes(obj?.address));
        }
        //新增
        else {
          let temp_ownerArr = walletInfo?.data?.ownerArr?.map((item: any) => item.address);
          console.log(temp_ownerArr);
          let newAddress = ownerAddressArr.filter((item: any) => !temp_ownerArr.includes(item));
          console.log("📝📝📝📝", newAddress);
          newAddress?.map((item: any, index: number) => {
            const newOwner = {
              address: item,
              name: "default",
              img: ethereumAddressImage(item),
            }
            walletInfo?.data?.ownerArr?.push(newOwner);
          })

        }

      } catch (error) {
        console.log(error);
      }
    }
    //权重钱包
    else {
      let WeightContract = getContract(walletInfo?.address, MultiSignatureWeight_ABI, provider, account);
      try {
        const weight = await WeightContract?.weightThreshold();
        console.log("✅✅✅✅✅门限值", weight.toNumber());
        walletInfo.data.weight = weight.toNumber();
        //拿到成员数组进行更新 
        const ownerAddressArr = await WeightContract?.getOwners();
        console.log("✅✅✅✅✅成员地址数组", ownerAddressArr);
        // const ownerAddressArr = ['0x02387fb060DdDAefbEDe3b4e32B4018FE20c8430', '0x03Eb0c03FA09A748958E5B5eFAfBeFf94Edc89b9']
        //替换 //如果是替换 找到相同的原ownerArr  找到不同的打包 添加进ownerArr
        if (walletInfo?.data?.ownerArr?.length === ownerAddressArr.length) {
          let temp_ownerArr = walletInfo?.data?.ownerArr?.map((item: any) => item.address);
          let oldAddress: any = temp_ownerArr.filter((item: any) => !ownerAddressArr.includes(item));
          let newAddress: any = ownerAddressArr.filter((item: any) => !temp_ownerArr.includes(item));
          console.log("老地址", oldAddress);
          console.log("新地址", newAddress);
          let newWeights: any = [];
          for (let i = 0; i < newAddress.length; i++) {
            newWeights[i] = await WeightContract?.getWeight(newAddress[i]);
          }
          newAddress.map((newOne: any, i: number) => {
            walletInfo?.data?.ownerArr.map((item: any, index: number) => {
              if (item.address === oldAddress[i]) {
                walletInfo.data.ownerArr[index] = {
                  address: newOne,
                  name: "default",
                  img: ethereumAddressImage(newAddress[0]),
                  weight: newWeights[i].toNumber()
                }
              }
            })

          })


        }
        //删除 //如果是删除 那就要删除原数组
        else if (walletInfo?.data?.ownerArr?.length > ownerAddressArr.length) {
          console.log("删除");
          walletInfo.data.ownerArr = walletInfo.data.ownerArr.filter((obj: any) => ownerAddressArr.includes(obj?.address));
          let uniqueObjectArray = walletInfo.data.ownerArr.filter((obj: any, index: number, self: any) =>
            index === self.findIndex((o: any) => (
              o?.address === obj?.address
            ))
          );
          walletInfo.data.ownerArr = uniqueObjectArray;
        }
        //新增
        else {
          let temp_ownerArr = walletInfo?.data?.ownerArr?.map((item: any) => item.address);
          console.log(temp_ownerArr);
          let newAddress = ownerAddressArr.filter((item: any) => !temp_ownerArr.includes(item));
          console.log("📝📝📝📝", newAddress);
          //拿到新增的成员权重数组
          let newWeights: any = [];
          for (let i = 0; i < newAddress.length; i++) {
            newWeights[i] = await WeightContract?.getWeight(newAddress[i]);
          }
          newAddress?.map((item: any, index: number) => {
            const newOwner = {
              address: item,
              name: "default",
              img: ethereumAddressImage(item),
              weight: newWeights[index].toNumber()
            }
            walletInfo?.data?.ownerArr?.push(newOwner);
          })
        }
        // 更新用户权重
        let addressArr = walletInfo?.data?.ownerArr?.map((item: any) => item.address);
        let newWeights: any = [];

        for (let i = 0; i < ownerAddressArr.length; i++) {
          newWeights[i] = await WeightContract?.getWeight(ownerAddressArr[i]);
        }
        console.log("成员权重数组⭐⭐⭐", newWeights);
        newWeights.map((item: any, index: number) => {
          walletInfo.data.ownerArr[index].weight = item.toNumber();
        })

      } catch (error) {
        console.log(error);
      }
    }

    return walletInfo
  }



  //更新成员的名称
  const ChangeOwnerName = (walletAddress: string, address: string, name: string) => {
    let temp: any = JSON.parse(localStorage.getItem("walletArr") ?? "[]");
    temp.map((item: any) => {
      if (item.address === walletAddress) {
        item.data?.ownerArr.map((owner: any, index: number) => {
          if (owner?.address === address) {
            owner.name = name;
          }
        })
        setWalletInfo(item)
      }
    })
    console.log(temp);
    localStorage.setItem("walletArr", JSON.stringify(temp));
  }

  useEffect(() => {
    if (walletInfo) {
      setWalletInfoLoading(false);
    }
  }, [walletInfo])

  return {
    walletInfo,
    walletInfoLoading,
    ChangeOwnerName,
    UpdateBalance,
    setWalletInfoLoading
  }
}

export default createContainer(useWallet)