// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title SwaptoXPermitReader
/// @notice Reads ERC20 Permit-related information in a single eth_call.
/// @dev Supports standard EIP-2612, DAI-style Permit and bytes-signature Permit.
contract SwaptoXPermitReader {

    struct PermitInfo {
        // ERC20 token name
        string tokenName;

        // EIP-712 domain information
        string domainName;
        string version;
        bytes1 domainFields;

        // Permit nonce
        uint256 nonce;

        // EIP-712 domain separator
        bytes32 domainSeparator;

        // EIP-712 domain fields
        uint256 domainChainId;
        address verifyingContract;
        bytes32 salt;

        // Current chain ID
        uint256 chainId;

        // Read availability
        bool nameAvailable;
        bool nonceAvailable;
        bool domainSeparatorAvailable;
        bool eip712DomainAvailable;
    }

    // ERC20 name()
    bytes4 private constant NAME_SELECTOR = 0x06fdde03;

    // EIP-2612 / DAI nonces(address)
    bytes4 private constant NONCES_SELECTOR = 0x7ecebe00;

    // EIP-712 DOMAIN_SEPARATOR()
    bytes4 private constant DOMAIN_SEPARATOR_SELECTOR = 0x3644e515;

    // EIP-5267 eip712Domain()
    bytes4 private constant EIP712_DOMAIN_SELECTOR = 0x84b0196e;


    /// @notice Read all available Permit-related information.
    /// @param token ERC20 token address.
    /// @param owner Wallet address whose nonce should be read.
    function getPermitInfo(
        address token,
        address owner
    )
        external
        view
        returns (PermitInfo memory info)
    {
        info.chainId = block.chainid;

        // -------------------------------------------------
        // 1. Read ERC20 name()
        // -------------------------------------------------

        (bool ok, bytes memory data) = token.staticcall(
            abi.encodeWithSelector(NAME_SELECTOR)
        );

        if (ok) {
            // Try standard ABI string first.
            try this.decodeName(data) returns (
                string memory name_
            ) {
                info.tokenName = name_;
                info.nameAvailable = true;

            } catch {
                // Fallback to legacy bytes32 name().
                if (data.length == 32) {
                    bytes32 rawName;

                    assembly {
                        rawName := mload(add(data, 32))
                    }

                    info.tokenName = bytes32ToString(rawName);
                    info.nameAvailable = true;
                }
            }
        }


        // -------------------------------------------------
        // 2. Read nonces(owner)
        // -------------------------------------------------

        (ok, data) = token.staticcall(
            abi.encodeWithSelector(
                NONCES_SELECTOR,
                owner
            )
        );

        if (ok && data.length >= 32) {
            info.nonce = abi.decode(data, (uint256));
            info.nonceAvailable = true;
        }


        // -------------------------------------------------
        // 3. Read DOMAIN_SEPARATOR()
        // -------------------------------------------------

        (ok, data) = token.staticcall(
            abi.encodeWithSelector(
                DOMAIN_SEPARATOR_SELECTOR
            )
        );

        if (ok && data.length >= 32) {
            info.domainSeparator = abi.decode(data, (bytes32));
            info.domainSeparatorAvailable = true;
        }


        // -------------------------------------------------
        // 4. Read EIP-5267 eip712Domain()
        // -------------------------------------------------

        (ok, data) = token.staticcall(
            abi.encodeWithSelector(
                EIP712_DOMAIN_SELECTOR
            )
        );

        if (ok && data.length >= 224) {
            try this.decodeDomain(data) returns (
                bytes1 fields,
                string memory name_,
                string memory version_,
                uint256 chainId_,
                address verifyingContract_,
                bytes32 salt_
            ) {
                info.domainFields = fields;
                info.domainName = name_;
                info.version = version_;
                info.domainChainId = chainId_;
                info.verifyingContract = verifyingContract_;
                info.salt = salt_;

                info.eip712DomainAvailable = true;

            } catch {
                // Ignore malformed EIP-5267 response.
            }
        }


        // -------------------------------------------------
        // 5. Fallback domain name
        // -------------------------------------------------

        if (
            !info.eip712DomainAvailable &&
            info.nameAvailable
        ) {
            info.domainName = info.tokenName;
        }
    }


    /// @notice Decode standard ERC20 name() return data.
    function decodeName(
        bytes calldata data
    )
        external
        pure
        returns (string memory)
    {
        return abi.decode(data, (string));
    }


    /// @notice Decode EIP-5267 domain return data.
    function decodeDomain(
        bytes calldata data
    )
        external
        pure
        returns (
            bytes1 fields,
            string memory name_,
            string memory version_,
            uint256 chainId_,
            address verifyingContract_,
            bytes32 salt_
        )
    {
        uint256[] memory extensions;

        (
            fields,
            name_,
            version_,
            chainId_,
            verifyingContract_,
            salt_,
            extensions
        ) = abi.decode(
            data,
            (
                bytes1,
                string,
                string,
                uint256,
                address,
                bytes32,
                uint256[]
            )
        );

        // Silence unused-variable warning.
        extensions;
    }


    /// @notice Convert legacy bytes32 token name to string.
    function bytes32ToString(
        bytes32 value
    )
        internal
        pure
        returns (string memory)
    {
        uint256 length;

        while (
            length < 32 &&
            value[length] != 0
        ) {
            length++;
        }

        bytes memory result = new bytes(length);

        for (uint256 i; i < length; i++) {
            result[i] = value[i];
        }

        return string(result);
    }
}
