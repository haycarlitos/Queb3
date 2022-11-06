
  // The CredentialAtomicQuerySigValidator contract is used to verify any claim-related zk proof generated by user using the credentialAtomicQuerySig circuit.
  // https://0xpolygonid.github.io/tutorials/contracts/overview/#credentialatomicquerysigvalidator
  

  // CredentialAtomicQuerySigValidator Mumbai address
  //const validatorAddress = "0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB";

  // Query language: https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/

  // source : https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/#greater-than-operator-3
    // extracted from PID platform

async function main() {

  const circuitId = "credentialAtomicQuerySig";
  const validatorAddress = "0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB";

  // Grab the schema hash from Polygon ID Platform
  const schemaHash = "47007abcde9dc4b3199acbc059ea5e3b"

  const schemaEnd = fromLittleEndian(hexToBytes(schemaHash))

  const ageQuery = {
    schema: ethers.BigNumber.from("210459579859058135404770043788028292398"),
    slotIndex: 2,
    operator: 2,
    value: [20010101, ...new Array(63).fill(0).map((i) => 0)],
    circuitId,
  };

  const Likesquery = {
    schema: ethers.BigNumber.from(schemaEnd),
    slotIndex: 2,  // slotIndex3 indicates the value stored as Attribute 2 inside the claim
    operator: 3,
    value: [10, ...new Array(63).fill(0).map(i => 0)],
    circuitId,
  };

  // add the address of the contract just deployed
  ERC20VerifierAddress = "0x90e8c54369310031F4B40A75B124A924E1AEA9b1"

  let erc20Verifier = await hre.ethers.getContractAt("ERC20Verifier", ERC20VerifierAddress)

  const requestId = await erc20Verifier.TRANSFER_REQUEST_ID();

  try {
      await erc20Verifier.setZKPRequest(
      requestId,
      validatorAddress,
      Likesquery
      );
      console.log("Request set");
  } catch (e) {
      console.log("error: ", e);
  }
}

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function fromLittleEndian(bytes) {
  const n256 = BigInt(256);
  let result = BigInt(0);
  let base = BigInt(1);
  bytes.forEach((byte) => {
    result += base * BigInt(byte);
    base = base * n256;
  });
  return result;
}