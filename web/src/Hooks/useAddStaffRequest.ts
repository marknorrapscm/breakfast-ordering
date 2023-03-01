import { getBaseUrl } from "../Utility/utility";
import { useState } from "react";

const url = `${getBaseUrl()}/Config/Staff`;

interface ReturnType {
	addStaff: (staffCsv: string) => void,
	isLoading: boolean;
}

export const useAddStaffRequest = (): ReturnType => {

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const addStaff = async (staffCsv: string) => {
		setIsLoading(true);

		const response = await fetch(url, {
			method: "POST",
			// mode: "no-cors", // specify nothing in prop
			mode: "cors", // local
			headers: {
				"Access-Control-Allow-Origin": "http://localhost:3000",
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				staffNames: staffCsv
			})
		});

		const res = await response.json();

		setIsLoading(false);
	};

	return {
		isLoading,
		addStaff
	};
};
