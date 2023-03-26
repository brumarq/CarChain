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

    // Define mappings to store information about the cars being sold and their mileage histories
    mapping(uint256 => Car) private _cars;
    mapping(string => uint256) private _chassisNumberToTokenId;
    mapping(uint256 => MileageHistory[]) private _mileageHistories;

    function createCar(string memory licensePlate, string memory chassisNumber, string memory brand, string memory carType, string memory color, uint256 mileage, uint256 price, bool isForSale, string[] memory picture) public {
        require(_chassisNumberToTokenId[chassisNumber] == 0, "Car with this chassis number already exists");
        require(bytes(licensePlate).length != 0 && bytes(chassisNumber).length != 0 && bytes(brand).length != 0 && bytes(carType).length != 0 && bytes(color).length != 0, "Make sure to fill all the necessary fields.");
        
        // Increment the token ID to assign a new ID to the car NFT
        _tokenIds.increment();
        uint256 newCarId = _tokenIds.current();

        // Build car
        _cars[newCarId] = Car(newCarId, licensePlate, chassisNumber, brand, carType, color, mileage, msg.sender, price, isForSale, picture);
        _chassisNumberToTokenId[chassisNumber] = newCarId;
        
        // Add the initial mileage to the car's mileage history
        MileageHistory memory newEntry = MileageHistory(mileage, msg.sender, block.timestamp);
        _mileageHistories[newCarId].push(newEntry);
        
        // Mint the new car NFT and assign ownership to the seller
        _safeMint(msg.sender, newCarId);
    }

    // This function is used to update the mileage, price, saleStatus of a car
    function updateCar(uint256 mileage, uint256 price, bool onSale, uint256 carId) public {
        if (_cars[carId].mileage != mileage) {
            updateCarMileage(mileage, carId);
        }

        setCarForSale(onSale, carId);

        if (_cars[carId].isForSale) {
            adjustSalePrice(price, carId);
        }
    }

    // This function allows a car owner to update the mileage of their car and adds the change to 
    // the history of the car mileage.
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

    // This functions allows the owner to put or remove his car from sale
    function setCarForSale(bool forSale, uint256 carId) public {
        require(_isApprovedOrOwner(msg.sender, carId), "Only the car owner can put the car for sale");
        _cars[carId].isForSale = forSale;
    }

    // This function allows the owner to adjust his car's price, if it is for sale
    function adjustSalePrice(uint256 price, uint256 carId) public {
        require(_isApprovedOrOwner(msg.sender, carId), "Only the car owner can adjust the sale price.");
        require(_cars[carId].isForSale == true, "The car must be for sale to adjust the price.");
        _cars[carId].price = price;
    }

    function buyCar(uint256 carId) public payable {
        require(_exists(carId), "Invalid car ID");
        require(_cars[carId].isForSale == true, "Car is not for sale");
        require(msg.value == _cars[carId].price, "Incorrect payment amount");

        // Get the current owner of the car
        address owner = _cars[carId].owner;

        // Transfer payment to the owner
        payable(owner).transfer(msg.value);
        
        // Transfer ownership of the car to the buyer
        _transfer(owner, msg.sender, carId);

        // Update the car's owner and availability
        _cars[carId].owner = msg.sender;
        _cars[carId].isForSale = false;
    }

    function getCarsForSale() public view returns (Car[] memory) {
        uint256 count = 0;

        // Iterate over all the car tokens to count how many cars are for sale
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (_cars[i].isForSale == true) {
                count++;
            }
        }

        // Create a new array of Cars with the size equal to the number of cars for sale
        Car[] memory carsForSale = new Car[](count);
        uint256 carIndex = 0;
        
        // Iterate over all the car tokens again and add the cars that are for sale to the array
        for (uint256 tokenId = 1; tokenId <= _tokenIds.current(); tokenId++) {
            if (_cars[tokenId].isForSale == true) {
                carsForSale[carIndex] = _cars[tokenId];
                carIndex++;
            }
        }
        return carsForSale;
    }

    function getCarsByOwner() public view returns (Car[] memory) {
        // Get the number of cars owned by the caller
        uint256 carCount = balanceOf(msg.sender);

        // Create a new array of Cars with the size equal to the number of cars owned by the caller
        Car[] memory cars = new Car[](carCount);
        
        // Initialize a counter variable to keep track of the index of the car being added to the array
        uint256 carIndex = 0;

        // Iterate over all the car tokens
        for (uint256 tokenId = 1; tokenId <= _tokenIds.current(); tokenId++) {
            // Check if the token represents a car that exists and is owned by the caller
            if (_exists(tokenId) && ownerOf(tokenId) == msg.sender) {
                // Add the car to the array and increment the index counter
                cars[carIndex] = _cars[tokenId];
                carIndex++;
            }
        }

        return cars;
    }
}
