"use client";
import React, { useState } from "react";
import { useSwitchChain } from "@starknet-react/core";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const STARKNET_CHAINID = {
  SN_MAIN: "0x534e5f4d41494e", // Mainnet
  SN_SEPOLIA: "0x534e5f5345504f4c4941", // Sepolia testnet
};

interface NetworkSwitchProps {
  theme: "dark" | "light";
}

const NetworkSwitchButton: React.FC<NetworkSwitchProps> = ({ theme }) => {
  const [selected, setSelected] = useState("Mainnet");
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { name: "Mainnet", chainId: STARKNET_CHAINID.SN_MAIN },
    { name: "Sepolia", chainId: STARKNET_CHAINID.SN_SEPOLIA },
  ];

  const { switchChain, error } = useSwitchChain({
    params: {
      chainId: STARKNET_CHAINID.SN_SEPOLIA,
    },
  });

  const handleSelect = (option: { name: string; chainId: string }) => {
    setSelected(option.name);
    setIsOpen(false);

    // Switch network
    switchChain({ chainId: option.chainId });
  };

  return (
    <div className="relative">
      <button
        className={`mx-auto my-12 flex h-[45px] w-[150px] cursor-pointer items-center justify-between rounded-xl px-4 ${
          theme === "dark"
            ? "border-[3px] border-grey-700 bg-[#2a2a2a] text-white"
            : "border-[3px] border-[#eaeaea] bg-[#f0f0f0] text-black"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected}</span>
        <span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute z-10 mt-2 w-full rounded-xl shadow-lg ${
            theme === "dark"
              ? "border-grey-800 bg-base-dark text-white"
              : "border-[#eaeaea] bg-[#f0f0f0] text-black"
          }`}
        >
          {options.map((option) => (
            <div
              key={option.name}
              className={`flex cursor-pointer items-center justify-between rounded-md p-2 ${
                selected === option.name
                  ? theme === "dark"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                  : theme === "dark"
                    ? "text-white hover:bg-grey-800"
                    : "text-black hover:bg-grey-300"
              }`}
              onClick={() => handleSelect(option)}
            >
              {selected === option.name && <Check size={20} />}
              {option.name}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-red-600">
          Error switching network: {error.message}
        </p>
      )}
    </div>
  );
};

export default NetworkSwitchButton;
