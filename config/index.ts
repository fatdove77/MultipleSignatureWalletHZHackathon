//引入定义好的支持链
import { chains } from "./netConfig";

interface BaseDataType{
  CHAIN_ID:number;
  Contract:string;
  NETWORK_URL:string;
}

const DataType:BaseDataType = {
  CHAIN_ID:11155111,
  Contract:'0xFa1ee4FcE17ef1Fa3188657b867e76d55D39ea01',  // 多签的创建地址
  NETWORK_URL:'https://eth-sepolia.g.alchemy.com/v2/zz2YgWMABH2H_r6vXxsjvBWzkceX_QiV' //RPC
}


const {CHAIN_ID, Contract, NETWORK_URL } = DataType;



const config = {
  // env
  BaseLocale: 'zh-cn',  //默认语言
  // 
  DEFAULT_NETWORK_ID: 11155111,  //默认网络id号（链id）  //12306
  DEFAULT_WALLET_TYPE: 'MetaMask', //默认连接钱包
  chains, // 支持链 
  // WEBSITE: 'https://www.fibochain.org/',
  precision: 2,  //
  interestRate: 22.5 / 100,

  // 
  CHAIN_ID,
  NETWORK_URL,
  Contract,
};
export default config;

//暴露出 chainId 钱包type 以及rpcurl