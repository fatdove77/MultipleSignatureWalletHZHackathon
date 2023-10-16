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
// import { logicContractAddress } from '@/constance'
//提示
import toast from 'react-hot-toast';

//生成多签
export const useTest = () => {
  const { account, provider } = Web3Provider.useContainer();
  const address_1 = '0x666666D834C881ECCcda9fB5441327AaC81A8E5b';
  const address_2 = '0x7777779A61DDAd61f89EF4b3a0AbF152f6083974';
  const address_3 = '0x88888893C7e180D51B2557F76Eba35cff528b79C';
  const name = 'myMultiSig1';
  const _quorum = 2;
  const [saltNonce, setSaltNonce] = useState<number>(106);
  const [mulWalletLoading, setMulWalletLoading] = useState(false);
  const { Message } = useMessage();
  //实例化多签工厂合约
  const MultiFactoryAddress = useMultiFactory();
  console.log(account);
  const getMultiAddress = async () => {
    try {
      setMulWalletLoading(true);
      const saltNonce_1 = await provider.getTransactionCount('0x666666D834C881ECCcda9fB5441327AaC81A8E5b');
      const saltNonce_2 = await provider.getTransactionCount('0x7777779A61DDAd61f89EF4b3a0AbF152f6083974');
      const saltNonce_3 = await provider.getTransactionCount('0x88888893C7e180D51B2557F76Eba35cff528b79C');
      console.log(saltNonce_1 + saltNonce_2 + saltNonce_3);
      const res = await MultiFactoryAddress?.['createInstanceWithNonce'](...['0x9aA63Ae89De07Ec32E8676bCAD7F656C64f1Ae52',
        name,
        [address_1, address_2, address_3],
        2,
        106])
      console.log(res);

      Message(
        provider,
        res?.hash,
        () => {
          setMulWalletLoading(false);
          localStorage.setItem('mulWalletAddress', res);
        },
        '获取多签地址成功'
      )
    } catch (error) {
      console.log(error);
      toast.error("操作中断")
    }
  }
  useEffect(() => {
    // getMultiAddress()
  }, [provider])


  return useMemo(() => {
    return {
      saltNonce,
      getMultiAddress,
      // ...toCallState()
    }
  }, [MultiFactoryAddress, saltNonce])

}