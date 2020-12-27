import React, { useState, useEffect } from 'react'

import styled from 'styled-components'

import gql from 'graphql-tag'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useQuery } from '@apollo/react-hooks'
import { client, blockClient } from '../apollo/client'

import { Link } from 'gatsby'

import Layout from '../layouts'
import SEO from '../components/seo'
import BG from '../components/bg'

const StyledAbout = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  justify-content: space-between;
  padding: 0 2rem;
  padding-bottom: 4rem;
  margin-bottom: 4rem;
  padding-top: 2rem;

  border-bottom: 1px solid ${({ theme }) => theme.colors.grey2};

  @media (max-width: 960px) {
    flex-direction: column;
    grid-template-columns: 1fr;
    margin-top: 0rem;
    padding-top: 1rem;
  }
`

const StyledSectionFlex = styled.div`
  padding: 0 0 4rem 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  max-width: 960px;
  margin-left: 5rem;
  @media (max-width: 1024px) {
    padding: 1rem;
    margin-top: 0rem;
    flex-direction: ${({ wrapSmall }) => (!wrapSmall ? 'row' : 'column')};
  }
  @media (max-width: 960px) {
    padding: 1rem;
    margin-left: 0;
    margin-top: 0rem;
    width: 100%;
    flex-direction: column;
  }
  h1,
  h2 {
    max-width: 650px;
  }
  p {
    /* margin-bottom: 0.5rem; */
    max-width: 650px;
  }
`

const Numbers = styled(StyledSectionFlex)`
  @media (max-width: 960px) {
    display: none;
  }
`

const Title = styled.h1`
  /* font-size: 3rem; */
  margin-bottom: 4rem;
  font-size: 72px;

  pointer-events: none;
  white-space: wrap;
  overflow-wrap: normal;
  max-width: 1200px;
  /* text-align: center; */
  @media (max-width: 960px) {
    font-size: 2rem;
  }
`

const InternalLink = styled(Link)`
  font-weight: 600;
  border-radius: 8px;
  color: ${({ theme }) => theme.textColor};
  h2 {
    margin: 0;
  }
  transition: transform 0.45s cubic-bezier(0.19, 1, 0.22, 1);

  :hover {
    transform: translate3d(2px, 2px, 10px);
  }
`

export const GET_BLOCK = gql`
  query blocks($timestamp: Int!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: $timestamp }) {
      id
      number
      timestamp
    }
  }
`

export const ETH_PRICE = block => {
  const queryString = block
    ? `
    query bundles {
      bundles(where: { id: ${1} } block: {number: ${block}}) {
        id
        ethPrice
      }
    }
  `
    : ` query bundles {
      bundles(where: { id: ${1} }) {
        id
        ethPrice
      }
    }
  `
  return gql(queryString)
}

const APOLLO_QUERY = gql`
  {
    valueswapFactory(id: "0xAD7172De38cCFb3ecEaAD0a3f1700bA4E0aEfeB0") {
      totalVolumeUSD
      totalLiquidityUSD
      pairCount
    }
    bundle(id: 1) {
      ethPrice
    }
  }
`

export const VALUESWAP_GLOBALS_24HOURS_AGO_QUERY = block => {
  let queryString = `
  query valueswapFactory {
    valueswapFactory(id: "0xAD7172De38cCFb3ecEaAD0a3f1700bA4E0aEfeB0", block: { number: ${block} }) {
      totalVolumeUSD
      totalLiquidityUSD
      pairCount
    
    }
  }
  `
  return gql(queryString)
}

const About = props => {
  dayjs.extend(utc)
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()

  const { data: blockData } = useQuery(GET_BLOCK, {
    client: blockClient,
    variables: {
      timestamp: utcOneDayBack
    }
  })
  const oneDayBackBlock = blockData?.blocks?.[0]?.number
  const { data } = useQuery(APOLLO_QUERY, { pollInterval: 10000, client: client })

  const [oneDayResult, setOnedayResult] = useState()

  useEffect(() => {
    async function getData() {
      let result = await client.query({
        query: VALUESWAP_GLOBALS_24HOURS_AGO_QUERY(oneDayBackBlock),

        fetchPolicy: 'cache-first'
      })
      if (result) {
        setOnedayResult(result?.data?.valueswapFactory)
      }
    }
    if (oneDayBackBlock) {
      getData()
    }
  }, [oneDayBackBlock])

  let VntwStats = {
    key: function(n) {
      return this[Object.keys(this)[n]]
    }
  }

  if (data && oneDayResult) {
    const volume24Hour = parseFloat(data?.valueswapFactory?.totalVolumeUSD) - parseFloat(oneDayResult?.totalVolumeUSD)

    VntwStats.volume = [
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      }).format(volume24Hour)
    ]
    VntwStats.liquidity = [
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
        // maximumSignificantDigits: 5
      }).format(data.valueswapFactory.totalLiquidityUSD)
    ]
    VntwStats.exchanges = [Number.parseFloat(data?.valueswapFactory?.pairCount)]

    VntwStats.ETHprice = [
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short',
        maximumSignificantDigits: 5
      }).format(parseFloat(data?.bundle?.ethPrice)),
      '<small> VNTW ETH Price </small>'
    ]
  }

  return (
    <Layout path={props.location.pathname}>
      <BG />

      <SEO title="About" path={props.location.pathname} />
      <StyledAbout>
        <span style={{ marginTop: '5rem' }}>
          <Title style={{ paddingBottom: '4rem' }}>
            Unstoppable liquidity for thousands of users and hundreds of applications.{' '}
          </Title>

          <Numbers id="about" style={{ flexDirection: 'column' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', margin: 0 }}>
              <h2 style={{ fontSize: '32px' }}>
                {VntwStats.exchanges}
                <p style={{ fontSize: '14px' }}>Token Pairs </p>
              </h2>
              <h2 style={{ fontSize: '32px' }}>
                {VntwStats.volume}
                <p style={{ fontSize: '14px' }}>24H Volume</p>
              </h2>
              <h2 style={{ fontSize: '32px' }}>
                {VntwStats.liquidity}
                <p style={{ fontSize: '14px' }}>Total Liquidity</p>
              </h2>
              <h2 style={{ fontSize: '32px' }}>
                {'> 100'}
                <p style={{ fontSize: '14px' }}>Defi Integrations</p>
              </h2>
            </div>
          </Numbers>
          <StyledSectionFlex id="about" style={{ flexDirection: 'column' }}>
            <p>
              Valueswap empowers developers, liquidity providers and traders to participate in a financial marketplace
              that is open and accessible to all.
            </p>
            <p>We are committed to open source software and building on the decentralized web.</p>

            <div style={{ display: 'flex', width: '100%', gap: '1rem', margin: 0 }}>
              <InternalLink to="/blog/vntw">VNTW token</InternalLink>
              <InternalLink to="/whitepaper.pdf">
                Whitepaper <span style={{ fontSize: '11px' }}>↗</span>
              </InternalLink>
              <InternalLink to="/audit.html">
                Audit <span style={{ fontSize: '11px' }}>↗</span>
              </InternalLink>
              <InternalLink to="/faq">FAQ</InternalLink>
            </div>
          </StyledSectionFlex>

          <StyledSectionFlex id="contact" style={{ flexDirection: 'column' }}>
            <h2 style={{ width: '100%' }}>Contact</h2>
            <p>
              To get in touch, please email <a href="mailto:rename-contact@valuenetworklive2021.github.io/valueswap-protocol">rename-contact@valuenetworklive2021.github.io/valueswap-protocol</a>
            </p>

            <p>
              We encourage anyone facing issues with their wallet, transaction or Valueswap related question to join our
              active community discord.
            </p>

            <div style={{ display: 'flex', width: '100%', gap: '1rem', margin: 0 }}>
              <InternalLink>
                Discord <span style={{ fontSize: '11px' }}>↗</span>
              </InternalLink>
              <InternalLink>
                Twitter <span style={{ fontSize: '11px' }}>↗</span>
              </InternalLink>
              <InternalLink>
                Reddit <span style={{ fontSize: '11px' }}>↗</span>
              </InternalLink>
            </div>
          </StyledSectionFlex>

          <StyledSectionFlex id="jobs" style={{ flexDirection: 'column' }}>
            <h2 style={{ width: '100%' }}>Jobs</h2>
            <p>We are looking for talented people to join our team!</p>

            <span>
              <a href="#">
                {' '}
                <h3>Community Manager</h3>
              </a>
            </span>
            <span>
              <a href="#">
                {' '}
                <h3>Senior Front End Engineer</h3>
              </a>
            </span>
            <span>
              <a href="#">
                {' '}
                <h3>Smart Contract Engineer</h3>
              </a>
            </span>
            <p>
              Valueswap welcomes all qualified persons to apply regardless of race, religion, gender, gender identity or
              expression, sexual orientation, national origin, genetics, disability, age, or veteran status.
              Compensation will be competitive and commensurate with experience. This is a full time role which includes
              health insurance and other benefits.
            </p>
          </StyledSectionFlex>

          <StyledSectionFlex id="brand" style={{ flexDirection: 'column' }}>
            <h2 style={{ width: '100%' }}>Brand Assets</h2>
            <p>
              Download the logo and other brand assets samples <a href="/Valueswap_brand_assets.zip">here</a>.
            </p>
          </StyledSectionFlex>
        </span>
      </StyledAbout>
    </Layout>
  )
}

export default About
