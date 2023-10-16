import React, { useState,useEffect } from 'react';
import {
  Box,
  Grid,
  Divider,
  Typography,
} from '@mui/material'
import {
  LeftOutlined,
  TeamOutlined, 
   CopyOutlined

} from '@ant-design/icons';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/router';
import useWallet from '@/hooks/useWallet';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import { GetLatestNonce, CreateNewTransaction } from '@/request/api';
import { formatAddress } from '@/utils/utils';
import dayjs from 'dayjs';
import TransferInfo from '@/store/TransferInfo';
import { useCheckOwner } from '@/hooks/useCheckOwner';
import Coin from '@/store/Coin';
import { useThrottle } from '@/utils/hooks';
export default function DeleteConfirm(props: any) {
  const router = useRouter();
  const { walletInfo } = useWallet.useContainer();
  const [nonce, setNonce] = useState<number>();
  const [raw, setRaw] = useState<any>();
  const {SaveUpdateTransInfo,transferInfo} = TransferInfo.useContainer();
  const { CheckOwner } = useCheckOwner();
  const {coinList,InitCoinList} = Coin.useContainer()
  //计算rawdata
  const GetRawData = async () => {
    let nonce;
    try {
      await GetLatestNonce(walletInfo?.address).then((res) => {
        console.log("当前nonce:", res.data);

        nonce = res.data.nonce;
        setNonce(res.data.nonce)
      });
    } catch (error) {
      console.log("获取nonce出错", error);
    }

    const transaction = {
      // to: receiveAddress ?? "",
      // value: ethers.utils.parseEther(amount.toString()), // 转账金额（以太为单位）
      gasLimit: 100 * 1e6, // Gas 限制
      nonce: nonce, // 交易序号
    };
    const serializedTransaction = ethers.utils.serializeTransaction(transaction);
    setRaw(serializedTransaction);

  }

  useEffect(() => {
    if (walletInfo?.address) {
      InitCoinList()
      GetRawData();
    }
  }, [walletInfo])


  const NavigateDeleteProcess =  useThrottle(async() => {
    //存储transferInfo
    let time = dayjs().format('YYYY-MM-DD HH:mm:ss');
    console.log(walletInfo);
    let temp_deleteOwner = JSON.parse((router?.query?.deleteOwner) as string ?? "[]");
    console.log("😪😪😪",temp_deleteOwner);
    let temp_transferInfo = {
      walletInfo: walletInfo,
      deleteIndex:parseInt((router.query?.deleteIndex)as string??undefined),
      deleteOwner:temp_deleteOwner,//存放删除之后更改过权重的的数组
      createTime:time,
      nonce:nonce??0
    }
    SaveUpdateTransInfo(temp_transferInfo);
    console.log(transferInfo);
    //发起新事务
    if (temp_transferInfo&&raw) {
      await CheckOwner(temp_transferInfo).then(async(res: any) => {
        if (res) {
          console.log(walletInfo?.address, nonce ?? 0, "踢除成员", JSON.stringify(temp_transferInfo));
          await CreateNewTransaction(walletInfo?.address, nonce ?? 0, "踢除成员", JSON.stringify(temp_transferInfo))
          //我需要把所有都存在缓存中
          router.push('DeleteOwnerProcess')
        }
        else {
          toast.error("用户不在多签内")
        }
      })
    }
    console.log(temp_transferInfo);
  },5000) 


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: "93.5vh" }}>
      <Grid
        sx={{ padding: "1rem", }}
        onClick={() => { router.push('/Wallet/Setting') }}
        container
        alignItems={'center'}
      ><LeftOutlined style={{ marginRight: ".3rem" }} />删除拥有者确认</Grid>
      <Grid
        container
        item
        sx={{
          flexGrow: 10,
          padding: "1rem",
          borderRadius: "12px 12px 0 0 ",
          background: "#FFFFFF"
        }}
        flexDirection={"column"}
      >

        {/* 交易确认数 */}
        <Typography
          sx={{
            color: "#272727",
            fontWeight: "400",
            textAlign: "left",
            fontSize: "1rem",
            marginTop: "1rem"
          }}
        >
          交易确认数
        </Typography>
        <Grid
          container
          item
          sx={{
            minHeight: "3.125rem",
            padding: ".4rem 1rem",
            borderRadius: "12px",
            background: "rgba(244, 244, 244, 0.58)",
            marginTop: "1rem"
          }}
          flexDirection={"column"}
        >
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{ marginTop: ".5rem" }}
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
              <TeamOutlined style={{ fontSize: ".825rem", color: "#8F8F8F", marginRight: ".5rem" }} />

              {
                walletInfo?.data?.signType === 0 
                  ? <> {`${walletInfo?.data?.door} out of ${walletInfo?.data?.ownerArr?.length} owner(s)`}</> 
                  : <> ≥ {walletInfo?.data?.weight}% 通过</>
              }
            </Typography>
          </Grid>
        </Grid>

        {/* 交易信息 */}
        <Typography
          sx={{
            color: "#272727",
            fontWeight: "400",
            textAlign: "left",
            fontSize: "1rem",
            marginTop: "1rem"
          }}
        >
          删除信息
        </Typography>
        <Grid
          item
          container
          sx={{
            width: "100%",
            padding: ".625rem 1.375rem",
            borderRadius: ".75rem",
            marginTop: ".625rem",
            backgroundColor: "#F9FDF2"
          }}
          flexDirection={'column'}
          alignItems={"space-between"}
        >
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
              删除用户 :
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
                {walletInfo?.data?.ownerArr[(router?.query?.deleteIndex)as string]?.name}
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
                {formatAddress(walletInfo?.data?.ownerArr[(router?.query?.deleteIndex)as string]?.address??"")}
                <CopyOutlined style={{ lineHeight: ".5rem", margin: "0 0 0 0 " }} />
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ margin: "1rem 0" }}></Divider>
          <Grid
            container
            justifyContent={"flex"}
            sx={{
              fontSize: ".875rem",
              color: "#000000",
            }}
          >
            信息
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
              Raw Data :
            </Grid>
            <Grid
              container
              xs={4}
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
        </Grid>
        <Grid
          container
          item
          sx={{
            minHeight: "3.5rem",
            padding: "1rem 1.375rem",
            borderRadius: "12px",
            background: "#F9FDF2",
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
            {coinList[0]?.balance} ETH
          </Typography>
        </Grid>

        <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
          <LoadingButton
            onClick={() => { router.push("/Wallet/Setting") }}
            variant="contained"
            sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
            style={{ backgroundColor: "#D9F19C", color: "#000000" }}
          >
            返回
          </LoadingButton>
          <LoadingButton
            onClick={() => {NavigateDeleteProcess()}}
            variant="contained"
            sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
            style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
          >
            提交并签名
          </LoadingButton>
        </Grid>
      </Grid>
    </Box >
  )
}
