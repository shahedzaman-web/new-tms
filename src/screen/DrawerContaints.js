import React, {useContext, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import colors from '../config/colors';
import UserInfoContext from '../hooks/userInfoContext';
import {baseURL} from '../../baseURL';
import AuthContext from '../hooks/authContext';


const DrawerContains = () => {
  const userInfoContext = useContext(UserInfoContext);
  const authContext = useContext(AuthContext);
  const {userInfo, setUserInfo} = userInfoContext;
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    const getOutlet = async () => {
      try {
        setIsLoading(true);
        const settings = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authContext.user,
          },
        };
        const res = await fetch(baseURL + '/app/user/info', settings);
        const resData = await res.json();
        // console.log({resData});

        setUserInfo(resData.data), setIsLoading(false);

        // console.log({resData});
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    getOutlet();
  }, [setUserInfo, authContext.user]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    );
  }

  // console.log('userInfoContext', userInfoContext.userInfo);
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View
          style={{
            width: '100%',
            borderTopEndRadius: 30,

            marginTop: 30,
          }}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../assets/image/proPic.png')}
              style={styles.image}
            />

            <Text style={styles.text}>{userInfo?.name}</Text>

            <Text style={styles.subText}>{userInfo?.email}</Text>
          </View>
          <View style={[styles.line, styles.mt12]} />
          <Text style={styles.textDes}>{userInfo?.region?.name}</Text>
          <View style={[styles.line, styles.mt12]} />
          <Text style={styles.textDes}>{userInfo?.area?.name}</Text>
          <View style={[styles.line, styles.mt12]} />
          <Text style={styles.textDes}>{userInfo?.territory?.name}</Text>
          <View style={[styles.line, styles.mt12]} />
          <Text style={styles.textDes}>Total Allocatated outlet</Text>
          {/* <View style={[styles.line, styles.mt12]} />
          <Text style={styles.textDes}>DOB</Text> */}
          <View style={[styles.line, styles.mt12]} />
          <Text style={styles.textDes}>{userInfo?.phone}</Text>
          <View style={[styles.line, styles.mt12]} />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default DrawerContains;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 1,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
  },
  line: {
    marginVertical: 10,
    borderColor: '#fff',
    borderWidth: 0.5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: '#fff',
  },
  textDes: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 12,
  },
  mt12: {
    marginTop: 12,
  },
});
