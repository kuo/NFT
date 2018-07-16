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

    function getLastTokenId(address _addr) view public returns (uint[] _tokens) {

        // if (ownedTokenCount[_addr] > 0) {
        //     uint256 lastIndex = ownedTokens[_addr].length.sub(1);
        //     uint256[] aryOfTokens = ownedTokens[_addr];
        //     uint256 lastToken = aryOfTokens[lastIndex];
        //     return lastToken;
        // } else {
        //     return 0;
        // }
        //uint[] aryOfTokens = ownedTokens[_addr];

        return ownedTokens[_addr];
    }

    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) returns (uint256 _index, uint256 _lastIndex, uint256 _lastToken ) {
        // ownedTokenCount[_to] = ownedTokenCount[_to].add(1);
        // ownedTokenCount[msg.sender] = ownedTokenCount[msg.sender].sub(1);
        // tokenOwner[_tokenId] = _to; //轉移對象
        // emit Transfer(msg.sender, _to, _tokenId);
        //clearApprovalAndTransfer(msg.sender, _to, _tokenId);

        uint256 index = tokenIndex[_tokenId];
        uint256 lastIndex = ownedTokens[msg.sender].length.sub(1);
        uint256 lastToken = ownedTokens[msg.sender][lastIndex];

        return (index, lastIndex, lastToken);
    }

    function clearApprovalAndTransfer(address _from, address _to, uint256 _tokenId) private {
        require(_to != address(0));
        require(_to != _from);
        require(tokenOwner[_tokenId] == _from);

        //removeTokenFromSender(_from, _tokenId);

        uint256 index = tokenIndex[_tokenId];
        uint256 lastIndex = ownedTokens[_from].length.sub(1);
        uint256 lastToken = ownedTokens[_from][lastIndex];
    }

    // function removeTokenFromSender(address _from, uint256 _tokenId) private {
    //     require(tokenOwner[_tokenId] == _from);

    //     uint256 index = tokenIndex[_tokenId];
    //     uint256 lastIndex = ownedTokens[_from].length.sub(1);
    //     uint256 lastToken = ownedTokens[_from][lastIndex];
    // }
        
    

    
}