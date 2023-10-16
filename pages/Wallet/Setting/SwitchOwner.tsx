import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Divider,
  Typography,
} from '@mui/material'
import {
  LeftOutlined,
} from '@ant-design/icons';
import LoadingButton from '@mui/lab/LoadingButton';
import { CssTextField } from '@/component/CssComponent';
import { useRouter } from 'next/router';
import logo from '@/public/建国.jpg'
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import useWallet from '@/hooks/useWallet';
import { formatAddress } from '@/utils/utils';
import { addressRecover } from '@/utils/utils';
import { ErrorAddressMessage, CheckAddressCorrect } from '@/utils/utils';
export default function SwitchOwner(props: any) {
  const router = useRouter();
  const { walletInfo } = useWallet.useContainer();
  const [save, setSave] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>();
  const [switchIndex, setSwitchIndex] = useState<any>();


  useEffect(() => {
    console.log(router.query?.switchIndex);
    let temp = parseInt(router?.query?.switchIndex as string);
    console.log(temp);
    setSwitchIndex(temp);
    console.log(switchIndex);
  }, [router])



  //地址输入框
  const HandleNewAddress = (address: string) => {
    let tempAddress = address;
    if (tempAddress.substring(0, 2).includes("fb")) {
      tempAddress = addressRecover(tempAddress);
    }
    setNewAddress(tempAddress);
  }

  const HandleNewtName = (name: string) => {
    setNewName(name)
  }





  const NavigateConfirm = () => {
    console.log(newAddress);
    let ownerAddress = walletInfo?.data?.ownerArr.map((item: any) => item?.address);
    if(newAddress===undefined||newAddress===''){
      toast.error("地址不能为空");
      return 
    }
    else if(!CheckAddressCorrect(newAddress??"")){
      toast.error("地址格式错误");
      return;
    }
    else if (ownerAddress.includes(newAddress)) {
      toast.error("该地址已存在");
      return ;
    }
    else {
      router.push({
        pathname: "/Wallet/Setting/SwitchConfirm",
        query: {
          switchIndex: switchIndex,
          switchAddress:newAddress,
          switchName:newName,
        }
      })
    }

  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: "93.5vh" }}>
      <Grid
        sx={{ padding: "1rem", }}
        onClick={() => { router.push('/Wallet/Setting') }}
        container
        alignItems={'center'}
      ><LeftOutlined style={{ marginRight: ".3rem" }} />当前拥有者</Grid>
      <Grid
        container
        item
        sx={{
          flexGrow: 10,
          padding: "1rem",
          borderRadius: "12px 12px 0 0 ",
          background: "#FFFFFF"
        }}
        flexDirection={"column"}
      >
        <Typography
          sx={{
            color: "#272727",
            fontWeight: "400",
            textAlign: "left",
            fontSize: "1rem"
          }}
        >
          当前拥有者
        </Typography>
        <Grid
          container
          alignItems={"center"}
          sx={{ marginTop: "1.5rem" }}
        >
          <Grid
            container
            item
            xs={1}
          >
            <Image
              alt=""
              src={walletInfo?.data?.ownerArr[parseInt((router.query?.switchIndex) as string)]?.img}
              width={30}
              height={30}
              style={{
                width: "1.5rem",
                height: "1.5rem",
                marginRight: ".5rem"
              }} />
          </Grid>
          <Grid
            container
            flexDirection={"column"}
            item
            xs={3}
          >
            <Typography
              sx={{
                color: "#000000",
                fontWeight: "350",
                textAlign: "center",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >

              {walletInfo?.data?.ownerArr[parseInt((router.query?.switchIndex) as string)]?.name}
            </Typography>
            <Typography
              sx={{
                color: "#4D9623",
                fontWeight: "400",
                textAlign: "center",
                fontSize: ".75rem",
                display: "flex",
                alignItems: "center",
              }}
            >

              {formatAddress(walletInfo?.data?.ownerArr[parseInt((router.query?.switchIndex) as string)]?.address ?? "")}
            </Typography>
          </Grid>

        </Grid>

        <Grid
          container
          item
          sx={{
            minHeight: "13.56rem",
            padding: "1.375rem 1.375rem",
            borderRadius: "12px",
            background: "#F9FDF2",
            marginTop: "1.5rem"
          }}
          flexDirection={"column"}
        >
          <Grid>新的拥有者名称</Grid>
          <CssTextField
            sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
            InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
            placeholder='拥有者名称'
            variant="outlined"
            // error={flag}
            // helperText={flag ? "1" : ""}
            value={newName}
            onChange={(e) => { HandleNewtName(e.target.value) }}
          />
          <Grid sx={{ marginTop: "1.3rem" }}>新的拥有者地址</Grid>
          <CssTextField
            sx={{ width: "100%", padding: "0", marginTop: ".625rem" }}
            InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
            placeholder='请输入拥有者地址'
            variant="outlined"
            value={newAddress ?? ''}
            onChange={(e) => { HandleNewAddress(e.target.value) }}
          />
        </Grid>
        <LoadingButton
          onClick={() => {
            NavigateConfirm()
          }}
          variant="contained"
          sx={{ marginTop: "1.5rem", height: "2.31rem", borderRadius: "1.125rem" }}
          style={{ backgroundColor: " rgba(5, 5, 5, 0.76)" }}
        >
          下一步
        </LoadingButton>
      </Grid>
    </Box >
  )
}
