import { useCallback, useEffect, useState } from 'react';
import useEctoFinance from '../useEctoFinance';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

const useEstimateEShare = (ebondAmount: string) => {
  const [estimateAmount, setEstimateAmount] = useState<string>('');
  const { account } = useWallet();
  const ectoFinance = useEctoFinance();

  const estimateAmountOfEShare = useCallback(async () => {
    const ebondAmountBn = parseUnits(ebondAmount);
    const amount = await ectoFinance.estimateAmountOfEShare(ebondAmountBn.toString());
    setEstimateAmount(amount);
  }, [account]);

  useEffect(() => {
    if (account) {
      estimateAmountOfEShare().catch((err) => console.error(`Failed to get estimateAmountOfEShare: ${err.stack}`));
    }
  }, [account, estimateAmountOfEShare]);

  return estimateAmount;
};

export default useEstimateEShare;
