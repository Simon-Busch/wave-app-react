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
	const [ allTries, setAllTries ] = useState([]);
	const [ message, setMessage ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);
	const contractAddress = '0xb233b630E401aCFb4e430dbeb51fF936CbC14f91';
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
		const { ethereum } = window;
		try {
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
				const waves = await wavePortalContract.getAllWaves();
				const wavesCleaned = waves.map((wave) => {
					console.log(wave)
					return {
						address: wave.waver,
						timestamp: new Date(wave.timestamp * 1000),
						message: wave.message
					};
				});
				setAllTries(wavesCleaned);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		let wavePortalContract;

		const onNewWave = (from, timestamp, message, won) => {
			console.log('NewWave', from, timestamp, message, won);
			setAllTries((prevState) => [
				...prevState,
				{
					address: from,
					timestamp: new Date(timestamp * 1000),
					message: message,
					won: won
				}
			]);
		};

		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
			wavePortalContract.on('NewWave', onNewWave);
		}

		return () => {
			if (wavePortalContract) {
				wavePortalContract.off('NewWave', onNewWave);
			}
		};
	}, []);

	const submitNumberHandler = async () => {
		try {
			setIsLoading(true);
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

				let count = await wavePortalContract.getTotalWaves();
				console.log('Retrieved total wave count...', count.toNumber());

				const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
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
		setMessage(event.target.value);
	};

	return (
		<div className="App">
			<h1>Dare to Wave </h1>
			{!currentAccount && <Button onClick={connectWallet} text={'Connect Wallet'} />}
			<MessagInput changeHandler={inputHandler} />
			<Button text={'SEND'} onClick={submitNumberHandler} />
			{allTries > [] ? <Messages messagesArray={allTries} /> : ''}
		</div>
	);
};

export default App;
