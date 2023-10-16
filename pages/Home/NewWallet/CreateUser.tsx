import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import { CarryOutFilled, PlusOutlined, CloseOutlined, PropertySafetyFilled } from '@ant-design/icons'
// import {Divider} from "antd"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { CssTextField } from '@/component/CssComponent';
import { ErrorNameMessage, ErrorAddressMessage, ErrorWeightMessage } from '@/utils/utils';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';


export default function CreateUser(props: any) {
  const [save, setSave] = useState<boolean>(false);
  const router = useRouter();
  const NextThird = () => {
    console.log(save);
    if (save) {
      props.NextStep();
    }
    else {
      toast.error("请填写正确信息")
    }

  }
  console.log(save);


  useEffect(() => {
    console.log(props.weight);
    let totalWeight = 0;
    props?.ownerArr?.forEach((item: any) => { totalWeight += parseInt(item?.weight) });
    props?.ownerArr?.map((item: any, index: number) => {
      if (props.signType === 0) {
        if (
          ErrorAddressMessage(props.ownerArr, index) === ''
          && ErrorNameMessage(props.ownerArr, index) === ''
          && props.ownerArr[index].address !== undefined
          && props.ownerArr[index].name !== undefined
        ) {
          setSave(true);
        }
        else {
          setSave(false);
        }
      }
      else {
        if (ErrorAddressMessage(props.ownerArr, index) === ''
          && ErrorNameMessage(props.ownerArr, index) === ''
          && ErrorWeightMessage(props.ownerArr, index) === ''
          && props.ownerArr[index].address !== undefined
          && props.ownerArr[index].name !== undefined
          && props.ownerArr[index].weight !== undefined
          && props.weight <= totalWeight
          && props.weight !== undefined
          && props.weight != ''
        ) {
          setSave(true);
        }
        else {
          setSave(false);
        }

      }

    })
  }, [props.ownerArr, props?.weight])

  const selectColor = {
    color: "#4D9623"
  }




  return (
    <>
      <Box
        sx={{
          marginTop: ".5rem",
          minHeight: "2rem",
          padding: "1rem",
          borderRadius: "18px 18px 0px 0px"
        }}
      >
      </Box>
      <Box sx={{ backgroundColor: "#fff", minHeight: "77.22vh", padding: "1rem", borderRadius: "18px 18px 0px 0px" }}>
        <Grid sx={{
          fontSize: "1.125rem",
          fontWeight: "500",
          lineHeight: "26px",
          letterSpacing: "0px",
          marginBottom: ".625rem"
        }}>② 拥有者和确认信息</Grid>
        <Divider variant="middle"></Divider>
        <Grid
          container
          justifyContent={"center"}
          // alignItems={"center"}
          sx={{ marginTop: "1.56rem" }}
          flexDirection={"column"}
        >
          {/* 输入框 */}
          {
            props?.ownerArr?.map((item: any, index: any) => {
              return (
                <Grid
                  item
                  container
                  alignItems={"start"}
                  sx={{
                    width: "100%",
                    padding: "1.375rem 1.125rem",
                    backgroundColor: "#F9FDF2",
                    borderRadius: ".5rem",
                    marginBottom: "1rem"
                  }}
                  gap={"10px"}
                  flexDirection={'column'}
                >
                  <Grid container justifyContent={'flex-end'} sx={{ height: ".1rem" }}>
                    <CloseOutlined
                      style={{ color: "#A2A2A2" }}
                      onClick={() => {
                        props.DelUser(index)
                      }}
                    />
                  </Grid>
                  {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
                  <Typography sx={{ fontSize: ".875rem" }} >拥有者名称</Typography>
                  <CssTextField
                    sx={{ width: "100%", padding: "0" }}
                    InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 10 // 设置最大字符数
                    }}
                    placeholder='请输入用户名称'
                    variant="outlined"
                    value={item?.name || ''}
                    onChange={(e) => { props.HandleChangeOwnerName(e, index) }}
                    error={ErrorNameMessage(props.ownerArr, index) === '' ? false : true}
                    helperText={ErrorNameMessage(props.ownerArr, index)}
                  />
                  <Typography sx={{ fontSize: ".875rem", marginTop: ".5rem" }} >拥有者地址</Typography>
                  <CssTextField
                    value={item?.address ?? ''}
                    onChange={(e) => { props.HandleChangeOwnerAddress(e, index) }}
                    error={ErrorAddressMessage(props.ownerArr, index) === '' ? false : true}
                    helperText={ErrorAddressMessage(props.ownerArr, index)}
                    sx={{ width: "100%", padding: "0" }}
                    InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                    placeholder='请输入钱包地址'
                    variant="outlined"

                  />
                  {
                    props.signType === 0
                      ? <></>
                      : <>
                        <Typography sx={{ fontSize: ".875rem", marginTop: ".5rem" }} >权重</Typography>
                        <CssTextField
                          value={item?.weight ?? ''}
                          onChange={(e) => { props.HandleChangeOwnerWeight(e, index) }}
                          error={ErrorWeightMessage(props.ownerArr, index) === '' ? false : true}
                          helperText={ErrorWeightMessage(props.ownerArr, index)}
                          sx={{ width: "100%", padding: "0" }}
                          InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                          placeholder='请输入权重百分数'
                          variant="outlined"
                          type="number"
                        />

                      </>

                  }
                </Grid>
              )
            })
          }
          <Grid item container justifyContent={"start"}>
            <Button
              variant="text"
              startIcon={<PlusOutlined />}
              sx={{ color: "#4D9623" }}
              onClick={() => {
                props.AddUser();
              }}
            >
              添加新的拥有者
            </Button>
          </Grid>
          <Grid sx={{ width: "100%", marginTop: ".5rem" }}><Divider variant="middle"></Divider></Grid>
          <Box sx={{ minHeight: "10rem" }}>
            <Grid sx={{ margin: "1.5rem 0" }}>
              {
                props?.signType === 0
                  ? <>门槛值</>
                  : <>权重值</>
              }
            </Grid>
            <Grid container alignItems={'center'}>
              <Grid item xs={6} >
                {
                  props?.signType === 0
                    ? <FormControl fullWidth>
                      <Select
                        id="demo-simple-select"
                        sx={{
                          height: "2.5rem",
                          // border:"2px solid #4D9623",
                        }}
                        style={{ padding: ".5rem" }}
                        value={props.door}
                        onChange={(e) => { props.setDoor(e.target.value) }}
                      // error ={}
                      // label="Age"
                      // onChange={handleChange}
                      >
                        {
                          props?.ownerArr?.map((_: any, index: number) => {
                            return (
                              <MenuItem key={index} sx={{ height: "1.75rem" }} value={index + 1}>{index + 1}</MenuItem>
                            )
                          })
                        }
                      </Select>
                    </FormControl>
                    : <CssTextField
                      id="outlined-basic"
                      sx={{
                        width: "100%", padding: "0",
                      }}
                      type = {"number"}
                      value={props?.weight ?? ''}
                      onChange={(e) => { props.setWeight(parseFloat(e.target.value)) }}
                      InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                      placeholder='请输入权重值'
                      variant="outlined"
                      error={props?.weight > 100 ? true : false}
                      helperText={props?.weight > 100 ? "权重值不能大于100%" : ''}
                    />
                }
              </Grid>
              <Grid item sx={{ marginLeft: "2rem" }}>
                {
                  props?.signType === 0
                    ? <>out of {props.ownerArr.length} owner(s)</>
                    : <>%&nbsp;&nbsp;&nbsp; ≥&nbsp;&nbsp;&nbsp;权重值</>
                }
              </Grid>
            </Grid>

          </Box>

          <Grid container justifyContent={'space-around'} sx={{ height: "10rem" }}>
            <LoadingButton
              onClick={() => { props.BackStep() }}
              variant="contained"
              sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
              style={{ backgroundColor: "#D9F19C", color: "#000000" }}
            >
              返回
            </LoadingButton>
            <LoadingButton
              onClick={() => { NextThird() }}
              variant="contained"
              sx={{ width: "10rem", height: "2.31rem", borderRadius: "1.125rem", marginTop: "3rem" }}
              style={{ backgroundColor: "rgba(5, 5, 5, 0.76)" }}
            >
              下一步
            </LoadingButton>
          </Grid>


        </Grid>
      </Box >

    </>


  );
}
