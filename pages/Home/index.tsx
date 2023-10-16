import Web3Provider from '@/store/Web3Provider'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Grid, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import {
  PlusCircleOutlined,
  PlusOutlined,
  DownloadOutlined,
  DownOutlined,
  CopyOutlined,
  UpOutlined,
  CaretLeftOutlined,
  CaretRightOutlined
} from '@ant-design/icons';
import logo from '@/public/建国.jpg'
import Image from 'next/image';
import AddWallet from './AddWallet';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useHome } from '@/hooks/useHome';
import { ethereumAddressImage } from '@/utils/Avatar'
import { formatAddress, addressConvert } from '@/utils/utils';
import { Spin } from 'antd';
import useTest from '@/store/Web3Provider/test';
import config from '@/config';
import copy from 'copy-to-clipboard';


import { styled } from '@mui/material';
import { Button } from '@mui/material'

// const MyButton = styled(Button)({
//   // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//   border: 0,
//   borderRadius: 3,
//   // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
//   color: 'green',
//   height: 48,
//   padding: '0 30px',
//   borderColor:"green"
// });



function Home() {
  const { active, connect, disconnect, account } = Web3Provider.useContainer();
  const router = useRouter();
  const [temp_isAccount] = useState(true);
  const [isShowList, setIsShowList] = useState(true); //是否收起钱包列表
  const {
    walletArr,
    loading,
    current,
    isImport,
    setIsImport,
    newWalletName,
    newWalletAddress,
    newSignType,
    setCurrent,
    HandleWalletAddress,
    HandleWalletName,
    AddWalletArr,
    TellWalletSignType
  } = useHome()




  const showList = {
    display: "block"
  }

  const noShowList = {
    display: "none"
  }

  const NavigateWallet = (index: number) => {
    localStorage.removeItem("INDEX")
    localStorage.setItem("INDEX", index.toString());
    router.push("/Wallet")
  }

  useEffect(() => {
    if (walletArr?.length === 0) {
      setIsShowList(false)
    }
    else {
      setIsShowList(true)
    }
  }, [walletArr])



  return (
    <Box sx={{ padding: "1rem" }} >
      {/* <MyButton variant = "outlined">111</MyButton> */}
      <Grid
        container
        gap={"1rem"}
        flexDirection={"column"}
      >
        <Grid
          item
          container
          sx={{ marginLeft: ".4rem" }}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item xs={8} sx = {{fontSize:"1rem"}}>我的多签钱包</Grid>
          <Grid item xs={1} container justifyContent={"center"}>
            {
              isShowList
                ? <UpOutlined onClick={() => { setIsShowList(false) }} />
                : <DownOutlined onClick={() => { setIsShowList(true) }} />
            }

          </Grid>
        </Grid>
        {
          active
            ? temp_isAccount
              ? <Grid
                style={Object.assign({}, isShowList ? showList : noShowList)}
                container
                item
                sx={{ minHeight: "11.25rem", padding: " 9px 1rem 1rem 1rem ", borderRadius: "12px", background: "#FFFFFF" }}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Grid item container justifyContent={'space-between'} sx={{ marginBottom: ".5rem" }}>
                  <Grid item>ETH chain</Grid>
                  <Grid container item xs={2} justifyContent={'space-between'}>
                    <button
                      onClick={() => setCurrent(current - 1)}
                      disabled={current === 0}
                    >
                      <CaretLeftOutlined />
                    </button>
                    <button
                      onClick={() => setCurrent(current + 1)}
                      disabled={current === (walletArr?.length % 3 === 0 ? walletArr?.length / 3 - 1 : Math.floor(walletArr?.length / 3))}
                    >
                      <CaretRightOutlined />
                    </button>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  // sx={{ padding: "0.8125rem" }}
                  flexDirection={"column"}
                  gap={"0.625rem"}
                >
                  {/* 钱包列表 */}
                  {
                    loading
                      ? <Spin></Spin>
                      : walletArr && walletArr.slice(current * 3, current * 3 + 3).map((item: any, index: number) => {
                        return (
                          <Grid
                            key={index}
                            container
                            flexDirection={'row'}
                            sx={{ background: "rgb(122, 247, 139)", padding: "0.625rem", borderRadius: ".5rem" }}
                            alignItems={"center"}
                            onClick={() => {
                              NavigateWallet(index + current * 3)
                            }}
                          >
                            <Grid item xs={2}>
                              <Image alt="" src={item.img} width={'20'} height={'20'} style={{ width: "2.5rem", height: "2.5rem" }} ></Image>
                            </Grid>
                            <Grid xs={5} item container flexDirection={"column"}>
                              <Grid sx={{ fontSize: "0.87rem" }}>{item.name}</Grid>
                              <Grid sx={{ fontSize: ".75rem", color: "#878787" }} container alignItems={"center"}>
                                <Typography
                                  sx={{
                                    color: "#878787",
                                    fontWeight: "500",
                                    textAlign: "center",
                                    fontSize: "1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: ".1rem"
                                  }}
                                >
                                  add:{formatAddress(item.address)}
                                  <CopyOutlined
                                    onClick={
                                      (e) => { e.preventDefault(); copy(item.address) }} style={{ lineHeight: ".3rem", marginRight: ".3rem" }} />
                                </Typography>

                              </Grid>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              container
                              justifyContent={"flex-end"}
                              sx={{ marginLeft: "2.2rem" }}
                            >
                              {item.balance} &nbsp;ETH
                            </Grid>
                          </Grid>

                        )

                      })
                  }
                </Grid>
              </Grid>
              : <Grid
                style={Object.assign({}, isShowList ? showList : noShowList)}
                container
                item
                sx={{ height: "11.25rem", padding: "1rem", borderRadius: "12px", background: "rgba(232, 238, 215, 0.6)" }}
                flexDirection={"column"}
                justifyContent={"space-around"}
                alignItems={"center"}
              >
                <Grid item sx={{ textAlign: "center" }} >
                  <PlusCircleOutlined style={{ fontSize: "4.125rem" }} />
                </Grid>
                <Grid item>
                  新建账户
                </Grid>
              </Grid>
            : <Grid
              container
              style={Object.assign({}, isShowList ? showList : noShowList)}
              sx={{ height: "11.25rem", padding: "1rem", borderRadius: "12px", background: "linear-Gradient(123deg, rgba(186,235,136,0.65) -4%, rgba(206,227,121,0.65) 54%, rgba(241,239,112,0.65) 101%)" }}
              flexDirection={"column"}
              justifyContent={"space-around"}
              alignItems={"space-around"}
            // gap = "1rem"
            >
              <Grid item sx={{ textAlign: "center", marginTop: "1rem" }} >连接钱包以查看您的多签钱包<br></br>或创建新账</Grid>
              <Grid item container
                justifyContent={"center"}
                alignItems={"center"}>
                <LoadingButton
                  onClick={() => { connect(config.DEFAULT_NETWORK_ID, config.DEFAULT_WALLET_TYPE) }}
                  variant="contained"
                  sx={{ width: "15.9rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "1rem" }}
                  style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
                >
                  连接钱包
                </LoadingButton>
              </Grid>
            </Grid>
        }


        <Grid item sx={{ marginLeft: ".4rem" }} >创建你的多签钱包</Grid>
        <Grid
          container
          item
          sx={{ height: "11.25rem", padding: "1rem", borderRadius: "12px", background: "#FFFFFF" }}
          flexDirection={"column"}
          justifyContent={"space-around"}
          alignItems={"center"}
        >
          <Grid
            item
            container
          >
            <Grid>
              <PlusOutlined style={{ fontSize: "3.125rem", marginLeft: "1rem", color: "rgb(122, 247, 139)" }}></PlusOutlined>
            </Grid>
          </Grid>
          <Grid item sx={{ textAlign: "center", fontSize: ".7rem", fontWeight: "350" }} >创建一个被多个拥有者管理的多签钱包</Grid>
          <Grid item>
            <LoadingButton
              variant="contained"
              startIcon={<PlusOutlined style={{ fontSize: "1rem", }} />}
              sx={{ width: "15.9rem", height: "2.31rem", borderRadius: "1.125rem", color: "black" }}
              style={{ backgroundColor: "rgb(122, 247, 139)" }}
              onClick={() => {
                router.push("/Home/NewWallet")
              }}
            >
              创建新的多签钱包
            </LoadingButton>

          </Grid>
        </Grid>

        <Grid item sx={{ marginLeft: ".4rem" }} >导入你的多签钱包</Grid>
        <Grid
          container
          item
          sx={{ height: "11.25rem", padding: "1rem", borderRadius: "12px", background: "#FFFFFF" }}
          flexDirection={"column"}
          justifyContent={"space-around"}
          alignItems={"center"}
        >
          <Grid
            item
            container
          >
            <Grid>
              <DownloadOutlined style={{ fontSize: "3.125rem", marginLeft: "1rem", color: "rgb(122, 247, 139)" }}></DownloadOutlined>
            </Grid>
          </Grid>
          <Grid item sx={{ textAlign: "center", fontSize: ".7rem", fontWeight: "350" }} >已有多签钱包？通过他的地址添加它</Grid>
          <Grid item>
            <LoadingButton
              onClick={() => { setIsImport(true) }}
              variant="contained"
              startIcon={<DownloadOutlined style={{ fontSize: "1rem" }} />}
              sx={{ width: "15.9rem", height: "2.31rem", borderRadius: "1.125rem", color: "black" }}
              style={{ backgroundColor: "rgb(122, 247, 139)" }}
            >
              添加现有钱包
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>

      {
        isImport
          ? <AddWallet
            isImport={isImport}
            newSignType={newSignType}
            setIsImport={setIsImport}
            HandleWalletName={HandleWalletName}
            HandleWalletAddress={HandleWalletAddress}
            newWalletName={newWalletName}
            newWalletAddress={newWalletAddress}
            AddWalletArr={AddWalletArr}
            TellWalletSignType={TellWalletSignType}
          />
          : <></>
      }
    </Box>
  )
}

export default Home