const NFTCard = ({ nft }) => {
  const contractAddress = nft.contract.address;

  function formatTokenId() {
    return parseInt(nft.id.tokenId, 16);
  }

  function formatContractAddress() {
    return `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`;
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(contractAddress);
  }

  function etherScanAddress() {
    return `https://etherscan.io/address/${contractAddress}`
  }

  return (
    <div className="w-1/4 flex flex-col ">
      <div className="rounded-2xl">
        <img className="object-cover h-128 w-full rounded-t-2xl" src={nft.media[0].gateway} ></img>
      </div>

      <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
        <div>
          <h2 className="text-xl text-gray-800">{nft.title}</h2>
          <p className="text-gray-600"><span className="font-bold">ID:</span> {formatTokenId()}</p>
          <p className="text-gray-600">
            <span className="font-bold">Contract:</span> {formatContractAddress()}
            <img onClick={() => copyToClipboard()} src="https://cdn-icons-png.flaticon.com/512/6633/6633194.png" className="w-4 inline-block ml-3 cursor-pointer"></img>
          </p>
        </div>

        <div className="flex-grow mt-2">
          <p className="text-gray-600 truncate ...">{nft.description}</p>
          <p className="flex flex-col w-full justify-center items-center gap-y-2">
            <a href={etherScanAddress()} target="_blank" className="rounded-2xl text-white bg-blue-400 px-4 py-2 mt-3">View on Etherscan</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFTCard
