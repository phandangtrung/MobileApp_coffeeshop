import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  banner: {
    height: 100,
    width: 250,
    paddingLeft: 30,
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
    color: '#fbd493',
    fontFamily: 'Oswald-VariableFont_wght',
    fontWeight: 'bold',
  },
  ads_content: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'sans-serif-thin',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  navigationContainer: {
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
});

export default styles;
