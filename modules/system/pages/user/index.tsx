import { Input } from "antd";

import { BasicContent } from "#src/components/basic-content";

export default function User() {
	return (
		<BasicContent>
			<h1>User</h1>
			<Input placeholder="Enter your username" />
		</BasicContent>
	);
}
