import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./components/main";
import Query from "./components/query";
import Add from "./components/add";
import axios from "axios";

function App() {
  const [titles, setTitles] = useState([]);
  const [hasSelected, setHasSelected] = useState(false);
  const [text, setText] = useState("");
  const [hasClusteredDataset, setHasClusteredDataset] = useState(false);
  const [clusteredText, setClusteredText] = useState("");
  const [calculated, setCalculated] = useState("");
  const [graph, setGraph] = useState();
  const [sentences, setSentences] = useState("");
  useEffect(() => {
    axios.get("http://localhost:8000/getTitles").then(response => {
      setTitles(response.data.titles);
    });
  }, []);
  const getText = async (id) => {
    const response = await axios.get("http://localhost:8000/getText/" + id)
    setText(response.data.text);
  }
  const preprocessing = async () => {
    const response = await axios.post("http://localhost:8000/preprocessText/", {text: text})
    setClusteredText(response.data.text);
  }
  const calculate = (query) => {
    axios.post("http://localhost:8000/calculate/", {text: text, query: query}).then(response => {
      setCalculated(response.data.calString);
      setGraph(response.data.graph);
      setSentences(response.data.sentences);
    });
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Main titles={titles} hasSelected={hasSelected} setHasSelected={setHasSelected} text={text} getText={getText} clusteredText={clusteredText} setClusteredText={setClusteredText} hasClusteredDataset={hasClusteredDataset} setHasClusteredDataset={setHasClusteredDataset} preprocessing={preprocessing} />} />
          <Route path="/query" element={<Query calculate={calculate} calculated={calculated} graph={graph} sentences={sentences} />} />
          <Route path="/add" element={<Add />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
