import { useState } from "react";

interface ReturnType {
	isLoading: boolean;
	performPost: (staffId: string, menuItem: string) => Promise<boolean>;
}

export const usePostRequest = (): ReturnType => {

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const performPost = async (staffId: string, menuItem: string) => {
		setIsLoading(true);

		const response = await fetch(`${process.env.REACT_APP_AddOrderUrl}`, {
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
