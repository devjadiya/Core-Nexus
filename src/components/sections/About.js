import React from "react";
import styled from "styled-components";
import Carousel from "../Carousel";
import Button from "../Button";
import { ThemeProvider } from "styled-components";
import { dark } from "../../styles/Themes";

// Styled components
const Section = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.body};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 2rem 0;
`;

const Container = styled.div`
  width: 75%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 64em) {
    flex-direction: column;
    width: 85%;
  }

  @media (max-width: 40em) {
    width: 100%;
  }
`;

const Box = styled.div`
  width: 48%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 64em) {
    width: 100%;
    margin-bottom: 2rem;
  }
`;

const GradientTitle = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  text-align: center;
  color: #1e90ff;

  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontxl};
  }

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const HighlightedText = styled.span`
  color: #ff4500;
`;

const SubText = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.8)`};
  text-align: justify;
  margin: 1rem 0;
  font-weight: 400;

  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontmd};
  }

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const SubTextLight = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.6)`};
  text-align: justify;
  margin: 1rem 0;
  font-weight: 300;

  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontsm};
  }

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontxs};
  }
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;

  @media (max-width: 64em) {
    width: 100%;
  }
`;

const About = () => {
  return (
    <Section id="about">
      <Container>
        <Box>
          <Carousel />
        </Box>
        <Box>
          <GradientTitle>
            Pointless Tokens, <br />
            <HighlightedText>Infinite Craze!</HighlightedText>
          </GradientTitle>
          <SubText>
            $POINTLESS is a meme coin born for fun and chaos on pump.fun — no
            utility, no promises, just pure meme madness. It's a community-fueled
            token with one goal: to go viral or go home.
          </SubText>
          <SubTextLight>
            There’s no roadmap set in stone, only a wild ride of viral
            campaigns, unexpected collabs, NFT drops, and governance by the
            most pointless DAO ever imagined. Join the most unserious project
            with the most serious vibes.
          </SubTextLight>
          <ButtonContainer>
            <ThemeProvider theme={dark}>
              <Button text="JOIN OUR DISCORD" link="#" />
            </ThemeProvider>
          </ButtonContainer>
        </Box>
      </Container>
    </Section>
  );
};

export default About;
