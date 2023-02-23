import React, { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { StaffModel } from "./Models/Models";
import { useFetchFormData } from "./Hooks/useFetchFormData";
import { LoadingWrapper } from "./Components/LoadingWrapper";
import { MenuItemSelectList } from "./Components/MenuItemSelectList";
import { useFetchLatestOrder } from "./Hooks/useFetchLatestOrder";
import { OrderListModal } from "./Components/OrderListModal";


function App() {

	const { config, isLoading: isFormDataLoading } = useFetchFormData();
	const { latestOrders, isLoading: isLatestOrdersLoading } = useFetchLatestOrder();
	const [isOrderListModalOpen, setIsOrderListModalOpen] = useState<boolean>(false);

	return (
		<Container className="app py-4">
			<Row>
				<Col>
					<div className="logo-text text-center">
						Tomas Breakfast Ordering
					</div>
					<div className="text-center" style={{ fontSize: "2.5em", marginTop: "-0.4em" }}>🥑🍔🥕</div>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card className="bg-dark pt-4 pb-3 px-5 mt-4">
						<LoadingWrapper isLoading={isFormDataLoading || isLatestOrdersLoading}>
							{config.staff.map((staff: StaffModel) => (
								<Row key={staff.id} className="mb-3 text-center">
									<Col>
										<div className="py-2" style={{ fontSize: "1.25rem" }}>{staff.name}</div>
									</Col>
									<Col>
										<MenuItemSelectList
											staff={staff}
											existingOrder={latestOrders.orders.find(x => x.staffId === staff.id)}
										/>
									</Col>
								</Row>
							))}
						</LoadingWrapper>
					</Card>
				</Col>
			</Row>

			<Row className="mt-2">
				<Col>
					<Button variant="success" onClick={() => setIsOrderListModalOpen(true)}>
						Generate order list
					</Button>
				</Col>
			</Row>

			<OrderListModal
				isOpen={isOrderListModalOpen}
				close={() => setIsOrderListModalOpen(false)}
			/>
		</Container>
	);
}

export default App;
