import React, { useEffect, useState } from "react";
import Header from "./Header";
import Head from 'next/head'
import useWeb3Hook from '@/store/Web3Provider'
import useStorage from '@/store/Web3Provider/storage'

// Pay attention to the sorting,

function Layout({ children }: any) {

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <div className="">
        <div  >
            <Header />
            {children}
        </div>
      </div>

    </>
  )
}

export default Layout;