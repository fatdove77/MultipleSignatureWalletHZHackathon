import React, { useState } from 'react'
import Web3Provider from '@/store/Web3Provider'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Grid,
  Typography,
  Divider,
  Dialog
} from '@mui/material'
import { useRouter } from 'next/router';
function DeleteConfirmWindow(props: any) {
  const router = useRouter();
  const NavigateDeleteConfirm =()=>{
    router.push({
      pathname:"/Wallet/Setting/DeleteConfirm",
      query:{
        deleteIndex:JSON.stringify(props?.deleteIndex)
      }
    })
    
  }
  return (
    <Dialog
      open={props.deleteWindow}
      onClose={() => { props.setDeleteWindow(false) }}
    >
      <Grid
        container
        item
        xs={10}
        sx={{
          minHeight: "14.1rem",
          width: "21rem",
          padding: "1rem 1.375rem",
          borderRadius: "12px",
          background: "#FFFFFF"
        }}
        flexDirection={"column"}
      // justifyContent={"space-around"}
      // alignItems={"center"}
      >
        <Typography
          sx={{
            color: "#555555",
            fontWeight: "350",
            textAlign: "center",
            fontSize: ".875rem"
          }}
        >
          删除
        </Typography>
        <Divider sx={{ margin: "1.125rem 0 1.5rem 0 " }}></Divider>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: "400",
            textAlign: "center",
            fontSize: "1rem",
            margin:"0 0 1rem 0 "
          }}
        >
          确认要删除该拥有者吗
        </Typography>

        <Grid container justifyContent={'space-between'} sx={{ width: "120%",}} >
          <LoadingButton
            onClick={() => { props.setDeleteWindow(false) }}
            variant="contained"
            sx={{ width: "8rem", height: "2.31rem", borderRadius: "1.125rem", }}
            style={{ backgroundColor: "#D9F19C", color: "#000000" }}
          >
            取消
          </LoadingButton>
          <LoadingButton
            onClick={() => {NavigateDeleteConfirm()}}
            variant="contained"
            sx={{ width: "8rem", height: "2.31rem", borderRadius: "1.125rem", }}
            style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
          >
            确认
          </LoadingButton>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default DeleteConfirmWindow