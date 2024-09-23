import {
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  StyleSheet,
  Dimensions,
} from 'react-native';

const height = Dimensions.get('window').height;

interface DeleteButtonProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}

export default function DeleteButton({text, onPress}: DeleteButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.2}
      style={styles.button}
      onPress={onPress}>
      <Text style={[styles.buttonText]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#BF1C39',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    height: height < 700 ? 36 : 48,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  buttonText: {
    fontSize: height < 700 ? 14 : 18,
    color: '#BF1C39',
    fontFamily: 'Montserrat-Regular',
  },
});
