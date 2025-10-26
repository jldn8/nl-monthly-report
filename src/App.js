import React, { useState } from "react";
import InputForm from "./components/InputForm";
import Summary from "./components/Summary";
import CopyButton from "./components/CopyButton";

function App() {
    const [data, setData] = useState([]);

    return (
        <div>
            <div id="report-content">
                <h1>{new Date().getMonth() + 1}월 월말 보고</h1>
                <InputForm setData={setData}/>
                <Summary data={data}/>
            </div>
            <CopyButton data={data}/>
        </div>
    );
}

export default App;
