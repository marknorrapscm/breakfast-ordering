import { useFetchFormData } from "../Hooks/useFetchFormData";
import { Button, Form, Spinner } from "react-bootstrap";
import { MenuItemModel, StaffModel } from "../Models/Models";
import React, { useState } from "react";
import { usePostRequest } from "../Hooks/usePostRequest";

const defaultSelectText = "Select...";

interface Props {
	staff: StaffModel;
	selectedItem?: string;
}

const postData = async () => {
	//
};

export const MenuItemSelectList = ({ staff, selectedItem }: Props) => {

	const { config } = useFetchFormData();
	const [hasSelectionBeenMade, setHasSelectionBeenMade] = useState<boolean>(selectedItem !== "" && selectedItem !== undefined);
	const { isLoading, performPost } = usePostRequest();

	const onSelectChange = async (staffId: string, menuItem: string) => {
		const res = await performPost(staff.id, menuItem);
		setHasSelectionBeenMade(res);
	};

	const getButtonVariant = () => {
		if(isLoading) {
			return "secondary";
		}

		return hasSelectionBeenMade
			? "success"
			: "secondary";
	};

	return (
		<div className="d-flex">
			<Form.Select
				size="lg"
				defaultValue={defaultSelectText}
				style={{
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0
				}}
				onChange={(e) => {
					onSelectChange(staff.id, e.target.value);
				}}
			>
				<option disabled>{defaultSelectText}</option>

				{config.menuItems.map((menuItem: MenuItemModel) => (
					<option
						key={menuItem.id}
					>
						{menuItem.id}
					</option>
				))}
			</Form.Select>

			<Button
				variant={getButtonVariant()}
				style={{
					borderTopLeftRadius: 0,
					borderBottomLeftRadius: 0,
					minWidth: "42px"
				}}
			>
				{isLoading ? (
					<Spinner size="sm" />
				) : hasSelectionBeenMade ? "✔" : "..."}
			</Button>
		</div>
	);
};

