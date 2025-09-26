import { createTheme } from '@mui/material/styles';

// Create a theme instance.

export const defaultPrimaryColor = '#2055A5';
export const defaultWarningColor = '#CCAB00';
export const defaultbgLightWarningColor = '#FBBD1B';
export const defaultExtraDarkWarningColor = '#E28E0C';
export const defaultInfoColor = '#2F80ED';
export const defaultBgLightBlue = '#86B6FF';
export const defaultBgLightBlue2 = '#EFF5FF';
export const defaultBgLightGray = '#FAFAFA';
export const defaultBgLightExtraGray = '#D9D9D9';
export const defaultBgLightWhite = '#FFFFFF';
export const defaultBgRejectColor = '#E11D48';
export const defaultBgSuccessColor = '#2CAE4A';
export const defaultBgBlueColor = '#346EC7';
export const defaultBgDarkBlue = '#062A61';
export const defaultBgGray = '#94A3B8';
export const defaultBgDarkGray = '#434343';
export const textSecondary2 = '#8692A6';
export const defaultBgBlack = '#141414';
export const defaultBgDarkBlack = '#222222';
export const defaultBgLightBlack = '#B6B6B6';
export const defaultBackgroundColor = '#CCCCCC';
export const defaultBgDarkCyan = '#1ba39c1a';
export const defaultBgPurple = '#646CE1';
export const defaultBgTrendRed = '#FDE8EB';
export const defaultBgTrendOrange = '#FFF5E5';
export const defaultBgLightGreen = '#70CC4A';
export const defaultBgTrendGreen = '#469D22';
export const defaultSkyBlue = '#4C8AE9';
export const defaultdarkSkyBlue = '#EBF4FF';
export const defaultDisableIcon = '#858585';
export const buttonTextColor = '#6C7275';
export const errorColor = '#96020b';
export const defaultDeepBlue = '#0F172A';
export const defaultBgGray2 = '#475569';
export const defaultGrayColor = '#334155';
export const defaultBgBlueColorTwo = '#1565D8';
export const defaultBgWhiteColorTwo = '#F8FAFC';
export const primaryLight = '#6B93D3';

export const defaultFontFamily = 'Inter';

export const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: defaultPrimaryColor,
			light: {
				main: primaryLight,
			},
		},
		warning: {
			main: defaultWarningColor,
		},
		bgLightWarning: {
			main: defaultbgLightWarningColor,
		},
		bgDarkWarning: {
			main: defaultExtraDarkWarningColor,
		},
		info: {
			main: defaultInfoColor,
		},
		bgLightBlue: {
			main: defaultBgLightBlue,
		},
		bgLightBlue2: {
			main: defaultBgLightBlue2,
		},
		bgLightGray: {
			main: defaultBgLightGray,
		},
		bgLightExtraGray: {
			main: defaultBgLightExtraGray,
		},
		bgWhite: {
			main: defaultBgLightWhite,
		},
		error: {
			main: defaultBgRejectColor,
		},
		bgSuccess: {
			main: defaultBgSuccessColor,
		},
		bgGray: {
			main: defaultBgGray,
		},
		bgDarkGray: {
			main: defaultBgDarkGray,
		},
		bgBlue: {
			main: defaultBgBlueColor,
		},
		bgDarkBlue: {
			main: defaultBgDarkBlue,
		},
		bgBlack: {
			main: defaultBgBlack,
			secondary: '#181A1B',
		},
		bgDarkBlack: {
			main: defaultBgDarkBlack,
		},
		bgLightBlack: {
			main: defaultBgLightBlack,
		},
		bgLightGreen: {
			main: defaultBgLightGreen,
		},
		bgTrendGreen: {
			main: defaultBgTrendGreen,
		},
		bgTrendRed: {
			main: defaultBgTrendRed,
		},
		backgroundDefaultColor: {
			main: defaultBackgroundColor,
		},
		bgCyan: {
			main: defaultBgDarkCyan,
		},
		bgPurple: {
			main: defaultBgPurple,
		},
		bgTrendOrange: {
			main: defaultBgTrendOrange,
		},
		bgSkyBlue: {
			main: defaultSkyBlue,
		},
		deepBlue: {
			main: defaultDeepBlue,
		},
		bgGray2: {
			main: defaultBgGray2,
		},
		grayColor: {
			main: defaultGrayColor,
		},
		blueColorTwo: {
			main: defaultBgBlueColorTwo,
		},
		bgWhiteColorTwo: {
			main: defaultBgWhiteColorTwo,
		},
		bglightBlue: {
			main: defaultdarkSkyBlue,
		},
		disable: {
			main: defaultDisableIcon,
		},
		background: { default: defaultBgLightWhite },
		text: {
			main: defaultBgDarkBlack,
			primary: defaultBgBlack,
			secondary: defaultBgDarkGray,
			secondary2: textSecondary2,
		},
		deviderColor: {
			main: '#6c717480',
		},
		borderColor: {
			main: '#343839',
		},
	},
	typography: {
		button: {
			textTransform: 'none',
		},
		fontFamily:
			"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
		fontStyle: 'normal',
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableTouchRipple: true,
			},
		},
	},
});

export const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: defaultPrimaryColor,
		},
		warning: {
			main: defaultWarningColor,
		},
		bgLightWarning: {
			main: defaultbgLightWarningColor,
		},
		bgDarkWarning: {
			main: defaultExtraDarkWarningColor,
		},
		info: {
			main: defaultInfoColor,
		},
		bgLightBlue: {
			main: defaultBgLightBlue,
		},
		bgLightBlue2: {
			main: defaultBgLightBlue2,
		},
		bgLightGray: {
			main: defaultBgLightGray,
		},
		bgGray2: {
			main: defaultBgGray2,
		},
		bgLightExtraGray: {
			main: defaultBgLightExtraGray,
		},
		bgWhite: {
			main: defaultBgLightWhite,
		},
		error: {
			main: defaultBgRejectColor,
		},
		bgSuccess: {
			main: defaultBgSuccessColor,
		},
		bgGray: {
			main: defaultBgGray,
		},
		bgDarkGray: {
			main: defaultBgDarkGray,
		},
		bgBlue: {
			main: defaultBgBlueColor,
		},
		bgDarkBlue: {
			main: defaultBgDarkBlue,
		},
		bgBlack: {
			main: defaultBgBlack,
			secondary: '#181A1B',
		},
		bgDarkBlack: {
			main: defaultBgDarkBlack,
		},
		bgLightBlack: {
			main: defaultBgLightBlack,
		},
		bgLightGreen: {
			main: defaultBgLightGreen,
		},
		bgTrendGreen: {
			main: defaultBgTrendGreen,
		},
		bgTrendRed: {
			main: defaultBgTrendRed,
		},
		backgroundDefaultColor: {
			main: defaultBackgroundColor,
		},
		bgCyan: {
			main: defaultBgDarkCyan,
		},
		bgPurple: {
			main: defaultBgPurple,
		},
		bgTrendOrange: {
			main: defaultBgTrendOrange,
		},
		bgSkyBlue: {
			main: defaultSkyBlue,
		},
		bglightBlue: {
			main: defaultdarkSkyBlue,
		},
		disable: {
			main: defaultDisableIcon,
		},
	},
	typography: {
		button: {
			textTransform: 'none',
		},
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableTouchRipple: true,
			},
		},
	},
});
