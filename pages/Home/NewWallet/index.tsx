import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { Box, Grid } from '@mui/material';
import { LeftOutlined } from '@ant-design/icons'
import LoadingButton from '@mui/lab/LoadingButton';
import CreateAccount from './CreateAccount';
import CreateUser from './CreateUser';
import ConfirmInfo from './ConfirmInfo';
import  {useCreateAccount}  from '@/hooks/useCreateAccount';
import { useRouter } from 'next/router';

//连接线
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: "1.4rem",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        '#4D9623',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        '#4D9623',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 1,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? '#4D9623' : '#4D9623',
    borderRadius: 1,

  },
}));


//步骤图标样式
const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active ? "#4D9623" : '#FFFFFF', //步骤背景
  zIndex: 1,
  color: ownerState.active ? "#fff" : '#4D9623',  //步骤数字
  width: "1rem",
  height: "1rem",
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: "12px",
  ...(ownerState.active && {
    backgroundImage:
      '#4D9623',
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
    1: <Grid container justifyContent={'center'} sx={{ fontSize: ".5rem" }}>1</Grid>,
    2: <Grid container justifyContent={'center'} sx={{ fontSize: ".5rem" }}>2</Grid>,
    3: <Grid container justifyContent={'center'} sx={{ fontSize: ".5rem" }}>3</Grid>,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}


//设置文案
const steps = ['创建多签钱包', '创建用户信息', '信息确认'];
export default function NewWallet() {
  const router = useRouter();
  const [stepNum, setStepNum] = useState<number>(0);

  //step 2 hook
  const {
    signType,
    ownerArr,
    walletName,
    door,
    weight,
    gasFee,
    setDoor,
    setWeight,
    setWalletName,
    HandleChangeSignType,
    DelUser,
    AddUser,
    HandleChangeOwnerName,
    HandleChangeOwnerAddress,
    HandleChangeOwnerWeight,
    ForecastGas
  } = useCreateAccount()

  const NextStep = () => {
    setStepNum(stepNum + 1);
  }
  const BackStep = () => {
    if (stepNum === 0) {
      router.push("/")
    }
    setStepNum(stepNum - 1)
  }

  // const 


  return (
    <>
      <Box sx={{ width: '100%', padding: "0rem 1rem", marginTop: "1rem" }} >
        <Grid
          sx={{ paddingBottom: "1rem" }}
          onClick={() => { BackStep() }}
          container
          alignItems={'center'}
        ><LeftOutlined style={{ marginRight: ".3rem" }} />
          {steps[stepNum]}
        </Grid>
        <Stepper alternativeLabel activeStep={stepNum} connector={<ColorlibConnector />}>
          {steps.map((label) => (
            <Step key={label} sx={{ fontSize: "12px" }}>
              <StepLabel sx={{ marginTop: "1rem", fontSize: "12px", color: "#4D9623" }} StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {
        stepNum === 0
          ? <CreateAccount
            NextStep={NextStep}
            walletName={walletName}
            setWalletName={setWalletName}
          />
          : stepNum === 1
            ? <CreateUser
              signType={signType}
              BackStep={BackStep}
              NextStep={NextStep}
              ownerArr={ownerArr}
              door={door}
              weight = {weight}
              setWeight = {setWeight}
              setDoor={setDoor}
              HandleChangeSignType={HandleChangeSignType}
              DelUser={DelUser}
              AddUser={AddUser}
              HandleChangeOwnerName={HandleChangeOwnerName}
              HandleChangeOwnerAddress={HandleChangeOwnerAddress}
              HandleChangeOwnerWeight={HandleChangeOwnerWeight}
            />
            : <ConfirmInfo
              BackStep={BackStep}
              NextStep={NextStep}
              walletName={walletName}
              ownerArr={ownerArr}
              signType={signType}
              door={door}
              weight = {weight}
              gasFee = {gasFee}
              ForecastGas = {ForecastGas}
            />
      }
    </>

  );
}
