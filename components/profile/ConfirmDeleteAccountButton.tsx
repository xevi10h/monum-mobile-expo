import {
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';

interface ConfirmDeleteAccountButtonProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}

export default function ConfirmDeleteAccountButton({
  text,
  onPress,
}: ConfirmDeleteAccountButtonProps) {
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
    backgroundColor: '#BF1C39',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
});
