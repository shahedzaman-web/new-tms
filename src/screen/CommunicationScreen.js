import React, {useContext, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppScreen from '../components/AppScreen';
import colors from '../config/colors';
import AuthContext from '../hooks/authContext';
import authStorage from '../utils/authStorage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppTitle from '../components/AppTitle';
import LanguageContext from '../hooks/languageContext';
const CommunicationScreen = ({navigation}) => {
  const [showMenu, setShowMenu] = useState(false);

  const authContext = useContext(AuthContext);
  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;

  const handleLogout = async () => {
    authContext.setUser(null);
    await authStorage.removeAuthToken();
    navigation.replace('Login');
  };

  return (
    <AppScreen>
      <AppTitle title={toggleLanguage ? 'Communication' : 'কমিউনিকেশন'} />
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginRight: 20,
          margin: 20,
          zIndex: 1,
        }}>
        <View>
          {showMenu && (
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.btnText}> Setting</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Text style={styles.btnText}> Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Communication')}>
          <Image
            source={require('../assets/image/wallet.png')}
            style={{width: 100, height: 100}}
          />
          <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
            {toggleLanguage ? 'Communication' : 'কমিউনিকেশন'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Guideline')}>
          <Icon name="book" size={100} color={colors.primary} solid />
          <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
            {toggleLanguage ? 'Guideline' : 'গাইডলাইন'}
          </Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
};

export default CommunicationScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    width: wp('42%'),
    height: hp('22%'),
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  menuContainer: {
    width: 80,
    height: 60,
    backgroundColor: colors.primary,
    position: 'absolute',
    right: 0,
    zIndex: 12,
    top: 30,
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
  },
  menuButton: {
    paddingVertical: 4,
  },
  guideline: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
});
