import type { NextPage } from 'next'
import { useState } from 'react'
import NFTCard from '../components/nftCard';

const Home: NextPage = () => {
  const API_KEY = process.env.ALCHEMY_API_KEY;
  const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}`;

  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const fetchNFTs = async () => {
    let nfts;
    const requestOptions = { method: 'GET' };

    console.log("fetching nfts");

    if (collection.length) {
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}/getNFTs?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    } else {
      const fetchURL = `${baseURL}/getNFTs?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    }

    if (nfts) {
      console.log("nfts:", nfts);

      setNFTs(nfts.ownedNfts);
    }
  }

  const fetchNFTsForCollection = async () => {
    console.log("fetching nfts");

    if (collection.length) {
      const fetchURL = `${baseURL}/getNFTsForCollection?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, { method: 'GET' }).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts);

        setNFTs(nfts.nfts)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address" className='rounded-md w-96'></input>
        <input onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address" className='rounded-md w-96'></input>
        <label className="text-gray-600"><input onChange={(e) => {setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-2xl w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else {
              fetchNFTs();
            }
          }
        }>Let's go! </button>
      </div>

      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => <NFTCard nft={nft}></NFTCard>)
        }
      </div>
    </div>
  )
}

export default Home
