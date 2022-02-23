import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from '../config/colors';
import {useNavigation} from '@react-navigation/native';
const Notification = ({item, onPressNoti}) => {
  
  const navigation = useNavigation();

  const handlePressNotification = async item => {
    onPressNoti(item);
    if (item.type === 'communication') {
      navigation.navigate('Communication');
    } else {
      navigation.navigate('Guideline');
    }
  };



  return (
    <>
      <TouchableOpacity
        onPress={() => handlePressNotification(item)}
        style={item.viewed ? styles.ViewedItem : styles.item}>
        <Text style={item.viewed ? styles.ViewedItem : styles.item}>
          {item.name}
        </Text>
      
      </TouchableOpacity>
    </>
  );
};

export default Notification;

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
    padding: 10,
    backgroundColor: '#ff8566',
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  ViewedItem: {
    marginVertical: 4,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
});
