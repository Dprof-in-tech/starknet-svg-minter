"use client";
import React, { useState } from "react";
import { useAccount, useDisconnect } from "@starknet-react/core";
import { CallData, byteArray } from "starknet";

const contractAddress =
  "0x029c4a89d43d618d62d0b0aab56ac0f0f5124b692ee2c0428eee29d0e0e97ff2";

const Wescot: React.FC = () => {
  const [svgData, setSvgData] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const { account, address, status } = useAccount();
  const { disconnect } = useDisconnect();

  const buildMetadata = (
    name: string,
    description: string,
    svgData: string
  ): string => {
    // Replace double quotes with single quotes in SVG data
    const processedSvgData = svgData.replace(/"/g, "'");

    // Ensure that the < and > characters are not escaped
    const innerJson = `{"name":"${name}","description":"${description}","image":"data:image/svg+xml,${processedSvgData}"}`;
    const outerJson = `data:application/json,{"name":"P5 Mint","description":"Generative Art.","image":"data:image/svg+xml,${innerJson}"}`;

    return outerJson;
  };

  function stringToByteArray(val: string) {
    if (!val) {
      return "";
    }
    return CallData.compile(byteArray.byteArrayFromString(val)).toString();
  }

  const mint = async () => {
    if (!svgData || !name || !description) {
      setError("Please enter all required data before minting.");
      return;
    }

    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransactionHash(null);

    try {
      const metadata = buildMetadata(name, description, svgData);
      const calldataString = stringToByteArray(metadata);
      const calldata = calldataString.split(",");

      console.log("Metadata:", metadata);
      console.log("Calldata:", calldata);

      const res = await account.execute(
        {
          contractAddress: contractAddress,
          entrypoint: "mint",
          calldata: calldata,
        },
        undefined,
        { maxFee: 1000000000000000 }
      );

      console.log("Transaction hash:", res.transaction_hash);
      setTransactionHash(res.transaction_hash);
    } catch (err) {
      console.error(err);
      setError("An error occurred while minting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-3xl font-bold">Wescot SVG Minter</h1>

      {status === "connected" && (
        <div className="mb-4">
          <p className="text-green-500">Connected: {address}</p>
          <button
            onClick={() => disconnect()}
            className="mt-2 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Disconnect
          </button>
        </div>
      )}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter NFT name"
        className="mb-4 w-full rounded-md border border-gray-300 p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter NFT description"
        className="mb-4 w-full rounded-md border border-gray-300 p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        value={svgData}
        onChange={(e) => setSvgData(e.target.value)}
        placeholder="Enter SVG data here"
        className="mb-4 h-64 w-full rounded-md border border-gray-300 p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={mint}
        disabled={isLoading || status !== "connected"}
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isLoading ? "Minting..." : "Mint"}
      </button>

      {error && <p className="mt-2 text-red-500">{error}</p>}
      {transactionHash && (
        <p className="mt-2 text-green-500">
          Minted successfully! Transaction hash: {transactionHash}
        </p>
      )}
    </div>
  );
};

export default Wescot;
