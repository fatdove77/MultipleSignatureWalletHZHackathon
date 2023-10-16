import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类
import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { type MethodArg, digitalPrecision, setObjBigNumber } from '@/utils/utils';
//个人钱包方法
import Web3Provider from '@/store/Web3Provider';
//实例化合约方法
import {
  useMultiFactory
} from '@/hooks/useContract'
//提示
import toast from 'react-hot-toast';
import { addressConvert, addressRecover } from '@/utils/utils';
//状态管理
import { createContainer, useContainer } from 'unstated-next';
import Coin from '@/store/Coin';
import TransferInfo from '@/store/TransferInfo';
import useWallet from './useWallet';

export const useAddressBook = () => {


}