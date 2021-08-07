import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, Image} from 'react-native';
import styles from './style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const ProductCart = (props) => {
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
    <View>
      <View style={styles.cart_tag}>
        <Text numberOfLines={1} style={styles.text_cart}>
          {props.name}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {props.quantity === undefined ? (
              <Text style={styles.text_cart}>{'x 1'}</Text>
            ) : (
              <Text style={styles.text_cart}>{`x ${props.quantity}`}</Text>
            )}
          </View>
          <View style={{flexDirection: 'column', paddingLeft: 5}}>
            <TouchableOpacity onPress={() => props.onincreaseProduct()}>
              <FontAwesome5
                style={{color: 'white', fontSize: 15, color: 'white'}}
                name={'angle-up'}
                solid
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.ondecreaseProduct()}>
              <FontAwesome5
                style={{color: 'white', fontSize: 15, color: 'white'}}
                name={'angle-down'}
                solid
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.text_cart}>{`${formatCurrency(
          props.prices,
        )}đ`}</Text>
        <TouchableOpacity onPress={() => props.ondeleteProduct()}>
          <FontAwesome5
            style={{color: 'white', fontSize: 20, color: 'white'}}
            name={'times'}
            solid
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ProductCart;
// export default connect({}, mapDispatchToProps)(ProductCart);
