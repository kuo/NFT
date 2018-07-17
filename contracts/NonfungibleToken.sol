pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract NonfungibleToken is ERC721Token("TooLong", "Knife"), Ownable {

    mapping (address => uint256[]) internal ownedTokens;
    mapping (address => uint) internal ownedTokenCount;
    mapping (uint => address) public tokenOwner;    //find owner by tokenId
    // Mapping from deed ID to index of the owner deeds list
    mapping(uint256 => uint256) private tokenIndex;


    function create(uint256 count) public {
        uint i = 0;
        uint256 tokenId = allTokens.length + 1;
        for (i; i < count; i++) {
            tokenId = tokenId + i + 2018071200;
            _mint(msg.sender, tokenId);
            addToken(msg.sender, tokenId);
            ownedTokenCount[msg.sender]++;
            tokenOwner[tokenId] = msg.sender;
        } 
    }

    function addToken(address _to, uint256 _tokenId) private {
        uint256 length = ownedTokens[_to].length;
        ownedTokens[_to].push(_tokenId);
        tokenIndex[_tokenId] = length;
    }

    function getAllTokens(address _addr) view public returns (string _name, string _symbol, uint[]) {
        return (name_, symbol_, ownedTokens[_addr]);
    }

    function getIndexByTokenId(uint256 _tokenId) view public returns (uint256 _index) {
        uint256 index = tokenIndex[_tokenId];
        return index;
    }

    function getLastOneTokenIndex(address _addr) view public returns (uint256 _index) {
    
        if (ownedTokenCount[_addr] > 0) {
            uint256 lastIndex = ownedTokens[_addr].length.sub(1);
            return lastIndex;
        } else {
            return 0;
        }
    }

    function getLastTokenId(address _addr) view public returns (uint _lastTokenId) {
        uint l = ownedTokens[_addr].length;
        uint lastToken = ownedTokens[_addr][l-1];

        return lastToken;
    }

    function transferToken(address _from, address _to, uint _tokenId) public {
        if(ownedTokens[_from].length > 1) {
            uint256 index = tokenIndex[_tokenId];
            uint mLength = ownedTokens[_from].length;
            uint mLastToken = ownedTokens[_from][mLength-1];
        
            ownedTokens[_from][index] = mLastToken;
            tokenIndex[mLastToken] = index;
        }
        
        //array length--
        ownedTokens[_from].length--;
        
        //set token to receiver
        tokenOwner[_tokenId] = _to;
        ownedTokens[_to].push(_tokenId);
        
        //
        emit Transfer(msg.sender, _to, _tokenId);
    }
        
    

    
}