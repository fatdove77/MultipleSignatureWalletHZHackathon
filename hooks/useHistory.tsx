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
import dayjs from 'dayjs';

export const useHistory = () => {
  //实例化多签工厂合约
  const FactoryContract = useMultiFactory();
  const { provider, account } = Web3Provider.useContainer();
  const { Message } = useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  //对象数组 需要地址和时间 address and createTime
  const [walletHistory, setWalletHistory] = useState<any[]>([]);
  const GetWalletHistory = async () => {
    setLoading(true);
    let temp_walletHistory: any = [];
    try {
      await FactoryContract?.['getWalletPaginated'](...[
        account,
        account,
        10000
      ]).then((res: any) => {
        console.log(res.array);
        temp_walletHistory = res.array.map(async (item: any) => {
          const res = await FactoryContract?.['createTime'](...[item]);
          return {
            address: item,
            createTime: dayjs.unix(res.toString()).format('YYYY-MM-DD HH:mm:ss')
          }
        })
      })

    } catch (error) {
      console.log(error);
    }
    finally {
      let temp = await Promise.all(temp_walletHistory);
      setWalletHistory(temp);
      setLoading(false);
    }
  }

  useEffect(() => {
    GetWalletHistory()
  }, [provider, account])


  return useMemo(() => {
    return {
      walletHistory,
      loading
    }
  }, [walletHistory,loading])

}