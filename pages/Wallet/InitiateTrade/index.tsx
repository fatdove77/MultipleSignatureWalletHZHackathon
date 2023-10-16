import React from 'react'
import Web3Provider from '@/store/Web3Provider'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Grid,
  Badge,
  Typography,
  Divider
} from '@mui/material'
import {
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/建国.jpg'
import Trade from '@/public/trade.png'
import { useRouter } from 'next/router';
import TransferInfo from '@/store/TransferInfo';
import AddressBooksStore from '@/store/AddressBooksStore';
import Coin from '@/store/Coin';
function InitiateTrade() {
  const {
    setReceiveAddress,
    setAmount,
  } = TransferInfo.useContainer();
  const { InitCoinList } = Coin.useContainer();
  const { setSendIndex } = AddressBooksStore.useContainer();
  const router = useRouter();
  const NavigateSendCoin = () => {
    InitCoinList();
    setSendIndex(undefined);
    router.push("InitiateTrade/SendCoin")
  }
  return (
    <Box
      sx={{ padding: "1rem" }}
    >
      <Grid sx={{ padding: "10px" }}>新交易</Grid>
      <Grid
        container
        justifyContent={"center"}
      >
        <Image alt="" src={Trade} style={{ borderRadius: "0" }}></Image>
      </Grid>


      <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
        <LoadingButton
          onClick={() => { router.push("InitiateTrade/CallContract") }}
          variant="contained"
          sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
          style={{ backgroundColor: "#D9F19C", color: "#000000" }}
        >
          调用合约
        </LoadingButton>
        <LoadingButton
          onClick={() => { NavigateSendCoin() }}
          variant="contained"
          sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
          style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
        >
          发送代币
        </LoadingButton>
      </Grid>
    </Box>
  )
}

export default InitiateTrade