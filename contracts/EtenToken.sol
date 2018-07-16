pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract EtenToken is ERC721Token("Eten", "Sword"), Ownable {

    mapping (address => uint256[]) internal ownedTokens;
    mapping (address => uint) internal ownedTokenCount;
    mapping (uint => address) public tokenOwner;    //find owner by tokenId

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
        ownedTokens[_to].push(_tokenId);
    }

    function getAllTokens(address _addr) view public returns (string _name, string _symbol, uint[]) {
        return (name_, symbol_, ownedTokens[_addr]);
    }

    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        ownedTokenCount[_to] = ownedTokenCount[_to].add(1);
        ownedTokenCount[msg.sender] = ownedTokenCount[msg.sender].sub(1);
        tokenOwner[_tokenId] = _to; //轉移對象
        emit Transfer(msg.sender, _to, _tokenId);
    }

    

}