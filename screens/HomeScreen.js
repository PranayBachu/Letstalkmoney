import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
	SafeAreaView,
	ScrollView,
} from "react-native";
import CustomListItem from "../components/CustomListItem";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { firestore, auth } from "../firebase-services";

const HomeScreen = ({ navigation }) => {
	const [chats, setChats] = useState([]);

	const handleSignOutUser = async () => {
		try {
			await auth.signOut();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const unsubscribe = firestore
			.collection("chats")
			.orderBy("chatName")
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
