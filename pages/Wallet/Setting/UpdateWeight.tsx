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
import { CssTextField } from '@/component/CssComponent';
import { useRouter } from 'next/router';
import logo from '@/public/建国.jpg'
import Image from 'next/image';
import useWallet from '@/hooks/useWallet';
import { toast } from 'react-hot-toast';

const UpdateDoorNumber = () => {
  const { walletInfo } = useWallet.useContainer();
  const [newWeight, setNewWeight] = useState<any>('');
  const router = useRouter();

  const NavigateUpdateConfirm = ()=>{
    if(newWeight==''||newWeight>100){
      toast.error("请填写正确信息");
      return;
    }
    if(newWeight===walletInfo?.data?.weight){
      toast.error("权重值没有修改")
    }
    else{
      router.push({pathname:"/Wallet/Setting/UpdateConfirm",query:{newWeight:newWeight}})
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
        更改权重
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
          权重占比
        </Typography>
        <Divider sx={{ margin: "1rem 0" }}></Divider>

        <Grid container alignItems={'center'}>
          <Grid item xs={6} >
            <CssTextField
              sx={{ width: "100%", padding: "0",}}
              InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
              placeholder='输入权重占比百分数'
              variant="outlined"
              value = {newWeight??''}
              onChange={(e)=>{setNewWeight(parseInt(e.target.value))}}
              type = {"number"}
              
              // error={flag}
              // helperText={flag ? "1" : ""}
              // value={item?.address ?? ''}
              // onChange={(e) => { props.handleChangeOwnerAddress(e, index) }}
            />
          </Grid>
          <Grid item >
            <>%</>
          </Grid>
          <Grid item sx={{ marginLeft: "2rem" }}>
            <>权重通过</>
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
            当前钱包权重值(≥通过) ：
          </Typography>
          <Typography
            sx={{
              color: "#272727",
              fontWeight: "400",
              textAlign: "center",
              fontSize: "1rem"
            }}
          >
            {walletInfo?.data?.weight}%
          </Typography>

        </Grid>
      </Grid>
      <LoadingButton
        onClick={()=>{NavigateUpdateConfirm()}}
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
