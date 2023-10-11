const crypto = require('crypto');
const bip39 = require('bip39');

// Function to generate a random mnemonic
function generateMnemonic(bits) {
  const entropy = crypto.randomBytes(bits / 8);
  const mnemonic = bip39.entropyToMnemonic(entropy.toString('hex'));
  return mnemonic;
}

// Function to calculate checksum
function calculateChecksum(entropy) {
  const hash = crypto.createHash('sha256').update(Buffer.from(entropy, 'hex')).digest('hex');
  const checksumLength = entropy.length / 32; // 8 bits for a 256-bit seed
  return hash.slice(0, checksumLength);
}

// Generate a random 24-word mnemonic (256-bit)
const mnemonic = generateMnemonic(256);

// Calculate checksum
const entropy = bip39.mnemonicToEntropy(mnemonic);
const checksum = calculateChecksum(entropy);

// Append checksum to mnemonic
const mnemonicWithChecksum = `${mnemonic}${bip39.entropyToMnemonic(checksum)}`;

console.log('Original Mnemonic:', mnemonic);
console.log('Mnemonic with Checksum:', mnemonicWithChecksum);
