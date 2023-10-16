import React, { useState, useEffect } from 'react';
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { Drawer, Radio, Space } from 'antd';
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  Dialog,
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
const AddOwner = (props: any) => {
  const router = useRouter();
  const { walletInfo } = useWallet.useContainer();
  const [save, setSave] = useState<boolean>(false);
  useEffect(() => {
    props.onClose();
  }, [router])


  useEffect(() => {
    let totalWeight = 0;
    props.showWalletArr.forEach((item: any) => { totalWeight += parseInt(item?.weight) });
    props?.showWalletArr.map((item: any, index: number) => {
      if (walletInfo?.data?.signType === 0) {
        if (
          ErrorAddressMessage(props.showWalletArr, index) === ''
          && ErrorNameMessage(props.showWalletArr, index) === ''
          && props.showWalletArr[index].address !== undefined
          && props.showWalletArr[index].name !== undefined
        ) {
          setSave(true);
        }
        else {
          setSave(false);
        }
      }
      else {
        if (ErrorAddressMessage(props.showWalletArr, index) === ''
          && ErrorNameMessage(props.showWalletArr, index) === ''
          && ErrorWeightMessage(props.showWalletArr, index) === ''
          && props.showWalletArr[index].address !== undefined
          && props.showWalletArr[index].name !== undefined
          && props.showWalletArr[index].weight !== undefined
        ) {
          setSave(true);
        }
        else {
          setSave(false);
        }

      }

    })
  }, [props.showWalletArr])


  const NavigateConfirm = () => {
    if (save) {
      if (props.showWalletArr.length === walletInfo?.data?.ownerArr.length) {
        toast.error("无可更改信息")
      }
      else {
        router.push({
          pathname: "/Wallet/Setting/AddOwnerConfirm",
          query: {
            updateOwnerArr: JSON.stringify(props.showWalletArr)
          }
        })
      }

    } else {
      toast.error("请填写正确信息")
    }
  }
  return (
    <>
      <Drawer
        placement="bottom"
        onClose={props.onClose}
        open={props.isAddOwner}
        // width={"11.825rem"}
        height={"90vh"}
        closeIcon={false}
        style={{ borderRadius: "18px 18px 0 0 " }}
        headerStyle={{ backgroundColor: "#ffffff", height: "2.5rem" }}
        title={
          <>
            <Typography
              sx={{ textAlign: "center", fontSize: "1rem", marginRight: "1rem", fontWeight: "400" }}>
              添加拥有者
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
            props.showWalletArr && props.showWalletArr.map((item: any, index: number) => {
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
                    {
                      index + 1 > walletInfo?.data?.ownerArr.length
                        ? <><CloseOutlined onClick={() => { props.DeleteOwner(index) }} /></>
                        : <></>
                    }
                  </Grid>
                  <CssTextField
                    onChange={(e) => { props.handleOwnerName(index, e.target.value) }}
                    value={item?.name}
                    error={ErrorNameMessage(props.showWalletArr, index) === '' ? false : true}
                    helperText={ErrorNameMessage(props.showWalletArr, index)}
                    disabled={index + 1 > walletInfo?.data?.ownerArr.length ? false : true}
                    sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
                    InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                    placeholder='请输入拥有者姓名'
                    variant="outlined"
                  // error={flag}
                  // helperText={flag ? "1" : ""}
                  // value={item?.address ?? ''}
                  // onChange={(e) => { props.handleChangeOwnerAddress(e, index) }}
                  />
                  <Grid sx={{ marginTop: "1rem" }}>拥有者地址</Grid>
                  <CssTextField
                    value={item?.address}
                    onChange={(e) => { props.handleOwnerAddress(index, e.target.value) }}
                    disabled={index + 1 > walletInfo?.data?.ownerArr.length ? false : true}
                    error={ErrorAddressMessage(props.showWalletArr ?? [], index) === '' ? false : true}
                    helperText={ErrorAddressMessage(props.showWalletArr, index)}
                    sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
                    InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                    placeholder='请输入拥有者地址'
                    variant="outlined"
                  />
                  {
                    walletInfo?.data?.signType === 1
                      ? <> <Grid sx={{ marginTop: "1rem" }}>拥有者权重</Grid>
                        <CssTextField
                          value={item?.weight ?? ''}
                          type={"number"}
                          onChange={(e) => { props.handleOwnerWeight(index, e.target.value) }}
                          error={ErrorWeightMessage(props.showWalletArr, index) === '' ? false : true}
                          helperText={ErrorWeightMessage(props.showWalletArr, index)}
                          // disabled={index + 1 > walletInfo?.data?.ownerArr.length ? false : true}
                          sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
                          InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                          placeholder='请输入拥有者权重'
                          variant="outlined"
                        /></>
                      : <></>
                  }

                </Grid>
              )
            })
          }
          <Grid
            // disabled = {props?.showWalletArr?.length>=walletInfo?.data?.ownerArr?.length?true:false}
            onClick={() => { props.AddNewOwner() }}
            style={{
              color: "#4D9623",
              fontWeight: "350",
              textAlign: "left",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center"
            }}
          >
            <PlusOutlined style={{ marginRight: ".2rem" }} />
            添加新的拥有者
          </Grid>

          <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
            <LoadingButton
              onClick={() => { props.onClose() }}
              variant="contained"
              sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
              style={{ backgroundColor: "#D9F19C", color: "#000000" }}
            >
              取消
            </LoadingButton>
            <LoadingButton
              onClick={() => { NavigateConfirm() }}
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

export default AddOwner;