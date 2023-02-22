import { useQuery } from "react-query";

const fetchLatestOrder = async (): Promise<LatestOrderDTO> => {
	const res = await fetch(`${process.env.REACT_APP_GetLatestOrderUrl}`, {
		method: "GET",
		// mode: "no-cors", // specify nothing in prop
		mode: "cors", // local
		headers: {
			"Access-Control-Allow-Origin": "http://localhost:3000",
			"Accept": "application/json",
			"Content-Type": "application/json"
		}
	});

	console.log(res);
	const data = await res.json();
	console.log(data);

	return data as LatestOrderDTO;
};

export class LatestOrderDTO {
	public orderDayId: string = "";
	public date: string = "";
	public cutoffTime: string = "";
	public orders: Array<OrderDTO> = [];
}

export class OrderDTO {
	public orderId: string = "";
	public staffId: string = "";
	public staffName: string = "";
	public menuItem: string = "";
}

interface ReturnType {
	latestOrders: LatestOrderDTO;
	isLoading: boolean;
}

export const useFetchLatestOrder = (): ReturnType => {
	const { data, isLoading } = useQuery<LatestOrderDTO>("latestOrder", async () => fetchLatestOrder());

	return {
		latestOrders: data ?? new LatestOrderDTO(),
		isLoading
	};
};
