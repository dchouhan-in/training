const {
  generateChildKeys, generateMasterKeys, generateMnemonic, parseWalletAddress, generateKeysForDepth, generateAddressFromPublicKey
} = require("./main.js")



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

// received .5 eth for the address
// https://sepolia.etherscan.io/tx/0xf6c80174876f514d9e6e85d004adcb3d3faa665163860bf87c6580796d2fdfea

console.log(address_sender);



const wallet_address_eth_receiver = "m/44'/60'/0'/0'/1'"

const keys_receiver = generateKeysForDepth(parseWalletAddress(wallet_address_eth_receiver), publicKey, privateKey, chainCode)

const address_receiver = generateAddressFromPublicKey(keys_receiver.publicKey, 60)

// received .5 eth for the address
// https://sepolia.etherscan.io/tx/0xf6c80174876f514d9e6e85d004adcb3d3faa665163860bf87c6580796d2fdfea

console.log(address_receiver);


