import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AppScreen from '../components/AppScreen';
import colors from '../config/colors';
import AuthContext from '../hooks/authContext';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AppTitle from '../components/AppTitle';
import LanguageContext from '../hooks/languageContext';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {baseURL} from '../../baseURL';

const EASAdvocacy = () => {
  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;
  const authContext = useContext(AuthContext);
  const [retailerNumber, setRetailerNumber] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (retailerNumber.length === 0 || consumerNumber.length === 0) {
      alert('Please fill all the fields');
    } else {
      try {
        setIsLoading(true);

        const response = await fetch(baseURL + '/app/entry', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: authContext.user,
          },
          body: JSON.stringify({
            retailerNumber,
            consumerNumber,
          }),
        });
        const responseJson = await response.json();
        console.log({responseJson});
        if (responseJson.code === 201) {
          setRetailerNumber('');
          setConsumerNumber('');
          setIsLoading(false);
          Alert.alert(responseJson.message);
        } else {
          Alert.alert(JSON.stringify(responseJson));
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Something went wrong');
        setIsLoading(false);
      }
    }
  };

  return (
    <AppScreen>
      <AppTitle title={toggleLanguage ? 'EAS Advocacy' : 'ইএএস এডভোকেসি'} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {toggleLanguage ? ' Retailer Number ' : ' রিটেইলার নম্বর '}
          </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            value={retailerNumber}
            onChangeText={text => setRetailerNumber(text)}
            placeholder={
              toggleLanguage ? 'Enter Retailer Number' : 'রেটিইলার নম্বর লিখুন'
            }
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {toggleLanguage ? ' Consumer Number ' : ' কনসিউমার নম্বর '}
          </Text>
          <TextInput
            style={styles.textInput}
            value={consumerNumber}
            keyboardType="number-pad"
            onChangeText={text => setConsumerNumber(text)}
            placeholder={
              toggleLanguage ? 'Enter Consumer Number' : 'কনসিউমার নম্বর লিখুন'
            }
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          {isLoading && <ActivityIndicator size="small" color="#fff" />}
          <Text style={styles.buttonText}>
            {toggleLanguage
              ? 'Request for Entry'
              : ' এন্ট্রির জন্য অনুরোধ করুন '}
          </Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
};

export default EASAdvocacy;

const styles = StyleSheet.create({
  container: {
    padding: wp('5%'),
  },
  textContainer: {
    paddingVertical: wp('2%'),
  },
  text: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: colors.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: wp('4%'),
    padding: wp('2%'),
    marginVertical: wp('2%'),
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: colors.primary,
    padding: wp('4%'),
    borderRadius: wp('4%'),
    marginVertical: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
});
