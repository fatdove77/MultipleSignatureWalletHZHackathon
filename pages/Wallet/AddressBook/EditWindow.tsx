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
} from '@ant-design/icons';
import { CssTextField } from '@/component/CssComponent';
import AddressBooksStore from '@/store/AddressBooksStore';
function EditWindow(props:any) {
  const {
    address,
    name,
    HandleAddress,
    HandleName,
    SaveAddressBook,
    EditAddressBook,
    setEditFlag,
    editFlag,
  } = AddressBooksStore.useContainer();


  const Save = ()=>{
    if(editFlag){
      EditAddressBook(props?.EditIndex);
    }
    else {
      SaveAddressBook();
    }
   
    props.setIsEdit(false);
  }
  //这个数组后期从缓存中提取一部分 比如代币符号和代币精度   缓存存储合约地址,精度,符号,余额/////////
  return (
      <Dialog
        open={props.isEdit}
        onClose={() => {props.setIsEdit(false)}}
      >
        <Grid
          container
          item
          xs={10}
          sx={{
            minHeight: "21.875rem",
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
            编辑
          </Typography>
          <Divider sx={{ margin: "1.125rem 0 1.5rem 0 " }}></Divider>
          <Grid>联系人名称</Grid>
          <CssTextField
            sx={{ width: "120%", padding: "0", marginTop: ".625rem" }}
            InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
            placeholder='请输入联系人名称'
            variant="outlined"
            value={name??''}
          // error={flag}
          // helperText={flag ? "1" : ""}
          onChange={(e) => { HandleName(e.target.value) }}
          inputProps={{
            maxLength: 10 // 设置最大字符数
          }}
          />
          <Grid sx={{ marginTop: "1.5rem" }}>联系人地址</Grid>
          <CssTextField
            sx={{ width: "120%", padding: "0", marginTop: ".625rem" }}
            InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
            placeholder='请输入联系人地址'
            variant="outlined"
            value={address??''}
          // error={flag}
          // helperText={flag ? "1" : ""}
          onChange={(e) => { HandleAddress(e.target.value) }}
          />
          <Grid container justifyContent={'space-between'} sx = {{width:"120%",marginTop:"2.5rem"}} >
          <LoadingButton
            onClick={() => {props.setIsEdit(false)}}
            variant="contained"
            sx={{ width: "8.5rem", height: "2.31rem", borderRadius: "1.125rem",}}
            style={{ backgroundColor: "#D9F19C", color: "#000000" }}
          >
            取消
          </LoadingButton>
          <LoadingButton
            onClick={() => {Save()}}
            variant="contained"
            sx={{ width: "8.5rem", height: "2.31rem", borderRadius: "1.125rem",}}
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