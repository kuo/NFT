pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract NonfungibleToken is ERC721Token("TooLong", "Knife"), Ownable {

    mapping (address => uint256[]) internal ownedTokens;

    function create(uint256 count) public {
        uint i = 0;
        uint256 tokenId = 0;
        for (i; i < count; i++) {
            tokenId = allTokens.length + i + 20180712;
            _mint(msg.sender, tokenId);
            addToken(msg.sender, tokenId);
        } 
    }

    function addToken(address _to, uint256 _tokenId) private {
        ownedTokens[_to].push(_tokenId);
    }

    function getAllTokens(address _addr) view public returns (string _name, string _symbol, uint[]) {
        return (name_, symbol_, ownedTokens[_addr]);
    }

    
}