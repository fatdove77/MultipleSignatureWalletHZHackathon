import React, { useEffect, useState } from 'react'
import Web3Provider from '@/store/Web3Provider'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Grid,
  Typography,
  Divider,
} from '@mui/material'
import {
  LeftOutlined,
  UpCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  CopyOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Coin from '@/store/Coin';
import TransferInfo from '@/store/TransferInfo';
import AddressBooksStore from '@/store/AddressBooksStore';
import { formatAddress } from '@/utils/utils';
import { ethereumAddressImage } from '@/utils/Avatar';
import useWallet from '@/hooks/useWallet';
import { ethers } from 'ethers';
import { GetLatestNonce, CreateNewTransaction } from '@/request/api';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import { useDoorContract, uesWeightContract } from '@/hooks/useContract';
import { useCheckOwner } from '@/hooks/useCheckOwner';
import { useThrottle } from '@/utils/hooks';
function SendCoinInfo() {
  const { coinList } = Coin.useContainer();
  const { CheckOwner } = useCheckOwner();
  console.log(coinList);
  const { provider, account } = Web3Provider.useContainer();
  const { sendIndex, addressBook } = AddressBooksStore.useContainer();
  const router = useRouter();
  const [raw, setRaw] = useState<any>();
  const [isDetail, setIsDetail] = useState(true);
  const [name, setName] = useState<string>();  //显示名称
  const [img, setImg] = useState<any>();  //显示头像
  const [nonce, setNonce] = useState<number>();
  const {
    receiveAddress,
    amount,
    coinInfo,
    SaveTransferInfo,
    transferInfo,
    NavigateTransferInfo
  } = TransferInfo.useContainer();
  console.log(coinInfo);
  const { walletInfo } = useWallet.useContainer();

  //计算rawdata
  const GetRawData = async () => {
    let nonce;
    try {
      await GetLatestNonce(walletInfo?.address).then((res) => {
        nonce = res.data.nonce;
        setNonce(res.data.nonce)
      });
    } catch (error) {
      console.log("获取nonce出错",error);
      
      
    }
    
    const transaction = {
      to: receiveAddress ?? "",
      value: ethers.utils.parseEther(amount.toString()), // 转账金额（以太为单位）
      gasLimit: 100 * 1e6, // Gas 限制
      nonce: nonce, // 交易序号
    };
    const serializedTransaction = ethers.utils.serializeTransaction(transaction);
    setRaw(serializedTransaction);

  }

  //如果是地址簿过来的赋值名字 如果没有那就给一个默认值
  useEffect(() => {
    if (sendIndex !== undefined) {
      setName(addressBook && addressBook[sendIndex]?.name);
      setImg(addressBook && addressBook[sendIndex]?.img)
    }
    else {
      setName("接收者");
      setImg(ethereumAddressImage(receiveAddress ?? ''))
    }
  }, [])

  //拿到rawdata
  useEffect(() => {
    if (walletInfo?.address) {
      GetRawData();
    }
  }, [walletInfo])


  const CheckIsOwner = async (temp_transferInfo:any) => {
    const res = await CheckOwner(temp_transferInfo);
    console.log(res);
    return res;
  }

  //检验 并 下一步
  const NextStep = useThrottle(async () => {
    if (receiveAddress !== undefined) {
      let time = dayjs().format('YYYY-MM-DD HH:mm:ss');
      console.log(walletInfo);
      let temp_TransFerInfo = {
        coinInfo:coinInfo,
        amount:amount,
        walletInfo:walletInfo,
        createTime:time,
        receiveAddress:receiveAddress,
        receiveName:name??"",
        receiveImg:img,
        nonce:nonce
      }
      NavigateTransferInfo(temp_TransFerInfo)
      //创建事务
      if (temp_TransFerInfo&&raw) {
        await CheckIsOwner(temp_TransFerInfo).then(async(res: any) => {
          if (res) {
            await CreateNewTransaction(walletInfo?.address, nonce, "转账交易", JSON.stringify(temp_TransFerInfo))
            //我需要把所有都存在缓存中
            router.push('TradeHistory')
          }
          else {
            toast.error("用户不在多签内")
          }
        })
      }
    }
    else {
      toast.error("请重新填写信息")
    }
  },5000)


  return (
    <Box
      sx={{ padding: "1rem" }}
    >
      <Grid
        sx={{ padding: "10px" }}
        onClick={() => { router.back() }}
        container
        alignItems={'center'}
      ><LeftOutlined style={{ marginRight: ".3rem" }} />交易确认</Grid>


      {/* //上方框 */}
      <Grid
        container
        item
        sx={{
          minHeight: "8.5rem",
          padding: ".5rem 1.375rem 1rem 1.375rem",
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
          sx={{ marginTop: ".5rem" }}
        >
          <Grid container >
            {/* 发送 or 在链上被拒绝 */}
            {
              1
                ? <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: "400",
                    textAlign: "center",
                    fontSize: "1.125rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <UpCircleFilled style={{ color: "#4D9623", lineHeight: ".5rem", marginRight: ".75rem" }} />
                  发送
                </Typography>
                : <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: "400",
                    textAlign: "center",
                    fontSize: "1.125rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <CloseCircleFilled style={{ color: "#FA5A5A", lineHeight: ".5rem", marginRight: ".75rem" }} />
                  在链上被拒绝
                </Typography>

            }

          </Grid>
        </Grid>
        <Divider sx={{ marginTop: ".8125rem" }}></Divider>
        {/* 被拒绝显示提示 or  显示交易信息 */}
        {
          1
            ? <Grid
              container
              item
              sx={{
                minHeight: "5.625rem",
                padding: ".5rem 1.375rem 1rem 1.375rem",
                borderRadius: "12px",
                background: " rgba(244, 244, 244, 0.58)",
                marginTop: ".625rem"
              }}
              flexDirection={"column"}
            // justifyContent={"space-around"}
            // alignItems={"center"}
            >
              <Grid
                container
                gap={".3rem"}
                alignItems={"center"}
              >
                <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".75rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  发送
                </Typography>
                <Image
                  alt=""
                  src={coinInfo?.img ?? ""}
                  height={50}
                  width={50}
                  style={{
                    width: "1rem",
                    height: "1rem"
                  }} />
                <Typography
                  sx={{
                    color: "#4D9623",
                    fontWeight: "400",
                    textAlign: "center",
                    fontSize: ".875rem",
                    display: "flex",
                    alignItems: "center",
                    lineHeight: "20px"
                  }}
                >
                  {amount} FIBO
                </Typography>
                <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".75rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  到
                </Typography>
              </Grid>
              <Divider sx={{ marginTop: ".3rem", marginBottom: ".3rem" }}></Divider>
              <Grid
                container
                alignItems={"center"}
              >
                <Grid
                  item
                  xs={2}
                  container
                  flexDirection={'column'}
                >
                  <Image
                    alt=""
                    src={img}
                    width={40}
                    height={40}
                    style={{
                      width: "1.625rem",
                      height: "1.625rem"
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={8}
                  container
                  flexDirection={'column'}
                >
                  <Typography
                    sx={{
                      color: "#000000",
                      fontWeight: "400",
                      textAlign: "left",
                      fontSize: ".75rem"
                    }}>
                    {name}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#4D9623",
                      fontWeight: "400",
                      textAlign: "center",
                      fontSize: ".75rem",
                      display: "flex",
                      alignItems: "center",
                      marginTop: ".5rem",
                      lineHeight: ".5rem",
                    }}
                  >
                    {formatAddress(receiveAddress ?? '')}
                    <CopyOutlined style={{ lineHeight: ".5rem", marginLeft: ".5rem" }} />
                  </Typography>
                </Grid>
              </Grid>

            </Grid>
            : <Grid>
              <Typography
                sx={{
                  color: "#BBC8AD",
                  fontWeight: "500",
                  textAlign: "center",
                  fontSize: ".625rem",
                  display: "flex",
                  alignItems: "center",
                  marginTop: ".625rem"
                }}
              >
                <ExclamationCircleFilled style={{ lineHeight: ".5rem", marginRight: ".5rem" }} />
                这笔交易在链上被拒绝不能发送任何交易
              </Typography>
            </Grid>
        }

      </Grid>
      {/* 交易信息 */}
      <Grid
        item
        container
        sx={{
          width: "100%",
          padding: ".625rem 1.375rem",
          backgroundColor: "#F9FDF2",
          borderRadius: ".75rem",
          marginTop: ".625rem",
          background: "#FFFFFF"
        }}
        flexDirection={'column'}
        alignItems={"space-between"}
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
              fontSize: "1.125rem",
              display: "flex",
              alignItems: "center"
            }}
          >
            <FileDoneOutlined style={{ lineHeight: ".5rem", marginRight: ".5rem", color: "#4D9623" }} />
            交易信息
          </Typography>
          <Typography
            sx={{
              color: "#D39344",
              fontWeight: "350",
              textAlign: "center",
              fontSize: ".625rem",
              display: "flex",
              alignItems: "center",
              borderRadius: "1.3125rem",
              backgroundColor: "rgba(255, 247, 237, 0.95)",
              padding: "0 .5rem",
              height: "1.375rem",
            }}
          >
            发送
          </Typography>
        </Grid>
        <Divider sx={{ margin: ".75rem 0 " }}></Divider>

        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
        // gap={"1rem"}
        >
          {/* 地址 */}
          <Grid
            item
            xs={5}
            sx={{
              color: "#AFAFAF",
              fontSize: ".875rem",
            }}
          >
            To(地址) :
          </Grid>
          <Grid
            container
            xs={4}
            flexDirection={"column"}
            alignItems={"flex-end"}
            // justifyContent={"center"}
            item >
            <Typography
              sx={{
                color: "#000000",
                fontWeight: "400",
                textAlign: "right",
                fontSize: ".875rem",
                // marginLeft: "2.5rem"
              }}
            >
              {name}
            </Typography>
            <Typography
              sx={{
                color: "#4D9623",
                fontWeight: "400",
                textAlign: "center",
                fontSize: ".875rem",
                display: "flex",
                alignItems: "center"
              }}
            >
              {formatAddress(receiveAddress ?? '')}
              <CopyOutlined style={{ lineHeight: ".5rem", margin: "0 0 0 0 " }} />
            </Typography>

          </Grid>
        </Grid>

        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{ marginTop: "1.5rem" }}
        // gap={"1rem"}
        >
          {/* 地址 */}
          <Grid
            item
            xs={5}
            sx={{
              color: "#AFAFAF",
              fontSize: ".875rem",
            }}
          >
            value (uint256) :
          </Grid>
          <Typography
            sx={{
              color: "#000000",
              fontWeight: "400",
              textAlign: "right",
              fontSize: ".875rem",
              // marginRight: "1.5rem"
            }}
          >
            {amount}
          </Typography>
        </Grid>

        <Grid
          container
          justifyContent={"flex-end"}
          onClick={() => { setIsDetail(!isDetail) }}
          sx={{
            fontSize: ".875rem",
            color: "#C5C5C5",
          }}
        >
          Advanced Details
        </Grid>

        {
          isDetail
            ? <>
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{ marginTop: "1.5rem" }}
              // gap={"1rem"}
              >
                {/* 地址 */}
                <Grid
                  item
                  xs={5}
                  sx={{
                    color: "#AFAFAF",
                    fontSize: ".875rem",
                  }}
                >
                  Raw Data :
                </Grid>
                <Grid
                  container
                  xs={7}
                  flexDirection={"column"}
                  alignItems={"flex-end"}
                  item >
                  <Typography
                    sx={{
                      color: "#000000",
                      fontWeight: "400",
                      textAlign: "right",
                      fontSize: ".875rem",
                      // marginRight: "1.5rem"
                    }}
                  >
                    {formatAddress(raw ?? "")}
                  </Typography>
                </Grid>
              </Grid>


            </>
            : <></>
        }
      </Grid>

      <Grid
        container
        item
        sx={{
          minHeight: "3.5rem",
          padding: "1rem 1.375rem",
          borderRadius: "12px",
          background: "#FFFFFF",
          marginTop: ".625rem"
        }}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Grid
          item
          sx={{
            color: "#AFAFAF",
            fontSize: "1rem",
          }}
        >
          Balance change :
        </Grid>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: "500",
            textAlign: "right",
            fontSize: "1.125rem",
            // marginRight: "1.5rem"
          }}
        >
          {(coinInfo?.balance - amount).toFixed(3)} ETH
        </Typography>

      </Grid>







      {/* 是签名 还是签名或者执行  根据是否是最后一个人判断 */}
      {
        1
          ? <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
            <LoadingButton
              onClick={() => { router.back() }}
              variant="contained"
              sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
              style={{ backgroundColor: "#D9F19C", color: "#000000" }}
            >
              返回
            </LoadingButton>
            <LoadingButton
              onClick={() => { NextStep() }}
              variant="contained"
              sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
              style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
            >
              提交
            </LoadingButton>
          </Grid>
          : <></>
      }



    </Box>
  )
}

export default SendCoinInfo