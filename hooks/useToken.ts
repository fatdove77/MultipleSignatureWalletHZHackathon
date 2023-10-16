import { useMemo, useEffect, useState } from 'react';
import { useTokenContract } from './useContract';
import { useSingleCallResult } from './index';
import { toCallState, type CallState } from '../utils/utils';
import Web3Provider from '@/store/Web3Provider';
import { BigNumber } from 'bignumber.js';

// currency balance  通过合约获取当前代币余额
export const useCurrencyBalances = (tokenAddress?: string): CallState => {
  const { account } = Web3Provider.useContainer();

  const TokenContract = useTokenContract(tokenAddress ?? undefined);
  const { decimals } = useSingleCallResult(TokenContract, 'decimals');
  const { balanceOf } = useSingleCallResult(TokenContract, 'balanceOf', [
    account,
  ]);

  return useMemo(() => {
    const data = {
      balanceOf,
      balances: balanceOf
        ? BigNumber(balanceOf).div(Math.pow(10, decimals)).toFixed()
        : '',
    };

    return toCallState(data);
  }, [decimals, balanceOf, tokenAddress]);
};

// Mainnet balance  获取主网币 （fibo okx）
export const useMainNetBalances = (): CallState => {
  const { account, provider } = Web3Provider.useContainer();
  const [pending, setPending] = useState();

  useEffect(() => {
    (async () => {
      if (!provider || !account) return;
      const pending = await provider.getBalance(account, 'pending');
      if (pending) {
        setPending(pending.toString());
      }
    })();
  }, [provider, account]);

  return useMemo(() => {
    const data = {
      pending,
      balances: pending
        ? BigNumber(pending).div(Math.pow(10, 18)).toFixed()
        : '',
    };
    return toCallState(data);
  }, [pending]);
};



// TODO:   封装代币信息
export function useToken(tokenAddress?: string): CallState {
  const TokenContract = useTokenContract(tokenAddress);
  const { symbol } = useSingleCallResult(TokenContract, 'symbol');
  const { decimals } = useSingleCallResult(TokenContract, 'decimals');
  const { name } = useSingleCallResult(TokenContract, 'name');

  // const address = useSingleCallResult(TokenContract, 'address');

  return useMemo(() => {
    const data = {
      symbol,
      decimals,
      name,
      address: tokenAddress,
    };
    return toCallState(data);
  }, [symbol, decimals, name]);
}



// //拿到对应链上的usdt
// export const useGetUSDT = (): CallState => {
//   const AWWContract = useAWWContract();
//   const { usdt } = useSingleCallResult(AWWContract, 'usdt');
//   const TokenContract = useTokenContract(usdt ?? undefined);
//   const { decimals } = useSingleCallResult(TokenContract, 'decimals');

//   return useMemo(() => {
//     return toCallState({ address: usdt, decimals });
//   }, [usdt, decimals]);
// };

// export const useUSDTBalances = (): CallState => {
//   const {
//     value: { address },
//   } = useGetUSDT();
//   const {
//     value: { balances },
//   } = useCurrencyBalances(address);

//   return useMemo(() => {
//     return toCallState(balances);
//   }, [balances]);
// };
