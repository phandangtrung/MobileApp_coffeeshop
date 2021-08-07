import React from 'react';
import {SafeAreaView, View, Text, Image} from 'react-native';
function SuccessPage() {
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
      }}>
      <View style={{height: 550}}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 80,
            justifyContent: 'center',
            paddingBottom: 30,
          }}>
          <Image
            source={require('../../img/25794993.jpg')}
            style={{width: 270, height: 250}}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 23,
            fontWeight: 'bold',
            color: '#ffb460',
          }}>
          {'CẢM ƠN BẠN ĐÃ ỦNG HỘ COFFEE SHOP'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default SuccessPage;
