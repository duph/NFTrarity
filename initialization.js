"use strict";
exports.__esModule = true;
var web3_1 = require("web3");
var sdk_1 = require("@rarible/sdk");
// @ts-ignore
var HDWalletProvider = require("@truffle/hdwallet-provider");
//import WalletConnectProvider from "@walletconnect/web3-provider"
var web3_ethereum_1 = require("@rarible/web3-ethereum");
var sdk_wallet_1 = require("@rarible/sdk-wallet");
//Creating EthereumWallet with Web3
//const web3 = new Web3(provider)
//const web3Ethereum = new Web3Ethereum({ web3 })
//const ethWallet = new EthereumWallet(web3Ethereum)
//or with HDWalletProvider
var provider = new HDWalletProvider({
    url: "https://mainnet.infura.io/v3/2227b0ab89fa4d1cba0f95a2a8a3346d",
    privateKeys: ["312938b0eea74d40aee88835c727dad4"]
});
var web3 = new web3_1["default"](provider);
var web3Ethereum = new web3_ethereum_1.Web3Ethereum({ web3: web3 });
var ethWallet = new sdk_wallet_1.EthereumWallet(web3Ethereum);
//Creating EthereumWallet with ethers.providers.Web3Provider
//const ethersWeb3Provider = new ethers.providers.Web3Provider(provider)
//const ethersProvider = new EthersWeb3ProviderEthereum(ethersWeb3Provider)
//const ethWallet = new EthereumWallet(ethersProvider)
//Creating EthereumWallet with ethers.Wallet
//const ethersWeb3Provider = new ethers.providers.Web3Provider(provider)
//const ethersProvider = new EthersEthereum(new ethers.Wallet(wallet.getPrivateKeyString(), ethersWeb3Provider))
//const ethWallet = new EthereumWallet(ethersProvider)
// Second parameter — is environment: "prod" | "staging" | "dev"
var raribleSdk = (0, sdk_1.createRaribleSdk)(undefined, "staging"); // ethWallet
console.log('hello world');
//IRaribleSdk.IApisSdk.ApiClient.ItemControllerApi
