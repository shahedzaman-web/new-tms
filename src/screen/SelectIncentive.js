import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
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
import Icon from 'react-native-vector-icons/AntDesign';

import {baseURL_Server2, incentiveMediaURL} from './../../baseURL.json';
const SelectIncentive = () => {
  const [dropdown, setDropdown] = useState('');
  const [salesPoint, setSalesPoint] = useState({});
  const [selectIncentive1, setSelectIncentive1] = useState(null);
  const [selectIncentive2, setSelectIncentive2] = useState(null);
  const [selectIncentivePhoto1, setSelectIncentivePhoto1] = useState(null);
  const [selectIncentivePhoto2, setSelectIncentivePhoto2] = useState(null);
  const [showIncentive, setShowIncentive] = useState(true);
  const [outlet, setOutlet] = useState(null);
  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;
  const userInfoContext = useContext(UserInfoContext);
  const {userInfo} = userInfoContext;
  const [typeOne, setTypeOne] = React.useState([]);
  const [typeTwo, setTypeTwo] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [selectIncentiveData, setSelectIncentiveData] = useState([]);
  const [editStatus, setEditStatus] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  React.useLayoutEffect(() => {
    const getSelectedIncentive = async () => {
      if (dropdown !== '') {
        const res = await axios.get(
          `${baseURL_Server2}/api/getSelectedIncentives?search=${
            dropdown.split('(')[1].split(')')[0]
          }`,
        );

        res?.data?.data.length !== 0
          ? (setSelectIncentiveData(res.data.data[0]), setShowIncentive(false))
          : (setSelectIncentiveData([]), setShowIncentive(true));
        // console.log('data---------->', res.data.data);
      }
    };
    getSelectedIncentive();
  }, [dropdown, showIncentive]);
  // console.log({selectIncentiveData});
  // console.log({showIncentive});
  const getTypeOne = async () => {
    const response = await axios.get(baseURL_Server2 + '/api/getTypeOne');
    console.log({response});
    if (response.status !== 200) {
      Alert.alert('Error', 'Something went wrong');
    } else {
      setTypeOne(
        response?.data?.data.map(x => {
          return {
            value: x.name,
            label: x.name,
            image: {uri: incentiveMediaURL + `${x.photo}`},
          };
        }),
      );
    }
  };
  // console.log('setTypeOne------------->', typeOne);
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

  const getEditStatusApi = async () => {
    const response = await axios.get(baseURL_Server2 + '/api/getEditStatus');
    // console.log('getEditStatus----->', response);
    if (response.status !== 200) {
      Alert.alert('Error', 'Something went wrong');
    } else {
      // console.log('getEditStatus----->', response.data);
      response.data.status === 'inactive'
        ? setEditStatus(false)
        : setEditStatus(true);
    }
  };
  // console.log('user info------------------------->', userInfo);
  React.useLayoutEffect(() => {
    getEditStatusApi();
  }, [editStatus]);

  // console.log({editStatus});
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
        incentiveOnePhoto: selectIncentivePhoto1,
        incentiveTwoPhoto: selectIncentivePhoto2,
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
      // console.log({response});
      if (response.status !== 200) {
        // console.log({response});
        setLoading(false);
        setShowIncentive(true);
        Alert.alert('Error', response?.data?.message);
      } else {
        // console.log({response});
        setLoading(false);
        Alert.alert('Success', response?.data?.message);
      }
    } else {
      setLoading(false);
      Alert.alert('Error', 'Please select all fields');
    }
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
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
      incentiveOne:
        selectIncentive1 !== null
          ? selectIncentive1
          : selectIncentiveData.incentiveOne,
      incentiveTwo:
        selectIncentive2 !== null
          ? selectIncentive2
          : selectIncentiveData.incentiveTwo,
      incentiveOnePhoto:
        selectIncentivePhoto1 !== null
          ? selectIncentivePhoto1
          : selectIncentiveData.incentiveOnePhoto,
      incentiveTwoPhoto:
        selectIncentivePhoto2 !== null
          ? selectIncentivePhoto2
          : selectIncentiveData.incentiveTwoPhoto,
    };
    // console.log({payload});

    const response = await axios.put(
      baseURL_Server2 +
        `/api/updateOneOutletIncentive/${selectIncentiveData._id}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    // console.log({response});
    if (response.status !== 200) {
      setShowEditModal(false);

      Alert.alert('Error', response?.data?.message);
    } else {
      setEditLoading(false);
      getTypeOne();
      getTypeTwo();
      setEditLoading(false);
      Alert.alert('Success', response?.data?.message);
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
                  // console.log('selected--------------------->', item);
                }}
                renderItem={item => _renderItem(item)}
                textError="Error"
              />
            ) : (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
          </View>
        </View>
        {dropdown !== '' && (
          <>
            {showIncentive ? (
              <View style={styles.incentiveContainer}>
                <Text style={styles.titleText}>
                  {toggleLanguage
                    ? 'Select Incentive'
                    : 'ইন্সেন্টিভ নির্বাচন করুন'}
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
                      return (
                        setSelectIncentive1(e.value),
                        setSelectIncentivePhoto1(
                          e.image.uri.split(incentiveMediaURL)[1],
                        )
                      );
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
                      return (
                        setSelectIncentive2(e.value),
                        setSelectIncentivePhoto2(
                          e.image.uri.split(incentiveMediaURL)[1],
                        )
                      );
                    }}
                  />
                </View>
                <View style={styles.submitContainer}>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.submitBtn}>
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
                  <View style={styles.incentiveViewContainer}>
                    <Image
                      style={styles.imageStyle}
                      source={{
                        uri: `${incentiveMediaURL}${selectIncentiveData.incentiveOnePhoto}`,
                      }}
                    />
                    <Text style={styles.text}>
                      {selectIncentiveData.incentiveOne}
                    </Text>
                  </View>
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.text}>
                    {toggleLanguage ? 'Incentive 2' : 'ইন্সেন্টিভ ২'}
                  </Text>
                  <View style={styles.incentiveViewContainer}>
                    <Image
                      style={styles.imageStyle}
                      source={{
                        uri: `${incentiveMediaURL}${selectIncentiveData.incentiveTwoPhoto}`,
                      }}
                    />
                    <Text style={styles.text}>
                      {selectIncentiveData.incentiveTwo}
                    </Text>
                  </View>
                </View>
                {editStatus && (
                  <View style={styles.editBtnContainer}>
                    <TouchableOpacity
                      onPress={() => setShowEditModal(true)}
                      style={styles.editBtn}>
                      <Text style={styles.editText}>
                        {toggleLanguage ? 'Edit' : 'পরিবর্তন'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={showEditModal}>
        <View style={styles.modalContainer}>
          <View style={styles.closedBtnContainer}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Icon name="closecircle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {toggleLanguage ? 'Edit Incentive' : 'ইন্সেন্টিভ পরিবর্তন'}
            </Text>
            <View style={styles.modalDropdownContainer}>
              <Text style={styles.modalText}>
                {toggleLanguage ? 'Incentive 1' : 'ইন্সেন্টিভ ১'}
              </Text>
              <SelectCountry
                style={styles.modalDropdownImage}
                selectedTextStyle={styles.selectedTextStyle}
                placeholderStyle={styles.placeholderStyle}
                imageStyle={styles.imageStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                search
                maxHeight={150}
                value={selectIncentive1}
                data={typeOne}
                valueField="value"
                labelField="label"
                imageField="image"
                placeholder="Select Incentive 1"
                searchPlaceholder="Search..."
                onChange={e => {
                  return (
                    setSelectIncentive1(e.value),
                    setSelectIncentivePhoto1(
                      e.image.uri.split(incentiveMediaURL)[1],
                    )
                  );
                }}
              />
            </View>
            <View style={styles.modalDropdownContainer}>
              <Text style={styles.modalText}>
                {toggleLanguage ? 'Incentive 2' : 'ইন্সেন্টিভ ২'}
              </Text>
              <SelectCountry
                style={styles.modalDropdownImage}
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
                  return (
                    setSelectIncentive2(e.value),
                    setSelectIncentivePhoto2(
                      e.image.uri.split(incentiveMediaURL)[1],
                    )
                  );
                }}
              />
            </View>

            <View style={styles.submitContainer}>
              <TouchableOpacity
                onPress={handleEditSubmit}
                style={styles.submitBtn}>
                {editLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitText}>
                    {toggleLanguage ? 'Submit' : 'জমা দিন'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  editBtnContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 10,
    marginVertical: 12,
  },
  editBtn: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 12,
  },
  editText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  incentiveViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 5,
    borderRadius: 5,
  },
  modalContainer: {
    margin: 20,
    justifyContent: 'center',
    marginTop: hp('10%'),
    backgroundColor: 'white',
    borderRadius: 10,
    width: wp('90%'),
    height: hp('68%'),
    padding: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  modalView: {
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },

  modalDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2,
  },
  modalText: {
    fontSize: 16,
    width: wp('22%'),
  },
  modalDropdownImage: {
    width: wp('55%'),
    backgroundColor: 'white',
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    margin: 16,
    height: 110,
    paddingHorizontal: 8,
  },
  closedBtnContainer: {
    flexDirection: 'row',
    width: wp('90%'),
    justifyContent: 'flex-end',
    marginRight: 30,
    marginVertical: 2,
  },
});
