import { ethers, type Contract } from 'ethers';
import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';

import config from '@/config';


// Check if the address is correct
export function isAddress(value: any, isAddress = true): string | false {
  try {
    if (isAddress) {
      return ethers.utils.getAddress(value);
    } else {
      return ethers.utils.getContractAddress(value);
    }
  } catch {
    return false;
  }
}

const ETHERSCAN_PREFIXES: Record<number, string> = {
  12307: 'scan.fibochain.org',  //fibo test
  12306: 'scan.fibochain.org',  // fibo div 
};

export function getEtherscanLink(
  chainId: number,
  data: string,
  type: 'transaction' | 'token' | 'address',
): string {
  const prefix = `https://${
    ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[config.CHAIN_ID]
  }`;
  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`;
    }
    case 'token': {
      return `${prefix}/token/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}
export function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatHash(hash: string) {
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
}

export const digitalPrecision = (
  num: string | number,
  decimals: number,
  isDiv?: boolean, //   By default  
) => {
  // division. High-precision decimal conversion to Arabic numerals
  if (!num) {
    return '';
  }
  if (isDiv) {
    return BigNumberJs(num.toString())
      .div(Math.pow(10, decimals))
      .toFixed(config.precision)
      .toString();
  } else {
    // Convert to high precision decimal by default
    return BigNumberJs(num.toString()).times(Math.pow(10, decimals)).toFixed();
  }
};

// Process object BigNumber data
export const setObjBigNumber = (
  data = {},
  fn = (e: any) => {
    return e;
  },
) => {
  return Object.entries(data)
    .map((item: any) => ({
      [item[0]]: fn(item[1].toString()),
    }))
    .reduce(
      (acc: any, cur: any) => ({
        ...acc,
        ...cur,
      }),
      {},
    );
};

// interface Result extends ReadonlyArray<any> {
//    readonly [key: string]: any;f
// }
type dataType = Record<string, any>;

export type MethodArg = dataType | string | number | BigNumber;

//定义合约返回值的数据类型  返回值 加载状态 错误
export interface CallState {
  readonly value: any; // MethodArg | undefined;
  // true if the result has never been fetched
  readonly loading: boolean;
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean;
  [key: string]: any;
}

//合约返回错误  返回下列的非法value
const INVALID_CALL_STATE: CallState = {
  value: undefined,
  loading: false,
  error: false,
};

 
// satte  //返回的是一个对象  包含value loading error
export function toCallState(
  value: MethodArg | undefined = undefined,
  methodName?: string,
): CallState {
  //值不存在  返回定义好的非法state
  if (!value) return INVALID_CALL_STATE;

    
  const obj_data = Object.entries(value)
    .map((item) => item[1])
    .some((item) => (item ?? '') !== ''); 

  if (value) {
    const data: CallState = {
      loading: obj_data,
      error: false,
      value: ethers.BigNumber.isBigNumber(value) ? value.toString() : value,
    };
    if (methodName) {
      data[methodName] = data.value;
    }
    return data;
  }

  return {
    ...INVALID_CALL_STATE,
    error: true,
  };
}


//
export function FormatGas(value:any){
  const bigNumber = ethers.BigNumber.from(value._hex);

// 将 BigNumber 转换为普通的 JavaScript 数值
const numberValue = bigNumber.toNumber();
return numberValue

}

// 16进制数转10进制
var ex16hex = function (value:any) {
  value = value.replace("0x", "");
  var arr = value.split("");
  arr = arr.reverse();
  var res = 0;

  for (let i = 0; i < arr.length; i++) {
      var num = hex_change(arr[i]);
      res += muti16(num, i);
  }

  return res;
}

// 字符转16进制数字
var hex_change = function (v:any) {
  var res;
  switch (v) {
      case "a":
          res = 10;
          break;
      case "b":
          res = 11;
          break;
      case "c":
          res = 12;
          break;
      case "d":
          res = 13;
          break;
      case "e":
          res = 14;
          break;
      case "f":
          res = 15;
          break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
          res = Number(v);
          break;
      default:
          res = 0;
          break;
  }
  return res;
}

// 返回 v 乘以 n 个 16 的积
var muti16 = function (v:any, n:any) {
  var temp = v;
  for (var i = 0; i < n; i++) {
      temp *= 16;
  }
  return temp;
}


function validateETHAddress(addr:string) {
  try {
      //判空 判开头
      if (!addr || addr.substring(0, 2) !== '0x') {
          return false
      }

      //判长度
      if (addr.substring(2, addr.length).length !== 40) {
          return false
      }

      //判能否转10进制
      ex16hex(addr)

      return true
  } catch (error) {
      console.debug(error, '----')
      return false
  }
}

function validateFibonacciAddress(addr:string) {
  try {
      const decodeAddress = bech32.decode(addr);
      return decodeAddress.prefix === "fb";
  } catch (err) {
      return false;
  }
};


const {bech32} = require('bech32'); //2.0.0
const {Buffer} = require('buffer');  //4.9.1
export const addressConvert = (evmAddress:string)=> {
  if (validateETHAddress(evmAddress)) {
      // 0x开头,转换为bech32
      let hexAddr = evmAddress.slice(2);
      let words = bech32.toWords(Buffer.from(hexAddr, 'hex'));
      let fbAddress = bech32.encode('fb', words);
      return fbAddress;
  }
  return evmAddress;
}


/**
 * 地址恢复成EVM地址
 * @param {FibonacciChain 地址} FibonacciAddress
 * @returns {*|string}
 */
export function addressRecover(FibonacciAddress:string) {
  if (validateFibonacciAddress(FibonacciAddress)) {
      let words = bech32.decode(FibonacciAddress).words;
      let addrBuf = Buffer.from(bech32.fromWords(words));
      return "0x" + Array.prototype.map.call(new Uint8Array(addrBuf), x => ('00' + x.toString(16)).slice(-2)).join('');
  }
  return FibonacciAddress;
}



///检验输入框
type Ob = {
  name: string,
  address:string
}[]

function CheckDuplicates(arr:any,index:number){
  let temp = false;
  arr.map((item:any,i:number)=>{
    if(item.address===arr[index].address&&i!==index&&arr[index].address!=undefined){
      temp = true;
    }
  })
  return temp;
}

//地址是否正确
export function CheckAddressCorrect (address:string){
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  if(addressRegex.test(address)){
    return true;
  }
  return false;
}

export const ErrorNameMessage = (arr:any,index: number) => {
  //检验对应下标 是否为空  是否重复 地址是否正确
  if (arr[index].name === '') {
    return "不能为空"
  }
  // if (arr[index].name === undefined) {
  //   return " "
  // }
  return ''
}


export const ErrorWeightMessage = (arr:any,index: number) => {
  //检验对应下标 是否为空  是否重复 地址是否正确
  let totalWeight:number=0;
  arr.map((item:any)=>{totalWeight+=parseInt(item?.weight)});
  if (arr[index].weight === '') {
    return "不能为空"
  }
  if (arr[index].weight === 0) {
    return "不能为零"
  }
  if(totalWeight > 100){
    return "累计权重值超过100%"
  }
  if(totalWeight < 100){
    return "累计权重值小于100%"
  }
  return ''
}


export const ErrorAddressMessage = (arr:any,index: number) => {
  console.log(arr,index);
  
  //检验对应下标 是否为空  是否重复 地址是否正确
  if (arr[index]?.address === '') {
    return "不能为空"
  }
  // if (arr[index].address === undefined) {
  //   return " "
  // }
  if(CheckDuplicates(arr,index)) {
    return "地址不能重复"
  }
  if(arr[index].address!=undefined&&!CheckAddressCorrect(arr[index].address)){
    return "地址格式错误"
  }
  // if()
  return ''
}


export const ErrorNewAddressMessage = (address:string|undefined) => {
  //检验对应下标 是否为空  是否重复 地址是否正确
  if (address === '') {
    return "不能为空"
  }
  // if (arr[index].address === undefined) {
  //   return " "
  // }
  if(address!=undefined&&!CheckAddressCorrect(address)){
    return "地址格式错误"
  }
  // if()
  return ''
}