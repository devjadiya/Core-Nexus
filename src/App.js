import { ThemeProvider } from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import { light } from "./styles/Themes";
import { Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";
import Home from "./components/sections/Home";
import About from "./components/sections/About";
import Roadmap from "./components/sections/Roadmap";
import Showcase from "./components/sections/Showcase";
import Team from "./components/sections/Team";
import Faq from "./components/sections/Faq";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import MemeTokenGenerator from "./components/MemeTokenGenerator";
import TokenDetails from "./components/TokenDetails";

function App() {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={light}>
        <Navigation />
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <About />
              <Roadmap />
              <Showcase />
              <Team />
              <Faq />
            </>
          } />
          <Route path="/create" element={<MemeTokenGenerator />} />
          <Route path="/token/:address" element={<TokenDetails />} />
        </Routes>
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </>
  );
}

export default App;
