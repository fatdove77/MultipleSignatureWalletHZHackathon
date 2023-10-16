import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Web3Provider from '@/store/Web3Provider';
import { formatAddress } from '@/utils/utils'
import { Button, Divider, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import config from '@/config';
import Image from 'next/image';
import logo from '@/public/logo.png'
import { LeftDrawer } from './LeftDrawer';
import copy from 'copy-to-clipboard';
import {
  CaretDownOutlined,
  WalletOutlined,
  PlusCircleOutlined,
  CopyOutlined,
  ExportOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
//drawer
//component
function Header() {
  const router = useRouter();
  const { active, connect, disconnect, account } = Web3Provider.useContainer();
  const [showInfo, setShowInfo] = useState<boolean>(false);//是否显示钱包的信息
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    console.log(open);

    setOpen(false);
  }, [])


  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };


  return (
    <>
      <div className='Header'>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={2}>
            {
              router.pathname.split('/')[1] === 'Wallet'
                ? <MenuUnfoldOutlined style={{ marginBottom: ".5rem",fontSize:"1rem"}} onClick={() => { showDrawer() }} />
                : <Image onClick={() => {
                  router.push({ pathname: "/" })
                }} alt="" src={logo} width={40}></Image>
            }
          </Grid>
          <Grid item xs={4} container justifyContent="end">
            {
              active
                ? <LoadingButton
                  style={{ background:"linear-gradient(to right, rgba(255, 255, 0, 1), rgba(57, 255, 20, 1));" }}
                  sx={{ zIndex: "100", width: "57px", height: "29px", borderRadius: "44px", padding: "0", justifyContent: "space-between", color: "#000000", border: "none", backgroundColor: "#FAFFF5",}}
                  startIcon={<WalletOutlined style={{ width: "1.8126rem", height: "1.8126rem", lineHeight: "24px", border: "1px solid #CAD2C2", borderRadius: "44px" ,display:"flex",justifyContent: "center",alignItems:"center"}} />}
                  ref={buttonRef}
                  loading={false}
                  variant="text"
                  endIcon={<CaretDownOutlined style={{ marginRight: ".4rem" }} />}
                  onClick={() => { setShowInfo(true) }}
                >
                  {/* {formatAddress(account)} */}
                </LoadingButton >
                //未连接钱包
                : <Button
                  startIcon={<PlusCircleOutlined style={{ fontSize: "25.38px", color: "#404040", marginLeft: ".4rem" }} />}
                  sx={{ width: "7.1875rem", height: "2rem", borderRadius: "3rem", padding: "0", justifyContent: "space-between", color: "#000000", border: "1px solid #CAD2C2 " }}
                  variant="outlined"
                  onClick={() => { connect(config.DEFAULT_NETWORK_ID, config.DEFAULT_WALLET_TYPE) }}
                >
                  连接钱包 &nbsp;
                </Button>
            }
          </Grid>
        </Grid>
        <Dialog
          open={showInfo}
          onClose={() => { setShowInfo(false) }}
        >
          <Grid item container justifyContent={'center'} sx={{ marginTop: "1.375rem" }}>
            <Image src={logo} style={{ width: "3.1875rem" }} alt=""></Image>
          </Grid>
          <Grid
            container
            justifyContent={'center'}
            alignItems={"center"}
            sx={{ margin: "1rem 0", width: "20rem" }}
            flexDirection={'column'}
          >
            <Grid
              item
              container
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ color: "#307E11", borderRadius: "1rem", backgroundColor: "#EDF8D8", width: "9.375rem", marginBottom: "13px" }}
            >
              <Typography
                sx = {{
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center"

                }}
              >&nbsp;&nbsp;{formatAddress(account??"")}<CopyOutlined onClick={()=>{copy(account)}} /></Typography>
              <Typography sx={{ marginLeft: "1rem" }}></Typography>
            </Grid>
            <Grid
              item
              container
              justifyContent={"space-around"}
              alignItems={"center"}
              sx={{ marginBottom: "13px" }}
            >
              <Grid>Network</Grid>
              <Grid>ETH chain</Grid>
            </Grid>
            <Grid item>
              <LoadingButton
                onClick = {()=>{disconnect()}}
                variant="contained"
                sx={{ width: "15.9rem", height: "2.31rem", borderRadius: "1.125rem" }}
                style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
              >
                退出钱包
              </LoadingButton>
            </Grid>
          </Grid>
          <Grid item container justifyContent={"center"} alignItems={'center'} sx={{ color: "#307E11", marginBottom: "1rem" }}>
            <a target="_blank" href="https://etherscan.io/">View on ETHSCAN</a>
            <ExportOutlined style={{ marginLeft: "1rem" }} />
          </Grid>
        </Dialog>
      </div>
      <LeftDrawer
        open={open}
        onClose={onClose}
      ></LeftDrawer>
    </>
  )
}

export default Header