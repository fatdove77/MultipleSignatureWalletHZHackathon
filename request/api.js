import service from "./index";
import axios from "axios";

//创建多签
export async function CreateWallet(address, threshold, is_weighted, name) {
  console.log(address, threshold, is_weighted, name);
  const response = await service.post("/CreateMultipleSignatureWallet", { address, threshold, is_weighted, name });
  return response
}


//添加成员--门限钱包
export async function AddMembers(wallet_address, address, name) {
  console.log(wallet_address, address, name);
  const response = await service.post("/AddMembers", { wallet_address: wallet_address, address: address, name: name });
  return response
}


//添加成员--权重钱包
export async function AddWeightMembers(wallet_address, address, name, weight) {
  console.log(wallet_address, address, name, weight);
  const response = await service.post("/AddWeight", { wallet_address: wallet_address, address: address, name: name, weight: weight });
  return response
}

//获取最新nonce
export async function GetLatestNonce(wallet_address) {
  const response = await service.post("/NewTransCationNumber", { wallet_address: wallet_address, });
  return response
}

//创建新事务
export async function CreateNewTransaction(wallet_address, nonce, transaction_type, content) {
  console.log(wallet_address, nonce, transaction_type, content);
  const response = await service.post("/TxTransCation", {
    wallet_address: wallet_address,
    nonce: nonce,
    transaction_type: transaction_type,
    content: content
  });
  return response
}

//创建签名事务
export async function AddSignature(wallet_address, address, nonce, signature_data) {
  console.log(wallet_address, address, nonce, signature_data);
  const response = await service.post("/SignTxTransCation", {
    wallet_address: wallet_address,
    address: address,
    nonce: nonce,
    signature_data: signature_data
  });
  return response
}


//查询签名队列
export async function GetSignedAddress(wallet_address, nonce) {
  console.log(wallet_address, nonce);
  const response = await service.get("/TransactionList", {
    params: {
      wallet_address: wallet_address,
      nonce: nonce
    }
  }

  );
  return response
}


//拿到成员签名数组
export async function GetOwnerSignList(wallet_address, nonce) {
  console.log(wallet_address, nonce);
  const response = await service.post("/VerifyTransaction", {
    wallet_address: wallet_address,
    nonce: nonce
  }

  );
  return response
}

//通知事务已经完成
export async function PostFinished(wallet_address, nonce, Hash) {
  console.log(wallet_address, nonce, Hash);
  const response = await service.post("/TxCompleted", {
    wallet_address: wallet_address,
    nonce: nonce,
    Hash: Hash
  }

  );
  return response
}


//获取事务队列
export async function GetHistoryList(wallet_address) {
  console.log(wallet_address);
  const response = await service.get("/TransactionHistory", {
    params: {
      wallet_address: wallet_address,
    }
  }
  );
  return response
}






//获取事务队列
export async function DeleteOwner(wallet_address,address) {
  console.log(wallet_address,address);
  const response = await service.delete("/DeleteMember", {
    params: {
      wallet_address: wallet_address,
      address: address,
    }
  }
  );
  return response
}

//替换成员
export async function ReplaceOwner(wallet_address, address,new_address) {
  console.log(wallet_address);
  const response = await service.post("/ReplaceMemberAddress", {
    wallet_address: wallet_address,
    address: address,
    new_address: new_address,
  }

  );
  return response
}

//撤销事务
export async function CancelTrade(wallet_address, nonce) {
  console.log(wallet_address, nonce);
  const response = await service.post("/CancelTransaction", {
    wallet_address: wallet_address,
    nonce: nonce,
  }
  );
  return response
}

