import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import {
  Box,
  Grid,
  Typography,
  Divider,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputAdornment
} from '@mui/material'
import {
  LeftOutlined,
  FileTextOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import logo from '@/public/建国.jpg'
import LoadingButton from '@mui/lab/LoadingButton';
import { CssTextField } from '@/component/CssComponent';
import { useRouter } from 'next/router';
export default function CreateAccount(props: any) {
  const router = useRouter();
  const [custom, setCustom] = useState(false);  //控制是否自定义数据

  return (
    <>
      <Box
      // sx={{ padding: "1rem" }}
      >
        <Grid
          sx={{ padding: "1rem" }}
          onClick={() => { router.back() }}
          container
          alignItems={'center'}
        ><LeftOutlined style={{ marginRight: ".3rem" }} />调用合约
        </Grid>
        <Box sx={{ backgroundColor: "#fff", minHeight: "46.6rem", padding: "1rem  1rem 5rem 1rem", borderRadius: "18px 18px 0px 0px" }}>
          <Grid
            container
            justifyContent={"space-between"}
          >
            <Typography
              sx={{
                color: "#000000",
                fontWeight: "500",
                textAlign: "center",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                marginLeft:"1rem"
              }}
            >
              <FileTextOutlined style={{ lineHeight: ".5rem", marginRight: ".5rem", color: "#4D9623" }} />
              新交易
            </Typography>


          </Grid>

          <Divider variant="middle"></Divider>
          <Grid
            container
            item
            sx={{
              // minHeight: "18.625rem",
              padding: "1rem",
              borderRadius: "12px",
              background: "#F9FDF2",
              marginTop: ".625rem"
            }}
            flexDirection={"column"}
          // justifyContent={"space-around"}
          // alignItems={"center"}
          >
            <CssTextField
              sx={{ width: "100%", padding: "0" }}
              InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
              placeholder='填写合约地址'
              variant="outlined"
              disabled
              value="0x181871281782718"
            // error={flag}
            // helperText={flag ? "1" : ""}
            // value={item?.address ?? ''}
            // onChange={(e) => { props.handleChangeOwnerAddress(e, index) }}
            />
            <Grid
              container
              item
              sx={{
                minHeight: "11.625rem",
                padding: ".5rem 1rem",
                marginTop: ".4rem",
                borderRadius: "12px",
                background: "#FFFFFF"
              }}
              flexDirection={"column"}
              justifyContent={"space-between"}
            // alignItems={"center"}
            >
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography
                  sx={{
                    color: "#555555",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".875rem"
                  }}
                >
                  交互合约
                </Typography>
                <Typography
                  sx={{
                    color: "#4D9623",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".825rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Image
                    alt=""
                    src={logo}
                    style={{
                      width: "1rem",
                      height: "1rem",
                      marginRight: ".2rem"
                    }}
                  />
                  0x272727272...gek3
                  <CopyOutlined></CopyOutlined>
                </Typography>
              </Grid>

              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography
                  sx={{
                    color: "#555555",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".875rem"
                  }}
                >
                  发送地址
                </Typography>
                <Typography
                  sx={{
                    color: "#4D9623",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".825rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Image
                    alt=""
                    src={logo}
                    style={{
                      width: "1rem",
                      height: "1rem",
                      marginRight: ".2rem"
                    }}
                  />
                  0x272727272...gek3
                  <CopyOutlined></CopyOutlined>
                </Typography>
              </Grid>

              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography
                  sx={{
                    color: "#939393",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".875rem"
                  }}
                >
                  费用
                </Typography>
                <Typography
                  sx={{
                    color: "#3D3D3D",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".825rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  1 FIBO
                </Typography>
              </Grid>

              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography
                  sx={{
                    color: "#939393",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".875rem"
                  }}
                >
                  数据
                </Typography>
                <Typography
                  sx={{
                    color: "#3D3D3D",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".825rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  0000000000000000000
                </Typography>
              </Grid>

              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography
                  sx={{
                    color: "#939393",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".875rem"
                  }}
                >
                  方法名
                </Typography>
                <Typography
                  sx={{
                    color: "#3D3D3D",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".825rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  sex
                </Typography>
              </Grid>
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography
                  sx={{
                    color: "#939393",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".875rem"
                  }}
                >
                  位数（uint 256）
                </Typography>
                <Typography
                  sx={{
                    color: "#3D3D3D",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: ".825rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  10
                </Typography>
              </Grid>



            </Grid>

          </Grid>

          <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
            <LoadingButton
              onClick={() => { router.back() }}
              variant="contained"
              sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
              style={{ backgroundColor: "#D9F19C", color: "#000000" }}
            >
              返回
            </LoadingButton>
            <LoadingButton
              onClick={() => { router.push("TradeHistory") }}
              variant="contained"
              sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
              style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
            >
              发送
            </LoadingButton>
          </Grid>
        </Box >
      </Box>

    </>


  );
}
