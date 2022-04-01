// import { ChainId } from '@pancakeswap-libs/sdk';
import { ChainId } from '@spookyswap/sdk';
import { Configuration } from './ecto-finance/config';
import { BankInfo } from './ecto-finance';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: ChainId.FTMTESTNET,
    networkName: 'Fantom Opera Testnet',
    ftmscanUrl: 'https://testnet.ftmscan.com',
    defaultProvider: 'https://rpc.testnet.fantom.network/',
    deployments: require('./ecto-finance/deployments/deployments.testing.json'),
    externalTokens: {
      WFTM: ['0xf1277d1Ed8AD466beddF92ef448A132661956621', 18],
      FUSDT: ['0xb7f24e6e708eabfaa9e64b40ee21a5adbffb51d6', 6],
      BOO: ['0x14f0C98e6763a5E13be5CE014d36c2b69cD94a1e', 18],
      SOLID: ['0x2317610e609674e53D9039aaB85D8cAd8485A7c5', 0],
      WETH: ['0x39523112753956d19A3d6a30E758bd9FF7a8F3C0', 9],
      'USDT-FTM-LP': ['0xE7e3461C2C03c18301F66Abc9dA1F385f45047bA', 18],
      'ECTO-FTM-LP': ['0x13Fe199F19c8F719652985488F150762A5E9c3A8', 18],
      'ESHARE-FTM-LP': ['0x20bc90bB41228cb9ab412036F80CE4Ef0cAf1BD5', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
  production: {
    chainId: ChainId.MAINNET,
    networkName: 'Fantom Opera Mainnet',
    ftmscanUrl: 'https://ftmscan.com',
    defaultProvider: 'https://rpc.ftm.tools/',
    deployments: require('./ecto-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WFTM: ['0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', 18],
      FUSDT: ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6], // This is actually usdc on mainnet not fusdt
      BOO: ['0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE', 18],
      SOLID: ['0x82f0B8B456c1A451378467398982d4834b6829c1', 18],
      WETH: ['0x74b23882a30290451A17c44f4F05243b6b58C76d', 18],
      DRAUGR: ['0xf393E9Ea75befAb72D5063dE4c1b380955E7C560', 18],
      'USDT-FTM-LP': ['0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c', 18],
      'ECTO-FTM-LP': ['0x46A9587bd9C18C2Cc39c234AAAbaaD3090e31E00', 18],
      'ESHARE-FTM-LP': ['0x925083aAa26CeBC88EdEE9554D36d9982bbA04CF', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
};

export const genesisDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding ECTO
        - 2 = LP asset staking rewarding ESHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  EctoFtmRewardPool: {
    name: 'Stake WFTM, earn ECTO',
    poolId: 0,
    sectionInUI: 0,
    contract: 'EctoFtmGenesisRewardPool',
    depositTokenName: 'WFTM',
    earnTokenName: 'ECTO',
    multiplier: "100x",
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  EctoWethRewardPool: {
    name: 'Stake wETH, earn ECTO',
    poolId: 1,
    sectionInUI: 0,
    contract: 'EctoWethGenesisRewardPool',
    depositTokenName: 'WETH',
    earnTokenName: 'ECTO',
    multiplier: "50x",
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  EctoSolidRewardPool: {
    name: 'Stake SOLID, earn ECTO',
    poolId: 2,
    sectionInUI: 0,
    contract: 'EctoSolidGenesisRewardPool',
    depositTokenName: 'SOLID',
    earnTokenName: 'ECTO',
    multiplier: "25x",
    finished: false,
    sort: 3,
    closedForStaking: false,
  },
  EctoEctoRewardPool: {
    name: 'Stake ECTO, earn ECTO',
    poolId: 3,
    sectionInUI: 0,
    contract: 'EctoDraugrGenesisRewardPool',
    depositTokenName: 'ECTO',
    earnTokenName: 'ECTO',
    multiplier: "100x",
    finished: false,
    sort: 4,
    closedForStaking: false,
  },
}

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding ECTO
        - 2 = LP asset staking rewarding ESHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  EctoFtmRewardPool: {
    name: 'Earn ECTO by FTM',
    poolId: 0,
    sectionInUI: 0,
    contract: 'EctoFtmGenesisRewardPool',
    depositTokenName: 'WFTM',
    earnTokenName: 'ECTO',
    multiplier: "100x",
    finished: false,
    sort: 1,
    closedForStaking: false,
    genesisFinished: true
  },
  EctoWethRewardPool: {
    name: 'Stake wETH, earn ECTO',
    poolId: 1,
    sectionInUI: 0,
    contract: 'EctoWethGenesisRewardPool',
    depositTokenName: 'WETH',
    earnTokenName: 'ECTO',
    multiplier: "50x",
    finished: false,
    sort: 2,
    closedForStaking: false,
    genesisFinished: true
  },
  EctoShibaRewardPool: {
    name: 'Stake SOLID, earn ECTO',
    poolId: 2,
    sectionInUI: 0,
    contract: 'EctoSolidGenesisRewardPool',
    depositTokenName: 'SOLID',
    earnTokenName: 'ECTO',
    multiplier: "25x",
    finished: false,
    sort: 3,
    closedForStaking: false,
    genesisFinished: true
  },
  EctoEctoRewardPool: {
    name: 'Stake DRAUGR, earn ECTO',
    poolId: 3,
    sectionInUI: 0,
    contract: 'EctoDraugrGenesisRewardPool',
    depositTokenName: 'DRAUGR',
    earnTokenName: 'ECTO',
    multiplier: "100x",
    finished: false,
    sort: 4,
    closedForStaking: false,
    genesisFinished: true
  },
  EctoFtmLPEctoRewardPool: {
    name: 'Earn ECTO by ECTO-WFTM',
    poolId: 0,
    sectionInUI: 1,
    contract: 'EctoFtmLpEctoRewardPool',
    depositTokenName: 'ECTO-FTM-LP',
    earnTokenName: 'ECTO',
    multiplier: "1000x",
    finished: false,
    sort: 5,
    closedForStaking: false,
  },
  EctoFtmLPEShareRewardPool: {
    name: 'Earn ESHARE by ECTO-WFTM LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'EctoFtmLPEShareRewardPool',
    depositTokenName: 'ECTO-FTM-LP',
    earnTokenName: 'ESHARE',
    multiplier: "3000x",
    finished: false,
    sort: 6,
    closedForStaking: false,
  },
  EshareFtmLPEShareRewardPool: {
    name: 'Earn ESHARE by ESHARE-WFTM LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'EshareFtmLPEShareRewardPool',
    depositTokenName: 'ESHARE-FTM-LP',
    earnTokenName: 'ESHARE',
    multiplier: "2400x",
    finished: false,
    sort: 7,
    closedForStaking: false,
  },
  // EshareDividends: {
  //   name: 'Earn USDC dividends by staking ESHARES',
  //   poolId: 0,
  //   sectionInUI: 3,
  //   contract: 'EctoEshareLPEShareRewardPool',
  //   depositTokenName: 'ESHARES',
  //   earnTokenName: 'USDC',
  //   multiplier: "0x",
  //   finished: false,
  //   sort: 9,
  //   closedForStaking: false,
  // },
};

export default configurations['production'];
