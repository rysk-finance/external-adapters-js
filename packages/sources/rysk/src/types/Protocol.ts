/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'
import { FunctionFragment, Result, EventFragment } from '@ethersproject/abi'
import { Listener, Provider } from '@ethersproject/providers'
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common'

export interface ProtocolInterface extends utils.Interface {
  functions: {
    'authority()': FunctionFragment
    'changePortfolioValuesFeed(address)': FunctionFragment
    'changeVolatilityFeed(address)': FunctionFragment
    'optionRegistry()': FunctionFragment
    'portfolioValuesFeed()': FunctionFragment
    'priceFeed()': FunctionFragment
    'setAuthority(address)': FunctionFragment
    'volatilityFeed()': FunctionFragment
  }

  encodeFunctionData(functionFragment: 'authority', values?: undefined): string
  encodeFunctionData(functionFragment: 'changePortfolioValuesFeed', values: [string]): string
  encodeFunctionData(functionFragment: 'changeVolatilityFeed', values: [string]): string
  encodeFunctionData(functionFragment: 'optionRegistry', values?: undefined): string
  encodeFunctionData(functionFragment: 'portfolioValuesFeed', values?: undefined): string
  encodeFunctionData(functionFragment: 'priceFeed', values?: undefined): string
  encodeFunctionData(functionFragment: 'setAuthority', values: [string]): string
  encodeFunctionData(functionFragment: 'volatilityFeed', values?: undefined): string

  decodeFunctionResult(functionFragment: 'authority', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'changePortfolioValuesFeed', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'changeVolatilityFeed', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'optionRegistry', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'portfolioValuesFeed', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'priceFeed', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'setAuthority', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'volatilityFeed', data: BytesLike): Result

  events: {
    'AuthorityUpdated(address)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'AuthorityUpdated'): EventFragment
}

export type AuthorityUpdatedEvent = TypedEvent<[string], { authority: string }>

export type AuthorityUpdatedEventFilter = TypedEventFilter<AuthorityUpdatedEvent>

export interface Protocol extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: ProtocolInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    authority(overrides?: CallOverrides): Promise<[string]>

    changePortfolioValuesFeed(
      _portfolioValuesFeed: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    changeVolatilityFeed(
      _volFeed: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    optionRegistry(overrides?: CallOverrides): Promise<[string]>

    portfolioValuesFeed(overrides?: CallOverrides): Promise<[string]>

    priceFeed(overrides?: CallOverrides): Promise<[string]>

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    volatilityFeed(overrides?: CallOverrides): Promise<[string]>
  }

  authority(overrides?: CallOverrides): Promise<string>

  changePortfolioValuesFeed(
    _portfolioValuesFeed: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  changeVolatilityFeed(
    _volFeed: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  optionRegistry(overrides?: CallOverrides): Promise<string>

  portfolioValuesFeed(overrides?: CallOverrides): Promise<string>

  priceFeed(overrides?: CallOverrides): Promise<string>

  setAuthority(
    _newAuthority: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  volatilityFeed(overrides?: CallOverrides): Promise<string>

  callStatic: {
    authority(overrides?: CallOverrides): Promise<string>

    changePortfolioValuesFeed(
      _portfolioValuesFeed: string,
      overrides?: CallOverrides,
    ): Promise<void>

    changeVolatilityFeed(_volFeed: string, overrides?: CallOverrides): Promise<void>

    optionRegistry(overrides?: CallOverrides): Promise<string>

    portfolioValuesFeed(overrides?: CallOverrides): Promise<string>

    priceFeed(overrides?: CallOverrides): Promise<string>

    setAuthority(_newAuthority: string, overrides?: CallOverrides): Promise<void>

    volatilityFeed(overrides?: CallOverrides): Promise<string>
  }

  filters: {
    'AuthorityUpdated(address)'(authority?: null): AuthorityUpdatedEventFilter
    AuthorityUpdated(authority?: null): AuthorityUpdatedEventFilter
  }

  estimateGas: {
    authority(overrides?: CallOverrides): Promise<BigNumber>

    changePortfolioValuesFeed(
      _portfolioValuesFeed: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    changeVolatilityFeed(
      _volFeed: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    optionRegistry(overrides?: CallOverrides): Promise<BigNumber>

    portfolioValuesFeed(overrides?: CallOverrides): Promise<BigNumber>

    priceFeed(overrides?: CallOverrides): Promise<BigNumber>

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    volatilityFeed(overrides?: CallOverrides): Promise<BigNumber>
  }

  populateTransaction: {
    authority(overrides?: CallOverrides): Promise<PopulatedTransaction>

    changePortfolioValuesFeed(
      _portfolioValuesFeed: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    changeVolatilityFeed(
      _volFeed: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    optionRegistry(overrides?: CallOverrides): Promise<PopulatedTransaction>

    portfolioValuesFeed(overrides?: CallOverrides): Promise<PopulatedTransaction>

    priceFeed(overrides?: CallOverrides): Promise<PopulatedTransaction>

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    volatilityFeed(overrides?: CallOverrides): Promise<PopulatedTransaction>
  }
}
