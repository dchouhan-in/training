const {
  generateChildKeys, generateMasterKeys, generateMnemonic, parseWalletAddress, generateKeysForDepth, generateAddressFromPublicKey
} = require("./main.js")

const eth = require("eth-crypto")

const { makeTxn, getBalance, makeTxn2 } = require("./make_txn")

const addr = require('ethereum-private-key-to-address')
const addr_pub = require('ethereum-public-key-to-address')



// const mnemonic = generateMnemonic()
const mnemonic = "picture blush december sample grant across shy valve resist soul cup concert"

const { publicKey, privateKey, chainCode } = generateMasterKeys(mnemonic)


const wallet_address = "m/44'/0'/0'/0'/0'"

const keys = generateKeysForDepth(parseWalletAddress(wallet_address), publicKey, privateKey, chainCode)

const address = generateAddressFromPublicKey(keys.publicKey, 0)
console.log(address);


const wallet_address_eth_sender = "m/44'/60'/0'/0'/0'"

const keys_sender = generateKeysForDepth(parseWalletAddress(wallet_address_eth_sender), publicKey, privateKey, chainCode)

const address_sender = generateAddressFromPublicKey(keys_sender.publicKey, 60)

console.log("Sender address : ", address_sender);

// txns - https://sepolia.etherscan.io/address/0xe2fc329d1239bfca8919b45bd0a702550f768496


const wallet_address_eth_receiver = "m/44'/60'/0'/0'/1'"

const keys_receiver = generateKeysForDepth(parseWalletAddress(wallet_address_eth_receiver), publicKey, privateKey, chainCode)

const address_receiver = generateAddressFromPublicKey(keys_receiver.publicKey, 60)
console.log("Receiver address : ", address_receiver);

// Receivers - https://sepolia.etherscan.io/address/42193cb00b42c1edc418259850ab29fdc88973a7

