# NoteFlix
An Implementation of Decentralized music streaming application

This is an implementation of decentralized music streaming application. This application can be used by users to buy music from the platform or upload music
to the platform. This is a smart contract-based application where smart contracts control user registration, the flow of money, as well as flow of data.

### Advantages of Decentralized Platforms over Centralised Platforms:

##### 1. Control of Content :

In centralized platforms, the content published on the platforms is monitored by centralized authorities. These central authorities have control over the censorship 
of content, the may add, remove, update or even ban a users account. This makes a user put there trust in these authorities.

In decentralized platforms, the content creator is the one having complete control of his content. A user can publish his content without any fear of censorship.
Any user can access and pay for content which he wants to listen.

##### 2. Control of Monetization :

These Centralized platforms also control the monetization of the content. The centralization of money always benefits the authorities in control of cash flow.
These authorities use ad revenue from the content creator which makes up a major part of revenue. So, a content creator loses a major part of there revenue to these centralized authorities.

In Decentralized platforms, the user has complete control of money. Once, the user publishes the content, he has complete control over the funds received by his content. If a user's content has funds, he has control to withdraw these funds without middlemen.

### Smart Contracts :

##### 1. Factory Contract :

The Factory contract can be used to register and add new users. This contract is also responsible to store instances of User Contracts deployed as well as
all Music Contract deployed by users.

##### 2. User Contract : 

A User Contract is deployed by Factory Contract. A User Contract stores name of User as well as instances of Music Contract deployed by this UserContract.

##### 3. Music Contract :

A Music Contract stores data related to Music. It stores the hash of music, name of music and price of music. This is the contract where the user interacts with
Music.

### Developing the application locally :

0. Pre-requisites:

        a. node : v12.x.x (preferred)
    
        b. yarn : v 1.22.0 (preferred over npm)
    
        c. npm :  v 6.x.x

1. Clone the repository

  ```
  > git clone https://github.com/samarth9201/music-stream-decentralized.git cd music-stream-decentralized
  ```
2. Install the dependency.

    a. Using yarn :
    ```
    > yarn install
    ```
    
    b. Using npm : 
    ```
    > npm install
    > cd src
    > npm install
    
3. Start Ganache GUI. It should run on http://127.0.0.1:7545.
4. Import Ganache Accounts in Metamask.
5. Compile and migrate the contracts.

  ```
  > truffle compile
  > truffle migrate --reset
  ```
  
6. Start the development server to run the application.
  ```
  > yarn start
  ```
  ```
  > npm start
  ```

To test the contracts, run
```
> truffle test
```

