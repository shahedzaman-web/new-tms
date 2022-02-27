import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AppScreen from '../components/AppScreen';
import AppTitle from '../components/AppTitle';
import LanguageContext from '../hooks/languageContext';
import UserInfoContext from '../hooks/userInfoContext';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../config/colors';
import {Dropdown} from 'react-native-element-dropdown';

const PhotoFrame = () => {
  const [dropdown, setDropdown] = React.useState(null);
  const [outlet, setOutlet] = React.useState(null);
  const languageContext = React.useContext(LanguageContext);
  const {toggleLanguage} = languageContext;
  const userInfoContext = React.useContext(UserInfoContext);
  const [image, setImage] = React.useState(null);
  const [base64Image, setBase64Image] = React.useState('');
 
  React.useEffect(() => {
    if (userInfoContext.userInfo.outletCode) {
      setOutlet(userInfoContext.userInfo.outletCode);
    }
  }, [userInfoContext.userInfo.outletCode]);
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      includeBase64: true,
      includeExif: true,
      width: 300,
      height: 200,
      cropping: true,
    }).then(image => {
      setBase64Image({
        image: {
          uri: `data:${image.mime};base64,` + image.data,
          width: image.width,
          height: image.height,
        },
        images: null,
      });
      setImage(image);
    });
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
      <AppTitle title={toggleLanguage ? 'Photo Frame' : 'ফটো ফ্রেম'} />
      <View style={styles.container}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.titleText}>
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
        {dropdown && (
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.takePhotoBtn}
              onPress={takePhotoFromCamera}>
              <Image
                source={
                  image
                    ? {uri: image.path}
                    : require('../assets/image/cam.png')
                }
                style={styles.image}
              />
              <Text style={styles.btnText}>
                {toggleLanguage ? 'Take Photo' : 'ছবি তুলুন'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AppScreen>
  );
};

export default PhotoFrame;

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  dropdownContainer: {flexDirection: 'row', alignItems: 'center', margin: 5},
  dropdown: {
    width: wp('55%'),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    margin: 16,
    height: 50,
    paddingHorizontal: 8,
  },
  titleText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 18,
    paddingVertical: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },item: {
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
  },imageContainer:{
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
      justifyContent: 'center',
      alignItems : 'center',
      borderWidth:1,
      borderColor: colors.primary,
      borderRadius: 5,
      marginHorizontal:60,
      paddingVertical:4
  },btnText:{
      textAlign: 'center'
  },image: {width: 60, height: 60},
});
