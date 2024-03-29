import React, { useState, useMemo } from 'react';

import { Button, Select, MenuItem, InputLabel, Typography, withStyles } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import styled from 'styled-components';

import { getDisplayBalance } from '../../../utils/formatBalance';
import Label from '../../../components/Label';
import useLpStats from '../../../hooks/useLpStats';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useEctoFinance from '../../../hooks/useEctoFinance';
import { useWallet } from 'use-wallet';
import useApproveZapper, { ApprovalState } from '../../../hooks/useApproveZapper';
import { ECTO_TICKER, ESHARE_TICKER, FTM_TICKER } from '../../../utils/constants';
import { Alert } from '@material-ui/lab';

interface ZapProps extends ModalProps {
  onConfirm: (zapAsset: string, lpName: string, amount: string) => void;
  tokenName?: string;
  decimals?: number;
}

const ZapModal: React.FC<ZapProps> = ({ onConfirm, onDismiss, tokenName = '', decimals = 18 }) => {
  const ectoFinance = useEctoFinance();
  const { balance } = useWallet();
  const ftmBalance = (Number(balance) / 1e18).toFixed(4).toString();
  const ectoBalance = useTokenBalance(ectoFinance.ECTO);
  const eshareBalance = useTokenBalance(ectoFinance.ESHARE);
  const [val, setVal] = useState('');
  const [zappingToken, setZappingToken] = useState(FTM_TICKER);
  const [zappingTokenBalance, setZappingTokenBalance] = useState(ftmBalance);
  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' }); // token0 will always be FTM in this case
  const [approveZapperStatus, approveZapper] = useApproveZapper(zappingToken);
  const ectoFtmLpStats = useLpStats('ECTO-FTM-LP');
  const eShareFtmLpStats = useLpStats('ESHARE-FTM-LP');
  const ectoLPStats = useMemo(() => (ectoFtmLpStats ? ectoFtmLpStats : null), [ectoFtmLpStats]);
  const eshareLPStats = useMemo(() => (eShareFtmLpStats ? eShareFtmLpStats : null), [eShareFtmLpStats]);
  const ftmAmountPerLP = tokenName.startsWith(ECTO_TICKER) ? ectoLPStats?.ftmAmount : eshareLPStats?.ftmAmount;
  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  const handleChangeAsset = (event: any) => {
    const value = event.target.value;
    setZappingToken(value);
    setZappingTokenBalance(ftmBalance);
    if (event.target.value === ESHARE_TICKER) {
      setZappingTokenBalance(getDisplayBalance(eshareBalance, decimals));
    }
    if (event.target.value === ECTO_TICKER) {
      setZappingTokenBalance(getDisplayBalance(ectoBalance, decimals));
    }
  };

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVal(e.currentTarget.value);
    const estimateZap = await ectoFinance.estimateZapIn(zappingToken, tokenName, String(e.currentTarget.value));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const handleSelectMax = async () => {
    setVal(zappingTokenBalance);
    const estimateZap = await ectoFinance.estimateZapIn(zappingToken, tokenName, String(zappingTokenBalance));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  return (
    <Modal>
      <ModalTitle text={`Zap in ${tokenName}`} />
      <Typography variant="h6" align="center">
        Powered by{' '}
        <a target="_blank" rel="noopener noreferrer" href="https://mlnl.finance">
          mlnl.finance
        </a>
      </Typography>

      <StyledActionSpacer />
      <InputLabel style={{ color: '#001E6C' }} id="label">
        Select asset to zap with
      </InputLabel>
      <Select
        onChange={handleChangeAsset}
        style={{ color: '#001E6C' }}
        labelId="label"
        id="select"
        value={zappingToken}
      >
        <StyledMenuItem value={FTM_TICKER}>FTM</StyledMenuItem>
        <StyledMenuItem value={ESHARE_TICKER}>ESHARE</StyledMenuItem>
        {/* Ecto as an input for zapping will be disabled due to issues occuring with the Gatekeeper system */}
        {/* <StyledMenuItem value={ECTO_TICKER}>ECTO</StyledMenuItem> */}
      </Select>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={zappingTokenBalance}
        symbol={zappingToken}
      />
      <Label text="Zap Estimations" />
      <StyledDescriptionText>
        {' '}
        {tokenName}: {Number(estimate.token0) / Number(ftmAmountPerLP)}
      </StyledDescriptionText>
      <StyledDescriptionText>
        {' '}
        ({Number(estimate.token0)} {FTM_TICKER} / {Number(estimate.token1)}{' '}
        {tokenName.startsWith(ECTO_TICKER) ? ECTO_TICKER : ESHARE_TICKER}){' '}
      </StyledDescriptionText>
      <ModalActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() =>
            approveZapperStatus !== ApprovalState.APPROVED ? approveZapper() : onConfirm(zappingToken, tokenName, val)
          }
        >
          {approveZapperStatus !== ApprovalState.APPROVED ? 'Approve' : "Let's go"}
        </Button>
      </ModalActions>

      <StyledActionSpacer />
      {/* <Alert variant="filled" severity="warning">
        Beta feature. Use at your own risk!
      </Alert> */}
    </Modal>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDescriptionText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.grey[400]};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 22px;
  justify-content: flex-start;
`;
const StyledMenuItem = withStyles({
  root: {
    backgroundColor: 'white',
    color: '#001E6C',
    '&:hover': {
      backgroundColor: 'grey',
      color: '#001E6C',
    },
    selected: {
      backgroundColor: 'black',
    },
  },
})(MenuItem);

export default ZapModal;
