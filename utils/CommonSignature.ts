import { ethers } from "ethers";
import { toast } from "react-hot-toast"


export function CommonSignature() {

}


export async function GetSignature(provider: any, account: string, domain: any, execTransferTokenTypes: any, execTransferTokenMessage: any) {
  //确保这个account是多签内的地址
  console.log(provider, account, domain, execTransferTokenTypes, execTransferTokenMessage);
  const signer = await provider.getSigner(account);
  let signatureOwner: any  //这里会存储拉起签名之后的返回值 
  let signOwner:any;  //对签名进行结构
  let packedSignOwner:any; //对结构后的签名进行打包
  try {
    await signer._signTypedData(domain, execTransferTokenTypes, execTransferTokenMessage)
    .then((res: any) => {
      signatureOwner = res;
    });
    signOwner = ethers.utils.splitSignature(signatureOwner);
    packedSignOwner = ethers.utils.solidityPack(['bytes32','bytes32', 'uint8'],[signOwner.r, signOwner.s, signOwner.v])
    return packedSignOwner;
  } catch (error:any) {
    console.log(error);
    if(error.code==='ACTION_REJECTED'){
      toast.error("取消签名")
    }
    else {
      toast.error("签名失败")
    }
    return false;
  }
}

