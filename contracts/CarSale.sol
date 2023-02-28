pragma solidity >=0.8.17;

contract CarSale {
    struct Car {
        string licensePlate;
        string chassisNumber;
        string brand;
        string carType;
        string color;
        uint256 mileage;
        address owner;
        uint256 price;
        bool isForSale;
    }

    mapping(address => Car) public cars;

    function createCar(string memory _licensePlate, string memory _chassisNumber, string memory _brand, string memory _carType, string memory _color, uint256 _mileage) public {
        require(cars[msg.sender].owner == address(0), "Car already exists for this address");
        Car memory newCar = Car(_licensePlate, _chassisNumber, _brand, _carType, _color, _mileage, msg.sender, 0, false);
        cars[msg.sender] = newCar;
    }

    function updateCarMileage(uint256 _mileage) public {
        require(cars[msg.sender].owner == msg.sender, "Only the car owner can update the mileage");
        require(_mileage > cars[msg.sender].mileage, "New mileage must be higher than previous mileage");
        cars[msg.sender].mileage = _mileage;
    }

    function getCarData(address _owner) public view returns (Car memory) {
        require(cars[_owner].owner != address(0), "Car does not exist for this address");
        return (cars[_owner]);
    }

    function setCarForSale(uint256 _price) public {
        require(cars[msg.sender].owner == msg.sender, "Only the car owner can put the car for sale");
        cars[msg.sender].isForSale = true;
        cars[msg.sender].price = _price;
    }

    function adjustSalePrice(uint256 _price) public {
        require(cars[msg.sender].owner == msg.sender, "Only the car owner can adjust the sale price.");
        require(cars[msg.sender].isForSale == true, "The car must be for sale to adjust the price.");
        cars[msg.sender].isForSale = true;
        cars[msg.sender].price = _price;
    }

    /* function buyCar(address _owner) public payable {
        require(cars[_owner].owner != address(0), "Car does not exist for this address");
        require(cars[_owner].isForSale == true, "Car is not for sale");
        require(msg.value == cars[_owner].price, "Incorrect payment amount");
        payable(cars[_owner].owner).transfer(msg.value);
        cars[_owner].owner = msg.sender;
        cars[_owner].isForSale = false;
    } */
}
