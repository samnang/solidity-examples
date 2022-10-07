// SPDX-License-Identifier: MIT
//
// https://docs.alchemy.com/docs/5-connect-apis-to-your-smart-contracts-using-chainlink
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract BullnBear is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    KeeperCompatibleInterface,
    VRFConsumerBaseV2
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    AggregatorV3Interface private _priceFeed;

    // VRF
    VRFCoordinatorV2Interface public immutable COORDINATOR;
    uint256[] public vrfRandomWords;
    uint256 public vrfRequestId;
    uint64 public immutable vrfSubscriptionId;
    bytes32 public immutable vrfKeyhash; // https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    uint32 public constant callbackGasLimit = 500000; // set higher as fulfillRandomWords is doing a LOT of heavy lifting.
    uint8 public constant minConfirmations = 3;
    uint8 public constant numOfRandomWords = 1;

    /**
     * Use an interval in seconds and a timestamp to slow execution of Upkeep
     */
    uint256 public interval;
    uint256 public lastTimeStamp;

    int256 public currentPrice; // BTC in USD
    enum MarketTrend {
        BULL,
        BEAR
    }
    MarketTrend public currentMarketTrend = MarketTrend.BULL;

    // IPFS URIs for the dynamic nft graphics/metadata.
    // NOTE: These connect to my IPFS Companion node.
    // You should upload the contents of the /ipfs folder to your own node for development.
    string[] bullUrisIpfs = [
        "https://ipfs.io/ipfs/QmRXyfi3oNZCubDxiVFre3kLZ8XeGt6pQsnAQRZ7akhSNs?filename=gamer_bull.json",
        "https://ipfs.io/ipfs/QmRJVFeMrtYS2CUVUM2cHJpBV5aX2xurpnsfZxLTTQbiD3?filename=party_bull.json",
        "https://ipfs.io/ipfs/QmdcURmN1kEEtKgnbkVJJ8hrmsSWHpZvLkRgsKKoiWvW9g?filename=simple_bull.json"
    ];
    string[] bearUrisIpfs = [
        "https://ipfs.io/ipfs/Qmdx9Hx7FCDZGExyjLR6vYcnutUR8KhBZBnZfAPHiUommN?filename=beanie_bear.json",
        "https://ipfs.io/ipfs/QmTVLyTSuiKGUEmb88BgXG3qNC8YgpHZiFbjHrXKH3QHEu?filename=coolio_bear.json",
        "https://ipfs.io/ipfs/QmbKhBXVWmwrYsTPFYfroR2N7NAekAMxHUVg2CWks7i9qj?filename=simple_bear.json"
    ];

    event TokensUpdatd(string marketTrend);

    constructor(
        uint256 updateInterval,
        uint64 subscriptionId,
        bytes32 keyhash,
        address vrfCoordinator,
        address priceFeed
    ) ERC721("BullnBear", "BNBTK") VRFConsumerBaseV2(vrfCoordinator) {
        interval = updateInterval;
        lastTimeStamp = block.timestamp; // seconds since uinx epoch

        vrfSubscriptionId = subscriptionId;
        vrfKeyhash = keyhash;
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);

        _priceFeed = AggregatorV3Interface(priceFeed);

        currentPrice = getLatestPrice();
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        string memory defaultURI = bullUrisIpfs[0]; // default to bull NFT (everyone loves bull market!)
        _setTokenURI(tokenId, defaultURI);
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool, /* upkeepNeeded */
            bytes memory /* performData */
        )
    {
        return ((block.timestamp - lastTimeStamp) > interval, new bytes(0));
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        // Highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            int256 latestPrice = getLatestPrice();

            if (latestPrice == currentPrice) {
                // No update needed
                return;
            }

            currentMarketTrend = latestPrice > currentPrice ? MarketTrend.BULL : MarketTrend.BEAR;
            currentPrice = latestPrice;

            // Initiate the VRF calls to get a random number (word)
            // that will then be used to to choose one of the URIs
            // that gets applied to all minted tokens.
            requestRandomnessForNFTUris();
        }
    }

    function requestRandomnessForNFTUris() internal {
        vrfRequestId = COORDINATOR.requestRandomWords(
            vrfKeyhash,
            vrfSubscriptionId,
            minConfirmations,
            callbackGasLimit,
            numOfRandomWords
        );
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        require(vrfRequestId == requestId, "request not found");
        vrfRandomWords = randomWords;

        string[] memory urisForTrend = currentMarketTrend == MarketTrend.BULL ? bullUrisIpfs : bearUrisIpfs;
        uint256 randomIndex = randomWords[0] % urisForTrend.length; // use modulus to choose a random index.

        string memory newTokenUri = urisForTrend[randomIndex];
        updateAllTokenUris(newTokenUri);
    }

    function updateAllTokenUris(string memory newTokenUri) internal {
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            _setTokenURI(i, newTokenUri);
        }

        string memory trend = currentMarketTrend == MarketTrend.BULL ? "bullish" : "bearish";

        emit TokensUpdatd(trend);
    }

    function getLatestPrice() public view returns (int256 price) {
        // prettier-ignore
        (
            /*uint80 roundID*/,
            price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = _priceFeed.latestRoundData();
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
