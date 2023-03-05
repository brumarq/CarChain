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

    mapping(address => Car[]) public cars;

    function createCar(string memory _licensePlate, string memory _chassisNumber, string memory _brand, string memory _carType, string memory _color, uint256 _mileage, uint256 _price,bool _isForsale) public {
        Car memory newCar = Car(_licensePlate, _chassisNumber, _brand, _carType, _color, _mileage, msg.sender, _price, _isForsale);
        cars[msg.sender].push(newCar);
    }

    function updateCarMileage(uint256 _mileage, uint256 _carIndex) public {
        require(cars[msg.sender][_carIndex].owner == msg.sender, "Only the car owner can update the mileage");
        require(_mileage > cars[msg.sender][_carIndex].mileage, "New mileage must be higher than previous mileage");
        cars[msg.sender][_carIndex].mileage = _mileage;
    }

    function getCarData(address _owner, uint256 _carIndex) public view returns (Car memory) {
        require(_carIndex < cars[_owner].length, "Invalid car index");
        return (cars[_owner][_carIndex]);
    }

    function setCarForSale(uint256 _price, uint256 _carIndex) public {
        require(cars[msg.sender][_carIndex].owner == msg.sender, "Only the car owner can put the car for sale");
        cars[msg.sender][_carIndex].isForSale = true;
        cars[msg.sender][_carIndex].price = _price;
    }

    function adjustSalePrice(uint256 _price, uint256 _carIndex) public {
        require(cars[msg.sender][_carIndex].owner == msg.sender, "Only the car owner can adjust the sale price.");
        require(cars[msg.sender][_carIndex].isForSale == true, "The car must be for sale to adjust the price.");
        cars[msg.sender][_carIndex].price = _price;
    }

    function buyCar(address _owner, uint256 _carIndex) public payable {
        require(_carIndex < cars[_owner].length, "Invalid car index");
        require(cars[_owner][_carIndex].isForSale == true, "Car is not for sale");
        require(msg.value == cars[_owner][_carIndex].price, "Incorrect payment amount");
        payable(cars[_owner][_carIndex].owner).transfer(msg.value);
        cars[_owner][_carIndex].owner = msg.sender;
        cars[_owner][_carIndex].isForSale = false;
    }

     function getCarsForSale() public view returns (Car[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < cars[msg.sender].length; i++) {
            if (cars[msg.sender][i].isForSale == true) {
                count++;
            }
        }
        Car[] memory result = new Car[](count);
        count = 0;
        for (uint256 i = 0; i < cars[msg.sender].length; i++) {
            if (cars[msg.sender][i].isForSale == true) {
                result[count] = cars[msg.sender][i];
                count++;
            }
        }
        return result;
    }
}
