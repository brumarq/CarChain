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

    mapping(string => Car) public cars;
    string[] private carsIdentifiers;    
    uint private amountOfCars;


    function createCar(string memory _licensePlate, string memory _chassisNumber, string memory _brand, string memory _carType, string memory _color, uint256 _mileage, uint256 _price,bool _isForsale) public {
        require(cars[_chassisNumber].owner == address(0), "Car with this chassis number already exists");
        Car memory newCar = Car(_licensePlate, _chassisNumber, _brand, _carType, _color, _mileage, msg.sender, _price, _isForsale);
        cars[_chassisNumber] = newCar;
        carsIdentifiers.push(_chassisNumber);
        amountOfCars++;
    }

    function updateCarMileage(uint256 _mileage, string memory _chassisNumber) public {
        require(cars[_chassisNumber].owner == msg.sender, "Only the car owner can update the mileage");
        require(_mileage > cars[_chassisNumber].mileage, "New mileage must be higher than previous mileage");
        cars[_chassisNumber].mileage = _mileage;
    }

    function getCarData(string memory _chassisNumber) public view returns (Car memory) {
        //require(cars[_chassisNumber].owner != address(0), "Invalid chassis number");
        return (cars[_chassisNumber]);
    }

    function setCarForSale(uint256 _price, string memory _chassisNumber) public {
        require(cars[_chassisNumber].owner == msg.sender, "Only the car owner can put the car for sale");
        cars[_chassisNumber].isForSale = true;
        cars[_chassisNumber].price = _price;
    }

    function adjustSalePrice(uint256 _price, string memory _chassisNumber) public {
        require(cars[_chassisNumber].owner == msg.sender, "Only the car owner can adjust the sale price.");
        require(cars[_chassisNumber].isForSale == true, "The car must be for sale to adjust the price.");
        cars[_chassisNumber].price = _price;
    }

    function buyCar(string memory _chassisNumber) public payable {
        require(cars[_chassisNumber].owner != address(0), "Invalid chassis number");
        require(cars[_chassisNumber].isForSale == true, "Car is not for sale");
        require(msg.value == cars[_chassisNumber].price, "Incorrect payment amount");
        payable(cars[_chassisNumber].owner).transfer(msg.value);
        cars[_chassisNumber].owner = msg.sender;
        cars[_chassisNumber].isForSale = false;
    }

    function getCarsForSale() public view returns (Car[] memory) {
        Car[] memory result = new Car[](amountOfCars);
        uint256 index = 0;
        for (uint256 i = 0; i < amountOfCars; i++) {
            if (cars[carsIdentifiers[i]].isForSale) {
                result[index] = cars[carsIdentifiers[i]];
                index++;
            }
        }
        return result;
    }
}
