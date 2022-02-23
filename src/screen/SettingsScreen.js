import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import AppScreen from '../components/AppScreen';
import AppTitle from '../components/AppTitle';
import colors from '../config/colors';
import {baseURL} from '../../baseURL';
import Icon from 'react-native-vector-icons/FontAwesome';
import AuthContext from '../hooks/authContext';
import LanguageContext from '../hooks/languageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SettingsScreen = () => {
  const [viewChangePass, setViewChangePass] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const languageContext = useContext(LanguageContext);
  const {toggleLanguage, setToggleLanguage} = languageContext;
  const handleChangePassword = async () => {
    try {
      if (newPassword === confirmPassword) {
        setIsLoading(true);
        const settings = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authContext.user,
          },
          body: JSON.stringify({
            currentPassword: oldPassword,
            password: newPassword,
          }),
        };

        const response = await fetch(
          baseURL + '/app/user/reset_password',
          settings,
        );
        const json = await response.json();
        // console.log(json);
        if (json.code === 200) {
          Alert.alert('Password Changed Successfully');
          setIsLoading(false);
        } else {
          Alert.alert('Password Change Failed');
          setIsLoading(false);
        }
      } else {
        Alert.alert('New Password and Confirm Password is not Same.');
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const handleSelectBangla = async () => {
    try {
      setToggleLanguage(prevState=>!prevState);
      await AsyncStorage.setItem('language', JSON.stringify(!toggleLanguage));
      const value = await AsyncStorage.getItem('language');
      // console.log({value});
    } catch (error) {
      console.log(error);
    }
  };
  const handleSelectEnglish = async () => {
    try {
      setToggleLanguage(prevState=>!prevState);
      await AsyncStorage.setItem('language', JSON.stringify(!toggleLanguage))
      const value = await AsyncStorage.getItem('language');
      // console.log({value});
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <AppScreen>
      <SafeAreaView>
        <AppTitle title={toggleLanguage ? 'Settings' : 'সেটিংস'} />
        <View style={styles.container}>
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.text}>
                {' '}
                {toggleLanguage ? 'Select Language' : 'ভাষা নির্বাচন'}{' '}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <CheckBox
                  size={16}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    padding: 0,
                    margin: 0,
                  }}
                  textStyle={{
                    color: '#fff',
                  }}
                  center
                  title="English"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#fff"
                  uncheckedColor="#fff"
                  checked={toggleLanguage}
                  onPress={handleSelectEnglish}
                />
                <CheckBox
                  size={16}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    padding: 0,
                    margin: 0,
                  }}
                  textStyle={{
                    color: '#fff',
                  }}
                  center
                  title="বাংলা"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#fff"
                  uncheckedColor="#fff"
                  checked={!toggleLanguage}
                  onPress={handleSelectBangla}
                />
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.spaceBetween}>
              <Text style={styles.text}>
                {toggleLanguage
                  ? 'Change Password'
                  : 'পাসওয়ার্ড পরিবর্তন করুন'}
              </Text>
              <TouchableOpacity
                onPress={() => setViewChangePass(prevState => !prevState)}>
                {viewChangePass ? (
                  <Icon name="minus-circle" size={20} color="#fff" solid />
                ) : (
                  <Icon name="plus-circle" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
            {viewChangePass && (
              <View style={styles.passContainer}>
                <Text style={styles.smallText}>
                  {toggleLanguage ? 'Old Password' : 'পুরানো পাসওয়ার্ড'}{' '}
                </Text>
                <TextInput
                  placeholder="Old Password"
                  style={styles.input}
                  onChangeText={text => setOldPassword(text)}
                  secureTextEntry={true}
                />
                <Text style={styles.smallText}>
                  {toggleLanguage ? 'New Password' : 'নতুন পাসওয়ার্ড'}{' '}
                </Text>
                <TextInput
                  placeholder="New Password"
                  style={styles.input}
                  onChangeText={text => setNewPassword(text)}
                  secureTextEntry={true}
                />
                <Text style={styles.smallText}>
                  {toggleLanguage
                    ? 'Confirm Password'
                    : 'পাসওয়ার্ড নিশ্চিত করুন'}{' '}
                </Text>
                <TextInput
                  placeholder="Confirm Password"
                  style={styles.input}
                  onChangeText={text => setConfirmPassword(text)}
                  secureTextEntry={true}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleChangePassword}>
                  {isLoading && (
                    <ActivityIndicator size="small" color={colors.primary} />
                  )}
                  <Text style={styles.buttonText}>
                    {toggleLanguage
                      ? 'Change Password'
                      : 'পাসওয়ার্ড পরিবর্তন করুন'}{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </AppScreen>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    position: 'relative',
    zIndex: 0,
  },
  card: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  optionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  box: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
  },
  passText: {
    fontSize: 16,
    fontWeight: '600',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passContainer: {
    padding: 20,
  },
  smallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});
