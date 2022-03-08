import { useCallback } from 'react';
import useEctoFinance from '../useEctoFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';

const useSwapEBondToEShare = () => {
  const ectoFinance = useEctoFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapEShare = useCallback(
  	(ebondAmount: string) => {
	  	const ebondAmountBn = parseUnits(ebondAmount, 18);
	  	handleTransactionReceipt(
	  		ectoFinance.swapEBondToEShare(ebondAmountBn),
	  		`Swap ${ebondAmount} EBOND to ESHARES`
	  	);
  	},
  	[ectoFinance, handleTransactionReceipt]
  );
  return { onSwapEShare: handleSwapEShare };
};

export default useSwapEBondToEShare;
