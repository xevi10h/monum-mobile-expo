import React from 'react';
import { View } from 'react-native';

import { styles } from '../../styles/auth/LoginStyles';

export default function SeparatorComponent() {
	return (
		<View style={styles.separatorContainer}>
			<View style={styles.separatorLine} />
			<View style={styles.separatorCircle} />
			<View style={styles.separatorLine} />
		</View>
	);
}
