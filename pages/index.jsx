import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import { abi } from '../constants/abi';

let web3Modal;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: { 4: process.env.PUBLIC_RPC_URL }
      //infuraId: "INFURA_ID" // required
    }
  }
}

if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "rinkeby",
    cacheProvider: false,
    providerOptions
  });
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(undefined);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      if (!isConnected) { // user isn't connected and wishes to be
        try {
          const web3ModalProvider = await web3Modal.connect();
          setIsConnected(true);
          const provider = new ethers.providers.Web3Provider(web3ModalProvider);
          setSigner(provider.getSigner());
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      setIsConnected(false);
    }
  };

  // step 1: store form data along with associated NFT into a database
  // step 2: tell the contract the NFT is not in the vault so that future transfers require admin checkoff
  const vault_submit = async () => {
    if (typeof window.ethereum !== "undefined" && isConnected) {
      const fNameObj = document.getElementById("fname");
      const lNameObj = document.getElementById("lname");
      const aptOrSuiteNumberObj = document.getElementById("apt_suite_number");
      const addressObj = document.getElementById("address");
      const cityObj = document.getElementById("city");
      const stateObj = document.getElementById("state");
      const zipObj = document.getElementById("zip");

      // TODO: store in database such that the admin can see it


      // clear form data
      fNameObj.value = "";
      lNameObj.value = "";
      aptOrSuiteNumberObj.value = "";
      addressObj.value = "";
      cityObj.value = "";
      stateObj.value = "";
      zipObj.value = "";

      const contractAddress = "0xabcdefg...";
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        await contract.removeNFTFromVault()
      } catch (error) {
        console.error(error);
      }
    }
  }

  // TODO: Fix the fact that the button says "connect" when the wallet is already connected after a refresh

  return (
    <>
      <Head>
        <title>NFT Card Shop</title>
        <meta name="description" content="NFT Card Shop Website" />
      </Head>
      <ul className="nav">
        <li><a href="#">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#team">The Team</a></li>
        <li><a href="#vault">The Vault</a></li>
        <li style={{ float: "right" }}>
          <a id="walletButton" href="#vault" onClick={connect}>
            {isConnected ? (
              <span>Connected</span>
            ) : (
              <span>Connect Wallet</span>
            )}
          </a>
        </li>
      </ul>

      <div className="header center">
        <span>
          <h1>NFT Card Shop</h1>
          <h7>This is a description of the project.</h7>
        </span>
      </div>

      <div className={styles.container}>
        <div id="about">
          <h2>About the Project</h2>
          <p>Morbid Munchkins NFT has utilization so it’s not just a JPEG.
            We have private access events as well as it will be connected to the metaverse.
            SO the NFT will serve as a ticket to the events and as a game character in the metaverse</p>
        </div>
        <div id="team">
          <h2>The Team</h2>
          <p>The Munchies were created by 4 friends who all met in college and went separate ways. Now we
            combine back to bring one of the best NFT projects yet.
            The Drinker: Will be buying all the champagnes and other bottles (you will see him at the events,
            he never orders under 10 bottles).
            Ramon Ramon: The strategist. Never plays it safe
            Natasha: The artist that doesn’t use a paintbrush
            Regular Gordon: Nothing, nothing at all. We don’t even know what he’s doing.</p>
        </div>
        <div id="roadmap">
          <h2>Roadmap</h2>
          <p>What are the Morbid Munchkins?
            The Morbid Munchkins are a playable game-inspired NFT collection. Only 4,000 NFT’s will be
            made. Never anymore. With most NFT collections being just plain images and being useless
            we are making it into an online game where you can earn real money just for playing. On top of
            this, we will be hosting private events for holders as well as
            access to star-studded events such
            as NYFW and the Cannes Film Festival, and many more star-studded events.
            Fair Distribution:
            The price will be 1 Sol. Never anymore. There is no tier system. Everyone is the same
            from the beginning and can only upgrade based on their online skill games and upgrading in
            the game itself. Money will not buy you a rank here.
            Every Member will get access to our private online home. This will be where all the events
            will be posted and every post will be deleted within 24 hours to make sure privacy remains
            among all users.</p>
        </div>
        <div id="vault">
          <h2>The Vault</h2>
          <p>Description of the vault</p>

          <h3>Request Card From Vault</h3>
          {(signer/*.address*/ == "0xAddressOfContractAdmin") ? (
            ""
          ) : (
            <form action="javascript:void(0);">
              <label htmlFor="fname">First Name:</label><br />
              <input type="text" id="fname" name="fname" /><br />

              <label htmlFor="lname">Last Name:</label><br />
              <input type="text" id="lname" name="lname" /><br />

              <label htmlFor="apt_suite_number">Apt/Suite Number:</label><br />
              <input type="text" id="apt_suite_number" name="apt_suite_number" /><br />

              <label htmlFor="address">Full Street Address:</label><br />
              <input type="text" id="address" name="address" /><br />

              <label htmlFor="city">City:</label><br />
              <input type="text" id="city" name="city" /><br />

              <label htmlFor="state">State:</label><br />
              <input type="text" id="state" name="state" /><br />

              <label htmlFor="zip">Zipcode:</label><br />
              <input type="text" id="zip" name="zip" /><br />

              <button onClick={() => vault_submit()}>Submit</button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
