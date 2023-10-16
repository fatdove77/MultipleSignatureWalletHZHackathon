import React, { useEffect, useState } from 'react';
import { Box, Grid, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, Divider, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import Link from 'next/link';
import { useRouter } from 'next/router';
import copy from 'copy-to-clipboard';
export default function ConfirmInfo(props: any) {
  const router = useRouter();
  const NextConfirm = () => {
    try {
      const data = {
        signType: props?.signType??"",
        ownerArr: props?.ownerArr??"",
        door: props?.door??"",
        weight: props?.weight??""
      }
      localStorage.setItem("isTrade", "false");
      localStorage.setItem("isSuccess", "false");
      localStorage.setItem("isFail", "false");
      localStorage.setItem("preAddress", "");
      localStorage.setItem('walletName', props?.walletName??"");
      localStorage.setItem("nowAccount", JSON.stringify(data))
      router.push('/Home/ConfirmTradeProcess');
    } catch (error) {

    }


  }

  useEffect(() => {
    props?.ForecastGas()
  }, [])

  return (
    <Box sx={{ marginTop: "1.5rem", backgroundColor: "#fff", height: "77.22vh", padding: "1rem", borderRadius: "18px 18px 0px 0px" }}>
      <Grid sx={{
        fontSize: "1.125rem",
        fontWeight: "500",
        lineHeight: "26px",
        letterSpacing: "0px",
        marginBottom: ".625rem"
      }}>③ 确认</Grid>
      <Divider variant="middle"></Divider>
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ marginTop: "1.56rem" }}
        flexDirection={'column'}
      >
        <Grid
          item
          container
          sx={{
            width: "100%",
            padding: "1.375rem 1.125rem",
            backgroundColor: "#F9FDF2",
            borderRadius: ".5rem",
            marginBottom: "1rem"
          }}
          gap={"10px"}
          flexDirection={'column'}
        >
          <Typography
            sx={{ color: "#9F9F9F", fontWeight: "350", textAlign: "center", fontSize: ".75rem" }}>
            您即将创建一个新的安全帐户，并且必须使用连接的钱包确认交易
          </Typography>
          <Grid>
            <Divider variant="middle" />
          </Grid>

          <Grid
            container
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Grid item xs={5}>网络</Grid>
            <Typography
              sx={{ color: "#555555", fontWeight: "400", textAlign: "center", fontSize: ".875rem" }}>
              ETH Chain
            </Typography>
          </Grid>

          <Grid
            container
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Grid item xs={5}>名称 </Grid>
            <Typography
              sx={{ color: "#555555", fontWeight: "400", textAlign: "center", fontSize: ".875rem" }}>
              {props?.walletName??""}
            </Typography>
          </Grid>

          <Grid
            container
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Grid item xs={5}>创建者</Grid>
            <Typography
              sx={{ color: "#555555", fontWeight: "400", textAlign: "center", fontSize: ".875rem" }}>
              {props?.ownerArr?.length&&props?.ownerArr[0]?.name}
            </Typography>
          </Grid>

          <Grid
            container
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Grid item xs={5}>门槛</Grid>
            {
              props?.signType === 0
                ? <Typography
                  sx={{ color: "#555555", fontWeight: "400", textAlign: "center", fontSize: ".875rem" }}>
                  {props?.door??""} out of {props?.ownerArr?.length??""}
                </Typography>
                : <Typography
                  sx={{ color: "#555555", fontWeight: "400", textAlign: "center", fontSize: ".875rem" }}>
                  权重 ≥ {props?.weight??""}
                </Typography>
            }

          </Grid>
          <Divider sx={{ marginTop: "1rem" }} variant="middle" />
          <Grid item xs={7}>预估gas费 ≈ {props?.gasFee??""} eth</Grid>
        </Grid>

        <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
          <LoadingButton
            onClick={() => { props?.BackStep() }}
            variant="contained"
            sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
            style={{ backgroundColor: "#D9F19C", color: "#000000" }}
          >
            返回
          </LoadingButton>
          <LoadingButton
            onClick={() => { NextConfirm() }}
            variant="contained"
            sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
            style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
          >
            下一步

          </LoadingButton>
        </Grid>
      </Grid>
    </Box >

  );
}
