import { useMemo, useState, useEffect } from 'react';
//hooks
import { useSingleCallResult, useMessage } from '@/hooks';
//工具类
import { type BigNumber } from 'bignumber.js';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { type MethodArg, digitalPrecision, setObjBigNumber } from '@/utils/utils';
//个人钱包方法
import Web3Provider from '@/store/Web3Provider';
//提示
import toast from 'react-hot-toast';
//状态管理
import TransferInfo from '@/store/TransferInfo';
import dayjs from 'dayjs';
import { GetSignature } from '@/utils/CommonSignature';
import { useDoorContract, uesWeightContract } from '@/hooks/useContract';
import {
  AddSignature,
  GetSignedAddress,
  GetOwnerSignList,
  PostFinished,
  GetHistoryList,
  AddMembers,
  AddWeightMembers
} from '@/request/api';
import config from '@/config';
import { ethers } from 'ethers';
export const useAddOwnerProcess = () => {
  const { provider, account } = Web3Provider.useContainer();
  const { transferInfo } = TransferInfo.useContainer();
  console.log("信息✅✅✅✅✅:", transferInfo);
  const { Message } = useMessage();
  const DoorContract = useDoorContract(transferInfo?.walletInfo.address);
  const WeightContract = uesWeightContract(transferInfo?.walletInfo.address);
  const [diffTime, setDiffTime] = useState<string>();
  const [flag, setFlag] = useState<boolean>(true);
  const [steps, setSteps] = useState<any>([
    {
      label: flag ? '创建' : '在链上创建被拒绝'
    },
    {
      label: '确认',
      description: '(1 out of 2)',
    },
    {
      label: '执行',
      description: ``,
      type: "execute"
    },
  ])
  const initSteps = [
    {
      label: flag ? '创建' : '在链上创建被拒绝'
    },
    {
      label: '确认',
      description: '(1 out of 2)',
    },
    {
      label: '执行',
      description: ``,
      type: "execute"
    },
  ];  //用于初始化 每次更新 先从这里取值 进行插入操作之后再赋值给step

  const [activeNumber, setActiveNumber] = useState<number>(2);//控制步骤
  const [isOwner, setIsOwner] = useState<boolean>(false);  //当前用户是否是多签内用户
  const [isSign, setIsSign] = useState<boolean>(false);//当前用户是否签名
  const [signedArr, setSignedArr] = useState<any>([]); //已经签名的数组
  const [isExecute, setIsExecute] = useState<boolean>(false);  //是否可以执行
  const [isSignAndExecute, setIsSignAndExecute] = useState<boolean>(false);  //可以签名并执行
  const [executeLoading, setExecuteLoading] = useState<boolean>(false);
  const [isEqual, setIsEqual] = useState<number>(0); //当前nonce和后端nonce
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [listLoading,setListLoading] = useState<boolean>(true);
  //更新过程队列 把数组插入进去
  const MakeProcess = async () => {
    let signedList: any = [];
    let unSignedList: any = [];
    try {
      await GetSignedAddress(transferInfo?.walletInfo.address, transferInfo?.nonce)
        .then(async (res: any) => {
          console.log(res.data);
          //更新steps
          let flag = await CheckIsFinish();
          if (flag) {
            let finishStep = transferInfo?.walletInfo?.data?.ownerArr.map((item: any, index: number) => ({
              label: item.name ?? `用户${index}`,
              description: item?.address,
              img: item?.img,
              type: "account",
              weight: item?.weight ?? undefined
            }))
            console.log("已完成数组",finishStep);
            let temp_steps = initSteps;
            if (transferInfo?.walletInfo.data.signType === 0) {
              temp_steps[1].description = `(${transferInfo?.walletInfo?.data?.door} out of ${transferInfo?.walletInfo?.data?.ownerArr.length})`
            }
            else {
              temp_steps[1].description = `(权重 ≥ ${transferInfo?.walletInfo?.data?.weight}执行)`
            }
            temp_steps.splice(2, 0, ...finishStep);
            let deMultiTempSteps = Array.from(new Set(temp_steps.map(item => item.label))).map((label) => {
              return temp_steps.find(item => item.label === label)
            })
            console.log(temp_steps, deMultiTempSteps);
            setSteps(deMultiTempSteps);
          }
          else {
            //1.签名数组
            signedList = transferInfo?.walletInfo.data.ownerArr.filter((obj: any) => (res.data?.signed_addresses)?.includes(obj.address));
            setSignedArr(signedList)
            //2.未签名数组
            unSignedList = transferInfo?.walletInfo.data.ownerArr.filter((obj: any) => (res.data.unsigned_addresses)?.includes(obj.address));
            //3.修改数组数据结构
            signedList = signedList.map((item: any, index: number) => ({
              label: item.name ?? `用户${index}`,
              description: item?.address,
              img: item?.img,
              type: "account",
              weight: item?.weight ?? undefined
            }))
            unSignedList = unSignedList.map((item: any, index: number) => ({
              label: item.name ?? `用户${index}`,
              description: item?.address,
              img: item?.img,
              type: "account",
              weight: item?.weight ?? undefined

            }))
            console.log("签名地址数组", signedList, "未签名地址数组", unSignedList);
            //4.插入  如果完成了 插入老walletInfo 如果没完成 那么调用接口
            let temp_steps = initSteps;
            if (transferInfo?.walletInfo.data.signType === 0) {
              temp_steps[1].description = `(${transferInfo?.walletInfo?.data?.door} out of ${transferInfo?.walletInfo?.data?.ownerArr.length})`
            }
            else {
              temp_steps[1].description = `(权重 ≥ ${transferInfo?.walletInfo?.data?.weight}执行)`
            }
            temp_steps.splice(2, 0, ...signedList, ...unSignedList);
            let deMultiTempSteps = Array.from(new Set(temp_steps.map(item => item.label))).map((label) => {
              return temp_steps.find(item => item.label === label)
            })
            console.log(temp_steps, deMultiTempSteps);
            setSteps(deMultiTempSteps);

          }

        })
      return { signedList, unSignedList }
    } catch (error) {
      console.log(error);
      console.log("调用历史队列接口出错");
    }
  }

  //查看当前nonce是否成功 如果成功就直接把stepNumber拉满
  const CheckIsFinish = async () => {
    let flag: boolean = false;//判断是否完成
    try {
      await GetHistoryList(transferInfo?.walletInfo?.address).then((res: any) => {
        console.log(res.data[transferInfo?.nonce].Hash);
        if (res.data[transferInfo?.nonce].Hash != '') {
          flag = true;
        }
      })
    } catch (error) {
      console.log("获取事务列表出错");
      console.log(error);
    }
    return flag;
  }
  //更新交易队列
  const UpdateSignProcess = async () => {
    let list: any;
    let signedList: any = [];
    let unSignedList: any = [];
    let flag: boolean = false;  //是否已执行
    console.log(isEqual);
    // 获取签名成功和未签名的数组
    console.log(transferInfo?.walletInfo.address, transferInfo?.nonce);
    list = await MakeProcess();
    console.log("返回数组:", list);
    signedList = list.signedList;
    unSignedList = list.unSignedList;
    console.log("已签名数组", signedList, unSignedList);
    flag = await CheckIsFinish();
    console.log("是否执行", flag);
    setIsFinish(flag);
    // //5.设置stepnumber
    if (flag === true) {
      setActiveNumber(transferInfo?.walletInfo?.data?.ownerArr.length+3);
    }
    else {
      setActiveNumber(2 + signedList?.length)
      //检验用户是否签名
      console.log(account, signedList);
      if (signedList.some((obj: any) => obj.description === account)) {
        setIsSign(true);
        console.log("已签名");
      }
      else {
        setIsSign(false);
        console.log("未签名");
      }
      //检验是否可以执行
      console.log(isEqual);
      if (transferInfo?.walletInfo.data.signType === 0) {
        if (signedList.length >= transferInfo?.walletInfo.data.door) {
          setIsExecute(true);
        }
        //没签名并且现在就差一个人 并且nonce值相等
        else if (transferInfo?.walletInfo.data.door - signedList.length === 1 && isSign == false) {
          setIsSignAndExecute(true);
        }
        else {
          setIsExecute(false);
          setIsSignAndExecute(false);
        }
      }
      else {
        let weight: number = 0; //已经签名的用户累计的权重
        //当前用户权重
        let nowAccountWeight: number = 0;
        transferInfo?.walletInfo.data.ownerArr.map((item: any) => {
          if (item.address === account) {
            nowAccountWeight = item?.weight
          }
        })
        console.log("当前用户的权重", nowAccountWeight);
        signedList.map((item: any) => { weight += item.weight });
        console.log("已签名用户权重", weight);
        if (weight >= transferInfo?.walletInfo?.data?.weight) {
          setIsExecute(true);
        }
        else if (transferInfo?.walletInfo.data.weight - weight <= nowAccountWeight && isSign === false) {
          setIsSignAndExecute(true);
        }
        else {
          setIsExecute(false);
          setIsSignAndExecute(false)
        }
      }
    }
    setListLoading(false);

  }

  //用户进行签名操作
  const OwnerSign = async () => {
    setExecuteLoading(true);
    setListLoading(true);
    // EIP712标准签名格式。
    const domain = {
      name: "MultiSignature",
      version: "1",
      chainId: config.CHAIN_ID,
      verifyingContract: transferInfo?.walletInfo.address,  //需要小写吗？
    };
    console.log(domain);
    let addOwnerTypes: any;
    let addOwnerMessage: any;
    if (transferInfo?.walletInfo?.data?.signType === 0) {
      addOwnerTypes = {
        AddOwner: [
          { name: "owner", type: "address" },
          { name: "threshold", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      };
      addOwnerMessage = {
        owner: transferInfo?.updateOwnerArr[0]?.address,
        threshold: transferInfo?.walletInfo?.data?.door,
        nonce: transferInfo?.nonce
      }
    }
    else {
      addOwnerTypes = {
        AddOwner: [
          { name: "owner", type: "address" },
          { name: "owners", type: "address[]" },
          { name: "weights", type: "uint256[]" },
          { name: "nonce", type: "uint256" },
        ],
      };
      let temp_weights = transferInfo?.updateOwnerArr.map((item: any) => item?.weight);
      let temp_owners = transferInfo?.updateOwnerArr.map((item: any) => item?.address);
      addOwnerMessage = {
        owner: transferInfo?.updateOwnerArr[0]?.address,
        owners: temp_owners,
        weights: temp_weights,
        nonce: transferInfo?.nonce
      }
    }
    //拿到打包后的签名 
    console.log("📝📝签名类型和签名信息", addOwnerTypes, addOwnerMessage);
    const res = await GetSignature(provider, account, domain, addOwnerTypes, addOwnerMessage);
    console.log("打包好后的签名", res)
    if (res === false) {
      setExecuteLoading(false);
    } else {
      //调用签名事务
      await SaveSignature(res);
    }

  }

  // 调用接口 存储当前签名
  const SaveSignature = async (signature: string) => {
    try {
      await AddSignature(transferInfo?.walletInfo.address, account, transferInfo?.nonce, signature).then(async() => {
        toast.success("签名成功");
        setExecuteLoading(false);
        await UpdateSignProcess()
      })
    } catch (error) {
      toast.error("发起签名事务接口出错")
    }
  }


  //签名并执行
  const OwnerSignAndExecute = async () => {
    setListLoading(true);
    setExecuteLoading(true);
    await OwnerSign().then(async () => {
      
    });
    await OwnerExeCute();
    setExecuteLoading(false);
  }


  //执行之前需要比对当前nonce和合约nonce是否相等 如果不想等那就说明不是队列头部的事务 就不允许执行
  const CompareNonce = async () => {
    if (DoorContract && WeightContract) {
      //当前nonce transferInfo?.nonce
      //合约nonce 
      if (transferInfo?.walletInfo?.data?.signType === 0) {
        try {
          const res = await DoorContract.nonce()
          console.log(res);
          await DoorContract.nonce()
            .then((res: any) => {
              console.log(res);
              console.log("合约的nonce:", res.toString());
              if (transferInfo?.nonce == parseInt(res.toString())) {
                setIsEqual(1)
                console.log("更新equal");
              }
              else if (transferInfo?.nonce > parseInt(res.toString())) {
                setIsEqual(2) //执行完了
              }
              else {
                setIsEqual(0) //前面还有没执行的合约
              }
            });
        } catch (error) {
          console.log("合约调用nonce出错", error);
        }
      }
      else {
        try {
          const res = await WeightContract.nonce();
          console.log(res.toNumber(), transferInfo?.nonce);
          if (transferInfo?.nonce == parseInt(res.toString())) {
            setIsEqual(1)
            console.log("更新equal");
          }
          else if (transferInfo?.nonce > parseInt(res.toString())) {
            setIsEqual(2) //执行完了
          }
          else {
            setIsEqual(0) //前面还有没执行的合约
          }
        } catch (error) {
          console.log("合约调用nonce出错", error);
        }
      }
    }

  }


  // 执行
  const OwnerExeCute = async () => {
    if (isEqual === 0) {
      toast.error("任务已经执行");
      return;
    }
    else if (isEqual === 2) {
      toast.error("请按顺序执行多签事务");
      return;
    }
    setExecuteLoading(true);
    setListLoading(true);
    let concatSignature: any = ''; //拼接好后的签名
    let res: any; //调用合约后的结果
    if (transferInfo?.walletInfo?.data?.signType === 0) {
      //调接口拿拼接好之后的签名///////////////
      concatSignature = await GetConcatSignature()
      console.log(concatSignature);
      res = await CallDoorTrans(concatSignature);
    }
    //权重类型 拼接签名需要加判断
    else {
      concatSignature = await WeightConcatSignature();
      console.log(concatSignature);
      res = await CallWeightTrans(concatSignature);

    }
  }


  //更改缓存中的用户信息
  const UpdateWalletInfo = () => {
    let walletArr: any = JSON.parse(localStorage.getItem("walletArr") ?? "[]");
    walletArr.map(async (item: any, index: number) => {
      //找到对应多签钱包
      if (item?.address === transferInfo?.walletInfo?.address) {
        item?.data?.ownerArr.push(transferInfo?.updateOwnerArr[0]);
        if (item?.data.signType === 0) {
          //调用接口添加成员
          await AddMembers(
            item?.address,
            transferInfo?.updateOwnerArr[0]?.address
          ).then((res: any) => {
            console.log("添加成功", res);
          })
        }
        else {
          //更新原有用户的权重
          transferInfo?.updateOwnerArr.map((owner: any, i: number) => {
            item?.data?.ownerArr.map((oldOwner: any, j: number) => {
              if (oldOwner?.address === owner?.address) {
                oldOwner.weight = owner?.weight;
              }
            })

          })
          await AddWeightMembers(
            item?.address,
            transferInfo?.updateOwnerArr[0]?.address,
            transferInfo?.updateOwnerArr[0]?.name,
            transferInfo?.updateOwnerArr[0]?.weight
          ).then((res: any) => {
            console.log("添加成功", res);
          })
        }
      }
    })
    console.log("💰💰💰更新后的钱包地址", walletArr);
    localStorage.setItem("walletArr", JSON.stringify(walletArr));
    return;
  }


  //拿到门限拼接好后的签名
  const GetConcatSignature = async () => {
    let sortedRes: any; //升序排列签名地址对象数组
    let sortedSign: any //排序后地址对应的签名
    let preConcatenatedSig: any = [];  //需要拼接的签名
    let dataString: string = "0x";
    try {
      await GetOwnerSignList(transferInfo?.walletInfo?.address, transferInfo?.nonce)
        .then((res: any) => {
          console.log(res.data);
          //升序排列签名地址对象数组
          sortedRes = res.data.sort((a: any, b: any) => a?.Address.toLowerCase().localeCompare(b?.Address.toLowerCase()));
          console.log("排序后的地址", sortedRes);
          sortedSign = sortedRes.map((item: any) => item.SignatureData);
          console.log("排序后地址对应的签名:", sortedSign);
          for (let i = 0; i < transferInfo?.walletInfo.data.door; i++) {
            preConcatenatedSig.push(sortedSign[i]);
          }
          console.log("需要拼接的签名数组:", preConcatenatedSig);
          for (let i = 0; i < transferInfo?.walletInfo.data.door; i++) {
            console.log(preConcatenatedSig[i]);
            dataString += preConcatenatedSig[i].substring(2);
          }
          console.log("拼接好后的签名", dataString);
        })
      return dataString;
    } catch (error) {
      console.log(error);
      console.log("获取拼接签名出错");
    }
  }


  const WeightConcatSignature = async () => {
    let sortedRes: any; //升序排列签名地址对象数组
    let sortedSign: any //排序后地址对应的签名
    let preConcatenatedSig: any = [];  //需要拼接的签名
    let dataString: string = "0x";
    try {
      await GetOwnerSignList(transferInfo?.walletInfo?.address, transferInfo?.nonce)
        .then((res: any) => {
          console.log(res.data);
          //升序排列签名地址对象数组
          sortedRes = res.data.sort((a: any, b: any) => a?.Address.toLowerCase().localeCompare(b?.Address.toLowerCase()));
          console.log("排序后的地址", sortedRes);
          sortedSign = sortedRes.map((item: any) => item.SignatureData);
          console.log("排序后地址对应的签名:", sortedSign);
          for (let i = 0; i < sortedSign?.length; i++) {
            preConcatenatedSig.push(sortedSign[i]);
          }
          console.log("需要拼接的签名数组:", preConcatenatedSig);
          for (let i = 0; i < preConcatenatedSig?.length; i++) {
            console.log(preConcatenatedSig[i]);
            dataString += preConcatenatedSig[i].substring(2);
          }
          console.log("拼接好后的签名", dataString);
        })
      return dataString;
    } catch (error) {
      console.log(error);
      console.log("获取拼接签名出错");
    }

  }




  const CallDoorTrans = async (concatSignature: string,) => {
    //  原生代币
    let res: any;////合约调用结果
    let gas: any;
    let gasLimit: any;
    let gasPrice: any;
    //调合约/////////////////////////
    try {
      console.log("调用合约的参数", transferInfo?.updateOwnerArr[0]?.address, transferInfo?.walletInfo?.data?.door, concatSignature);
      gas = await DoorContract?.estimateGas
        ?.['addOwnerChangeThreshold'](...[
          transferInfo?.updateOwnerArr[0]?.address,
          transferInfo?.walletInfo?.data?.door,
          concatSignature
        ])
      console.log("gas值为：" + gas?.toNumber());
      gasLimit = gas?.toNumber();
      gasPrice = 100 * 1e9;
      res = await DoorContract?.['addOwnerChangeThreshold'](...[
        transferInfo?.updateOwnerArr[0]?.address,
        transferInfo?.walletInfo?.data?.door,
        concatSignature
      ], { gasLimit, gasPrice })  //,
      Message(
        provider,
        res?.hash,
        async () => {
          //调用接口通知
          await PostFinished(transferInfo?.walletInfo.address, transferInfo?.nonce, res?.hash);
          await UpdateSignProcess();
          UpdateWalletInfo()
          setListLoading(false);
        },
        "执行成功"
      )
    } catch (error: any) {
      if (error.code == 'ACTION_REJECTED') {
        toast.error("取消合约调用")
      }
      else {
        console.log(error);
        console.log("调用合约出错");
        toast.error("事务冲突，请撤销该事务");
      }
    }
    finally {
      setExecuteLoading(false);
      setListLoading(false);
    }
  }


  const CallWeightTrans = async (concatSignature: string,) => {
    //  原生代币
    let res: any;////合约调用结果
    let gas: any;
    let gasLimit: any;
    let gasPrice: any;
    let length:any ;
    try {
      await GetSignedAddress(transferInfo?.walletInfo.address, transferInfo?.nonce).then((res:any)=>{
        length = res.data.signed_addresses?.length
      })
    } catch (error) {
    }
    //调合约/////////////////////////
    try {
      //更新后的地址和权重数组
      let weights = transferInfo?.updateOwnerArr.map((item: any) => item?.weight);
      let owners = transferInfo?.updateOwnerArr.map((item: any) => item?.address);

      console.log("调用合约的参数", transferInfo?.updateOwnerArr[0]?.address, owners, weights, concatSignature, signedArr.length);
      gas = await WeightContract?.estimateGas
        ?.['addOwnerChangeWeight'](...[
          transferInfo?.updateOwnerArr[0]?.address,
          owners,
          weights,
          concatSignature,
          length
        ])
      console.log("gas值为：" + gas?.toNumber());
      gasLimit = gas?.toNumber();
      gasPrice = 100 * 1e9;
      res = await WeightContract?.['addOwnerChangeWeight'](...[
        transferInfo?.updateOwnerArr[0]?.address,
        owners,
        weights,
        concatSignature,
        length
      ], { gasLimit, gasPrice })  //,
      Message(
        provider,
        res?.hash,
        async () => {
          //调用接口通知
          await PostFinished(transferInfo?.walletInfo.address, transferInfo?.nonce, res?.hash);
          await UpdateSignProcess();
          UpdateWalletInfo()
          setListLoading(false);
        },
        "执行成功"
      )
    } catch (error: any) {
      if (error.code == 'ACTION_REJECTED') {
        toast.error("取消合约调用")
      }
      else {
        console.log(error);
        console.log("调用合约出错");
        toast.error("事务冲突，请撤销该事务");
      }
    }
    finally {
      setExecuteLoading(false);
      setListLoading(false);
    }
  }

  //检查用户是否是多签用户
  const CheckIsOwner = async () => {
    //门限
    if (transferInfo?.walletInfo.data.signType === 0) {
      try {
        const res = await DoorContract?.['isOwner'](...[account]);
        console.log("是否是多签用户", res);
        setIsOwner(res);
      } catch (error) {
        // toast.error("用户不在该多签内")
      }
    }
    //权重
    else {
      try {
        const res = await WeightContract?.['isOwner'](...[account]);
        console.log(res);
        setIsOwner(res);
      } catch (error) {
        // toast.error("用户不在该多签内")
      }

    }
  }



  useEffect(() => {
    if (transferInfo !== undefined) {
      let now = dayjs(dayjs().format("YYYY-MM-DD HH:mm:ss"));
      let diff = now.diff(transferInfo?.createTime) / 1000 / 60;
      if (diff / 60 / 24 >= 1) {
        setDiffTime(`${Math.floor(diff / 60 / 24)}天前`)
      }
      else if (diff / 60 >= 1) {
        setDiffTime(`${Math.floor(diff / 60)}小时前`)
      }
      else {
        setDiffTime(`${Math.floor(diff)}分钟前`)
      }
    }
    if (signedArr.length === 0 && account != null) {
      console.log(account);
      CheckIsOwner()
      CompareNonce();
      UpdateSignProcess();
    }
  }, [account])



  // useEffect(() => {
  //   if (DoorContract && WeightContract) {
  //     CheckIsOwner()
  //   }
  // }, [DoorContract, WeightContract])


  return {
    diffTime,
    steps,
    activeNumber,
    isOwner,
    isSign,
    isExecute,
    isSignAndExecute,
    executeLoading,
    isEqual,
    isFinish,
    listLoading,
    UpdateSignProcess,
    OwnerSign,
    OwnerExeCute,
    OwnerSignAndExecute,
  }
}