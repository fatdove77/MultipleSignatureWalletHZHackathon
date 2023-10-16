import React, { useState,useEffect } from 'react'
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
import EditWindow from './EditWindow'
import AddOwner from './AddOwner';
import UpdateWeight from './UpdateOwnerWeight';
import DeleteWindow from './DeleteWindow';
import useWallet from '@/hooks/useWallet';
import { formatAddress } from '@/utils/utils';
import UpdateDoorNumber from './UpdateDoorNumber';
import { useAddOwner } from '@/hooks/useAddOwner';
import { useUpdateOwnerWeight } from '@/hooks/useUpdateOwnerWeight';
import DeleteConfirmWindow from './DeleteConfirmWindow';
import { useDeleteUpdateOwnerWeight } from '@/hooks/useDeleteUpdateOwnerWeight';
import copy from 'copy-to-clipboard';
function Setting() {
  const router = useRouter();
  const { 
    walletInfo, 
    UpdateBalance, 
    ChangeOwnerName
  } = useWallet.useContainer();
  const {
    showWalletArr,
    AddNewOwner,
    DeleteOwner,
    handleOwnerName,
    handleOwnerAddress,
    handleOwnerWeight
  } = useAddOwner();
  const {
    newWeightOwner,
    ChangeOwnerWeight
  } = useUpdateOwnerWeight()
  const {
    deleteIndex,
    setDeleteIndex,
    deleteOwner,
    ChangeDeleteOwnerWeight
  } = useDeleteUpdateOwnerWeight();
  const { provider } = Web3Provider.useContainer();
  //这个数组后期从缓存中提取一部分 比如代币符号和代币精度   缓存存储合约地址,精度,符号,余额/////////
  const [nowIndex, setNowIndex] = useState<number>();
  const [isEditName, setIsEditName] = useState(false);
  //控制添加拥有者弹窗
  const [isAddOwner, setIsAddOwner] = useState(false);
  //控制更改用户权重的弹窗
  const [isUpdateWeight, setIsUpdateWeight] = useState(false);
  //删除弹窗
  //更新权重弹窗
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [deleteWindow, setDeleteWindow] = useState<boolean>(false);
  const [editName,setEditName] = useState<string>();
  const [editAddress,setEditAddress] = useState<string>();
  //替换成员下标

  //编辑拥有者姓名
  const EditName = (index: number) => {
    setIsEditName(true);
    console.log(editName);
    setEditName(walletInfo?.data?.ownerArr[index].name);
    setEditAddress(walletInfo?.data?.ownerArr[index].address)
    setNowIndex(index);
  }

  //关闭添加拥有者弹窗
  const onClose = () => {
    setIsAddOwner(false);
  };

  //关闭更改权重弹窗
  const onCloseUpdate = () => {
    setIsUpdateWeight(false)
  }

  //关闭删除用户弹窗
  const onCloseDelete = () => {
    setIsDelete(false)
  }

  //删除按钮
  const HandleDeleteOwner = (index: number) => {
    console.log(index);
    setDeleteIndex(index);
    if (walletInfo?.data?.signType === 0) {
      setDeleteWindow(true);
    }
    else {
      setIsDelete(true);
    }

  }


  useEffect(() => {
    UpdateBalance();
  }, [provider])

  //更改门槛值 判断钱包类型
  const UpdateType = () => {
    //这里要加个if判断
    if (walletInfo?.data?.signType === 0) {
      router.push("/Wallet/Setting/UpdateDoorNumber")
    }
    else {
      router.push("/Wallet/Setting/UpdateWeight")
    }
  }


  return (
    <>
      <EditWindow
        isEditName={isEditName}
        setIsEditName={setIsEditName}
        ownerList={walletInfo?.data.ownerArr}
        walletInfo = {walletInfo}
        nowIndex={nowIndex}
        editAddress = {editAddress}
        editName = {editName}
        setEditAddress = {setEditAddress}
        setEditName = {setEditName}
        ChangeOwnerName = {ChangeOwnerName}
      />
      <AddOwner
        isAddOwner={isAddOwner}
        onClose={onClose}
        showWalletArr={showWalletArr}
        AddNewOwner={AddNewOwner}
        DeleteOwner={DeleteOwner}
        handleOwnerName={handleOwnerName}
        handleOwnerAddress={handleOwnerAddress}
        handleOwnerWeight={handleOwnerWeight}
      // setOwnerList ={setOwnerList}
      />
      <UpdateWeight
        // ownerList={walletInfo?.data.ownerArr}
        onCloseUpdate={onCloseUpdate}
        isUpdateWeight={isUpdateWeight}
        newWeightOwner={newWeightOwner}
        ChangeOwnerWeight={ChangeOwnerWeight}
      />
      <DeleteWindow
        onCloseDelete={onCloseDelete}
        isDelete={isDelete}
        deleteIndex={deleteIndex}
        deleteOwner = {deleteOwner}
        ChangeDeleteOwnerWeight = {ChangeDeleteOwnerWeight}
      />
      <DeleteConfirmWindow
        deleteWindow={deleteWindow}
        setDeleteWindow={setDeleteWindow}
        deleteIndex={deleteIndex}
      />
      {/* //修改门限值 */}
      <Box
        sx={{ padding: "1rem" }}
      >
        <Grid
          sx={{ paddingBottom: "1rem" }}
          onClick={() => { router.push('/Wallet') }}
          container
          alignItems={'center'}
        ><LeftOutlined style={{ marginRight: ".3rem" }} />设置</Grid>
        <Grid>管理多签钱包拥有者</Grid>
        <Divider sx={{ margin: ".625rem 0 " }}></Divider>
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
              拥有者
            </Typography>
          </Grid>

          <Divider sx={{ margin: ".75rem 0 " }}></Divider>
          {
            walletInfo?.data?.ownerArr.map((item: any, index: any) => {
              return (
                <>
                  <Grid
                    container
                    item
                    key={index}
                    sx={{
                    }}
                    // flexDirection={"column"}
                    // justifyContent={"space-around"}
                    alignItems={"center"}
                  >
                    <Grid
                      item
                      container
                      xs={2}
                    >
                      <Image
                        alt=""
                        src={item?.img}
                        width={30}
                        height={30}
                        style={{
                          width: "2.4375rem",
                          height: "2.4375rem"
                        }} />

                    </Grid>

                    <Grid
                      container
                      item
                      flexDirection={"column"}
                      xs={4}
                    >
                      <Grid
                        container
                        alignItems={"center"}
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
                        {/* 根据钱包类型判断是否显示 */}
                        {
                          item?.weight
                            ? <Typography
                              sx={{
                                color: "#000000",
                                fontWeight: "350",
                                textAlign: "center",
                                fontSize: ".5rem",
                                marginLeft: "1rem"
                              }}
                            >
                              {item?.weight}%权重
                            </Typography>
                            : <></>

                        }

                      </Grid>

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
                        {formatAddress(item?.address ?? "")}
                        <CopyOutlined  onClick={()=>{copy(item?.address)}}  style={{ lineHeight: ".5rem", marginRight: ".5rem" }} />

                      </Typography>
                    </Grid>
                    <Grid
                      container
                      item
                      flexDirection={"column"}
                      // justifyContent={"flex-end"}
                      alignItems={"flex-end"}
                      xs={6}
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
                          onClick={() => { EditName(index) }}
                          style={{
                            fontSize: "1rem",
                          }} />
                        <UserSwitchOutlined
                          onClick={() => { router.push({ pathname: "Setting/SwitchOwner", query: {switchIndex:index} }) }}
                          style={{ fontSize: "1rem", margin: "0 1.2rem" }} />
                        <DeleteOutlined
                          onClick={() => { HandleDeleteOwner(index) }}
                          style={{ fontSize: "1rem" }}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ margin: "1rem 0 " }}></Divider>
                </>

              )
            })
          }
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >

            <Grid
              onClick={() => { setIsAddOwner(true) }}
              sx={{
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
            {
              walletInfo?.data?.signType === 1
                ? <Grid
                  onClick={() => { setIsUpdateWeight(true) }}
                  sx={{
                    width: "7.9rem",
                    height: "2rem",
                    color: "#414141",
                    backgroundColor: "#D9F19C",
                    borderRadius: ".75rem",
                    fontWeight: "350",
                    textAlign: "center",
                    fontSize: "1rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  更改用户权重
                </Grid>
                : <></>
            }
          </Grid>

        </Grid>
        {/* <EditWindow
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        inputAddress={inputAddress}
        inputName={inputName}
      ></EditWindow> */}
        <Grid
          container
          item
          sx={{
            minHeight: "9.8675rem",
            padding: "1rem 1.375rem",
            borderRadius: "12px",
            background: "#FFFFFF",
            marginTop: ".75rem"
          }}
          flexDirection={"column"}
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
              <CarryOutFilled style={{ fontSize: "1.125rem", color: "#4D9623", marginRight: ".5rem" }} />
              门槛
            </Typography>
          </Grid>

          <Divider sx={{ margin: ".75rem 0 " }}></Divider>
          <Grid
            container
            item
            sx={{
              minHeight: "4.56rem",
              padding: ".4rem 1rem",
              borderRadius: "12px",
              background: "rgba(244, 244, 244, 0.58)"
            }}
            flexDirection={"column"}
          >
            <Typography
              sx={{
                color: "##000000",
                fontWeight: "350",
                textAlign: "left",
                fontSize: ".875rem"
              }}
            >
              {/* 根据钱包种类显示 */}
              {
                walletInfo?.data?.signType === 0 ? <>门限值</> : <>权重值</>
              }
            </Typography>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={{ marginTop: ".5rem" }}
            >
              <Typography
                sx={{
                  color: "#000000",
                  fontWeight: "350",
                  textAlign: "center",
                  fontSize: ".75rem",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <TeamOutlined style={{ fontSize: ".825rem", color: "#8F8F8F", marginRight: ".5rem" }} />

                {
                  walletInfo?.data?.signType === 0
                    ? <>{`${walletInfo?.data?.door} out of ${walletInfo?.data?.ownerArr?.length} owners`}</>
                    : <>{`≥ ${walletInfo?.data?.weight} %权重通过`}</>
                }
              </Typography>
              <Button
                onClick={() => { UpdateType() }}
                style={{
                  lineHeight: ".75rem",
                  width: "3.8rem",
                  height: "1.5rem",
                  border: "1px solid #4D9623",
                  color: "#4D9623",
                  borderRadius: ".75rem",
                  fontSize: ".75rem",
                  fontWeight: "400"
                }}
              >
                更改
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Setting