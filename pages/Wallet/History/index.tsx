import React, { useState } from 'react'
import Web3Provider from '@/store/Web3Provider'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Grid,
  Typography,
  Divider,
} from '@mui/material'
import {
  CopyOutlined,
  LeftOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { CssTextField } from '@/component/CssComponent';
import { useHistory } from '@/hooks/useHistory';
import { Spin } from 'antd';
import { formatAddress } from '@/utils/utils';
import copy from 'copy-to-clipboard';
function History() {
  const {
    walletHistory,
    loading
  } = useHistory();
  const router = useRouter();
  const [current, setCurrent] = useState<number>(0);
  console.log(Math.floor(walletHistory?.length% 10 === 0 ? (walletHistory?.length) / 10 - 1 : walletHistory?.length / 10));
  console.log(current)
  return (
    <Box
      sx={{ padding: "1rem" }}
    >
      <Grid
        sx={{ paddingBottom: "1rem" }}
        onClick={() => { router.push("/Wallet") }}
        container
        alignItems={'center'}
      ><LeftOutlined style={{ marginRight: ".3rem" }} />创建记录</Grid>
      <Grid
        container
        item
        sx={{ minHeight: "27rem", padding: "1rem 1rem 2rem 1rem", borderRadius: "12px", background: "#FFFFFF" }}
        flexDirection={"column"}
        gap={".625rem"}
      // alignItems={"start"}
      >
        <Grid
          container
          // justifyContent={""}
          // gap = {"20%"}
          alignItems={"center"}
        >
          <Grid
            item
            xs={2}
          >
            <Typography
              sx={{
                color: "#3D3D3D",
                fontWeight: "400",
                textAlign: "left",
                fontSize: ".875rem"
              }}
            >
              序号
            </Typography>
          </Grid>
          <Grid
            item
            xs={5}
          >
            <Typography

              sx={{
                color: "#3D3D3D",
                fontWeight: "400",
                textAlign: "center",
                fontSize: ".875rem"
              }}
            >
              地址
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
          >
            <Typography

              sx={{
                color: "#3D3D3D",
                fontWeight: "400",
                textAlign: "right",
                fontSize: ".875rem"
              }}
            >
              创建时间
            </Typography>
          </Grid>
        </Grid>
        <Divider></Divider>
        {
          loading
            ? <Grid container sx={{ height: "100" }} alignItems="center" justifyContent="center">
              <Spin></Spin>
            </Grid>
            : walletHistory&&walletHistory.slice(current * 10, current * 10 + 10).map((item, index) => {
              return (
                <Grid
                  container
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  key = {index}
                >
                  <Typography
                    sx={{
                      color: "#868686",
                      fontWeight: "400",
                      textAlign: "center",
                      fontSize: "1rem"
                    }}
                  >
                    {current * 10 + index + 1}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#4D9623",
                      fontWeight: "400",
                      textAlign: "center",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {formatAddress(item.address)}
                    <CopyOutlined style={{ lineHeight: ".5rem", marginRight: ".5rem" }}
                    onClick={()=>{copy(item?.address)}}
                     />
                  </Typography>
                  <Typography
                    sx={{
                      color: "#868686",
                      fontWeight: "400",
                      textAlign: "center",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {item.createTime}
                  </Typography>
                </Grid>
              )
            })
        }

      </Grid>
      <Typography
        sx={{
          color: "#AFAFAF",
          fontWeight: "400",
          textAlign: "right",
          fontSize: ".75rem"
        }}
      >
        共 {walletHistory?.length} 条记录
      </Typography>
      <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
        <LoadingButton
          onClick={() => { setCurrent(current - 1) }}
          variant="contained"
          sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
          style={{ backgroundColor: "#D9F19C", color: "#000000" }}
          disabled={current === 0}
        >
          上一页
        </LoadingButton>
        <LoadingButton
          onClick={() => { setCurrent(current + 1) }}
          variant="contained"
          sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
          style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
          disabled={current ===
            Math.floor(walletHistory?.length % 10 === 0 ? (walletHistory?.length) / 10 - 1 : walletHistory?.length/ 10)?true:false}
        >
          下一页
        </LoadingButton>
      </Grid>
    </Box>
  )
}

export default History