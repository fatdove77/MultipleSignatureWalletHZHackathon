import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类
import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { formatAddress } from '@/utils/utils';
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
export const useTradeHistory = () => {
  const [tradeHistoryList, setTradeHistoryList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
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
        //删选未完成得的
        temp_tradeList = res.data.filter((item: any) => item.Hash !== "");
        //把tradeList中的所有钱包信息和成员信息根据合约更新
        temp_tradeList.map((item: any, index: number) => {
          let transferInfo = JSON.parse(item?.Content ?? "{}");
          console.log("未更改的transInfo📖📖📖",transferInfo);
          
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
              }`);
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
            ]?.address ?? "")
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
          else if (item?.TransactionType === "调用合约") {
            let info =  `调用合约方法 ${JSON.parse(item?.Content ?? "{}")
            .callContractFunc
            }`;
            item.info = info;
          }
        })

      })

      console.log("添加是否完成字段的", temp_tradeList);
    } catch (error) {
      console.log(error);
      // toast.error("获取历史出错")
    }
    finally {
      setTradeHistoryList(temp_tradeList);
      setHistoryLoading(false);
    }
  }

  //读取已签名个数  //门限值读个数  权重值读权重
  const GetIsFinish = async (address: string, nonce: number, singleTrade: any) => {
    //先拿到签名地址数组
    let flag: boolean = false;
    let signNumber: number = 0;
    let Arr: any = signArr;
    try {
      await GetOwnerSignList(address, nonce).then((res: any) => {
        if (JSON.parse(singleTrade.Content)?.walletInfo?.data?.signType === 0) {
          signNumber = res.data.length;
          if (res.data >= JSON.parse(singleTrade.Content)?.walletInfo?.data?.door) {
            flag = true;
          }
        }
        else {
          //根据res.data=>ownerArr对应地址的weight之和
          let signWeight: number = 0;
          res.data.map((item: any) => {
            JSON.parse(singleTrade.Content)?.walletInfo?.data?.ownerArr.map((owner: any) => {
              if (item?.Address === owner?.address) {
                signWeight += owner?.weight
              }
            })
          })
          signNumber = signWeight;
          console.log("已签名权重:", signWeight);
          if (signWeight >= JSON.parse(singleTrade.Content)?.walletInfo?.data?.weight) {
            flag = true;
          }
        }
        Arr.push({ signNumber, flag })
      })
      setSignArr(Arr);
      console.log("标记数组", Arr);
    } catch (error) {
      console.log(error);

    }
  }


  useEffect(() => {
    if (walletInfo) {
      GetTradeList();
    }

  }, [walletInfo, historyLoading])

  return {
    tradeHistoryList,
    historyLoading,
    signArr,
  }

}