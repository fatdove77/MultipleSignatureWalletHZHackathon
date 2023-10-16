import Web3Provider from '@/store/Web3Provider'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Grid,
  Badge,
  Typography,
  Divider
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import {
  CopyOutlined,
  EyeOutlined,
  TeamOutlined,
  UpCircleFilled,
  RollbackOutlined,
  RightCircleFilled,
  CloseCircleFilled
} from '@ant-design/icons';
import { formatAddress } from '@/utils/utils';
import Image from 'next/image';
import logo from '@/public/建国.jpg'
import { useRouter } from 'next/router';
import useWallet from '@/hooks/useWallet'
import { Spin } from 'antd';
import Coin from '@/store/Coin';
import { useTradeList } from '@/hooks/useTradeList';
import TransferInfo from '@/store/TransferInfo';
import copy from 'copy-to-clipboard';
import { PullToRefresh, List } from 'antd-mobile'
import { PullStatus } from 'antd-mobile/es/components/pull-to-refresh'
function Wallet() {
  const {
    walletInfo,
    walletInfoLoading,
    UpdateBalance,
  } = useWallet.useContainer();
  const { InitCoinList } = Coin.useContainer();
  const { provider } = Web3Provider.useContainer();
  const { NavigateTransferInfo } = TransferInfo.useContainer();
  const {
    listLoading,
    tradeList,
    signArr,
    WithdrawTrade
  } = useTradeList();
  const router = useRouter();
  const NavigateAsset = async () => {
    await InitCoinList();
    router.push({ pathname: "Wallet/Assets", })
  }

  const NavigateTrade = (index: any) => {
    let transferInfo = JSON.parse(tradeList[index]?.Content ?? "{}");
    transferInfo.walletInfo = walletInfo;
    console.log(transferInfo);
    NavigateTransferInfo(transferInfo);
    if (tradeList[index]?.IsModified >= 1) {
      router.push("/Wallet/WithdrawProcess");
      return;
    }
    if (tradeList[index]?.TransactionType === "转账交易") {
      // localStorage.setItem("transferInfo", JSON.stringify(transferInfo));
      router.push("/Wallet/InitiateTrade/TradeHistory")
    }
    else if (tradeList[index]?.TransactionType === "修改门限值" || tradeList[index]?.TransactionType === "修改权重门限值") {
      router.push("/Wallet/Setting/UpdateThresholdProcess")
    }
    else if (tradeList[index]?.TransactionType === "添加成员") {
      router.push("/Wallet/Setting/AddOwnerProcess");
    }
    else if (tradeList[index]?.TransactionType === "修改权重值") {
      router.push("/Wallet/Setting/UpdateOwnerWeightProcess");
    }
    else if (tradeList[index]?.TransactionType === "踢除成员") {
      router.push("/Wallet/Setting/DeleteOwnerProcess");
    }
    else if (tradeList[index]?.TransactionType === "替换成员") {
      router.push("/Wallet/Setting/SwitchOwnerProcess");
    }
    else if (tradeList[index]?.TransactionType === "调用合约") {
      router.push("/Wallet/InitiateTrade/CallContractProcess");
    }
  }


  useEffect(() => {
    UpdateBalance();
    InitCoinList()
  }, [provider])





  return (
    < PullToRefresh
      onRefresh = {async()=>{
        await UpdateBalance()
      }}
    >
      <Box sx={{ padding: " 1rem",
    }}>

        <Grid
          container
          sx={{
            height: "13.4375rem",
            padding: "1rem 1.5625rem",
            borderRadius: ".75rem",
            background: "rgba(5, 5, 5, 0.76)"
          }}
          flexDirection={"column"}
          justifyContent={"start"}
          alignItems={"space-around"}
          gap={".2rem"}
        >
          {
            walletInfoLoading
              ? <Grid container sx={{ height: "100" }} alignItems="center" justifyContent="center">
                <Spin></Spin>
              </Grid>
              : <>
                <Grid
                  container
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Badge badgeContent={walletInfo?.data.signType === 0 ? `${walletInfo?.data.door}/${walletInfo?.data.ownerArr.length}` : `${walletInfo?.data.weight}%`} overlap="circular" color="primary" >
                    <Image alt="" src={walletInfo?.img} width={50} height={50} style={{ width: "3rem", height: "3rem" }}></Image>
                  </Badge>
                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: "500",
                      textAlign: "center",
                      fontSize: "1.125rem",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    ETH Chain
                  </Typography>
                </Grid>
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: "normal",
                    textAlign: "center",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {walletInfo?.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#A1A1A1",
                    fontWeight: "400",
                    textAlign: "center",
                    fontSize: ".75rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  fbc:{formatAddress(walletInfo?.address ?? '')}
                  <CopyOutlined onClick={() => { copy(walletInfo?.address) }} style={{ lineHeight: ".5rem" }} />
                </Typography>
                <Grid>
                  <Grid
                    sx={{
                      color: "#A1A1A1",
                      fontWeight: "400",
                      textAlign: "center",
                      fontSize: ".75rem",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    ETH余额：
                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: "500",
                        textAlign: "center",
                        fontSize: "1.125rem",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {walletInfo?.balance}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  justifyContent={"center"}
                >
                  <LoadingButton
                    variant="contained"
                    onClick={() => {
                      NavigateAsset()
                    }}
                    sx={{
                      color: "#000000",
                      width: "15.9rem",
                      height: "2.31rem",
                      borderRadius: "1.125rem",
                      marginTop: ".8rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                    style={{ backgroundColor: "#D9F19C" }}
                  >
                    <EyeOutlined style={{ marginRight: ".5rem" }} />
                    查看资产
                  </LoadingButton>
                </Grid>

              </>
          }

        </Grid>
        <Grid sx={{ marginTop: "1.25rem" }}>交易队列</Grid>
        <Grid
          sx={{ marginTop: ".5rem" }}
          container
          flexDirection={"column"}
          gap={".625rem"}
        >
          {
            listLoading
              ? <Spin></Spin>
              : tradeList && tradeList.map((item: any, index: number) => {
                return (
                  // 每个单元 大盒子
                  <Grid
                    key={index}
                    container
                    flexDirection={"column"}
                    sx={{
                      height: "7.4435rem",
                      padding: ".625rem 1rem ",
                      borderRadius: ".75rem",
                      background: "#FFFFFF"
                    }}
                  >
                    <Grid
                      container
                      // justifyContent={"space-between"}
                      sx={{ height: "1.5rem" }}
                    >
                      <Grid
                        sx={{
                          color: "#000000",
                          fontWeight: "350",
                          textAlign: "center",
                          fontSize: ".75rem",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <TeamOutlined style={{ lineHeight: ".5rem" }} />
                        {
                          JSON.parse(item?.Content ?? "{}")?.walletInfo?.data?.signType === 0
                            ? `${signArr[index]?.signNumber ?? ""} / ${JSON.parse(item?.Content ?? "{}")?.walletInfo?.data?.ownerArr?.length}`
                            : `${signArr[index]?.signNumber} / ${JSON.parse(item?.Content ?? "{}")?.walletInfo?.data?.weight}`
                        }
                      </Grid>
                      {/* <Typography
                      sx={{
                        color: "#4D9623",
                        fontWeight: "350",
                        textAlign: "center",
                        fontSize: ".625rem",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "1.3125rem",
                        backgroundColor: "#EDF7E5",
                        padding: "0 .5rem",
                        height: "1.375rem",
                        margin: "0 .5rem 0  1rem"
                      }}
                    >
                      签名已完成
                    </Typography> */}
                      {
                        signArr[index]?.flag === true
                          ? <Typography
                            sx={{
                              color: "#D09623",
                              fontWeight: "350",
                              textAlign: "center",
                              fontSize: ".625rem",
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "1.3125rem",
                              backgroundColor: "#F7F4E5",
                              padding: "0 .5rem",
                              height: "1.375rem",
                              margin: "0 .5rem 0  1rem"
                            }}
                          >
                            等待执行
                          </Typography>
                          : <></>
                      }

                      <Typography
                        sx={{
                          color: "#000000",
                          fontWeight: "350",
                          textAlign: "center",
                          fontSize: ".75rem",
                          display: "flex",
                          alignItems: "center",
                          position: "absolute",
                          right: "2rem"
                        }}
                      >
                        {item?.Nonce}
                      </Typography>
                    </Grid>
                    <Divider ></Divider>
                    <Grid
                      container
                      justifyContent={"space-between"}
                      sx={{ marginTop: ".5rem" }}
                    >
                      <Typography
                        sx={{
                          color: "#000000",
                          fontWeight: "500",
                          textAlign: "center",
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        {
                          item?.IsModified
                            ? <>
                              <CloseCircleFilled style={{ color: "#FA5A5A", lineHeight: ".5rem", marginRight: ".75rem" }} />
                              {"撤销事务"}
                            </>
                            : <>
                              <UpCircleFilled style={{ color: "#4D9623", lineHeight: ".5rem", marginRight: ".75rem" }} />
                              {item?.TransactionType ?? ""}</>
                        }

                      </Typography>
                      <Grid
                        item
                        xs={6}
                        container
                        gap={"1rem"}
                        justifyContent={"flex-end"}
                      >
                        {
                          item?.TransactionType === "转账交易" || item?.TransactionType === "合约交易" || item?.TransactionType === "撤销"
                            ?
                            <></>
                            : <></>

                        }
                        {
                          !item?.IsModified
                            ? <Typography
                              sx={{
                                color: "#7C7C7C",
                                fontWeight: "500",
                                textAlign: "center",
                                fontSize: ".75rem",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "rgba(241, 241, 241, 0.67)",
                                borderRadius: ".75rem",
                                padding: "0 .5rem",
                              }}
                              onClick={() => {
                                WithdrawTrade(index);
                              }}
                            >
                              <RollbackOutlined
                                style={{ color: "#7C7C7C", lineHeight: ".2rem", marginRight: ".3rem" }}
                              />
                              撤销
                            </Typography>
                            : <></>
                        }
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      justifyContent={"space-between"}
                      sx={{ marginTop: "1rem" }}
                    >
                      <Grid
                        container
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        style={{ height: "1rem" }}
                      >
                        {
                          item?.TransactionType === "转账交易"
                            ? <Typography
                              sx={{
                                color: "#8F8F8F",
                                fontWeight: "400",
                                textAlign: "center",
                                fontSize: ".8rem",
                                display: "flex",
                                alignItems: "center",
                                lineHeight: "1rem"
                              }}
                            >
                              <Image
                                alt=""
                                src={JSON.parse(item?.Content ?? "{}")?.coinInfo?.img}
                                width={30}
                                height={30}
                                style={{ width: ".75rem", height: ".75rem", marginRight: ".5rem" }}
                              />
                              {`发送${JSON.parse(item?.Content ?? "{}")?.amount}${JSON.parse(item?.Content ?? "{}")?.coinInfo?.name}`}
                            </Typography>
                            : <Typography
                              sx={{
                                color: "#8F8F8F",
                                fontWeight: "400",
                                textAlign: "center",
                                fontSize: ".8rem",
                                display: "flex",
                                alignItems: "center",
                                lineHeight: "1rem"
                              }}
                            >{
                                item?.info
                              }
                            </Typography>
                        }
                        <RightCircleFilled
                          onClick={() => { NavigateTrade(index) }}
                          style={{ fontSize: "1.5rem", color: "rgba(5, 5, 5, 0.76)" }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )
              })
          }
        </Grid>
        <Grid sx={{ height: "3rem" }}></Grid>
      </Box>
    </PullToRefresh>
  )
}

export default Wallet