import { StatusBar, Text, View } from "react-native";
import { styles } from "./styles";

export function Home() {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>Hello, World</Text>
      </View>

      <StatusBar barStyle="light-content" />
    </>
  )
}