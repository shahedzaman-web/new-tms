import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../config/colors';
import AppMenu from './AppMenu';
import NotificationContext from '../hooks/notificationContext';

const AppTitle = ({title}) => {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const notificationContext = useContext(NotificationContext);
  const {notifications} = notificationContext;
  const [notificationLength, setNotificationLength] = useState(0);
  useEffect(() => {
    const result = notifications.filter(x => x.viewed === false).length;
    // console.log({result});

    // console.log({notifications});
    setNotificationLength(result);
  }, [notificationLength,notifications]);
  


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/image/backarrow.png')}
          style={{height: 26, width: 26, marginLeft: 5}}
        />
      </TouchableOpacity>
      <View
        style={{
          width: '60%',
          height: '100%',
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={() => navigation.navigate('Notification')}>
          {notificationLength > 0 ? (
              <Image
              source={require('../assets/image/notificationWithAlert.png')}
              style={{height: 26, width: 26}}
            />
        
          ) : (
            <Image
            source={require('../assets/image/Notification.png')}
            style={{height: 26, width: 26}}
          />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowMenu(prevState => !prevState)}>
          <Image
            source={require('../assets/image/dots.png')}
            style={{height: 26, width: 26}}
          />
        </TouchableOpacity>
        <View>{showMenu && <AppMenu />}</View>
      </View>
    </View>
  );
};

export default AppTitle;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 5,
    height: 80,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
