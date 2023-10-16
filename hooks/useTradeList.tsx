import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类
import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { type MethodArg, digitalPrecision, setObjBigNumber, formatAddress } from '@/utils/utils';
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
  GetHistoryList
} from '@/request/api';
import config from '@/config';
import { ethers } from 'ethers';
import useWallet from './useWallet';
import { useRouter } from 'next/router';

export const useTradeList = () => {
  const [tradeList, setTradeList] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(true);
  const { walletInfo } = useWallet.useContainer();
  const [signArr, setSignArr] = useState<any[]>([]);
  const router = useRouter()

  const GetTradeList = async () => {
    let temp_address: string = '';
    let temp_nonce: number = 0;
    let temp_tradeList: any;
    try {
      await GetHistoryList(walletInfo?.address).then((res: any) => {
        console.log("历史队列", res.data);
        let apiData = JSON.parse(JSON.stringify(res.data));
        //删选未完成得的
        temp_tradeList = apiData.filter((item: any) => item.Hash == "");
        console.log("未完成数组🚘🚘🚘", temp_tradeList);
        //把tradeList中的所有钱包信息和成员信息根据合约更新
        temp_tradeList.map((item: any, index: number) => {
          let transferInfo = JSON.parse(item?.Content ?? "{}");
          //设置显示信息
          //替换成员
          if (item?.TransactionType === "替换成员") {
            let info = JSON.stringify(`替换${formatAddress(JSON.parse(item?.Content ?? "{}")
              .walletInfo?.data?.ownerArr[
              parseInt(
                (JSON.parse(item?.Content ?? "{}")
                  ?.switchIndex
                ) as string
              )
            ]?.address)
              }为${formatAddress(JSON.parse(item?.Content ?? "{}")?.switchAddress)}`);
            console.log(info);
            item.info = info;
          }
          //删除成员
          else if (item?.TransactionType === "踢除成员") {
            let info = `踢除 ${formatAddress(JSON.parse(item?.Content ?? "{}")
            .walletInfo?.data?.ownerArr[
            parseInt(
              (JSON.parse(item?.Content ?? "{}")
                ?.deleteIndex
              ) as string
            )
          ]?.address??"")
              }`;
            console.log(info);
            item.info = info;
          }
          //添加成员
          else if (item?.TransactionType === "添加成员") {
            console.log();

            let info = `添加 ${formatAddress(
              JSON.parse(item?.Content ?? "{}")
                .updateOwnerArr[0].address ?? ""
            )
              }`;
            console.log(info);
            item.info = info;
          }
          //修改权重
          else if (item?.TransactionType === "修改门限值") {
            let info = `修改门限值为 ${JSON.parse(item?.Content ?? "{}")
              .newDoor
              }`;
            console.log(info);
            item.info = info;
          }
          //修改门限
          else if (item?.TransactionType === "修改权重门限值") {
            let info = `修改门限值为 ${JSON.parse(item?.Content ?? "{}")
              .newWeight
              }`;
            console.log(info);
            item.info = info;
          }
          //拥有者权重
          else if (item?.TransactionType === "修改权重值") {
            let info = `修改权重拥有者权重`
            item.info = info;
          }
          //调用合约
          else if (item?.TransactionType === "调用合约") {
            let info =  `调用合约方法 ${JSON.parse(item?.Content ?? "{}")
            .callContractFunc
            }`;
            item.info = info;
          }
          // transferInfo.walletInfo = walletInfo;
          // temp_tradeList[index].Content = JSON.stringify(transferInfo);
        })
      })
      await GetIsFinish(temp_tradeList);
      console.log("添加是否完成字段的", temp_tradeList);
    } catch (error) {
      console.log(error);
      // toast.error("获取队列出错")
    }
    finally {
      setTradeList(temp_tradeList);
    }
  }

  //读取已签名个数  //门限值读个数  权重值读权重
  const GetIsFinish = async (temp_list:any) => {
    //先拿到签名地址数组
    let flag: boolean = false;
    let signNumber: number = 0;
    let Arr:any =[];
    console.log(temp_list);
    try {
      await Promise.all(temp_list.map(async(item:any,index:number)=>{
        await GetOwnerSignList(
          JSON.parse(item?.Content ?? "{}")?.walletInfo?.address,
          item?.Nonce
          ).then((res: any) => {
          if (JSON.parse(item.Content)?.walletInfo?.data?.signType === 0) {
            signNumber = res.data.length;
            console.log(JSON.parse(item.Content)?.walletInfo?.data?.door);
            if (res.data.length >= JSON.parse(item.Content)?.walletInfo?.data?.door) {
              flag = true;
            }
            else {
              flag = false;
            }
          }
          else {
            console.log("1111111111111111111");
            //根据res.data=>ownerArr对应地址的weight之和
            let signWeight: any = 0;
            res.data.map((item: any) => {
              console.log(item);
              walletInfo?.data?.ownerArr.map((owner: any) => {
                if (item?.Address === owner?.address) {
                  signWeight += owner?.weight
                }
              })
            })
            signNumber = signWeight;
            console.log("已签名权重:", signWeight);
            if (signWeight >= JSON.parse(item.Content)?.walletInfo?.data?.weight) {
              flag = true;
            }
            else {
              flag = false;
            }
          }
        })
        console.log({signNumber,flag});
        Arr.push({signNumber,flag});
        console.log(Arr);
        setSignArr(Arr)
      }))
    } catch (error) {
      console.log(error);
    }
    finally{
      setListLoading(false)
    }
  }


  const WithdrawTrade = async (index: number) => {
    //index是tradeList的下标
    let tradeInfo = JSON.parse(JSON.stringify(tradeList[index]));
    tradeInfo.walletInfo = walletInfo;
    router.push({
      pathname: "/Wallet/WithdrawConfirm",
      query: {
        tradeInfo: JSON.stringify(tradeInfo)
      }
    })
  }


  useEffect(() => {
    if (walletInfo) {
      GetTradeList();
    }

  }, [walletInfo,listLoading])

  return {
    listLoading,
    tradeList,
    signArr,
    WithdrawTrade
  }

}