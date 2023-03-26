# CarChain
Second-hand car sales in the Netherlands can be problematic due to inaccurate representations of the vehicle, hidden defects, and fraudulent odometer readings. Payment disputes can also arise between private individuals, exacerbating the issue.

## Setup

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
