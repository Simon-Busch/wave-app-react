import './App.css';
import React, { useEffect, useState } from 'react';
import Messages from './components/Messages/messages/messages';
import MessagInput from './components/Messages/messageInput/messagInput';
import Button from './components/UI/Button/button';
import { ethers } from 'ethers';
import Loader from "react-loader-spinner";
import abi from './utils/WavePortal.json';

const App = () => {
	const [ currentAccount, setCurrentAccount ] = useState('');
  const [isLoading, setIsLoading] = useState(false);
	const contractAddress = '0xd0758eA511E49Ace54c24c80bC894Db5B4b1878B';
	const contractABI = abi.abi;

	const checkIfWalletIsConnected = async () => {
		try {
      setIsLoading(true)
			const { ethereum } = window;

			if (!ethereum) {
				console.log('Make sure you have metamask!');
				return;
			} else {
				console.log('We have the ethereum object', ethereum);
			}

			/*
      * Check if we're authorized to access the user's wallet
      */
			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log('Found an authorized account:', account);
				setCurrentAccount(account);
			} else {
				console.log('No authorized account found');
			}
      setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const connectWallet = async () => {
		try {
      setIsLoading(true);
			const { ethereum } = window;

			if (!ethereum) {
				alert('Get MetaMask!');
				return;
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

			console.log('Connected', accounts[0]);
			setCurrentAccount(accounts[0]);
      setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

  const message = async () => {
    // get basic message from the contract
  }

  const setMessage = async () => {
    // set the message to the blockchain
  }

  const getAllAdresses = async () => {
    // get all contract addresse from the contract.
  }

	const wave = async () => {
		try {
      setIsLoading(true);
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

				let count = await wavePortalContract.getTotalWaves();
				console.log('Retrieved total wave count...', count.toNumber());

				/*
        * Execute the actual wave from your smart contract
        */
				const waveTxn = await wavePortalContract.wave();
				console.log('Mining...', waveTxn.hash);

				await waveTxn.wait();
				console.log('Mined -- ', waveTxn.hash);

				count = await wavePortalContract.getTotalWaves();
				console.log('Retrieved total wave count...', count.toNumber());
			} else {
				console.log("Ethereum object doesn't exist!");
			}
      setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	return (
		<div className="App">
			<h1>Dare to Wave</h1>
			{!currentAccount && <Button onClick={connectWallet} text={'Connect Wallet'} />}
			<MessagInput />
			<Button text={'YES'} onClick={wave} />
      {
        isLoading === true ?  
        <Loader
          type="Circles"
          color="#F24C00"
          height={100}
          width={100}
          timeout={3000} 
        />
          :
			<Messages />
      }
		</div>
	);
};

export default App;
