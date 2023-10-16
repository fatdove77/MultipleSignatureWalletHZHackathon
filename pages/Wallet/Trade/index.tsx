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
  PlusCircleOutlined,
  PlusOutlined,
  DownloadOutlined,
  DownOutlined,
  CopyOutlined,
  UpOutlined,
  EyeOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  UpCircleFilled,
  RollbackOutlined,
  RightCircleFilled,
  CloseCircleFilled,
  LeftOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import logo from '@/public/建国.jpg'
import Image from 'next/image';
import { CssTextField } from '@/component/CssComponent';
import { useTradeHistory } from '@/hooks/useTradeHistory';
import { useTradeList } from '@/hooks/useTradeList';
import copy from 'copy-to-clipboard';
import useWallet from '@/hooks/useWallet'
import TransferInfo from '@/store/TransferInfo';
import { Spin } from 'antd';
function SendCoin() {
  const router = useRouter();
  const {
    listLoading,
    tradeList,
    signArr,
    WithdrawTrade
  } = useTradeList();
  const { tradeHistoryList, historyLoading } = useTradeHistory();
  const {
    walletInfo,
    walletInfoLoading,
    UpdateBalance,
  } = useWallet.useContainer();
  const [isQueue, setIsQueue] = useState(false); //是否是队列 
  const { NavigateTransferInfo } = TransferInfo.useContainer();
  // const tradeList = [1, 2, 3, 4]; //模拟交易队列数组
  const activeStyle = {
    backgroundColor: "#D9F19C"
  }
  const inActiveStyle = {
    backgroundColor: "#EAF1DF"
  }


  const NavigateTrade = (index: any) => {
    //更新最新的钱包信息
    let transferInfo = JSON.parse(tradeList[index]?.Content ?? "{}");
    transferInfo.walletInfo = walletInfo;
    console.log(transferInfo);
    NavigateTransferInfo(transferInfo);
    if (tradeList[index]?.IsModified === 1) {
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
  }

  const NavigateHistory = (index: any) => {
    let temp_transferInfo = JSON.parse(tradeHistoryList[index]?.Content ?? "{}");
    // transferInfo.walletInfo = walletInfo;
    console.log(temp_transferInfo);
    NavigateTransferInfo(temp_transferInfo);
    if (tradeHistoryList[index]?.IsModified === 1) {
      router.push("/Wallet/WithdrawProcess");
      return;
    }
    if (tradeHistoryList[index]?.TransactionType === "转账交易") {
      // localStorage.setItem("transferInfo", JSON.stringify(transferInfo));
      router.push("/Wallet/InitiateTrade/TradeHistory")
    }
    else if (tradeHistoryList[index]?.TransactionType === "修改门限值" || tradeHistoryList[index]?.TransactionType === "修改权重门限值") {
      router.push("/Wallet/Setting/UpdateThresholdProcess")
    }
    else if (tradeHistoryList[index]?.TransactionType === "添加成员") {
      router.push("/Wallet/Setting/AddOwnerProcess");
    }
    else if (tradeHistoryList[index]?.TransactionType === "修改权重值") {
      router.push("/Wallet/Setting/UpdateOwnerWeightProcess");
    }
    else if (tradeHistoryList[index]?.TransactionType === "踢除成员") {
      router.push("/Wallet/Setting/DeleteOwnerProcess");
    }
    else if (tradeHistoryList[index]?.TransactionType === "替换成员") {
      router.push("/Wallet/Setting/SwitchOwnerProcess");
    }
  }

  return (
    <Box
      sx={{ padding: "1rem" }}
    >
      <Grid
        sx={{ paddingBottom: "1rem" }}
        onClick={() => { router.push("/Wallet") }}
        container
        alignItems={'center'}
      ><LeftOutlined style={{ marginRight: ".3rem" }} />交易</Grid>
      <Grid
        container
        sx={{ marginBottom: "3rem" }}
      >
        <LoadingButton
          onClick={() => { setIsQueue(true) }}
          variant="contained"
          sx={{ width: "5rem", height: "1.75rem", borderRadius: ".5rem", }}
          style={Object.assign({}, { color: "#000000" }, isQueue ? activeStyle : inActiveStyle)}
        >
          队列
        </LoadingButton>
        <LoadingButton
          onClick={() => { setIsQueue(false) }}
          variant="contained"
          sx={{ width: "5rem", height: "1.75rem", borderRadius: ".5rem", marginLeft: "2rem" }}
          style={Object.assign({}, { color: "#000000" }, isQueue ? inActiveStyle : activeStyle)}
        >
          历史
        </LoadingButton>
      </Grid>
      <Grid
        container
        gap={"10px"}
        flexDirection={"column"}
      >
        {
          // 队列和钱包首页一样 
          isQueue
            ?
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
            :
            historyLoading
              ? <Spin></Spin>
              : tradeHistoryList && tradeHistoryList.map((item, index) => {
                return (
                  // 每个单元 大盒子
                  <Grid
                    key={index}
                    container
                    flexDirection={"column"}
                    sx={{
                      height: "6rem",
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
                        <UpCircleFilled style={{ color: "#4D9623", lineHeight: ".5rem", marginRight: ".5rem" }} />
                        {item?.TransactionType}
                      </Typography>
                      {
                        item?.IsModified
                          ? <Typography
                            sx={{
                              color: "#D6432D",
                              fontWeight: "350",
                              textAlign: "center",
                              fontSize: ".625rem",
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "1.3125rem",
                              backgroundColor: "#FCEDED",
                              padding: "0 .5rem",
                              height: "1.375rem",
                              margin: "0 .5rem 0  1rem"
                            }}
                          >
                            撤销
                          </Typography>
                          : <Typography
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
                            成功
                          </Typography>
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
                            >
                              {item?.info}
                            </Typography>
                        }
                        <Typography
                          sx={{
                            color: "#8F8F8F",
                            fontWeight: "400",
                            textAlign: "center",
                            fontSize: ".75rem",
                            display: "flex",
                            alignItems: "center",
                            lineHeight: ".75rem",
                          }}
                        >
                          {dayjs().format('YYYY-MM-DD HH:mm')}
                        </Typography>
                        <RightCircleFilled onClick={() => { NavigateHistory(index) }} style={{ fontSize: "1.5rem", color: "rgba(5, 5, 5, 0.76)" }} />
                      </Grid>
                    </Grid>
                  </Grid>
                )
              })

        }
        {

        }

      </Grid>
    </Box>
  )
}

export default SendCoin