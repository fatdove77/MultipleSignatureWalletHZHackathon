import React, { useEffect, useState } from 'react'
import Web3Provider from '@/store/Web3Provider'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button
} from '@mui/material'
import {
  CopyOutlined,
  LeftOutlined,
  PlusCircleFilled,
  PlusCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import FIBO from '@/public/ETH.png'
import Image from 'next/image';
import { CssTextField } from '@/component/CssComponent';
import Coin from '@/store/Coin';
function Assets() {
  const { coinList,InitCoinList } = Coin.useContainer();
  const { provider, account } = Web3Provider.useContainer();
  // let coinList  = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("addCoinList") ?? "[]") : [];
  const router = useRouter();
  
  //这个数组后期从缓存中提取一部分 比如代币符号和代币精度   缓存存储合约地址,精度,符号,余额/////////

  useEffect(()=>{
    InitCoinList();
  },[provider])


  return (
    <Box
      sx={{ padding: "1rem" }}
    >
      <Grid
        sx={{ paddingBottom: "1rem" }}
        onClick={() => { router.push('/Wallet') }}
        container
        alignItems={'center'}
      ><LeftOutlined style={{ marginRight: ".3rem" }} />资产</Grid>
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ padding: "1rem" }}
      >
        <Typography
          sx={{
            color: "#555555",
            fontWeight: "400",
            textAlign: "center",
            fontSize: "1rem"
          }}
        >
          代币
        </Typography>
        <Button
          onClick={() => { router.push('Assets/AddCoin') }}
          startIcon={<PlusCircleFilled style={{ fontSize: "25.38px", color: "#404040", marginLeft: ".4rem" }} />}
          sx={{
            width: "7.1875rem",
            height: "2rem",
            borderRadius: "3rem",
            padding: "0",
            justifyContent: "space-between",
            color: "#000000",
            border: "1px solid #CAD2C2 ",
          }}
          style={{ backgroundColor: "#FFFFFF" }}
          variant="outlined"
        // onClick={() => { connect(config.DEFAULT_NETWORK_ID, config.DEFAULT_WALLET_TYPE) }}
        >
          添加代币 &nbsp;
        </Button>
      </Grid>
      <Grid
        container
        item
        sx={{
          minHeight: "10.4375rem",
          padding: ".825rem 1.5rem",
          borderRadius: "12px",
          background: "#FFFFFF"
        }}
        flexDirection={"column"}
      // justifyContent={"space-around"}
      // alignItems={"center"}
      >
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            sx={{
              color: "#000000",
              fontWeight: "400",
              textAlign: "center",
              fontSize: "1rem"
            }}
          >
            资产
          </Typography>
          <Typography
            sx={{
              color: "#000000",
              fontWeight: "400",
              textAlign: "center",
              fontSize: "1rem"
            }}
          >
            余额
          </Typography>
        </Grid>
        <Divider sx={{ margin: ".8125rem 0" }}></Divider>
        {
          coinList&&coinList.map((item:any, index:any) => {
            return (
              <Grid
                sx={{ marginBottom: "1.5rem" }}
                container
                justifyContent={"space-between"}
                alignItems={"center"}
                key  =  {index}
              >
                <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: "400",
                    textAlign: "center",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Image
                    alt=""
                    src={FIBO}
                    style={{
                      width: "1rem",
                      height: "1rem",
                      marginRight: ".5rem"
                    }} />
                  {item?.name}
                </Typography>
                <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: "500",
                    textAlign: "center",
                    fontSize: "1.125rem"
                  }}
                >
                  {item?.balance??0}
                </Typography>
              </Grid>
            )
          })
        }

      </Grid>
    </Box>
  )
}

export default Assets