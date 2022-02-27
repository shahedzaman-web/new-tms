import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
  PermissionsAndroid,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppScreen from '../components/AppScreen';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import AddressContext from '../hooks/addressContext';
import AuthContext from '../hooks/authContext';
import authStorage from '../utils/authStorage';
import colors from '../config/colors';
import NotificationContext from '../hooks/notificationContext';
import LanguageContext from '../hooks/languageContext';
import AppMenu from '../components/AppMenu';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';

Geocoder.init('AIzaSyD2teCqM8UnfoEvVLqzlwf7iHWPrfIJkvY');

const HomeScreen = ({navigation}) => {
  const [showMenu, setShowMenu] = useState(false);

  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [observing, setObserving] = useState(false);
  const [foregroundService, setForegroundService] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState(null);

  const notificationContext = useContext(NotificationContext);
  const {notifications} = notificationContext;
  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;
  const [notificationLength, setNotificationLength] = useState(0);
  useEffect(() => {
    const result = notifications.filter(x => x.viewed === false).length;
    console.log({result});

    console.log({notifications});
    setNotificationLength(result);
  }, [notificationLength, notifications]);

  const addressContext = useContext(AddressContext);
  useEffect(() => {
    const hasPermissionIOS = async () => {
      const openSetting = () => {
        Linking.openSettings().catch(() => {
          Alert.alert('Unable to open settings');
        });
      };
      const status = await Geolocation.requestAuthorization('whenInUse');

      if (status === 'granted') {
        return true;
      }

      if (status === 'denied') {
        Alert.alert('Location permission denied');
      }

      if (status === 'disabled') {
        Alert.alert(
          `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
          '',
          [
            {text: 'Go to Settings', onPress: openSetting},
            {text: "Don't Use Location", onPress: () => {}},
          ],
        );
      }

      return false;
    };

    const hasLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        const hasPermission = await hasPermissionIOS();
        return hasPermission;
      }

      if (Platform.OS === 'android' && Platform.Version < 23) {
        return true;
      }

      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (hasPermission) {
        return true;
      }

      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show(
          'Location permission denied by user.',
          ToastAndroid.LONG,
        );
      } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show(
          'Location permission revoked by user.',
          ToastAndroid.LONG,
        );
      }

      return false;
    };

    const getLocation = async () => {
      const hasPermission = await hasLocationPermission();

      if (!hasPermission) {
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          getAddress(position.coords.latitude, position.coords.longitude);
          setLocation(position);
          // console.log({position});
        },
        error => {
          Alert.alert(`Code ${error.code}`, error.message);
          setLocation(null);
          console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: forceLocation,
          forceLocationManager: useLocationManager,
          showLocationDialog: locationDialog,
        },
      );
    };
    const getAddress = async (latitude, longitude) => {
      const response = await Geocoder.from({latitude, longitude});
      const address = response.results[0].formatted_address;

      addressContext.setAddress(address);
      // console.log({address});
      // console.log('address context', addressContext.address);
    };

    getLocation();
  }, []);
  const authContext = useContext(AuthContext);

  const handleLogout = async () => {
    authContext.setUser(null);
    await authStorage.removeAuthToken();
    navigation.replace('Login');
  };

  return (
    <AppScreen>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            marginRight: 20,
            margin: 20,
            zIndex: 1,
          }}>
          <TouchableOpacity
            style={{marginRight: 20}}
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
          <TouchableOpacity
            onPress={() => setShowMenu(prevState => !prevState)}>
            <Image
              source={require('../assets/image/dots.png')}
              style={{height: 26, width: 26}}
            />
          </TouchableOpacity>
          <View>{showMenu && <AppMenu />}</View>
        </View>
        <View style={styles.infoContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Outlet')}>
            <Image
              source={require('../assets/image/wallet-2.png')}
              style={{width: 100, height: 100}}
            />
            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
              {toggleLanguage
                ? 'Outlet performance & Call Card'
                : 'আউটলেট পারফরম্যান্স এবং কল কার্ড'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CommunicationScreen')}>
            <Image
              source={require('../assets/image/wallet.png')}
              style={{width: 100, height: 100}}
            />
            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
              {toggleLanguage ? 'Communication Pannel' : 'কমিউন্টিশন প্যানেল'}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            justifyContent: 'space-around',
          }}>
          <View style={styles.newContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('EASAdvocacy')}>
              <Icon name="envelope" size={100} color={colors.primary} solid />
              <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                {toggleLanguage ? 'EAS Advocacy' : 'ইএএস এডভোকেসি'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.newContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('SelectIncentive')}>
              <IconMaterialCommunity
                name="gift-outline"
                size={100}
                color={colors.primary}
                solid
              />
              <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                {toggleLanguage ? 'Select Incentive' : 'ইন্সেন্টিভ নির্বাচন'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            justifyContent: 'space-around',
          }}>
          <View style={styles.newContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('DistributionIncentive')}>
              <IconMaterialCommunity
                name="distribute-vertical-center"
                size={100}
                color={colors.primary}
                solid
              />
              <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                {toggleLanguage
                  ? 'Distribution Incentive'
                  : 'ডিস্ট্রিবিউশন ইন্সেন্টিভ '}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.newContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('PhotoFrame')}>
              <IconMaterial
                name="add-a-photo"
                size={100}
                color={colors.primary}
                solid
              />
              <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                {toggleLanguage ? 'Photo Frame' : 'ফটো ফ্রেম'}
              </Text>
            </TouchableOpacity>
            <View style={styles.marginBottom} />
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',

    width: wp('42%'),
    height: hp('25%'),
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  menuContainer: {
    width: 90,
    height: 70,
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
  infoContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-around',
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
  newContainer: {
    marginTop: 25,
    marginLeft: 25,
    marginRight: 25,
  },
  cardContainer: {
    marginLeft: 25,
    marginBottom: 30,
  },
  marginBottom: {
    marginBottom: 25,
  },
});
