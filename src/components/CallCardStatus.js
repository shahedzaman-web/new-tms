import React, {useContext, useEffect, useState} from 'react';

import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Pie from 'react-native-pie';
import colors from '../config/colors';
import AuthContext from '../hooks/authContext';
import {baseURL} from './../../baseURL.json';

const CallCardStatus = ({dropdown, startDate, endDate}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);

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
            `/app/user/outlet-charts2/${dropdown}?startDate=${startDate}&endDate=${endDate}`;
          const res = await fetch(url, setting);
          const json = await res.json();
          console.log({json});
          setData(json);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setData(null);
      }
    };
    fetchData();
  }, [dropdown, startDate, endDate]);
  // console.log({dropdown, startDate, endDate});

  // console.log({data});
  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  } else if (data) {
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={styles.performanceDeshbord}>
            <View style={{flex: 10, alignItems: 'center', padding: 4}}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                {data?.visit?.labels[0]} : {data?.visit?.data[0]}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                {data?.visit?.labels[1]} : {data?.visit?.data[1]}
              </Text>
              <View style={{margin: 5, alignItems: 'center'}}>
                <Pie
                  radius={45}
                  innerRadius={25}
                  sections={[
                    {
                      percentage: (
                        (data?.pcm?.data[1] / data?.pcm?.data[0]) *
                        100
                      ).toFixed(2),
                      color: '#2b87e3',
                    },
                  ]}
                  backgroundColor={colors.primary}
                />
                <Text style={{fontWeight: 'bold', margin: 2}}>
                  Achievement(%):{' '}
                  {((data?.pcm?.data[1] / data?.pcm?.data[0]) * 100).toFixed(2)}{' '}
                  %
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 2,

                backgroundColor: colors.primary,
                alignItems: 'center',
                padding: 3,
              }}>
              <Text style={{color: 'white', fontWeight: '500'}}>Visit</Text>
              <Text style={{color: 'white', fontWeight: '500'}}>
                Achievement
              </Text>
            </View>
          </View>
          <View style={styles.performanceDeshbord}>
            <View
              style={{
                flex: 8,

                alignItems: 'center',
                padding: 4,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                {data?.pcm?.labels[0]} : {data?.pcm?.data[0]}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                {data?.pcm?.labels[1]} : {data?.pcm?.data[1]}
              </Text>
              <View style={{margin: 5, alignItems: 'center'}}>
                <Pie
                  radius={45}
                  innerRadius={25}
                  sections={[
                    {
                      percentage: (
                        (data?.pcm?.data[1] / data?.pcm?.data[0]) *
                        100
                      ).toFixed(2),
                      color: '#2b87e3',
                    },
                  ]}
                  backgroundColor={colors.primary}
                />
                <Text style={{fontWeight: 'bold', margin: 2}}>
                  Achievement(%):{' '}
                  {((data?.pcm?.data[1] / data?.pcm?.data[0]) * 100).toFixed(2)}{' '}
                  %
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 2,
                backgroundColor: colors.primary,
                alignItems: 'center',
                padding: 2,
              }}>
              <Text style={{color: 'white', fontWeight: '500'}}>PCM</Text>
              <Text style={{color: 'white', fontWeight: '500'}}>
                Achievement
              </Text>
            </View>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={styles.performanceDeshbord}>
            <View
              style={{
                flex: 8,
                alignItems: 'center',
                padding: 4,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                {data?.priceMaintenance?.labels[0]} :
                {data?.priceMaintenance?.data[0]}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                {data?.priceMaintenance?.labels[1]} :
                {data?.priceMaintenance?.data[1]}
              </Text>
              <View style={{margin: 5, alignItems: 'center'}}>
                <Pie
                  radius={45}
                  innerRadius={25}
                  sections={[
                    {
                      percentage: (
                        (data?.pcm?.data[1] / data?.pcm?.data[0]) *
                        100
                      ).toFixed(2),
                      color: '#2b87e3',
                    },
                  ]}
                  backgroundColor={colors.primary}
                />
                <Text style={{fontWeight: 'bold', margin: 2}}>
                  Achievement(%):{' '}
                  {(
                    (data?.focusedVolume?.data[1] /
                      data?.focusedVolume?.data[0]) *
                    100
                  ).toFixed(2)}{' '}
                  %
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 2,
                backgroundColor: colors.primary,
                alignItems: 'center',
                padding: 2,
              }}>
              <Text style={{color: 'white', fontWeight: '500'}}>Focused</Text>
              <Text style={{color: 'white', fontWeight: '500'}}>Volume</Text>
            </View>
          </View>

          <View style={styles.performanceDeshbord}>
            <View
              style={{
                flex: 8,
                alignItems: 'center',
                padding: 4,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                {data?.visibility?.labels[0]} :{data?.visibility?.data[0]}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                {data?.visibility?.labels[1]} :{data?.visibility?.data[1]}
              </Text>
              <View style={{margin: 5, alignItems: 'center'}}>
                <Pie
                  radius={45}
                  innerRadius={25}
                  sections={[
                    {
                      percentage: (
                        (data?.visibility?.data[1] /
                          data?.visibility?.data[0]) *
                        100
                      ).toFixed(2),
                      color: '#2b87e3',
                    },
                  ]}
                  backgroundColor={colors.primary}
                />
                <Text style={{fontWeight: 'bold', margin: 2}}>
                  Achievement(%):{' '}
                  
                  {(
                    (data?.visibility?.data[1] / data?.visibility?.data[0]) *
                    100
                  ).toFixed(2)}{' '}
                  
                  %
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 2,
                backgroundColor: colors.primary,
                alignItems: 'center',
                padding: 2,
              }}>
              <Text style={{color: 'white', fontWeight: '500'}}>
                Visibility
              </Text>
              <Text style={{color: 'white', fontWeight: '500'}}>Volume</Text>
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={styles.performanceDeshbord}>
            <View style={{flex: 8, alignItems: 'center', padding: 4}}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                Volume Target : 100
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                Volume Achievement : 50
              </Text>
              <View style={{margin: 5, alignItems: 'center'}}>
                <Pie
                  radius={45}
                  innerRadius={25}
                  sections={[
                    {
                      percentage: 25,
                      color: colors.primary,
                    },
                    {
                      percentage: 25,
                      color: '#0ca85d',
                    },
                    {
                      percentage: 25,
                      color: '#eba10f',
                    },
                    {
                      percentage: 25,
                      color: '#2b87e3',
                    },
                  ]}

                  // strokeCap={'butt'}
                />
                <Text style={{fontWeight: 'bold', margin: 2}}>
                  Achievement(%):50%
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 2,
                backgroundColor: colors.primary,
                alignItems: 'center',
                padding: 3,
              }}>
              <Text style={{color: 'white', fontWeight: '500'}}>Volume</Text>
              <Text style={{color: 'white', fontWeight: '500'}}>
                Achievement
              </Text>
            </View>
          </View>
          <View style={styles.performanceDeshbord}>
            <View
              style={{
                flex: 8,

                alignItems: 'center',
                padding: 4,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                EAS Target : 100
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                EAS Achievement : 50
              </Text>
              <View style={{margin: 5, alignItems: 'center'}}>
                <Pie
                  radius={45}
                  innerRadius={25}
                  sections={[
                    {
                      percentage: 25,
                      color: colors.primary,
                    },
                    {
                      percentage: 25,
                      color: '#0ca85d',
                    },
                    {
                      percentage: 25,
                      color: '#eba10f',
                    },
                    {
                      percentage: 25,
                      color: '#2b87e3',
                    },
                  ]}

                  // strokeCap={'butt'}
                />
                <Text style={{fontWeight: 'bold', margin: 2}}>
                  Achievement(%):50%
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 2,
                backgroundColor: colors.primary,
                alignItems: 'center',
                padding: 2,
              }}>
              <Text style={{color: 'white', fontWeight: '500'}}>EAS</Text>
              <Text style={{color: 'white', fontWeight: '500'}}>
                Achievement
              </Text>
            </View>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={styles.performanceDeshbord}>
            <View
              style={{
                flex: 8,
                alignItems: 'center',
                padding: 4,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                Total PCM : 100
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                Total PCM Achievement : 50
              </Text>
              <View style={{margin: 5, alignItems: 'center'}}>
                <Pie
                  radius={45}
                  innerRadius={25}
                  sections={[
                    {
                      percentage: 25,
                      color: colors.primary,
                    },
                    {
                      percentage: 25,
                      color: '#0ca85d',
                    },
                    {
                      percentage: 25,
                      color: '#eba10f',
                    },
                    {
                      percentage: 25,
                      color: '#2b87e3',
                    },
                  ]}

                  // strokeCap={'butt'}
                />
                <Text style={{fontWeight: 'bold', margin: 2}}>
                  Achievement(%):50%
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 2,
                backgroundColor: colors.primary,
                alignItems: 'center',
                padding: 2,
              }}>
              <Text style={{color: 'white', fontWeight: '500'}}>PCM</Text>
              <Text style={{color: 'white', fontWeight: '500'}}>
                Achievement
              </Text>
            </View>
          </View>
          <View style={styles.performanceDeshbord}>
            <View
              style={{
                flex: 8,

                alignItems: 'center',
                padding: 4,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                Call Report Target : 100
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '400',
                  color: colors.primary,
                }}>
                Call Report Achievement : 50
              </Text>
              <View style={{alignItems: 'center', margin: 5}}>
                <Pie
                  radius={45}
                  innerRadius={25}
                  sections={[
                    {
                      percentage: 25,
                      color: colors.primary,
                    },
                    {
                      percentage: 25,
                      color: '#0ca85d',
                    },
                    {
                      percentage: 25,
                      color: '#eba10f',
                    },
                    {
                      percentage: 25,
                      color: '#2b87e3',
                    },
                  ]}

                  // strokeCap={'butt'}
                />
                <Text style={{fontWeight: 'bold', margin: 2}}>
                  Achievement(%):50%
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 2,
                backgroundColor: colors.primary,
                alignItems: 'center',
                padding: 2,
              }}>
              <Text style={{color: 'white', fontWeight: '500'}}>Call</Text>
              <Text style={{color: 'white', fontWeight: '500'}}>Report</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
};

export default CallCardStatus;
const styles = StyleSheet.create({
  performanceDeshbord: {
    height: 240,
    width: '49%',

    margin: 2,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});
