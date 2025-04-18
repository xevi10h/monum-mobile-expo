import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Language } from '@/shared/types/Language';
import { useUserStore } from '@/zustand/UserStore';
import { useTranslation } from '@/hooks/useTranslation';
import { SMALL_SCREEN } from '@/shared/variables/constants';
import { Icon } from '@rneui/base';

interface LanguageSelectorProps {
	provisionalLanguage: Language;
	setProvisionalLanguage: (string: Language) => void;
}

interface LanguageSelectorPill {
	label: string;
	value: Language;
}

export default function LanguageSelector({
	provisionalLanguage,
	setProvisionalLanguage,
}: LanguageSelectorProps) {
	const { t } = useTranslation();
	const language = useUserStore((state) => state.user.language);

	useEffect(() => {
		setProvisionalLanguage(language);
	}, [language]);

	const availableLanguages: LanguageSelectorPill[] = [
		{ label: t('languages.en_US'), value: 'en_US' },
		{ label: t('languages.es_ES'), value: 'es_ES' },
		{ label: t('languages.ca_ES'), value: 'ca_ES' },
		{ label: t('languages.fr_FR'), value: 'fr_FR' },
	];

	return (
		<View style={styles.container}>
			<View style={styles.labelContainer}>
				<Text style={styles.labelText}>{t('profile.language')}</Text>
				<Dropdown
					value={provisionalLanguage}
					data={availableLanguages}
					valueField={'value'}
					labelField={'label'}
					onChange={(selectedLanguage: LanguageSelectorPill) => {
						selectedLanguage && setProvisionalLanguage(selectedLanguage.value);
					}}
					style={styles.dropdown}
					maxHeight={200}
					placeholder={t(`languages.${language}`) || ''}
					selectedTextStyle={styles.selectedTextStyle}
					itemTextStyle={styles.itemTextStyle}
					containerStyle={styles.dropdownContainer}
					iconColor="#3F713B"
					renderItem={(item) => (
						<View style={styles.renderItemStyle}>
							<Text
								style={{
									...styles.itemTextStyle,
									fontFamily:
										item.value === provisionalLanguage
											? 'Montserrat-SemiBold'
											: 'Montserrat-Regular',
								}}
							>
								{item.label}
							</Text>
							{item.value === provisionalLanguage && (
								<Icon
									color="#3F713B"
									name="check"
									type="font-awesome"
									size={12}
								/>
							)}
						</View>
					)}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 15,
		marginTop: '2%',
		zIndex: 10,
		position: 'relative',
	},
	labelContainer: {
		width: '100%',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	labelText: {
		fontSize: SMALL_SCREEN ? 12 : 16,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
	},
	dropdown: {
		paddingHorizontal: 15,
		borderColor: '#3F713B3D',
		borderWidth: 2,
		borderRadius: 12,
		height: SMALL_SCREEN ? 36 : 48,
		width: '100%',
		marginVertical: 5,
	},
	dropdownContainer: {
		borderColor: '#3F713B3D',
		borderWidth: 2,
		borderRadius: 12,
	},
	selectedTextStyle: {
		color: '#3F713B',
		fontFamily: 'Montserrat-SemiBold',
		fontSize: SMALL_SCREEN ? 12 : 16,
	},
	itemTextStyle: {
		color: '#3F713B',
		fontSize: SMALL_SCREEN ? 12 : 16,
	},
	renderItemStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
});
