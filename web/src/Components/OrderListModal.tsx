import React, { useState, useEffect } from "react";
import { Badge, Button, Col, ListGroup, Modal, Row } from "react-bootstrap";
import { useGenerateOrderList } from "../Hooks/useGenerateOrderList";
import { LoadingWrapper } from "./LoadingWrapper";

interface Props {
	isOpen: boolean;
	close: () => void;
}

export const OrderListModal = ({ isOpen, close }: Props) => {

	const {
		fetchOrderList,
		orderList,
		isLoading
	} = useGenerateOrderList();

	useEffect(() => {
		if(isOpen) {
			fetchOrderList();
		}
	}, [isOpen]);

	const getMenuItemFrequency = (menuItem: string): string => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return orderList[menuItem].toString();
	};

	return (
		<Modal show={isOpen} bg="dark" onHide={close} backdrop="static" centered animation={true}>
			<Modal.Header
				closeButton
				className="fw-bold py-3"
				style={{
					color: "#333",
					fontWeight: "bold",
					paddingRight: "1.5em",
					fontSize: "1.25em"
				}}
			>
				Generated order list
			</Modal.Header>

			<Modal.Body style={{ color: "#333" }}>
				<LoadingWrapper isLoading={isLoading}>
					<ListGroup>
						{Object.keys(orderList).map((menuItem: string) => (
							<ListGroup.Item
								key={`${menuItem}-order-list`}
								className="d-flex border-0 justify-content-center align-items-start py-3 px-4"
							>
								<div className="me-3">{menuItem}</div>
								<Badge bg="success" pill style={{ fontSize:"0.9em" }}>
									{getMenuItemFrequency(menuItem)}
								</Badge>
							</ListGroup.Item>
						))}
					</ListGroup>
				</LoadingWrapper>
			</Modal.Body>

			<Modal.Footer>
				<Button
					variant="success fw-bold"
					onClick={() => fetchOrderList()}
				>
					Reload
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
