import React, { useState,useEffect } from 'react'
import Web3Provider from '@/store/Web3Provider'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
} from '@mui/material'
import {
  CopyOutlined,
  LeftOutlined,
  UserOutlined,
  DeleteOutlined,
  FormOutlined,
  ExportOutlined,
  PlusCircleFilled
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import logo from '@/public/建国.jpg'
import Image from 'next/image';
import EditWindow from './EditWindow';
import AddressBooksStore from '@/store/AddressBooksStore';
import { formatAddress } from '@/utils/utils';
import Coin from '@/store/Coin';
import useWallet from '@/hooks/useWallet';
import copy from 'copy-to-clipboard';
function AddressBook() {
  const { 
    addressBook,
    sendIndex,
    setSendIndex,
    setName,
    setAddress,
    DeleteAddressBook,
    EditAddressBook,
    setEditFlag,
    editFlag,
   } = AddressBooksStore.useContainer();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [EditIndex,setEditIndex] = useState<number>();
  //新建
  const AddAddress = () => {
    setEditFlag(false); //不是编辑
    setName('')
    setAddress('')
    setIsEdit(true)
  }
  const { walletInfo } = useWallet.useContainer();
  const { coinList,InitCoinList } = Coin.useContainer();
  const { provider, account } = Web3Provider.useContainer();


  useEffect(()=>{
    InitCoinList();
  },[provider,walletInfo])

  //跳转发送
  const NavigateSend = (index:number)=>{
    setSendIndex(index);
    router.push({ pathname: '/Wallet/InitiateTrade/SendCoin' });
  }

  return (
    <Box
      sx={{ padding: "1rem" }}
    >
      <Grid
        sx={{ paddingBottom: "1rem" }}
        onClick={() => { router.push('/Wallet') }}
        container
        alignItems={'center'}
      ><LeftOutlined style={{ marginRight: ".3rem" }} />地址簿</Grid>
      <Grid
        container
        item
        sx={{
          // minHeight: "8.5rem",
          padding: "1rem 1.375rem",
          borderRadius: "12px",
          background: "#FFFFFF"
        }}
        flexDirection={"column"}
      // justifyContent={"space-around"}
      // alignItems={"center"}
      >
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
        // sx={{ padding: "1rem" }}
        >
          <Typography
            sx={{
              color: "#000000",
              fontWeight: "400",
              textAlign: "left",
              fontSize: "1.125rem",
              display: "flex",
              alignItems: "center"
            }}
          >
            <UserOutlined style={{ fontSize: "1.125rem", color: "#4D9623", marginRight: ".5rem" }} />
            名称
          </Typography>
          <Button
            onClick={() => { AddAddress() }}
            startIcon={<PlusCircleFilled style={{ fontSize: "25.38px", color: "#404040", marginLeft: ".4rem" }} />}
            sx={{
              width: "7.1875rem",
              height: "2rem",
              borderRadius: "3rem",
              padding: "0",
              justifyContent: "space-between",
              color: "#000000",
              border: "1px solid #CAD2C2 ",
            }}
            style={{ backgroundColor: "#FFFFFF" }}
            variant="outlined"
          // onClick={() => { connect(config.DEFAULT_NETWORK_ID, config.DEFAULT_WALLET_TYPE) }}
          >
            添加地址 &nbsp;
          </Button>
        </Grid>

        <Divider sx={{ margin: ".875rem 0 " }}></Divider>
        {
          addressBook && addressBook.map((item, index) => {
            return (
              <Grid container key = {index} flexDirection={"column"}>
                <Grid
                  container
                  item
                  sx={{
                  }}
                  alignItems={"center"}
                >
                  <Grid
                    item
                    container
                    xs={2}
                  >
                    <Image
                      alt=""
                      src={item.img}
                      width={50}
                      height={50}
                      style={{
                        width: "2.4375rem",
                        height: "2.4375rem"
                      }} />

                  </Grid>

                  <Grid
                    container
                    item
                    flexDirection={"column"}
                    xs={3}
                  >
                    <Typography
                      sx={{
                        color: "#000000",
                        fontWeight: "350",
                        textAlign: "center",
                        fontSize: "1rem"
                      }}
                    >
                      {item?.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#4D9623",
                        fontWeight: "400",
                        textAlign: "center",
                        fontSize: ".75rem",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {formatAddress(item?.address)}
                      <CopyOutlined  onClick={()=>{copy(walletInfo?.address)}}  style={{ lineHeight: ".5rem", marginRight: ".5rem" }} />

                    </Typography>
                  </Grid>
                  <Grid
                    container
                    item
                    flexDirection={"column"}
                    // justifyContent={"flex-end"}
                    alignItems={"flex-end"}
                    xs={7}
                  >
                    <Typography
                      sx={{
                        color: "#555555",
                        fontWeight: "350",
                        textAlign: "center",
                        fontSize: ".875rem"
                      }}
                    >
                      <FormOutlined
                        onClick={() => {
                          // EditAddress(item.name, item.address)
                          setEditFlag(true);
                          setEditIndex(index);
                          setName(item.name)
                          setAddress(item.address)
                          setIsEdit(true)
                        }}
                        style={{
                          fontSize: "1rem",
                          marginRight: "1.2rem"
                        }} />
                      <DeleteOutlined 
                        onClick={()=>{DeleteAddressBook(index)}}
                        style={{ fontSize: "1rem" }} 
                      />
                    </Typography>
                    <Typography
                      onClick={() => {NavigateSend(index)}}
                      sx={{
                        color: "#4D9623",
                        fontWeight: "350",
                        textAlign: "center",
                        fontSize: ".625rem",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "1.3125rem",
                        backgroundColor: "#EDF7E5",
                        padding: "0 .5rem",
                        height: "1.375rem",
                        marginTop: ".5rem"
                      }}
                    >
                      <ExportOutlined style={{ marginRight: ".3rem" }} />
                      发送
                    </Typography>
                  </Grid>
                </Grid>
                <Divider  sx={{ margin: "1rem 0 " }}></Divider>
              </Grid>

            )
          })
        }
      </Grid>
      <EditWindow
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        EditIndex = {EditIndex}
        
      ></EditWindow>
    </Box>
  )
}

export default AddressBook