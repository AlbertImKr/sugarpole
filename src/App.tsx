import "./App.css";
import ControlBar from "./components/ControlBar";
import CornerstoneContainer from "./components/CornerstoneContainer";

function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <ControlBar />
      <CornerstoneContainer />
    </div>
  );
}

export default App;
