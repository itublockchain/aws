import { ethers } from "hardhat";

async function main(): Promise<void> {
  const factory = await ethers.getContractFactory("SendReceive");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SendReceive deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


