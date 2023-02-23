import { getBaseUrl } from "../Utility/utility";
import { useState } from "react";

const url = `${getBaseUrl()}/Ordering/LatestOrder/OrderList`;

interface ReturnType {
	fetchOrderList: () => void,
	orderList: object;
	isLoading: boolean;
}

export const useGenerateOrderList = (): ReturnType => {

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [orderList, setOrderList] = useState<object>({});

	const fetchOrderList = async () => {
		setIsLoading(true);

		const res = await fetch(url, {
			method: "GET",
			// mode: "no-cors", // specify nothing in prop
			mode: "cors", // local
			headers: {
				"Access-Control-Allow-Origin": "http://localhost:3000",
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		});

		const data = await res.json();

		setOrderList(data ?? {});
		setIsLoading(false);
	};

	return {
		fetchOrderList,
		orderList,
		isLoading
	};
};
