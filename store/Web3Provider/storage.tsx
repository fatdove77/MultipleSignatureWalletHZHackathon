import { useState } from 'react';
import { createContainer } from 'unstated-next';
//链上网络配置
import config from '@/config'
//使用memory cache缓存
import Cookies from 'js-cookie'
const STORAGE_PREFIX = 'WEB_';  //加一个头部描述信息

//如果value不存在那么存入缓存，如果value存在那么取出key值对应的value
export function storage(key: string, value?: any) {
  //传入value
  if (value !== undefined) {
    // localStorage.storePermanentItem(STORAGE_PREFIX + key, value);
    Cookies.set(STORAGE_PREFIX + key, value)
    localStorage.setItem(STORAGE_PREFIX + key, value);
    return;
  }
  if(typeof window !=='undefined'){
    return localStorage.getItem(STORAGE_PREFIX + key);
  }
  
}


//设置默认值
const defaultStates: any = {
  //缓存中有信息读出来 没有的话使用config的默认值
  NETWORK_ID: storage('NETWORK_ID') ?? config.DEFAULT_NETWORK_ID,
  WALLET_TYPE: storage('WALLET_TYPE') ?? config.DEFAULT_WALLET_TYPE,
}

function useStorage(customInitialStates = {}) {
  const initStates = Object.assign({}, defaultStates, customInitialStates);
  const [networkId, setNetworkId] = useState<number>(initStates.NETWORK_ID);
  const [walletType, setWalletType] = useState(initStates.WALLET_TYPE);
  return {
    networkId: Number(networkId),
    walletType,
    setNetworkId: (payload: any) => {
      storage('NETWORK_ID', payload);
      setNetworkId(payload);
    },
    setWalletType: (payload: any) => {
      storage('WALLET_TYPE', payload);
      setWalletType(payload);
    },
  };
}

export default createContainer(useStorage);


