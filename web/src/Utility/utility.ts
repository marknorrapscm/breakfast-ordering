export const getBaseUrl = () => {
	const forceUseOfProduction = process.env.ForceUseOfProduction === "true";

	if(process.env.NODE_ENV.includes("dev") && !forceUseOfProduction) {
		return process.env.REACT_APP_BaseUrlDev;
	} else {
		return process.env.REACT_APP_BaseUrl;
	}
};
