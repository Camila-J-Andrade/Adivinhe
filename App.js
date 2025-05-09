import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, Modal, FlatList, ScrollView } from "react-native";


export default function JogoAdivinhacao() {
  const [numeroSorteado, setNumerosorteado] = useState(Math.floor(Math.random() * 101));
  const [palpite, setPalpite] = useState("");
  const [tentativas, setTentativas] = useState(0);
  const [mensagem, setMensagem] = useState("Adivinhe o número!");
  const [emoji, setEmoji] = useState("🤔");
  const [nomeJogador, setNomeJogador] = useState("");
  const [ranking, setRanking] = useState(Array(10).fill({ nome: "-", tentativas: Infinity }));
  const [mostrarModal, setMostrarModal] = useState(false);

  const aoChutar = () => {
    const palpiteConvertido = parseInt(palpite);

    if (isNaN(palpiteConvertido)) {
      setMensagem("Digite um número válido");
      setEmoji("😕");
      return;
    }

    const novasTentativas = tentativas + 1;
    setTentativas(novasTentativas);

    if (palpiteConvertido === numeroSorteado) {
      setMensagem(`🎉 Você acertou! Foram necessárias ${novasTentativas} tentativas. O número sorteado era ${numeroSorteado}.`);
      setEmoji("😄");
      verificarRanking(novasTentativas);
    } else if (palpiteConvertido < numeroSorteado) {
      setMensagem("😢 Você errou, o número é maior!");
      setEmoji("😟");
    } else {
      setMensagem("😢 Você errou, o número é menor!");
      setEmoji("😟");
    }

    setPalpite("");
  };

  const verificarRanking = (tentativasAtual) => {
    const indice = ranking.findIndex((entry) => tentativasAtual < entry.tentativas);
    if (indice !== -1) {
      setMostrarModal(true);
    }
  };

  const salvarNoRanking = () => {
    const novoRanking = [...ranking];
    novoRanking.push({ nome: nomeJogador, tentativas: tentativas });
    novoRanking.sort((a, b) => a.tentativas - b.tentativas);
    setRanking(novoRanking.slice(0, 10));
    setMostrarModal(false);
    setNomeJogador("");
  };

  const recomecarJogo = () => {
    setNumerosorteado(Math.floor(Math.random() * 101));
    setPalpite("");
    setTentativas(0);
    setMensagem("Adivinhe o número!");
    setEmoji("🤔");
  };

  return (
    <ScrollView style={estilos.container}>
      <View>
        {/* <Image source={require("./assets/adivinha.png")} style={estilos.logo} /> */}

        <Text style={estilos.titulo}> 🎯 Qual o número?</Text>
        <Text style={estilos.txt}>
          Tente adivinhar o número que o sistema sorteou entre 1 e 100
        </Text>
        <Text style={estilos.mensagem}>{mensagem}</Text>
        <Text style={estilos.emoji}>{emoji}</Text>

        {mensagem.startsWith("🎉") ? (
          <Button title="Recomeçar Jogo" color="#32CD32" onPress={recomecarJogo} />
        ) : (
          <View>
            <TextInput
              style={estilos.input}
              keyboardType="numeric"
              placeholder="Digite um número"
              value={palpite}
              onChangeText={setPalpite}
            />
            <Button title="Acho que é esse!" color="#FF4500" onPress={aoChutar} />
          </View>
        )}

        <Modal visible={mostrarModal} transparent={true} animationType="slide">
          <View style={estilos.modalContainer}>
            <View style={estilos.modal}>
              <Text style={estilos.modalTitulo}>🎉 Novo top 10!</Text>
              <TextInput
                style={estilos.input}
                placeholder="Digite seu nome"
                value={nomeJogador}
                onChangeText={setNomeJogador}
              />
              <Button title="Salvar" onPress={salvarNoRanking} />
            </View>
          </View>
        </Modal>

        {ranking.some((item) => item.nome !== "-" && item.tentativas !== Infinity) && (
          <View style={estilos.boxRanking}>
            <Text style={estilos.titulo}>🏆 Ranking</Text>
            <FlatList
              data={ranking.filter((item) => item.nome !== "-" && item.tentativas !== Infinity)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <Text style={estilos.ranking}>
                  {index + 1}. {item.nome} - {item.tentativas} tentativas
                </Text>
              )}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEFA",
  },
  logo: {
    width: "90%",
    height: 150,
    marginTop: 25,
    marginBottom: 20,
    resizeMode: "contain",
    alignSelf: "center",
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#32CD32",
    marginBottom: 10,
    textAlign: "center",
  },
  mensagem: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
    color: "#FF8000",
  },
  emoji: {
    fontSize: 40,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#FF6347", // corrigido
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "80%",
    backgroundColor: "#FFEBAD", // corrigido
    alignSelf: "center",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  boxRanking: {
    marginTop: 15,
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 40,
  },
  ranking: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
  },
  txt: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: "center",
  },
});