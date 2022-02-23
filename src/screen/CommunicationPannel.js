import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect, useState} from 'react';
import Pannel from '../components/Pannel';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {baseURL} from '../../baseURL';

import AppScreen from '../components/AppScreen';
import AppTitle from '../components/AppTitle';

import colors from '../config/colors';
import AuthContext from '../hooks/authContext';
import LanguageContext from '../hooks/languageContext';

const CommunicationPannel = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;
  useEffect(() => {
    const getDataFromAsyncStorage = async () => {
      try {
        const value = await AsyncStorage.getItem('communicationData');
        if (value !== null) {
          setData(JSON.parse(value));
        }
      } catch (e) {
        // error reading value
        console.log('error getting AsyncStorage guidelineData', e);
      }
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const settings = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authContext.user,
          },
        };
        const response = await fetch(
          baseURL + '/app/communication/all',
          settings,
        );
        const json = await response.json();
        console.log({json});
        await AsyncStorage.setItem('communicationData', JSON.stringify(json));
        setData(json);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchData();
    if (!data) {
      getDataFromAsyncStorage();
    }
  }, []);

  useEffect(() => {
    if (data) {
      data.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    } else {
      console.log('data is null');
    }
  }, [data]);

  if (isLoading) {
    return (
      <AppScreen>
        <SafeAreaView>
          <AppTitle
            title={
              toggleLanguage ? 'Communication Pannel' : 'কমিউনিকেশন প্যানেল'
            }
          />
          <View style={styles.activityContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <SafeAreaView>
        <AppTitle
          title={toggleLanguage ? 'Communication Pannel' : 'কমিউনিকেশন প্যানেল'}
        />

        <FlatList
          style={styles.list}
          data={data}
          renderItem={({item, index}) => <Pannel item={item} index={index} />}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* <ScrollView style={{marginBottom: 20}}>
          {data && data.map((item, index) => (
            <Pannel style={{flex:1}} item={item}  index={index} key={index} />
          ))}
        </ScrollView> */}
      </SafeAreaView>
    </AppScreen>
  );
};

export default CommunicationPannel;

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  video: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('100%'),
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: 'gray',
    paddingVertical: 5,
  },
  brand: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  viewContainer: {
    width: wp('30%'),
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    marginTop: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    height: hp('60%'),
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: 10,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },

});
