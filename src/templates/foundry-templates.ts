import type { ProjectOptions } from '../types';

// Foundry Configuration
export function generateFoundryConfig(): string {
  return `[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.20"
optimizer = true
optimizer_runs = 200
via_ir = false

[profile.ci]
fuzz = { runs = 5000 }
invariant = { runs = 1000 }

# See more config options https://github.com/foundry-rs/foundry/blob/master/crates/config/README.md#all-options
`;
}

// Foundry Deploy Script
export function generateFoundryDeployScript(options: ProjectOptions): string {
  const { contractType, tokenStandard, proxy, projectName } = options;
  const contractName = toPascalCase(projectName);

  let deployCode = '';

  if (contractType === 'token' || contractType === 'both') {
    if (proxy !== 'none') {
      deployCode += `
        // Deploy ERC20 Token with Proxy
        console.log("Deploying ${contractName} Token...");
        address tokenImplementation = address(new ${contractName}());
        ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'} tokenProxy = new ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'}(
            tokenImplementation,
            ${proxy === 'transparent' ? 'msg.sender,' : ''}
            abi.encodeWithSignature(
                "initialize(string,string,uint256)",
                "${contractName} Token",
                "MTK",
                1000000 * 10**18
            )
        );
        ${contractName} token = ${contractName}(address(tokenProxy));
        console.log("${contractName} Token deployed at:", address(token));
`;
    } else {
      deployCode += `
        // Deploy ERC20 Token
        console.log("Deploying ${contractName} Token...");
        ${contractName} token = new ${contractName}(
            "${contractName} Token",
            "MTK",
            1000000 * 10**18
        );
        console.log("${contractName} Token deployed at:", address(token));
`;
    }
  }

  if (contractType === 'nft' || contractType === 'both') {
    const nftContractName = contractType === 'both' ? `${contractName}NFT` : contractName;

    if (proxy !== 'none') {
      if (tokenStandard === 'erc1155') {
        deployCode += `
        // Deploy ERC1155 NFT with Proxy
        console.log("Deploying ${nftContractName} NFT...");
        address nftImplementation = address(new ${nftContractName}());
        ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'} nftProxy = new ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'}(
            nftImplementation,
            ${proxy === 'transparent' ? 'msg.sender,' : ''}
            abi.encodeWithSignature(
                "initialize(string)",
                "https://api.example.com/metadata/{id}.json"
            )
        );
        ${nftContractName} nft = ${nftContractName}(address(nftProxy));
        console.log("${nftContractName} NFT deployed at:", address(nft));
`;
      } else {
        deployCode += `
        // Deploy ERC721 NFT with Proxy
        console.log("Deploying ${nftContractName} NFT...");
        address nftImplementation = address(new ${nftContractName}());
        ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'} nftProxy = new ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'}(
            nftImplementation,
            ${proxy === 'transparent' ? 'msg.sender,' : ''}
            abi.encodeWithSignature(
                "initialize(string,string)",
                "${nftContractName}",
                "MNFT"
            )
        );
        ${nftContractName} nft = ${nftContractName}(address(nftProxy));
        console.log("${nftContractName} NFT deployed at:", address(nft));
`;
      }
    } else {
      if (tokenStandard === 'erc1155') {
        deployCode += `
        // Deploy ERC1155 NFT
        console.log("Deploying ${nftContractName} NFT...");
        ${nftContractName} nft = new ${nftContractName}("https://api.example.com/metadata/{id}.json");
        console.log("${nftContractName} NFT deployed at:", address(nft));
`;
      } else {
        deployCode += `
        // Deploy ERC721 NFT
        console.log("Deploying ${nftContractName} NFT...");
        ${nftContractName} nft = new ${nftContractName}("${nftContractName}", "MNFT");
        console.log("${nftContractName} NFT deployed at:", address(nft));
`;
      }
    }
  }

  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/${contractName}.sol";
${contractType === 'both' ? `import "../src/${contractName}NFT.sol";\n` : ''}${proxy !== 'none' ? `import "@openzeppelin/contracts/proxy/${proxy === 'uups' ? 'ERC1967/ERC1967Proxy.sol' : 'transparent/TransparentUpgradeableProxy.sol'}";\n` : ''}
contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

${deployCode}
        vm.stopBroadcast();
    }
}
`;
}

// Foundry Test File
export function generateFoundryTest(options: ProjectOptions): string {
  const { contractType, tokenStandard, proxy, projectName } = options;
  const contractName = toPascalCase(projectName);

  let testCode = '';
  let imports = `import "forge-std/Test.sol";\nimport "../src/${contractName}.sol";\n`;

  if (contractType === 'both') {
    imports += `import "../src/${contractName}NFT.sol";\n`;
  }

  if (proxy !== 'none') {
    imports += `import "@openzeppelin/contracts/proxy/${proxy === 'uups' ? 'ERC1967/ERC1967Proxy.sol' : 'transparent/TransparentUpgradeableProxy.sol'}";\n`;
  }

  if (contractType === 'token' || contractType === 'both') {
    testCode += `
contract ${contractName}Test is Test {
    ${contractName} public token;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        ${proxy !== 'none' ? `
        address implementation = address(new ${contractName}());
        ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'} proxy = new ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'}(
            implementation,
            ${proxy === 'transparent' ? 'owner,' : ''}
            abi.encodeWithSignature(
                "initialize(string,string,uint256)",
                "${contractName}",
                "MTK",
                1000000 * 10**18
            )
        );
        token = ${contractName}(address(proxy));
        ` : `
        token = new ${contractName}("${contractName}", "MTK", 1000000 * 10**18);
        `}
    }

    function testInitialSupply() public {
        assertEq(token.totalSupply(), 1000000 * 10**18);
        assertEq(token.balanceOf(owner), 1000000 * 10**18);
    }

    function testName() public {
        assertEq(token.name(), "${contractName}");
    }

    function testSymbol() public {
        assertEq(token.symbol(), "MTK");
    }

    function testMint() public {
        token.mint(user1, 1000 * 10**18);
        assertEq(token.balanceOf(user1), 1000 * 10**18);
    }

    function testTransfer() public {
        token.transfer(user1, 100 * 10**18);
        assertEq(token.balanceOf(user1), 100 * 10**18);
        assertEq(token.balanceOf(owner), (1000000 - 100) * 10**18);
    }

    function testFailTransferInsufficientBalance() public {
        vm.prank(user1);
        token.transfer(user2, 100 * 10**18);
    }

    function testApproveAndTransferFrom() public {
        token.approve(user1, 100 * 10**18);
        vm.prank(user1);
        token.transferFrom(owner, user2, 100 * 10**18);
        assertEq(token.balanceOf(user2), 100 * 10**18);
    }

    function testBurn() public {
        uint256 burnAmount = 1000 * 10**18;
        token.burn(burnAmount);
        assertEq(token.totalSupply(), (1000000 - 1000) * 10**18);
    }
}
`;
  }

  if (contractType === 'nft' || contractType === 'both') {
    const nftContractName = contractType === 'both' ? `${contractName}NFT` : contractName;

    if (tokenStandard === 'erc1155') {
      testCode += `
contract ${nftContractName}Test is Test {
    ${nftContractName} public nft;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        ${proxy !== 'none' ? `
        address implementation = address(new ${nftContractName}());
        ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'} proxy = new ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'}(
            implementation,
            ${proxy === 'transparent' ? 'owner,' : ''}
            abi.encodeWithSignature(
                "initialize(string)",
                "https://api.example.com/metadata/{id}.json"
            )
        );
        nft = ${nftContractName}(address(proxy));
        ` : `
        nft = new ${nftContractName}("https://api.example.com/metadata/{id}.json");
        `}
    }

    function testMint() public {
        nft.mint(user1, 1, 10, "");
        assertEq(nft.balanceOf(user1, 1), 10);
    }

    function testMintBatch() public {
        uint256[] memory ids = new uint256[](2);
        ids[0] = 1;
        ids[1] = 2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 10;
        amounts[1] = 20;

        nft.mintBatch(user1, ids, amounts, "");
        assertEq(nft.balanceOf(user1, 1), 10);
        assertEq(nft.balanceOf(user1, 2), 20);
    }

    function testTransfer() public {
        nft.mint(user1, 1, 10, "");
        vm.prank(user1);
        nft.safeTransferFrom(user1, user2, 1, 5, "");
        assertEq(nft.balanceOf(user1, 1), 5);
        assertEq(nft.balanceOf(user2, 1), 5);
    }

    function testSetURI() public {
        nft.setURI("https://new-api.example.com/{id}");
        // URI is set successfully if no revert occurs
    }
}
`;
    } else {
      testCode += `
contract ${nftContractName}Test is Test {
    ${nftContractName} public nft;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        ${proxy !== 'none' ? `
        address implementation = address(new ${nftContractName}());
        ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'} proxy = new ${proxy === 'uups' ? 'ERC1967Proxy' : 'TransparentUpgradeableProxy'}(
            implementation,
            ${proxy === 'transparent' ? 'owner,' : ''}
            abi.encodeWithSignature(
                "initialize(string,string)",
                "${nftContractName}",
                "MNFT"
            )
        );
        nft = ${nftContractName}(address(proxy));
        ` : `
        nft = new ${nftContractName}("${nftContractName}", "MNFT");
        `}
    }

    function testName() public {
        assertEq(nft.name(), "${nftContractName}");
    }

    function testSymbol() public {
        assertEq(nft.symbol(), "MNFT");
    }

    function testMint() public {
        nft.safeMint(user1, "https://example.com/token/0");
        assertEq(nft.ownerOf(0), user1);
        assertEq(nft.tokenURI(0), "https://example.com/token/0");
    }

    function testBalanceOf() public {
        nft.safeMint(user1, "https://example.com/token/0");
        nft.safeMint(user1, "https://example.com/token/1");
        assertEq(nft.balanceOf(user1), 2);
    }

    function testTransfer() public {
        nft.safeMint(user1, "https://example.com/token/0");
        vm.prank(user1);
        nft.transferFrom(user1, user2, 0);
        assertEq(nft.ownerOf(0), user2);
    }

    function testFailTransferUnauthorized() public {
        nft.safeMint(user1, "https://example.com/token/0");
        vm.prank(user2);
        nft.transferFrom(user1, user2, 0);
    }
}
`;
    }
  }

  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

${imports}
${testCode}`;
}

// Environment Template for Foundry
export function generateFoundryEnv(): string {
  return `# Private Key (NEVER commit this!)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# RPC URLs
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Etherscan API Key
ETHERSCAN_API_KEY=your_etherscan_api_key
`;
}

// README for Foundry project
export function generateFoundryReadme(options: ProjectOptions): string {
  const { projectName, contractType } = options;

  return `# ${projectName}

This project demonstrates a ${contractType === 'both' ? 'Token and NFT' : contractType === 'token' ? 'Token' : 'NFT'} smart contract development setup using Foundry.

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

## Installation

\`\`\`bash
# Install dependencies
forge install
\`\`\`

## Configuration

1. Copy \`.env.example\` to \`.env\`
2. Fill in your configuration values:
   - Private key for deployment
   - RPC URLs for different networks
   - Etherscan API key for verification

## Available Commands

### Build Contracts
\`\`\`bash
forge build
\`\`\`

### Run Tests
\`\`\`bash
forge test
\`\`\`

### Run Tests with Gas Report
\`\`\`bash
forge test --gas-report
\`\`\`

### Run Tests with Verbosity
\`\`\`bash
forge test -vvvv
\`\`\`

### Run Coverage
\`\`\`bash
forge coverage
\`\`\`

### Deploy Contracts

Deploy to local Anvil node:
\`\`\`bash
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
\`\`\`

Deploy to testnet (Sepolia):
\`\`\`bash
forge script script/Deploy.s.sol --rpc-url \${SEPOLIA_RPC_URL} --broadcast --verify
\`\`\`

Deploy to mainnet:
\`\`\`bash
forge script script/Deploy.s.sol --rpc-url \${MAINNET_RPC_URL} --broadcast --verify
\`\`\`

### Start Local Node (Anvil)
\`\`\`bash
anvil
\`\`\`

### Verify Contract on Etherscan
\`\`\`bash
forge verify-contract <CONTRACT_ADDRESS> src/YourContract.sol:YourContract --chain sepolia
\`\`\`

### Format Code
\`\`\`bash
forge fmt
\`\`\`

## Project Structure

\`\`\`
.
├── src/               # Smart contracts
├── script/            # Deployment scripts
├── test/              # Test files
├── lib/               # Dependencies
├── foundry.toml       # Foundry configuration
└── .env.example       # Environment variables template
\`\`\`

## Testing

The project uses Foundry's testing framework with advanced features:
- Fuzz testing
- Invariant testing
- Gas snapshots
- Coverage reports

Tests cover:
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

## Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Foundry GitHub](https://github.com/foundry-rs/foundry)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## License

MIT
`;
}

// Remappings for Foundry
export function generateFoundryRemappings(): string {
  return `@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/
forge-std/=lib/forge-std/src/
`;
}

// Helper function to convert project name to PascalCase
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
