import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import {
  Box,
  Grid,
  Typography,
  Divider,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputAdornment
} from '@mui/material'
import {
  LeftOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import LoadingButton from '@mui/lab/LoadingButton';
import { CssTextField } from '@/component/CssComponent';
import { useRouter } from 'next/router';
import { useContractInput } from '@/hooks/useContractInput';
export default function CreateAccount(props: any) {
  const router = useRouter();
  const {
    inputContract,
    inputAbi,
    selectFunc,
    mintValue,
    paramsArr,
    funcName,
    inputParamsArr,
    showContract,
    custom,
    inputPayload,
    Generate,
    setInputPayload,
    setCustom,
    HandleMintValue,
    HandleInputContract,
    HandleInputAbi,
    HandleFuncName,
    HandleInputParams,
    GeneratePayload
  } = useContractInput();
  const [save,setSave] = useState<boolean>(false);


  const Navigate = ()=>{
    if(custom){
      Generate()
    }
    else {
      GeneratePayload();
    }

  }

  return (
    <>
      <Box
      // sx={{ padding: "1rem" }}
      >
        <Grid
          sx={{ padding: "1rem" }}
          onClick={() => { router.back() }}
          container
          alignItems={'center'}
        ><LeftOutlined style={{ marginRight: ".3rem" }} />调用合约
        </Grid>
        <Box sx={{ backgroundColor: "#fff", minHeight: "46.6rem", padding: "1rem  1rem 5rem 1rem", borderRadius: "18px 18px 0px 0px" }}>
          <Grid
            container
            justifyContent={"space-between"}
          >
            <Typography
              sx={{
                color: "#000000",
                fontWeight: "500",
                textAlign: "center",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center"
              }}
            >
              <FileTextOutlined style={{ lineHeight: ".5rem", marginRight: ".5rem", color: "#4D9623" }} />
              新交易
            </Typography>

            <Typography
              sx={{
                color: "#000000",
                fontWeight: "400",
                textAlign: "center",
                fontSize: ".875rem",
                display: "flex",
                alignItems: "center"
              }}
            >
              <Switch checked={custom} onChange={(e) => {
                setCustom(e.target.checked);
              }} />
             自定义数据
            </Typography>


          </Grid>

          <Divider variant="middle"></Divider>
          <Grid
            container
            item
            sx={{
              minHeight: "12.625rem",
              padding: "1rem",
              borderRadius: "12px",
              background: "#F9FDF2",
              marginTop: ".625rem"
            }}
            flexDirection={"column"}
          // justifyContent={"space-around"}
          // alignItems={"center"}
          >
            <Typography sx={{ color: "#000000", marginBottom: "10px", fontWeight: "400", textAlign: "left", fontSize: ".875rem" }}>合约地址</Typography>
            <CssTextField
              sx={{ width: "100%", padding: "0" }}
              InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
              placeholder='填写合约地址'
              variant="outlined"
              // error={flag}
              // helperText={flag ? "1" : ""}
              value={inputContract ?? ""}
              onChange={(e) => { HandleInputContract(e.target.value) }}
            />
            {
              custom
              ?<></>
              :<>
              <Typography sx={{ marginTop: "1.5rem", color: "#000000", marginBottom: "10px", fontWeight: "400", textAlign: "left", fontSize: ".875rem" }}>ABI</Typography>
            <CssTextField
              sx={{ width: "100%", padding: "0" }}
              InputProps={{ style: { height: "7.125rem", fontSize: ".875rem", backgroundColor: "#FFFFFF", overflow: "auto" } }}
              placeholder='ABI'
              variant="outlined"
              multiline
              // error={flag}
              // helperText={flag ? "1" : ""}
              value={inputAbi ?? ''}
              onChange={(e) => { HandleInputAbi(e.target.value) }}
            /></>
            }
            
            {/* //地址有值 显示下面的解析内容 */}
            {
              1
                ? <>
                  <Divider sx={{ marginTop: "1.5rem" }}></Divider>
                  <Typography
                    sx={{
                      marginTop: ".8125rem",
                      color: "#6A6A6A",
                      marginBottom: "10px",
                      fontWeight: "400",
                      textAlign: "left",
                      fontSize: ".875rem"
                    }}>交易信息
                  </Typography>
                  <Typography
                    sx={{
                      // marginTop:".8125rem",
                      color: "#000000",
                      marginBottom: "10px",
                      fontWeight: "400",
                      textAlign: "left",
                      fontSize: ".875rem"
                    }}>地址
                  </Typography>
                  <CssTextField
                    sx={{ width: "100%", padding: "0" }}
                    InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF" } }}
                    placeholder='填写合约地址'
                    variant="outlined"
                    value={showContract ?? ""}
                    disabled={true}
                  // onChange={(e) => { props.handleChangeOwnerAddress(e, index) }}
                  />
                   <Typography
                    sx={{
                      // marginTop:".8125rem",
                      color: "#000000",
                      marginTop: "10px",
                      fontWeight: "400",
                      textAlign: "left",
                      fontSize: ".875rem"
                    }}>金额
                  </Typography>
                  <CssTextField
                    sx={{ width: "100%", padding: "0" }}
                    InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF", marginTop: ".625rem" } }}
                    placeholder='传入合约金额'
                    variant="outlined"
                    type={"number"}
                    // error={flag}
                    // helperText={flag ? "1" : ""}
                    value={mintValue ?? ""}
                    onChange={(e) => { HandleMintValue(e.target.value) }}
                  />
                  {/* 根据custom选择是解析还是自定义 */}
                  {
                    custom
                      ?
                      <>
                        <Typography
                          sx={{
                            marginTop: "2rem",
                            color: "#000000",
                            marginBottom: "10px",
                            fontWeight: "400",
                            textAlign: "left",
                            fontSize: ".875rem"
                          }}>payload
                        </Typography>
                        <CssTextField
                           sx={{ width: "100%", padding: "0" }}
                           InputProps={{ style: { height: "7.125rem", fontSize: ".875rem", backgroundColor: "#FFFFFF", overflow: "auto" } }}
                           placeholder='payload'
                           variant="outlined"
                           multiline
                           value={inputPayload ?? ''}
                           onChange={(e) => { setInputPayload(e.target.value) }}
                        // value={item?.address ?? ''}
                        // onChange={(e) => { props.handleChangeOwnerAddress(e, index) }}
                        />

                      </>
                      :
                      <>
                        <Typography
                          sx={{
                            marginTop: "2rem",
                            color: "#000000",
                            marginBottom: "10px",
                            fontWeight: "400",
                            textAlign: "left",
                            fontSize: ".875rem"
                          }}>选择合约方法
                        </Typography>
                        <FormControl fullWidth>
                          <Select
                            id="demo-simple-select"
                            sx={{
                              height: "2.5rem",
                            }}
                            // MenuProps={{ PaperProps: { style: {display: "flex"} } }}
                            style={{
                              display: "flex",
                              backgroundColor: "#fff",
                              padding: ".5rem"
                            }}
                            value={funcName ?? "default"}
                            onChange={(e) => { HandleFuncName(e.target.value) }}
                          >
                            <MenuItem value="default" disabled>
                              Select an option
                            </MenuItem>
                            {
                              selectFunc.map((item: any, index: number) => {
                                return (
                                  <MenuItem sx={{ height: "1.75rem", }} value={item}>
                                    {item}
                                  </MenuItem>
                                )
                              })
                            }
                          </Select>
                        </FormControl>
                        {
                          inputParamsArr?.map((item: any, index: number) => {
                            return (
                              <Grid
                                container
                                flexDirection={"column"}
                                key = {index}
                              >
                                <CssTextField
                                  sx={{ width: "100%", padding: "0" }}
                                  InputProps={{ style: { height: "40px", fontSize: ".875rem", backgroundColor: "#FFFFFF", marginTop: ".625rem" } }}
                                  variant="outlined"
                                  placeholder = {`param ${index+1}`}
                                  value={item ?? ''}
                                  onChange={(e) => { HandleInputParams(index, e.target.value) }}
                                />
                              </Grid>
                            )
                          })

                        }

                      </>

                  }
                </>
                : <></>
            }

          </Grid>
          {/* //解析出地址 */}
          {
            1 ?
              <Grid sx={{ paddingBottom: "5rem" }}>
                <LoadingButton
                  onClick={() => {Navigate()}}
                  variant="contained"
                  sx={{ width: "100%", height: "2.31rem", borderRadius: "1.125rem", marginTop: "2rem" }}
                  style={{ backgroundColor: " rgba(5, 5, 5, 0.76)" }}
                >
                  添加交易
                </LoadingButton>
              </Grid>
              : <></>
          }
        </Box >
      </Box>

    </>


  );
}
