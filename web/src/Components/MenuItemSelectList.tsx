import { useFetchFormData } from "../Hooks/useFetchFormData";
import { Button, Form, Spinner } from "react-bootstrap";
import { MenuItemModel, StaffModel } from "../Models/Models";
import React, { useState } from "react";
import { usePostRequest } from "../Hooks/usePostRequest";
import { OrderDTO } from "../Hooks/useFetchLatestOrder";

const defaultSelectText = "Select...";

interface Props {
	staff: StaffModel;
	existingOrder: OrderDTO | undefined;
}

const postData = async () => {
	//
};

class MenuWithOptGroups {
	optGroup: string = "";
	menuItems: Array<MenuItemModel> = [];

	constructor(optGroup: string) {
		this.optGroup = optGroup;
	}
}

export const MenuItemSelectList = React.memo(({ staff, existingOrder }: Props) => {

	if(existingOrder) {
		console.log(existingOrder.menuItem);
	}

	const { config } = useFetchFormData();

	const [selectedMenuItem, setSelectedMenuItem] = useState<string | undefined>(existingOrder?.menuItem);

	const [menuItemsWithOptGroups, setMenuItemsWithOptGroups] = useState<Array<MenuWithOptGroups>>([]);

	const [hasSelectionBeenMade, setHasSelectionBeenMade] = useState<boolean>(existingOrder !== undefined);

	const { isLoading, performPost } = usePostRequest();

	React.useEffect(() => {
		const optGroups = [
			new MenuWithOptGroups("Sodas"),
			new MenuWithOptGroups("Baps")
		];

		if(config && config.menuItems) {
			config.menuItems.forEach(x => {
				const indexToUse = x.id.includes("soda") ? 0 : 1;
				optGroups[indexToUse].menuItems.push(x);
			});

			setMenuItemsWithOptGroups(optGroups);
		}
	}, [config]);

	const onSelectChange = async (staffId: string, menuItem: string) => {
		setSelectedMenuItem(menuItem);
		const res = await performPost(staff.id, menuItem);
		setHasSelectionBeenMade(res);

		if(!res) {
			console.error("Something went wrong saving the menu item");
		}
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
				value={selectedMenuItem}
				style={{
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0
				}}
				onChange={(e) => {
					onSelectChange(staff.id, e.target.value);
				}}
			>
				<option value={""} hidden>
					{defaultSelectText}
				</option>

				{menuItemsWithOptGroups.map(x => (
					<optgroup key={x.optGroup} label={x.optGroup}>
						{x.menuItems.map(menuItem => (
							<option
								key={menuItem.id}
								value={menuItem.id}
							>
								{menuItem.id}
							</option>
						))}
					</optgroup>
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
});

