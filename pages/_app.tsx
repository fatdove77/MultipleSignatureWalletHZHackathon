import { useState, type ReactNode } from 'react';
// //css
import '@/styles/globals.css'
import '@/styles/style.scss'
import '@rainbow-me/rainbowkit/styles.css'
// //组件
import Layout from '@/component/Layout'
//toast
import toast, { Toaster } from 'react-hot-toast';
import useWeb3Hook from '@/store/Web3Provider'
import useStorage from '@/store/Web3Provider/storage'
import useWallet from '@/hooks/useWallet';
import useTest from '@/store/Web3Provider/test';
import Coin from '@/store/Coin';
import TransferInfo from '@/store/TransferInfo';
import AddressBooksStore from '@/store/AddressBooksStore';
const models = {
  useStorage,
  useWeb3Hook,
  useWallet,
  useTest,
  Coin,
  TransferInfo,
  AddressBooksStore,
};


function compose(containers: any) {
  return function Component(props: any) {
    return containers.reduceRight(
      (children: any, Container: any) => (
        <Container.Provider>{children}</Container.Provider>
      ),
      props.children,
    );
  };
}

const ComposedStore = compose(Object.values(models));

console.log(models);

interface appProps {
  Component: React.ElementType,
  pageProps: Object | String
}

export default function App({ Component, pageProps }: appProps) {
  return (
    <>
      <ComposedStore>
        <Layout 
        >
          <Toaster></Toaster>
          <Component  {...pageProps} />
        </Layout>
      </ComposedStore >

    </>
  )
}



