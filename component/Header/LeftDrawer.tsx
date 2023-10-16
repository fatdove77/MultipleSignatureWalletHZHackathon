import React, { useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import { Box, Grid, Typography, Badge } from '@mui/material';
import Image from 'next/image';
import logo from '@/public/建国.jpg'
import LoadingButton from '@mui/lab/LoadingButton';
import {
  CopyOutlined,
  HomeOutlined,
  TrademarkCircleOutlined,
  ContainerOutlined,
  SettingOutlined,
  AuditOutlined
} from '@ant-design/icons'
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';
import Link from 'next/link';
import  useWallet  from '@/hooks/useWallet'
import { formatAddress } from '@/utils/utils';
export function LeftDrawer(props: any) {
  const router = useRouter();
  const {
    walletInfo,
    walletInfoLoading
  } = useWallet.useContainer();
  useEffect(() => {
    props.onClose();
  }, [router])

  return (
    <Drawer
      placement="left"
      onClose={props.onClose}
      open={props.open}
      width={"11.825rem"}
      closeIcon={false}
      headerStyle={{ border: "none", background: "rgb(122, 247, 139)", height: "2.5rem" }}
      title={<Typography sx={{ textAlign: "center", fontSize: "1.125rem", marginRight: "1rem", fontWeight: "600" }}>ETH Chain</Typography>}
    >
      <Grid
        container
        sx={{ padding: ".625rem" }}
        justifyContent={"space-between"}
      >
        <Badge badgeContent={walletInfo?.data.signType === 0 ? `${walletInfo?.data.door}/${walletInfo?.data.ownerArr.length}` : `${walletInfo?.data.weight}%`} overlap="circular" color="primary" sx={{zIndex: "100"}} >
          <Image
            alt=""
            src={walletInfo?.img}
            width={50}
            height={50}
            style={{ width: "3rem", height: "3rem" }}
            onClick={() => {
              router.push({ pathname: "/Wallet",query:{index:router.query.index}})
            }}
          ></Image>
        </Badge>

        <Grid
          container
          flexDirection={"column"}
          alignItems={"start"}
          sx={{ marginLeft: '.5rem' }}
          item
          xs={8}
        >
          <Typography 
            sx={{ 
              color: "#000000", 
              fontWeight: "500", 
              textAlign: "center", 
              fontSize: "1rem" 
              }
            }
            >{walletInfo?.name}
          </Typography>
          <Typography 
            sx={{ 
              color: "#878787", 
              fontWeight: "400", 
              textAlign: "center", 
              fontSize: ".75rem", 
              display: "flex", 
              alignItems: "center" ,
            }}>
              fbc:{formatAddress(walletInfo?.address ?? '')} 
              <CopyOutlined 
                onClick={()=>{copy(walletInfo?.address)}} 
              />
            </Typography>
          <Typography sx={{ color: "#878787", fontWeight: "400", textAlign: "center", fontSize: ".75rem" }}>ETH 余额： </Typography>
          <Typography sx={{ color: "#5B5B5B", fontWeight: "500", textAlign: "center", fontSize: ".75rem" }}>{walletInfo?.balance} </Typography>
        </Grid >
        <LoadingButton
          variant="contained"
          sx={{
            width: "15.9rem",
            height: "1.625rem",
            borderRadius: "1.125rem",
            fontSize: ".75rem",
            marginTop: "1rem"
          }}
          onClick={() => {
            router.push({ pathname: "/Wallet/InitiateTrade"})
          }}
          style={{ backgroundColor: " rgba(5, 5, 5, 0.76)" }}
        >
          发起交易
        </LoadingButton>
      </Grid >
      <Grid
        onClick={() => {
          router.push({ pathname: "/Home", query:{index:router.query.index} })
        }}
        container
        alignItems={"center"}
        sx={{
          padding: ".625rem .875rem",
          height: "2rem",
          '&:hover': {
            backgroundColor: "#F4F9ED"
          }
        }}
        style={Object.assign({}, router.pathname.split("/")[1] == 'Home' ? {
          backgroundColor: "#F4F9ED",
          borderRight: "2px solid #9CBE89"
        } : undefined)}
      >
        <Typography
          sx={{
            color: "#3D3D3D",
            fontWeight: "500",
            textAlign: "center",
            fontSize: ".875rem",
            display: "flex",
            alignItems: "center",
            '&:hover': {
              backgroundColor: "#F4F9ED"
            }
          }}
        >
          <HomeOutlined style={{ lineHeight: ".5rem", fontSize: ".875rem" }} />
          &nbsp;&nbsp;&nbsp;主页
        </Typography>

      </Grid>
      <Grid
        onClick={() => {
          router.push({ pathname: "/Wallet/Trade",query:{index:router.query.index} })
        }}
        sx={{
          padding: ".625rem .875rem",
          height: "2rem",
          '&:hover': {
            backgroundColor: "#F4F9ED"
          }
        }}
        style={Object.assign({}, router.pathname.split("/")[2] == 'Trade' ? {
          backgroundColor: "#F4F9ED",
          borderRight: "2px solid #9CBE89"
        } : undefined)}
      >
        <Typography
          sx={{
            color: "#3D3D3D",
            fontWeight: "500",
            textAlign: "center",
            fontSize: ".875rem",
            display: "flex",
            alignItems: "center",

          }}
        >
          <TrademarkCircleOutlined style={{ lineHeight: ".5rem", fontSize: ".875rem" }} />
          &nbsp;&nbsp;&nbsp;交易
        </Typography>
      </Grid>
      <Grid
        onClick={() => {
          router.push({ pathname: "/Wallet/AddressBook",query:{index:router.query.index} })
        }}
        sx={{
          padding: ".625rem .875rem",
          height: "2rem",
          '&:hover': {
            backgroundColor: "#F4F9ED"
          }
        }}
        style={Object.assign({}, router.pathname.split("/")[2] == 'AddressBook' ? {
          backgroundColor: "#F4F9ED",
          borderRight: "2px solid #9CBE89"
        } : undefined)}
      >
        <Typography
          sx={{
            color: "#3D3D3D",
            fontWeight: "500",
            textAlign: "center",
            fontSize: ".875rem",
            display: "flex",
            alignItems: "center",

          }}
        >
          <ContainerOutlined style={{ lineHeight: ".5rem", fontSize: ".875rem" }} />
          &nbsp;&nbsp;&nbsp;地址簿
        </Typography>
      </Grid>
      <Grid
        onClick={() => {
          router.push({ pathname: "/Wallet/Setting",query:{index:router.query.index} })
        }}
        sx={{
          padding: ".625rem .875rem",
          height: "2rem",
          '&:hover': {
            backgroundColor: "#F4F9ED"
          }
        }}
        style={Object.assign({}, router.pathname.split("/")[2] == 'Setting' ? {
          backgroundColor: "#F4F9ED",
          borderRight: "2px solid #9CBE89"
        } : undefined)}
      >
        <Typography
          sx={{
            color: "#3D3D3D",
            fontWeight: "500",
            textAlign: "center",
            fontSize: ".875rem",
            display: "flex",
            alignItems: "center",

          }}
        >
          <SettingOutlined style={{ lineHeight: ".5rem", fontSize: ".875rem" }} />
          &nbsp;&nbsp;&nbsp;设置
        </Typography>
      </Grid>
      <Grid
        onClick={() => {
          router.push({pathname:"/Wallet/History",query:{index:router.query.index}})
        }}
        sx={{
          padding: ".625rem .875rem",
          height: "2rem",
          '&:hover': {
            backgroundColor: "#F4F9ED"
          }
        }}
        style={Object.assign({}, router.pathname.split("/")[2] == 'History' ? {
          backgroundColor: "#F4F9ED",
          borderRight: "2px solid #9CBE89"
        } : undefined)}
      >
        <Typography

          sx={{
            color: "#3D3D3D",
            fontWeight: "500",
            textAlign: "center",
            fontSize: ".875rem",
            display: "flex",
            alignItems: "center",

          }}
        >
          <AuditOutlined style={{ lineHeight: ".5rem", fontSize: ".875rem" }} />
          &nbsp;&nbsp;&nbsp;创建记录
        </Typography>
      </Grid>
    </Drawer >
  );
};
