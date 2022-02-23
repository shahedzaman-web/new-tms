import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {baseURL} from '../../baseURL';
import Screen from '../components/Screen';
import AuthContext from '../hooks/authContext';
import LanguageContext from '../hooks/languageContext';
import authStorage from '../utils/authStorage';
import colors from './../config/colors';
const LoginScreen = ({navigation}) => {
  const [mobile_number, setMobile_number] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;
  const authContext = useContext(AuthContext);

  // console.log(baseURL);

  const handleLogin = async () => {
    if (mobile_number === '' || password === '') {
      Alert.alert('Please enter all the fields');
    } else {
      setIsLoading(true);

      try {
        const settings = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: mobile_number,
            password: password,
          }),
        };
        const response = await fetch(baseURL + '/app/login', settings);
        const responseJson = await response.json();
        // console.log({responseJson});
        if (responseJson.code === 200) {
          setIsLoading(false);
          const token = responseJson.payload.auth_token
           authContext.setUser(token);
          // console.log({token});
          authStorage.storeAuthToken(token);
          navigation.replace('Drawer', {screen: 'Home'});
        }
        else {
          setIsLoading(false);
          Alert.alert(responseJson.message);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };
  return (
    <Screen>
      <View style={styles.container}>
        <Image
          source={require('./../assets/image/Logo.png')}
          style={styles.logo}
        />
      
        <TextInput
          placeholderTextColor="gray"
          style={styles.input}
          placeholder={toggleLanguage ? "Enter Mobile Number" : "মোবাইল নম্বর লিখুন"}
          onChangeText={text => setMobile_number(text)}
          keyboardType="number-pad"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="gray"
          placeholder={toggleLanguage ? "Password" : "পাসওয়ার্ড"} 
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {isLoading && <ActivityIndicator size="small" color="white" />}
          <Text style={styles.buttonText}>{toggleLanguage ? "Login" : "লগইন"} </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 30,
    fontWeight: '600',
    marginVertical: 12,
    textAlign: 'center',
    color: colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 16,
    marginVertical: 10,
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: 320,
    height: 50,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    alignSelf: 'center',
    width: wp('40%'),
    height: hp('20%'),
  },
});
