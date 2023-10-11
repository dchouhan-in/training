const crypto = require('crypto');
const bip39 = require('bip39');
const elliptic = require('elliptic');
// Step 1: Generate 128 random bits

const secp256k1 = require('secp256k1');



// Step 6: Use Mnemonic to get Seed (for testing purposes)

function generateMnemonic() {
    const entropy = crypto.randomBytes(16);

    const seed = entropy.toString('hex')


    const mnemonic = bip39.entropyToMnemonic(seed);

    console.log("mnemonic : ", mnemonic);

    return mnemonic
}


function generateMasterKeys(mnemonic) {
    const recoveredSeed = bip39.mnemonicToEntropy(mnemonic);
    console.log('Recovered Seed:', recoveredSeed);


    const key = crypto.createHmac('sha512', 'HDWALLET_SEED').update(seed).digest();

    const privateKey = key.slice(0, 32).toString('hex')
    const chainCode = key.slice(32)


    console.log('private key', privateKey);


    const publicKey = getPublicKeyFromPrivate(privateKey)

    console.log('Public key', publicKey);
    return { publicKey, privateKey, chainCode }
}


function generateChildKeys() {

    const y = deriveChildKey(private_key, chain_code, 0)
    console.log(y);
    const x = deriveChildPublicKey(publicKey, chain_code, 0)
    console.log(x);

    const isValid = validateKeyPair(x.Ki, y.Ki)

    console.log(isValid);

}


function validateKeyPair(publicKey, privateKey) {
    // Convert hex strings to Buffer
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