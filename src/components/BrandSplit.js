import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import colors from '../config/colors';
import AuthContext from '../hooks/authContext';
import {baseURL} from './../../baseURL.json';

const width = 320;

const value = {
  labels: ['XYZ', 'XYZ', 'XYZ', 'XYZ'],
  datasets: [
    {
      data: [0, 20, 80, 60],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#f9dfd9',
  backgroundGradientTo: '#f9dfd9',
  barPercentage: 0.7,
  height: 5000,
  fillShadowGradient: `rgba(225, 126, 90, 1)`,
  fillShadowGradientOpacity: 1,
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(225, 126, 90, 1)`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,
};

const BrandSplit = ({dropdown, startDate, endDate}) => {
  const [resData, setResData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const [viewData, setViewData] = useState({});
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
          `/app/user/outlet-bar/${dropdown}?startDate=${startDate}&endDate=${endDate}`;
        const res = await fetch(url, setting);
        const json = await res.json();
         console.log({json});
         console.log("Brand Splite",JSON.stringify(json));
        if (json.labels.length > 0) {
        setResData(json);
        setIsLoading(false);
        } else {
        setIsLoading(false);
        setResData(null);
        }
      } catch (error) {
        // console.log(error);
        setIsLoading(false);
      }
    }
      else {
        setIsLoading(false);
        setResData(null);
      }
    }
    fetchData();
  }, [dropdown, startDate, endDate]);
  // console.log({dropdown, startDate, endDate});

  console.log({resData});

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  else if (resData) {
    return (
      <BarChart
        style={graphStyle}
        data={resData}
        width={width}
        height={280}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
    );
  }
  else{

  return (
    <BarChart
      style={graphStyle}
      data={value}
      width={width}
      height={280}
      chartConfig={chartConfig}
      verticalLabelRotation={30}
    />
  );
}
}

export default BrandSplit;
