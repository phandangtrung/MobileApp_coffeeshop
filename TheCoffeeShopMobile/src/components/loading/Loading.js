import {View, Image} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native';

const Loading = () => (
  <SafeAreaView
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}>
    <Image
      source={require('../../img/48e303bf57f8ad627c73a0e0e30f5f33.gif')}
      style={{width: 200, height: 200}}
    />
  </SafeAreaView>
);
export default Loading;
