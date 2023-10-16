import React, { useState } from 'react'
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
import logo from '@/public/建国.jpg'
import Image from 'next/image';
import { CssTextField } from '@/component/CssComponent';
import { useAddCoin } from '@/hooks/useAddCoin';
import { toast } from 'react-hot-toast';
function SendCoin() {
  const router = useRouter();
  //这个数组后期从缓存中提取一部分 比如代币符号和代币精度   缓存存储合约地址,精度,符号,余额/////////
  const {
    coinContract,
    coinName,
    coinAccuracy,
    save,
    SaveLocalCoin,
    HandleCoinName,
    HandleCoinAccuracy,
    HandleContract
  } = useAddCoin();

  const Save = ()=>{
    if(save){
      SaveLocalCoin();
    }
    else {
      toast.error("请输入正确代币信息")
    }
    
    // router.push("/Wallet/Assets")
  }

  return (
    <Box
      sx={{ padding: "1rem" }}
    >
      <Grid
        sx={{ paddingBottom: "1rem" }}
        onClick={() => { router.back() }}
        container
        alignItems={'center'}
      ><LeftOutlined style={{ marginRight: ".3rem" }} />添加代币</Grid>
      <Grid
        container
        item
        sx={{
          minHeight: "8.5rem",
          padding: "1rem",
          borderRadius: "12px",
          background: "#FFFFFF"
        }}
        flexDirection={"column"}
      >
        <Grid>代币合约</Grid>
        <CssTextField
          value={coinContract ?? ''}
          onChange={(e) => { HandleContract(e.target.value) }}
          sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
          InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
          placeholder='请输入代币合约地址'
          variant="outlined"
        // error={flag}
        // helperText={flag ? "1" : ""}

        />
        <Grid sx={{ marginTop: "1.5rem" }}>代币符号</Grid>
        <CssTextField
          value={coinName ?? ""}
          sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
          InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
          variant="outlined"
          onChange={(e) => { HandleCoinName(e.target.value) }}
        // error={flag}
        // helperText={flag ? "1" : ""}
        // value={coinName??""}
        
        />
        <Grid sx={{ marginTop: "1.5rem" }}>代币精度</Grid>
        <CssTextField
          value={coinAccuracy ?? ''}
          onChange={(e) => {HandleCoinAccuracy(parseInt(e.target.value))}}
          sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
          InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
          variant="outlined"
        // error={flag}
        // helperText={flag ? "1" : ""}
        // 
        />
      </Grid>
      <LoadingButton
        onClick={() => { Save() }}
        variant="contained"
        sx={{ width: "100%", height: "2.31rem", borderRadius: "1.125rem", marginTop: "1.875rem" }}
        style={{ backgroundColor: " rgba(5, 5, 5, 0.76)" }}
      >
        保存
      </LoadingButton>
    </Box>
  )
}

export default SendCoin