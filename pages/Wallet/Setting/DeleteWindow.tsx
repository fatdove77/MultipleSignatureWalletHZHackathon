import React, { useState, useEffect } from 'react';
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { Drawer, Radio, Space } from 'antd';
import {
  Box,
  Grid,
  Typography,
} from '@mui/material'
import {
  PlusOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { CssTextField } from '@/component/CssComponent';
import LoadingButton from '@mui/lab/LoadingButton'
import useWallet from '@/hooks/useWallet';
import { formatAddress } from '@/utils/utils';
import { useAddOwner } from '@/hooks/useAddOwner';
import { ErrorAddressMessage, ErrorWeightMessage, ErrorNameMessage } from '@/utils/utils';
import { toast } from 'react-hot-toast';
const DeleteWindow = (props: any) => {
  const { walletInfo } = useWallet.useContainer();
  const [save, setSave] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    props.onCloseDelete();
  }, [router])


  useEffect(() => {
    let totalWeight = 0;
    props?.deleteOwner.forEach((item: any) => { totalWeight += parseInt(item?.weight) });
    props?.deleteOwner.map((item: any, index: number) => {
      if (ErrorWeightMessage(props?.deleteOwner, index) === ''
        && props?.deleteOwner[index].weight !== undefined
      ) {
        setSave(true);
      }
      else {
        setSave(false);
      }

    })
  }, [props?.deleteOwner])


  const NavigateConfirm = () => {
    if (save) {
      router.push({
        pathname:"/Wallet/Setting/DeleteConfirm",
        query:{
          deleteIndex:props?.deleteIndex,
          deleteOwner:JSON.stringify(props?.deleteOwner)
        }
      })
    }
    else {
      toast.error("请填写正确信息")
    }
  }


  return (
    <>
      <Drawer
        placement="bottom"
        onClose={props.onCloseDelete}
        open={props.isDelete}
        // width={"11.825rem"}
        height={"90vh"}
        closeIcon={false}
        style={{ borderRadius: "18px 18px 0 0 " }}
        headerStyle={{ backgroundColor: "#ffffff", height: "2.5rem" }}
        title={
          <>
            <Typography
              sx={{ textAlign: "center", fontSize: "1rem", marginRight: "1rem", fontWeight: "400" }}>
              删除拥有者更新权重
            </Typography>
          </>
        }
      >
        <Grid
          container
          flexDirection={"column"}
          sx={{ padding: "1rem" }}
          gap={"1rem"}
        >
          {
            props?.deleteOwner?.map((item: any, index: number) => {
              return (
                <Grid
                  container
                  item
                  key={index}
                  sx={{
                    // minHeight: "18.4375rem",
                    padding: "1rem",
                    borderRadius: "12px",
                    background: "#F9FDF2"
                  }}
                  flexDirection={"column"}
                >
                  <Grid
                    container
                    justifyContent={"space-between"}
                  >
                    <Typography
                      sx={{
                        color: "#00000",
                        fontWeight: "350",
                        textAlign: "center",
                        fontSize: ".875rem"
                      }}
                    >
                      拥有者名称
                    </Typography>
                  </Grid>
                  <CssTextField
                    value={item?.name}
                    disabled={true}
                    sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
                    InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                    placeholder='请输入拥有者姓名'
                    variant="outlined"
                  />
                  <Grid sx={{ marginTop: "1rem" }}>拥有者地址</Grid>
                  <CssTextField
                    value={item?.address ?? ''}
                    disabled={true}
                    sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
                    InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                    placeholder='请输入拥有者地址'
                    variant="outlined"
                  />
                  <Grid sx={{ marginTop: "1rem" }}>拥有者权重</Grid>
                  <CssTextField
                    value={item?.weight ?? ''}
                    type={"number"}
                    onChange={(e) => { props.ChangeDeleteOwnerWeight(index, e.target.value) }}
                    error={ErrorWeightMessage(props?.deleteOwner, index) === '' ? false : true}
                    helperText={ErrorWeightMessage(props?.deleteOwner, index)}
                    sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
                    InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                    placeholder='请输入拥有者权重'
                    variant="outlined"
                  />

                </Grid>
              )
            })
          }
          <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
            <LoadingButton
              onClick={() => { props.onCloseDelete() }}
              variant="contained"
              sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
              style={{ backgroundColor: "#D9F19C", color: "#000000" }}
            >
              取消
            </LoadingButton>
            <LoadingButton
              onClick={() => {NavigateConfirm() }}
              variant="contained"
              sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
              style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
            >
              保存并签名
            </LoadingButton>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
};

export default DeleteWindow;