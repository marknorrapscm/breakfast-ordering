import { useState } from "react";
import { getBaseUrl } from "../Utility/utility";

interface ReturnType {
	isLoading: boolean;
	performPost: (staffId: string, menuItem: string) => Promise<boolean>;
}

const url = `${getBaseUrl()}/Ordering/LatestOrder`;

export const usePostRequest = (): ReturnType => {

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const performPost = async (staffId: string, menuItem: string) => {
		setIsLoading(true);

		const response = await fetch(url, {
			method: "POST",
			mode: "cors",
			headers: {
				"Access-Control-Allow-Origin": "http://localhost:3000",
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				staffId: staffId,
				menuItem: menuItem
			})
		});

		setIsLoading(false);

		return response.status === 200;
	};

	return {
		isLoading,
		performPost: performPost
	};
};
