import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { LinearProgress, StepContent, Button, Typography, Box, Grid, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, Divider, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import { useCreateAccount } from '@/hooks/useCreateAccount';

import Image from 'next/image';
import file from '@/public/file.png'
import {
  UserOutlined,
  SafetyCertificateOutlined,
  FileSearchOutlined,
  ScheduleOutlined,
  CopyOutlined,
  CloseOutlined,
  CheckOutlined
} from '@ant-design/icons'
import Link from 'next/link';
import Web3Provider from '@/store/Web3Provider';
import { useFactoryContract } from '@/hooks/useFactoryContract';
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    // top: "1.4rem",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      // backgroundImage:
      //   '#4D9623',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        '#4D9623',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    width: "1px",
    height: "2.75rem"

  },
}));


//步骤图标样式
const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed ? "#4D9623" : '#BFBFBF', //步骤背景
  zIndex: 1,
  color: ownerState.active ? "#fff" : '#fff',  //步骤数字
  width: "1.1rem",
  height: "1.1rem",
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: "12px",
  ...(ownerState.completed && {
    backgroundImage:
      '#4D9623',
    // color:"fff"
    // boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      '#4D9623',
  }),
}));


//设置图标
function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <Grid container justifyContent={'center'} alignItems={'center'}><UserOutlined /></Grid>,
    2: <Grid container justifyContent={'center'} alignItems={'center'}><SafetyCertificateOutlined /></Grid>,
    3: <Grid container justifyContent={'center'} alignItems={'center'}><FileSearchOutlined /></Grid>,
    4: <ScheduleOutlined />
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}


//设置文案
function ConfirmTradeProcess() {
  const router = useRouter();
  const {
    steps,
    process,
    stepNumber,
    data,
    success,
    fail,
    saltNonce,
    GetSaltNonce,
    PredictMultiAddress,
    CreateDoorWallet,
    CreateWeightWallet,
  } = useFactoryContract();
  const { provider } = Web3Provider.useContainer();
  let isTrade: boolean;
  if (typeof window !== 'undefined') {
    isTrade = localStorage.getItem("isTrade") == 'true' ? true : false;
  }

  useEffect(() => {
    const fetchData = async () => {
      await GetSaltNonce();
      if (saltNonce != undefined) {
        await PredictMultiAddress()
      }
      if (provider && saltNonce != undefined && !fail) {
        if (data.signType === 0) {
          CreateDoorWallet();
        }
        else {
          console.log("创建权重钱包");
          CreateWeightWallet();
        }
      }
    }
    if (!isTrade) {
      fetchData();
    }

  }, [provider, saltNonce])



  return (
    <>
      <Box sx={{ width: '100%', padding: "1rem 1rem" }} >
        <Grid>确认交易</Grid>
        <Box sx={{
          marginTop: "1.5rem",
          backgroundColor: "#fff",
          height: "29.8125rem",
          padding: "1rem",
          borderRadius: ".5rem"
        }}
        >
          <Grid
            container
            sx={{ width: "100%" }}
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}

          >
            {
              fail ? <CloseOutlined style={{ fontSize: "3.5rem", color: "red" }} />
                : success
                  ? <CheckOutlined style={{ fontSize: "3.5rem", color: "#4D9623" }} />
                  : <Image alt='' src={file} style={{ width: "3.5rem" }} ></Image>
            }

            <LinearProgress
              sx={{ width: "100%", margin: "1rem 0 " }}
              variant="determinate"
              color="inherit"
              value={process}
            />
            {
              fail
                ? <Typography sx={{ color: "#000000", fontWeight: "500", textAlign: "center", fontSize: "1rem" }}>多签钱包创建失败</Typography>
                : success
                  ? <><Typography sx={{ color: "#000000", fontWeight: "500", textAlign: "center", fontSize: "1rem" }}>多签钱包创建成功</Typography></>
                  : <>
                    <Typography sx={{ color: "#000000", fontWeight: "500", textAlign: "center", fontSize: "1rem" }}>正在创建多签钱包</Typography>
                    <Typography sx={{ color: "#9F9F9F", fontWeight: "350", textAlign: "center", fontSize: ".75rem" }}>请等待</Typography>
                  </>
            }


          </Grid>
          <Divider sx={{ marginTop: "1rem" }} variant="middle"></Divider>

          <Stepper activeStep={stepNumber} orientation="vertical" connector={<ColorlibConnector />}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  sx={{ color: "black" }}
                  StepIconComponent={ColorlibStepIcon}
                >
                  <Grid sx={{ position: "absolute" }}>
                    <Typography sx={{ position: "relative", bottom: ".8rem" }}>{step.label}</Typography>
                    <Typography
                      sx={{
                        position: "relative",
                        bottom: ".8rem",
                        fontSize: ".75rem",
                        fontWeight: "350",
                        color: "#555555",
                        display: "flex",
                        alignItems: "center"
                      }}>
                      {step.description}
                      {step.description ? <CopyOutlined  onClick={()=>{copy(step.description)}}  /> : <></>}
                    </Typography>
                  </Grid>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box >
        <Grid
          container
          alignItems={'center'}
          flexDirection={'column'}
        >
          <LoadingButton
            onClick = {()=>{router.push("/")}}
            variant="contained"
            sx={{ width: "15.9rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "1rem" ,color:"white"}}
            style={{ backgroundColor: " rgba(5, 5, 5, 0.76)" }}
          >
            返回主页
          </LoadingButton>
        </Grid>
      </Box>
    </>
  )
}

export default ConfirmTradeProcess