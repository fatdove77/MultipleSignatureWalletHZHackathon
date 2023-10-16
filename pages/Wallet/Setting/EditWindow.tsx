import React, { useState } from 'react'
import Web3Provider from '@/store/Web3Provider'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  Dialog
} from '@mui/material'
import {
  CopyOutlined,
  LeftOutlined,
  UserOutlined,
  DeleteOutlined,
  FormOutlined,
  ExportOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import logo from '@/public/建国.jpg'
import Image from 'next/image';
import { CssTextField } from '@/component/CssComponent';
import { formatAddress } from '@/utils/utils';
import useWallet from '@/hooks/useWallet';
function EditWindow(props: any) {


  const HandleChange = () => {
    props.ChangeOwnerName(props.walletInfo?.address, props.editAddress, props.editName);
    props.setIsEditName(false);
  }

  //这个数组后期从缓存中提取一部分 比如代币符号和代币精度   缓存存储合约地址,精度,符号,余额/////////
  return (
    <Dialog
      open={props.isEditName}
      onClose={() => { props.setIsEditName(false) }}
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
          编辑拥有者名称
        </Typography>
        <Divider sx={{ margin: "1.125rem 0 1.5rem 0 " }}></Divider>
        <Grid>拥有者名称</Grid>
        <CssTextField
          sx={{ width: "120%", padding: "0", marginTop: ".625rem" }}
          InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
          placeholder=''
          variant="outlined"
          value={props?.editName}
          inputProps={{
            maxLength: 10 // 设置最大字符数
          }}
          // error={flag}
          // helperText={flag ? "1" : ""}
          onChange={(e) => { props.setEditName(e.target.value) }}
        />
        <Typography
          sx={{
            color: "#000000",
            fontWeight: "400",
            textAlign: "left",
            fontSize: ".75rem",
            margin: "1rem 0 "
          }}
        >
          {formatAddress(props?.editAddress ?? "")}
        </Typography>

        <Grid container justifyContent={'space-between'} sx={{ width: "120%", }} >
          <LoadingButton
            onClick={() => { props.setIsEditName(false) }}
            variant="contained"
            sx={{ width: "8rem", height: "2.31rem", borderRadius: "1.125rem", }}
            style={{ backgroundColor: "#D9F19C", color: "#000000" }}
          >
            取消
          </LoadingButton>
          <LoadingButton
            onClick={() => { HandleChange() }}
            variant="contained"
            sx={{ width: "8rem", height: "2.31rem", borderRadius: "1.125rem", }}
            style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
          >
            保存
          </LoadingButton>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default EditWindow