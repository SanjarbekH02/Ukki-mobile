import { Image, StyleSheet, View } from 'react-native';

const U3Step12 = ({ next }) => {

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/unit-3/unit-2-step-12.jpg')} 
        style={styles.image} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default U3Step12;