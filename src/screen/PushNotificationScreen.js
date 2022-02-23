import io from 'socket.io-client';
import React, {useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppTitle from '../components/AppTitle';
import AppScreen from '../components/AppScreen';
import Notification from '../components/Notification';
import {FlatList, StyleSheet, View} from 'react-native';
import NotificationContext from '../hooks/notificationContext';
import LanguageContext from '../hooks/languageContext';

const PushNotificationScreen = () => {
  const notificationContext = useContext(NotificationContext);
  const {notifications, setNotifications} = notificationContext;

  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;

  const datedNotification = new Date(
    Math.max(...notifications.map(e => new Date(e.date))),
  );
  // console.log({datedNotification});
  // console.log({notifications});

  const handlePressNotification = async item => {
    const prevNotifications = await AsyncStorage.getItem(`notifications`);

    const modified = JSON.parse(prevNotifications).map(notification => {
      return {
        ...notification,
        viewed: item.name === notification.name ? true : notification.viewed,
      };
    });
  
    setNotifications(modified);

  };
  useEffect(() => {
    notifications.sort(function(a,b){
      return new Date(b.date) - new Date(a.date);
    });
  }, [notifications]);

  

  return (
    <AppScreen>
      <AppTitle title={toggleLanguage ? "Push Notification" : "পুশ নোটিফিকেশন"} />
      <View style={styles.notificationContainer}>
        <FlatList
          data={notifications}
          renderItem={({item}) => (
            <Notification onPressNoti={handlePressNotification} item={item} />
          )}
          keyExtractor={item => item.date}
        />
      </View>
    </AppScreen>
  );
};

export default PushNotificationScreen;

const styles = StyleSheet.create({
  notificationContainer: {
    marginTop: 10,
    marginHorizontal: 10,
   
  },
});
