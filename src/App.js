import './App.css';
import React, { useEffect, useState } from 'react';
import Messages from './components/Messages/messages/messages';
import MessagInput from './components/Messages/messageInput/messagInput';
import Button from './components/UI/Button/button';
import { ethers } from 'ethers';
import Loader from 'react-loader-spinner';
import abi from './utils/WavePortal.json';

const App = () => {
	const [ currentAccount, setCurrentAccount ] = useState('');
	const [ allWaves, setAllWaves ] = useState([]);
  const [ message, setMessage] = useState(""); 
	const [ isLoading, setIsLoading ] = useState(false);
	const contractAddress = '0x99B418A078B2431B0E14b37c1C465D7AD1246a4B';
	const contractABI = abi.abi;

	const checkIfWalletIsConnected = async () => {
		try {
			setIsLoading(true);
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

	const getAllMessages = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log(wavePortalContract)
				const waves = await wavePortalContract.getAllWaves();
        console.log(waves)
				let wavesCleaned = [];
				waves.forEach((wave) => {
					wavesCleaned.push({
						address: wave.waver,
						timestamp: new Date(wave.timestamp * 1000),
						message: wave.message
					});
				});
				setAllWaves(wavesCleaned);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

  
	const postMessage = async () => {
    try {
      setIsLoading(true);
			const { ethereum } = window;
      
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

				let count = await wavePortalContract.getTotalWaves();
				console.log('Retrieved total wave count...', count.toNumber());

        const waveTxn = await wavePortalContract.wave(message)
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
    getAllMessages();
	}, []);

  const inputHandler = (event) => {
    setMessage(event.target.value)
  }

	return (
		<div className="App">
			<h1>Dare to Wave</h1>
			{!currentAccount && <Button onClick={connectWallet} text={'Connect Wallet'} />}
			<MessagInput changeHandler={inputHandler} />
			<Button text={'SEND'} onClick={postMessage} />
			{ allWaves > [] ? <Messages messagesArray={allWaves} />  : ''
			}
		</div>
	);
};

export default App;
