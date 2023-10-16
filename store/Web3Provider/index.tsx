import React, { useState, useEffect, useCallback } from 'react';
//状态管理
import { createContainer, useContainer } from 'unstated-next';
//链的基本配置
import config from '@/config'
//支持链：是个数组
import { chains } from '@/config/netConfig'
//存储链id和钱包id的
import Storage from './storage';
//toast组件
import toast, { Toaster } from 'react-hot-toast';
//metamask 的兼容性更好的 provider
import detectEthereumProvider from '@metamask/detect-provider';
//ETHERS
import { ethers } from 'ethers';
export interface useWeb3Type {
  provider: any;  //ethers的配置类 包含很多方法
  web3: any;  //web3 
  account: string;
  active: boolean;
  chainId: number;
  loading: boolean;
  connect: (chainId: number, wallerType: string) => any;
  disconnect: () => void;
}

const useWeb3Hook = (): useWeb3Type => {
  const [web3, setWeb3] = useState<any>(null); // ethereum  //window.ethereum
  const [provider, setProvider] = useState<any>(null); // provider
  const [currentAccount, setCurrentAccount] = useState<any>(null);
  const { walletType, networkId, setNetworkId } = Storage.useContainer();
  const [chainId, setChainId] = useState<number>(config.CHAIN_ID);
  const [loading, setLoading] = useState<boolean>(false);

  //连接钱包的方法
  const handleConnect = useCallback(
    //参数 分别是 网络id:12306 钱包类型  是否自动连接
    async (network_id: number, wallet_type: string, auto_connect?: boolean) => {
      setLoading(true);  //控制按钮加载的loading
      // 限制支持链  find找到第一个符合的值 也就是从符合的链数组中找到networkid一致的链信息
      const chainsInfo = chains.find((item: any) => {
        return item.networkId === network_id;
      });
      if (chainsInfo == null) {
        toast.error(`不支持的网络,需要切换到支持的网络:${network_id}`)
        return true;
      }

      // 生成连接钱包的provider
      try {
        let providerInstance: any = null;
        switch (wallet_type) {
          case 'MetaMask':
            providerInstance = await detectEthereumProvider();
            break;
          default:
            providerInstance = await detectEthereumProvider();
            break;
        }
        let account = [];
        //解锁metamask 获得用户地址
        if (providerInstance) {
          const accounts = await providerInstance.request({
            method: 'eth_requestAccounts',
          });
          account = accounts[0];
          console.log(account);
          
        }
        else {
          if (!auto_connect) {
            toast.error(`Please install ${wallet_type}!`);
            return `please install`
          }
          return;
        }
        //获取当前链id
        const walletChainId = await providerInstance.request({
          method: 'eth_chainId',
        });
        //转化成0x格式
        const providerChainId =  //当前链的0x格式
          walletChainId.toString().indexOf('0x') === 0
            ? parseInt(walletChainId, 16)
            : walletChainId;
        //如果目标网络和当前网络不一样 那么切换网络
        
        if (network_id !== providerChainId) {
          try {
            //切换network
            await providerInstance.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${network_id.toString(16)}` }],
            });
          } catch (switchError: any) {
            console.error('wallet_switchEthereumChain', switchError);
            // This error code indicates that the chain has not been added to MetaMask.
            //将这条链添加到metamask中
            if (switchError.code === 4902) {
              try {
                const params = {
                  chainId: `0x${network_id.toString(16)}`,
                  chainName: chainsInfo.name,
                  nativeCurrency: chainsInfo.nativeCurrency,
                  rpcUrls: chainsInfo.rpcUrls,
                };
                await providerInstance.request({
                  method: 'wallet_addEthereumChain',
                  params: [params],
                });
              } catch (addError: any) {
                toast.error("添加链错误"+addError);
                console.log(addError);
                return addError.message;
              }
            } else if (switchError.code === 4001) {
              toast.error('❌ 你拒绝了 "切换网络" 的请求');
              return;
            } else if (switchError.code === -32002) {
              // alert(
              //   '😊 已经发送了 "切换网络" 的请求，\n请动动你发财的小手在钱包内确认一下。',
              // );
              return;
            } else {
              toast.error(switchError.message);
              return switchError.message;
            }
          }
        }
        const provider = new ethers.providers.Web3Provider(providerInstance); // 实例化provider
        const user_Account = await provider._getAddress(account); // 

        // Set
        setProvider(provider);
        setChainId(providerChainId);
        setWeb3(providerInstance);
        setCurrentAccount(user_Account);
        setLoading(false);
        return null;
      } catch (e: any) {
        let message = e.message;
        switch (e.code) {
          case -32002:
            message = '请确认您在MetaMask中的操作'; // 'Please confirm your operation in MetaMask'
            break;
          default:
            break;
        }
        console.error('最终错误', e);
        alert(message);
        return message;

      }
    }, [])

    //断开连接方法
  const handleDisconnect = useCallback(async () => {
    setWeb3(null);
    setProvider(null);
    setCurrentAccount(null);
  }, []);



  // 自动连接
  useEffect(() => {
    if (networkId && walletType) {
      console.log(`网络id${networkId}`);
      
      handleConnect(networkId, walletType, false);
    }
  }, [networkId, walletType]);

  useEffect(() => {
    if (!web3?.on) return;
    web3.on('accountsChanged', (_accounts: any, a: any, b: any) => {
      // / Handle the new _accounts, or lack thereof.
      // “_accounts”/ "_accounts" will always be an array, but it can be empty.
      if (!_accounts.length) {
        return;
      }
      if (currentAccount === _accounts[0]) {
        return;
      }
      setCurrentAccount(_accounts[0]);
      window.location.reload();
    });

    // chainId
    web3.on('chainChanged', async (chainId: any) => {
      const chainIdValue =
        chainId.toString().indexOf('0x') === 0
          ? parseInt(chainId, 16)
          : chainId;
      const network: any = chains.find((element: any) => {
        return element.chainId === Number(chainIdValue);
      });
      setNetworkId(network.networkId);
      window.location.reload();
    });

    // 
    web3.once('disconnect', async () => {
      await handleDisconnect();
    });
  }, [web3, currentAccount, handleDisconnect, setNetworkId]);

  return {
    provider,  
    web3, 
    chainId,  //链id
    account: currentAccount,  //用户地址
    active: !!currentAccount,  //是否连接
    async connect(chain_id: number, wallet_type: string) {
      return await handleConnect(chain_id, wallet_type);
    },
    async disconnect() {
      await handleDisconnect();
    },
    loading
  };
};

export default createContainer(useWeb3Hook);
