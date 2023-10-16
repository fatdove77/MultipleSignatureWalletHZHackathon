import React, { useState, useRef, useEffect } from 'react'
import Web3Provider from '@/store/Web3Provider';
import { formatAddress } from '@/utils/utils'
import { Box, Grid, Button, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, Typography, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider } from 'antd';
import {
  CaretDownOutlined,
  WalletOutlined,
  PlusCircleOutlined,
  CopyOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import { CssTextField } from '@/component/CssComponent';
import { ErrorNewAddressMessage } from '@/utils/utils';
function AddWallet(props: any) {
  const [save, setSave] = useState<boolean>(false);


  const ConfirmSave = () => {
    if (save) {
      props.TellWalletSignType();

    }
    else {
      toast.error("请填写正确信息")
    }

  }

  useEffect(() => {
    if (ErrorNewAddressMessage(props.newWalletAddress) === '' && props.newWalletAddress !== undefined) {
      //还要判断多钱类型
      setSave(true);
    }
    else {
      setSave(false);
    }
  }, [props.newWalletName, props.newWalletAddress])



  return (
    <Box>
      <Dialog
        open={props.isImport}
        onClose={() => { props.setIsImport(false) }}
      >
        <Grid
          container
          justifyContent={'start'}
          alignItems={"center"}
          sx={{ margin: "1rem 0", width: "20rem", minHeight: "12.625rem", padding: "0 1.625rem" }}
          flexDirection={'column'}
        >
          <Grid
            item
            container
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Typography sx={{ fontSize: ".875rem", color: "#707070" }} >导入钱包地址</Typography>
            <Divider style={{ marginTop: '.5rem' }} />
          </Grid>

          <Grid
            item
            container
            justifyContent={"start"}
            alignItems={"start"}
            sx={{ marginBottom: "13px" }}
            flexDirection={'column'}
          >
            <Typography sx={{ marginBottom: "14px" }}>钱包名称</Typography>
            <CssTextField
              value={props?.newWalletName || ''}
              inputProps={{
                maxLength: 10 // 设置最大字符数
              }}
              onChange={(e) => { props.HandleWalletName(e.target.value) }}
              sx={{ width: "100%", padding: "0" }}
              InputProps={{ style: { height: "40px" } }}
              placeholder='请输入钱包名称'
              variant="outlined"
            />

          </Grid>
          <Grid
            item
            container
            justifyContent={"start"}
            alignItems={"start"}
            sx={{ marginBottom: "13px" }}
            flexDirection={'column'}
          >
            <Typography sx={{ marginBottom: "14px" }}>钱包地址</Typography>
            <CssTextField
              value={props?.newWalletAddress ?? ''}
              onChange={(e) => { props.HandleWalletAddress(e.target.value) }}
              error={ErrorNewAddressMessage(props?.newWalletAddress) === '' ? false : true}
              helperText={ErrorNewAddressMessage(props?.newWalletAddress)}
              sx={{ width: "100%", padding: "0" }}
              InputProps={{ style: { height: "40px" } }}
              placeholder='请输入钱包地址'
              variant="outlined"
            />

          </Grid>
          <Grid item>
            <LoadingButton
              onClick={() => { ConfirmSave() }}
              variant="contained"
              sx={{ width: "15.9rem", height: "2.31rem", borderRadius: "1.125rem" }}
              style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
            >
              确定
            </LoadingButton>
          </Grid>
        </Grid>
      </Dialog>
    </Box>
  )
}

export default AddWallet