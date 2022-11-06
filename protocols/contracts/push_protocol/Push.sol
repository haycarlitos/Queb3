//pragma solidity ^0.6.2;
 

pragma solidity ^0.8.0; 
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0/contracts/token/ERC20/ERC20.sol";

// PASOS : 
// # CREAR CANAL EN PUSH CON NUEVA WALLET 
// # CAMBIAR LA DIRECCIÓN DE LA WALLET MAESTRA 
// # DEPLOYAR EL CONTRATO 
// # ASIGNAR EN EL LOG EL FORM AL DELEGATE 
// # PROBAR LAS FUNCIONES

interface IPUSHCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}

contract Push is ERC20 {
    address public EPNS_COMM_ADDRESS = 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa;

    constructor ()
        ERC20("Push Token", "PUSH")
        public {
        _mint(msg.sender, 1000 * 10 ** uint(decimals()));
    }

    function comment(address to,address from) public returns (bool success) {
        IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            0x3D75aF4c521E1328f68023a732219DC802bD948b, // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
            to, // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        "New Comment", // this is notificaiton title
                        "+", // segregator
                        "ey!! ", // notification body
                        addressToString(from), // notification body
                        " sent ", // notification body
                        " new comment" // notification body
                    )
                )
            )
        );
        return true;
    }


    function like(address to,address from) public returns (bool success) {
        IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            0x3D75aF4c521E1328f68023a732219DC802bD948b, // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
            to, // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        "New Like", // this is notificaiton title
                        "+", // segregator
                        "ey!! ", // notification body
                        addressToString(from), // notification body
                        " sent ", // notification body
                        " new like" // notification body
                    )
                )
            )
        );
        return true;
    }

    function transfer(address to, uint amount) override public returns (bool success) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        
        IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            //1 cambiar la dirección del contrado desplegado 
            //
            //3 deployar el contrato Push y copiar la dirección from de logs 
            // crear una nueva delegate desde push staging app 

            0x619984A6F3db9b6B774bEfEA7C8CD73A1419e7Ed, // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
            to, // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        "Tranfer Alert", // this is notificaiton title
                        "+", // segregator
                        "Hooray! ", // notification body
                        addressToString(msg.sender), // notification body
                        " sent ", // notification body
                        uint2str(amount.div(10 ** uint(decimals()))), // notification body
                        " PUSH to you!" // notification body
                    )
                )
            )
        );

        return true;
    }

    // Helper function to convert address to string
    function addressToString(address _address) internal pure returns(string memory) {
        bytes32 _bytes = bytes32(uint256(uint160(_address)));
        bytes memory HEX = "0123456789abcdef";
        bytes memory _string = new bytes(42);
        _string[0] = '0';
        _string[1] = 'x';
        for(uint i = 0; i < 20; i++) {
            _string[2+i*2] = HEX[uint8(_bytes[i + 12] >> 4)];
            _string[3+i*2] = HEX[uint8(_bytes[i + 12] & 0x0f)];
        }
        return string(_string);
    }

    // Helper function to convert uint to string
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}