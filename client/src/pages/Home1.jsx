import React from "react";

import Aboutus from "./new/Aboutus";
import Hero2 from "./new/Hero2";
import Services from "./new/Services";
import Hero3 from "./new/Hero3";
import Footer from "./new/Footer";
import { Fab } from "@mui/material";
import { TbMessageChatbot } from "react-icons/tb";
import ScrollDialog from "./components/Recommender";


const Home = () => {
  const handleFabClick = () => {
    
    alert("FAB clicked! Open AI place recommendation.");
  };

  return (
    <div>
      <Hero2 />
      <Aboutus />
      <Services />
      <Hero3 />
      <Footer />
      <div className="fixed bottom-4 right-4 z-50">
        < ScrollDialog/>
      {/* <Fab
        onClick={handleFabClick}
        color="primary"
        aria-label="edit"
        className="bottom-4 right-4"
      >
        <TbMessageChatbot size={24}/>
      </Fab> */}
      </div>
    </div>
  );
};

export default Home;