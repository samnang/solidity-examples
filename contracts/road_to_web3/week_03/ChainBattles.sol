// SPDX-License-Identifier: MIT
//
// https://docs.alchemy.com/docs/3-how-to-make-nfts-with-on-chain-metadata-hardhat-and-javascript

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "./RandomNumbers.sol";

contract ChainBattles is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;

    struct Character {
        uint256 level;
        uint256 speed;
        uint256 strength;
    }

    Counters.Counter private _tokenIds;
    RandomNumbers randomNumbers;
    mapping(uint256 => Character) tokenIdToLevels;

    constructor() ERC721("Chain Battles", "CBTLS") {
        randomNumbers = new RandomNumbers();
    }

    function generateCharacter(uint256 tokenId) public view returns (string memory) {
        Character memory currentCharacter = tokenIdToLevels[tokenId];

        // prettier-ignore
        bytes memory svg = abi.encodePacked(
          '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',"Warrior",'</text>',
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">', "Levels: ", currentCharacter.level.toString(), '</text>',
            '<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle">', "Spped: ", currentCharacter.speed.toString(), '</text>',
            '<text x="50%" y="70%" class="base" dominant-baseline="middle" text-anchor="middle">', "Stregth: ", currentCharacter.strength.toString(), '</text>',
          '</svg>'
        );

        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
    }

    function getLevels(uint256 tokenId) public view returns (string memory) {
        uint256 levels = tokenIdToLevels[tokenId].level;
        return levels.toString();
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        // prettier-ignore
        bytes memory dataURI = abi.encodePacked(
          '{',
            '"name": "Chain Battles #', tokenId.toString(), '",',
            '"description": "Battles on chain",',
            '"image": "', generateCharacter(tokenId), '"',
          '}'
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
    }

    function mint() public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        tokenIdToLevels[newItemId] = Character(0, 1, 1);
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    function train(uint256 tokenId) public {
        require(_exists(tokenId), "Please use an existing token");
        require(ownerOf(tokenId) == msg.sender, "You must own this token to train it");
        Character storage currentCharacter = tokenIdToLevels[tokenId];
        uint256 randomNumber = randomNumbers.getRandomNumber();
        currentCharacter.level += randomNumber;
        currentCharacter.speed += randomNumber;
        currentCharacter.strength += randomNumber;
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }
}
