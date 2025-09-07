import hre from "hardhat";

async function main(): Promise<void> {
  const contract = await hre.viem.deployContract("SendReceive", [
    // ENS registry, Reverse Registrar addresses should be provided here
    process.env.ENS_REGISTRY_ADDRESS as `0x${string}`,
    process.env.REVERSE_REGISTRAR_ADDRESS as `0x${string}`
  ]);
  console.log("SendReceive deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


