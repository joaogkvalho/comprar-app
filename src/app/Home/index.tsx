import { Button } from "@/components/Button";
import { Filter } from "@/components/Filter";
import { Input } from "@/components/Input";
import { Item } from "@/components/Item";
import { itemsStorage, ItemStorage } from "@/storage/itemsStorage";

import { FilterStatus } from "@/types/FilterStatus";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]

export function Home() {
  const [filter, setFilter] = useState(FilterStatus.PENDING)
  const [description, setDescription] = useState("")
  const [items, setItems] = useState<ItemStorage[]>([])

  async function handleAdd() {
    if (!description.trim()) {
      return Alert.alert("Adicionar", "Informe a descrição para adicionar.")
    }

    const newItem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: FilterStatus.PENDING
    }

    await itemsStorage.add(newItem)
    await itemsByStatus()

    setFilter(FilterStatus.PENDING)
    Alert.alert("Adicionado", `Adicionado ${description}`)
    setDescription("")
  }

  async function itemsByStatus() {
    try {
      const response = await itemsStorage.getByStatus(filter)
      setItems(response)
    } catch (err) {
      console.log(err)
      Alert.alert("Erro", "Não foi possível filtrar os itens")
    }
  }

  async function handleRemove(id: string) {
    try {
      await itemsStorage.remove(id)
      await itemsByStatus()
    } catch (err) {
      console.log(err)
      Alert.alert("Remover", "Não foi possível remover.")
    }
  }

  function handleClear() {
    Alert.alert("Limpar", "Deseja remover todos?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => onClear() }
    ])
  }

  async function onClear() {
    try {
      await itemsStorage.clear()
      setItems([])
    } catch (err) {
      console.log(err)
      Alert.alert("Erro", "Não foi possível remover todos os itens")
    }
  }

  async function handleToggleItemStatus(id: string) {
    try {
      await itemsStorage.toggleStatus(id)
      await itemsByStatus()
    } catch (err) {
      console.log(err)
      Alert.alert("Erro", "Não foi possível atualizar o status.")
    }
  }

  useEffect(() => {
    itemsByStatus()
  }, [filter])

  return (
    <View style={styles.container}>
      <Image 
        source={require("@/assets/logo.png")} 
        style={styles.logo} 
      />

     <View style={styles.form}>
      <Input 
        placeholder="O que você precisa comprar?"
        value={description}
        onChangeText={setDescription} 
      />
      <Button title="Adicionar" onPress={handleAdd} />
     </View>

     <View style={styles.content}>
      <View style={styles.header}>
        {FILTER_STATUS.map((status) => (
          <Filter 
            key={status} 
            status={status}
            isActive={status === filter}
            onPress={() => setFilter(status)} 
          />
        ))}

        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearText} onPress={handleClear}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={items}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => <Text style={styles.empty}>Nenhum item aqui.</Text>}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Item 
            data={item}
            onStatus={() => handleToggleItemStatus(item.id)}
            onRemove={() => handleRemove(item.id)}
          />
        )}
      />
     </View>
    </View>
  )
}