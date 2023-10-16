import React from 'react'
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
  TeamOutlined,
  CheckOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  CloseCircleFilled,
  ExclamationCircleFilled,
  CopyOutlined,
  EyeOutlined,
  HomeOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/建国.jpg'
import Trade from '@/public/trade.png'
import { useRouter } from 'next/router';
import { CssTextField } from '@/component/CssComponent';
import { CssOutlinedInput } from '@/component/CssComponent';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import { StepIconProps } from '@mui/material/StepIcon';
import TransferInfo from '@/store/TransferInfo';
import { formatAddress } from '@/utils/utils';
import { useAddOwnerProcess } from '@/hooks/useAddOwnerProcess';
import { Spin } from 'antd';
function AddOwnerProcess() {
  const { transferInfo } = TransferInfo.useContainer();
  const {
    diffTime,
    steps,
    activeNumber,
    isOwner,
    isSign,
    isExecute,
    isSignAndExecute,
    executeLoading,
    isEqual,
    isFinish,
    listLoading,
    OwnerExeCute,
    OwnerSign,
    OwnerSignAndExecute
  } = useAddOwnerProcess();
  const router = useRouter();
  const flag = true;  //控制是创建还是脸上创建被拒绝

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
      height: "2.75rem",
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
    marginLeft: ".2rem",
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
      1: flag
        ? <Grid
          container
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            backgroundColor: "#4D9623",
            width: "17.6px",
            height: "17.6px",
            borderRadius: "50%",
            lineHeight: "1rem"
          }}><CheckOutlined /></Grid >
        : <Grid
          container
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            backgroundColor: "#FA5A5A",
            width: "17.6px",
            height: "17.6px",
            borderRadius: "50%",
            lineHeight: "1rem"
          }}><CloseOutlined /></Grid >,
      2: completed
        ? <><CheckOutlined /></>
        : <></>,
      3: completed
        ? <><CheckOutlined /></>
        : <></>,
      4: completed
        ? <><CheckOutlined /></>
        : <></>,
      5: completed
        ? <><CheckOutlined /></>
        : <></>,
      6: completed
        ? <><CheckOutlined /></>
        : <></>,
      7: completed
        ? <><CheckOutlined /></>
        : <></>,
      8: completed
        ? <><CheckOutlined /></>
        : <></>,
      9: completed
        ? <><CheckOutlined /></>
        : <></>,
      10: completed
        ? <><CheckOutlined /></>
        : <></>,
      11: completed
        ? <><CheckOutlined /></>
        : <></>,
      12: completed
        ? <><CheckOutlined /></>
        : <></>,
      13: completed
        ? <><CheckOutlined /></>
        : <></>,
      14: completed
        ? <><CheckOutlined /></>
        : <></>,
      15: completed
        ? <><CheckOutlined /></>
        : <></>,
      16: completed
        ? <><CheckOutlined /></>
        : <></>,
      18: completed
        ? <><CheckOutlined /></>
        : <></>,
      19: completed
        ? <><CheckOutlined /></>
        : <></>,
      20: completed
        ? <><CheckOutlined /></>
        : <></>,
      21: completed
        ? <><CheckOutlined /></>
        : <></>,
      22: completed
        ? <><CheckOutlined /></>
        : <></>,
      23: completed
        ? <><CheckOutlined /></>
        : <></>,
      24: completed
        ? <><CheckOutlined /></>
        : <></>,
      25: completed
        ? <><CheckOutlined /></>
        : <></>,
    };

    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }




  return (
    <Box
      sx={{ padding: "1rem" }}
    >
      <Grid
        sx={{ padding: "10px" }}
        onClick={() => { router.push("/Wallet") }}
        container
        alignItems={'center'}
      ><HomeOutlined style={{ marginRight: ".3rem" }} />添加拥有者</Grid>


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
                    fontWeight: "500",
                    textAlign: "center",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <UpCircleFilled style={{ color: "#4D9623", lineHeight: ".5rem", marginRight: ".75rem" }} />
                  添加拥有者
                </Typography>
                : <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: "500",
                    textAlign: "center",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <CloseCircleFilled style={{ color: "#FA5A5A", lineHeight: ".5rem", marginRight: ".75rem" }} />
                  在链上被拒绝
                </Typography>

            }

            <Typography
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
                marginLeft: ".5rem"
              }}
            >
              {diffTime}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: ".8125rem" }}></Divider>
        <Grid
          container
          item
          sx={{
            minHeight: "2.1875rem",
            padding: ".5rem 3rem .5rem .875rem",
            borderRadius: ".5rem",
            background: "rgba(244, 244, 244, 0.58)",
            marginTop: ".875rem"
          }}
          justifyContent={"space-between"}
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
            <TeamOutlined
              style={{
                lineHeight: ".5rem",
                color: "#8F8F8F",
                marginRight: ".625rem"
              }} />
            {
              transferInfo?.walletInfo?.data?.signType === 0
                ? `${transferInfo?.walletInfo?.data?.door} out of ${transferInfo?.walletInfo?.data?.ownerArr?.length}`
                : `权重 ≥ ${transferInfo?.walletInfo?.data?.weight}%`
            }
          </Typography>

          <Typography
            sx={{
              color: "#8F8F8F",
              fontWeight: "350",
              textAlign: "center",
              fontSize: ".75rem",
              display: "flex",
              alignItems: "center",
              marginLeft: ".625rem"
            }}
          >
            需要你的确认
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: ".875rem",
              display: "flex",
              alignItems: "center",
              marginLeft: ".625rem"
            }}>
            <CheckCircleOutlined style={{ color: "#4D9623", }} />
            <CloseCircleOutlined style={{ color: "#FA5A5A", margin: "0 .875rem" }} />
          </Typography>

        </Grid>
        {/* 被拒绝显示提示 or  显示交易信息 */}
        {
          1
            ? <Grid
              container
              item
              sx={{
                minHeight: "4.625rem",
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
                  添加成员地址信息
                </Typography>
              </Grid>
              <Divider sx={{ marginTop: ".3rem", marginBottom: ".3rem" }}></Divider>
              <Grid
                container
                flexDirection={"column"}
              >
                <Grid
                  container
                  alignItems={"center"}
                >
                  <Image
                    src={transferInfo?.updateOwnerArr[0]?.img}
                    width={30}
                    height={30}
                    alt=""
                    style={{
                      width: "1.625rem",
                      height: "1.625rem",
                      margin: "0 .5rem 0 0 ",
                    }} ></Image>

                  <Typography
                    sx={{
                      color: "#000000",
                      fontWeight: "400",
                      textAlign: "left",
                      fontSize: ".75rem",
                      marginRight: ".5rem"
                    }}>
                    名称:{transferInfo?.updateOwnerArr[0]?.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000000",
                      fontWeight: "400",
                      textAlign: "left",
                      fontSize: ".75rem"
                    }}>
                    地址:{formatAddress(transferInfo?.updateOwnerArr[0]?.address ?? "")}
                  </Typography>
                  {
                    transferInfo?.walletInfo?.data?.signType === 0
                      ? <></>
                      : <Typography
                        sx={{
                          color: "#000000",
                          fontWeight: "400",
                          textAlign: "left",
                          fontSize: ".75rem",
                          marginLeft: ".5rem"
                        }}>
                        权重:{transferInfo?.updateOwnerArr[0]?.weight ?? ""}%
                      </Typography>
                  }
                </Grid>
                <Grid
                  container
                  alignItems={"center"}
                >
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
        gap={"10px"}
        flexDirection={'column'}
      >
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item xs={5} sx={{ color: "#AFAFAF", fontSize: ".875rem" }}>nonce : </Grid>
          <Typography
            sx={{
              color: "#555555",
              fontWeight: "400",
              textAlign: "center",
              fontSize: ".875rem"
            }}
          >
            {transferInfo?.nonce}
          </Typography>
        </Grid>

        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item xs={5} sx={{ color: "#AFAFAF", fontSize: ".875rem" }}>创建时间 :</Grid>
          <Typography
            sx={{
              color: "#555555",
              fontWeight: "400",
              textAlign: "center",
              fontSize: ".875rem"
            }}
          >
            {transferInfo?.createTime}
          </Typography>
        </Grid>
      </Grid>


      <Grid
        container
        item
        sx={{
          minHeight: "8.5rem",
          padding: "1rem 1.375rem",
          borderRadius: "12px",
          background: "#FFFFFF",
          marginTop: ".8125rem"
        }}
        flexDirection={"column"}
      // justifyContent={"space-around"}
      // alignItems={"center"}

      >
        <Stepper activeStep={activeNumber} orientation="vertical" connector={<ColorlibConnector />}>
          {steps && steps.map((step: any, index: number) => (
            <Step key={step.label}>
              <StepLabel
                sx={{ color: "black" }}
                StepIconComponent={ColorlibStepIcon}
              >
                <Grid sx={{ position: "absolute" }}>
                  <Grid sx={{ position: "relative", bottom: ".8rem", display: "flex", color: "#000000", }}>
                    {/* //是否显示头像 */}
                    {
                      step.type === 'account'
                        ? <Image
                          src={step?.img}
                          width={30}
                          height={30}
                          alt=""
                          style={{
                            width: "1.625rem",
                            height: "1.625rem",
                            margin: "0 .5rem",
                          }} ></Image>
                        : <></>
                    }
                    {/* //是否显示隐藏按钮 */}
                    {
                      step.type === 'hide'
                        ?
                        <Typography
                          sx={{
                            color: "#4D9623",
                            fontWeight: "400",
                            textAlign: "center",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            marginLeft: ".5rem"
                          }}
                        >
                          {step.label}<EyeOutlined /></Typography>
                        : step.label
                    }

                  </Grid>
                  {/* //显示地址和复制 */}
                  <Typography
                    sx={{
                      position: "relative",
                      bottom: ".8rem",
                      fontSize: ".75rem",
                      fontWeight: "350",
                      color: "#878787",
                      marginLeft: ".5rem",
                      display: "flex",
                      alignItems: "center"
                    }}>
                    {step.type === 'account' ? formatAddress(step?.description) : step.description}
                    {
                      step.type === 'account'
                        ? <><CopyOutlined /></>
                        : <></>
                    }
                  </Typography>
                </Grid>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

      </Grid>



      {
        listLoading
          ? <Grid container justifyContent={"center"}>
            <Spin></Spin>
          </Grid>
          : isOwner
            ? isFinish
              ? <></>
              : isSign
                ? isExecute
                  ? <LoadingButton
                    onClick={() => { OwnerExeCute() }}
                    loading={executeLoading}
                    variant="contained"
                    sx={{ width: "100%", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
                    style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
                  >
                    执行
                  </LoadingButton>
                  : <></>
                : isExecute
                  ?
                  <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
                    <LoadingButton
                      onClick={() => { OwnerExeCute() }}
                      loading={executeLoading}
                      variant="contained"
                      sx={{ width: "100%", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
                      style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
                    >
                      执行
                    </LoadingButton>
                  </Grid>
                  : isSignAndExecute
                    ?
                    <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
                      <LoadingButton
                        loading={executeLoading}
                        onClick={() => { OwnerSign() }}
                        // disabled={isOwner === false ? true : false}
                        variant="contained"
                        sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
                        style={{ backgroundColor: "#D9F19C", color: "#000000" }}
                      >
                        签名
                      </LoadingButton>
                      <LoadingButton
                        onClick={() => { OwnerSignAndExecute() }}
                        // disabled={isEqual===false?true:false}
                        loading={executeLoading}
                        variant="contained"
                        sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
                        style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
                      >
                        签名并执行
                      </LoadingButton>
                    </Grid>
                    : <LoadingButton
                      onClick={() => { OwnerSign() }}
                      loading={executeLoading}
                      // disabled={isOwner === false ? true : false}
                      variant="contained"
                      sx={{ width: "100%", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
                      style={{ backgroundColor: "#D9F19C", color: "#000000" }}
                    >
                      签名
                    </LoadingButton>
            : <></>
      }



    </Box>
  )
}

export default AddOwnerProcess