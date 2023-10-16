import Web3Provider from '@/store/Web3Provider';
import { useMemo } from 'react';
import { type Contract } from 'ethers';
import { getContract } from './index';
import MultiFactory_ABI from '@/constance/abi/MultiFactoryAbi.json';
import MultiSignatureThreshold_ABI from '@/constance/abi/MultiSignatureThreshold.json'
import MultiSignatureWeight_ABI from '@/constance/abi/MultiSignatureWeight.json'
import ERC20_ABI from '@/constance/abi/erc20.json';
import { contractAddress } from '@/constance';



//实例化多签工厂合约
export const useMultiFactory = ()=>{
  const {provider,account} = Web3Provider.useContainer();
  if(!provider || !MultiFactory_ABI) return;
  return getContract(contractAddress,MultiFactory_ABI,provider,account);

}


//实例化门限值合约
export const useDoorContract = (address:string)=>{
  const {provider,account} = Web3Provider.useContainer();
  if(!provider || !MultiSignatureThreshold_ABI) return;
  return getContract(address,MultiSignatureThreshold_ABI,provider,account);
}


//实例化门限值合约
export const uesWeightContract = (address:string)=>{
  const {provider,account} = Web3Provider.useContainer();
  if(!provider || !MultiSignatureWeight_ABI) return;
  return getContract(address,MultiSignatureWeight_ABI,provider,account);
}


// erc20 实例化erc20合约  这个函数其实是能接受传参的 只不过传参进入闭包里 address
export const useErcContract = () => {
  const { provider, account } = Web3Provider.useContainer();
  return (address: string) => {
    if (!address || !provider || !account) return null;
    return getContract(address, ERC20_ABI, provider, account);
  };
};

// TODO: erc20  二次实例化代币合约(给代币合约传参)
export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}



// TODO: 
export function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible?: boolean,
): Contract | null {
  const { provider, account } = Web3Provider.useContainer();

  return useMemo(() => {
    if (!address || !ABI || !provider) return null;
    try {
      return getContract(
        address,
        ABI,
        provider,
        withSignerIfPossible && account ? account : undefined,  //是否需要签名,如果需要传入account
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, provider, withSignerIfPossible, account]);
}

// // Aww
// export const useAWWContract = () => {
//   const { provider, account } = Web3Provider.useContainer();
//   if (!provider || !FDF_ABI) return;
//   return getContract(contractAddress, FDF_ABI, provider, account);
// };


