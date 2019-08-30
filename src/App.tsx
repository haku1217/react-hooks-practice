import * as React from "react";
import "./App.css";
import SearchAPIData from "../src/component/atoms/SearchAPIData";
import axios from "axios";

const App: React.FC = () => {
  const data = {hits: [], events: []}

  console.log(data)
  return (
    <React.Fragment>
      <SearchAPIData urlName={"https://hn.algolia.com/api/v1/search?query="} initalQuery={'python'}  apiName={'Hacker News'} eventName={data[0]} selectFormat={''}/>
      <SearchAPIData urlName={"https://connpass.com/api/v1/event/?keyword="} initalQuery={'redux'}  apiName={'Connpass'} eventName={data[1]} selectFormat={''}/>
      <SearchAPIData urlName={"http://api.atnd.org/events/?keyword_or="} initalQuery={'redux'}  apiName={'ATND'} eventName={data[1]} selectFormat={'&format=json'}/>
    </React.Fragment>
  );
};

export default App;
