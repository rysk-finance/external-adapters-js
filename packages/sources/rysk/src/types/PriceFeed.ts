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

export interface PriceFeedInterface extends utils.Interface {
  functions: {
    'addPriceFeed(address,address,address)': FunctionFragment
    'authority()': FunctionFragment
    'getNormalizedRate(address,address)': FunctionFragment
    'getRate(address,address)': FunctionFragment
    'priceFeeds(address,address)': FunctionFragment
    'setAuthority(address)': FunctionFragment
  }

  encodeFunctionData(functionFragment: 'addPriceFeed', values: [string, string, string]): string
  encodeFunctionData(functionFragment: 'authority', values?: undefined): string
  encodeFunctionData(functionFragment: 'getNormalizedRate', values: [string, string]): string
  encodeFunctionData(functionFragment: 'getRate', values: [string, string]): string
  encodeFunctionData(functionFragment: 'priceFeeds', values: [string, string]): string
  encodeFunctionData(functionFragment: 'setAuthority', values: [string]): string

  decodeFunctionResult(functionFragment: 'addPriceFeed', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'authority', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getNormalizedRate', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getRate', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'priceFeeds', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'setAuthority', data: BytesLike): Result

  events: {
    'AuthorityUpdated(address)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'AuthorityUpdated'): EventFragment
}

export type AuthorityUpdatedEvent = TypedEvent<[string], { authority: string }>

export type AuthorityUpdatedEventFilter = TypedEventFilter<AuthorityUpdatedEvent>

export interface PriceFeed extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: PriceFeedInterface

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
    addPriceFeed(
      underlying: string,
      strike: string,
      feed: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    authority(overrides?: CallOverrides): Promise<[string]>

    getNormalizedRate(
      underlying: string,
      strike: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>

    getRate(underlying: string, strike: string, overrides?: CallOverrides): Promise<[BigNumber]>

    priceFeeds(arg0: string, arg1: string, overrides?: CallOverrides): Promise<[string]>

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>
  }

  addPriceFeed(
    underlying: string,
    strike: string,
    feed: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  authority(overrides?: CallOverrides): Promise<string>

  getNormalizedRate(
    underlying: string,
    strike: string,
    overrides?: CallOverrides,
  ): Promise<BigNumber>

  getRate(underlying: string, strike: string, overrides?: CallOverrides): Promise<BigNumber>

  priceFeeds(arg0: string, arg1: string, overrides?: CallOverrides): Promise<string>

  setAuthority(
    _newAuthority: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  callStatic: {
    addPriceFeed(
      underlying: string,
      strike: string,
      feed: string,
      overrides?: CallOverrides,
    ): Promise<void>

    authority(overrides?: CallOverrides): Promise<string>

    getNormalizedRate(
      underlying: string,
      strike: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    getRate(underlying: string, strike: string, overrides?: CallOverrides): Promise<BigNumber>

    priceFeeds(arg0: string, arg1: string, overrides?: CallOverrides): Promise<string>

    setAuthority(_newAuthority: string, overrides?: CallOverrides): Promise<void>
  }

  filters: {
    'AuthorityUpdated(address)'(authority?: null): AuthorityUpdatedEventFilter
    AuthorityUpdated(authority?: null): AuthorityUpdatedEventFilter
  }

  estimateGas: {
    addPriceFeed(
      underlying: string,
      strike: string,
      feed: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    authority(overrides?: CallOverrides): Promise<BigNumber>

    getNormalizedRate(
      underlying: string,
      strike: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    getRate(underlying: string, strike: string, overrides?: CallOverrides): Promise<BigNumber>

    priceFeeds(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>
  }

  populateTransaction: {
    addPriceFeed(
      underlying: string,
      strike: string,
      feed: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    authority(overrides?: CallOverrides): Promise<PopulatedTransaction>

    getNormalizedRate(
      underlying: string,
      strike: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    getRate(
      underlying: string,
      strike: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    priceFeeds(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>
  }
}
