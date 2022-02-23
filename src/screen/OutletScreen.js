import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PerformanceDashboard from '../components/PerformanceDashboard';

import BrandSplit from '../components/BrandSplit';
import DailySalesTrend from '../components/DailySalesTrend';
import {baseURL} from '../../baseURL';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppScreen from '../components/AppScreen';
import AppTitle from '../components/AppTitle';
import colors from '../config/colors';
import AuthContext from '../hooks/authContext';
import UserInfoContext from '../hooks/userInfoContext';
import PushCart from '../assets/image/Push-cart.png';
import CashCounter from '../assets/image/Cash_Counter.png';
import GroceryCounter from '../assets/image/Grocery-Counter.png';
import StreetKiosk from '../assets/image/Street-Kishok.png';
import NewCashCounter from '../assets/image/NEW_CASH_COUNTER.jpg';
import NewPushCart from '../assets/image/NEW_PUSH_CART.png';
import Inf from '../assets/image/image-not-found.png';
import CallCardStatus from '../components/CallCardStatus';
import LanguageContext from '../hooks/languageContext';

const OutletScreen = ({navigation}) => {
  const [dropdown, setDropdown] = useState(null);

  const [viewBrand, setViewBrand] = useState(false);
  const [viewSales, setViewSales] = useState(false);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );

  const [outletDetails, setOutletDetails] = useState({});
  const [loadingOutletDetails, setLoadingOutletDetails] = useState(false);
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] =
    useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);

  const authContext = useContext(AuthContext);
  const userInfoContext = useContext(UserInfoContext);

  const [outlet, setOutlet] = useState(null);
  // const outlet = userInfoContext.userInfo.outletCode;

  const [showDeployedPCM, setShowDeployedPCM] = useState('');

  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;

  useEffect(() => {
    if (userInfoContext.userInfo.outletCode) {
      setOutlet(userInfoContext.userInfo.outletCode);
    }
  }, [userInfoContext.userInfo.outletCode]);
  // console.log({outlet});
  const getOutletData = async () => {
    if (dropdown) {
      setLoadingOutletDetails(true);
      try {
        const settings = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authContext.user,
          },
        };
        console.log({authContext})

        const res = await fetch(baseURL + `/app/outlet/${dropdown}`, settings);
        const resData = await res.json();
        console.log({resData});
        setOutletDetails(resData);
        const pcm = resData?.target?.deployedPCM;
        pcm ? setShowDeployedPCM(pcm) : setShowDeployedPCM('');
        setLoadingOutletDetails(false);
      } catch (err) {
        console.log(err);
        setLoadingOutletDetails(false);
      }
    } else {
      setLoadingOutletDetails(false);
    }
  };

  useEffect(() => {
    getOutletData();
  }, [dropdown, showDeployedPCM]);

  const showStartDatePicker = () => {
    setIsStartDatePickerVisible(true);
  };

  const hideStartDatePicker = () => {
    setIsStartDatePickerVisible(prevState => !prevState);
  };

  const showEndDatePicker = () => {
    setIsEndDatePickerVisible(true);
  };

  const hideEndDatePicker = () => {
    setIsEndDatePickerVisible(prevState => !prevState);
  };
  /**
   *
   * @param {Date} date
   */
  const handleConfirmStartDate = date => {
    var dateString = moment(date).format('YYYY-MM-DD');
    console.log({dateString});
    setStartDate(dateString);

    hideStartDatePicker();
  };
  const handleConfirmEndDate = date => {
    var dateString = moment(date).format('YYYY-MM-DD');
    console.log({dateString});
    setEndDate(dateString);

    hideEndDatePicker();
  };

  const handleBrandView = () => {
    setViewBrand(preState => !preState);
    setViewSales(false);
  };
  const handleDailySalesView = () => {
    setViewSales(preState => !preState);
    setViewBrand(false);
  };

  console.log({showDeployedPCM});
  const _renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  return (
    <AppScreen>
      <View>
        <ScrollView>
          <AppTitle
            title={
              toggleLanguage
                ? 'Outlet Performance & Call Card'
                : 'আউটলেট পারফরমেন্স & কল কার্ড'
            }
          />
          <View style={{flexDirection: 'row', alignItems: 'center', margin: 5}}>
            <Text style={{fontWeight: '500', width: wp('34%')}}>
              {toggleLanguage ? 'Outlet Code' : 'আউটলেট কোড'}
            </Text>
            <View style={{width: wp('60%'), marginLeft: 5}}>
              {outlet ? (
                <Dropdown
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
                    setDropdown(item.value);
                    // console.log('selected', item);
                  }}
                  renderItem={item => _renderItem(item)}
                  textError="Error"
                />
              ) : (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
            </View>
          </View>
          <View style={styles.container}>
            {dropdown && outletDetails && !loadingOutletDetails && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 8,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: '500'}}>
                    {' '}
                    {toggleLanguage ? 'Outline Name' : 'আউটলাইন নাম'}
                  </Text>
                  <View style={styles.textBox}>
                    <Text style={{color: 'gray'}}>{outletDetails?.name}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 8,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: '500'}}>
                    {' '}
                    {toggleLanguage ? 'Outline Code' : 'আউটলাইন কোড'}{' '}
                  </Text>
                  <View style={styles.textBox}>
                    <Text style={{color: 'gray'}}>{outletDetails?.code}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 8,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: '500'}}>
                    {' '}
                    {toggleLanguage ? 'Retailer Name' : 'রেটেলের নাম'}
                  </Text>
                  <View style={styles.textBox}>
                    <Text style={{color: 'gray'}}>
                      {outletDetails?.retailer?.name}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 8,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: '500'}}>
                    {toggleLanguage ? 'Retailer Number' : 'রেটেলের নম্বর'}
                  </Text>
                  <View style={styles.textBox}>
                    <Text style={{color: 'gray'}}>
                      {outletDetails?.retailer?.phone}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 8,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: '500'}}>
                    {toggleLanguage ? 'Retailer Address' : 'রেটেলের এড্রেস'}
                  </Text>
                  <View style={styles.textBox}>
                    <Text style={{color: 'gray'}}>
                      {outletDetails?.retailer?.address}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 8,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: '500'}}>
                    {toggleLanguage ? 'Deployed PCM' : 'ডিপ্লয়েড পিসিএম'}
                  </Text>
                  <View style={styles.textBox2}>
                    {(() => {
                      switch (showDeployedPCM) {
                        case 'Push-Cart':
                          return (
                            <Image
                              source={PushCart}
                              style={styles.showDeployedPCM}
                            />
                          );
                        case 'Cash-Counter':
                          return (
                            <Image
                              source={CashCounter}
                              style={styles.showDeployedPCM}
                            />
                          );
                        case 'Grocery-Counter':
                          return (
                            <Image
                              source={GroceryCounter}
                              style={styles.showDeployedPCM}
                            />
                          );
                        case 'Street Kiosk':
                          return (
                            <Image
                              source={StreetKiosk}
                              style={styles.showDeployedPCM}
                            />
                          );
                        case 'New Cash Counter':
                          return (
                            <Image
                              source={NewCashCounter}
                              style={styles.showDeployedPCM}
                            />
                          );
                        case 'New Push-Cart':
                          return (
                            <Image
                              source={NewPushCart}
                              style={styles.showDeployedPCM}
                            />
                          );
                        case '':
                          return (
                            <Image
                              source={Inf}
                              style={styles.showDeployedPCM}
                            />
                          );

                        default:
                          return (
                            <Image
                              source={Inf}
                              style={styles.showDeployedPCM}
                            />
                          );
                      }
                    })()}
                  </View>
                </View>
              </>
            )}

            {loadingOutletDetails && (
              <ActivityIndicator size="large" color={colors.primary} />
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 10,
              }}>
              <Text style={{fontWeight: '500'}}>
                {toggleLanguage ? 'Start Date' : 'শুরুর তারিখ'}
              </Text>
              <TouchableOpacity
                onPress={showStartDatePicker}
                style={{
                  height: 40,
                  width: 100,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: colors.primary,
                  justifyContent: 'center',
                  padding: 4,
                  borderRadius: 10,
                }}>
                <DateTimePickerModal
                  isVisible={isStartDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirmStartDate}
                  onCancel={hideStartDatePicker}
                />
                <Text style={{fontWeight: '500'}}>{startDate}</Text>
              </TouchableOpacity>

              <Text style={{fontWeight: '500'}}>
                {toggleLanguage ? 'End Date' : 'শেষ তারিখ'}
              </Text>
              <TouchableOpacity
                onPress={showEndDatePicker}
                style={{
                  height: 40,
                  width: 100,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: colors.primary,
                  justifyContent: 'center',
                  padding: 4,
                  borderRadius: 10,
                }}>
                <DateTimePickerModal
                  isVisible={isEndDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirmEndDate}
                  onCancel={hideEndDatePicker}
                />
                <Text style={{fontWeight: '500'}}>{endDate}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.titleText}>
                {toggleLanguage
                  ? 'Performance Dashboard'
                  : 'পারফরমেন্স ড্যাশবোর্ড'}{' '}
              </Text>
              <PerformanceDashboard
                dropdown={dropdown}
                startDate={startDate}
                endDate={endDate}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.titleText}>
                {toggleLanguage ? 'Call Card Status' : 'কল কার্ড স্টেটাস'}
              </Text>
              <CallCardStatus
                dropdown={dropdown}
                startDate={startDate}
                endDate={endDate}
              />
            </View>

            <View style={styles.btnView}>
              {dropdown ? (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() =>
                    navigation.navigate('CallUpdate', {
                      dropdown: dropdown,
                      communication: outletDetails?.communication?.file,
                    })
                  }>
                  <Text style={styles.btnText}>
                    {toggleLanguage ? 'Call Card' : 'কল কার্ড'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.btnDisable} disabled={true}>
                  <Text style={styles.btnText}>
                    {toggleLanguage ? 'Call Card' : 'কল কার্ড'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.spaceBetween}>
                <Text style={styles.titleText}>
                  {toggleLanguage ? 'Brand Split' : 'ব্র্যান্ড স্প্লিট'}
                </Text>
                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={handleDailySalesView}>
                  {viewSales ? (
                    <Icon
                      name="minus-circle"
                      size={20}
                      color={colors.primary}
                      solid
                    />
                  ) : (
                    <Icon name="plus-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
              {viewSales && (
                <View>
                  <BrandSplit
                    dropdown={dropdown}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </View>
              )}
            </View>

            <>
              <View style={styles.card}>
                <View style={styles.spaceBetween}>
                  <Text style={styles.titleText}>
                    {toggleLanguage
                      ? 'Daily Sales Trend'
                      : 'ডেইলি সেলস ট্রেন্ড'}
                  </Text>
                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={handleBrandView}>
                    <Text style={styles.detailsText}>
                      {viewBrand ? (
                        <Icon
                          name="minus-circle"
                          size={20}
                          color={colors.primary}
                          solid
                        />
                      ) : (
                        <Icon
                          name="plus-circle"
                          size={20}
                          color={colors.primary}
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                {viewBrand && (
                  <View>
                    <DailySalesTrend
                      dropdown={dropdown}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </View>
                )}
              </View>
            </>
          </View>
        </ScrollView>
      </View>
    </AppScreen>
  );
};

export default OutletScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  textBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 5,
    borderRadius: 5,
    width: wp('60%'),
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textBox2: {
    borderWidth: 1,
    borderColor: colors.primary,

    borderRadius: 5,
    width: wp('60%'),
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: 8,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    padding: 5,
  },
  btnView: {
    flexDirection: 'row-reverse',
  },
  btn: {
    backgroundColor: colors.primary,
    padding: 8,
    paddingHorizontal: 16,
    marginVertical: 12,
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
  spaceBetween: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  detailsBtn: {
    backgroundColor: 'transparent',
  },
  detailsText: {
    padding: 2,
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  icon: {
    marginRight: 5,
    width: 18,
    height: 18,
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
    fontSize: 16,
    color: 'white',
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
  //performance dashboard style
  performanceDeshbord: {
    height: 200,
    width: '49%',
    margin: 2,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  btnDisable: {
    backgroundColor: 'gray',
    padding: 8,
    paddingHorizontal: 16,
    marginVertical: 12,
    borderRadius: 5,
  },
  showDeployedPCM: {
    width: wp('49.5%'),
    height: hp('25%'),
    resizeMode: 'cover',
    borderRadius: 5,
  },
});
