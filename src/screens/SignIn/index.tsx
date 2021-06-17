import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';

import theme from '../../styles/theme';

import { database } from '../../database';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Footer,
  Form,
} from './styles';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
  const { signIn } = useAuth();

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
  
        password: Yup.string()
          .required('A senha é obrigatória')
      });
  
      await schema.validate({ email, password });

      signIn({ email, password });
    } catch (error) {
       if(error instanceof Yup.ValidationError){
        Alert.alert('Opa', error.message)
       } else {
        Alert.alert('Erro na autenticação', 
        'Ocorreu um erro ao fazer login, verifique as credencias')
       }
    }
  }

  async function handleNewAccount() {
    navigation.navigate('SignUpFirstStep');
  }

  useEffect(() => {
    async function loadData() {
      const userCollection = database.get('users');
      
      const users = await userCollection.query().fetch();
      console.log(users)
    }
    loadData();
  }, []);

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
        <StatusBar 
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <Header>
          <Title>
            Estamos
            {'\n'}quase lá.
          </Title>
          <SubTitle>
            Faça seu login para começar{'\n'}
            uma experiência incrível.
          </SubTitle>
        </Header>

      <Form>
          <Input 
            iconName="mail"
            placeholder="E-mail"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
          <PasswordInput 
            iconName="lock"
            placeholder="Senha"
            onChangeText={setPassword}
            value={password}
          />
      </Form>

        <Footer>
          <Button 
            title="Login"
            onPress={handleSignIn}
            enabled={true}
            loading={false}
          />
          <Button 
            title="Criar conta gratuita"
            onPress={handleNewAccount}
            color={theme.colors.background_secondary}
            enabled={true}
            loading={false}
            light
          />
        </Footer>
      </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}