import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import colors from '../config/colors';
import AuthContext from '../hooks/authContext';
import {baseURL} from './../../baseURL.json';
const width = 320;
const value2 = {
  labels: ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7'],
  datasets: [
    {
      data: [0, 20, 80, 30, 80, 10, 20],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#f9dfd9',
  backgroundGradientTo: '#f9dfd9',
  barPercentage: 0.7,
  //height: 5000,
  // fillShadowGradient: `rgba(225, 126, 90, 1)`,
  // fillShadowGradientOpacity: 1,
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(43, 135, 227, 1)`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,
};

const DailySalesTrend = ({dropdown, startDate, endDate }) => {
  const [resData, setResData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const graphStyle = {
    backgroundColor: '#f9dfd9',
  };
  useEffect(() => {
    const fetchData = async () => {
      if (dropdown && startDate && endDate && startDate !== endDate) {
        try {
          setIsLoading(true);
          const setting = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authContext.user,
            },
          };
          const url =
            baseURL +
            `/app/user/outlet-line/${dropdown}?startDate=${startDate}&endDate=${endDate}`;
          const res = await fetch(url, setting);
          const json = await res.json();
          console.log("Daily sales trend",JSON.stringify(json));
          if (json.labels.length > 0) {
          setResData(json);
          setIsLoading(false);
          }
          else {
            setResData(null);
          setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
          console.log(error);
        }
      } else {
        setIsLoading(false);
        setResData(null);
      }
    };
    fetchData();
  }, [dropdown, startDate, endDate]);
  // console.log({dropdown, startDate, endDate});
  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  else if (resData) {
    return (
      <LineChart
        data={resData}
        width={width}
        height={250}
        chartConfig={chartConfig}
        bezier
        style={graphStyle}
      />
    );
  } else {
    return (
      <LineChart
        data={value2}
        width={width}
        height={250}
        chartConfig={chartConfig}
        bezier
        style={graphStyle}
      />
    );
  }
};

export default DailySalesTrend;
