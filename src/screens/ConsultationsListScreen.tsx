import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Button, Center, FlatList, Text, Textarea, Select, CheckIcon } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type ConsultationsListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConsultationsList'>;

type Props = {
  navigation: ConsultationsListScreenNavigationProp;
};

const ConsultationsListScreen = ({ navigation }: Props) => {
  const [consultations, setConsultations] = useState([]);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Obter o token JWT e os dados do usuário
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(response.data.username);
      setRole(response.data.role);

      // Obter as consultas do backend
      const consultationsResponse = await axios.get('http://localhost:3000/consultas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsultations(consultationsResponse.data);
    };
    fetchUserData();
  }, []);

  const handleEditConsultation = (consultationId: string) => {
    // Implementação da ação de edição para admin
    navigation.navigate('EditConsultation', { consultationId });
  };

  const handleRequestChange = (consultationId: string) => {
    // Implementação da solicitação de alteração para usuário comum
    alert(`Solicitação de alteração enviada para consulta ${consultationId}`);
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="white">
        <Box>
          <Text>Bem-vindo, {username} ({role})</Text>
          <FlatList
            data={consultations}
            renderItem={({ item }) => (
              <Box borderBottomWidth="1" mb={4} p={2}>
                <Text>Consulta com {item.doctor}</Text>
                <Text>Data: {item.date}</Text>
                <Text>Status: {item.status}</Text>
                
                {role === 'admin' ? (
                  <Button mt={2} onPress={() => handleEditConsultation(item.id)}>
                    Editar Consulta
                  </Button>
                ) : (
                  <>
                    <Textarea placeholder="Descreva sua solicitação" mt={2} />
                    <Button mt={2} onPress={() => handleRequestChange(item.id)}>
                      Solicitar Alteração
                    </Button>
                  </>
                )}
              </Box>
            )}
            keyExtractor={(item) => item.id}
          />
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default ConsultationsListScreen;