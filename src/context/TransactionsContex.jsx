import React , { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

//  This Function get ethereum contract
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const singer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, singer);

    return transactionContract; // returns the smart contract

    // console.log({
    //     provider,
    //     singer,
    //     transactionContract
    // });
}


export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount ] = useState("")
    const [ formData, setFormData ] = useState({ addressTo: '', amount: '', keyword: '', message: '' })
    const [ isLoading, setIsLoading] = useState(false);
    const [ transactionCount, setTransactionCount ] = useState(localStorage.getItem('transactionCount'));
    const [ transactions, setTransactions] = useState([])
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }


    const getAllTransactions = async () =>{
        try {
            if(!ethereum) return alert("Please install metamask");
            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions()
            
            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }))
            console.log(structuredTransactions)
            setTransactions(structuredTransactions)
            console.log(availableTransactions)
        } catch(error){
            console.log(error)
        }
    }

    // This function Check if account is connected
    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({ method: 'eth_accounts'});
            if(accounts.length) {
                setCurrentAccount(accounts[0]);
                getAllTransactions()
            
            }else{
                console.log('No accounts found');
            }
            console.log(accounts)
        }catch(error){
            console.log(error)
            throw new Error("No ethereum object.")
        }
    }


    const checkIfTransactionsExists = async () => {
        try {
          if (ethereum) {
            const transactionsContract = getEthereumContract();
            const currentTransactionCount = await transactionsContract.getTransactionCount();
    
            window.localStorage.setItem("transactionCount", currentTransactionCount);
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };
    

    // This function connects Ethereum account
    const connectWallet = async () => {
        try{

            if(!ethereum)return alert("Please install metamask");
            const accounts = await ethereum.request({method: 'eth_requestAccounts'})

            setCurrentAccount(accounts[0]);
        }catch(error){
            console.log(error)
            throw new Error("No ethereum object.")
        }
    }


    // This Function send transacations
    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            // send same ethereum from one address to anather
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI
                    value: parsedAmount._hex, // 0.00001
                }]
            })

            // Add to blockchain
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getEthereumContract();
            setTransactionCount(transactionCount.toNumber());

            window.reload()
        }catch(error){
            console.log(error)
            throw new Error("No ethereum object.")
        }
    }
    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExists()
    },[]);

    return (
        <TransactionContext.Provider value={{ 
            connectWallet,
            currentAccount,
            formData,
            setFormData,
            handleChange,
            sendTransaction,
            transactions,
            isLoading
        }}>
            {children}
        </TransactionContext.Provider>
    )
}