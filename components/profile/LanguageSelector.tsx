import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Language } from '@/shared/types/Language';
import { useUserStore } from '@/zustand/UserStore';
import { useTranslation } from '@/hooks/useTranslation';

interface LanguageSelectorProps {
	setProvisionalLanguage: (string: Language) => void;
}

interface LanguageSelectorPill {
	label: string;
	value: Language;
}

export default function LanguageSelector({
	setProvisionalLanguage,
}: LanguageSelectorProps) {
	const { t } = useTranslation();
	const language = useUserStore((state) => state.user.language);
	useEffect(() => {
		setValue(language);
	}, [language]);

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(language);

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
				<DropDownPicker
					open={open}
					value={value}
					items={availableLanguages}
					setOpen={setOpen}
					setValue={setValue}
					onChangeValue={(selectedLanguage: Language | null) => {
						selectedLanguage && setProvisionalLanguage(selectedLanguage);
					}}
					style={styles.dropDown}
					dropDownContainerStyle={styles.dropDownContainer}
					textStyle={styles.dropDownText}
					disableBorderRadius={true}
					placeholder={t(`languages.${language}`) || ''}
					labelStyle={styles.dropDownLabel}
					selectedItemLabelStyle={styles.dropDownSelectedItemLabel}
					listItemLabelStyle={styles.dropDownListItemLabel}
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
		fontSize: 16,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
	},
	dropDownContainer: {
		paddingHorizontal: 5,
		borderColor: '#3F713B3D',
	},
	dropDown: {
		paddingHorizontal: 15,
		borderColor: '#3F713B3D',
		borderWidth: 2,
		borderRadius: 12,
		height: 48,
		marginVertical: 5,
	},

	dropDownText: {
		fontSize: 16,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
		fontWeight: '400',
	},
	dropDownLabel: {
		fontSize: 16,
		color: '#3F713B',
		fontFamily: 'Montserrat-SemiBold',
		fontWeight: '600',
	},
	dropDownSelectedItemLabel: {
		fontFamily: 'Montserrat-SemiBold',
		fontWeight: '600',
	},
	dropDownListItemLabel: {
		fontWeight: '400',
	},
});
