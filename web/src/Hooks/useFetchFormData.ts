import { MenuItemModel, StaffModel } from "../Models/Models";
import { useQuery } from "react-query";

const fetchFormData = async (): Promise<ConfigDTO> => {
	const res = await fetch(`${process.env.REACT_APP_GetFormDataUrl}`, {
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

	return data as ConfigDTO;
};

export class ConfigDTO {
	public staff: Array<StaffModel> = [];
	public menuItems: Array<MenuItemModel> = [];
}

interface ReturnType {
	config: ConfigDTO;
	isLoading: boolean;
}

export const useFetchFormData = (): ReturnType => {
	const { data, isLoading } = useQuery<ConfigDTO>("formData", async () => fetchFormData());

	return {
		config: data ?? new ConfigDTO(),
		isLoading
	};
};
