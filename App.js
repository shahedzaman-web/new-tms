import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationSounds, {
  playSampleSound,
} from 'react-native-notification-sounds';
// internal components
import Screen from './src/components/Screen';

//internal screens
import LoginScreen from './src/screen/LoginScreen';
import HomeScreen from './src/screen/HomeScreen';
import OutletScreen from './src/screen/OutletScreen';
import CallUpdate from './src/screen/CallUpdate';
import PushNotificationScreen from './src/screen/PushNotificationScreen';
import CommunicationPannel from './src/screen/CommunicationPannel';
import SettingsScreen from './src/screen/SettingsScreen';

//Drawer component
import DrawerContaints from './src/screen/DrawerContaints';

// auth context
import AuthContext from './src/hooks/authContext';

// auth storage function
import authStorage from './src/utils/authStorage';

//colors for the app
import colors from './src/config/colors';

// address context
import AddressContext from './src/hooks/addressContext';

// user info context
import UserInfoContext from './src/hooks/userInfoContext';

// location context
import LocationContext from './src/hooks/locationContext';

import io from 'socket.io-client';
import NotificationContext from './src/hooks/notificationContext';
import GuidelinePannel from './src/screen/GuidelinePannel';
import {baseURL} from './baseURL.json';
import CommunicationScreen from './src/screen/CommunicationScreen';
import LanguageContext from './src/hooks/languageContext';
import EASAdvocacy from './src/screen/EASAdvocacy';
import SelectIncentive from './src/screen/SelectIncentive';
import DistributionIncentive from './src/screen/DistributionIncentive';
import PhotoFrame from './src/screen/PhotoFrame';

// App stack navigator

const AppStack = createStackNavigator();

const AppStackScreens = () => {
  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen name="Home" component={HomeScreen} />
      <AppStack.Screen
        name="CommunicationScreen"
        component={CommunicationScreen}
      />

      <AppStack.Screen name="Outlet" component={OutletScreen} />
      <AppStack.Screen name="EASAdvocacy" component={EASAdvocacy} />
      <AppStack.Screen name="CallUpdate" component={CallUpdate} />
      <AppStack.Screen name="Notification" component={PushNotificationScreen} />
      <AppStack.Screen name="Communication" component={CommunicationPannel} />
      <AppStack.Screen name="Guideline" component={GuidelinePannel} />
      <AppStack.Screen name="SelectIncentive" component={SelectIncentive} />
      <AppStack.Screen name="PhotoFrame" component={PhotoFrame} />
      <AppStack.Screen
        name="DistributionIncentive"
        component={DistributionIncentive}
      />

      <AppStack.Screen name="Settings" component={SettingsScreen} />
    </AppStack.Navigator>
  );
};

// DrawerStack Screens

const DrawerStack = createDrawerNavigator();
const DrawerStackScreens = () => {
  return (
    <DrawerStack.Navigator
      drawerStyle={{
        backgroundColor: 'green',
        width: 180,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
      }}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
      }}
      headerMode="none"
      drawerContent={props => <DrawerContaints {...props} />}>
      <DrawerStack.Screen
        name="App"
        component={AppStackScreens}
        options={{drawerLabel: 'Home'}}
      />
    </DrawerStack.Navigator>
  );
};

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [toggleLanguage, setToggleLanguage] = useState(true);
  const [location, setLocation] = useState(null);
  const getLanguage = async () => {
    try {
      const value = await AsyncStorage.getItem('language');
      // console.log({value});

      setToggleLanguage(JSON.parse(value));
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getLanguage();
  }, []);

  // console.log({toggleLanguage});

  const restoreToken = async () => {
    setIsLoading(true);
    const token = await authStorage.getAuthToken();
    // const userInfoStorage = await AsyncStorage.getItem('userInfo');

    // setUserInfo(userInfoStorage);
    // console.log({token});
    if (!token) {
      setIsLoading(false);
      return;
    }
    setUser(token);
    setIsLoading(false);
  };

  useEffect(() => {
    restoreToken();
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  }, [user]);

  // console.log({user});
  // console.log({address});
  /**
   * @type {Array<{name: string; date: string; file: string}>} notifications
   */

  useEffect(() => {
    (async () => {
      const prevNotifications = await AsyncStorage.getItem(`notifications`);

      // console.log('prev notifications', prevNotifications);

      setNotifications(JSON.parse(prevNotifications) ?? []);
    })();
    // fetch notifications from async storage and set into setNotifications
    const socket = io(baseURL);

    socket.on('connect', () => {
      console.log('socket connected');
    });

    socket.on('error', error => {
      console.log('error occured', error);
    });

    socket.on('notification', data => {
      // console.log('notificatin data', data);
      setNotifications(prevState => prevState.concat({...data, viewed: false}));

      NotificationSounds.getNotifications('notification').then(soundsList => {
        playSampleSound(soundsList[1]);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem(
        `notifications`,
        JSON.stringify(notifications),
      );
    })();
  }, [notifications]);

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <SafeAreaProvider>
      <NotificationContext.Provider value={{notifications, setNotifications}}>
        <LocationContext.Provider value={{location, setLocation}}>
          <AuthContext.Provider value={{user, setUser}}>
            <AddressContext.Provider value={{address, setAddress}}>
              <LanguageContext.Provider
                value={{toggleLanguage, setToggleLanguage}}>
                <UserInfoContext.Provider value={{userInfo, setUserInfo}}>
                  <NavigationContainer>
                    <Stack.Navigator
                      screenOptions={{headerShown: false}}
                      initialRouteName={user ? 'Drawer' : 'Login'}>
                      <Stack.Screen name="Login" component={LoginScreen} />
                      <Stack.Screen
                        name="Drawer"
                        component={DrawerStackScreens}
                      />
                    </Stack.Navigator>
                  </NavigationContainer>
                </UserInfoContext.Provider>
              </LanguageContext.Provider>
            </AddressContext.Provider>
          </AuthContext.Provider>
        </LocationContext.Provider>
      </NotificationContext.Provider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
