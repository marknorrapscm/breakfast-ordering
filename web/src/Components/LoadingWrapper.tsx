import React from "react";
import { Spinner } from "react-bootstrap";

interface Props {
	children: any;
	isLoading: boolean;
}

export const LoadingWrapper = ({ children, isLoading }: Props) => {
	return (
		<>
			{isLoading ? (
				<div className="text-center w-100">
					<Spinner />
				</div>
			) : (
				children
			)}
		</>
	);
};
