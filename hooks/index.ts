//用于存放合约调用相关方法
import { type Contract, ethers } from 'ethers';  //导入合约type
import { useMemo, useEffect, useState } from 'react';
//钱包基本信息
import Web3Provider, { type useWeb3Type } from '@/store/Web3Provider';
//定义的type
import { toCallState, type MethodArg } from '../utils/utils';
//工具类
import { formatHash, getEtherscanLink, isAddress } from '../utils/utils';
import toast from 'react-hot-toast';
import { message, notification } from 'antd';
import { JsonRpcProvider } from '@ethersproject/providers';

//create contract instance  
export function getContract(
  address: string, //contract address 
  ABI: any,
  library: any,  //provider 
  account?: string,  //alternative account for choosing write and read-only
): Contract {
  const AddressZero: string = '0x0000000000000000000000000000000000000000';
  //检验合约地址
  if (!isAddress(address, true) || address === AddressZero) {
    toast.error(`Invalid 'address' parameter '${address}'.`);
  }

  return new ethers.Contract(
    address,
    ABI,
    getProviderOrSigner(library, account),  //如果有acount那么生成signer代表可以write的合约//否则readonly合约
  );
}

// Provider/Signer  如果传入account那么生成signer 否则返回provider
export function getProviderOrSigner(library: any, account?: string): any {
  return account ? getSigner(library, account) : library;
}

// getUncheckedSigner。  由provide+account生成signer
export function getSigner(library: any, account: string): any {
  return library.getSigner(account).connectUnchecked();
}







// single call result   //调用合约方法 需要传入 
export function useSingleCallResult(
  contract: Contract | null | undefined,  //合约实例
  methodName: string,   //合约方法
  inputs?: MethodArg[],  //参数  //代表数据类型为MethoodArg的数组
): any {
  const { account } = Web3Provider.useContainer();
  const [data, setData] = useState<MethodArg | undefined>(undefined);
  //检查合约是否有输入的函数方法 checking wether the contract has inputted method 
  const fragment = useMemo(
    () => contract?.interface?.getFunction(methodName.trim()),
    [contract, methodName],
  );

  useEffect(() => {
    (async () => {
      if (!fragment) return;
      const res = await contract?.[methodName.trim()](...(inputs ?? []));
      setData(res);
    })();
  }, [contract?.address, account]); // , fragment

  return useMemo(() => {
    return toCallState(data, methodName);
  }, [data]);
}




//调用之后浏览器查看的提示
// message
export const useMessage = () => {
  const { chainId } = Web3Provider.useContainer();
  const [loading, setLoading] = useState<boolean>(false);

  // message
  const Message = (
    provider: JsonRpcProvider,
    hash: string,
    fn?: () => any,
    successText: string = '链上已确认',
  ) => {
    message.loading('链上确认中...', 0);
    setLoading(true);
    try {
      provider?.waitForTransaction(hash).then(() => {
        fn?.();
        message.destroy();
        setLoading(false);
        // message.success(successText, 1000);
        notification.success({
          placement: 'topRight',
          message: successText,
          description: `View on fiboscan:${formatHash(hash)}`,
          onClick: () => {
            window.open(
              `https://scan.fibochain.org/tx/${hash}`,
              '_blank',
            );
          },
        });
      });
    } catch (error) {
      setLoading(false);
    }
  };
  return useMemo(() => {
    return { Message, loading };
  }, [loading]);
};