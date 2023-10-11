const crypto = require('crypto');
const bip39 = require('bip39');
// Step 1: Generate 128 random bits

const secp256k1 = require('secp256k1');
const EC = require('elliptic').ec;

const bitcoin = require('bitcoinjs-lib');

const keccak256 = require("keccak256")
const eth = require("eth-crypto")

module.exports = {
    generateMasterKeys, generateMnemonic, parseWalletAddress, generateKeysForDepth, generateAddressFromPublicKey
}

// Step 6: Use Mnemonic to get Seed (for testing purposes)

function generateMnemonic() {
    const entropy = crypto.randomBytes(16);

    const seed = entropy.toString('hex')


    const mnemonic = bip39.entropyToMnemonic(seed);

    return mnemonic
}


function generateMasterKeys(mnemonic) {
    const recoveredSeed = bip39.mnemonicToEntropy(mnemonic);
    console.log('Recovered Seed:', recoveredSeed);


    const key = crypto.createHmac('sha512', 'HDWALLET_SEED').update(recoveredSeed).digest();

    const privateKey = key.slice(0, 32).toString('hex')
    const chainCode = key.slice(32).toString('hex')


    console.log('private key', privateKey);


    const publicKey = getPublicKeyFromPrivate(privateKey)

    console.log('Public key', publicKey);
    return { publicKey, privateKey, chainCode }
}


// bip44 - m / purpose' / coin_type' / account' / change / address_index 
function parseWalletAddress(address) {
    if (address.startsWith("m/44'/") != true) {
        throw "Invalid Wallet Address"
    }

    const addressWithOutPrefix = address.replace("m/44'/", "")
    const arrayOfPaths = addressWithOutPrefix.split("/")
    const arrayOfIndices = arrayOfPaths.map(val => getIndex(val)).reverse()
    return arrayOfIndices
}


function getIndex(path) {
    return Number.parseInt(path.replace("'"))
}

function generateKeysForDepth(arrayOfTreeNodeIndex, parentPublicKey, parentPrivateKey, chainCode) {
    const index = arrayOfTreeNodeIndex.pop()

    const keys = deriveChildKey(parentPrivateKey, chainCode, index)
    if (arrayOfTreeNodeIndex.length == 0) {
        return keys
    } else {
        return generateKeysForDepth(arrayOfTreeNodeIndex, keys.publicKey, keys.privateKey, keys.newChainCode)
    }
}

function generateAddressFromPublicKey(publicKey, coin_id) {

    // try {
    //     const address_length = standard_address_lengths[coin_id]
    // } catch (error) {
    //     console.log("coin not supported yet!");
    // }

    // const address = keccak256(Buffer.from(publicKey, 'hex'))
    // console.log(Buffer.from(publicKey, 'hex').length);

    const compressedPublicKey = eth.publicKey.compress(publicKey)
    if (coin_id == 60){
        return keccak256(compressedPublicKey).slice(-20).toString('hex');
    }
    

    const address = bitcoin.payments.p2pkh({ pubkey: Buffer.from(compressedPublicKey, 'hex') });
    console.log("Address : ", address.address);

    return address.address

}


function validateKeyPair(publicKey, privateKey) { // Convert hex strings to Buffer
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

    // Validate that the public key is derived from the private key
    const derivedPublicKey = secp256k1.publicKeyCreate(privateKeyBuffer, false); // Exclude the prefix byte
    console.log(publicKey);
    if (!publicKeyBuffer.equals(derivedPublicKey)) {
        return false; // Public key does not match the one derived from the private key
    }

    // Additional checks could be added if needed

    return true; // The public-private key pair is valid
}

function hmacSha512(key, data) {
    const hmac = crypto.createHmac('sha512', key);
    hmac.update(data);
    return hmac.digest();
}

function deriveChildKey(parentKey, chainCode, index) {
    const indexBuffer = Buffer.alloc(4);
    indexBuffer.writeUInt32BE(index, 0);

    const data = Buffer.concat([Buffer.from([0]), Buffer.from(parentKey, 'hex'), indexBuffer]);
    const hashed = hmacSha512(chainCode, data);

    const leftPart = hashed.slice(0, 32);
    const rightPart = hashed.slice(32);

    const newChainCode = rightPart.toString('hex');
    const privateKey = leftPart.toString('hex').padStart(64, '0')
    const publicKey = getPublicKeyFromPrivate(privateKey)

    return { privateKey, newChainCode, publicKey };
}


function getHexFromByteArray(byteArray) {
    return Buffer.from(byteArray).toString('hex')
}

function getPublicKeyFromPrivate(privateKey) {
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

    const publicKeyBuffer = secp256k1.publicKeyCreate(privateKeyBuffer, false).slice(1);
    return getHexFromByteArray(publicKeyBuffer)
}