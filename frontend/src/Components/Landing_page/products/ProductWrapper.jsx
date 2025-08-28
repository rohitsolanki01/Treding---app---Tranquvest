import React from 'react'
import Hero from './Hero'
import LeftSection from './LeftSection'
import RightSection from './RightSection'
import Univers from './Univers'
const ProductWrapper = () => {
  return (
    <>
        <Hero />
        <LeftSection imageUrl="media/kiteoftranquvest.svg" productName="Kite" productDescription="Our ultra-fast flangship trading platform to the streaming market data,
         charting,smart order routing and  more.Enjoy the kite experience samlesly on your android and ios devices." tyrDemo="" learnMore="" googlePlay="" appStore="" />
        <RightSection  imageUrl="media/console.png" productName="Console" productDescription="The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations."  learnMore=""/>
         <LeftSection imageUrl="media/coin.png" productName="Coin" productDescription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices." tyrDemo="" learnMore="" googlePlay="" appStore="" />
         <RightSection  imageUrl="media/kiteconnect.png" productName="Kite Connect API" productDescription="The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations."  learnMore=""/>
         <LeftSection imageUrl="media/varsity.png" productName="Varsity mobile" productDescription="An easy to grasp, collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-size cards to help you learn on the go." tyrDemo="" learnMore="" googlePlay="" appStore="" />
        <Univers />
    </>
  )
}

export default ProductWrapper