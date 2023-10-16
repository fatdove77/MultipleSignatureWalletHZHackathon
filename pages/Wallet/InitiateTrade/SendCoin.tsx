import React, { useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputAdornment
} from '@mui/material'
import {
  LeftOutlined
} from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CssTextField } from '@/component/CssComponent';
import Coin from '@/store/Coin';
import TransferInfo from '@/store/TransferInfo';
import AddressBooksStore from '@/store/AddressBooksStore';
import { useSendCoin } from '@/hooks/useSendCoin';
import { ErrorNewAddressMessage } from '@/utils/utils';
import { toast } from 'react-hot-toast';
import Web3Provider from '@/store/Web3Provider'
import useWallet from '@/hooks/useWallet';
import { Spin } from 'antd';
function SendCoin() {
  const { walletInfo } = useWallet.useContainer();
  const { coinList, InitCoinList, loading } = Coin.useContainer();
  const { provider, account } = Web3Provider.useContainer();
  const {
    receiveAddress,
    amount,
    setReceiveAddress,
    setAmount,
  } = TransferInfo.useContainer();
  const {
    addressBook,
    sendIndex
  } = AddressBooksStore.useContainer();
  const {
    coinIndex,
    HandleAmount,
    HandleAddress,
    HandleCoinIndex,
    EnMax
  } = useSendCoin();
  const router = useRouter();
  const [save, setSave] = useState<boolean>(false);

  //检查是否是从地址簿过来的
  useEffect(() => {
    console.log(router);
    if (sendIndex !== undefined) {
      setReceiveAddress(addressBook && addressBook[sendIndex].address);
      setAmount(0);
    }
    else {
      setAmount(0);
      setReceiveAddress(undefined);
    }
  }, [])
  useEffect(() => {
    InitCoinList();
  }, [provider, walletInfo])
  useEffect(() => {
    if (ErrorNewAddressMessage(receiveAddress) === '' && amount != 0 && amount <= (coinList[coinIndex].balance ?? 0)) {
      setSave(true);
    }
    else {
      console.log(receiveAddress);
      console.log(amount);
      console.log(coinList[coinIndex].balance);
      setSave(false);
    }
  }, [receiveAddress, amount,coinIndex])
  //下一步按钮
  const NextStep = () => {
    if (save) {
      router.push("SendCoinInfo");
    }
    else {
      if (amount > (coinList[coinIndex].balance ?? 0)) {
        toast.error("余额不足")
      }
      else if(amount==0){
        toast.error("转账金额不能为空")
      }
      else {
        toast.error("请填写正确信息")
      }

    }
  }

  return (
    <Box
      sx={{ padding: "1rem" }}
    >
      <Grid
        sx={{ padding: "10px" }}
        onClick={() => { router.back() }}
        container
        alignItems={'center'}
      ><LeftOutlined style={{ marginRight: ".3rem" }} />发送代币</Grid>
      <Grid
        container
        item
        sx={{ minHeight: "13rem", padding: "1rem", borderRadius: "12px", background: "#FFFFFF" }}
        flexDirection={"column"}
      // alignItems={"start"}
      >
        <Grid sx={{ marginLeft: ".3rem" }}>接受地址</Grid>
        <CssTextField
          value={receiveAddress || ''}
          onChange={(e) => { HandleAddress(e.target.value) }}
          error={ErrorNewAddressMessage(receiveAddress) === '' ? false : true}
          helperText={ErrorNewAddressMessage(receiveAddress)}
          sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
          InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
          placeholder='请输入接受地址'
          variant="outlined"
          disabled={sendIndex !== undefined ? true : false}
        />
        <Grid sx={{ marginLeft: ".3rem", marginTop: "1.5rem" }}>数量</Grid>

        <Grid
          container
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{ height: "3rem" }}
          gap={".3rem"}
        >
          <Grid item xs={7}>
            <CssTextField
              type="number"
              value={amount}
              onChange={(e) => { HandleAmount(e.target.value) }}
              placeholder='请输入数量'
              InputProps={{
                style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" },
                endAdornment: (
                  <InputAdornment position="end" >
                    <button onClick={() => { EnMax() }} style={{ color: "#5E9B18" }}>MAX</button>
                  </InputAdornment>
                ),
              }}
            />
            {/* <>1</> */}
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <Select
                id="demo-simple-select"
                sx={{
                  height: "2.5rem",
                }}
                style={{
                  display: "flex"
                }}
                value={coinIndex}
                onChange={(e) => { HandleCoinIndex(e.target.value) }}
              >
                {
                  loading
                    ? <Spin></Spin>
                    :
                    coinList && coinList.map((item: any, index: number) => {
                      return (
                        <MenuItem key={index} sx={{ minHeight: "1.75rem", display: "flex" }} value={index}>
                          <Image alt='' width={30} height={30} src={item.img} style={{ width: "1rem", height: "1rem" }}></Image>
                          <div className="ml-[.3rem] flex flex-col">
                            <span style={{ fontSize: "0.8rem" }}>{item.name}</span>
                            <span style={{ color: "#A7A7A7", fontSize: ".75rem" }}>{item.balance} {item.name}</span>
                          </div>
                        </MenuItem>
                      )
                    })
                }

              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <LoadingButton
        variant="contained"
        sx={{ width: "100%", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
        style={{ backgroundColor: " rgba(5, 5, 5, 0.76)" }}
        onClick={() => { NextStep() }}
      >
        下一步
      </LoadingButton>
    </Box>
  )
}

export default SendCoin