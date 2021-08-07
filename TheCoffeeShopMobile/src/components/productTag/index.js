import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, View, Text, Image} from 'react-native';
import {imgport} from '../../config/port';

import {connect} from 'react-redux';
import {buyProduct} from './actions/index';

import styles from './style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native';
const ProductTag = (props) => {
  const formatCurrency = (monney) => {
    const mn = String(monney);
    return mn
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + '.') + prev;
      });
  };
  return (
    <View
      style={{
        paddingLeft: 13,
      }}>
      <View style={styles.product_box}>
        <Image
          source={{
            uri: `${imgport}/${props.imagesProduct}`,
          }}
          style={{
            height: 130,
            width: '100%',
            resizeMode: 'cover',
            borderTopRightRadius: 13,
            borderTopLeftRadius: 13,
          }}
        />
        <View
          style={{
            width: '100%',
            height: 70,
            backgroundColor: '#ffb460',
            borderBottomLeftRadius: 13,
            borderBottomRightRadius: 13,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={() => props.onclickProduct()}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontFamily: 'Oswald-VariableFont_wght',
                fontSize: 18,
                paddingLeft: 5,
                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 5,
                // fontWeight: 'bold',
              }}>
              {props.name}
            </Text>
          </TouchableOpacity>

          {/* <Text
            style={{
              color: 'white',
              fontFamily: 'Oswald-VariableFont_wght',
              fontSize: 10,
              paddingLeft: 5,
            }}>
            {props.description}
          </Text> */}
        </View>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Oswald-VariableFont_wght',
              fontSize: 15,
            }}>
            {`${formatCurrency(props.prices)}đ`}
          </Text>
          <View
            style={{
              paddingTop: 6,
              color: 'white',
              fontFamily: 'Oswald-VariableFont_wght',
              fontSize: 15,
            }}>
            <TouchableOpacity onPress={() => props.buyProduct(props)}>
              <FontAwesome5 style={{color: 'white'}} name={'plus'} solid />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    buyProduct: (product_current) => dispatch(buyProduct(product_current)),
  };
};
const mapStateToProps = (state) => {
  return {
    cart: state.cart.cartAr,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductTag);
