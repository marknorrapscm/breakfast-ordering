import Countdown from "react-countdown";
import React from "react";

export const CountdownTimer = ({ date }: { date: Date }) => {

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
