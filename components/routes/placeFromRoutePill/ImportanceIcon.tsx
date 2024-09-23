export function ImportanceIcon(importance: number) {
	const importanceIcon = () => {
		switch (importance) {
			case 1:
				return require('@/assets/images/place_pre_detail_importance_1.png');
			case 2:
				return require('@/assets/images/place_pre_detail_importance_2.png');
			case 3:
				return require('@/assets/images/place_pre_detail_importance_3.png');
			default:
				return require('@/assets/images/place_pre_detail_importance_1.png');
		}
	};
	return importanceIcon();
}
