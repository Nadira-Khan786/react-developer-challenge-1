import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./Main.css";
import Search from "../../component/Search";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Main = () => {
  const [dataSeries, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataInfo, setDataInfo] = useState({});
  const [textInput, setTextInput] = useState("IBM");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${textInput}&interval=5min&apikey=demo`
      )
      .then((response) => {
        let res = response?.data;
        if (res.Information) {
          setError(res.Information);
          setIsLoading(false);
        } else {
          setDataInfo(res["Meta Data"]);
          setSeriesData(res["Time Series (5min)"]);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        console.log(err);
      });
  };

  const options = {
    responsive: true,
  };

  return (
    <>
      <Search
        textInput={textInput}
        setTextInput={setTextInput}
        showData={() => fetchData()}
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="wrapper">
          {!dataSeries ? (
            <div>
              <h1>{error}</h1>
            </div>
          ) : (
            <>
              <Line
                options={options}
                data={{
                  labels: Object.keys(dataSeries),

                  datasets: [
                    {
                      label: `High ${textInput}`,
                      data: Object.keys(dataSeries).map(
                        (key) => dataSeries[key]?.["2. high"]
                      ),
                      fill: true,
                      backgroundColor: "rgba(75,192,192,0.2)",
                      borderColor: "rgba(11,156,49,0.6)",
                    },
                    {
                      label: `Low ${textInput}`,
                      data: Object.keys(dataSeries).map(
                        (key) => dataSeries[key]?.["3. low"]
                      ),
                      fill: true,
                      borderColor: "rgb(255, 99, 132)",
                      backgroundColor: "rgba(255, 99, 132, 0.5)",
                    },
                    {
                      label: `Open ${textInput}`,
                      data: Object.keys(dataSeries).map(
                        (key) => dataSeries[key]?.["1. open"]
                      ),
                      fill: true,
                      borderColor: "rgb(255, 99, 10)",
                      backgroundColor: "rgba(255, 99, 132, 0.3)",
                    },
                    {
                      label: `Close ${textInput}`,
                      data: Object.keys(dataSeries).map(
                        (key) => dataSeries[key]?.["4. close"]
                      ),
                      fill: true,
                      backgroundColor: "rgba(75,192,192,0.2)",
                      borderColor: "rgba(75,192,192,1)",
                    },
                  ],
                }}
              />
              <div className="inner-wrapper">
                {Object.keys(dataSeries).map((key, index) => {
                  let item = dataSeries[key];
                  return (
                    <div className="card" key={key}>
                      <div className="inner-card">
                        <h3>{dataInfo?.["2. Symbol"]}</h3>

                        <div className="img-wrapper">
                          <table>
                            <tr>
                              <td>
                                <strong>Open:</strong>
                              </td>
                              <td>{item?.["1. open"]}</td>
                            </tr>

                            <tr>
                              <td>
                                <strong>High:</strong>
                              </td>
                              <td>{item?.["2. high"]}</td>
                            </tr>

                            <tr>
                              <td>
                                <strong>Low:</strong>
                              </td>
                              <td>{item?.["3. low"]}</td>
                            </tr>

                            <tr>
                              <td>
                                <strong>Close:</strong>
                              </td>
                              <td>{item?.["4. close"]}</td>
                            </tr>

                            <tr>
                              <td>
                                <strong>Volume:</strong>
                              </td>
                              <td>{item?.["5. volume"]}</td>
                            </tr>

                            <tr>
                              <td>
                                <strong>Time:</strong>
                              </td>
                              <td> {new Date(key)?.toLocaleString('en', {timeZone: 'America/New_York'})}</td>
                            </tr>
                          </table>
                          <div></div>
                        </div>
                        <div className="content">
                          <p>
                            <strong>Information:</strong>
                            {dataInfo?.["1. Information"]}
                          </p>
                          <h5>
                            {" "}
                            <strong> Last Refreshed:</strong>
                            {new Date(
                              dataInfo?.["3. Last Refreshed"]
                            )?.toDateString()}
                          </h5>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>{" "}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Main;
