import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "./api";

function App() {
  const [usdValue, setUsdValue] = useState("");
  const [lkrValue, setlkrValue] = useState("");
  const [value, setvalue] = useState("");
  const [valueList, setValueList] = useState([]);

  useEffect(() => {
    getValues();
  }, []);

  const getValues = async () => {
    const res = await axios.get(`${API}/getAllCurrency`);
    setValueList(res.data);
  };

  const changeUSD = async (e) => {
    if (e.key === "Enter") {
      var myHeaders = new Headers();
      myHeaders.append("apikey", "9sjF2CMC9M0DV9F5kV0VNDHZMb2GJ4cV");

      const { data } = await axios.get(
        "https://api.apilayer.com/currency_data/convert?to=lkr&from=usd&amount=1",
        { headers: { apikey: "9sjF2CMC9M0DV9F5kV0VNDHZMb2GJ4cV" } }
      );

      const lkrVal = +data.result.toFixed(2);
      setlkrValue(lkrVal);

      const valueT = (+data.result.toFixed(2) * usdValue).toFixed(2);
      setvalue(valueT);

      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();

      await axios.post(`${API}/addCurrency`, { date, time, value: lkrVal });

      getValues();
    }
  };
  return (
    <div className="App">
      <p>USD</p>
      <input
        name="usd"
        value={usdValue}
        onChange={(e) => setUsdValue(e.target.value)}
        onKeyPress={(e) => changeUSD(e)}
      />

      <h4 style={{ color: "red" }}>Rate {lkrValue && ` - LKR ${lkrValue}`}</h4>

      <div style={{ marginTop: 50 }}>
        <h2>LKR</h2>
        <h2>{value}</h2>
      </div>

      <div style={{ marginTop: 100 }}>
        {!valueList || valueList.length === 0 ? (
          <p>
            <b>
              <i>Loading...</i>
            </b>
          </p>
        ) : (
          valueList.map(({ date, time, value }) => {
            return (
              <div>
                <p>
                  {date} ----- {time} ----- <b>LKR {value}</b>
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;
