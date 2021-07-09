import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
	SafeAreaView,
	ScrollView,
	Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import CustomListItem from "../components/CustomListItem";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Avatar, Button, Input } from "react-native-elements";
import { firestore, auth, firebase } from "../firebase-services";

const HomeScreen = ({ navigation }) => {
	const [chats, setChats] = useState([]);
	const [chatRoomId, setChatRoomId] = useState("");
	const [isJoining, setIsJoining] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleSignOutUser = async () => {
		try {
			await auth.signOut();
		} catch (error) {
			console.log(error);
		}
	};

	const handleJoinRoom = async () => {
		try {
			setIsJoining(true);
			await firestore
				.collection("chats")
				.doc(chatRoomId)
				.update({
					participants: firebase.firestore.FieldValue.arrayUnion(
						auth.currentUser.uid
					),
				});
			setIsModalVisible(false);
		} catch (error) {
			alert(error);
		} finally {
			setIsJoining(false);
		}
	};

	useEffect(() => {
		const unsubscribe = firestore
			.collection("chats")
			.where("participants", "array-contains", auth.currentUser.uid)
			.onSnapshot((snapshot) => {
				setChats(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						data: doc.data(),
					}))
				);
			});

		return unsubscribe;
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Chatsapp",
			headerStyle: { backgroundColor: "#fff" },
			headerTitleStyle: { color: "black" },
			headerTintColor: "black",
			headerLeft: () => (
				<View style={{ marginLeft: 20 }}>
					<TouchableOpacity activeOpacity={0.5} onPress={handleSignOutUser}>
						<Avatar
							rounded
							source={{
								uri: "https://cdn.iconscout.com/icon/free/png-256/logout-2477642-2061904.png",
							}}
						/>
					</TouchableOpacity>
				</View>
			),
			headerRight: () => (
				<View style={styles.headerRight}>
					<TouchableOpacity activeOpacity={0.5}>
						<AntDesign name="" size={24} color="black" />
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => navigation.navigate("AddChat")}
					>
						<SimpleLineIcons name="plus" size={24} color="black" />
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation]);

	const enterChat = (id, chatName) => {
		navigation.navigate("Chat", {
			id,
			chatName,
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="dark" />
			<Button onPress={() => setIsModalVisible(true)} title="Join Chat" />
			<ScrollView>
				{chats.map(({ id, data: { chatName } }) => (
					<CustomListItem
						key={id}
						id={id}
						chatName={chatName}
						enterChat={enterChat}
					/>
				))}
			</ScrollView>
			<Modal
				transparent={true}
				visible={isModalVisible}
				onDismiss={() => setIsModalVisible(false)}
			>
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "rgba(0,0,0,0.7)",
					}}
				>
					<View
						style={{
							backgroundColor: "white",
							borderRadius: 8,
							width: "80%",
							height: 200,
							padding: 10,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Icon
							name="close"
							style={{ position: "absolute", top: 10, right: 10 }}
							size={20}
							onPress={() => {
								setChatRoomId("");
								setIsModalVisible(false);
							}}
						/>
						<Text
							style={{ marginBottom: 40, fontSize: 20, fontWeight: "bold" }}
						>
							Chat Room
						</Text>
						<Input
							placeholder="Enter Chat Room ID"
							value={chatRoomId}
							onChangeText={setChatRoomId}
							onSubmitEditing={handleJoinRoom}
							style={{ textAlign: "center" }}
						/>
						<Button
							disabled={!chatRoomId}
							onPress={handleJoinRoom}
							title="Join Chat Room"
							loading={isJoining}
						/>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "black",
	},
	headerRight: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: 80,
		marginRight: 20,
	},

	container: {
		height: "100%",
	},
});
