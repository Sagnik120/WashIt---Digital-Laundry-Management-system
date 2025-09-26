export const Regex = {
	mobileNumberRegex: /^[1-9]{1}[0-9]{9}$/,
	validMobileNumber: /^([0]|\+91)?[6789]\d{9}$/,
	passportRegex: /^[A-Za-z][0-9]{7}$/g,
	panRegex:
		/^([a-zA-Z]([a-zA-Z]([a-zA-Z]([a-zA-Z]([a-zA-Z]([0-9]([0-9]([0-9]([0-9]([a-zA-Z])?)?)?)?)?)?)?)?)?)?$/g,
	indiaRegex: /^[6-9]\d{9}$/,
	uaeRegex: /^[0-9]{9}$/,
	bangladeshRegex: /^01[3-9]\d{8}$/,
	emailRegex:
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	fullNameRegex:
		/^[a-zA-Z][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-][a-zA-Z\s]+$/,
	// pinCodeRegex: /^[1-9][0-9]{5}$/
	pinCodeRegex: /^(?!0+$)([0-9]{4}|[0-9]{6})$/,
	webSiteURL: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
	videoURL: /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm,
	isLetters: /^[A-Za-z\s]*$/,
	isInteger: /[^0-9]/,
	onlySpace: '/^s*$/',
	ifscCode: '^[A-Z]{4}0[A-Z0-9]{6}$',
	msmeNumberRegex: /^\d{12}$/,
	accountNumberRegex: /^\d{9,18}$/,
};
