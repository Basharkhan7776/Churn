import type { ProjectOptions } from '../types';

// Hardhat Configuration
export function generateHardhatConfig(options: ProjectOptions): string {
  const { language } = options;
  const ext = language === 'solidity' ? 'ts' : 'js';

  return `${language === 'solidity' ? "require(\"@nomicfoundation/hardhat-toolbox\");\nrequire(\"@openzeppelin/hardhat-upgrades\");\nrequire(\"dotenv\").config();\n\n" : "require(\"@nomicfoundation/hardhat-toolbox\");\nrequire(\"@openzeppelin/hardhat-upgrades\");\nrequire(\"dotenv\").config();\n\n"}const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
};

module.exports = config;
`;
}

// Deploy Script
export function generateHardhatDeployScript(options: ProjectOptions): string {
  const { contractType, tokenStandard, proxy, projectName } = options;
  const contractName = toPascalCase(projectName);

  let deployCode = '';

  if (contractType === 'token' || contractType === 'both') {
    if (proxy !== 'none') {
      deployCode += `
  // Deploy ERC20 Token with ${proxy === 'uups' ? 'UUPS' : 'Transparent'} Proxy
  console.log("Deploying ${contractName} ERC20 Token...");
  const Token = await ethers.getContractFactory("${contractName}");
  const token = await upgrades.deployProxy(
    Token,
    ["${contractName} Token", "MTK", ethers.parseEther("1000000")],
    { kind: "${proxy}" }
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("${contractName} Token deployed to:", tokenAddress);
`;
    } else {
      deployCode += `
  // Deploy ERC20 Token
  console.log("Deploying ${contractName} ERC20 Token...");
  const Token = await ethers.getContractFactory("${contractName}");
  const token = await Token.deploy(
    "${contractName} Token",
    "MTK",
    ethers.parseEther("1000000")
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("${contractName} Token deployed to:", tokenAddress);
`;
    }
  }

  if (contractType === 'nft' || contractType === 'both') {
    const nftContractName = contractType === 'both' ? `${contractName}NFT` : contractName;
    const standard = tokenStandard === 'erc1155' ? 'ERC1155' : 'ERC721';

    if (proxy !== 'none') {
      if (tokenStandard === 'erc1155') {
        deployCode += `
  // Deploy ERC1155 NFT with ${proxy === 'uups' ? 'UUPS' : 'Transparent'} Proxy
  console.log("Deploying ${nftContractName} ERC1155 NFT...");
  const NFT = await ethers.getContractFactory("${nftContractName}");
  const nft = await upgrades.deployProxy(
    NFT,
    ["https://api.example.com/metadata/{id}.json"],
    { kind: "${proxy}" }
  );
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("${nftContractName} NFT deployed to:", nftAddress);
`;
      } else {
        deployCode += `
  // Deploy ERC721 NFT with ${proxy === 'uups' ? 'UUPS' : 'Transparent'} Proxy
  console.log("Deploying ${nftContractName} ERC721 NFT...");
  const NFT = await ethers.getContractFactory("${nftContractName}");
  const nft = await upgrades.deployProxy(
    NFT,
    ["${nftContractName}", "MNFT"],
    { kind: "${proxy}" }
  );
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("${nftContractName} NFT deployed to:", nftAddress);
`;
      }
    } else {
      if (tokenStandard === 'erc1155') {
        deployCode += `
  // Deploy ERC1155 NFT
  console.log("Deploying ${nftContractName} ERC1155 NFT...");
  const NFT = await ethers.getContractFactory("${nftContractName}");
  const nft = await NFT.deploy("https://api.example.com/metadata/{id}.json");
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("${nftContractName} NFT deployed to:", nftAddress);
`;
      } else {
        deployCode += `
  // Deploy ERC721 NFT
  console.log("Deploying ${nftContractName} ERC721 NFT...");
  const NFT = await ethers.getContractFactory("${nftContractName}");
  const nft = await NFT.deploy("${nftContractName}", "MNFT");
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("${nftContractName} NFT deployed to:", nftAddress);
`;
      }
    }
  }

  return `import { ethers, upgrades } from "hardhat";

async function main() {
${deployCode}
  console.log("\\nDeployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
`;
}

// Test File
export function generateHardhatTest(options: ProjectOptions): string {
  const { contractType, tokenStandard, proxy, projectName } = options;
  const contractName = toPascalCase(projectName);

  let testCode = '';

  if (contractType === 'token' || contractType === 'both') {
    testCode += `
describe("${contractName} Token", function () {
  let token${proxy !== 'none' ? ', owner, addr1, addr2' : ''};

  beforeEach(async function () {
    ${proxy !== 'none' ? '[owner, addr1, addr2] = await ethers.getSigners();' : ''}
    const Token = await ethers.getContractFactory("${contractName}");
    ${proxy !== 'none'
      ? `token = await upgrades.deployProxy(Token, ["${contractName}", "MTK", ethers.parseEther("1000000")], { kind: "${proxy}" });`
      : `token = await Token.deploy("${contractName}", "MTK", ethers.parseEther("1000000"));`
    }
    await token.waitForDeployment();
  });

  it("Should have correct name and symbol", async function () {
    expect(await token.name()).to.equal("${contractName}");
    expect(await token.symbol()).to.equal("MTK");
  });

  it("Should mint initial supply to deployer", async function () {
    const [owner] = await ethers.getSigners();
    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(ethers.parseEther("1000000"));
  });

  it("Should allow owner to mint new tokens", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await token.mint(addr1.address, ethers.parseEther("1000"));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("1000"));
  });

  it("Should transfer tokens between accounts", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    await token.transfer(addr1.address, ethers.parseEther("50"));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("50"));

    await token.connect(addr1).transfer(addr2.address, ethers.parseEther("25"));
    expect(await token.balanceOf(addr2.address)).to.equal(ethers.parseEther("25"));
  });
${proxy !== 'none' ? `
  it("Should be upgradeable", async function () {
    const tokenAddress = await token.getAddress();
    const TokenV2 = await ethers.getContractFactory("${contractName}");
    const upgraded = await upgrades.upgradeProxy(tokenAddress, TokenV2);
    expect(await upgraded.getAddress()).to.equal(tokenAddress);
  });
` : ''}
});
`;
  }

  if (contractType === 'nft' || contractType === 'both') {
    const nftContractName = contractType === 'both' ? `${contractName}NFT` : contractName;

    if (tokenStandard === 'erc1155') {
      testCode += `
describe("${nftContractName} ERC1155", function () {
  let nft${proxy !== 'none' ? ', owner, addr1, addr2' : ''};

  beforeEach(async function () {
    ${proxy !== 'none' ? '[owner, addr1, addr2] = await ethers.getSigners();' : ''}
    const NFT = await ethers.getContractFactory("${nftContractName}");
    ${proxy !== 'none'
      ? `nft = await upgrades.deployProxy(NFT, ["https://api.example.com/metadata/{id}.json"], { kind: "${proxy}" });`
      : `nft = await NFT.deploy("https://api.example.com/metadata/{id}.json");`
    }
    await nft.waitForDeployment();
  });

  it("Should mint tokens", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await nft.mint(addr1.address, 1, 10, "0x");
    expect(await nft.balanceOf(addr1.address, 1)).to.equal(10);
  });

  it("Should mint batch tokens", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await nft.mintBatch(addr1.address, [1, 2], [10, 20], "0x");
    expect(await nft.balanceOf(addr1.address, 1)).to.equal(10);
    expect(await nft.balanceOf(addr1.address, 2)).to.equal(20);
  });

  it("Should allow token transfers", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    await nft.mint(addr1.address, 1, 10, "0x");
    await nft.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 1, 5, "0x");
    expect(await nft.balanceOf(addr2.address, 1)).to.equal(5);
  });
${proxy !== 'none' ? `
  it("Should be upgradeable", async function () {
    const nftAddress = await nft.getAddress();
    const NFTV2 = await ethers.getContractFactory("${nftContractName}");
    const upgraded = await upgrades.upgradeProxy(nftAddress, NFTV2);
    expect(await upgraded.getAddress()).to.equal(nftAddress);
  });
` : ''}
});
`;
    } else {
      testCode += `
describe("${nftContractName} ERC721", function () {
  let nft${proxy !== 'none' ? ', owner, addr1, addr2' : ''};

  beforeEach(async function () {
    ${proxy !== 'none' ? '[owner, addr1, addr2] = await ethers.getSigners();' : ''}
    const NFT = await ethers.getContractFactory("${nftContractName}");
    ${proxy !== 'none'
      ? `nft = await upgrades.deployProxy(NFT, ["${nftContractName}", "MNFT"], { kind: "${proxy}" });`
      : `nft = await NFT.deploy("${nftContractName}", "MNFT");`
    }
    await nft.waitForDeployment();
  });

  it("Should have correct name and symbol", async function () {
    expect(await nft.name()).to.equal("${nftContractName}");
    expect(await nft.symbol()).to.equal("MNFT");
  });

  it("Should mint NFT with URI", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await nft.safeMint(addr1.address, "https://example.com/token/0");
    expect(await nft.ownerOf(0)).to.equal(addr1.address);
    expect(await nft.tokenURI(0)).to.equal("https://example.com/token/0");
  });

  it("Should transfer NFT", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    await nft.safeMint(addr1.address, "https://example.com/token/0");
    await nft.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
    expect(await nft.ownerOf(0)).to.equal(addr2.address);
  });

  it("Should track token balance", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await nft.safeMint(addr1.address, "https://example.com/token/0");
    await nft.safeMint(addr1.address, "https://example.com/token/1");
    expect(await nft.balanceOf(addr1.address)).to.equal(2);
  });
${proxy !== 'none' ? `
  it("Should be upgradeable", async function () {
    const nftAddress = await nft.getAddress();
    const NFTV2 = await ethers.getContractFactory("${nftContractName}");
    const upgraded = await upgrades.upgradeProxy(nftAddress, NFTV2);
    expect(await upgraded.getAddress()).to.equal(nftAddress);
  });
` : ''}
});
`;
    }
  }

  return `import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

${testCode}`;
}

// Environment Template
export function generateHardhatEnv(): string {
  return `# Network RPC URLs
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Private Key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key

# Gas Reporter
REPORT_GAS=false
`;
}

// README for Hardhat project
export function generateHardhatReadme(options: ProjectOptions): string {
  const { projectName, contractType } = options;

  return `# ${projectName}

This project demonstrates a ${contractType === 'both' ? 'Token and NFT' : contractType === 'token' ? 'Token' : 'NFT'} smart contract development setup using Hardhat.

## Prerequisites

- Node.js >= 18
- npm or yarn or pnpm or bun

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

1. Copy \`.env.example\` to \`.env\`
2. Fill in your configuration values:
   - RPC URLs for different networks
   - Private key for deployment
   - Etherscan API key for verification

## Available Commands

### Compile Contracts
\`\`\`bash
npx hardhat compile
\`\`\`

### Run Tests
\`\`\`bash
npx hardhat test
\`\`\`

### Run Tests with Gas Report
\`\`\`bash
REPORT_GAS=true npx hardhat test
\`\`\`

### Deploy Contracts

Deploy to local network:
\`\`\`bash
npx hardhat run scripts/deploy.ts --network localhost
\`\`\`

Deploy to testnet (Sepolia):
\`\`\`bash
npx hardhat run scripts/deploy.ts --network sepolia
\`\`\`

Deploy to mainnet:
\`\`\`bash
npx hardhat run scripts/deploy.ts --network mainnet
\`\`\`

### Start Local Node
\`\`\`bash
npx hardhat node
\`\`\`

### Verify Contract on Etherscan
\`\`\`bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "Constructor" "Arguments"
\`\`\`

### Run Coverage
\`\`\`bash
npx hardhat coverage
\`\`\`

## Project Structure

\`\`\`
.
├── contracts/          # Smart contracts
├── scripts/           # Deployment scripts
├── test/              # Test files
├── hardhat.config.ts  # Hardhat configuration
└── .env.example       # Environment variables template
\`\`\`

## Testing

The project uses Hardhat's testing framework with Chai assertions. Tests cover:
- Contract deployment
- Token/NFT minting
- Transfers
- Access control
- Upgradeability (if using proxy pattern)

## Security

- Never commit your \`.env\` file
- Never commit private keys
- Always audit your contracts before mainnet deployment
- Consider getting a professional audit for production contracts

## License

MIT
`;
}

// Helper function to convert project name to PascalCase
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
