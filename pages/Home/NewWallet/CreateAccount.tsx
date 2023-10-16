import  React,{useState,useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { Box, Grid, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, Divider, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import { CssTextField } from '@/component/CssComponent';
import { toast } from 'react-hot-toast';
export default function CreateAccount(props:any) {
  const [save,setSave] = useState(false);

  useEffect(()=>{
    if(props.walletName){
      setSave(true);
    }

  },[props.walletName])


  //检验是否可以跳转下一步
  const NextSecond = ()=>{
    if(save){
      props.NextStep();
    }
    else {
      toast.error("名称不能为空")
    }
  }


  return (
      <Box sx={{ marginTop: "1.5rem", backgroundColor: "#fff", height: "77.22vh", padding: "1rem", borderRadius: "18px 18px 0px 0px" }}>
        <Grid sx={{
          fontSize: "1.125rem",
          fontWeight: "500",
          lineHeight: "26px",
          letterSpacing: "0px",
          marginBottom: ".625rem"
        }}>① 请填写您的多签钱包名称</Grid>
        <Divider variant="middle"></Divider>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{ marginTop: "1.56rem" }}
        >
          <Grid item xs={8}>
            <CssTextField
              value = {props.walletName}
              onChange={(e)=>{props.setWalletName(e.target.value)}}
              placeholder='输入多签钱包名称'
              inputProps={{
                maxLength: 10 // 设置最大字符数
              }}
              sx={{ width: "100%" }}
              InputProps={{ style: { height: "2.5rem" } }}
            />
          </Grid>


          <Grid
            item
            xs={3}
            sx={{ height: "2.5rem", backgroundColor: "#F4F9ED", borderRadius: ".3rem" }}
            container
            justifyContent={"center"}
            alignItems={"center"}
          >
            ETH 链
          </Grid>
          <LoadingButton
            onClick = {()=>{NextSecond()}}
            variant="contained"
            sx={{ width: "100%", height: "2.31rem", borderRadius: "1.125rem",marginTop:"3rem" }}
            style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
          >
            下一步
          </LoadingButton>
        </Grid>
      </Box >

  );
}
