// pages/Home.js
import Header from "../components/HomeScreen/Header";
import OverView from "../components/HomeScreen/OverView";
import WhatsNew from "../components/HomeScreen/WhatsNew";
import CurrentMoneyGraph from "../components/HomeScreen/CurrentMoneyGraph";
import Footer from "../components/HomeScreen/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <OverView />
      <WhatsNew />
      <CurrentMoneyGraph />
      <Footer />
    </>
  );
};

export default Home;