import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { firestore } from "../firebase-services";
import Icon from "react-native-vector-icons/FontAwesome";

const CustomListItem = ({ id, chatName, enterChat }) => {
	const [chatMessages, setChatMessages] = useState([]);
	useEffect(() => {
		const unsubscribe = firestore
			.collection("chats")
			.doc(id)
			.collection("messages")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) =>
				setChatMessages(snapshot.docs.map((doc) => doc.data()))
			);

		return unsubscribe;
	}, []);

	return (
		<ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
			<Avatar
				rounded
				source={{
					uri: "https://img.pngio.com/computer-icons-user-clip-art-transparent-user-icon-png-1742152-user-logo-png-920_641.png",
				}}
			/>
			<ListItem.Content>
				<ListItem.Title style={{ fontWeight: "800" }}>
					{chatName}
				</ListItem.Title>

				<ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
					{chatMessages?.[0]?.message}
				</ListItem.Subtitle>
			</ListItem.Content>
			<Icon
				onPress={() => {
					Alert.alert("Chat Room ID", id);
				}}
				size={25}
				name="share-square-o"
			/>
		</ListItem>
	);
};

export default CustomListItem;
