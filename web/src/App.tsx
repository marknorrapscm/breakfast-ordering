import React, { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { StaffModel } from "./Models/Models";
import { useFetchFormData } from "./Hooks/useFetchFormData";
import { LoadingWrapper } from "./Components/LoadingWrapper";
import { MenuItemSelectList } from "./Components/MenuItemSelectList";
import { useFetchLatestOrder } from "./Hooks/useFetchLatestOrder";
import { OrderListModal } from "./Components/OrderListModal";
import Countdown from "react-countdown";


function App() {

	const { config, isLoading: isFormDataLoading } = useFetchFormData();
	const { latestOrders, isLoading: isLatestOrdersLoading } = useFetchLatestOrder();
	const [isOrderListModalOpen, setIsOrderListModalOpen] = useState<boolean>(false);

	const countdownDate = new Date(`${latestOrders.date} ${latestOrders.cutoffTime}`);
	const minutesUntilCountdownDate = ((Number(countdownDate) - Number(new Date())) / 1000 / 60);

	return (
		<Container className="app py-4">
			<Row>
				<Col>
					<div className="logo-text text-center" style={{ lineHeight: "1em", marginBottom: "0.25em" }}>
						Tomas Breakfast Ordering
					</div>
					<div className="text-center" style={{ fontSize: "2.5em", marginTop: "-0.4em" }}>🥑🍔🥕</div>
				</Col>
			</Row>

			{latestOrders && latestOrders.date && (
				<Row>
					<Col className="text-center mt-3 fw-bold" style={{ color: "#f5b00f" }}>
						Orders for&nbsp;
						{new Intl.DateTimeFormat("en-US", {
							day: "numeric",
							month: "long",
							year: "numeric"
						}).format(new Date(latestOrders.date))}
					</Col>
				</Row>
			)}

			{!isLatestOrdersLoading && minutesUntilCountdownDate < 60 && minutesUntilCountdownDate > 0 && (
				<Row>
					<Col className="text-center mt-2">
						<CountdownTimer date={countdownDate}/>
					</Col>
				</Row>
			)}

			<Row>
				<Col>
					<Card className="bg-dark pt-4 pb-3 pe-3 mt-3">
						<LoadingWrapper isLoading={isFormDataLoading || isLatestOrdersLoading}>
							{config.staff.map((staff: StaffModel) => (
								<Row key={staff.id} className="mb-3 text-center">
									<Col xs={4} md={6}>
										<div className="py-2" style={{ fontSize: "1.25rem" }}>{staff.name}</div>
									</Col>
									<Col xs={8} md={5}>
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

const CountdownTimer = ({ date }: { date: Date }) => {

	const renderer = ({ hours, minutes, seconds, completed }: { hours: number, minutes: number, seconds: number, completed: boolean }) => {
		if (completed) {
			return <div>You are late!</div>;
		} else {
			return (
				<div style={{ color: "#f5b00f" }}>
					Time left to order:&nbsp;
					{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
				</div>
			);
		}
	};

	return (
		<Countdown date={date} zeroPadTime={2} renderer={renderer}/>
	);
};

export default App;
