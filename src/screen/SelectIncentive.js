import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppScreen from '../components/AppScreen';
import LanguageContext from '../hooks/languageContext';
import AppTitle from '../components/AppTitle';
import {Dropdown, SelectCountry} from 'react-native-element-dropdown';
import UserInfoContext from '../hooks/userInfoContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import colors from '../config/colors';
import {baseURL_Server2, incentiveMediaURL} from './../../baseURL.json';
const SelectIncentive = () => {
  const [dropdown, setDropdown] = useState('');
  const [salesPoint, setSalesPoint] = useState({});
  const [selectIncentive1, setSelectIncentive1] = useState(null);
  const [selectIncentive2, setSelectIncentive2] = useState(null);
  const [showIncentive, setShowIncentive] = useState(false);
  const [outlet, setOutlet] = useState(null);
  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;
  const userInfoContext = useContext(UserInfoContext);
  const {userInfo} = userInfoContext;
  const [typeOne, setTypeOne] = React.useState([]);
  const [typeTwo, setTypeTwo] = React.useState([]);
  const [loading, setLoading] = useState(false);
  console.log(JSON.stringify(userInfoContext));

  // /api/getSelectedIncentives
  const getSelectedIncentive = async () => {
    const res = await axios.get(
      `${baseURL_Server2}/api/getSelectedIncentives?search=${
        dropdown.split('(')[1].split(')')[0]
      }`,
    );
    console.log(res.data);
  };

  React.useLayoutEffect(() => {
    getSelectedIncentive();
  }, [dropdown]);

  const getTypeOne = async () => {
    const response = await axios.get(baseURL_Server2 + '/api/getTypeOne');
    if (response.status !== 200) {
      Alert.alert('Error', 'Something went wrong');
    } else {
      setTypeOne(
        response?.data?.data.map(x => {
          return {
            value: x.name,
            label: x.name,
            image: {uri: incentiveMediaURL + `/${x.photo}`},
          };
        }),
      );
    }
  };

  const getTypeTwo = async () => {
    const response = await axios.get(baseURL_Server2 + '/api/getTypeTwo');
    if (response.status !== 200) {
      Alert.alert('Error', 'Something went wrong');
    } else {
      setTypeTwo(
        response?.data?.data.map(x => {
          return {
            value: x.name,
            label: x.name,
            image: {uri: incentiveMediaURL + `/${x.photo}`},
          };
        }),
      );
    }
  };

  React.useLayoutEffect(() => {
    getTypeOne();
    getTypeTwo();
  }, []);

  useEffect(() => {
    if (userInfo.outletCode) {
      setOutlet(userInfo.outletCode);
    }
  }, [userInfo.outletCode]);

  const handleSubmit = async () => {
    if (selectIncentive1 && selectIncentive2 && dropdown) {
      setLoading(true);

      const payload = {
        region: userInfo.region[0].name,
        regionId: userInfo.region[0].id,
        area: userInfo.area[0].name,
        areaId: userInfo.area[0].id,
        territory: userInfo.territory[0].name,
        territoryId: userInfo.territory[0].id,
        salesPoint: salesPoint.name,
        salesPointId: salesPoint.id,
        tmsName: userInfo.name,
        tmsEnroll: userInfo.enrollId,
        tmsMobile: userInfo.phone,
        outletCode: dropdown.split('(')[1].split(')')[0],
        outletName: dropdown.split('(')[0],
        incentiveOne: selectIncentive1,
        incentiveTwo: selectIncentive2,
      };

      const response = await axios.post(
        'http://5.182.17.51:5000/api/selectNewIncentive',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log({response});
      if (response.status !== 200) {
        console.log({response});
        setLoading(false);
        Alert.alert('Error', response?.data?.message);
      } else {
        console.log({response});
        setLoading(false);
        Alert.alert('Success', response?.data?.message);
      }
    } else {
      setLoading(false);
      Alert.alert('Error', 'Please select all fields');
    }
  };

  const _renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  return (
    <AppScreen>
      <AppTitle
        title={toggleLanguage ? 'Select Incentive' : 'ইন্সেন্টিভ নির্বাচন'}
      />
      <View style={styles.container}>
        <Text style={styles.titleText}>
          {' '}
          {toggleLanguage ? 'Select Outlet Code' : 'আউটলেট কোড নির্বাচন করুন  '}
        </Text>
        <View style={styles.dropdownContainer}>
          <Text style={styles.text}>
            {toggleLanguage ? 'Outlet Code' : 'আউটলেট কোড'}
          </Text>
          <View style={{width: wp('60%'), marginLeft: 5}}>
            {outlet ? (
              <Dropdown
                placeholderStyle={styles.placeholderStyle}
                style={styles.dropdown}
                containerStyle={styles.shadow}
                data={outlet}
                placeholder="Select item"
                search
                searchPlaceholder="Search..."
                labelField="label"
                valueField="value"
                label="Dropdown"
                placeholder={dropdown ? dropdown : 'Select outlet'}
                value={dropdown}
                onChange={item => {
                  setDropdown(item.label);
                  setSalesPoint(item.salesPoint);
                  console.log('selected', item);
                }}
                renderItem={item => _renderItem(item)}
                textError="Error"
              />
            ) : (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
          </View>
        </View>
        {showIncentive ? (
          <View style={styles.incentiveContainer}>
            <Text style={styles.titleText}>
              {toggleLanguage ? 'Select Incentive' : 'ইন্সেন্টিভ নির্বাচন করুন'}
            </Text>
            <View style={styles.dropdownContainer}>
              <Text style={styles.text}>
                {toggleLanguage ? 'Incentive 1' : 'ইন্সেন্টিভ ১'}
              </Text>
              <SelectCountry
                style={styles.dropdownImage}
                selectedTextStyle={styles.selectedTextStyle}
                placeholderStyle={styles.placeholderStyle}
                imageStyle={styles.imageStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                search
                maxHeight={220}
                value={selectIncentive1}
                data={typeOne}
                valueField="value"
                labelField="label"
                imageField="image"
                placeholder="Select Incentive 1"
                searchPlaceholder="Search..."
                onChange={e => {
                  return setSelectIncentive1(e.value);
                }}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={styles.text}>
                {toggleLanguage ? 'Incentive 2' : 'ইন্সেন্টিভ ২'}
              </Text>
              <SelectCountry
                style={styles.dropdownImage}
                selectedTextStyle={styles.selectedTextStyle}
                placeholderStyle={styles.placeholderStyle}
                imageStyle={styles.imageStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                search
                maxHeight={150}
                value={selectIncentive2}
                data={typeTwo}
                valueField="value"
                labelField="label"
                imageField="image"
                placeholder="Select Incentive 2"
                searchPlaceholder="Search..."
                onChange={e => {
                  return setSelectIncentive2(e.value);
                }}
              />
            </View>
            <View style={styles.submitContainer}>
              <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitText}>
                    {toggleLanguage ? 'Submit' : 'জমা দিন'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.viewIncentiveContainer}>
            <Text style={styles.titleText}>
              {toggleLanguage ? 'View Incentive' : 'ইন্সেন্টিভ দেখুন'}
            </Text>
            <View style={styles.dropdownContainer}>
              <Text style={styles.text}>
                {toggleLanguage ? 'Incentive 1' : 'ইন্সেন্টিভ ১'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.primary,
                  padding: 5,
                  borderRadius: 5,
                }}>
                <Image
                  style={styles.imageStyle}
                  source={{
                    uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
                  }}
                />
                <Text style={styles.text}>
                  {toggleLanguage ? 'Country 1' : 'দেশ ১'}
                </Text>
              </View>
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={styles.text}>
                {toggleLanguage ? 'Incentive 2' : 'ইন্সেন্টিভ ২'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.primary,
                  padding: 5,
                  borderRadius: 5,
                }}>
                <Image
                  style={styles.imageStyle}
                  source={{
                    uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
                  }}
                />
                <Text style={styles.text}>
                  {toggleLanguage ? 'Country 2' : 'দেশ ২'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </AppScreen>
  );
};

export default SelectIncentive;

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  dropdownContainer: {flexDirection: 'row', alignItems: 'center', margin: 5},
  dropdown: {
    width: wp('60%'),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    margin: 16,
    height: 50,
    paddingHorizontal: 8,
  },
  dropdownImage: {
    width: wp('60%'),
    backgroundColor: 'white',
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    margin: 16,
    height: 110,
    paddingHorizontal: 8,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  textItem: {
    flex: 1,
    fontSize: 24,
    marginVertical: 5,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  titleText: {fontWeight: 'bold', color: colors.primary, fontSize: 18},
  incentiveContainer: {
    margin: 5,
  },
  imageStyle: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 5,
    marginRight: 10,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 12,
  },
  text: {
    width: wp('30%'),
  },
  submitContainer: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  submitBtn: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 12,
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
