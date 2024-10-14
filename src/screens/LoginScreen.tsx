import React, { useState } from 'react';
import { NativeBaseProvider, Box, Button, Input, Center } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Alert as RNAlert } from 'react-native'; // Importar o Alert do React Native
import { login } from '../api/auth'; // Importe a função de login que você já criou
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const token = await login(username, password);  // Faz login e obtém o token
      console.log('Token:', token);
      
      // Armazena o token no AsyncStorage
      await AsyncStorage.setItem('token', token);
      
      RNAlert.alert('Login realizado com sucesso!');
      navigation.navigate('ConsultationsList');  // Navega para a lista de consultas
    } catch (err: unknown) {
      if (err instanceof Error) {
        RNAlert.alert('Erro', err.message);
      } else {
        RNAlert.alert('Erro', 'Ocorreu um erro inesperado.');
      }
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="white">
        <Box>
          <Input
            placeholder="Usuário"
            mb={4}
            value={username}
            onChangeText={setUsername}
          />
          <Input
            placeholder="Senha"
            mb={4}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button onPress={handleLogin}>
            Entrar
          </Button>
          <Button onPress={() => navigation.navigate('SignUp')} mt={4}>
            Cadastrar
          </Button>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default LoginScreen;
