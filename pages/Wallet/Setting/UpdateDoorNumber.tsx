import React, { useState } from 'react'
import Web3Provider from '@/store/Web3Provider'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  Dialog,
  Select,
  MenuItem,
  FormControl
} from '@mui/material'
import {
  CopyOutlined,
  LeftOutlined,
  UserOutlined,
  DeleteOutlined,
  FormOutlined,
  ExportOutlined,
  PlusCircleFilled, PlusOutlined,
  UserSwitchOutlined,
  CarryOutFilled,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import logo from '@/public/建国.jpg'
import Image from 'next/image';
import useWallet from '@/hooks/useWallet';
import { toast } from 'react-hot-toast';

const UpdateDoorNumber = () => {
  const { walletInfo } = useWallet.useContainer();
  console.log(walletInfo);
  const [newDoor, setNewDoor] = useState<any>(1);
  const router = useRouter();

  const NavigateUpdateConfirm = ()=>{
    if(newDoor===walletInfo?.data?.door){
      toast.error("门限值没有修改")
    }
    else{
      router.push({pathname:"/Wallet/Setting/UpdateConfirm",query:{newDoor:newDoor}})
    }
  }


  return (
    <Box
      sx={{ padding: "1rem" }}
    >
      <Grid
        sx={{ paddingBottom: "1rem" }}
        onClick={() => { router.push('/Wallet/Setting') }}
        container
        alignItems={'center'}
      >
        <LeftOutlined style={{ marginRight: ".3rem" }} />
        更改门槛
      </Grid>
      <Grid
        container
        item
        sx={{
          minHeight: "8.5rem",
          padding: "1rem 1.375rem",
          borderRadius: "12px",
          background: "#FFFFFF"
        }}
        flexDirection={"column"}
      >
        <Typography
          sx={{
            color: "#141414",
            fontWeight: "500",
            textAlign: "left",
            fontSize: "1.125rem"
          }}
        >
          门槛个数
        </Typography>
        <Divider sx={{ margin: "1rem 0" }}></Divider>

        <Grid container alignItems={'center'}>
          <Grid item xs={6} >
            <FormControl fullWidth>
              <Select
                defaultValue={1}
                id="demo-simple-select"
                sx={{
                  height: "2.5rem",
                  // border:"2px solid #4D9623",
                }}
                style={{ padding: ".5rem" }}
                value={newDoor}
                onChange={(e) => { setNewDoor(parseInt(e.target.value)) }}
              >
                {
                  walletInfo?.data?.ownerArr.map((_: any, index: number) => {
                    return (
                      <MenuItem sx={{ height: "1.75rem" }} 
                        value={index + 1}
                        key = {index}
                      >{index + 1}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item sx={{ marginLeft: "1rem" }}>
            <>out of {walletInfo?.data?.ownerArr?.length} owner(s)</>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ marginTop: "5rem" }}
        >
          <Typography
            sx={{
              color: "#BFBFBF",
              fontWeight: "400",
              textAlign: "center",
              fontSize: "1rem"
            }}
          >
            当前确认数 ：
          </Typography>
          <Typography
            sx={{
              color: "#272727",
              fontWeight: "400",
              textAlign: "center",
              fontSize: "1rem"
            }}
          >
            {`${walletInfo?.data?.door} out of ${walletInfo?.data?.ownerArr?.length} owner(s)`}
          </Typography>

        </Grid>
      </Grid>
      <LoadingButton
        onClick = {()=>{NavigateUpdateConfirm()}}
        variant="contained"
        sx={{ width: "100%", height: "2.31rem", borderRadius: "1.125rem", marginTop: "1.5rem" }}
        style={{ backgroundColor: " rgba(5, 5, 5, 0.76)" }}
      >
        下一步
      </LoadingButton>
    </Box>
  )

}

export default UpdateDoorNumber
