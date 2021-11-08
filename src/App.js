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
	const [ isLoading, setIsLoading ] = useState(false);
	const contractAddress = '0xb52f8bef1d7786Ae936910595A158747C88F5FFE';
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

	const getAllWaves = async () => {
    console.log("getallWaves")
		try {
			const { ethereum } = window;
      console.log("ETH OK IN GET ALL WAVES", ethereum)
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
        const waveTxn = await wavePortalContract.wave("this is a message")
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
    getAllWaves();
	}, []);

	return (
		<div className="App">
			<h1>Dare to Wave</h1>
			{!currentAccount && <Button onClick={connectWallet} text={'Connect Wallet'} />}
			<MessagInput />
			<Button text={'YES'} onClick={wave} />
			{isLoading === true ? (
				<Loader type="Circles" color="#F24C00" height={100} width={100} timeout={3000} />
			) :  allWaves > [] ? <Messages messagesArray={allWaves} />  : ''
			}
		</div>
	);
};

export default App;
