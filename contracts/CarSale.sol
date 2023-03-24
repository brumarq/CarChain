pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CarSale is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("CarSaleNFT", "PFT") {}

    struct Car {
        uint256 carId;
        string licensePlate;
        string chassisNumber;
        string brand;
        string carType;
        string color;
        uint256 mileage;
        address owner;
        uint256 price;
        bool isForSale;
        string[] picture;
    }

    struct MileageHistory {
        uint256 mileage;
        address changer;
        uint256 timestamp;
    }

    mapping(uint256 => Car) private _cars;
    mapping(string => uint256) private _chassisNumberToTokenId;
    mapping(uint256 => MileageHistory[]) private _mileageHistories;

    function createCar(string memory licensePlate, string memory chassisNumber, string memory brand, string memory carType, string memory color, uint256 mileage, uint256 price, bool isForSale, string[] memory picture) public {
        require(_chassisNumberToTokenId[chassisNumber] == 0, "Car with this chassis number already exists");
        _tokenIds.increment();
        uint256 newCarId = _tokenIds.current();
        _cars[newCarId] = Car(newCarId, licensePlate, chassisNumber, brand, carType, color, mileage, msg.sender, price, isForSale, picture);
        _chassisNumberToTokenId[chassisNumber] = newCarId;

        MileageHistory memory newEntry = MileageHistory(mileage, msg.sender, block.timestamp);
        _mileageHistories[newCarId].push(newEntry);

        _safeMint(msg.sender, newCarId);
    }

    function updateCar(uint256 mileage, uint256 price, bool onSale, uint256 carId) public {
        if (_cars[carId].mileage != mileage) {
            updateCarMileage(mileage, carId);
        }

        setCarForSale(onSale, carId);

        if (_cars[carId].isForSale) {
            adjustSalePrice(price, carId);
        }
    }

    function updateCarMileage(uint256 mileage, uint256 carId) public {
        require(_isApprovedOrOwner(msg.sender, carId), "Only the car owner can update the mileage");
        require(mileage > _cars[carId].mileage, "New mileage must be higher than previous mileage");
        MileageHistory memory newEntry = MileageHistory(mileage, msg.sender, block.timestamp);
        _mileageHistories[carId].push(newEntry);
        _cars[carId].mileage = mileage;
    }

    function getMileageHistory(uint256 carId) public view returns (MileageHistory[] memory) {
        return _mileageHistories[carId];
    }

    function getCarData(uint256 carId) public view returns (Car memory) {
        return (_cars[carId]);
    }

    function setCarForSale(bool forSale, uint256 carId) public {
        require(_isApprovedOrOwner(msg.sender, carId), "Only the car owner can put the car for sale");
        _cars[carId].isForSale = forSale;
    }

    function adjustSalePrice(uint256 price, uint256 carId) public {
        require(_isApprovedOrOwner(msg.sender, carId), "Only the car owner can adjust the sale price.");
        require(_cars[carId].isForSale == true, "The car must be for sale to adjust the price.");
        _cars[carId].price = price;
    }

    function buyCar(uint256 carId) public payable {
        require(_exists(carId), "Invalid car ID");
        require(_cars[carId].isForSale == true, "Car is not for sale");
        require(msg.value == _cars[carId].price, "Incorrect payment amount");

        address owner = _cars[carId].owner;
        payable(owner).transfer(msg.value);
        _transfer(owner, msg.sender, carId);
        _cars[carId].owner = msg.sender;
        _cars[carId].isForSale = false;
    }

    function getCarsForSale() public view returns (Car[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (_cars[i].isForSale == true) {
                count++;
            }
        }

        Car[] memory carsForSale = new Car[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (_cars[i].isForSale == true) {
                carsForSale[index] = _cars[i];
                index++;
            }
        }
        return carsForSale;
    }
}
