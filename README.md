# CarChain
A market to sell your car, or buy a new car in the blockchain 

<img width="1105" alt="Screenshot 2023-03-31 175843" src="https://user-images.githubusercontent.com/44119479/229171097-b76154ca-5bb0-4f10-ad7c-df22d159be81.png">

## Description
Second-hand car sales in the Netherlands can be problematic due to inaccurate representations of the vehicle, hidden defects, and fraudulent odometer readings. Payment disputes can also arise between private individuals, exacerbating the issue.

## Technologies
- Frontend: Next.js, Typescript, Tailwind
- Backend: Solidity, Truffle, Ganache

## Usage
First, run ganache locally, in my case I run it in the terminal.

```bash
  $ ganache
```

Afterwards we migrate the contracts using truffle

```bash
  $ truffle console
  > migrate
```
We also have to spin up the jsipfs deamon so store our files.

```bash
  $ jsipfs daemon
```

Lastly we navigate to the client directory, and install all the packages and spin up the frontend.
```bash
  $ cd client/
  $ npm install
  $ npm run dev
```
