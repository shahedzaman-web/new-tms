import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../config/colors';
import AuthContext from '../hooks/authContext';
import authStorage from '../utils/authStorage';
import LanguageContext from '../hooks/languageContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AppMenu = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;

  const handleLogout = async () => {
    authContext.setUser(null);
    await authStorage.removeAuthToken();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.btnText}>
          {toggleLanguage ? 'Setting' : 'সেটিং'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.btnText}>
          {toggleLanguage ? 'Logout' : 'লগ আউট'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppMenu;

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 60,
    backgroundColor: colors.primary,
    position: 'absolute',
    right: 0,
    zIndex: 100,
    top: 30,
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
  },
  button: {
    paddingVertical: 4,
  },
});
